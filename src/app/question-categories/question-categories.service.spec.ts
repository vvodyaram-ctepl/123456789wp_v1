import { TestBed } from '@angular/core/testing';

import { QuestionCategoriesService } from './question-categories.service';

describe('QuestionCategoriesService', () => {
  let service: QuestionCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
