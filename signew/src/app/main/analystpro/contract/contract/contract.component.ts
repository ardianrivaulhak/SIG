import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { ContractService } from "../../services/contract/contract.service";
import { fuseAnimations } from "@fuse/animations";
import { ContractcategoryService } from "../../services/contractcategory/contractcategory.service";
import { ContactPersonService } from "../../master/contact-person/contact-person.service";
import { CustomerService } from "../../master/customers/customer.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import { MatDialog } from "@angular/material/dialog";
import { ModalAkgContractComponent } from "../modal-akg-contract/modal-akg-contract.component";
import { ModalSamplingContractComponent } from "../modal-sampling-contract/modal-sampling-contract.component";
import { PaymentcashierComponent } from "app/main/analystpro/keuangan/paymentcashier/paymentcashier.component";
import { ModalInfofinanceComponent } from "../modal-infofinance/modal-infofinance.component";
import { LoginService } from "app/main/login/login.service";
import { ModalAttachmentContractComponent } from "../modal-attachment-contract/modal-attachment-contract.component";
import { MailPopupComponent } from "../mail-popup/mail-popup.component";
import * as XLSX from "xlsx";
import * as global from "app/main/global";
import { NgxSpinnerService } from "ngx-spinner";
import { ModalPhotoParameterComponent } from "../modal-photo-parameter/modal-photo-parameter.component";

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
// export interface ContractPerson {
//   id: string;
//   user: string;
// }
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
    selector: "app-contract",
    templateUrl: "./contract.component.html",
    styleUrls: ["./contract.component.scss"],
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
export class ContractComponent implements OnInit {
    delete;
    datacontractDetail = [];
    datacontract = [];
    displayedColumns: string[] = [
        "contract_no",
        "tanggal_terima",
        "customers",
        "user_create",
        "tgl_selesai",
        "status",
        "action",
    ];
    statuscontract = [
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
        {
            id: 3,
            title: "Waiting Disc Approval",
        },
    ];
    status = [
        {
            id: 0,
            title: "All",
        },
        {
            id: 1,
            title: "Bogor",
        },
        {
            id: 2,
            title: "Jakarta",
        },
        {
            id: 3,
            title: "Package",
        },
        {
            id: 4,
            title: "Surabaya",
        },
        {
            id: 5,
            title: "Semarang",
        },
    ];
    statusfirst = 0;
    loading = false;

