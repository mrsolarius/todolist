import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {TodoItem, TodolistService} from "../todolist.service";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {

  constructor(public todoService: TodolistService) { }

  get observer() {
    return this.todoService.observable;
  }

  create(title: string) {
    this.todoService.create(title);
  }

  delete(item: TodoItem) {
    this.todoService.delete(item);
  }

  update(data: Partial<TodoItem>,...items: readonly TodoItem[]) {
    this.todoService.update(data, ...items);
  }

  trackById(number : number,item: TodoItem) {
    return item.id;
  }

  ngOnInit(): void {
  }

}
