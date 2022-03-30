import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavTodoListsMangerComponent } from './nav-todo-lists-manger.component';

describe('NavTodoListMangerComponent', () => {
  let component: NavTodoListsMangerComponent;
  let fixture: ComponentFixture<NavTodoListsMangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavTodoListsMangerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavTodoListsMangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
