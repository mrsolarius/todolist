import {Injectable, Injector} from '@angular/core';
import {DEFAULT_LIST,  TodoListsData, TodolistService} from "./todolist.data";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {v4 as uuid} from "uuid";
import {AngularFireStorage} from "@angular/fire/compat/storage";


@Injectable({
  providedIn: 'root'
})
export class TodolistFirebaseService extends TodolistService{
  private databaseKey : string  = '/todo/';
  private userId : string|null=null;

  constructor(private db: AngularFireDatabase,private auth: AngularFireAuth, injector: Injector, private storage: AngularFireStorage) {
    super(injector);
    //init upload task
    auth.authState.subscribe(user => {
      if(user){
        this.userId = user.uid;
        this.db.database.ref(this.databaseKey+this.userId).on('value', (snapshot) => {
          console.log();
          return this.publish(snapshot.val()?snapshot.val():{
            ...DEFAULT_LIST,
            account: this.userId
          }, false);
        });
      }else{
        this.userId = null;
      }
    });
  }

  override publish(todolist: TodoListsData, withHistory : boolean): void {
    if (this.userId) {
      this.db.list(this.databaseKey).update(this.userId,todolist).catch(error => {
        console.log(error);
      });
      this.subj.next(todolist);
      if(withHistory){
        this.history.push(todolist);
      }
    }
  }

  override savePhoto(file:File):Promise<string>{
    return new Promise((resolve, reject) => {
      if(this.userId) {
        const id = uuid();
        this.storage.upload(this.databaseKey + this.userId + '/' + id, file).then(() => {
            resolve(id);
        }).catch(reject);
      }
    });
  }

  override getPhotoUrl(photo: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if(this.userId && photo) {
        this.storage.ref(this.databaseKey + this.userId + '/' + photo).getDownloadURL().toPromise().then(resolve).catch(reject);
      }
    });
  }

  override deletePhoto(photo: string): void {
    if(this.userId && photo) {
      this.storage.ref(this.databaseKey + this.userId + '/' + photo).delete();
    }
  }
}
