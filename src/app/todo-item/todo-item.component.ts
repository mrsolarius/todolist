import {Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output} from '@angular/core';
import {TodoItem} from "../todolist.service";

@Component({
  selector: 'app-todo-item[item]',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {
  @Input() item!: TodoItem;
  @Output() delete = new EventEmitter<TodoItem>();
  @Output() update = new EventEmitter<Partial<TodoItem>>();
  public editing = false;

  constructor() {}

  ngOnInit(): void {
  }
}
