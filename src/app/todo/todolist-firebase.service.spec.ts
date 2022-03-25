import { TestBed } from '@angular/core/testing';

import { TodolistFirebaseService } from './todolist-firebase.service';

describe('TodolistFirebaseService', () => {
  let service: TodolistFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodolistFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
