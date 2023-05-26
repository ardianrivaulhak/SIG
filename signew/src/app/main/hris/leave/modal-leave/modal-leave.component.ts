import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialog,
} from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfigService } from "@fuse/services/config.service";
import { url } from "app/main/url";
import { LoginService } from "app/main/login/login.service";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import * as global from "app/main/global";
import { LocalStorage } from "@ngx-pwa/local-storage";
import { Router } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { StatusAttendanceService } from "../../status-attendance/status-attendance.service";
import { ModalLeaveService } from "./modal-leave.service";

export const MY_FORMATS = {
    display: {
        timeInput: "HH:mm:ss",
        dateInput: "YYYY-MM-DD"
    },
};

@Component({
    selector: "app-modal-leave",
    templateUrl: "./modal-leave.component.html",
    styleUrls: ["./modal-leave.component.scss"],
})
export class ModalLeaveComponent implements OnInit {
    me = [];
    dataleave : any;
    // dataleave = any;

    sendingDet = {
        id_leave: null,
        status_leave: null,
        start_date: null,
        end_date: null,
        clock_in: null,
        clock_out: null,
        desc: null,
        me: null,
    };

    constructor(
        private dialogRef: MatDialogRef<ModalLeaveComponent>,
        private _router: Router,
        private _localStorage: LocalStorage,
        private _employeServ: EmployeeService,
        private _modalleave: ModalLeaveService,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        if (data) {
            this.sendingDet.id_leave = data.id;
            (data.id !== "new")
            // {
            //     this.setData(data);
            // }
        }
    }

    ngOnInit(): void {
        this.check();
    }

    // setData(v){
    //     this._modalleave.getLeaveData(this.sendingDet.id_leave).then((x:any) => {
    //             this.sendingDet = {
    //                 id_leave:x.id,
    //                 me: x.employee_id,
    //                 start_date: x.start_date,
    //                 end_date: x.end_date,
    //                 clock_in: x.clock_in,
    //                 clock_out: x.clock_out,
    //                 desc: x.desc,
    //                 status_leave : x.status_leave,
    //             };
    //     })
    // }


    async check() {
        await this._modalleave
            .checking_me()
            .then((x) => (this.me = this.me.concat(x)));
    }



    async savingdata() {
        if (
            this.sendingDet.status_leave  
        ) {
            this.sendingDet.start_date = await _moment(this.sendingDet.start_date).format(
                "YYYY-MM-DD"
            );
            this.sendingDet.end_date = await _moment(this.sendingDet.end_date).format(
                "YYYY-MM-DD"
            );
            // this.sendingDet.clock_in = await _moment(this.sendingDet.clock_in).format(
            //     "HH:mm:ss"
            // );
            // this.sendingDet.clock_out = await _moment(this.sendingDet.clock_out).format(
            //     "HH:mm:ss"
            // );
            this.sendingDet.clock_in = await this.sendingDet.clock_in
            this.sendingDet.clock_out = await this.sendingDet.clock_out
            this.sendingDet.me = await this.me[0].employee_id
            this.sendingDet.desc = await this.sendingDet.desc
            await global.swalyousure("Will Sending the data").then((x) => {
                if (x.isConfirmed) {
                    this._modalleave
                        .setLeaveAdd(this.sendingDet)
                        .then((x) =>
                            global.swalsuccess("success", "Success Adding Data")
                        )
                        .catch((e) => global.swalerror("Error at database"));
                }
            });
            await this.closeModal();
        } else {
           await global.swalerror("ada data yang belum terisi");
        }
    }

    closeModal() {
        this.dialogRef.close();
    }

    
}
