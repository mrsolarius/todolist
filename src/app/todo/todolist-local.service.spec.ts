import { TestBed } from '@angular/core/testing';

import { TodolistLocalService } from './todolist-local.service';

describe('TodolistService', () => {
  let service: TodolistLocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodolistLocalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
