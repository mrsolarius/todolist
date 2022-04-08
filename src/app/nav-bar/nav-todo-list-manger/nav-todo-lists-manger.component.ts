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
    try {
      const todoListData = await this.todoListsServices.export();
      const url = window.URL.createObjectURL(new Blob([JSON.stringify(todoListData)], {type: 'application/json'}));
      const a = document.createElement('a');
      a.setAttribute('download', todoList.label + '.json');
      a.setAttribute('href', url);
      a.click()
      a.remove();
      window.URL.revokeObjectURL(url);
    }
    catch (error) {
      alert(error);
    } finally {
      element.classList.remove("processing");
    }
  }

  async importList(files: FileList | null, element: HTMLLabelElement) {
    // is there a need to move that code to the service?
    element.classList.add("processing");
    const file = files?.item(0);
    if (file) {
      try {
        await this.todoListsServices.importFromFile(file);
      } catch (e) {
        alert(e);
      } finally {
        element.classList.remove("processing");
      }
    } else {
      alert('No file selected');
      element.classList.remove("processing");
    }
  }
}
