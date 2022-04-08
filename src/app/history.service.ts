import { Injectable } from '@angular/core';

interface History<T> {
  canUndo: boolean;
  canRedo: boolean;
  history: T[];
  currentIndex: number;
  current: T|null;
}


@Injectable({
  providedIn: 'root'
})

export class HistoryService<T>{
  private history: History<T>;

  constructor() {
    this.history = {
      canUndo: false,
      canRedo: false,
      history: [],
      currentIndex: -1,
      current: null
    };
  }

  push(element: T) {
    if(this.history.history.filter(e => e === element).length === 0) {
      this.history.history.push(element);
      this.history.current = element;
      this.history.currentIndex = this.history.history.length - 1;
      this.history.canUndo = this.history.currentIndex > 0  ;
      this.history.canRedo = false;
    }
  }

  undo() : T | null {
    if (this.history.canUndo) {
      this.history.currentIndex--;
      this.history.current = this.history.history[this.history.currentIndex];
      this.history.canRedo = true;
      this.history.canUndo = this.history.currentIndex > 0;
    }
    return this.history.current;
  }

  redo() : T | null{
    if (this.history.canRedo) {
      this.history.currentIndex++;
      this.history.current = this.history.history[this.history.currentIndex];
      this.history.canUndo = this.history.currentIndex > 0;
      if (this.history.currentIndex === this.history.history.length - 1) {
        this.history.canRedo = false;
      }
    }
    return this.history.current;
  }

  resetHistory(){
    this.history = {
      canUndo: false,
      canRedo: false,
      history: [],
      currentIndex: -1,
      current: null
    };
  }
}
