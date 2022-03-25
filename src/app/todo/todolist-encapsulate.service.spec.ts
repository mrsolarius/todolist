import { TestBed } from '@angular/core/testing';

import { TodolistEncapsulateService } from './todolist-encapsulate.service';

describe('TodolistEncapsulateService', () => {
  let service: TodolistEncapsulateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodolistEncapsulateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
