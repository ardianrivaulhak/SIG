import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PenawaranService } from "../penawaran.service";
import { fuseAnimations } from "@fuse/animations";
import { MatDialog } from "@angular/material/dialog";
import { PenawaranViewDetailComponent } from "../penawaran-view-detail/penawaran-view-detail.component";
import { ModalPhotoViewcontractComponent } from "app/main/analystpro/view-contract/modal/modal-photo-viewcontract/modal-photo-viewcontract.component";
import { PdfService } from "../../services/pdf/pdf.service";
import { LoginService } from "app/main/login/login.service";
import * as global from "app/main/global";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";

@Component({
    selector: "app-penawaran-view",
    templateUrl: "./penawaran-view.component.html",
    styleUrls: ["./penawaran-view.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class PenawaranViewComponent implements OnInit {
    statusview;
    loadingprevapp;

    dataSource: any = [];
    data = [];
    displayedColumns: string[] = [
        "no",
        "samplename",
        "status",
        "biaya",
        "action",
        // 'st_lab',
    ];
    loading = false;
    total: number;
    from: number;
    to: number;
    per_page: number;
    pages = 1;
    datasent = {
        pages: 1,
        search: null,
    };
    dataview = [];
    idPenawaran: any;
    panelOpenState = false;
    samplename = "";
    datainvoice = [];
    chatopen = 0;
    me = [];
    dataChat = [];
    unread = 0;
    chatnumber = 0;
    chat = [];
    totalbiaya = 0;
    samplingprice = 0;
    akgprice = 0;
    hidden = true;
    datasample = [];
    sendchat: string;
    hide = true;
    loadingprev = false;
    hidingprice = false;
    loadingparameter = false;
    seehasiluji = false;
    mouset;
    approvepenawaranAsmen = [52, 67, 307];
    approvepenawaranManager = [11, 48, 307];

    constructor(
        private _penawaranServ: PenawaranService,
        private _route: Router,
        private _actRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private dialog: MatDialog,
        private _pdfServ: PdfService,
        private _loginServ: LoginService,
        private pdfServ: PdfService,
        private _kontrakServ: ContractService
    ) {
        this.idPenawaran = this._actRoute.snapshot.params["id"];
        this._route.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
    }

    searchsample() {
        if (this.samplename.length > 3) {
            this.dataSource = this.datasample.filter(
                (x) =>
                    x.no_sample
                        .toLowerCase()
                        .indexOf(this.samplename.toLowerCase()) > -1 ||
                    x.sample_name
                        .toLowerCase()
                        .indexOf(this.samplename.toLowerCase()) > -1
            );
        } else {
            this.dataSource = this.datasample;
        }
    }

    gotoModalViewDetail(val) {
        let dialogCust = this.dialog.open(PenawaranViewDetailComponent, {
            height: "500px",
            width: "800px",
            data: val,
        });
        dialogCust.afterClosed().subscribe((result) => {});
    }

    async getModalAddPhoto(v) {
        const dialogRef = await this.dialog.open(
            ModalPhotoViewcontractComponent,
            {
                height: "auto",
                width: "800px",
                panelClass: "parameter-modal",
                data: {
                    samplename: v.sample_name,
                    id_sample: v.id,
                    no_sample: v.no_sample,
                },
            }
        );

        await dialogRef.afterClosed().subscribe(async (result) => {
            await console.log(result);
        });
    }

    ngOnInit(): void {
        this.getData();
        this.checkme();
    }

    pdfPenawaran(t, s) {
        this._penawaranServ
            .getDataPenawaranShow(this.idPenawaran)
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

    checkme() {
        this._loginServ
            .checking_me()
            .then((x) => (this.me = this.me.concat(x)));
    }

    getData() {
        this._penawaranServ
            .getDataPenawaranShow(this.idPenawaran)
            .then(async (x: any) => {
                this.dataview = this.dataview.concat(x);
            })
            .then(() => this.getdataMou());
    }

    getSubTotal() {
        return (
            this.dataview[0].payment.totalpembayaran -
            this.dataview[0].payment.hargadiscount
        );
    }

    getppn(v) {
        let a = v.payment.ppn.toFixed();

        return parseInt(a);
    }

    paginated(f) {
        this.dataSource = [];
        this.datasent.pages = f.pageIndex + 1;
    }

    approve() {
        global.swalyousure("Yakin akan approve Penawaran ini ?").then((x) => {
            if (x.isConfirmed) {
                if (!this.mouset) {
                    if (this.dataview[0].payment.totalpembayaran < 10000000) {
                        if (this.dataview[0].payment.discountconv > 0) {
                            if (
                                this.approvepenawaranAsmen.includes(
                                    this.me[0].employee_id
                                )
                            ) {
                                this.approveact();
                            } else {
                                global.swalerror(
                                    "Hanya Asst. Manager / Manager yang dapat melakukan approve pada penawawran ini !"
                                );
                            }
                        } else {
                            this.approveact();
                        }
                    } else if (
                        this.dataview[0].payment.totalpembayaran >= 10000000 &&
                        this.dataview[0].payment.totalpembayaran <= 30000000
                    ) {
                        if (this.dataview[0].payment.discountconv > 5) {
                            if (
                                this.approvepenawaranAsmen.includes(
                                    this.me[0].employee_id
                                )
                            ) {
                                this.approveact();
                            } else {
                                global.swalerror(
                                    "Hanya Asst. Manager / Manager yang dapat melakukan approve pada penawawran ini !"
                                );
                            }
                        } else {
                            this.approveact();
                        }
                    } else if (
                        this.dataview[0].payment.totalpembayaran > 30000000
                    ) {
                        if (this.dataview[0].payment.discountconv > 10) {
                            if (
                                this.approvepenawaranManager.includes(
                                    this.me[0].employee_id
                                )
                            ) {
                                this.approveact();
                            } else {
                                global.swalerror(
                                    "Hanya Asst. Manager / Manager yang dapat melakukan approve pada penawawran ini !"
                                );
                            }
                        } else {
                            this.approveact();
                        }
                    }
                } else {
                  this.approveact();
                }
            }
        });
    }

    approveact() {
        this._penawaranServ.penawaranApprove(this.idPenawaran, 1).then((d) => {
            global.swalsuccess("success", "Success Approving Penawawran");
            this._route.navigateByUrl("/analystpro/penawaran");
        });
    }

    getdataMou() {
        this._kontrakServ
            .getDataMou(this.dataview[0].customers_handle.id_customer)
            .then((e: any) => {
                this.mouset = e.status;
            });
    }
}
