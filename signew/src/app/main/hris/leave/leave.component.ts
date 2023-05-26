import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from "@angular/forms";
import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { Moment } from "moment";
import { ModalLeaveComponent } from "app/main/hris/leave/modal-leave/modal-leave.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ModalLeaveService } from "app/main/hris/leave/modal-leave/modal-leave.service";
import { LeaveService } from "app/main/hris/leave/leave.service";
import Swal from "sweetalert2";
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
    selector: "app-leave",
    templateUrl: "./leave.component.html",
    styleUrls: ["./leave.component.scss"],
})
export class LeaveComponent implements OnInit {
    date = new FormControl(moment());
    datamentah = [];
    private _dialog: any;
    dataleave = [];

    setMonthAndYear(
        normalizedMonthAndYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = this.date.value!;
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date.setValue(ctrlValue);
        datepicker.close();
    }


  //   displayedColumns: string[] = [
  //     "no",
  //     "employee_name",
  //     "total_late",
  //     "division_name",
  // ];

    displayedColumns: string[] = [
        "employee_name",
        "division_name",
        "inserted_at",
        "statusattendance",
        "details",
        "status_condition",
        // "action",
    ];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    foods: Food[] = [
        { value: "Ijin", viewValue: "Ijin" },
        { value: "Sakit", viewValue: "Sakit" },
        { value: "Cuti", viewValue: "Cuti" },
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _modalleave: ModalLeaveService,
        private _leave: LeaveService
    ) {}

    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.getleavedata();
    }

  async getleavedata() {
    await this._leave.getLeaveData()
          .then((x) => (this.dataleave = this.dataleave.concat(x)))
  }

//   async check() {
//     await this._modalleave
//         .checking_me()
//         .then((x) => (this.me = this.me.concat(x)));
// }

     

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
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        permitdate: "01/01/2023",
        todate: "02/01/2023",
        timeleave: "08:00",
        name: "Super Admin",
        status_leave: "Permission",
        status_approved: "H",
        action: "as",
        division: "Office",
    },
    {
        permitdate: "01/01/2023",
        todate: "02/01/2023",
        timeleave: "08:00",
        name: "Super Admin",
        status_leave: "Sick",
        status_approved: "He",
        action: "as",
        division: "Office",
    },
    {
        permitdate: "01/01/2023",
        todate: "02/01/2023",
        timeleave: "08:00",
        name: "Super Admin",
        status_leave: "Leave",
        status_approved: "Li",
        action: "as",
        division: "Office",
    },
];
