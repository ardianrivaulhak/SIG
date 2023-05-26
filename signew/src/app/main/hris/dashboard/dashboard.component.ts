import { FormControl } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import { Component, OnInit } from "@angular/core";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ModalLateComponent } from "app/main/hris/dashboard/modal-late/modal-late.component";
import { ModalLateYesterdayComponent } from "app/main/hris/dashboard/modal-late-yesterday/modal-late-yesterday.component";
import { ModalLateMonthComponent } from "app/main/hris/dashboard/modal-late-month/modal-late-month.component";
import { ModalLateYearComponent } from "app/main/hris/dashboard/modal-late-year/modal-late-year.component";
import { DashboardService } from "./dashboard.service";
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
import * as _rollupMoment from "moment";
import { EventEmitter } from "events";
// declare global {
//     interface Window { MyNamespace: any; }
// }

// window.MyNamespace = window.MyNamespace || {};

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

export const MY_FORMATS2 = {
    parse: {
        dateInput: "MM/YYYY",
    },
    display: {
        dateInput: "MM/YYYY",
        monthYearLabel: "MMM YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "MMMM YYYY",
    },
};

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
    ],
})
export class DashboardComponent implements OnInit {
    [x: string]: any;
    date = new FormControl(moment());
    ctrlValue: any;

    // options
    legend: boolean = false;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = false;
    xAxisLabel: string = "Year";
    yAxisLabel: string = "Total Late";
    timeline: boolean = true;
    view: any[] = [750, 400];
    locWData: any[];
    select_tab = '1';
    statustop = [
        {
            id: "1",
            name: "Top Late",
        },
        {
            id: "2",
            name: "Top Sick",
        },
        {
            id: "3",
            name: "Top Permission",
        },
        {
            id: "4",
            name: "Top Leave",
        },
    ];

    //variable years
    now = new Date();
    today = _moment(this.now).format("YYYY-MM-DD");
    yesterday = _moment(this.now).subtract(1, "days").format("YYYY-MM-DD");
    startOfMonth = _moment().clone().startOf("month").format("YYYY-MM-DD");
    endOfMonth = _moment().clone().endOf("month").format("YYYY-MM-DD");
    yearsnow = this.now.getFullYear();
    fromyears = _moment(`${this.yearsnow}-01-01`).format("YYYY-MM-DD");
    toyears = _moment(`${this.yearsnow}-12-31`).format("YYYY-MM-DD");

    colorScheme = {
        domain: ["#3B83F7"],
    };

    PercentlateYesterday: number;
    PercentlateMonth: number;
    PercentlateYear: number;

    constructor(
        private _dashboardtop: DashboardService,
        private _dialog: MatDialog
    ) {}

    onSelect(data): void {
        console.log("Item clicked", JSON.parse(JSON.stringify(data)));
    }

