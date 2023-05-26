import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MarketingReportService } from "./marketing-report.service";
import { MatDatepicker } from "@angular/material/datepicker";
import * as XLSX from "xlsx";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import { fuseAnimations } from "@fuse/animations";
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
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

export interface markFormArr {
    cust: string;
    total_contract: number;
    biaya: number;
    cat: string;
}

@Component({
    selector: "app-marketing-report",
    templateUrl: "./marketing-report.component.html",
    styleUrls: ["./marketing-report.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
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
export class MarketingReportComponent implements OnInit {
    date = _moment();
    markForm: markFormArr[];
    displayedColumns: string[] = [
        "cust",
        "total_contract",
        "revenue",
        "category",
    ];
    loading = true;

    constructor(private _markServ: MarketingReportService) {}

    ngOnInit(): void {
        this.getDataCategoryMarketing();
    }

    getDataCategoryMarketing() {
        this._markServ
            .getDataCategoryMarketing({
                from: `${_moment(this.date).format("YYYY")}-${_moment(
                    this.date
                ).format("MM")}-01`,
                to: `${_moment(this.date).format("YYYY")}-${_moment(
                    this.date
                ).format("MM")}-31`,
            })
            .then((e: any) => (this.markForm = e))
            .then(() =>
                setTimeout(() => {
                    this.loading = false;
                }, 500)
            );
    }

    getTotalContract(){
      return this.markForm.map(a => a.total_contract).reduce((a,b) => a + b);
    }

    getTotalRevenue(){
      return this.markForm.map(a => a.biaya).reduce((a,b) => a + b);
    }
}
