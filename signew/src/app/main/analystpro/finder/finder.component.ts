import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { MatSort, Sort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { ContractcategoryService } from "app/main/analystpro/services/contractcategory/contractcategory.service";
import { Router } from "@angular/router";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { NgxSpinnerService } from "ngx-spinner";

import * as global from "app/main/global";
import { FinderDetailInformationComponent } from "../finder-detail-information/finder-detail-information.component";
import { ModalDateComponentFinder } from "./modal-date/modal-date.component";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MatDatepickerInputEvent,
    MatCalendarCellCssClasses,
} from "@angular/material/datepicker";
import * as XLSX from "xlsx";
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { LoginService } from "app/main/login/login.service";

import * as _moment from "moment";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { ContactPersonService } from "app/main/analystpro/master/contact-person/contact-person.service";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
import { PdfcontrolService } from "app/main/analystpro/control/pdf/pdfcontrol.service";
import { ControlService } from "app/main/analystpro/control/control.service";
import { ModalAttachmentContractComponent } from "app/main/analystpro/contract/modal-attachment-contract/modal-attachment-contract.component";
import { ModalEditPicComponent } from "./modal-edit-pic/modal-edit-pic.component";
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
    selector: "app-finder",
    templateUrl: "./finder.component.html",
    styleUrls: ["./finder.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class FinderComponent implements OnInit {
    datacontract = [];
    displayedColumns: string[] = [
        "contract_no",
        "no",
        "customer",
        "no_penawaran",
        "created",
        "tgl_selesai",
        "status",
    ];
    total: number;
    from: number;
    to: number;
    pageSize: number;
    current_page: number;
    prev_page_url;
    next_page_url;

    pages = 1;
    contractCategory = [
        {
            id: 0,
            title: "All",
        },
    ];
    customer: any = [
        {
            id_customer: 0,
            customer_name: "All",
        },
    ];

    datastatuskontrak = [
        {
            id: "all",
            name: "All",
        },
        {
            id: 1,
            name: "Pending",
        },
        {
            id: 2,
            name: "On Going",
        },
        {
            id: 3,
            name: "Done",
        },
        {
            id: 4,
            name: "Draft",
        },
    ];

    isLoading = true;
    dataFilter = {
        search: null,
        user: null,
        contract_category: null,
        no_penawaran: null,
        no_po: null,
        customers: null,
        tgl_selesai: null,
        status: null,
        pages: 1,
        excel: null,
        pic: null,
    };
    search;
    datasentCustomer = {
        pages: 1,
        search: null,
        typeContract: null,
    };

    dataMount = [
        {
            id: 0,
            title: "All",
        },
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
    datasentuser = {
        pages: 1,
        search: null,
    };

    datauser: any = [
        {
            user_id: 0,
            employee_name: "All",
        },
    ];

    mine = [];
    asdasd: any;
    dsadsa: any;
    no_po = [];
    no_penawaran = [];
    datafilterno = {
        pages: 1,
        search: null,
    };
    datafilternopenawaran = {
        pages: 1,
        search: null,
    };

    datasendemployee = {
        division: 6,
        search: null,
        pages: 1,
    };
    datasales = [];

    constructor(
        private _contractServ: ContractService,
        private _kontrakategori: ContractcategoryService,
        private _matDialog: MatDialog,
        private _router: Router,
        public _employeeServ: EmployeeService,
        private _spinner: NgxSpinnerService,
        private _customerServ: CustomerService,
        private _cpServ: ContactPersonService,
        private _pdfKendaliServ: PdfcontrolService,
        private _controlServ: ControlService,
        private _loginServ: LoginService
    ) {}

    ngOnInit(): void {
        this.getData();
        this.getDataContractCategory();
        this.getDataCustomer();
        this.getDataUserCreated();
        this.getNoPo();
        this.getNoPenawaran();
        this.getDataSalesEmployee();
    }

    getMe() {
        this._loginServ
            .checking_me()
            .then((x) => (this.mine = this.mine.concat(x)));
    }

    getDataSalesEmployee() {
        this._employeeServ.getDataSales(this.datasendemployee).then((x) => {
            this.datasales = this.datasales.concat(x);
        });
    }

    getDataContractCategory() {
        this._kontrakategori.getDataContractCategory({ page: 1 }).then((x) => {
            this.contractCategory = this.contractCategory.concat(x["data"]);
        });
    }

    tglEstimasiLabChange() {
        this.dataFilter.tgl_selesai = this.dataFilter.tgl_selesai
            ? _moment(this.dataFilter.tgl_selesai).format("YYYY-MM-DD")
            : null;
        this.datacontract = [];
        this.dataFilter.pages = 1;
        this.dataFilter.search = null;
        this.getData();
    }

    getDataExcel() {
        let dialogCust = this._matDialog.open(ModalDateComponentFinder, {
            height: "auto",
            width: "800px",
        });

        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    async editPIC(v, u) {
        let dialogCust = this._matDialog.open(ModalEditPicComponent, {
            height: "auto",
            width: "400px",
            data: {
                contract_id: v,
                sales_id: u,
            },
        });

        dialogCust.afterClosed().subscribe(async (result) => {
            this.datacontract = [];
            this.getData();
        });
    }

    async getDataContractByFilter() {
        this.dataFilter.excel = await 1;
        let dataforfilter = await [];
        await this._contractServ
            .getDataContractLight_2(this.dataFilter)
            .then((x: any) => {
                x.forEach((h, v) => {
                    dataforfilter = dataforfilter.concat({
                        No: v + 1,
                        Contract: h.contract_no,
                        Tgl_input: h.inserted_at,
                        Customer: h.customers_handle.customers.customer_name,
                        Contact_person: h.customers_handle.contact_person.name,
                        No_Penawaran: h.no_penawaran,
                        No_PO: h.no_po,
                        Created_By: h.employee_name,
                        Tgl_selesai: h.tgl_selesai[0].tgl_selesai,
                        pic_sales: h.pic_sales,
                        biaya_pengujian: h.biaya_pengujian,
                        disc: h.discount
                    });
                });
            });

        const filename = await `Data Contract By Filter.xlsx`;
        const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(
            dataforfilter
        );
        const wb: XLSX.WorkBook = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, `Data`);
        await XLSX.writeFile(wb, filename);
        this.dataFilter.excel = await null;
    }

    getNoPo() {
        this._contractServ
            .getnopo(this.datafilterno)
            .then((x:any) =>{
                this.no_po = this.no_po.concat(x.data)
            })
            // .then(
            //     () => (this.no_po = global.uniq(this.no_po, (it) => it.no_po))
            // );
    }

    getNoPenawaran() {
        this._contractServ
            .getnopenawaran(this.datafilternopenawaran)
            .then(
                (x) => (this.no_penawaran = this.no_penawaran.concat(x))
            )
            
    }

    async getDataCustomer() {
        await this._customerServ
            .getDataCustomers(this.datasentCustomer)
            .then((x) => {
                this.customer = this.customer.concat(x["data"]);
            });
        this.customer = await global.uniq(
            this.customer,
            (it) => it.id_customer
        );
    }

    async getDataUserCreated() {
        await this._contractServ
            .getDataCreated(this.datasentuser)
            .then((x) => (this.datauser = this.datauser.concat(x["data"])));
        this.datauser = global.uniq(this.datauser, (it) => it.user_id);
    }

    async searching() {
        this.dataFilter.pages = 1;
        this.datacontract = [];
        this.getData();
    }

    async getData() {
        await this._spinner.show();
        await this._contractServ
            .getDataContractLight_2(this.dataFilter)
            .then((x: any) => {
                this.current_page = x["current_page"] - 1;
                this.from = x["from"];
                this.to = x["to"];
                this.total = x['total'];
                this.next_page_url = x['next_page_url'];
                this.prev_page_url = x['prev_page_url'];
                this.datacontract = this.datacontract.concat(x["data"]);
            });
        await this.getMe();
        await this._spinner.hide();
    }

    seeDetails(v) {
        const url = this._router.serializeUrl(
            this._router.createUrlTree([`/analystpro/view-contract/${v}`])
        );

        let baseUrl = window.location.href.replace(this._router.url, "");
        window.open(baseUrl + url, "_blank");
    }

    async openAttachMent(v, st) {
        const dialogRef = await this._matDialog.open(
            ModalAttachmentContractComponent,
            {
                height: "auto",
                width: "500px",
                data: {
                    value: v,
                    status: st,
                },
            }
        );
        await dialogRef.afterClosed().subscribe(async (x) => {});
    }

    async formkendali(e) {
        if (this.mine[0].id_bagian == 6) {
            await global.swalerror(
                "You dont have authority to download this document !!"
            );
        } else {
            await this._controlServ
                .getDataParameterinContract(e)
                .then(async (x) => {
                    this.asdasd = await x;
                });
            await this._controlServ.getDetailDataContract(e).then((x) => {
                this.dsadsa = [x];
            });

            let a = {
                contract: await this.dsadsa,
                parameter: await this.asdasd,
            };

            await this._pdfKendaliServ.generatePdf(a);
        }
    }

    onActivate(ev) {
        if (ev.type == "click") {
            console.log('ds');
        }
    }

    info(value) {
        let dialogCust = this._matDialog.open(
            FinderDetailInformationComponent,
            {
                height: "700px",
                width: "800px",
                data: {
                    infotransaction: value,
                },
            }
        );

        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    clickSelect(ev, val) {
        switch (val) {
            case "po":
                if (this.no_po.length < 1) {
                    this.getNoPo();
                } else {
                    return;
                }
                break;
            case "penawaran":
                if (this.no_penawaran.length < 1) {
                    this.getNoPenawaran();
                } else {
                    return;
                }
                break;
        }
    }

    paginated(ev) {
        this.dataFilter.pages = ev.pageIndex + 1;
        this.datacontract = [];
        this.getData();
    }

    onScrollToEnd(e) {
        switch (e) {
            case "cust":
                this.datasentCustomer.pages = this.datasentCustomer.pages + 1;
                this.getDataCustomer();
                break;
            case "po":
                this.datafilterno.pages = this.datafilterno.pages + 1;
                this.getNoPo();
                break;
            case "penawaran":
                this.datafilternopenawaran.pages =
                    this.datafilternopenawaran.pages + 1;
                this.getNoPenawaran();
                break;
            case "sales":
                this.datasendemployee.pages = this.datasendemployee.pages + 1;
                this.getDataSalesEmployee();
                break;
        }
    }

    reset(e) {
        if (e === "Category") {
            this.contractCategory = this.contractCategory.concat({
                id: 0,
                title: "All",
            });
            this.dataFilter.contract_category = 0;
            this.datacontract = [];
            this.getData();
        } else if (e === "customer") {
            this.customer = this.customer.concat({
                id_customer: 0,
                customer_name: "All",
            });
            this.dataFilter.customers = 0;
            this.datacontract = [];
            this.getData();
        } else if (e === "Status") {
            this.dataFilter.status = 0;
            this.datacontract = [];
            this.getData();
        } else if (e === "user") {
            this.datauser = this.datauser.concat({
                user_id: 0,
                employee_name: "All",
            });
            this.dataFilter.user = 0;
            this.datacontract = [];
            this.getData();
        }
    }

    onsearchselect(ev, val) {
        switch (val) {
            case "cust":
                this.customer = [];
                this.datasentCustomer.search = ev.term;
                this.datasentCustomer.pages = 1;
                this.getDataCustomer();
                break;
            case "po":
                this.no_po = [];
                this.datafilterno.search = ev.term;
                this.datafilterno.pages = 1;
                this.getNoPo();
                break;
            case "penawaran":
                this.no_penawaran = [];
                this.datafilternopenawaran.search = ev.term;
                this.datafilternopenawaran.pages = 1;
                this.getNoPenawaran();
                break;
            case "sales":
                this.datasales = [];
                this.datasendemployee.search = ev.term;
                this.datasendemployee.pages = 1;
                this.getDataSalesEmployee();
        }
    }

    getValue(ev) {
        this.datacontract = [];
        this.dataFilter.pages = 1;
        this.dataFilter.search = null;
        this.getData();
    }
}
