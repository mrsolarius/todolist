import {Injectable, Injector} from '@angular/core';
import {TodolistFirebaseService} from "./todolist-firebase.service";
import {TodolistLocalService} from "./todolist-local.service";
import {TodoListsData, TodolistService} from "./todolist.data";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TodolistEncapsulateService extends TodolistService{
  //to know if the user is logged in and witch service to use
  private isAuth: boolean = false;

  constructor(private todolistFireBase:TodolistFirebaseService,private todolistLocal:TodolistLocalService,private auth:AngularFireAuth,injector:Injector) {
    super(injector);

    //Auth subscribe and derivation to get useruid and call todolistfirebase if user is auth and todolistlocal if not
    auth.authState.pipe(switchMap(user=>{
      //When user change history need to be unrelated
      this.history.resetHistory()
      if(user){
        this.isAuth = true;
        return this.todolistFireBase.observable;
      }else{
        this.isAuth = false;
        return this.todolistLocal.observable;
      }
    })).subscribe(todolist=>{
      //subscribe any change event from todolistLocal or todolistFirebase
      this.subj.next(todolist);
    });

  }

  override publish(todolist: TodoListsData, withHistory: boolean): void {
    //if user is auth publish to todolistfirebase else publish to todolistlocal
    if(this.isAuth){
      this.todolistFireBase.publish(todolist,withHistory);
    }else{
      this.todolistLocal.publish(todolist,withHistory);
    }
  }

  override async savePhoto(file:File):Promise<string>{
    //if user is auth publish to todolistfirebase else publish to todolistlocal
    if(this.isAuth){
      return this.todolistFireBase.savePhoto(file);
    }else{
      return this.todolistLocal.savePhoto(file);
    }
  }

  getPhotoUrl(photo: string): Promise<string> {
    //if user is auth publish to todolistfirebase else publish to todolistlocal
    if(this.isAuth){
      return this.todolistFireBase.getPhotoUrl(photo);
    }else{
      return this.todolistLocal.getPhotoUrl(photo);
    }
  }
}