    onActivate(data): void {
        console.log("Activate", JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data): void {
        console.log("Deactivate", JSON.parse(JSON.stringify(data)));
    }

    // open modal
    setLateView() {
        let dialogCust = this._dialog.open(ModalLateComponent, {
            height: "500px",
            width: "1000px",
        });
    }

    setLateViewYesterday() {
        let dialogCust = this._dialog.open(ModalLateYesterdayComponent, {
            height: "500px",
            width: "1000px",
        });
    }

    setLateViewMonth() {
        let dialogCust = this._dialog.open(ModalLateMonthComponent, {
            height: "500px",
            width: "1000px",
        });
    }

    setLateViewYear() {
        let dialogCust = this._dialog.open(ModalLateYearComponent, {
            height: "500px",
            width: "1000px",
        });
    }
    // end open modal

    ngOnInit(): void {
        // Top Late
        this.getToplateData();
        // Total Late
        this.getTotalLateToday();
        this.getTotalLateYesterday();
        this.getTotalLateMonth();
        this.getTotalLateYears();
        //  Persen Total Late
        this.getPercentLateToday();
        this.getPercentlateYesterday();
        this.getPercentLateMonth();
        this.getChartAttendance();
    }
    // Top
    datatoplate = [];
    datatopsick = [];
    datatopalpha = [];
    datatopcuti = [];
    datatoday = {
        ontime: 'number',
        late: 'number',
        percent: '0.00',
    };
    datayesterday = {
        ontime: 'number',
        late: 'number',
        percent: '0.00',
    };
    datamonth = {
        ontime: 'number',
        late: 'number',
        percent: '0.00',
    };
    datayear = {
        ontime: 'number',
        late: 'number',
        percent: '0.00',
    };
    multi = [];
    // Persen Late

    setMonthAndYear(
        normalizedMonthAndYear: _moment.Moment,
        datepicker: MatDatepicker<_moment.Moment>
    ) {
        const ctrlValue = this.date.value!;
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date.setValue(ctrlValue);
        datepicker.close();
        this.getChartAttendance();
    }

    async getChartAttendance() {
        this.multi = await [];
        await this._dashboardtop
            .getChartAttendance({
                month: this.date.value.month() + 1,
                year: this.date.value.year(),
            })
            .then((x) => {
                this.multi = this.multi.concat(x);
            });
    }

    async onSelectChange(event) {
        this.datatoplate = [];
        if (event.value === "1") {
            await this.getToplateData();
        } else if (event.value === "2") {
            await this.getTopsickData();
        } else if (event.value === "3") {
            await this.getTopijinData();
        } else if (event.value === "4") {
            await this.getTopcutiData();
        }
    }

    // Top Late
    async getToplateData() {
        await this._dashboardtop
            .getToplateData({
                from: this.fromyears,
                to: this.toyears,
                statusattendance: 2,
            })
            .then((x) => {
                this.datatoplate = this.datatoplate.concat(x);
            });
    }

    // Top Sick
    async getTopsickData() {
        await this._dashboardtop
            .getTopsickData({
                from: this.fromyears,
                to: this.toyears,
                statusattendance: 1,
            })
            .then((x) => {
                this.datatoplate = this.datatoplate.concat(x);
            });
    }

    // Top Ijin
    async getTopijinData() {
        await this._dashboardtop
            .getTopijinData({
                from: this.fromyears,
                to: this.toyears,
                statusattendance: 4,
            })
            .then((x) => {
                this.datatoplate = this.datatoplate.concat(x);
            });
    }

    // Top Ijin
    async getTopcutiData() {
        await this._dashboardtop
            .getTopijinCuti({
                from: this.fromyears,
                to: this.toyears,
                statusattendance: 13,
            })
            .then((x) => {
                this.datatoplate = this.datatoplate.concat(x);
            });
    }


    
    async getPercentLateToday() {}
    async getTotalLateToday() {
        await this._dashboardtop
            .getTotalLateToday({
                from: this.today,
                to: this.today,
            })
            .then((x: any) => {
                let ontimeto =
                    x.filter((i) => i.status === "On Time").length > 0
                        ? x.filter((i) => i.status === "On Time")[0].total
                        : 0;
                let lateto =
                    x.filter((g) => g.status === "Late (L)").length > 0
                        ? x.filter((g) => g.status === "Late (L)")[0].total
                        : 0;

                this.datatoday = {
                    ontime: ontimeto,
                    late: lateto,
                    percent: ((lateto / (ontimeto + lateto)) * 100.0).toFixed(2),
                };
            });
    }

    async getPercentlateYesterday() {}
    async getTotalLateYesterday() {
        await this._dashboardtop
            .getTotalLateYesterday({
                from: this.yesterday,
                to: this.yesterday,
            })
            .then((x: any) => {
                let ontimeto =
                    x.filter((i) => i.status === "On Time").length > 0
                        ? x.filter((i) => i.status === "On Time")[0].total
                        : 0;
                let lateto =
                    x.filter((g) => g.status === "Late (L)").length > 0
                        ? x.filter((g) => g.status === "Late (L)")[0].total
                        : 0;

                this.datayesterday = {
                    ontime: ontimeto,
                    late: lateto,
                    percent: ((lateto / (ontimeto + lateto)) * 100.0).toFixed(2),
                };
            });
    }

    async getPercentLateMonth() {}
    async getTotalLateMonth() {
        await this._dashboardtop
            .getTotalLateMonth({
                from: this.startOfMonth,
                to: this.endOfMonth,
            })
            .then((x: any) => {
                let ontimeto =
                    x.filter((i) => i.status === "On Time").length > 0
                        ? x.filter((i) => i.status === "On Time")[0].total
                        : 0;
                let lateto =
                    x.filter((g) => g.status === "Late (L)").length > 0
                        ? x.filter((g) => g.status === "Late (L)")[0].total
                        : 0;

                this.datamonth = {
                    ontime: ontimeto,
                    late: lateto,
                    percent: ((lateto / (ontimeto + lateto)) * 100.0).toFixed(2),
                };
            });
    }

    async getPercentLateYear() {}
    async getTotalLateYears() {
        await this._dashboardtop
            .getTotalLateYears({
                from: this.fromyears,
                to: this.toyears,
            })
            .then((x: any) => {
                let ontimeto =
                    x.filter((i) => i.status === "On Time").length > 0
                        ? x.filter((i) => i.status === "On Time")[0].total
                        : 0;
                let lateto =
                    x.filter((g) => g.status === "Late (L)").length > 0
                        ? x.filter((g) => g.status === "Late (L)")[0].total
                        : 0;

                this.datayear = {
                    ontime: ontimeto,
                    late: lateto,
                    percent: ((lateto / (ontimeto + lateto)) * 100.0).toFixed(2),
                };
            });
    }

    Percentlatetoday: number;

    // Display Data Top Late
    displayedColumns: string[] = [
        "no",
        "employee_name",
        "total_late",
        "division_name",
    ];
}
