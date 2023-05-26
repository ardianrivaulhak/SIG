import { Component, OnInit, Inject } from "@angular/core";
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
import { MomentDateAdapter } from "@angular/material-moment-adapter";
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
    selector: "app-from-to-attendace",
    templateUrl: "./from-to-attendace.component.html",
    styleUrls: ["./from-to-attendace.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class FromToAttendaceComponent implements OnInit {
    from;
    to;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<FromToAttendaceComponent>
    ) {
        if (data) {
            console.log(data);
        }
    }

    ngOnInit(): void {}

    close() {
        this.dialogRef.close();
    }

    save() {
        this.dialogRef.close({
            from: _moment(this.from).format("YYYY-MM-DD"),
            to: _moment(this.to).format("YYYY-MM-DD"),
        });
    }
}
