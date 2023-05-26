import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { LabApprovalService } from "../../lab-approval/lab-approval.service";
import { fuseAnimations } from "@fuse/animations";
import { ContractcategoryService } from "../../services/contractcategory/contractcategory.service";
import { ContactPersonService } from "../../master/contact-person/contact-person.service";
import { CustomerService } from "../../master/customers/customer.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import Swal from "sweetalert2";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDateLabapproveComponent } from '../modal-date-labapprove/modal-date-labapprove.component';
import * as XLSX from "xlsx";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MatDatepickerInputEvent,
    MatCalendarCellCssClasses,
} from "@angular/material/datepicker";

import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";
import * as global from 'app/main/global';

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
    selector: "app-lab-approval",
    templateUrl: "./lab-approval.component.html",
    styleUrls: ["./lab-approval.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class LabApprovalComponent implements OnInit {
    typecontract;
    contractValue;

    datacontractDetail = [];
    datacontract = [];
    displayedColumns: string[] = [
        "check_box",
        "action",
        "contract_no",
        // 'contract_category',
        "customers",
        // "tgl_selesai",
        "tetes",
        // "progress",
        'tanggal_selesai'
        // "keterangan",
    ];
    status = [
        {
            id: 0,
            title: "Pending",
        },
        {
            id: 2,
            title: "Done",
        },
    ];
    loading = false;
    load = false;
    dataMount = [
        {
            id: 1,
            title: "January",
        },
        {
            id: 2,
            title: "February",
        },
        {
            id: 3,
            title: "March",
        },
        {
            id: 4,
            title: "April",
        },
        {
            id: 5,
            title: "May",
        },
        {
            id: 6,
            title: "June",
        },
        {
            id: 7,
            title: "July",
        },
        {
            id: 8,
            title: "August",
        },
        {
            id: 9,
            title: "September",
        },
        {
            id: 10,
            title: "October",
        },
        {
            id: 11,
            title: "November",
        },
        {
            id: 12,
            title: "December",
        },
    ];
    btnCheck = false;
    checkList = [];
    dateSelesai: any;
    total: number;
    from: number;
    to: number;
    last_page: number;
    loadingfirst = true;
    pages = 1;
    datasent = {
        pages: 1,
        search: null,
        typeContract: null,
    };
    datasentCustomer = {
        pages: 1,
        search: null,
        typeContract: null,
    };
    datasentCP = {
        pages: 1,
        search: null,
        typeContract: null,
    };
    dataFilter = {
        status: 1,
        pages: 1,
        category: null,
        date: null,
        customers: null,
        search: null,
        contact_person: null,
        contract: [],
    };
    createdName = [];
    contractcategory = [];
    customer = [];
    contactperson = [];
    datasentcontract = {
        pages: 1,
        status: "accepted",
        type: "paginate",
        search: null,
    };
    dataSelectcontract = [];
    testingcheck = false;
    search_contract;
    constructor(
        private _kontrakServ: LabApprovalService,
        private _kontrakategori: ContractcategoryService,
        private _customerServ: CustomerService,
        private _snackBar: MatSnackBar,
        private _cpServ: ContactPersonService,
        private _contractServ: ContractService,
        private _router: Router,
        private _actRoute: ActivatedRoute,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.getData();
        this.getDataContractCategory();
        this.getDataCustomer();
        this.getDataCP();
    }

    async testing() {
            await this.resetDatasent("all");
            this.dataFilter.search = await this.search_contract;
            this.datacontract = await [];
            await this.getData();
    }

    getDataContract() {
        this._contractServ.getData(this.datasentcontract).then((x) => {
            this.dataSelectcontract = this.dataSelectcontract.concat(x["data"]);
        });
    }

    onScroll(e) {
        this.dataFilter.pages = this.dataFilter.pages + 1;
        this.getData();
    }

    onTableScroll(e) {
        const tableViewHeight = e.target.offsetHeight; // viewport: ~500px
        const tableScrollHeight = e.target.scrollHeight; // length of all table
        const scrollLocation = e.target.scrollTop; // how far user scrolled

        // If the user has scrolled within 200px of the bottom, add more data
        const buffer = 200;
        const limit = tableScrollHeight - tableViewHeight - buffer;
        if (this.datasent.pages < this.last_page) {
            if (scrollLocation > limit) {
                this.datasent.pages = this.datasent.pages + 1;
                this.getData();
            }
        }
    }

    tglEstimasiLabChange(){
        console.log(this.dataFilter.date);
        this.dataFilter.date = this.dataFilter.date ? _moment(this.dataFilter.date).format(
            "YYYY-MM-DD"
        ) : null;
        // this.resetDatasent('all');
        this.datacontract = [];
        this.getData();
    }

    resetDatasent(val) {
        switch (val) {
            case "contractcategory":
                this.dataFilter = {
                    contract: [],
                    status: 0,
                    pages: 1,
                    category: null,
                    date: null,
                    customers: null,
                    search: null,
                    contact_person: null,
                };
                break;
            case "kontrak":
                this.datasentcontract = {
                    pages: 1,
                    status: "accepted",
                    type: "paginate",
                    search: null,
                };
                break;

            case 'all' :
                this.dataFilter = {
                    status: 1,
                    pages: 1,
                    category: null,
                    date: this.dataFilter.date,
                    customers: null,
                    search: null,
                    contact_person: null,
                    contract: [],
                }
        }
    }

    getValTypeCont(ev) {
        // this.resetDatasent("contractcategory");
        this.dataFilter.category = this.typecontract;
        this.dataFilter.status = 1;
        this.dataFilter.pages = 1;
        this.datacontract = [];
        this.getData();
    }

    refreshdata() {
        console.log("huhu");
    }

    hitung(v) {
        let hasil = v.done + (v.pending / v.total) * 100;
        console.log(hasil);
        return hasil;
    }

    getValCont(ev) {
        this.resetDatasent("kontrak");
        this.dataFilter.search = null;
        this.dataFilter.pages = 1;
        this.dataFilter.contract = this.dataFilter.contract.concat(
            this.contractValue
        );
        this.datacontract = [];
        this.getData();
    }

    onScrollToEndSelect(ev) {
        switch (ev) {
            case "contract":
                this.resetDatasent("kontrak");
                this.datasentcontract.pages = this.datasentcontract.pages + 1;
                this.getDataContract();
                break;
        }
    }

    onsearchselect(ev, i) {
        switch (i) {
            case "contract":
                this.resetDatasent("kontrak");
                this.datasentcontract.search = ev.term;
                this.dataSelectcontract = [];
                this.getDataContract();
                break;
        }
    }

    async getData() {
        await this._kontrakServ.getData(this.dataFilter).then((x: any) => {
            this.datacontract = this.datacontract.concat(x.data);
        })
    }

    gotodetail(value) {
        const url = this._router.serializeUrl(
            this._router.createUrlTree([`/analystpro/lab-approval-det/${value.id_kontrakuji}`])
        );
        
        let baseUrl = window.location.href.replace(this._router.url, '');
        window.open(baseUrl + url, '_blank');
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    async checkAll(ev, row, index?) {
        console.log({ a: ev, b: row, c: index });
        if (row !== "all") {
            this.datacontract[index].checked = ev;
        } else {
            this.testingcheck = ev;
            this.datacontract.forEach((x) => {
                x.checked = ev;
            });
        }
    }

    async setDataExcelContekan(result){
        this.loading = await true;
        let k = await [];
        await this._kontrakServ.getDataParameterInfo(result).then((x: any) => {
            k = k.concat(x);
        })
        let fileName = await `Parameter_Info.xlsx`;
        let workbook = await XLSX.utils.book_new();

        let worksheet = await XLSX.utils.json_to_sheet(k);
        await XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        await XLSX.writeFile(workbook, fileName);
        await setTimeout(() => {
            this.loading = false;
        },1000);
    }

    async setDataSampleAccepted(result){
        this.loading = await true;
        let k = await [];
        await this._kontrakServ.getDataSampleAccepted(result).then((x:any) => {
            k = k.concat(x);
        })
        let fileName = await `Accepted_Sample.xlsx`;
        let workbook = await XLSX.utils.book_new();

        let worksheet = await XLSX.utils.json_to_sheet(k);
        await XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        await XLSX.writeFile(workbook, fileName);
        await setTimeout(() => {
            this.loading = false;
        },1000);
    }

    exportparameterinfo(){
        
        let dialogCust = this.dialog.open(ModalDateLabapproveComponent, {
            height: "auto",
            width: "600px"
        });

        dialogCust.afterClosed().subscribe(async (result) => {
           if(result){
            this.setDataExcelContekan(result)
           }
        });
        
    }

    exportsampleaccepted(){
        let dialogCust = this.dialog.open(ModalDateLabapproveComponent, {
            height: "auto",
            width: "600px"
        });

        dialogCust.afterClosed().subscribe(async (result) => {
           if(result){
            this.setDataSampleAccepted(result)
           }
        });
    }

    info(row, index) {
        console.log(row);
        this._router.navigateByUrl(
            "/analystpro/view-contract/" + row.id_kontrakuji
        );
    }

    approveContract() {
        if (this.checkList.length === 0) {
            Swal.fire("GAGAL!", "CheckList Salah Satu Contract.", "error");
        } else {
            let u = [];
            this.checkList.forEach((x) => {
                if (x.checked) {
                    u = u.concat({
                        contract_id: x.contract_id,
                    });
                }
            });
            console.log(u);
            this._kontrakServ.approveContrac(u).then((z) => {
                this.datacontract = [];
                this.checkList = []; //
                this.getData();
                let message = {
                    text: "Contract Succesfully Approve",
                    action: "Done",
                };
                setTimeout(() => {
                    this.openSnackBar(message);
                    // this._route.navigateByUrl('analystpro/control');
                    this.load = false;
                }, 2000);
            });
        }
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }

    onScrollToEnd(e) {
        this.loading = true;
        if (e === "customer") {
            this.datasentCustomer.pages = this.datasentCustomer.pages + 1;
            this.getDataCustomer();
        } else if (e === "CP") {
            this.datasentCP.pages = this.datasentCP.pages + 1;
            this.getDataCP();
        }
        setTimeout(() => {
            this.loading = false;
        }, 200);
    }

    reset(e) {
        if (e === "Category") {
            this.dataFilter.category = null;
            this.datacontract = [];
            this.getData();
        } else if (e === "customer") {
            this.dataFilter.customers = null;
            this.datacontract = [];
            this.getData();
        } else if (e === "CP") {
            this.dataFilter.contact_person = null;
            this.datacontract = [];
            this.getData();
        } else if (e === "Mount") {
            this.dataFilter.date = null;
            this.datacontract = [];
            this.getData();
        } else if (e === "Status") {
            this.dataFilter.status = 0;
            this.datacontract = [];
            this.getData();
        }
    }

    async getDataContractCategory() {
        await this._kontrakategori
            .getDataContractCategory(this.datasent)
            .then((x) => {
                this.contractcategory = this.contractcategory.concat(x["data"]);
                console.log(this.contractcategory);
            });
    }

    getDataCustomer() {
        this._customerServ
            .getDataCustomers(this.datasentCustomer)
            .then((x) => {
                this.customer = this.customer.concat(x["data"]);
            })
            .then(
                () =>
                    (this.customer = this.uniq(
                        this.customer,
                        (it) => it.id_customer
                    ))
            );
    }

    getDataCP() {
        this._cpServ.getDataContactPersons(this.datasentCP).then((x) => {
            this.contactperson = this.contactperson.concat(x["data"]);
            console.log(this.contactperson);
        });
    }

    onSearchi(ev, identifier) {
        console.log(ev);
        if (identifier === "customer") {
            this.datasentCustomer.search = ev.term;
            this.getDataCustomer();
        }
    }

    getValCust(ev) {
        this.dataFilter.pages = 1;
        this.dataFilter.customers = ev.id_customer;
        this.datacontract = [];
        this.getData();
        console.log(this.dataFilter);
    }

    getValCP(ev) {
        this.dataFilter.contact_person = ev.id_cp;
        this.datacontract = [];
        this.getData();
        console.log(this.dataFilter);
    }

    getValMount(ev) {
        this.dataFilter.date = ev.id;
        this.datacontract = [];
        this.getData();
        console.log(this.dataFilter);
    }

    getValStatus(ev) {
        this.dataFilter.pages = 1;
        this.dataFilter.status = ev.id;
        this.datacontract = [];
        this.getData();
        console.log(this.dataFilter);
    }

    getValCategory(ev) {
        // console.log(ev.id);
        this.dataFilter.pages = 1;
        this.dataFilter.category = ev.id;
        this.datacontract = [];
        this.getData();
        console.log(this.dataFilter);
    }

    gantitanggal(v) {
        let a = new Date(v);
        let b = a.getFullYear();
        let c = a.getMonth();
        let d = a.getDate();
        return `${this.addzero(d)}/${this.addzero(c)}/${b}`;
    }

    addzero(u) {
        return u > 9 ? u : `0${u}`;
    }

    paginated(f) {
        this.datacontract = [];
        this.dataFilter.pages = f.pageIndex + 1;
        this.getData();
    }

    onSearchChange(ev) {
        this.datacontract = [];
        this.dataFilter.search = ev;
        this.getData();
    }

    dateChange(ev) {
        console.log(ev);
        var year = ev._i.year;
        var month = ev._i.month + 1;
        var date = ev._i.date;
        var tangal = `${year}-${month}-${date}`;
        console.log(tangal);

        this.dataFilter.pages = 1;
        this.dataFilter.date = tangal;
        this.datacontract = [];
        this.getData();
    }

    sortData(sort: Sort) {
        const data = this.datacontract.slice();
        if (!sort.active || sort.direction === "") {
            this.datacontract = data;
            return;
        }
        this.datacontract = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "contract_no":
                    return this.compare(a.contract_no, b.contract_no, isAsc);
                case "tanggal_selesai":
                    return this.compare(
                        a.tanggal_selesai,
                        b.tanggal_selesai,
                        isAsc
                    );
                // case 'contract_category': return this.compare(a.contract_category.title, b.contract_category.title, isAsc);
                case "customers":
                    return this.compare(
                        a.customers_handle.customers.customer_name,
                        b.customers_handle.customers.customer_name,
                        isAsc
                    );
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
