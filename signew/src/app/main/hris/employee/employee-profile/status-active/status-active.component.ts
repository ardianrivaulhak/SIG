import { Component, OnInit, Inject } from "@angular/core";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    FormArray,
    Form,
} from "@angular/forms";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import * as global from "app/main/global";
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

@Component({
    selector: "app-status-active",
    templateUrl: "./status-active.component.html",
    styleUrls: ["./status-active.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class StatusActiveComponent implements OnInit {

  statusdesc= [];

  datastatusnotactive = [
    {
        id: 1,
        title: 'Mengundurkan diri'
    },
    {
        id: 2,
        title: 'Pemutusan Hubungan Kerja (PHK)'
    },
    {
        id: 3,
        title: 'Meninggal Dunia'
    },
    {
        id: 4,
        title: 'Pensiun'
    },
    {
        id: 5,
        title: 'Habis Kontrak'
    },
    {
        id: 6,
        title: 'Mutasi PT Lain'
    }
  ]

    sendingDet = {
        st: null,
        from: null,
        employee_id: null,
        desc: null
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<StatusActiveComponent>,
        private _employeeServ: EmployeeService
    ) {
        if (data) {
            this.sendingDet.employee_id = data.employee_id;
        }
    }

    ngOnInit(): void {
    }



    

    async savingdata() {
        if (
            this.sendingDet.st &&
            this.sendingDet.from 
        ) {
            await global.swalyousure("Will Sending the data").then((x) => {
                if (x.isConfirmed) {
                    this._employeeServ
                        .setDataStatusActive(this.sendingDet)
                        .then((x) =>
                            global.swalsuccess("success", "Success Adding Data")
                        )
                        .then(() => this.dialogRef.close())
                        .catch((e) => global.swalerror("Error at database"));
                }
            });
        } else {
            await global.swalerror("ada data yang belum terisi");
        }
    }
}
