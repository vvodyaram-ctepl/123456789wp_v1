import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionCategoriesListComponent } from './components/question-categories-list/question-categories-list.component';
import { QuestionCategoryComponent } from './components/question-category/question-category.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: QuestionCategoriesListComponent },
  { path: 'add', component: QuestionCategoryComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit/:id', component: QuestionCategoryComponent, canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionCategoriesRoutingModule { }
