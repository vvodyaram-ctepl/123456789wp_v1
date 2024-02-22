import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetsService } from '../../assets.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddUserService } from 'src/app/clinical-users/components/add-user.service';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss']
})

export class AssetsListComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  RWFlag: boolean;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  @ViewChild('unassignPopupTemplate') unassignPopupTemplate: ElementRef;
  modalRef2: NgbModalRef;
  selectedItem: any = '';
  public showDataTable: boolean = false;
  selectedName: any = '';
  modalRef: NgbModalRef;

  filteredObj: any;
  filterParams: any = {};
  deviceNumber: any;
  selectedStudy: any;
  deviceId: any;

  selectable: object = {
    title: '',
    selectAll: true
  };

  selectedAssets: any[] = [];
  @ViewChild('assignUnassignStudy') assignUnassignStudy: ElementRef;
  assignUnassignStudyForm: FormGroup;
  studyArr = [];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
    private assetsService: AssetsService,
    private addUserService: AddUserService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((obj: any) => {
      this.filterParams = obj;
    });

    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    let menuActionId = '';
    userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "17") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "deviceType", label: "Asset Type", checked: true, clickable: true, sortable: true },
      { key: "deviceModel", label: "Asset Model", checked: true, sortable: true },
      { key: "deviceNumber", label: "Asset Number", checked: true, sortable: true },
      { key: "mfgfirm", label: "Manufacturer Firmware", checked: true, sortable: true },
      { key: "study", label: "Study", checked: true, sortable: true },
      { key: "location", label: "Asset Location", checked: true, sortable: true },
      // { key: "isActive", label: "Status", checked: true },
      { key: "status", label: "Asset Status", checked: true },
      { key: "static", label: '', clickable: true, checked: true }
    ];
    this.filterTypeArr =
      [{
        name: "Study",
        id: "Study"
      },
      {
        name: "Asset Type",
        id: "deviceType"
      },
      {
        name: "Asset Status",
        id: "assetStatus"
      }
      ];
    this.showDataTable = true;
  }

  formatter($event) {
    $event.forEach(ele => {
      ele.id = ele.rnum;
      // if (ele.isActive == true) {
      //   ele.isActive = "Active";
      //   ele['columnCssClass']['isActive'] = "active-status";
      // } else {
      //   ele.isActive = "Inactive";
      //   ele['columnCssClass']['isActive'] = "inactive-status";
      // }
      if (ele.statusId == '1') {
        // ele.statusId = "Discarded";
        ele['columnCssClass']['status'] = "off-status";
      }
      if (ele.statusId == '2') {
        // ele.statusId = "Available";
        ele['columnCssClass']['status'] = "active-status";
      }
      if (ele.statusId == '3') {
        // ele.statusId = "Testing";
        ele.status = "In Testing";
        ele['columnCssClass']['status'] = "testing-status";
      }
      if (ele.statusId == '4') {
        // ele.statusId = "Allocated";
        ele['columnCssClass']['status'] = "info-status";
      }
      if (ele.statusId == '5') {
        // ele.statusId = "Allocated";
        ele['columnCssClass']['status'] = "study-status";
      }
      if (ele.statusId == '6') {
        ele['columnCssClass']['status'] = "unassigned-status";
      }
      if (ele.statusId == '7') {
        ele['columnCssClass']['status'] = "broken-status";
      }
      if (ele.statusId == '8') {
        ele['columnCssClass']['status'] = "missing-status";
      }
      if (ele.statusId == '9') {
        ele['columnCssClass']['status'] = "returned-status";
      }
      if (ele.statusId == '10') {
        ele['columnCssClass']['status'] = "reserved-status";
      }
      if (this.RWFlag) {
        ele.static = `
        </div>&nbsp;<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
        <span class="icon-tag size-20" title="Edit"></span>
        </div>&nbsp;${((ele.statusId == '4' || ele.statusId == '5')) ? `<div class="card icon-card-list red-bg mb-2 mr-2 pl-1"  title="Unassign">
        <span class="icon-unassigned size-12" title="Unassign"></span>
        </div>&nbsp;` : ``}<div class="card icon-card-list red-bg mb-2" title="Delete">
        <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
        </div>`
      }

      // To show checkbox only for available and reserved statuses
      if (ele.statusId != '2' && ele.statusId != '10')
        ele.hideCheckbox = true;
    });
  }

  getNode($event) {

    if ($event.header === 'deviceType') {
      this.router.navigate(['/user/assets/management/view', $event.item.deviceId], { queryParams: this.filteredObj });
    }
    let action = $event.event.target.title;
    // if (action === 'View') {
    //   this.router.navigate(['/user/assets/management/view', $event.item.deviceId]);
    // }
    if (action === 'Edit') {
      this.router.navigate(['/user/assets/management/edit', $event.item.deviceId], { queryParams: this.filteredObj });
    }
    if (action === 'Delete') {
      this.openPopup(this.archiveContent, 'xs');
      this.selectedItem = $event.item.deviceId;
      this.selectedName = $event.item.deviceNumber;
    }
    if (action === 'Unassign') {

      this.deviceNumber = $event.item.deviceNumber;
      this.selectedStudy = $event.item.studyId;
      this.deviceId = $event.item.deviceId;
      //   this.selectedPet = $event.item.petId;
      this.modalRef = this.modalService.open(this.unassignPopupTemplate, {
        size: 'xs',
        windowClass: 'smallModal'
      });
      this.modalRef.result.then((result) => {
      }, (reason) => {
      });
    }
  }

  openPopup(div, size) {
    this.modalRef2 = this.modalService.open(div, {
      size: size,
      windowClass: 'smallModal',
      backdrop: 'static',
      keyboard: false
    });
  }

  deleteRecord(selectedItem) {
    this.spinner.show();
    this.assetsService.deleteRecord(`/api/assets/${selectedItem}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Asset deleted successfully!');
        this.reloadDatatable();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
      this.modalRef2.close();
    }, err => {
      this.spinner.hide();
      this.modalRef2.close();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    }
    )
  }

  addAssets() {
    this.router.navigate(['/user/assets/management/add'], { queryParams: this.filteredObj });
  }

  bulkUpload() {
    this.router.navigate(['/user/assets/management/bulk-upload'], { queryParams: this.filteredObj });
  }

  // To get the selected assets
  selectedRecords(event: any) {
    this.selectedAssets = [];
    event.forEach((asset: any) => {
      this.selectedAssets.push({ studyId: asset.studyId, statusId: asset.statusId, status: asset.status, study: asset.study, deviceId: asset.deviceId, deviceNumber: asset.deviceNumber });
    });
  }

  // To validate and open pop-up
  assignOrUnassign() {
    this.assignUnassignStudyForm = this.fb.group({
      'study': ['', [Validators.required]]
    });

    if (!this.selectedAssets.length) {
      this.toastr.error("Please select the assets to re-assign a study");
      return;
    }

    /* let selectedHaveSameStatus = this.selectedAssets.every((asset: any) => asset.statusId == this.selectedAssets[0].statusId);
    if (!selectedHaveSameStatus) {
      this.toastr.error("Selected assets must have same status");
      return;
    } */

    /* let selectedHaveSameStudy: any;
    if (this.selectedAssets[0].statusId == '10') {
      selectedHaveSameStudy = this.selectedAssets.every((asset: any) => asset.studyId == this.selectedAssets[0].studyId);

      if (!selectedHaveSameStudy) {
        this.toastr.error("Selected assets must have same study");
        return;
      }
    }
    else {
      this.assignUnassignStudyForm.get('study').setValidators([Validators.required]);
    } */

    this.spinner.show();
    this.addUserService.getStudy('/api/study/getStudyList', { params: { includeFuture: 'Yes', includeVirtual: 'No' } }).subscribe(res => {
      this.studyArr = res.response.studyList;
      this.studyArr.unshift({ studyId: '', studyName: 'No Study' });
      this.spinner.hide();

    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
    });

    this.openPopup(this.assignUnassignStudy, 'xs');
  }

  // To complete validations and save the data
  assignUnassignSubmit() {
    if (!this.assignUnassignStudyForm.valid) {
      this.assignUnassignStudyForm.markAllAsTouched();
      return;
    }

    let studyId = this.assignUnassignStudyForm.value.study.studyId;
    let studyName = this.assignUnassignStudyForm.value.study.studyName;

    /* if (this.selectedAssets[0]?.studyId == studyId) {
      this.toastr.error("Study assignment should not be same as previous. Please select another study");
      return;
    } */

    this.spinner.show();
    this.assetsService.assignOrUnassignStudy({ assets: this.selectedAssets, studyId, studyName }).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Asset(s) updated successfully!');
        this.reloadDatatable();
        this.modalRef2.close();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

  filterObj(obj: any) {
    this.filteredObj = obj;
  }

  dismiss(event) {
    this.modalRef.close();
    if (event) this.reloadDatatable();
  }
}
