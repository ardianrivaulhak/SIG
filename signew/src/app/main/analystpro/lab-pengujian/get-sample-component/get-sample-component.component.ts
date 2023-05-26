import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogRef,
} from "@angular/material/dialog";
import { ComplainService } from "app/main/analystpro/complain/complain.service";
import * as global from "app/main/global";

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
    selector: "app-get-sample-component",
    templateUrl: "./get-sample-component.component.html",
    styleUrls: ["./get-sample-component.component.scss"],
})
export class GetSampleComponentComponent implements OnInit {
    memoexp;
    idtechdet;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<GetSampleComponentComponent>,
        private _complainServ: ComplainService
    ) {
        if (data) {
            this.idtechdet = data.idtechdet;
            this.memoexp = data.memo;
        }
    }

    ngOnInit(): void {}

    saveclose(v) {
        switch (v) {
            case "save":
                let data = {
                    memoexp: this.memoexp,
                    idtechdet: this.idtechdet,
                };
                console.log(data);
                global.swalyousure("data cant revert").then((e) => {
                    if (e.isConfirmed) {
                        this._complainServ
                            .setComplainMemoPrep(data)
                            .then(async (x) => {
                                await global.swalsuccess(
                                    "Success",
                                    "Saving Success"
                                );
                                await this._dialogRef.close();
                            });
                    }
                });
                break;
            case "close":
                this._dialogRef.close();
                break;
        }
    }
}
