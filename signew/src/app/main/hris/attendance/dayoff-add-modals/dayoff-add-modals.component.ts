import {
    Component,
    OnInit,
    Inject,
    ViewChild,
    ElementRef,
} from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import * as global from "app/main/global";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { AttendanceService } from "../attendance.service";
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
    selector: "app-dayoff-add-modals",
    templateUrl: "./dayoff-add-modals.component.html",
    styleUrls: ["./dayoff-add-modals.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class DayoffAddModalsComponent implements OnInit {
    send = {
        id: null,
        date: null,
        status: null,
        type: null,
        desc: null,
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<DayoffAddModalsComponent>,
        private _attServ: AttendanceService,
    ) {
        if (data) {
            if(data !== 'add'){
              this.setData(data);
            }
        }
    }

    ngOnInit(): void {}

    async save(va?) {
        if (
            this.send.date &&
            this.send.desc &&
            this.send.status &&
            this.send.type
        ) {
            await global.swalyousure("Sure ?").then(async (xx) => {
                if (xx.isConfirmed) {
                    this.send.date = await _moment(this.send.date).format(
                        "YYYY-MM-DD"
                    );
                    await this._attServ
                        .addDataDayoff(this.send)
                        .then((x) =>
                            global.swalsuccess("success", "Saving data")
                        )
                        .then(() => this.dialogRef.close())
                        .catch((k) =>
                            global.swalerror(
                                "error at backend, please contact IT"
                            )
                        );
                }
            });
        } else {
            global.swalerror("Harap isi semua form dengan benar");
        }
    }

    cancel(){
      this.dialogRef.close();
    }

    setData(v){
      this.send = {
        id: v.id,
        date: v.date,
        status: v.status,
        type: v.type,
        desc: v.desc
      }
    }
}
