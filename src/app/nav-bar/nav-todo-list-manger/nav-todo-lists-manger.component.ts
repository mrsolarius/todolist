import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-todo-list-manger',
  templateUrl: './nav-todo-lists-manger.component.html',
  styleUrls: ['./nav-todo-lists-manger.component.scss']
})
export class NavTodoListsMangerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
    console.log(name);
  }
}
