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
import { AttendanceService } from "../attendance.service";
import * as _moment from "moment";
import * as global from "app/main/global";

@Component({
    selector: "app-set-status-more",
    templateUrl: "./set-status-more.component.html",
    styleUrls: ["./set-status-more.component.scss"],
})
export class SetStatusMoreComponent implements OnInit {
    statusattendance = [];
    button = "Save";
    employeename;
    status;
    status_plg;
    description;
    tablegetdata = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<SetStatusMoreComponent>,
        private attendanceServ: AttendanceService
    ) {
        if (data) {
            this.employeename = data.data[0].employee.employee_name;
            this.tablegetdata = this.tablegetdata.concat(data.data);
            this.dialogRef.backdropClick().subscribe(() => {
                this.dialogRef.close();
            });
        }
    }

    ngOnInit(): void {
        this.getDataStatusAttendance();
    }

    setFormTgl(v) {
        return _moment(v).format("DD/MM/YYYY");
    }

    setFormTime(v) {
        return _moment(v).format("HH:MM:SS");
    }

    exitModal(v?) {
        return this.dialogRef.close(v);
    }

    getDataStatusAttendance() {
        this.attendanceServ
            .getStatusAbsen()
            .then(
                (h) =>
                    (this.statusattendance = this.statusattendance.concat(
                        h["data"]
                    ))
            );
    }

    savedata() {
        global.swalyousure("wont revert data").then((x) => {
            if (x.isConfirmed) {
                this.tablegetdata = this.tablegetdata.map((p) => ({
                    ...p,
                    status: this.status,
                    status_plg: this.status_plg,
                    desc: this.description ? this.description : "-",
                }));

                this.attendanceServ
                    .changinDataByCheck({ data: this.tablegetdata })
                    .then((x) =>
                        global.swalsuccess("success", "Saving Success")
                    )
                    .catch((e) => global.swalerror("Error at database"));
            }
        });
    }

    // setSendDate(v) {
    //     let ddate = new Date(v);
    //     return `${ddate.getFullYear()}-${this.addZero(
    //         ddate.getMonth() + 1
    //     )}-${this.addZero(ddate.getDate())}`;
    // }

    // addZero(i) {
    //     return i < 10 ? `0${i}` : i;
    // }
}
