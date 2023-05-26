import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import * as global from "app/main/global";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
@Component({
    selector: "app-mail-popup",
    templateUrl: "./mail-popup.component.html",
    styleUrls: ["./mail-popup.component.scss"],
})
export class MailPopupComponent implements OnInit {
    emailfrom;
    cc = [];

    dataemailo = [];

    employee = [];
    datasend = {
        pages: 1,
        search: null,
        level: null,
        division: null,
        employeestatus: null,
    };
    idkontuji;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<MailPopupComponent>,
        private employeeServ: EmployeeService,
        private _kontrakServ: ContractService
    ) {
        if (data) {
            // console.log(data);
            this.idkontuji = data.contract_id;
            this.dataemailo = this.dataemailo.concat(data);
            this.dataemailo = this.dataemailo.map((x) => ({
                email: data.kontrakuji.customers_handle.email,
                id_kontrakuji: data.kontrakuji.id_kontrakuji,
            }));
        }
    }

    ngOnInit(): void {
        this.getDataEmployee();
    }

    onScrollToEnd(e) {
        this.datasend.pages = this.datasend.pages + 1;
        this.datasend.search = null;
        this.getDataEmployee();
    }

    resetfield() {
        this.datasend = {
            pages: 1,
            search: null,
            level: null,
            division: null,
            employeestatus: null,
        };
    }

    async onSearchi(ev, status) {
        await this.resetfield();
        this.datasend.search = await ev.term.toUpperCase();
        this.employee = await [];
        await this.getDataEmployee();
    }

    reset() {
        console.log("as");
    }
    getValue(ev, st) {
        console.log(st);
    }

    async setLink() {
        await global.swalyousure("Are you sure ?").then((x) => {
            if (x.isConfirmed) {
                console.log(this.dataemailo);
                this._kontrakServ
                    .sendEmailCust({
                        from: this.emailfrom,
                        cc: this.cc,
                        id_kontrakuji: this.dataemailo[0].id_kontrakuji,
                    })
                    .then((x) => {
                        global.swalsuccess("success", "Successfully added");
                    })
                    .catch((e) => {
                        global.swalerror("Error Wrong Email");
                    });
            }
        });
        await this._dialogRef.close();
    }

    cancel() {
        this._dialogRef.close();
    }

    getDataEmployee() {
        this.employeeServ
            .getData(this.datasend)
            .then((x) => {
                x["data"].forEach((u) => {
                    this.employee = this.employee.concat({
                        id_user: u.user_id,
                        email: u.user.email,
                    });
                });
            })
            .then(
                () =>
                    (this.employee = global.uniq(
                        this.employee,
                        (it) => it.id_user
                    ))
            );
    }
}
