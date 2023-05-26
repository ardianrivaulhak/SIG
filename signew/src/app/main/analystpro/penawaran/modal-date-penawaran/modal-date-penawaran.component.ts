import { Component, OnInit, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
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
import { MatDatepicker } from "@angular/material/datepicker";
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
    selector: "app-modal-date-penawaran",
    templateUrl: "./modal-date-penawaran.component.html",
    styleUrls: ["./modal-date-penawaran.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
    ],
})
export class ModalDatePenawaranComponent implements OnInit {
    date = new FormControl(_moment());

    constructor(
      @Inject(MAT_DIALOG_DATA) private data: any,
      private dialogRef: MatDialogRef<ModalDatePenawaranComponent>,
    ) {}

    ngOnInit(): void {}

    setMonthAndYear(
        normalizedMonthAndYear: _moment.Moment,
        datepicker: MatDatepicker<_moment.Moment>
    ) {
        const ctrlValue = this.date.value!;
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date.setValue(ctrlValue);
        datepicker.close();
    }


    close(){
      this.dialogRef.close(this.date.value ? {
        month: _moment(this.date.value).format('YYYY-MM'),
        name: _moment(this.date.value).format('MMMM'),
        year: _moment(this.date.value).format('YYYY')
      } : null)
    }
}
