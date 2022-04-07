import {Component, OnInit, ChangeDetectionStrategy, HostListener} from '@angular/core';
import {TodoItem, TodoListsData} from "../todolist.data";
import {TodolistEncapsulateService} from "../todolist-encapsulate.service";
import {BehaviorSubject} from "rxjs";

export enum FilterEnum{
  All,
  Active,
  Completed
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    TodolistEncapsulateService
  ]
})
export class TodoListComponent implements OnInit {
  filter : FilterEnum = FilterEnum.All
  statusEnum: typeof FilterEnum = FilterEnum;
  file : File | null = null;
  private localUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(public todoService: TodolistEncapsulateService) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'z'){
      this.todoService.undo();
    }
    if (event.ctrlKey && event.key === 'y'){
      this.todoService.redo();
    }
  }

  get observer() {
    return this.todoService.observable;
  }

  create(title: string, files: FileList|null) {
    this.todoService.create({
      label:title,
      photo:files?.length?files[0]:undefined
    });
  }

  delete(item: TodoItem) {
    this.todoService.delete(item);
  }

  update(data: Partial<TodoItem>,...items: readonly TodoItem[]) {
    this.todoService.update(data, ...items);
  }

  trackById(number : number,item: TodoItem) {
    return item.id;
  }

  ngOnInit(): void {
  }

  preFilter(obsList:readonly TodoItem[]){
    switch (this.filter){
      case FilterEnum.Active:
        return obsList.filter(value => !value.isDone)
      case FilterEnum.Completed:
        return obsList.filter(value => value.isDone)
    }
    return obsList;
  }

  deleteSelected(obsList:readonly TodoItem[]){
    this.todoService.delete(...obsList.filter(value => value.isDone))
  }

  toggleAll(obsList:readonly TodoItem[]){
    this.todoService.update({isDone: !this.isChecked(obsList)}, ...obsList)
  }

  isChecked(obsList:readonly TodoItem[]){
    return obsList.every(value => value.isDone)
  }

  todoCount(obsList: readonly TodoItem[]) {
    return obsList.filter(value => !value.isDone).length
  }

  thereIsItems(tdl: TodoListsData) {
    return tdl.selected>=0 && tdl.lists[tdl.selected].items !== undefined && tdl.lists[tdl.selected].items.length>0
  }

  async fileSelected(fileInput: HTMLInputElement, fileLabel: HTMLLabelElement) {
    if (fileInput.value) {
      fileLabel.classList.add('selected');
      this.localUrl.next(await this.filepath(fileInput.files));
    } else {
      fileLabel.classList.remove('selected');
      this.localUrl.next('');
    }
  }

  resetForm(fileInput: HTMLInputElement, fileLabel: HTMLLabelElement, input: HTMLInputElement){
    input.value = '';
    this.resetFile(fileInput, fileLabel);
  }

  resetFile(fileInput: HTMLInputElement, fileLabel: HTMLLabelElement){
    fileInput.value = '';
    fileLabel.classList.remove('selected');
    this.fileSelected(fileInput, fileLabel);
  }

  filepath(files: FileList|null) : Promise<string>{
    if (files !== null){
      console.log();
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          if(fileReader.result){
            resolve(fileReader.result.toString());
          }else {
            reject('fileReader.result is null')
          }
        };
        fileReader.onerror = reject;
        fileReader.readAsDataURL(files[0]);
      });
    }else{
      return new Promise((resolve)=>resolve(''));
    }
  }

  get fileImgObs(){
    return this.localUrl.asObservable();
  }
}
