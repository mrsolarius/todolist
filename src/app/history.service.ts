import { Inject, Injectable } from '@angular/core';

interface History<T> {
  canUndo: boolean;
  canRedo: boolean;
  history: T[];
  currentIndex: number;
  current: T;
}


@Injectable({
  providedIn: 'root'
})

export class HistoryService<T>{
  private history: History<T>;

  constructor(@Inject('HISTORY_SERVICE_PROVIDER') history: T) {
    this.history = {
      canUndo: false,
      canRedo: false,
      history: [history],
      currentIndex: 0,
      current: history
    };
  }

  push(element: T) {
    if(this.history.history.filter(e => e === element).length === 0) {
      this.history.history.push(element);
      this.history.current = element;
      this.history.currentIndex = this.history.history.length - 1;
      this.history.canUndo = true;
      this.history.canRedo = false;
    }
  }

  undo() : T | null {
    if (this.history.canUndo) {
      this.history.currentIndex--;
      this.history.current = this.history.history[this.history.currentIndex];
      this.history.canRedo = true;
      if (this.history.currentIndex === 0) {
        this.history.canUndo = false;
      }
    }
    return this.history.current;
  }

  redo() : T | null{
    if (this.history.canRedo) {
      this.history.currentIndex++;
      this.history.current = this.history.history[this.history.currentIndex];
      this.history.canUndo = true;
      if (this.history.currentIndex === this.history.history.length - 1) {
        this.history.canRedo = false;
      }
    }
    return this.history.current;
  }
}
