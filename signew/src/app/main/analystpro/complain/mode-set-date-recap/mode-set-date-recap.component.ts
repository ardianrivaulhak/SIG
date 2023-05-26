import { Component, OnInit } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
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
import * as _moment from "moment";
import * as global from "app/main/global";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
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
  selector: 'app-mode-set-date-recap',
  templateUrl: './mode-set-date-recap.component.html',
  styleUrls: ['./mode-set-date-recap.component.scss']
})
export class ModeSetDateRecapComponent implements OnInit {

  from;
  to;
  loadingprev = false;

  constructor(
    private _dialogRef: MatDialogRef<ModeSetDateRecapComponent>,
  ) { }

  ngOnInit(): void {
  }

  setDate() {
    this._dialogRef.close({from: this.from, to: this.to})
  }

}
