import {Component, HostListener, Injectable} from '@angular/core';
import {TodoItem, TodolistService} from "./todolist.service";
import {HistoryService} from "./history.service";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide:'HISTORY_SERVICE_PROVIDER',useValue:localStorage.getItem('todolist')?JSON.parse(localStorage.getItem('todolist')!):{label: 'L3 MIAGE', items: [] }},
    TodolistService,
    HistoryService
  ]
})
export class AppComponent {
  title = 'l3m-tpX-todolist-angular-y2022';
  constructor(public todoService: TodolistService) {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'z'){
      console.log('ctrl+z');
      this.todoService.undo();
    }
    if (event.ctrlKey && event.key === 'y'){
      console.log('ctrl+y');
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
}
