import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { QuestionCategoriesService } from '../../question-categories.service';

@Component({
  selector: 'app-question-categories-list',
  templateUrl: './question-categories-list.component.html',
  styleUrls: ['./question-categories-list.component.scss']
})
export class QuestionCategoriesListComponent implements OnInit {
  @ViewChild('deleteCategoryRef') deleteCategoryRef: ElementRef;
  modalRef: NgbModalRef;
  headers: any;
  showDataTable: boolean = true;
  RWFlag: boolean;
  questionCategoryId: any;
  questionCategory: any;

  filteredObj: any;
  filterParams: any = {};

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private questionCategoryService: QuestionCategoriesService,
    private toastr: ToastrService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "45") {
        if (ele.menuActionId == "3") {
          this.RWFlag = true;
        }
      }
    });

    this.headers = [
      { key: "questionCategory", label: "category name", checked: true, sortable: true },
      { key: "description", label: "Description", checked: true, width: '800' },
      { key: "static", label: "", checked: true, clickable: true }
    ];

    this.route.queryParams.subscribe((obj: any) => {
      this.filterParams = obj;
    });
  }

  formatter($event) {
    $event.forEach(ele => {
      if (!ele.description) {
        ele.description = '-';
      }
      if (this.RWFlag) {
        ele.static = '';
        if (ele.isEditAllowed) {
          ele.static += `<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
          <span class="icon-tag size-20" title="Edit"></span>
          </div>&nbsp;`;
        }
        if (ele.isDeleteAllowed) {
          ele.static += `<div class="card icon-card-list red-bg mb-2" title="Delete">
          <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
          </div>`;
        }
      }
    });
  }

  getNode($event) {
    let action = $event.event.target.title;
    if (action === 'Edit') {
      this.router.navigate(['/user/question-categories/edit', $event.item.questionCategoryId], { queryParams: this.filteredObj });
    }
    if (action === 'Delete') {
      this.questionCategoryId = $event.item.questionCategoryId;
      this.openPopup(this.deleteCategoryRef, 'xs');
      this.questionCategory = $event.item.questionCategory;
    }
  }

  deleteCategory() {
    this.spinner.show();
    this.questionCategoryService.deleteCategory(this.questionCategoryId).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Question category deleted successfully!');
        this.reloadDatatable();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
      this.modalRef.close();
    },
      err => {
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
        this.modalRef.close();
        this.spinner.hide();
      });
  }

  openPopup(div, size) {
    this.modalRef = this.modalService.open(div, {
      size: size,
      windowClass: 'smallModal',
      backdrop: 'static',
      keyboard: false
    });
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

  addNewCategory() {
    this.router.navigate(['/user/question-categories/add'], { queryParams: this.filteredObj });
  }

  filterObj(obj: any) {
    this.filteredObj = obj;
  }

}
