import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { SubdivService } from "../subdiv.service";
import { SisterCompanyService } from "app/main/hris/sister-company/sister-company.service";
import * as global from "app/main/global";
import { MessagingService } from "app/messaging.service";
import { DivisionService } from "app/main/hris/division/division.service";
@Component({
    selector: "app-modal-subdiv",
    templateUrl: "./modal-subdiv.component.html",
    styleUrls: ["./modal-subdiv.component.scss"],
})
export class ModalSubdivComponent implements OnInit {
    subdivisionForm: FormGroup;
    status;
    sisterCompany = [];
    company_id;
    datadiv = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _subdivServ: SubdivService,
        private dialogRef: MatDialogRef<ModalSubdivComponent>,
        private _formBuild: FormBuilder,
        private _sisterserv: SisterCompanyService,
        private messageServ: MessagingService,
        private _divServ: DivisionService
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
        this.subdivisionForm = this.createForm();
        this.getDataSisterCompany();
        this.getDataDivision();
    }

    getDataDivision() {
        this._divServ.getDataDivision().then((o) => {
            this.datadiv = this.datadiv.concat(o);
        });
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
            subdivision_name: new FormControl(),
            company_name: new FormControl(this.company_id),
            id_div: new FormControl()
        });
    }

    async setValueForm(v) {
        this.status = await v;
        this.subdivisionForm = await this.createForm();
        await this._subdivServ.getDataSubDivDet(v).then((x: any) => {
            this.subdivisionForm.patchValue({
                subdivision_name: x.name,
                company_name: this.company_id,
                id_div: x.id_div
            });
        });
    }

    serviceAct() {
        if (this.status !== "add") {
            this._subdivServ
                .updateSubDivision(this.subdivisionForm.value, this.status)
                .then((x) => {
                    global.swalsuccess("Success", "Success Updating Division");
                })
                .then(() => this.close())
                .catch((e) => global.swalerror("Error Updating Division"));
        } else {
            this._subdivServ
                .storeSubDivision(this.subdivisionForm.value)
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
