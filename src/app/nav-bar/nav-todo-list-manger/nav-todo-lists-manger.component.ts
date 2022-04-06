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

  async exportList(todoList: TodoList) {
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
  }

  importList(files:FileList | null) {
    // is there a need to move that code to the service?
    const file = files?.item(0);
    if (file) {
      try {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
          const todoListData = JSON.parse(reader.result as string);
          if(!todoListData.label || !todoListData.items) {
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
        };
      }catch (e) {
        alert('Error while reading file');
      }
    }else {
      alert('No file selected');
    }
  }
}
