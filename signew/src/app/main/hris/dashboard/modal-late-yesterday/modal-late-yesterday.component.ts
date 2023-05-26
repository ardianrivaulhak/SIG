import { Component, OnInit } from '@angular/core';
import {ModalLateYesterdayService} from 'app/main/hris/dashboard/modal-late-yesterday/modal-late-yesterday.service';
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
  selector: 'app-modal-late-yesterday',
  templateUrl: './modal-late-yesterday.component.html',
  styleUrls: ['./modal-late-yesterday.component.scss']
})
export class ModalLateYesterdayComponent implements OnInit {

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
    private _showlate: ModalLateYesterdayService,
  ) { }
  datashowlateyesterday =[];

  ngOnInit(): void {
    this.getLateYesterday();

  }
  async getLateYesterday(){
    await this._showlate.getLateYesterday({
      from:this.yesterday,
      to:this.yesterday,
  }).then((x) => {
      this.datashowlateyesterday = this.datashowlateyesterday.concat(x);
  });
  }


  displayedColumns: string[] = [
    "no",
    "employee_name",
    "total_late",
    "division_name",
];
}
