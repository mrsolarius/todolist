import {Injectable, Injector} from '@angular/core';
import {TodoList, TodolistService} from "./todolist.data";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class TodolistFirebaseService extends TodolistService{
  private databaseKey : string  = '/todo/';
  private userId : string|null=null;

  constructor(private db: AngularFireDatabase,private auth: AngularFireAuth, injector: Injector) {
    super(injector);
    auth.authState.subscribe(user => {
      if(user){
        this.userId = user.uid;
        this.db.database.ref(this.databaseKey+this.userId).on('value', (snapshot) => {
          this.publish({label:snapshot.val().label,items:snapshot.val().items?snapshot.val().items:[]},false);
        });
      }else{
        this.userId = null;
      }
    });
  }

  publish(todolist: TodoList, withHistory : boolean): void {
    if (this.userId) {
      this.db.list(this.databaseKey).update(this.userId,todolist);
      this.subj.next(todolist);
      if(withHistory){
        this.history.push(todolist);
      }
    }
  }
}
