import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TodolistEncapsulateService} from "../../todo/todolist-encapsulate.service";
import {TodoListsData} from "../../todo/todolist.data";

@Component({
  selector: 'app-nav-todo-list-manger',
  templateUrl: './nav-todo-lists-manger.component.html',
  styleUrls: ['./nav-todo-lists-manger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTodoListsMangerComponent implements OnInit {

  constructor(private todoListsServices : TodolistEncapsulateService) { }

  ngOnInit(): void {
  }

  get observer() {
    return this.todoListsServices.observable;
  }

  clickToEdit(element: HTMLDivElement, link: HTMLAnchorElement, name: HTMLInputElement){
    element.classList.add("focus");
    name.focus();
    setTimeout(() => {
      link.style.display = "none";
    },400);
  }

  unFocusEdit(element: HTMLDivElement, link: HTMLAnchorElement) {
    link.style.display = "unset";
    setTimeout(() => {
      element.classList.remove("focus");
    },10);
  }

  createTodo(btn: HTMLDivElement, link: HTMLAnchorElement, name: string) {
    this.unFocusEdit(btn, link);
    this.todoListsServices.createTodoList(name);
  }

  selectList(index: number) {
    this.todoListsServices.selectTodoList(index);
  }
}
