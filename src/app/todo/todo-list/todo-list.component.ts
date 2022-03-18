import {Component, OnInit, ChangeDetectionStrategy, HostListener} from '@angular/core';
import {TodoItem, TodolistService} from "../todolist.service";

export enum FilterEnum{
  All,
  Active,
  Completed
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  filter : FilterEnum = FilterEnum.All
  statusEnum: typeof FilterEnum = FilterEnum;

  constructor(public todoService: TodolistService) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'z'){
      this.todoService.undo();
    }
    if (event.ctrlKey && event.key === 'y'){
      this.todoService.redo();
    }
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

  update(data: Partial<TodoItem>,...items: readonly TodoItem[]) {
    this.todoService.update(data, ...items);
  }

  trackById(number : number,item: TodoItem) {
    return item.id;
  }

  ngOnInit(): void {
  }

  preFilter(obsList:readonly TodoItem[]){
    switch (this.filter){
      case FilterEnum.Active:
        return obsList.filter(value => !value.isDone)
      case FilterEnum.Completed:
        return obsList.filter(value => value.isDone)
    }
    return obsList;
  }

  deleteSelected(obsList:readonly TodoItem[]){
    this.todoService.delete(...obsList.filter(value => value.isDone))
  }

  toggleAll(obsList:readonly TodoItem[]){
    this.todoService.update({isDone: !this.isChecked(obsList)}, ...obsList)
  }

  isChecked(obsList:readonly TodoItem[]){
    return obsList.every(value => value.isDone)
  }

  todoCount(obsList: readonly TodoItem[]) {
    return obsList.filter(value => !value.isDone).length
  }
}
