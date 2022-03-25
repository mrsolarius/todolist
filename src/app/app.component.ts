import {Component, Injectable} from '@angular/core';
import {TodolistEncapsulateService} from "./todo/todolist-encapsulate.service";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    TodolistEncapsulateService,
  ]
})
export class AppComponent {
  title = 'TodoList Angular';
  description: String = "Todo List de la L3 MIAGE yeay !!!";

  constructor() {
  }
}
