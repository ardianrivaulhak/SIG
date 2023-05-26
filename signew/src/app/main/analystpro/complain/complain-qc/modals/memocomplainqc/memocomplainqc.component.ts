import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as global from "app/main/global";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";

import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { ComplainService } from "../../../complain.service";
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
    selector: "app-memocomplainqc",
    templateUrl: "./memocomplainqc.component.html",
    styleUrls: ["./memocomplainqc.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class MemocomplainqcComponent implements OnInit {
    datest;
    idtech;

    constructor(
        public dialogRef: MatDialogRef<MemocomplainqcComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private comServ: ComplainService
    ) {
        if (data) {
            this.datest = _moment(data.estimate_date).format("YYYY-MM-DD");
            this.idtech = data.id_tech;
        }
    }

    ngOnInit(): void {}

    closeandsave(v) {
        switch (v) {
            case "save":
                global.swalyousure("data cant be revert").then((e) => {
                    if (e.isConfirmed) {
                        this.comServ
                            .changedatecomplainest({
                                estdate: _moment(this.datest).format(
                                    "YYYY-MM-DD"
                                ),
                                idtech: this.idtech,
                            })
                            .then((x) =>
                                global.swalsuccess("Success", "Saving Success")
                            )
                            .then(() => this.dialogRef.close())
                            .catch((e) =>
                                global.swalerror("Error at backend, call it")
                            );
                    }
                });

                break;
            case "close":
                this.dialogRef.close();
                break;
        }
    }
}
