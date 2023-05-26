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
import { FormGroup, FormControl } from "@angular/forms";
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
    selector: "app-desc-modal",
    templateUrl: "./desc-modal.component.html",
    styleUrls: ["./desc-modal.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class DescModalComponent implements OnInit {
    desc;
    employee = [];
    employeechoose;
    statusattendance;
    from;
    to;
    datastatus = [];
    employee_name;
    status_att;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<DescModalComponent>,
        private _attServ: AttendanceService
    ) {
        if (data) {
            console.log(data);
            this.employee = this.employee.concat(data.employee);
        }
    }

    getValEmployee(ev) {
        this.employee_name = ev.employee_name;
    }

    getValStatus(ev) {
        this.status_att = ev.value;
    }

    ngOnInit(): void {
        this.datastatus.push(
            {
                id: 1,
                value: "Sick",
            },
            {
                id: 13,
                value: "Leave",
            },
            {
                id: 4,
                value: "Leave on Permission",
            },
            {
                id: 5,
                value: "Alpha",
            },
            {
                id: 11,
                value: "Maternity Leaves",
            },
            {
                id: 12,
                value: "On Time",
            },
            {
                id: 23,
                value: "Special Leave",
            }
        );
    }

    closeModal(data?) {
        return this.dialogRef.close(data);
    }

    close() {
        this.closeModal();
    }

    saveData() {
        global
            .swalyousure(
                `set ${this.status_att} to ${this.employee_name} from ${_moment(
                    this.from
                ).format("YYYY-MM-DD")} to ${_moment(this.to).format(
                    "YYYY-MM-DD"
                )} ?`
            )
            .then((c) => {
                if (c.isConfirmed) {
                    if (
                        this.employeechoose &&
                        this.statusattendance &&
                        this.from &&
                        this.to
                    ) {
                        let data = {
                            employee_id: this.employeechoose,
                            status: this.statusattendance,
                            from: _moment(this.from).format("YYYY-MM-DD"),
                            to: _moment(this.to).format("YYYY-MM-DD"),
                        };
                        this._attServ
                            .addstatusfromto(data)
                            .then((x: any) => {
                                global.swalsuccess("success", "Data Saved");
                            })
                            .then(() => this.close())
                            .catch(() => global.swalerror("Data Saving Error"));
                    } else {
                        global.swalerror(
                            "Data ada yang kosong, harap lengkapi"
                        );
                    }
                }
            });
    }
}
