import { Injectable } from '@angular/core';
import { BaseService } from '../services/util/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionCategoriesService extends BaseService {

  public addCategory(data: any): Observable<any> {
    return this.post('/api/questionCategories', data);
  }

  public updateCategory(data: any): Observable<any> {
    return this.put('/api/questionCategories', data);
  }

  public getCategory(id: number | string): Observable<any> {
    return this.get(`/api/questionCategories/${id}`, '');
  }

  public deleteCategory(id: number): Observable<any> {
    return this.delete(`/api/questionCategories/${id}`, '');
  }
}
