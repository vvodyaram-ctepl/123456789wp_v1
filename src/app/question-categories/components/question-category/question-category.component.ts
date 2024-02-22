import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/components/validation-message/validation.service';
import { QuestionCategoriesService } from '../../question-categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/components/alert-modal/alert.service';

@Component({
  selector: 'app-question-category',
  templateUrl: './question-category.component.html',
  styleUrls: ['./question-category.component.scss']
})
export class QuestionCategoryComponent implements OnInit {

  public questionCategoryForm: FormGroup;
  editQuesCategory: boolean = false;
  submitFlag: boolean = false;

  queryParams: any = {};

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private questionCategoryService: QuestionCategoriesService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((obj: any) => {
      this.queryParams = obj;
    });

    this.buildForm();
    this.activatedRoute.params.subscribe(params => {
      const path = this.activatedRoute.snapshot.url[0].path;
      if (path === 'edit') {
        this.spinner.show();
        this.editQuesCategory = true;
        this.getQuestionCategoryByIdAndPatch(params.id);
      }
      else {
        this.editQuesCategory = false;
      }
    });
  }

  public buildForm(): void {
    this.questionCategoryForm = this.fb.group({
      questionCategoryId: [],
      questionCategory: ['', [Validators.required, ValidationService.whiteSpaceValidator, ValidationService.exceptSpecialChar]],
      description: [''],
      isActive: [1]
    });
  }

  getQuestionCategoryByIdAndPatch(questionCategoryId: number | string) {
    this.questionCategoryService.getCategory(questionCategoryId).subscribe(res => {
      if (res.status.success === true) {
        this.questionCategoryForm.patchValue(res.response.questionCategory);
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }

  backToList() {
    this.router.navigate(['/user/question-categories'], { queryParams: this.queryParams });
  }

  public submitQuestionCategory() {
    if (!this.questionCategoryForm.valid) {
      this.questionCategoryForm.markAllAsTouched();
      return false;
    }
    this.spinner.show();
    this.submitFlag = true;
    if (this.editQuesCategory) {
      this.questionCategoryService.updateCategory(this.questionCategoryForm.value).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Question category updated successfully!');
          this.questionCategoryForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    }
    else {
      this.questionCategoryService.addCategory(this.questionCategoryForm.value).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Question category added successfully!');
          this.questionCategoryForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    }
  }

  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/question-categories') > -1 && this.submitFlag) {
      return true;
    }
    if (this.questionCategoryForm.touched) { //this.questionCategoryForm.pristine == false || this.questionCategoryForm.dirty == false
      return this.alertService.confirm();
    }
    else {
      return true;
    }
  }

}
