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
import * as global from "app/main/global";
import { KeuanganService } from "app/main/analystpro/keuangan/keuangan.service";

@Component({
    selector: "app-administrative-information",
    templateUrl: "./administrative-information.component.html",
    styleUrls: ["./administrative-information.component.scss"],
})
export class AdministrativeInformationComponent implements OnInit {
    sendingDet = {
        st: null,
        type: null,
        id_bank: null,
        value: null,
        employee_id: null,
        desc: null
    };

    databank = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<AdministrativeInformationComponent>,
        private _employeServ: EmployeeService,
        private _keuServ: KeuanganService
    ) {
        if (data) {
            setTimeout(() => {
                if (data.status !== "add") {
                    this.setData(data);
                    this.sendingDet.employee_id = data.employee_id;
                    this.sendingDet.st = data.status;
                } else {
                    this.sendingDet.employee_id = data.employee_id;
                    this.sendingDet.st = data.status;
                }
            }, 1000);
        }
    }

    ngOnInit(): void {
        this.getDataBank()
    }

    getDataBank() {
        this._keuServ
            .getAccountBank()
            .then((x) => (this.databank = this.databank.concat(x)));
    }

    setData(v) {
        this._employeServ.getDataAdministrationDet(v.status).then((x: any) => {
            this.sendingDet = {
                st: v.status,
                type: x.type.toString(),
                id_bank: x.id_bank,
                value: x.value,
                employee_id: x.employee_id,
                desc: x.desc
            };
        });
    }

    async savingdata() {
        if (
            this.sendingDet.type &&
            this.sendingDet.value
        ) {
            await global.swalyousure("Will Sending the data").then((x) => {
                if (x.isConfirmed) {
                    this._employeServ
                        .sendDataAdministration(this.sendingDet)
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
