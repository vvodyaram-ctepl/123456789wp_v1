import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionCategoriesRoutingModule } from './question-categories-routing.module';
import { QuestionCategoryComponent } from './components/question-category/question-category.component';
import { QuestionCategoriesListComponent } from './components/question-categories-list/question-categories-list.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [QuestionCategoriesListComponent, QuestionCategoryComponent],
  imports: [
    CommonModule,
    QuestionCategoriesRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule
  ]
})
export class QuestionCategoriesModule { }
