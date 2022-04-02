import {BehaviorSubject} from "rxjs";
import {HistoryService} from "../history.service";
import {Injector} from "@angular/core";

// Todolist item data
export interface TodoItem {
  readonly label: string;
  readonly isDone: boolean;
  readonly photo: string|undefined; // the id of the photo
  readonly id: number;
}

// Todolist with file instead of photo id
export interface TodoItemFile{
  readonly label: string;
  readonly isDone: boolean;
  readonly photo: File;
  readonly id: number;
}

// Todolist data
export interface TodoList {
  readonly label: string;
  readonly items: readonly TodoItem[];
}

export interface TodoListsData {
  readonly account: string;
  readonly selected: number;
  readonly lists: readonly TodoList[];
}

export const DEFAULT_LIST: TodoListsData = {account: "local", selected: -1, lists: []};

// To provide unique id for each item
let idItem = 0;

export abstract class TodolistService {
  protected history: HistoryService<TodoListsData>
  protected subj = new BehaviorSubject<TodoListsData>(DEFAULT_LIST);
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
  abstract publish(todolist: TodoListsData, withHistory: boolean): void;

  /**
   * Save the todolist photo where you want
   * the function must return an identifier of the photo that is able to recover the url later using getPhotoUrl
   * @param file the file to save
   * @return Promise<string> the promise id of the item, could reject your error
   */
  abstract savePhoto(file:File):Promise<string>;

  /**
   * Remove the photo from your storage
   * @param id the id of the photo to remove
   */
  abstract deletePhoto(id:string):void;

  /**
   * Get the url of the photo
   * @param id the id of the photo
   * @return Promise<string> the promise url of the photo, could reject your error
   */
  abstract getPhotoUrl(id:string):Promise<string>;

  /**
   * Add a new items to the todolist
   * It will call the publish method with history set to true
   * @param todoItems the todoItems of the new item
   */
  async create(...todoItems: readonly Partial<TodoItemFile>[]): Promise<this> {
    const L: TodoListsData = this.subj.value;
    if (L.selected === -1) {
      return this;
    }
    const preprocessTodoItemsPromise : Promise<TodoItem>[] = todoItems
      .filter(todoItem => todoItem.label!=undefined && todoItem.label.trim().length > 0)
      .map(async (todoItem) => {
        return {
          ...todoItem,
          label: todoItem.label!.trim(),
          isDone: todoItem.isDone!==undefined ? todoItem.isDone : false,
          photo: todoItem.photo!==undefined ? await this.savePhoto(todoItem.photo) : '',
          id: idItem++
        }
    });
    const preprocessTodoItems = await Promise.all(preprocessTodoItemsPromise);
    const newValue: TodoListsData = {
      ...L,
      lists: [
        ...L.lists.map((todoList, index) => {
          const oldTodoItems = todoList.items === undefined ? [] : todoList.items;
          if (index === L.selected) {
            return {
              ...todoList,
              items: [
                ...oldTodoItems,
                ...preprocessTodoItems
              ]
            }
          }
          return todoList;
        })

      ]
    }
    this.publish(newValue, true);
    return this;
  }

  /**
   * Remove an items from the todolist
   * It will call the publish method with history set to true
   * @param items the items to remove
   */
  delete(...items: readonly TodoItem[]): this {
    const L = this.subj.value;
    if (L.selected === -1) {
      return this;
    }
    items.forEach(item => item.photo?this.deletePhoto(item.photo):null);
    const newValue: TodoListsData = {
      ...L,
      lists: [
        ...L.lists.map((todoList, index) => {
          if (index === L.selected) {
            return {
              ...todoList,
              items: todoList.items.filter(item => items.indexOf(item) === -1)
            }
          }
          return todoList;
        })
      ]
    }
    this.publish(newValue, true);
    return this;
  }

  /**
   * Update the label of an item
   * It will call the publish method with history set to true
   * @param data the item to update
   * @param items the list of items to update
   */
  update(data: Partial<TodoItem>, ...items: readonly TodoItem[]): this {
    if (data.label !== "") {
      const L = this.subj.value;
      if (L.selected === -1) {
        return this;
      }
      const newValue: TodoListsData = {
        ...L,
        lists: [
          ...L.lists.map((todoList, index) => {
            if (index === L.selected) {
              return {
                ...todoList,
                items: todoList.items.map(item => items.indexOf(item) >= 0 ? {...item, ...data} : item)
              }
            }
            return todoList;
          })
        ]
      }
      this.publish(newValue, true);
    } else {
      this.delete(...items);
    }
    return this;
  }

  /**
   * Create a new todolist
   * @param label the label of the new todolist
   */
  createTodoList(label: string): this {
    const L = this.subj.value;
    const oldList = L.lists === undefined ? [] : L.lists;
    const selected = L.lists === undefined ? 0 : L.lists.length;
    const newValue: TodoListsData = {
      ...L,
      selected,
      lists: [
        ...oldList,
        {
          label,
          items: []
        }
      ]
    }
    this.history.resetHistory();
    this.publish(newValue, false);
    return this;
  }

  /**
   * Delete a todolist
   * @param index the index of the todolist to delete
   */
  deleteTodoList(index: number): this {
    const L = this.subj.value;
    // if we delete the first element select the second one if exists
    // else if juste remove 1 to the selected index
    const selected = L.selected - 1 === -1 ? L.lists.length - 1 > 0 ? 0 : -1 : L.selected - 1;
    const newValue: TodoListsData = {
      ...L,
      lists: L.lists.filter((_, i) => {
        if(i === index) {
          L.lists[index].items.forEach(item => item.photo?this.deletePhoto(item.photo):null);
        }
        return i !== index;
      }),
      selected
    }
    this.history.resetHistory();
    this.publish(newValue, true);
    return this;
  }

  /**
   * Update the label of a todolist
   * @param index the index of the todolist to update
   * @param label the new label
   */
  updateTodoList(index: number, label: string): this {
    const L = this.subj.value;
    const newValue: TodoListsData = {
      ...L,
      lists: [
        ...L.lists.map((todoList, i) => {
          if (i === index) {
            return {
              ...todoList,
              label
            }
          }
          return todoList;
        })
      ]
    }
    this.history.resetHistory();
    this.publish(newValue, true);
    return this;
  }

  /**
   * Select a todolist by its index
   * @param index the index of the todolist
   */
  selectTodoList(index: number): this {
    const L = this.subj.value;
    if (L.selected === index) {
      return this;
    }
    const newValue: TodoListsData = {
      ...L,
      selected: index
    }
    this.history.resetHistory();
    this.publish(newValue, false);
    return this;
  }

  /**
   * Undo the last change
   * It will call the publish method with history set too false to avoid infinite loop
   */
  undo(): this {
    const L = this.history.undo();
    if (L !== null) {
      this.publish(L, false)
    }
    return this;
  }

  /**
   * Redo the last change
   * It will call the publish method with history set too false to avoid infinite loop
   */
  redo(): this {
    const L = this.history.redo();
    if (L !== null) {
      this.publish(L, false)
    }
    return this;
  }

}
