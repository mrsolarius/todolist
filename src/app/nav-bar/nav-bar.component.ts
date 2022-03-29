import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(public auth: AngularFireAuth) { }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
  }

  ngOnInit(): void {
  }

  clickToEdit(element: HTMLDivElement, name: HTMLInputElement){
    element.classList.add("focus");
    name.focus();
  }

  unFocusEdit(element: HTMLDivElement) {
    element.classList.remove("focus");
  }

  createTodo(element: HTMLDivElement, name: string) {
    this.unFocusEdit(element);
    console.log(name);
  }
}
