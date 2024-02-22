import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { LoginService } from 'src/app/services/util/login.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title = 'wearables';
  screenHeight: number;
  modalRef2: NgbModalRef;
  //public config: PerfectScrollbarConfigInterface = {};

  public innerWidth: any;
  public defaultSidebar: any;
  public showMobileMenu = true;
  public expandLogo = false;
  public sidebartype = 'full';
  userProfileData: any;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  roleArr: any;

  constructor(
    private loginService: LoginService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    //  this.loadMenus();
    if (!this.userDataService.getUserId()) {
      this.loginService.userLogOut();
      return;
    }
    this.defaultSidebar = this.sidebartype;
    this.handleSidebar();
    this.userProfileData = this.userDataService.getUserDetails();
    if (this.userProfileData.roleName.includes(',')) {
      this.roleArr = this.userProfileData.roleName.split(",")
    }
    else {
      this.roleArr = [];
    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleSidebar();
  }

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.sidebartype = 'mini-sidebar';
      $('#main-wrapper').addClass('smallMenu');
    } else {
      this.sidebartype = this.defaultSidebar;
      $('#main-wrapper').removeClass('smallMenu');
    }
  }

  toggleSidebarType() {
    switch (this.sidebartype) {
      case 'full':
        this.sidebartype = 'mini-sidebar';
        $('#main-wrapper').addClass('smallMenu');
        break;

      case 'mini-sidebar':
        this.sidebartype = 'full';
        $('#main-wrapper').removeClass('smallMenu');
        break;
      default:
    }
  }

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  openPopup(div, size) {
    this.modalRef2 = this.modalService.open(div, {
      size: size,
      windowClass: 'smallModal',
      backdrop: 'static',
      keyboard: false
    });
  }

  enable() {
    this.spinner.show();
    this.loginService.userLogOut();
  }

  logout() {
    this.openPopup(this.archiveContent, 'xs');
  }

  changePwd() {
    document.getElementById("myDropdown").classList.remove("show");
    document.getElementById("myDropdown").classList.add("hide");
  }

  moveToIssueTracker() {
    this.spinner.show();
    this.userDataService.getIssueTrackerUrl().subscribe((res: any) => {
      if (res.status.success === true) {
        window.open(res.response);
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      console.log(err);
      this.toastr.error(err.error?.error_description || err.error?.error || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }
}
