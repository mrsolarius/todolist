import {BehaviorSubject} from "rxjs";
import {HistoryService} from "../history.service";
import {Injector} from "@angular/core";

// Todolist item data
export interface TodoItem {
  readonly label: string;
  readonly isDone: boolean;
  readonly id: number;
}

// Todolist data
export interface TodoList {
  readonly label: string;
  readonly items: readonly TodoItem[];
}
// To provide unique id for each item
let idItem = 0;
export abstract class TodolistService{
  protected history : HistoryService<TodoList>
  protected subj = new BehaviorSubject<TodoList>({label: 'L3 MIAGE', items: [] });
  public readonly observable = this.subj.asObservable();

  protected constructor(injector: Injector) {
    // get history service from injector, injecter will be provided by the child class
    this.history = injector.get(HistoryService);
  }

  /**
   * Publish any change to the todolist
   * - You must implement this.subj.next(todolist)
   * - You must call this.history.push(todolist) if withHistory is true.
   * - If you want to implement database or any save methode it's here ;)
   * @param todolist the new todolist
   * @param withHistory if true, the change will be stored in the history
   */
  abstract publish(todolist : TodoList, withHistory : boolean):void;

  /**
   * Add a new items to the todolist
   * It will call the publish method with history set to true
   * @param labels the labels of the new item
   */
  create(...labels: readonly string[]): this{
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
    this.publish(newValue,true);
    return this;
  }

  /**
   * Remove an items from the todolist
   * It will call the publish method with history set to true
   * @param items the items to remove
   */
  delete(...items: readonly TodoItem[]): this{
    const L = this.subj.value;
    const newValue : TodoList ={
      ...L,
      items: L.items.filter(item => items.indexOf(item) === -1 )
    }
    this.publish(newValue,true);
    return this;
  }

  /**
   * Update the label of an item
   * It will call the publish method with history set to true
   * @param data the item to update
   * @param items the list of items to update
   */
  update(data: Partial<TodoItem>, ...items: readonly TodoItem[]): this{
    if(data.label !== "") {
      const L = this.subj.value;
      const newValue : TodoList ={
        ...L,
        items: L.items.map( item => items.indexOf(item) >= 0 ? {...item, ...data} : item )
      }
      this.publish(newValue, true);
    } else {
      this.delete(...items);
    }
    return this;
  }

  /**
   * Undo the last change
   * It will call the publish method with history set too false to avoid infinite loop
   */
  undo(): this {
    const L = this.history.undo();
    if(L!==null) {
      this.publish(L,false)
    }
    return this;
  }

  /**
   * Redo the last change
   * It will call the publish method with history set too false to avoid infinite loop
   */
  redo(): this{
    const L = this.history.redo();
    if(L!==null) {
      this.publish(L,false)
    }
    return this;
  }

}
