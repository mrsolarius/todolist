import {Injectable, Injector} from '@angular/core';
import {DEFAULT_LIST,  TodoListsData, TodolistService} from "./todolist.data";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {v4 as uuid} from "uuid";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {filetoDataURL} from "image-conversion";


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
      // if a user is logged in
      if(user){
        // we reset the history
        this.history.resetHistory();
        this.userId = user.uid;
        // we get the realtime database data and update with it
        this.db.database.ref(this.databaseKey+this.userId).on('value', (snapshot) => {
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

  override async publish(todolist: TodoListsData, withHistory : boolean): Promise<void> {
    if (this.userId) {
      // retrieve the data list to update it with the new data
      await this.db.list(this.databaseKey).update(this.userId,todolist).catch(console.error);
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
        // upload the file to firebase storage with the id as the name
        this.storage.upload(this.databaseKey + this.userId + '/' + id, file).then(() => {
            resolve(id);
        }).catch(reject);
      }
    });
  }

  override getPhotoUrl(photo: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if(this.userId && photo) {
        // get the url of the file from firebase storage with the id as the name
        this.storage.ref(this.databaseKey + this.userId + '/' + photo).getDownloadURL().toPromise().then(resolve).catch(reject);
      }
    });
  }

  override deletePhoto(photo: string): void {
    if(this.userId && photo) {
      // delete the file from firebase storage with the id as the name
      this.storage.ref(this.databaseKey + this.userId + '/' + photo).delete();
    }
  }

  override getPhotoBase64(id: string): Promise<string> {
    // this methode can't work if you don't authorize the cors policy
    return new Promise((resolve, reject) => {
      if(this.userId && id) {
        this.getPhotoUrl(id)
          .then(url => fetch(url))
          .then(response => response.blob())
          .then(blob => filetoDataURL(blob))
          .then(resolve)
          .catch(reject);
      }
    });
  }
}
