import { AfterViewInit, OnInit, ViewChild } from '@angular/core';
import {Component} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import { Moment } from 'moment';
import {ModalLeaveComponent } from "app/main/hris/leave/modal-leave/modal-leave.component";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import * as _moment from "moment";
import * as _rollupMoment from "moment";

const moment = _rollupMoment || _moment;

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

interface Food {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-leave-approvel',
  templateUrl: './leave-approvel.component.html',
  styleUrls: ['./leave-approvel.component.scss']
})
export class LeaveApprovelComponent implements OnInit {

  date = new FormControl(moment());
  private _dialog: any;

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  
  displayedColumns: string[] = ['name', 'division','permitdate','timeleave', 'status_leave','status_approved', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  foods: Food[] = [
    {value: 'Ijin', viewValue: 'Ijin'},
    {value: 'Sakit', viewValue: 'Sakit'},
    {value: 'Cuti', viewValue: 'Cuti'},
  ];

  openModal(){
    let dialogCust = this._dialog.open(ModalLeaveComponent, {
    height: "500px",
    width: "1000px",
});
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {

    this.dataSource.paginator = this.paginator;

  }

}

export interface PeriodicElement {
  name: string;
  division: string;
  permitdate: string;
  todate: string;
  timeleave: string;
  status_leave: string;
  status_approved: string;
  action: string;
  status_in: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {permitdate: '01/01/2023', todate:'02/01/2023', timeleave: '08:00', name: 'Super Admin', status_leave: 'Permission', status_approved: 'H',action:'as', division:'Office', status_in:'Office'},
  {permitdate: '01/01/2023', todate:'02/01/2023', timeleave: '08:00', name: 'Super Admin', status_leave: 'Sick', status_approved: 'He', action:'as', division:'Office', status_in:'Office'},
  {permitdate: '01/01/2023', todate:'02/01/2023', timeleave: '08:00', name: 'Super Admin', status_leave: 'Leave', status_approved: 'Li', action:'as', division:'Office', status_in:'Office'},
];

