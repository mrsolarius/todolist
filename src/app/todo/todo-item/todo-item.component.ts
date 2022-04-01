import {Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import {TodoItem} from "../todolist.data";
import {TodolistEncapsulateService} from "../todolist-encapsulate.service";
import {Observable,from} from "rxjs";

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
  public observable: Observable<string | undefined> | undefined;

  constructor(public imp: TodolistEncapsulateService) {
  }

  ngOnInit(): void {
    if(this.item.photo) {
      this.observable = from(this.imp.getPhotoUrl(this.item.photo));
    }
  }

  startEditing(input : HTMLInputElement) {
    this.editing = true;
    // Don't know why but without 1ms delay, the input is not focused
    // It seems to work with a more short delay but I don't want to
    // use with 0.00000001 ms delay
    setTimeout(() => input.focus(), 1);
  }

  saveEdit(value: string) {
    this.update.emit({label:value})
    this.editing = false;
  }
}
