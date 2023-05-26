import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import * as global from "app/main/global";
import { PositionService } from "app/main/hris/position/position.service";
import { SisterCompanyService } from "app/main/hris/sister-company/sister-company.service";
import { PositionComponent } from "../position.component";
import { MessagingService } from "app/messaging.service";
import { DivisionService } from "app/main/hris/division/division.service";
import { SubdivService } from "app/main/hris/subdiv/subdiv.service";
@Component({
    selector: "app-modal-position",
    templateUrl: "./modal-position.component.html",
    styleUrls: ["./modal-position.component.scss"],
})
export class ModalPositionComponent implements OnInit {
    postForm: FormGroup;
    status;
    post;
    position_name = [];
    datamentah = [];
    dataposition = [];
    sisterCompany = [];
    datadiv = [];
    company_id;
    datasentposition = {
        page: 1,
        search: null,
    };
    datasub = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalPositionComponent>,
        private _formBuild: FormBuilder,
        private _position: PositionService,
        private _sisterserv: SisterCompanyService,
        private messageServ: MessagingService,
        private _divServ: DivisionService,
        private _subServ: SubdivService
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
        this.postForm = this.createForm();
        this.getDataSisterCompany();
        this.getDataDivision();
        this.getDataPosition();
    }

    getDataPosition() {
        this._position
            .getPositionData(this.company_id)
            .then(
                (o) => (this.dataposition = this.dataposition.concat(o["data"]))
            )
            .then(
                () =>
                    (this.dataposition = global.uniq(
                        this.dataposition,
                        (it) => it.id_position
                    ))
            );
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

    createForm(): FormGroup {
        return this._formBuild.group({
            position_name: new FormControl(),
            head_position: new FormControl(),
            company_name: new FormControl(this.company_id),
            id_div: new FormControl(),
            id_subdiv: new FormControl(),
        });
    }

    async setValueForm(v) {
        this.status = await v;
        this.postForm = await this.createForm();
        await this._position
            .getPositionTreeDataDetail(v)
            .then(async (x: any) => {
                this.dataposition = await this.dataposition.concat(
                    x.position_head
                );
                this.dataposition = await global.uniq(
                    this.dataposition,
                    (it) => it.id_position
                );

                if(x.subdiv){
                    this.datasub = await this.datasub.concat(x.subdiv);

                    this.datasub = await global.uniq(
                        this.datasub,
                        (it) => it.id_subagian
                    );
                }
          

                await this.postForm.patchValue({
                    position_name: x.position_name,
                    head_position: x.head_position,
                    company_name: this.company_id,
                    id_subdiv: x.id_subdiv,
                    id_div: x.id_div,
                });

                await this.getValueSubdiv();
            });
    }

    async getValueSubdiv() {
        await this._subServ
            .getDataSubDivByDiv(this.postForm.value.id_div)
            .then((x) => (this.datasub = this.datasub.concat(x)))
            .then(
                () =>
                    (this.datasub = global.uniq(
                        this.datasub,
                        (o) => o.id_subagian
                    ))
            );
    }

    async setValue(ev) {
        this.getValueSubdiv();
    }

    onScrollToEnd(e) {
        switch (e) {
            case "position":
                this.datasentposition.page = this.datasentposition.page + 1;
                this.getDataPosition();
                break;
        }
    }

    onsearchselect(v, k) {
        switch (k) {
            case "position":
                this.datasentposition.search = v.term;
                this.dataposition = [];
                this.datasentposition.page = 1;
                this.getDataPosition();
                break;
        }
    }

    serviceAct() {
        if (this.status == "add") {
            this._position
                .saveDataPositionTree(this.postForm.value)
                .then((x) => {
                    global.swalsuccess("Success", "Success Add Position");
                })
                .then(() => this.close())
                .catch((e) => global.swalerror("Error Add Position"));
        } else {
            this._position
                .updateDataPositionTree(this.postForm.value, this.status)
                .then((x) => {
                    global.swalsuccess("Success", "Success Updating Position");
                })
                .then(() => this.close())
                .catch((e) => global.swalerror("Error Adding Position"));
        }
    }

    close() {
        this.dialogRef.close();
    }
}
