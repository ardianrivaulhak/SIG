import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { PenawaranService } from "./penawaran.service";
import { fuseAnimations } from "@fuse/animations";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import { LoginService } from "app/main/login/login.service";
import { ModalAttachmentContractComponent } from "app/main/analystpro/contract/modal-attachment-contract/modal-attachment-contract.component";
import { MatDialog } from "@angular/material/dialog";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
import { ModalHistoryComponent } from "./modal-history/modal-history.component";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import { Router } from "@angular/router";

import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { ContractcategoryService } from "app/main/analystpro/services/contractcategory/contractcategory.service";
import * as _moment from "moment";
import * as global from "app/main/global";
import { ModalDatePenawaranComponent } from "./modal-date-penawaran/modal-date-penawaran.component";
import * as XLSX from "xlsx";
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
    selector: "app-penawaran",
    templateUrl: "./penawaran.component.html",
    styleUrls: ["./penawaran.component.scss"],
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
export class PenawaranComponent implements OnInit {
    datasent = {
        pages: 1,
        search: null,
        customers: 0,
        contract_category: 0,
        sales: 0,
        status: 0,
        used: 0
    };

    datasend = {
        pages: 1,
        search: null,
        level: null,
        division: 6,
        employeestatus: null,
    };

    dataPenawaran = [];
    me = [];
    

    datasentCustomer = {
        pages: 1,
        search: null,
        typeContract: null,
    };

    dataemployee: any = [
        {
            employee_id: 0,
            employee_name: "All",
        },
    ];

    customer: any = [
        {
            id_customer: 0,
            customer_name: "All",
        },
    ];
    contractcategory = [
        {
            id: 0,
            title: "All",
        },
    ];

    status = [
        {
            id: 0,
            title: "All",
        },
        {
            id: 1,
            title: "Pending",
        },
        {
            id: 2,
            title: "Approved",
        },
    ];

    loadingfirst = true;
    quotationset = [
        {
            id: 0,
            name: 'All'
        },
        {
            id: 1,
            name: 'Used'
        },
        {
            id: 2,
            name: 'Not yet'
        }
    ];

    constructor(
        private _penawaranServ: PenawaranService,
        private pdfServ: PdfService,
        private loginServ: LoginService,
        private _kontrakategori: ContractcategoryService,
        private _employeeServ: EmployeeService,
        private _router: Router,
        private _customerServ: CustomerService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.loadingfirst = true;
        this.getData();
        this.getme();
        this.getDataEmployee();
        this.getDataCustomer();
        this.getDataContractCategory();
    }

    async getDataCustomer() {
        await this._customerServ
            .getDataCustomers(this.datasentCustomer)
            .then((x: any) => {
                this.customer = this.customer.concat(x["data"]);
            });
        this.customer = await global.uniq(
            this.customer,
            (it) => it.id_customer
        );
    }

    getDataEmployee() {
        this._employeeServ
            .getData(this.datasend)
            .then((e: any) => {
                this.dataemployee = this.dataemployee.concat(e.data);
            })
            .then(() => {
                this.dataemployee = global.uniq(
                    this.dataemployee,
                    (it) => it.user_id
                );
            });
    }

    getValue(ev) {
        this.dataPenawaran = [];
        this.datasent.pages = 1;
        this.getData();
    }

    

    onSearchi(ev, status) {
        switch (status) {
            case "cust":
                this.customer = [];
                this.datasentCustomer.search = ev.term;
                this.datasentCustomer.pages = 1;
                this.getDataCustomer();
                break;
            case "employee":
                this.datasend.pages = 1;
                this.datasend.search = ev.term;
                this.dataemployee = [];
                this.getDataEmployee();
                break;
        }
    }

    async getDataContractCategory() {
        await this._kontrakategori
            .getDataContractCategory(this.datasent)
            .then((x) => {
                this.contractcategory = this.contractcategory.concat(x["data"]);
            });
    }

    reset(e) {
        switch (e) {
            case "customer":
                this.customer = this.customer.concat({
                    id_customer: 0,
                    customer_name: "All",
                });
                this.getDataCustomer();
                this.datasent.customers = 0;
                break;
                case 'employee':
            this.dataemployee = [];
            this.datasend = {
                pages: 1,
                search: null,
                level: null,
                division: 6,
                employeestatus: null,
            };
            this.dataemployee = [
                {
                    employee_id: 0,
                    employee_name: "All",
                },
            ];

            this.getDataEmployee();
            break;
        }
    }

