import { Component, OnInit } from "@angular/core";
import { CustomerService } from "../../master/customers/customer.service";
import { ContactPersonService } from "../../master/contact-person/contact-person.service";
import { CustomerHandleService } from "../../master/customer-handle/customer-handle.service";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { ContactPersonAddComponent } from "../../modal/contact-person-add/contact-person-add.component";
import { FuseThemeOptionsComponent } from "@fuse/components/theme-options/theme-options.component";

@Component({
    selector: "app-customershandle-modal",
    templateUrl: "./customershandle-modal.component.html",
    styleUrls: ["./customershandle-modal.component.scss"],
})
export class CustomershandleModalComponent implements OnInit {
    dataCp: any;
    dataCustomer: any;
    id_cp;
    id_cust;
    fax: any;
    email: any;
    telpnumber: any;
    phonenumber: any;
    datacust = [];
    datacontactperson = [];
    datasent = {
        pages: 1,
        search: null,
    };
    datasentp = {
        pages: 1,
        search: null,
    };
    loading = false;
    emailvalidformat = true;
    phonecode = [];

    constructor(
        private _dialogRef: MatDialogRef<CustomershandleModalComponent>,
        private _customerServ: CustomerService,
        private _contactServ: ContactPersonService,
        private _custHandServ: CustomerHandleService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.getDataCustomer();
        this.getDataContactPerson();
        // this.getPhoneCode();
    }

    getPhoneCode() {
        this._custHandServ
            .getPhoneCode()
            .then((x) => (this.phonecode = this.phonecode.concat(x)));
    }

    async getDataCustomer() {
        await this._customerServ.getDataCustomers(this.datasent).then((x) => {
            this.datacust = this.datacust.concat(x["data"]);
            console.log(this.datacust);
        });
        this.datacust = await this.uniq(this.datacust, (it) => it.id_customer);
    }

    async getDataContactPerson() {
        await this._contactServ
            .getDataContactPersons(this.datasentp)
            .then((x) => {
                this.datacontactperson = this.datacontactperson.concat(
                    x["data"]
                );
            });
        this.datacontactperson = await this.uniq(
            this.datacontactperson,
            (it) => it.id_cp
        );
    }

    async getVal(ev, val) {
        if (val === "customer") {
            await console.log({ ev, val });
            this.dataCustomer = ev;
        } else {
            await console.log({ ev, val });
            this.dataCp = await ev;
            this.fax = await ev.fax;
            this.email = await ev.email;
            this.telpnumber = await ev.telpnumber;
            this.phonenumber = await ev.phonenumber;
        }
    }

    async resetAll(val) {
        if (val === "customer") {
            this.datasent.pages = 1;
            this.datasent.search = null;
            this.datacust = [];
            this.getDataCustomer();
        } else {
            this.datasentp.pages = 1;
            this.datasentp.search = null;
            this.datacontactperson = [];
            this.getDataContactPerson();
        }
    }

    async onScrollToEnd(i, ev) {
        console.log(i);
        if (ev === "customer") {
            this.datasent.pages = this.datasent.pages + 1;
            this.getDataCustomer();
        } else {
            this.datasentp.pages = this.datasentp.pages + 1;
            this.getDataContactPerson();
        }
    }

    async onSearchi(ev, val) {
        console.log({ a: ev, b: val });
        if (val === "customer") {
            this.datacust = await [];
            this.datasent.search = await ev.term;
            this.datasent.pages = await 1;
            await this.getDataCustomer();
        } else {
            this.datacontactperson = await [];
            this.datasentp.search = await ev.term;
            this.datasentp.pages = await 1;
            await this.getDataContactPerson();
        }
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    mychange(ev, value) {
        let numonly = /^\d+$/;
        if (value === "fax") {
            this.fax = ev;
            console.log(parseInt(this.fax.toString().replace(numonly, "")));
        } else if (value === "email") {
            let mail_format = /\S+@\S+\.\S+/;
            this.emailvalidformat = mail_format.test(ev) ? true : false;
            this.email = ev.trim();
        } else if (value === "telpnumber") {
            this.telpnumber = ev;
        } else if (value === "phonenumber") {
            this.phonenumber = ev;
        }
    }

    async addContactPerson() {
        let dialogCust = await this.dialog.open(ContactPersonAddComponent, {
            height: "auto",
            width: "800px",
            disableClose: true,
        });
        await dialogCust.afterClosed().subscribe((result) => {
            console.log(result);
            this.datacontactperson = [];
            this.getDataContactPerson();
        });
    }

    async save() {
        if (
            this.id_cp === undefined ||
            this.id_cust === undefined ||
            this.phonenumber === undefined ||
            this.email === undefined ||
            !this.emailvalidformat
        ) {
            Swal.fire({
                title: "Data Belum Lengkap",
                text: "Mohon Lengkapi Data !",
                icon: "warning",
                confirmButtonText: "Ok",
            });
        } else {
            this.loading = await true;
            let data = {
                id_cp: this.id_cp,
                id_cust: this.id_cust,
                telp: this.telpnumber,
                phone: this.phonenumber,
                fax: this.fax,
                email: this.email,
            };
            let dataToContrack = {
                cust: this.dataCustomer,
                cp: this.dataCp,
                data: data,
            };
            await this._custHandServ
                .addData(data)
                .then((x) => (this.loading = false));
            await this._dialogRef.close({
                b: "close",
                c: dataToContrack,
            });
        }
    }

    closeModal() {
        return this._dialogRef.close();
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, "", {
            duration: 2000,
        });
    }
}
