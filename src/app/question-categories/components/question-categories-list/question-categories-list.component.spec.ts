import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCategoriesListComponent } from './question-categories-list.component';

describe('QuestionCategoriesListComponent', () => {
  let component: QuestionCategoriesListComponent;
  let fixture: ComponentFixture<QuestionCategoriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionCategoriesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCategoriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
