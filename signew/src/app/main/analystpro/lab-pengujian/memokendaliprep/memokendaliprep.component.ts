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
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { LabPengujianService } from "../lab-pengujian.service";
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
    selector: "app-memokendaliprep",
    templateUrl: "./memokendaliprep.component.html",
    styleUrls: ["./memokendaliprep.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class MemokendaliprepComponent implements OnInit {
    dataMemo = [];
    loading = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<MemokendaliprepComponent>,
        private _labTransactionServ: LabPengujianService
    ) {
        if (data) {
            console.log(data);
            this.getDataMemo(data.id_kontrakuji);
        }
    }

    ngOnInit(): void {}

    getDataMemo(v) {
        this._labTransactionServ.getMemoLab(v).then(b => {
          this.dataMemo = this.dataMemo.concat(b);
        })
        .then(() => this.loading = false);
    }
}
