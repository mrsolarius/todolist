import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavTodoListItemComponent } from './nav-todo-list-item.component';

describe('NavTodoListItemComponent', () => {
  let component: NavTodoListItemComponent;
  let fixture: ComponentFixture<NavTodoListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavTodoListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavTodoListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
