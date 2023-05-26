import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialog,
} from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfigService } from "@fuse/services/config.service";
import { url } from "app/main/url";
import { LoginService } from "app/main/login/login.service";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import * as global from "app/main/global";
import { LocalStorage } from "@ngx-pwa/local-storage";
import { Router } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { StatusAttendanceService } from "../../status-attendance/status-attendance.service";
import { LeaveService } from 'app/main/hris/leave/leave.service'

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.scss']
})
export class LeaveDetailComponent implements OnInit {
  detailleave =[];

  constructor(
    private _leave: LeaveService
  ) { }

  ngOnInit(): void {
    this.getLeaveDataDetail;
  }

  getLeaveDataDetail(q) {
    this._leave.getLeaveDataDetail(q.id).then((e) => {
        this.detailleave = this.detailleave.concat(e);
    });
}

}
