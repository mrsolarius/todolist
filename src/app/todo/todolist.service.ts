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
  private userUid: string | null = null;
  private sendData: AngularFireList<TodoList> | undefined;

  constructor(private history : HistoryService<TodoList>,private db: AngularFireDatabase, public auth: AngularFireAuth) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.userUid = user.uid;
        this.db.database.ref(`/todo/${this.userUid}`).on('value', (snapshot) => {
          if(snapshot.val()) {
            if(snapshot.val().items) {
              this.subj.next(snapshot.val());
            }else {
              this.subj.next({label: 'L3 MIAGE', items: [] });
            }
          }else {
            this.subj.next({label: 'L3 MIAGE', items: [] });
          }
        });
      } else {
        this.userUid = null;
        const key = localStorage.getItem('todolist');
        if (key) {
          this.subj.next(JSON.parse(key));
        }
      }
    });

    const key = localStorage.getItem('todolist');
    if (key && this.userUid==null) {
      this.subj.next(JSON.parse(key));
    }

    // Subscribe to change for saving and history
    this.observable.subscribe(L => {
      if(this.userUid) {
        this.sendData = this.db.list(`/todo`);
        this.sendData.update(this.userUid, L);
      }else{
        localStorage.setItem('todolist', JSON.stringify(L));
      }
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
