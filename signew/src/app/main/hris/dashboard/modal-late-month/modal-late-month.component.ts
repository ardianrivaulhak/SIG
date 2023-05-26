import { Component, OnInit } from '@angular/core';
import {ModalLateMonthService} from 'app/main/hris/dashboard/modal-late-month/modal-late-month.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";
import { totalmem } from "os";

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  MatDatepickerInputEvent,
  MatCalendarCellCssClasses,
} from "@angular/material/datepicker";
import * as XLSX from "xlsx";
import {
  MomentDateModule,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { Console } from "console";
import * as _moment from "moment";
export const MY_FORMATS = {
  parse: {
      dateInput: "LL",
  },
  display: {
      dateInput: "DD/MM/YYYY",
      monthYearLabel: "YYYY",
      dateA11yLabel: "LL",
      monthYearA11yLabel: "YYYY",
  },
};

@Component({
  selector: 'app-modal-late-month',
  templateUrl: './modal-late-month.component.html',
  styleUrls: ['./modal-late-month.component.scss']
})
export class ModalLateMonthComponent implements OnInit {

  //variable years
  now = new Date();
  today = _moment(this.now).format('YYYY-MM-DD');
  yesterday = _moment(this.now).subtract(1,'days').format('YYYY-MM-DD');
  startOfMonth = _moment().clone().startOf('month').format('YYYY-MM-DD');
  endOfMonth =  _moment().clone().endOf('month').format('YYYY-MM-DD');    
  yearsnow = this.now.getFullYear();
  fromyears = _moment(`${this.yearsnow}-01-01`).format('YYYY-MM-DD');
  toyears = _moment(`${this.yearsnow}-12-31`).format('YYYY-MM-DD');

  constructor(
    private _showlate: ModalLateMonthService,
  ) { }

  datashowlatemonth =[];


  ngOnInit(): void {
    this.getLateMonth();
  }
  async getLateMonth(){
    await this._showlate.getLateMonth({
      from:this.startOfMonth,
      to:this.endOfMonth,
  }).then((x) => {
      this.datashowlatemonth = this.datashowlatemonth.concat(x);
  });
  }

  displayedColumns: string[] = [
    "no",
    "employee_name",
    "total_late",
    "division_name",
];

}
