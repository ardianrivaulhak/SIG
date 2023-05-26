import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { DivisionService } from "../division.service";
import { SisterCompanyService } from "app/main/hris/sister-company/sister-company.service";
import * as global from "app/main/global";
import { MessagingService } from "app/messaging.service";
import { DepartementService } from "app/main/hris/departement/departement.service";

@Component({
    selector: "app-modal-division",
    templateUrl: "./modal-division.component.html",
    styleUrls: ["./modal-division.component.scss"],
})
export class ModalDivisionComponent implements OnInit {
    divisionForm: FormGroup;
    status;
    sisterCompany = [];
    company_id;
    datadept = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _divServ: DivisionService,
        private dialogRef: MatDialogRef<ModalDivisionComponent>,
        private _formBuild: FormBuilder,
        private _sisterserv: SisterCompanyService,
        private messageServ: MessagingService,
        private deptServ: DepartementService
    ) {
        this.messageServ.getDataCompany().subscribe((m) => {
            this.company_id = m.id;
        });
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
        this.divisionForm = this.createForm();
        this.getDataSisterCompany();
        this.getDataDept();
    }

    getDataDept() {
        this.deptServ
            .getDataDepartement()
            .then((x) => (this.datadept = this.datadept.concat(x)));
    }

    getDataSisterCompany() {
        this._sisterserv
            .getSisterCompany()
            .then(
                (x: any) => (this.sisterCompany = this.sisterCompany.concat(x))
            );
    }


    createForm() {
        return this._formBuild.group({
            division_name: new FormControl(),
            dept_id: new FormControl(),
            company_name: new FormControl(),
        });
    }

    async setValueForm(v) {
        this.status = await v;
        this.divisionForm = await this.createForm();
        await this._divServ.getDataDivisionDet(v).then((x: any) => {
            this.divisionForm.patchValue({
                division_name: x.division_name,
                dept_id: x.id_dept,
                company_name: x.company_id,
            });
        });
    }

    serviceAct() {
        if (this.status !== "add") {
            this._divServ
                .updateDivision(this.divisionForm.value, this.status)
                .then((x) => {
                    global.swalsuccess("Success", "Success Updating Division");
                })
                .then(() => this.close())
                .catch((e) => global.swalerror("Error Updating Division"));
        } else {
            this._divServ
                .storeDivision(this.divisionForm.value)
                .then((x) => {
                    global.swalsuccess("Success", "Success Updating Division");
                })
                .then(() => this.close())
                .catch((e) => global.swalerror("Error Adding Division"));
        }
    }

    close() {
        this.dialogRef.close();
    }
}