    total: number;
    from: number;
    to: number;
    current_page: number;
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
        search: null,
        user: null,
        contract_category: null,
        customers: null,
        tgl_selesai: null,
        status: 0,
        statuscontract: 0,
        pages: 1,
        pagefor: "cs",
    };
    createdName = [];
    contractcategory = [
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
    contactperson = [];
    access = [];
    datauser: any = [
        {
            user_id: 0,
            employee_name: "All",
        },
    ];
    datasentuser = {
        pages: 1,
        search: null,
    };

    mine = [];
    totalchecked = 0;

    useracc = [];
    useraccidonly = [];

    constructor(
        private _kontrakServ: ContractService,
        private _loginServ: LoginService,
        private _kontrakategori: ContractcategoryService,
        private _customerServ: CustomerService,
        private _cpServ: ContactPersonService,
        private _menuServ: MenuService,
        private _router: Router,
        private _spinner: NgxSpinnerService,
        private dialog: MatDialog,
        private PdfServ: PdfService
    ) {}
    ngOnInit(): void {
        this.checkauthentication();
        this.getUserAcc();
    }

    onScroll(e) {
        this.datasent.pages = this.datasent.pages + 1;
        this.getData();
    }

    checkcontract(v) {
        switch (v.contract_type) {
            case 4:
                return "Surabaya";
            case 3:
                return "Package";
            case 2:
                return "Jakarta";
            case 1:
                return "Bogor";
            case 5:
                return "Semarang";
        }
    }

    async checked(ev, st) {
        if (st == "all") {
            this.datacontract = this.datacontract.map((p) => ({
                ...p,
                checked:
                    p.kontrakuji.contract_attachment.length > 0
                        ? this.useracc
                              .filter(
                                  (r) => r.iduser == this.mine[0].employee_id
                              )
                              .map((a) => a.type)[0]
                              .includes(p.kontrakuji.contract_type)
                            ? p.status < 1
                                ? ev
                                    ? 1
                                    : 0
                                : 0
                            : 0
                        : 0,
            }));
        } else {
            // console.log(this.useracc
            //     .filter((r) => r.iduser == this.mine[0].employee_id)
            //     .map((a) => a.type)[0]
            //     .includes(this.datacontract[st].kontrakuji.contract_type))
            this.datacontract[st].checked = this.useracc
                .filter((r) => r.iduser == this.mine[0].employee_id)
                .map((a) => a.type)[0]
                .includes(this.datacontract[st].kontrakuji.contract_type)
                ? ev
                    ? 1
                    : 0
                : 0;
            console.log(this.datacontract);
        }
        this.totalchecked = this.datacontract.filter((e) => e.checked).length;
    }

    checkdisable(v, i) {
        let y = this.useracc.filter(
            (r) => r.iduser == this.mine[0].employee_id
        );
        if (y.length > 0) {
            if (y.map((a) => a.type)[0].includes(v.kontrakuji.contract_type)) {
                return v.kontrakuji.contract_attachment.length > 0
                    ? v.status < 1
                        ? false
                        : true
                    : true;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    async checkauthentication() {
        await this._menuServ
            .checkauthentication(this._router.url)
            .then((x) => {
                if (!x.status) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "You dont have an access to this page !",
                    }).then((res) => {
                        if (res.isConfirmed || res.isDismissed) {
                            this._router.navigateByUrl("apps");
                        }
                    });
                } else {
                    this.access = this.access.concat(x.access);
                    this.delete = this.access[0].delete > 0 ? false : true;
                }
            })
            .then(() => {
                this.getData();
                this.getDataContractCategory();
                this.getDataCustomer();
                this.getDataCreated();
                this.getMe();
            });
    }

    searching() {
        console.log("a");
    }

    getMe() {
        this._loginServ
            .checking_me()
            .then((x) => (this.mine = this.mine.concat(x)));
    }

    openPdf(v, val) {
        this._kontrakServ.getDataDetailKontrak(v).then((x) => {
            this.PdfServ.generatePdf(x, val);
        });
    }

    downloadExcelParameter(v, contract_no) {
        this._kontrakServ.getExcelParameter(v).then(async (x: any) => {
            const filename = await `Data From ${contract_no}.xlsx`;
            const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(x);
            const wb: XLSX.WorkBook = await XLSX.utils.book_new();
            await XLSX.utils.book_append_sheet(wb, ws, `Data`);
            await XLSX.writeFile(wb, filename);
        });
    }

    seeDetails(v) {
        const url = this._router.serializeUrl(
            this._router.createUrlTree([`/analystpro/view-contract/${v}`])
        );

        let baseUrl = window.location.href.replace(this._router.url, "");
        window.open(baseUrl + url, "_blank");
    }

    editContract(v) {
        this._router.navigateByUrl("analystpro/edit-contract/" + v);
    }

    async modalPhoto(v) {
        const dialogRef = await this.dialog.open(ModalPhotoParameterComponent, {
            height: "auto",
            width: "800px",
            disableClose: true,
            panelClass: "parameter-modal",
            data: v,
        });

        await dialogRef.afterClosed().subscribe(async (result) => {});
    }

    async openAttachMent(v, st) {
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
        await dialogRef.afterClosed().subscribe(async (x) => {
            this.datacontract = await [];
            await this.getData();
        });
    }

    async refresh() {
        this.dataFilter = await {
            search: null,
            user: null,
            contract_category: null,
            customers: null,
            tgl_selesai: null,
            status: 0,
            statuscontract: 0,
            pages: 1,
            pagefor: "cs",
        };
        this.datacontract = await [];
        await this.getData();
    }

    async emailsendtocust(v) {
        const dialogRef = await this.dialog.open(MailPopupComponent, {
            height: "auto",
            width: "600px",
            data: v,
        });
        await dialogRef.afterClosed().subscribe(async (v) => {});
        // global.swalyousure("Are you sure ?").then(x => {
        //     if(x.isConfirmed){
        //         this._kontrakServ.sendEmailCust(v)
        //         .then(x => global.swalsuccess("success","Success Emailing Customer"))
        //         .catch(g => global.swalerror('Error Email Salah'))
        //     }
        // })
    }

    async payment(ev) {
        const dialogRef = await this.dialog.open(PaymentcashierComponent, {
            height: "auto",
            width: "100%",
            panelClass: "payment-cashier-dialog",
            data: {
                contract_no: ev.contract_no,
                id_kontrakuji: ev.id_kontrakuji,
            },
        });
        await dialogRef.afterClosed().subscribe(async (v) => {});
    }

    async infofinance(ev) {
        const dialogRef = await this.dialog.open(ModalInfofinanceComponent, {
            height: "auto",
            width: "600px",
            panelClass: "info-finance-dialog",
            data: {
                contract_no: ev.contract_no,
                id_kontrakuji: ev.id_kontrakuji,
            },
        });
        await dialogRef.afterClosed().subscribe(async (v) => {});
    }

    async akgRevisi(v) {
        const dialogRef = await this.dialog.open(ModalAkgContractComponent, {
            height: "auto",
            width: "1080px",
            data: v,
        });
        await dialogRef.afterClosed().subscribe(async (v) => {});
    }

    async samplingRevisi(v) {
        const dialogRef = await this.dialog.open(
            ModalSamplingContractComponent,
            {
                height: "auto",
                width: "800px",
                data: v,
            }
        );
        await dialogRef.afterClosed().subscribe(async (v) => {});
    }

    setApprove(v) {
        global.swalyousure("Sure").then((e) => {
            if (e.isConfirmed) {
                this._kontrakServ
                    .allowContractRev(v.kontrakuji.id_kontrakuji)
                    .then((x: any) => {
                        if (x.status) {
                            global.swalsuccess("success", x.message);
                        }
                    })
                    .then(() => {
                        // this.dataFilter = {
                        //     search: null,
                        //     user: null,
                        //     contract_category: null,
                        //     customers: null,
                        //     tgl_selesai: null,
                        //     status: 0,
                        //     statuscontract: 0,
                        //     pages: 1,
                        //     pagefor: "cs",
                        // };
                        this.datacontract = [];
                        this.getData();
                    })
                    .catch((e) =>
                        global.swalerror(
                            "Error at Backend, Please contact IT !"
                        )
                    );
            }
        });
    }

    async deleteContract(val) {
        let e = await [];
        await this._kontrakServ.checkSampleLab(val.contract_id).then((g) => {
            e = e.concat(g);
        });
        if (e.length > 0) {
            await global.swalerror(
                "Error Invoice sudah terbuat tidak bisa men delete kontrak"
            );
        } else {
            await Swal.fire({
                title: "Berikan alasan untuk membatalkan uji",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off",
                },
                showCancelButton: true,
                confirmButtonText: "Send",
                showLoaderOnConfirm: true,
                preConfirm: (desc) => {
                    return this._kontrakServ
                        .deleteContract({
                            id_kontrakuji: val.contract_id,
                            desc: desc,
                        })
                        .then((x: any) => x)
                        .catch((error) => {
                            Swal.showValidationMessage(
                                `Request failed: ${error}`
                            );
                        });
                },
                allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
                if (result.isConfirmed) {
                    this.datacontract = [];
                    this.getData();
                    Swal.fire({
                        title: "Data Succesfully Deleted",
                        icon: "success",
                        confirmButtonText: "Ok",
                    });
                }
            });
        }
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

    onPaginateChange(ev) {
        this.datacontract = [];
        this.dataFilter.pages = ev.pageIndex + 1;
        this.getData();
    }

    async getData() {
        await this._spinner.show();
        await this._kontrakServ
            .getDataContractLight_1(this.dataFilter)
            .then((x) => {
                this.datacontract = this.datacontract.concat(x["data"]);

                this.total = x["total"];
                this.current_page = x["current_page"] - 1;
                this.from = x["from"];
                this.to = x["per_page"];
            });
        this.datacontract = await global.uniq(
            this.datacontract,
            (t) => t.contract_id
        );

        await this._spinner.hide();
        // remove duplicates array
        this.createdName = this.uniq(this.createdName, (it) => it.id);
    }

    // setTanggal(){
    //     this.datacontract.forEach(x => {
    //         this._kontrakServ.getDataTanggalSelesai(x.id_kontrakuji).then(v => {
    //             console.log(v);
    //         })
    //     })
    // }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    checkTglSelesai(v) {
        return "4";
    }

    onScrollToEnd(e) {
        this.loading = true;
        if (e === "customer") {
            this.datasentCustomer.pages = this.datasentCustomer.pages + 1;
            this.getDataCustomer();
        } else if (e === "user") {
            this.datasentuser.pages = this.datasentuser.pages + 1;
            this.getDataCreated();
        }
        setTimeout(() => {
            this.loading = false;
        }, 200);
    }

    reset(e) {
        if (e === "Category") {
            this.dataFilter.contract_category = 0;
            this.datacontract = [];
            this.getData();
        } else if (e === "customer") {
            this.customer = this.customer.concat({
                id_customer: 0,
                customer_name: "All",
            });
            this.getDataCustomer();
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
        } else if (e === "statuscontract") {
            this.dataFilter.statuscontract = 0;
            this.datacontract = [];
            this.getData();
        }
    }

    async getUserAcc() {
        await this._kontrakServ
            .approved_user()
            .then((x) => (this.useracc = this.useracc.concat(x)));
        this.useraccidonly = await this.useracc.map((p) => p.iduser);
    }

    approvingchecked() {
        global.swalyousure("You will Accept this Data!").then((e) => {
            if (e.isConfirmed) {
                this._kontrakServ
                    .acceptContract(
                        this.datacontract
                            .filter((e) => e.checked)
                            .map((a) => a.contract_id)
                    )
                    .then((x) =>
                        global
                            .swalsuccess("Success", "Saving Success")
                            .then((ax) => {
                                if (ax.isConfirmed) {
                                    this.datacontract = [];
                                    this.getData();
                                    this.totalchecked = 0;
                                }
                            })
                    );
            }
        });
    }

    async accept(v) {
        let userbolehapp = await [];

        await this.useracc.forEach((ea) => {
            let jk = ea.type.filter((r) => r === v.kontrakuji.contract_type);
            if (jk.length > 0) {
                userbolehapp = userbolehapp.concat(ea.iduser);
            }
        });
        if (
            this.useracc.map((p) => p.iduser).includes(this.mine[0].employee_id)
        ) {
            await Swal.fire({
                title: "Are you sure?",
                text: "You will Accept this Data!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, Accept it!",
                cancelButtonText: "No, Cancel It",
            }).then((result) => {
                if (result.value) {
                    if (userbolehapp.indexOf(this.mine[0].employee_id) > -1) {
                        this._kontrakServ
                            .getContractAttachment(v.contract_id)
                            .then((x: any) => {
                                if (x.success) {
                                    this._kontrakServ
                                        .acceptContract([v.contract_id])
                                        .then((x) => {
                                            setTimeout(() => {
                                                Swal.fire({
                                                    title: "Data Succesfully Accepted",
                                                    icon: "success",
                                                    confirmButtonText: "Ok",
                                                });
                                            });
                                        })
                                        .then(() => {
                                            this.datacontract = [];
                                            this.getData();
                                        })
                                        .catch((e) => {
                                            setTimeout(() => {
                                                //   this.openSnackBar(message);
                                                Swal.fire(
                                                    "Cancelled",
                                                    "Error at Backend, Please Contact IT for more Details",
                                                    "error"
                                                );
                                            });
                                        });
                                } else {
                                    Swal.fire(
                                        "Fail !",
                                        "Anda Harus Upload Attachment Terlebih dahulu !",
                                        "error"
                                    );
                                }
                            });
                    } else {
                        global.swalerror(
                            "You're not allowed to approve this contract"
                        );
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire(
                        "Cancelled",
                        "Your Data is Still Not Accepted :)",
                        "error"
                    );
                }
            });
        } else {
            await global.swalerror("Your not allowed to approve contract !!");
        }
    }

    async getDataCreated() {
        await this._kontrakServ
            .getDataCreated(this.datasentuser)
            .then((x) => (this.datauser = this.datauser.concat(x["data"])));
        this.datauser = await global.uniq(this.datauser, (it) => it.user_id);
    }

    getValUser(ev) {
        // this.dataFilter.user = ev.user_id;
        this.datacontract = [];
        this.getData();
    }

    async getDataContractCategory() {
        await this._kontrakategori
            .getDataContractCategory(this.datasent)
            .then((x) => {
                this.contractcategory = this.contractcategory.concat(x["data"]);
            });
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

    getValCust(ev) {
        // this.dataFilter.customers = ev.id_customer;
        this.datacontract = [];
        this.getData();
    }

    getValStatusContract(ev) {
        this.dataFilter.statuscontract = ev.id;
        this.datacontract = [];
        this.getData();
    }

    getValStatus(ev) {
        this.dataFilter.status = ev.id;
        this.datacontract = [];
        this.getData();
    }

    getValCategory(ev) {
        // this.dataFilter.contract_category = ev.id;
        this.datacontract = [];
        this.getData();
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
        this.getData();
    }

    onsearchselect(ev, val) {
        if (val === "cust") {
            this.customer = [];
            this.datasentCustomer.search = ev.term;
            this.datasentCustomer.pages = 1;
            this.getDataCustomer();
        } else if (val === "user") {
            this.datauser = [];
            this.datasentuser = {
                pages: 1,
                search: ev.term,
            };
            this.getDataCreated();
        }
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
                case "tanggal_terima":
                    return this.compare(
                        a.tanggal_terima,
                        b.tanggal_terima,
                        isAsc
                    );
                case "tanggal_selesai":
                    return this.compare(
                        a.tanggal_selesai,
                        b.tanggal_selesai,
                        isAsc
                    );
                case "contract_category":
                    return this.compare(
                        a.contract_category.title,
                        b.contract_category.title,
                        isAsc
                    );
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
