import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TodoList} from "../../../todo/todolist.data";

@Component({
  selector: 'app-nav-todo-list-item',
  templateUrl: './nav-todo-list-item.component.html',
  styleUrls: ['../nav-todo-lists-manger.component.scss','./nav-todo-list-item.component.scss']
})
export class NavTodoListItemComponent {

  @Input() todoList!: TodoList;
  @Input() index!: number;
  @Input() selected: number=-1;
  @Output() deleteTodoList = new EventEmitter<number>();
  @Output() editTodoListLabel = new EventEmitter<[index:number,label:string]>();
  @Output() selectTodoList = new EventEmitter<number>();

  public editing: boolean = false;

  constructor() { }

  selectList(index: number) {
    this.selectTodoList.emit(index);
  }

  deleteList(index: number) {
    this.deleteTodoList.emit(index);
  }

  startEdit(todoListName: HTMLInputElement) {
    this.editing = true;
    setTimeout(() => todoListName.focus(), 1);
  }

  saveEdit(value: string) {
    this.editing = false;
    this.editTodoListLabel.emit([this.index,value]);
  }
}
