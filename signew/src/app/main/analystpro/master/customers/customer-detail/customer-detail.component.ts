import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerService } from "../customer.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import { CustomerTaxAddress } from "app/main/analystpro/master/customers/customer-detail/add-customerTaxAddress/customerTaxAddress.component";
import { AddCustomerHandler } from "app/main/analystpro/master/customers/customer-detail/add-customerHandler/add-customerHandler.component";
import * as global from "app/main/global";
import Swal from "sweetalert2";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";
import { AddCustomerMou } from "./add-customer-mou/add-customer-mou.component";
import * as _moment from "moment";
import { AddCustomerNpwp } from "./add-customer-npwp/add-customer-npwp.component";
import { MouService } from "app/main/analystpro/master/mou/mou.service";
import { CustomerhandleService } from "app/main/analystpro/services/customerhandle/customerhandle.service";

import { CustomertaxaddressService } from "app/main/analystpro/master/customertaxaddress/customertaxaddress.service";
@Component({
    selector: "app-customer-detail",
    templateUrl: "./customer-detail.component.html",
    styleUrls: ["./customer-detail.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CustomerDetailComponent implements OnInit {
    idCust: any;
    detaildata = [];
    datasent = {
        pages: 1,
        search: null,
    };
    customersData = [];

    constructor(
        private _customerServ: CustomerService,
        private _route: Router,
        private _actRoute: ActivatedRoute,
        private _matDialog: MatDialog,
        private _custTaxAddress: CustomertaxaddressService,
        private _masterServ: MouService,
        private _custHandler: CustomerhandleService
    ) {
        this.idCust = this._actRoute.snapshot.params["id"];
    }

    ngOnInit(): void {
        this.getCustomerDetail();
    }

    async getCustomerDetail() {
        await this._customerServ
            .getDataCustomerDetail(this.idCust)
            .then((x) => {
                this.detaildata = this.detaildata.concat(x);
                console.log(this.detaildata);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    deleteData(v) {
        v = this.idCust;
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this Data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        })
            .then((result) => {
                if (result.value) {
                    this._customerServ
                        .deleteDataCustomers(v)
                        .then((x: any) => {
                            if (x.success) {
                                global.swalsuccess("success", x.message);
                            } else {
                                global.swalerror(x.message);
                            }
                        })
                        .then((f) => this.setDelete(f))
                        .then(() => {
                            this.detaildata = [];
                            this.getCustomerDetail();
                        });
                }
            })
            .catch((e) => global.swalerror("Error at Database"));
    }

    async getModalCustomerAddress() {
        let dialogCust = await this._matDialog.open(CustomerTaxAddress, {
            height: "auto",
            width: "600px",
            data: this.idCust,
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.detaildata = [];
            this.getCustomerDetail();
        });
    }

    async getModalCustomerHandler() {
        let dialogCust = await this._matDialog.open(AddCustomerHandler, {
            height: "auto",
            width: "600px",
            data: this.idCust,
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.detaildata = [];
            this.getCustomerDetail();
        });
    }

    async StatusPengujianCustomerMou(v) {
        let dialogCust = await this._matDialog.open(AddCustomerMou, {
            height: "auto",
            width: "600px",
            data: {
                v: v ? v : null,
                idcust: this.idCust,
            },
        });

        await dialogCust.afterClosed().subscribe((result) => {
            this.detaildata = [];
            this.getCustomerDetail();
        });
    }

    async getModalCustomerNpwp() {
        let dialogCust = await this._matDialog.open(AddCustomerNpwp, {
            height: "auto",
            width: "600px",
            data: this.idCust,
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.detaildata = [];
            this.getCustomerDetail();
        });
    }

    deleteDataAddress(v) {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this Data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        })
            .then((result) => {
                if (result.value) {
                    this._custTaxAddress
                        .deleteData(v)
                        .then((x: any) => {
                            if (x.success) {
                                global.swalsuccess("success", x.message);
                            } else {
                                global.swalerror(x.message);
                            }
                        })
                        .then((f) => this.setDelete(f));
                }
            })
            .catch((e) => global.swalerror("Error at Database"));
    }

    deleteCustomerHandle(z) {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this Data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        })
            .then((result) => {
                if (result.value) {
                    this._custHandler
                        .deleteHandle(z)
                        .then((x: any) => {
                            if (x.success) {
                                global.swalsuccess("success", x.message);
                            } else {
                                global.swalerror(x.message);
                            }
                        })
                        .then((f) => this.setDelete(f));
                }
            })
            .catch((e) => global.swalerror("Error at Database"));
    }

    deleteCustomerMou(z) {
        global.swalyousure("No Turning Back").then((x) => {
            if (x.isConfirmed) {
                this._masterServ
                    .deleteMou(z)
                    .then((x) =>
                        global.swalsuccess("success", "deleted success")
                    )
                    .then((f) => this.setDelete(f))
                    .catch((c) => global.swalerror("error at database"));
            }
        });
    }

    deleteCustomerNpwp(v) {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this Data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        })
            .then((result) => {
                this._custHandler
                    .deleteNpwp(v)
                    .then((x) =>
                        global.swalsuccess("success", "deleted success")
                    )
                    .then((f) => this.setDelete(f));
            })
            .catch((e) => global.swalerror("Error at Database"));
    }

    async setDelete(v) {
        this.datasent.pages = await 1;
        this.datasent.search = await null;
        this.detaildata = await [];
        await this.getCustomerDetail();
    }

    checkdatenow(v) {
        let now = parseInt(_moment(Date.now()).format("x"));
        let end = parseInt(_moment(v).format("x"));

        return now - end > 0 ? true : false;
    }
}
