import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { LabReportService } from "./lab-report.service";
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

export interface labformArr {
    kode_sample: string;
    jumlah_parameter: number;
    jumlah_sample: number;
    contracttype: string;
    bulan: string;
}

@Component({
    selector: "app-lab-report",
    templateUrl: "./lab-report.component.html",
    styleUrls: ["./lab-report.component.scss"],
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
export class LabReportComponent implements OnInit {
    date = _moment();
    labform: labformArr[];
    displayedColumns: string[] = [
        "bulan",
        "kode_sample",
        "jumlah_parameter",
        "jumlah_sample",
        "contracttype",
    ];
    loading = true;

    constructor(private _labReportServ: LabReportService) {}

    ngOnInit(): void {
        this.getDataPivotParameterSample();
    }

    getDataPivotParameterSample() {
        this._labReportServ
            .getDataPivotSampleParameter({
                from: `${_moment(this.date).format("YYYY")}-${_moment(
                    this.date
                ).format("MM")}-01`,
                to: `${_moment(this.date).format("YYYY")}-${_moment(
                    this.date
                ).format("MM")}-31`,
            })
            .then((e: any) => (this.labform = e))
            .then(() =>
                setTimeout(() => {
                    this.loading = false;
                }, 500)
            );
    }

    setMonthAndYear(
        normalizedMonthAndYear: _moment.Moment,
        datepicker: MatDatepicker<_moment.Moment>
    ) {
        this.loading = true;
        const ctrlValue = this.date!;
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date = _moment(ctrlValue);
        datepicker.close();
        this.getDataPivotParameterSample();
    }

    async export() {
        const fileName = await `Jumlah Sample & Parameter ${_moment(
            this.date
        ).format("MMM-YYYY")}.xlsx`;
        const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(this.labform);
        const wb: XLSX.WorkBook = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(
            wb,
            ws,
            `Data ${_moment(this.date).format("MMM-YYYY")}`
        );
        await XLSX.writeFile(wb, fileName);
    }

    gettotalujmlahparameter(){
      return this.labform.map(a => a.jumlah_parameter).reduce((a,b) => a + b);
    }

    gettotalujmlahsample(){
      return this.labform.map(a => a.jumlah_sample).reduce((a,b) => a + b);
    }
    
}
