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
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource } from "@angular/material/table";
import * as _moment from "moment";
import { AttendanceService } from "../attendance.service";
import { DayoffAddModalsComponent } from "../dayoff-add-modals/dayoff-add-modals.component";
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
    selector: "app-dayoff-modals",
    templateUrl: "./dayoff-modals.component.html",
    styleUrls: ["./dayoff-modals.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class DayoffModalsComponent implements OnInit {
    datadayoff = [];

    displayedColumns: string[] = [
        "no",
        "date",
        "status",
        "desc",
        "type",
        "action",
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<DayoffModalsComponent>,
        private _attServ: AttendanceService,
        private _dialog: MatDialog
    ) {
        this.getData();
    }

    ngOnInit(): void {}

    getData() {console.log(this.datadayoff)
        this._attServ
            .getDayOff()
            .then((d) => (this.datadayoff = this.datadayoff.concat(d)));
    }

    addDataDayoff() {
        let dialogCust = this._dialog.open(DayoffAddModalsComponent, {
            height: "auto",
            width: "400px",
            data: "add",
        });

        dialogCust.afterClosed().subscribe(async (result) => {
          this.resetData()
        });
    }

    editData(v) {
        let dialogCust = this._dialog.open(DayoffAddModalsComponent, {
            height: "auto",
            width: "400px",
            data: v,
        });

        dialogCust.afterClosed().subscribe(async (result) => {
          this.resetData()
        });
    }

    deleteData(v){
      global.swalyousure('Deleting Data ?').then(x => {
        if(x.isConfirmed){
          this._attServ.deleteDataDayoff(v.id)
          .then(xx => global.swalsuccess('success','Deleting Data'))
          .then(() => this.resetData())
        }
      })
    }

    resetData(){
      this.datadayoff = [];
            this.getData();
    }
}
