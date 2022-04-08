import {Injectable, Injector} from '@angular/core';
import {DEFAULT_LIST, TodoListsData, TodolistService} from "./todolist.data";
import {v4 as uuid} from 'uuid';
import {compress, EImageType, filetoDataURL} from 'image-conversion';

@Injectable({
  providedIn: 'root'
})
export class TodolistLocalService extends TodolistService{

  constructor(injector: Injector) {
    super(injector);
    // Retrieve the list from local storage
    const key = localStorage.getItem('todolist');
    // reset history because we can come from another account
    this.history.resetHistory();
    if (key) {
      this.publish(JSON.parse(key),false);
    }else {
      this.publish(DEFAULT_LIST,false);
    }
  }

  override async publish(todolist: TodoListsData,saveHistory: boolean): Promise<void> {
    // Save the list in local storage
    localStorage.setItem('todolist', JSON.stringify(todolist));
    this.subj.next(todolist);
    if(saveHistory) {
      this.history.push(todolist);
    }
  }

  override savePhoto(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const id = uuid();
      // We need to compress the image cause the local storage is limited to 5MB
      // with the given parameters the size is around 220KB so we can store in the local storage
      // around 22 700 images I think it's enough
      compress(file, {
        quality:0.8,
        height:800,
        type: EImageType.PNG
      }).then(blob =>{
        // Convert the compressed image to a base64 string
        filetoDataURL(blob).then(bs64 =>{
          // and store it in the local storage
          try {
            localStorage.setItem(id, bs64);
          }catch (e) {
            // If the local storage is full we reject the promise
            reject(e);
          }
          resolve(id);
        }).catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }

  override getPhotoUrl(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Retrieve the image from the local storage
      const bs64 = localStorage.getItem(id);
      if (bs64) {
        resolve(bs64);
      } else {
        reject('Photo not found');
      }
    });
  }

  override deletePhoto(id: string): void {
    localStorage.removeItem(id);
  }

  override getPhotoBase64(id: string): Promise<string> {
    return Promise.resolve(this.getPhotoUrl(id));
  }
}