    getme() {
        this.loginServ.checking_me().then((e) => (this.me = this.me.concat(e)));
    }

    onSearchChange(ev) {
        
        this.dataPenawaran = [];
        this.datasent.pages = 1;
        this.getData();
    }

    onScrollToEnd(e) {
        switch (e) {
            case "customer":
                this.datasentCustomer.pages = this.datasentCustomer.pages + 1;
                this.getDataCustomer();
                break;
        }
    }

    async getData() {
        await this._penawaranServ
            .getDataPenawaran(this.datasent)
            .then(
                (x) =>
                    (this.dataPenawaran = this.dataPenawaran.concat(x["data"]))
            )
            .then(() => {
                setTimeout(() => {
                    this.loadingfirst = false;
                }, 1000);
            });
    }

    async penawaranr() {
        const dialogRef = await this.dialog.open(ModalDatePenawaranComponent, {
            height: "auto",
            width: "500px",
        });

        await dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                this.exportExcel(result);
            } else {
                global.swalerror("Harap isi bulan dan tahun dengan benar");
            }
        });
    }

    exportExcel(v) {
        this._penawaranServ
            .getExcelPenawaranbySales(v.month)
            .then(async (x: any) => {
                const filename = await `penawaran-${v.name}-${v.year}.xlsx`;

                const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(x);
                const wb: XLSX.WorkBook = await XLSX.utils.book_new();

                await XLSX.utils.book_append_sheet(wb, ws, "Data");
                await XLSX.writeFile(wb, filename);
            });
    }

    pdfPenawaran(v, t, s) {
        this._penawaranServ
            .getDataPenawaranShow(v.id)
            .then((e) =>
                t == "id"
                    ? this.pdfServ
                          .generatePdfPenawaranID(e, s)
                          .then((e) => console.log(e))
                    : this.pdfServ
                          .generatePdfPenawaranEN(e, s)
                          .then((e) => console.log(e))
            );
    }

    async viewPenawaran(v, st) {
        const url = this._router.serializeUrl(
            this._router.createUrlTree([
                `/analystpro/${
                    st == "edit" ? "penawaran-det" : "view-penawaran"
                }/${v.id}`,
            ])
        );

        let baseUrl = window.location.href.replace(this._router.url, "");
        window.open(baseUrl + url, "_blank");
    }

    async upload(v, st) {
        const dialogRef = await this.dialog.open(
            ModalAttachmentContractComponent,
            {
                height: "auto",
                width: "1080px",
                data: {
                    value: v,
                    status: st,
                },
            }
        );
        await dialogRef.afterClosed().subscribe(async (x) => {});
    }

    approving(v, val) {
        let impl = [104, 85, 309];
        global.swalyousure("Apakah penawaran di setujui ?").then((e) => {
            if (e.isConfirmed) {
                if (impl.includes(this.me[0].user_id)) {
                    this._penawaranServ
                        .penawaranApprove(v.id, val)
                        .then((e) => {
                            global.swalsuccess("Success", e["message"]);
                            this.dataPenawaran = [];
                            this.getData();
                        })
                        .catch((a) =>
                            global.swalerror("Error at database, contact IT")
                        );
                } else {
                    global.swalerror(
                        "You dont have authority to change status"
                    );
                }
            }
        });
    }

    deletePenawaran(v, val) {
        global
            .swalyousure("Penawaran akan terdelete secara permanent ?")
            .then((e) => {
                if (e.isConfirmed) {
                    this._penawaranServ
                        .penawaranApprove(v.id, val)
                        .then((e) => {
                            global.swalsuccess("Success", e["message"]);
                            this.dataPenawaran = [];
                            this.getData();
                        })
                        .catch((a) =>
                            global.swalerror("Error at database, contact IT")
                        );
                }
            });
    }

    onScroll(e) {
        this.datasent.pages = this.datasent.pages + 1;
        this.getData();
    }

    async historyPenawaran(v) {
        const dialogRef = await this.dialog.open(ModalHistoryComponent, {
            height: "auto",
            width: "700px",
            data: v.tphs,
        });
        await dialogRef.afterClosed().subscribe(async (x) => {});
    }
}
