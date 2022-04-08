import {BehaviorSubject} from "rxjs";
import {HistoryService} from "../history.service";
import {Injector} from "@angular/core";

// use to store image inside local storage or database
export interface TodoItemFile {
  readonly label: string;
  readonly isDone: boolean;
  readonly photo: File | undefined;
  readonly id: number;
}

export interface TodoListsData {
  readonly account: string;
  readonly selected: number;
  readonly lists: readonly TodoList[];
}

// Todolist data
export interface TodoList {
  readonly label: string;
  readonly items: readonly TodoItem[];
}

// Todolist item data
export interface TodoItem {
  readonly label: string;
  readonly isDone: boolean;
  readonly photo: string | undefined; // the id of the photo or undefined if no photo attached
  readonly id: number;
}

export const DEFAULT_LIST: TodoListsData = {account: "local", selected: -1, lists: []};

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
  abstract publish(todolist: TodoListsData, withHistory: boolean): Promise<void>;

  /**
   * Save the todolist photo where you want
   * the function must return an identifier of the photo that is able to recover the url later using getPhotoUrl
   * @param file the file to save
   * @return Promise<string> the promise id of the item, could reject your error
   */
  abstract savePhoto(file: File): Promise<string>;

  /**
   * Remove the photo from your storage
   * @param id the id of the photo to remove
   */
  abstract deletePhoto(id: string): void;

  /**
   * Get the url of the photo
   * @param id the id of the photo
   * @return Promise<string> the promise url of the photo, could reject your error
   */
  abstract getPhotoUrl(id: string): Promise<string>;

  /**
   * Get the photo as base64 used for export
   * @param id the id of the photo
   * @return Promise<string> the promise base64 of the photo, could reject your error
   */
  abstract getPhotoBase64(id: string): Promise<string>;

  /**
   * Add a new items to the todolist
   * It will call the publish method with history set to true
   * @param todoItems the todoItems of the new item
   */
  async create(...todoItems: readonly Partial<TodoItemFile>[]): Promise<this> {
    const L: TodoListsData = this.subj.value;
    // if no list is selected we can't create a new item
    if (L.selected === -1) {
      return this;
    }
    const preprocessTodoItemsPromise: Promise<TodoItem>[] = todoItems
      // we don't save any empty label, so we remove them from the list with filter
      .filter(todoItem => todoItem.label != undefined && todoItem.label.trim().length > 0)
      // cause we can need to save the photo we map the list to a promise
      .map(async (todoItem) => {
        let photo = '';
        // if the photo file is not empty we save it with the savePhoto method
        if (todoItem.photo !== undefined && todoItem.photo.size > 0) {
          //get the id of the photo
          photo = await this.savePhoto(todoItem.photo);
        }
        // we build new item with default values and trim the label
        return {
          ...todoItem,
          label: todoItem.label!.trim(),
          isDone: todoItem.isDone !== undefined ? todoItem.isDone : false,
          photo: photo,
          id: Date.now() // we generate an id for the item that is the current timestamp (should be enough for this app)
        }
      });
    // we can now wait for all images to be saved
    const preprocessTodoItems = await Promise.all(preprocessTodoItemsPromise);
    // here we rebuild the todolists and add the preprocessed items at the current selected list
    const newValue: TodoListsData = {
      ...L,
      lists: [
        ...L.lists.map((todoList, index) => {
          // to prevent undefined error we check if the current list is undefined if it we return empty list
          const oldTodoItems = todoList.items === undefined ? [] : todoList.items;
          // if the current list is the selected one we add the preprocessTodoItems to the list
          if (index === L.selected) {
            return {
              ...todoList,
              items: [
                ...oldTodoItems, // we add the old items
                ...preprocessTodoItems // we add the new items (the one that have the photo)
              ]
            }
          }
          return todoList;
        })

      ]
    }
    // because it's user action we set the history to true
    await this.publish(newValue, true);
    return this;
  }

  /**
   * Remove an items from the todolist
   * It will call the publish method with history set to true
   * @param items the items to remove
   */
  async delete(...items: readonly TodoItem[]): Promise<this> {
    const L = this.subj.value;
    // if no list is selected we can't delete items
    if (L.selected === -1) {
      return this;
    }
    // we delete each files of the items if they exist with the deletePhoto method
    items.forEach(item => item.photo ? this.deletePhoto(item.photo) : null);
    // here we rebuild the todolists and remove the items at the current selected list
    const newValue: TodoListsData = {
      ...L,
      lists: [
        ...L.lists.map((todoList, index) => {
          // if the current list is the selected one we can filter the items to remove
          if (index === L.selected) {
            return {
              ...todoList,
              // we remove the items with filter using indexOf to check if the item is in the list
              items: todoList.items.filter(item => items.indexOf(item) === -1)
            }
          }
          return todoList;
        })
      ]
    }
    // because it's user action we set the history to true
    await this.publish(newValue, true);
    return this;
  }

  /**
   * Update the label of an item
   * It will call the publish method with history set to true
   * @param data the item to update
   * @param items the list of items to update
   */
  async update(data: Partial<TodoItem>, ...items: readonly TodoItem[]): Promise<this> {
    // if the label is empty we delete the item
    if (data.label !== "") {
      // else we update the item
      const L = this.subj.value;
      // if no list is selected we can't update item
      if (L.selected === -1) {
        return this;
      }
      // here we rebuild the todolists and update the items at the current selected list
      const newValue: TodoListsData = {
        ...L,
        lists: [
          ...L.lists.map((todoList, index) => {
            // if the current list is the selected one we map the items to update data
            if (index === L.selected) {
              return {
                ...todoList,
                // we can check if the item is contained in the list with indexOf to check if the item is in the list
                items: todoList.items.map(item => items.indexOf(item) >= 0 ? {...item, ...data} : item)
              }
            }
            return todoList;
          })
        ]
      }
      // because it's user action we set the history to true
      await this.publish(newValue, true);
    } else {
      await this.delete(...items);
    }
    return this;
  }

  /**
   * Create a new todolist
   * @param label the label of the new todolist
   */
  async createTodoList(label: string): Promise<this> {
    const L = this.subj.value;
    // we prevent undefined error by checking if the lists is undefined
    const oldList = L.lists === undefined ? [] : L.lists;
    const selected = L.lists === undefined ? 0 : L.lists.length;
    const newValue: TodoListsData = {
      ...L,
      selected,
      lists: [
        ...oldList,
        // just add the new list with empty items
        {
          label,
          items: []
        }
      ]
    }
    // because it's user action we set the history to true
    await this.publish(newValue, true);
    return this;
  }

  /**
   * Delete a todolist
   * @param index the index of the todolist to delete
   */
  async deleteTodoList(index: number): Promise<this> {
    const L = this.subj.value;
    // if we delete the first element select the second one if exists
    // else if juste remove 1 to the selected index
    // we can now have the new selected index
    const selected = L.selected - 1 === -1 ? L.lists.length - 1 > 0 ? 0 : -1 : L.selected - 1;
    const newValue: TodoListsData = {
      ...L,
      lists: L.lists.filter((_, i) => {
        // if it's the index we want to delete we take every item and delete their associate photos if they exist
        if (i === index && L.lists[index].items !== undefined) {
          L.lists[index].items.forEach(item => item.photo ? this.deletePhoto(item.photo) : null);
        }
        return i !== index;
      }),
      selected
    }
    // because it's user action we set the history to true
    await this.publish(newValue, true);
    return this;
  }

  /**
   * Update the label of a todolist
   * @param index the index of the todolist to update
   * @param label the new label
   */
  async updateTodoList(index: number, label: string): Promise<this> {
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
    // because it's user action we set the history to true
    await this.publish(newValue, true);
    return this;
  }

  /**
   * Select a todolist by its index
   * @param index the index of the todolist
   */
  async selectTodoList(index: number): Promise<this> {
    const L = this.subj.value;
    // no need to update the selected index if the index is the same
    if (L.selected === index) {
      return this;
    }
    const newValue: TodoListsData = {
      ...L,
      selected: index
    }
    // because it's user action we set the history to true
    await this.publish(newValue, true);
    return this;
  }

  /**
   * Undo the last change
   * It will call the publish method with history set too false to avoid infinite loop
   */
  async undo(): Promise<this> {
    const L = this.history.undo();
    if (L !== null) {
      await this.publish(L, false)
    }
    return this;
  }

  /**
   * Redo the last change
   * It will call the publish method with history set too false to avoid infinite loop
   */
  async redo(): Promise<this> {
    const L = this.history.redo();
    if (L !== null) {
      await this.publish(L, false)
    }
    return this;
  }


  /**
   * Get bas64 as file
   * @param bas64 the base64 of the photo
   * @return Promise<File> the promise file of the photo, could reject your error
   */
  getPhotoFile(bas64: string): Promise<File> {
    return new Promise<File>((resolve, reject) => {
        if (!bas64) {
          return reject("base64 should not be empty");
        }
        //split the base64 header from the data
        const [start, data] = bas64.split(',');
        //we check if it's an image
        if (start.indexOf("data:image") !== 0) {
          return reject("base64 should start with data:image");
        }

        // @ts-ignore don't understand how start could be null after the previous if
        const mime = start.match(/:(.*?);/)[1]; //get the mime type (ex: :image/jpeg;)
        const ext = mime.split('/')[1]; //get the extension (ex: jpeg)
        const blob = atob(data); //encode the base64 string to a binary blob
        let n = blob.length;
        const u8arr = new Uint8Array(n);
        //we can iterate over the binary blob and convert it to a Uint8Array
        while (n--) {
          u8arr[n] = blob.charCodeAt(n);
        }
        //with the Uint8Array we can create a file with the right extension and mime type
        return resolve(new File([u8arr], 'photo.' + ext, {type: mime}));
      }
    );
  }

  /**
   * Export current todolist to a todolist with base64 images
   * @return Promise<TodoListsData> the promise todolist with base64 instead of id in photos fields
   */
  async export() : Promise<TodoList> {
    const L = this.subj.value;
    const selectedList = L.lists[L.selected];
    const photos: string[] = selectedList.items.map(item => item.photo ? item.photo : '').filter(photo => photo !== '');
    const photosB64Promise = photos.map(async (id) => {
      return this.getPhotoBase64(id)
        .then(base64 => {
          return {
            id,
            base64
          };
        })
    })
    const photosB64 = await Promise.all(photosB64Promise);
    return {
      ...selectedList,
      items: selectedList.items.map(item => {
        const photo = photosB64.find(photo => photo.id === item.photo);
        return {
          ...item,
          photo: photo ? photo.base64 : '',
        }
      })
    };
  }

  async importFromFile(file: File) : Promise<void> {
    return new Promise<void>((resolve,reject)=>{
      const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      const todoListData = JSON.parse(reader.result as string);
      if (!todoListData.label || !todoListData.items) {
        return reject("Invalid file");
      }
      const mappedFilePromise = todoListData.items.map(async (item: { photo: string; }) => {
        return {
          ...item,
          photo: item.photo ? await this.getPhotoFile(item.photo) : ''
        }
      });
      const mappedFile = await Promise.all(mappedFilePromise);
      const todoListFileData = {
        ...todoListData,
        items: mappedFile
      }
      await this.createTodoList(todoListFileData.label);
      await this.create(...todoListFileData.items);
      resolve();
    };
  });
  }

}
