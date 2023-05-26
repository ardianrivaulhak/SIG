import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { StatusAttendanceService } from "../status-attendance.service";
import * as global from "app/main/global";

@Component({
    selector: "app-modal-status-attendance",
    templateUrl: "./modal-status-attendance.component.html",
    styleUrls: ["./modal-status-attendance.component.scss"],
})
export class ModalStatusAttendanceComponent implements OnInit {
    statusAttendanceForm: FormGroup;
    status;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _statusAttendanceServ: StatusAttendanceService,
        private dialogRef: MatDialogRef<ModalStatusAttendanceComponent>,
        private _formBuild: FormBuilder
    ) {
        if (data) {
            if (data.idstatus) {
                this.setValueForm(data.idstatus);
            } else {
                this.status = "add";
            }
        }
        this.dialogRef.backdropClick().subscribe((v) => { 
            this.close();
        });
    }

    ngOnInit(): void {
        this.statusAttendanceForm = this.createForm();
    }

    close() {
        this.dialogRef.close();
    }

    async setValueForm(v) {
        this.status = await v;
        this.statusAttendanceForm = await this.createForm();
        await this._statusAttendanceServ
            .getStatusAttendanceDetail(v)
            .then((x: any) => {
                this.statusAttendanceForm.patchValue({
                    status_code: x.status_code,
                    status_name: x.status_name,
                    point_status: x.point_status
                });
            });
    }

    createForm(): FormGroup {
        return this._formBuild.group({
            status_code: new FormControl(),
            status_name: new FormControl(),
            point_status: new FormControl()
        });
    }

    serviceAct() {
        let a = /^[a-zA-Z]+$/;
        if(this.statusAttendanceForm.controls.point_status.value.match(a)){
            global.swalerror("Status Point harus berupa Float");
        } else {
            if (this.status == "add") {
                this._statusAttendanceServ
                    .saveDataStatusAttendance(this.statusAttendanceForm.value)
                    .then((x) => {
                        global.swalsuccess("Success", "Mantap Bro !");
                    })
                    .then(() => this.close())
                    .catch((e) => global.swalerror("Error Saving Data"));
            } else {
                this._statusAttendanceServ
                    .updateDataStatusAttendance(this.statusAttendanceForm.value, this.status)
                    .then((x) => {
                        global.swalsuccess("Success", "Mantap Bro !");
                    })
                    .then(() => this.close())
                    .catch((e) => global.swalerror("Error Saving Data"));
            }
        }
    }
}
