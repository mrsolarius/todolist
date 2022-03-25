import {Injectable, Injector} from '@angular/core';
import {TodoList, TodolistService} from "./todolist.data";

@Injectable({
  providedIn: 'root'
})
export class TodolistLocalService extends TodolistService{

  constructor(injector: Injector) {
    super(injector);
    // Retrieve the list from local storage
    const key = localStorage.getItem('todolist');
    if (key) {
      this.publish(JSON.parse(key),false);
    }
  }

  override publish(todolist: TodoList,saveHistory: boolean): void {
    // Save the list in local storage
    localStorage.setItem('todolist', JSON.stringify(todolist));
    this.subj.next(todolist);
    if(saveHistory) {
      this.history.push(todolist);
    }
  }

}
