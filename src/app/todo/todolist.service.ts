import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HistoryService } from "../history.service";
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {AngularFireAuth} from "@angular/fire/compat/auth";

export interface TodoItem {
  readonly label: string;
  readonly isDone: boolean;
  readonly id: number;
}

export interface TodoList {
  readonly label: string;
  readonly items: readonly TodoItem[];
}

let idItem = 0;

@Injectable({
  providedIn: 'root'
})
export class TodolistService {
  private subj = new BehaviorSubject<TodoList>({label: 'L3 MIAGE', items: [] });
  readonly observable = this.subj.asObservable();

  constructor(private history : HistoryService<TodoList>,private db: AngularFireDatabase, public auth: AngularFireAuth) {
    this.auth.user.subscribe(user => {
      if (user) {
        const sendData : AngularFireList<TodoList> = this.db.list(`/todo`);
        this.observable.subscribe(data => {
          sendData.update(user.uid, data);
        });

        const reciveData = this.db.list<TodoItem>(`/todo/${user.uid}/items`);
        reciveData.valueChanges().subscribe(data => {
          console.log(data);
          if(data.length > 0){
            this.subj.next({label: 'L3 MIAGE', items: data});
          }
        });
      }
    });
    const key = localStorage.getItem('todolist');
    if (key) {
      this.subj.next(JSON.parse(key));
    }

    // Subscribe to change for saving and history
    this.observable.subscribe(L => {
      localStorage.setItem('todolist', JSON.stringify(L));
    });
  }

  create(...labels: readonly string[]): this {
    const L: TodoList = this.subj.value;
    const newValue : TodoList = {
      ...L,
      items: [
        ...L.items,
        ...labels.filter( l => l !== '').map(
          label => ({label, isDone: false, id: idItem++})
        )
      ]
    }
    this.subj.next(newValue);
    return this;
  }

  delete(...items: readonly TodoItem[]): this {
    const L = this.subj.value;
    const newValue : TodoList ={
      ...L,
      items: L.items.filter(item => items.indexOf(item) === -1 )
    }
    this.subj.next(newValue);
    this.history.push(newValue);
    return this;
  }

  update(data: Partial<TodoItem>, ...items: readonly TodoItem[]): this {
    if(data.label !== "") {
      const L = this.subj.value;
      const newValue : TodoList ={
        ...L,
        items: L.items.map( item => items.indexOf(item) >= 0 ? {...item, ...data} : item )
      }
      this.subj.next(newValue);
      this.history.push(newValue);
    } else {
      this.delete(...items);
    }
    return this;
  }

  undo(){
    const L = this.history.undo();
    if(L!==null) {
      this.subj.next(L)
    }
  }

  redo(){
    const L = this.history.redo();
    if(L!==null) {
      this.subj.next(L)
    }
  }

}
