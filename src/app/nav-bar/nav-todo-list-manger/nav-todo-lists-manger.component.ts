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
    /*
    Des test pour y stoker aussi les photos sans success :'(
    const photos: string[] = todoList.items.map(item => item.photo ? item.photo : '').filter(photo => photo !== '');
    const photosUrlsPromise = photos.map((id) =>
      this.todoListsServices.getPhotoUrl(id)
        .then(url => {
          return {
            id,
            url
          };
        }));
    const photosUrls = await Promise.all(photosUrlsPromise);
    const todoListData = {
      ...todoList,
      items: todoList.items.map(item => {
        const photo = photosUrls.find(photo => photo.id === item.photo);
        return {
          ...item,
          photo: photo ? photo.url : '',
        }
      })
    };*/
    const url = window.URL.createObjectURL(new Blob([JSON.stringify(todoList)], {type: 'application/json'}));
    const a = document.createElement('a');
    a.setAttribute('download', todoList.label + '.json');
    a.setAttribute('href',url);
    a.click()
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  importList(files:FileList | null) {
    const file = files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const todoListData = JSON.parse(reader.result as string);
        this.todoListsServices.createTodoList(todoListData.label);
        setTimeout(() =>{
          this.todoListsServices.create(...todoListData.items);
        },100);
      };
    }
  }
}
