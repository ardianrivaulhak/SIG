import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerService } from "../customer.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { KeuanganService } from "../../../keuangan/keuangan.service";
import * as global from "app/main/global";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import { LoginService } from "app/main/login/login.service";
import { MatTable } from "@angular/material/table";

@Component({
    selector: "app-customer-det",
    templateUrl: "./customer-det.component.html",
    styleUrls: ["./customer-det.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CustomerDetComponent implements OnInit {
    displayedColumns: string[] = [
        "file",
        "number",
        "name",
        "address",
        "action",
    ];
    customerForm: FormGroup;
    detaildata = [];
    idCust: any;
    showForms: any;
    hide = true;
    load = false;
    saving = true;
    city = [];
    prov = [];
    reg = [];
    termin = [
        {
            id: 1,
            title: "COD",
            value: "Cash",
        },
        {
            id: 2,
            title: "14 Hari",
            value: 14,
        },
        {
            id: 3,
            title: "30 Hari",
            value: 30,
        },
        {
            id: 4,
            title: "45 Hari",
            value: 45,
        },
    ];

    // event = {
    //     keys: 12,
    //     values: [
    //         {
    //             nama: "hasdahsd",
    //             parameter: 1,
    //         },
    //         {
    //             nama: "hasdahsd",
    //             parameter: 2,
    //         },
    //         {
    //             parameter: 3,
    //             nama: "hasdahsd",
    //         },
    //     ],
    // };

    userFinance = [];
    dataSendPRov = {
        search: "",
        pages: 1,
    };

    status = [
        {
            id: 1,
            name: "Hold",
        },
        {
            id: 2,
            name: "UnHold",
        },
    ];

    getProv = [];
    getReg = [];

    intID: any;
    access = [];
    notshowing = true;
    mine = [];
    datasentcountries = {
        page: 1,
        search: null,
    };
    datacountries = [];
    dataNpwp = [];
    identities = [
        {
            name: "NPWP",
            value: "NPWP",
        },
        {
            name: "KTP",
            value: "KTP",
        },
    ];

    dataIdentity = {
        index: null,
        id: "",
        file: "",
        number: "",
        name: "",
        address: "",
    };

    formdata = {
        data: "",
    };

    pushIdentity: any;
    deleteNpwp = [];

    @ViewChild("table") table: MatTable<any>;

    constructor(
        private _customerServ: CustomerService,
        private _actRoute: ActivatedRoute,
        private _formBuild: FormBuilder,
        private _snackBar: MatSnackBar,
        private _route: Router,
        private _employeeServ: EmployeeService,
        private _keuServ: KeuanganService,
        private _menuServ: MenuService,
        private _loginServ: LoginService
    ) {
        this.idCust = this._actRoute.snapshot.params["id"];
    }

    ngOnInit(): void {
        // this.idCust = 'add' ? this.title = 'Add' : this.title = 'Edit';
        this.getDataCity();
        this.DataUserFinance();
        this.getDataProvinces();
        this.idCust == "add" ? this.test() : this.getdatadetail();
        this.getMe();
        this.getCountries();
        console.log(this.getCountries());
    }

    getCountries() {
        this._customerServ
            .getCountries(this.datasentcountries)
            .then(
                (x) =>
                    (this.datacountries = this.datacountries.concat(x["data"]))
            );
    }

    getMe() {
        this._loginServ.checking_me().then((x) => {
            console.log(x[0]);
            if (x[0].id_bagian == 2) {
                this.notshowing = false;
            } else {
                if (x[0].user_id == 1) {
                    this.notshowing = false;
                } else {
                    this.notshowing = true;
                }
            }

            this.mine = this.mine.concat(x[0]);
            console.log(this.notshowing);
        });
    }

    test() {
        this.customerForm = this.createLabForm();
    }

    checkdata(ev) {
        console.log(this.customerForm.value);
    }

    enableForm() {
        this.hide = false;
        this.customerForm.get("customer_name").enable();
        this.customerForm.get("termin").enable();
        this.customerForm.get("province").enable();
        this.customerForm.get("regencies").enable();
        this.customerForm.get("city").enable();
        this.customerForm.get("description").enable();
        this.customerForm.get("status_cust").enable();
        this.customerForm.get("status_invoice").enable();
        this.customerForm.get("id_ar").enable();
    }

    disableForm() {
        this.hide = true;
        this.customerForm.get("customer_name").disable();
        this.customerForm.get("termin").disable();
        this.customerForm.get("province").disable();
        this.customerForm.get("regencies").disable();
        this.customerForm.get("city").disable();
        this.customerForm.get("description").disable();
        this.customerForm.get("status_cust").disable();
        this.customerForm.get("status_invoice").disable();
        this.customerForm.get("id_ar").disable();
    }

    getDataCity() {
        this._employeeServ
            .getDataCity()
            .then((h) => (this.city = this.city.concat(h)));
    }

    getDataProvinces() {
        this._customerServ.provinces(this.dataSendPRov).then((x) => {
            this.prov = this.prov.concat(x);
            console.log(this.prov);
        });
    }

    async searchProvince(ev) {
        await console.log(ev);
        await this.getDataRegencies(ev.id);
    }

    getDataRegencies(id) {
        this.reg = [];
        this._customerServ.regencies(id).then((z) => {
            this.reg = this.reg.concat(z);
            console.log(this.reg);
        });
    }

    deleteForm() {
        this._customerServ.deleteDataCustomers(this.idCust).then((g) => {
            this.load = true;
            let message = {
                text: "Data Succesfully Deleted",
                action: "Done",
            };
            setTimeout(() => {
                this.openSnackBar(message);
                this._route.navigateByUrl("analystpro/customers");
                this.load = false;
            }, 2000);
        });
    }

    setData() {
        this._customerServ
            .addDataCustomers(this.customerForm.value)
            .then((g) => {
                this.load = true;
                let message = {
                    text: "Data Succesfully Save",
                    action: "Done",
                };
                setTimeout(() => {
                    this.openSnackBar(message);
                    this._route.navigateByUrl("analystpro/customers");
                    this.load = false;
                }, 2000);
            });
    }

    saveNewForm() {
        this.customerForm.controls["deletenpwp"].setValue(this.deleteNpwp);
        this.customerForm.controls["npwp"].setValue(this.dataNpwp);
        if (this.customerForm.value.countries == 104) {
            if (
                this.customerForm.value.province == "" ||
                this.customerForm.value.regencies == ""
            ) {
                global.swalerror("Province and Regencies Should Not be Empty");
            } else {
                this.setData();
            }
        } else {
            this.setData();
        }
    }

    saveForm() {
        this.customerForm.controls["deletenpwp"].setValue(this.deleteNpwp);
        this.customerForm.controls["npwp"].setValue(this.dataNpwp);
        this._customerServ
            .updateDataCustomers(this.idCust, this.customerForm.value)
            .then((y) => {
                this.load = true;
                let message = {
                    text: "Data Succesfully Updated",
                    action: "Done",
                };
                setTimeout(() => {
                    this.openSnackBar(message);
                    this._route.navigateByUrl("analystpro/customers");
                    this.load = false;
                }, 2000);
            });
    }

    async getdatadetail() {
        console.log(this.idCust);
        await this._customerServ
            .getDataCustomersDetail(this.idCust)
            .then((x) => {
                this.detaildata = this.detaildata.concat(x);
                if (this.idCust !== "add") {
                    if (this.detaildata[0].termin == "Cash") {
                        this.intID = "Cash";
                    } else if (this.detaildata[0].termin == "14") {
                        this.intID = 14;
                    } else if (this.detaildata[0].termin == "30") {
                        this.intID = 30;
                    } else if (this.detaildata[0].termin == "45") {
                        this.intID = 45;
                    }
                }
                this.idCust !== "add"
                    ? this.getDataRegencies(this.detaildata[0].id_province)
                    : console.log(this.reg);
            })
            .then(() => (this.customerForm = this.createLabForm()));
        await this.getNpwp();
    }

    async getNpwp() {
        let a = [];
        a = await a.concat(this.detaildata[0].customer_npwp);
        await a.forEach((x) => {
            this.dataNpwp = this.dataNpwp.concat({
                index: this.dataNpwp.length < 1 ? 0 : this.dataNpwp.length - 1,
                id: x.id,
                file: x.info,
                number: x.npwp_number,
                name: x.name,
                address: x.address,
            });
        });
        await console.log(this.dataNpwp);
    }

    createLabForm(): FormGroup {
        return this._formBuild.group({
            customer_name:
                this.idCust !== "add"
                    ? this.detaildata[0]["customer_name"]
                    : "",
            province:
                this.idCust !== "add" ? this.detaildata[0]["id_province"] : "",
            countries:
                this.idCust !== "add"
                    ? this.detaildata[0]["id_countries"]
                    : 104,
            regencies:
                this.idCust !== "add" ? this.detaildata[0]["id_regenci"] : "",
            description:
                this.idCust !== "add" ? this.detaildata[0]["description"] : "",
            status_cust:
                this.idCust !== "add" ? this.detaildata[0]["status_cust"] : "",
            termin: this.idCust !== "add" ? this.intID : "",
            status_invoice:
                this.idCust !== "add"
                    ? this.detaildata[0]["status_invoice"]
                    : "",
            id_ar:
                this.idCust !== "add" ? this.detaildata[0]["id_user_ar"] : "",
            npwp: [],
            deletenpwp: [],
        });
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }

    async DataUserFinance() {
        await this._keuServ.getDataUser().then((x) => {
            this.userFinance = this.userFinance.concat(x);
            this.userFinance = this.uniq(
                this.userFinance,
                (it) => it.employee_id
            );
            console.log(this.userFinance);
        });
        this.load = await false;
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    onsearchselect(ev, val) {
        switch (val) {
            case "province":
                this.prov = [];
                this.dataSendPRov.search = ev.term;
                this.dataSendPRov.pages = 1;
                this.getDataProvinces();
                break;
            case "countries":
                this.datacountries = [];
                this.datasentcountries.search = ev.term;
                this.datasentcountries.page = 1;
                this.getCountries();
                break;
        }

        // if (val === "customer") {
        //     this.customersData = [];
        //     this.datasentCustomer.search = ev.term;
        //     this.datasentCustomer.pages = 1;
        //     this.getAllDataCustomer();
        // }
        // if (val === "cp") {
        //     this.cpData = [];
        //     this.datasentCP.search = ev.term;
        //     this.datasentCP.pages = 1;
        //     this.getAllDataCP();
        // }
        // if (val === "address") {
        //     this.alamatcustomer = [];
        //     this.dataalamat.search = ev.term;
        //     this.dataalamat.pages = 1;
        //     this.getDataCustomerAddress();
        // }
    }

    onScrollToEnd(v) {
        switch (v) {
            case "countries":
                this.datasentcountries.page = 1;
                this.getCountries();
                break;
        }
    }

    async addButton() {
        console.log(this.dataIdentity);
        if (this.dataIdentity.index == null) {
            if (this.dataIdentity.file) {
                let a = this.dataNpwp.length + 1;
                let d = {};
                d[a] = {
                    index: null,
                    id: "add",
                    file: await this.dataIdentity.file.toString(),
                    number: await this.dataIdentity.number.toString(),
                    name: await this.dataIdentity.name.toString(),
                    address: await this.dataIdentity.address.toString(),
                };
                this.dataNpwp = this.dataNpwp.concat(d[a]);
            }
        } else {
            this.dataNpwp[this.dataIdentity.index].index =
                this.dataIdentity.index;
            this.dataNpwp[this.dataIdentity.index].id = this.dataIdentity.id;
            this.dataNpwp[this.dataIdentity.index].file =
                this.dataIdentity.file.toString();
            this.dataNpwp[this.dataIdentity.index].number =
                this.dataIdentity.number.toString();
            this.dataNpwp[this.dataIdentity.index].name =
                this.dataIdentity.name.toString();
            this.dataNpwp[this.dataIdentity.index].address =
                this.dataIdentity.address.toString();
        }
        this.dataIdentity.index = null;
        this.dataIdentity.file = "";
        this.dataIdentity.number = "";
        this.dataIdentity.name = "";
        this.dataIdentity.address = "";
    }

    async uptdateData(v, i) {
        this.dataIdentity.index = await i;
        this.dataIdentity.id = await v.id;
        this.dataIdentity.file = await v.file;
        this.dataIdentity.number = await v.number;
        this.dataIdentity.name = await v.name;
        this.dataIdentity.address = await v.address;
        console.log(this.dataIdentity);
    }

    async deletedSelectData(e, i) {
        this.deleteNpwp.push(this.dataNpwp[i]);
        console.log(this.dataNpwp[i]);
        this.dataNpwp = await this.dataNpwp.filter((v, ind) => {
            return ind != i;
        });
    }
}
