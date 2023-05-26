import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { MouService } from "../mou.service";
import * as global from "app/main/global";

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

export const MY_FORMATS = {
    parse: {
        dateInput: "LL",
    },
    display: {
        dateInput: "DD/MM/YYYY",
        monthYearLabel: "YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "YYYY",
    },
};
@Component({
    selector: "app-mou-form-discount",
    templateUrl: "./mou-form-discount.component.html",
    styleUrls: ["./mou-form-discount.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class MouFormDiscountComponent implements OnInit {
    id_sales;
    disc;
    id_cust;
    loading = false;
    from;
    to;
    salesforcast;
    desc;
    idmouheader;

    datasent = {
        pages: 1,
        search: null,
    };
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
        private _dialogRef: MatDialogRef<MouFormDiscountComponent>,
        private _custServ: CustomerService,
        private _employeeServ: EmployeeService,
        private _mouServ: MouService
    ) {
        if(data){
            console.log(data);
            this.idmouheader = data.id_cust_mou_header;
            this.datacust = this.datacust.concat(data.customer);
            this.dataemployee = this.dataemployee.concat(data.employee);
            this.id_cust = data.id_customer;
            this.id_sales = data.employee.employee_id;
            this.disc = data.detail[0].discount;
            this.from = data.start_date;
            this.to = data.end_date;
            this.desc = data.desc;
            this.salesforcast = data.salesforecast;
        }
    }

    ngOnInit(): void {
        this.getDataCustomer();
        this.getDataEmployee();
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

    savingdata() {
        this.loading = true;
        let data = {
            idsales: this.id_sales,
            idcust: this.id_cust,
            from: this.from ? _moment(this.from).format("YYYY-MM-DD") : null,
            to: this.to ? _moment(this.to).format("YYYY-MM-DD") : null,
            disc: this.disc,
            desc: this.desc,
            salesforcast: this.salesforcast
        };
        if (data.idsales && data.idcust && data.from && data.to && data.disc) {
            if(this.idmouheader){
                this._mouServ
                .updateDataMou(this.idmouheader, data)
                .then((u: any) => {
                    if(u.success){
                        global.swalsuccess("success", "Saving Success");
                    } else {
                        global.swalerror(u.message);
                    }
                })
                .then(() => this._dialogRef.close())
                .catch((e) => global.swalerror("Error at Database"));
            } else {
                this._mouServ.addDataMou(data)
                .then((u:any) => {
                    if(u.status){
                        global.swalsuccess("success", "Saving Success");
                    } else {
                        global.swalerror(u.message);
                    }
                })
                .then(() => this._dialogRef.close())
                .catch((e) => global.swalerror("Error at Database"));
            }
        } else {
            global.swalerror("Data Harus di isi semua");
            this.loading = false;
        }
    }

    async resetAll(val) {
      switch(val){
        case 'customer':
          this.datasent.pages = 1;
          this.datasent.search = null;
          this.datacust = [];
          this.getDataCustomer();
          break;
        case 'pic':
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
}
