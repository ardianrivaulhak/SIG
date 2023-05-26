import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { LevelService } from "../level.service";
import { SisterCompanyService } from "app/main/hris/sister-company/sister-company.service";
import * as global from "app/main/global";

@Component({
    selector: "app-modal-level",
    templateUrl: "./modal-level.component.html",
    styleUrls: ["./modal-level.component.scss"],
})
export class ModalLevelComponent implements OnInit {
    levelForm: FormGroup;
    status;
    sisterCompany = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _levelServ: LevelService,
        private dialogRef: MatDialogRef<ModalLevelComponent>,
        private _formBuild: FormBuilder,
        private _sisterserv: SisterCompanyService
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
        this.levelForm = this.createForm();
        this.getDataSisterCompany();
    }

    getDataSisterCompany() {
        this._sisterserv
            .getSisterCompany()
            .then(
                (x: any) => (this.sisterCompany = this.sisterCompany.concat(x))
            );
    }

    close() {
        this.dialogRef.close();
    }

    async setValueForm(v) {
        this.status = await v;
        this.levelForm = await this.createForm();
        await this._levelServ.getLevelDataDetail(v).then((x: any) => {
            this.levelForm.patchValue({
                level_name: x.level_name,
                company_name: x.company_id,
            });
        });
    }

    createForm(): FormGroup {
        return this._formBuild.group({
            level_name: new FormControl(),
            company_name: new FormControl(),
        });
    }

    serviceAct() {
        if (this.status == "add") {
            this._levelServ
                .saveDataLevel(this.levelForm.value)
                .then((x) => {
                    global.swalsuccess("Success", "Mantap Bro !");
                })
                .then(() => this.close())
                .catch((e) => global.swalerror("Error Saving Data"));
        } else {
            this._levelServ
                .updateDataLevel(this.levelForm.value, this.status)
                .then((x) => {
                    global.swalsuccess("Success", "Mantap Bro !");
                })
                .then(() => this.close())
                .catch((e) => global.swalerror("Error Saving Data"));
        }
    }
}
