import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ModalLateYearService} from 'app/main/hris/dashboard/modal-late-year/modal-late-year.service';
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
  selector: 'app-modal-late-year',
  templateUrl: './modal-late-year.component.html',
  styleUrls: ['./modal-late-year.component.scss']
})
export class ModalLateYearComponent implements OnInit {

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
    private _showlate: ModalLateYearService,
  ) { }

  datashowlateyear =[];

  ngOnInit(): void {
    this.getLateYear();
  }
  async getLateYear(){
    await this._showlate.getLateYear({
      from:this.fromyears,
      to:this.toyears,
  }).then((x) => {
    // console.log(x)
      this.datashowlateyear = this.datashowlateyear.concat(x);
  });
  }

  displayedColumns: string[] = [
    "no",
    "employee_name",
    "total_late",
    "division_name",
];

}
