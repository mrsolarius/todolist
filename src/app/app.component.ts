import {Component, Injectable} from '@angular/core';
import {TodoItem, TodolistService} from "./todolist.service";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'l3m-tpX-todolist-angular-y2022';
  constructor(public todoService: TodolistService) {
  }


  get observer() {
    return this.todoService.observable;
  }

  create(title: string) {
    this.todoService.create(title);
  }

  delete(item: TodoItem) {
    this.todoService.delete(item);
  }

  update(data: Partial<TodoItem>) {
    this.todoService.update(data);
  }

}
