import {Component, Injectable} from '@angular/core';
import {TodolistService} from "./todolist.service";
import {HistoryService} from "./history.service";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: 'HISTORY_SERVICE_PROVIDER',
      useValue: localStorage.getItem('todolist') ? JSON.parse(localStorage.getItem('todolist')!) : {
        label: 'L3 MIAGE',
        items: []
      }
    },
    TodolistService,
    HistoryService
  ]
})
export class AppComponent {
  title = 'TodoList Angular';
  description: String = "Todo List de la L3 MIAGE yeay !!!";

  constructor() {
  }
}
