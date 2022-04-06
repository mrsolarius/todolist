import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TodolistEncapsulateService} from "../../todo/todolist-encapsulate.service";
import {TodoList} from "../../todo/todolist.data";

@Component({
  selector: 'app-nav-todo-list-manger',
  templateUrl: './nav-todo-lists-manger.component.html',
  styleUrls: ['./nav-todo-lists-manger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTodoListsMangerComponent implements OnInit {

  constructor(private todoListsServices: TodolistEncapsulateService) {
  }

  ngOnInit(): void {
  }

  get observer() {
    return this.todoListsServices.observable;
  }

  clickToEdit(element: HTMLDivElement, link: HTMLAnchorElement, name: HTMLInputElement) {
    element.classList.add("focus");
    name.focus();
    setTimeout(() => {
      link.style.display = "none";
    }, 400);
  }

  unFocusEdit(element: HTMLDivElement, link: HTMLAnchorElement) {
    link.style.display = "unset";
    setTimeout(() => {
      element.classList.remove("focus");
    }, 10);
  }

  createTodo(btn: HTMLDivElement, link: HTMLAnchorElement, name: string) {
    this.unFocusEdit(btn, link);
    this.todoListsServices.createTodoList(name);
  }

  selectList(index: number) {
    this.todoListsServices.selectTodoList(index);
  }

  deleteList(index: number) {
    this.todoListsServices.deleteTodoList(index);
  }

  editeList(value: [number, string]) {
    this.todoListsServices.updateTodoList(value[0], value[1]);
  }

  async exportList(todoList: TodoList, element: HTMLButtonElement) {
    element.classList.add("processing");
    // is there a need to move that code to the service?
    const photos: string[] = todoList.items.map(item => item.photo ? item.photo : '').filter(photo => photo !== '');
    const photosB64Promise = photos.map(async (id) => {
      return this.todoListsServices.getPhotoBase64(id)
        .then(base64 => {
          return {
            id,
            base64
          };
        })
    })
    const photosB64 = await Promise.all(photosB64Promise);
    const todoListData: TodoList = {
      ...todoList,
      items: todoList.items.map(item => {
        const photo = photosB64.find(photo => photo.id === item.photo);
        return {
          ...item,
          photo: photo ? photo.base64 : '',
        }
      })
    };
    const url = window.URL.createObjectURL(new Blob([JSON.stringify(todoListData)], {type: 'application/json'}));
    const a = document.createElement('a');
    a.setAttribute('download', todoList.label + '.json');
    a.setAttribute('href', url);
    a.click()
    a.remove();
    window.URL.revokeObjectURL(url);
    element.classList.remove("processing");
  }

  importList(files: FileList | null, element: HTMLLabelElement) {
    // is there a need to move that code to the service?
    element.classList.add("processing");
    const file = files?.item(0);
    if (file) {
      try {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
          const todoListData = JSON.parse(reader.result as string);
          if(!todoListData.label || !todoListData.items) {
            element.classList.remove("processing");
            //not enough check here
            return alert('Invalid file');
          }
          const mappedFilePromise = todoListData.items.map(async (item: { photo: string; }) => {
            return {
              ...item,
              photo: item.photo ? await this.todoListsServices.getPhotoFile(item.photo) : ''
            }
          });
          const mappedFile = await Promise.all(mappedFilePromise);
          const todoListFileData = {
            ...todoListData,
            items: mappedFile
          }
          await this.todoListsServices.createTodoList(todoListFileData.label);
          await this.todoListsServices.create(...todoListFileData.items);
          element.classList.remove("processing");
        };
      }catch (e) {
        alert('Error while reading file');
        element.classList.remove("processing");
      }
    }else {
      alert('No file selected');
      element.classList.remove("processing");
    }
  }
}
