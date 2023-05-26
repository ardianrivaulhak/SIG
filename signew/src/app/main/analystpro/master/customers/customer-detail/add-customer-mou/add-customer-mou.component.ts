import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerService } from "../../customer.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import Swal from "sweetalert2";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";
import { Inject } from "@angular/core";
import { MouService } from "app/main/analystpro/master/mou/mou.service";
import * as _moment from "moment";
import * as global from "app/main/global";
import { EmployeeService } from "app/main/hris/employee/employee.service";

// @ts-ignore
@Component({
    selector: "app-add-customer-mou",
    templateUrl: "./add-customer-mou.component.html",
    styleUrls: ["./add-customer-mou.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class AddCustomerMou implements OnInit {
    datasent = {
        pages: 1,
        search: null,
    };

    idcustheader;

    datasave = {
        idsales: null,
        idcust: null,
        from: null,
        to: null,
        salesforcast: 0,
        detailmou: [
            {
                status: "Normal",
                values: null,
                disc: null,
                id: null,
            },
            {
                status: "Urgent",
                values: null,
                disc: null,
                id: null,
            },
            {
                status: "Very Urgent",
                values: null,
                disc: null,
                id: null,
            },
            {
                status: "Custom 2 Hari",
                values: null,
                disc: null,
                id: null,
            },
            {
                status: "Custom 1 Hari",
                values: null,
                disc: null,
                id: null,
            },
        ],
    };
    loading = false;
    datacust = [];
    dataemployee = [];
    datasend = {
        pages: 1,
        search: null,
        level: null,
        status: null,
        division: null,
        employeestatus: null,
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,

        private _dialogRef: MatDialogRef<AddCustomerMou>,
        private _custServ: CustomerService,
        private _employeeServ: EmployeeService,
        private _mouServ: MouService,
        private _actRoute: ActivatedRoute
    ) {
        if (data && data.v && data.v.employee) {
            console.log(data);
            this.datacust = this.datacust.concat(data.v.customer);
            this.dataemployee = this.dataemployee.concat(data.v.employee);
            this.datasave.idcust = data.idcust ? data.idcust : null;
            this.datasave.from = data.v.start_date;
            this.datasave.to = data.v.end_date;
            this.datasave.idsales = data.v.employee.employee_id;
            this.datasave.salesforcast = data.v.salesforecast;
            this.idcustheader = data.v.id_cust_mou_header;
            data.v.detail.forEach((x, i) => {
                this.datasave.detailmou[i].disc = x.discount;
                this.datasave.detailmou[i].values = x.value;
                this.datasave.detailmou[i].id = x.id;
            });
        }
    }

    ngOnInit(): void {
        this.getDataCustomer();
        this.getDataEmployee();

        console.log(this.data.idcust);
    }

    async getDataEmployee() {
        this._employeeServ
            .getData(this.datasend)
            .then(
                (x) => (this.dataemployee = this.dataemployee.concat(x["data"]))
            )
            .then(() => {
                this.dataemployee = global.uniq(
                    this.dataemployee,
                    (it) => it.employee_id
                );
            });
    }

    async getDataCustomer() {
        await this._custServ.getDataCustomers(this.datasent).then((x) => {
            this.datacust = this.datacust.concat(x["data"]);
        });
        this.datacust = await global.uniq(
            this.datacust,
            (it) => it.id_customer
        );
    }

    async onSearchi(ev, val) {
        switch (val) {
            case "customer":
                this.datacust = await [];
                this.datasent.search = await ev.term;
                this.datasent.pages = await 1;
                await this.getDataCustomer();
                break;
            case "pic":
                this.datacust = await [];
                this.datasend.search = await ev.term;
                this.datasend.pages = await 1;
                await this.getDataEmployee();
                break;
        }
    }

    async resetAll(val) {
        switch (val) {
            case "customer":
                this.datasent.pages = 1;
                this.datasent.search = null;
                this.datacust = [];
                this.getDataCustomer();
                break;
            case "pic":
                this.datasend.pages = 1;
                this.datasend.search = null;
                this.dataemployee = [];
                this.getDataEmployee();
                break;
        }
    }

    async onScrollToEnd(i, ev) {
        switch (ev) {
            case "pic":
                this.datasend.pages = this.datasend.pages + 1;
                this.getDataEmployee();
                break;
            case "customer":
                this.datasent.pages = this.datasent.pages + 1;
                this.getDataCustomer();
                break;
        }
    }

    getVal(ev, st) {
        console.log(ev);
    }

    async savingdata() {
        this.datasave.idcust = this.data.idcust;
        console.log(this.datasave);
        this.loading = true;
        let a = this.datasave.from
            ? _moment(this.datasave.from).format("YYYY-MM-DD")
            : null;
        let v = this.datasave.to
            ? _moment(this.datasave.to).format("YYYY-MM-DD")
            : null;
        this.datasave.from = a;
        this.datasave.to = v;

        if (
            this.datasave.from &&
            this.datasave.to &&
            this.datasave.idsales &&
            this.datasave.idcust
        ) {
            let disc = this.datasave.detailmou.filter((x) => x.disc);
            let values = this.datasave.detailmou.filter((x) => x.values);

            if (disc.length > 4 && values.length > 4) {
                if (this.idcustheader) {
                    await this._mouServ
                        .updateDataMou(this.idcustheader, this.datasave)
                        .then((x: any) => {
                            this.loading = false;
                            if (x.success) {
                                global.swalsuccess("success", x.message);
                            } else {
                                global.swalerror(x.message);
                            }
                        })
                        .catch((e) => global.swalerror("Error at Database"));
                    await this._dialogRef.close();
                } else {
                    await this._mouServ
                        .addDataMou(this.datasave)
                        .then((x: any) => {
                            this.loading = false;
                            if (x.success) {
                                global.swalsuccess("success", x.message);
                            } else {
                                global.swalerror(x.message);
                            }
                        })
                        .catch((e) => global.swalerror("Error at Database"));
                    await this._dialogRef.close();
                }
            } else {
                await global.swalerror("Please Fill Form Correctly");
                this.loading = false;
            }
        } else {
            await global.swalerror("Please Fill Form Correctly");
            this.loading = false;
        }
    }

    cancel() {
        this._dialogRef.close();
    }
}
