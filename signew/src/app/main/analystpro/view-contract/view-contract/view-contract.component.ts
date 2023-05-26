import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ContractService } from "../../services/contract/contract.service";
import { fuseAnimations } from "@fuse/animations";
import { Sort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { ViewContractDetComponent } from "../view-contract-det/view-contract-det.component";
import { ModalPhotoViewcontractComponent } from "../modal/modal-photo-viewcontract/modal-photo-viewcontract.component";
import { PdfService } from "../../services/pdf/pdf.service";
import { LoginService } from "app/main/login/login.service";
import { url } from "app/main/url";
import { DescriptionModalContractComponent } from "app/main/analystpro/modal/description-modal-contract/description-modal-contract.component";
import * as XLSX from "xlsx";
import * as global from "app/main/global";
import { SampleInformationModalComponent } from "../modal/sample-information-modal/sample-information-modal.component";
import { ComplainService } from "../../complain/complain.service";
import { ComplainModalComponent } from "../modal/complain-modal/complain-modal.component";
export interface Chatnew {
    id: number;
    status: string;
}
@Component({
    selector: "app-view-contract",
    templateUrl: "./view-contract.component.html",
    styleUrls: ["./view-contract.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class ViewContractComponent implements OnInit {
    @ViewChild("isichat") d1: ElementRef;

    statusview;
    loadingprevapp;

    dataSource: any = [];
    data = [];
    displayedColumns: string[] = [
        "no",
        "nosample",
        "samplename",
        "tgl_lab",
        "status",
        "biaya",
        "infocert",
        "status_lab",
        "discount",
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
    idContrack: any;
    panelOpenState = false;
    samplename = "";
    datainvoice = [];
    chatopen = 0;
    me = [];
    dataChat = [];
    chatnew: Chatnew[] = [];
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
    approvebutton = false;
    approveContractUser = [52, 67, 11, 48, 307];
    sendresult = [];
    loadingcomplain = true;

    constructor(
        private _kontrakServ: ContractService,
        private _route: Router,
        private _actRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private dialog: MatDialog,
        private _pdfServ: PdfService,
        private _loginServ: LoginService,
        private _complainServ: ComplainService
    ) {
        this.idContrack = this._actRoute.snapshot.params["id"];
        this._route.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        // this.statusview = this._route.getCurrentNavigation().extras.state.from
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

    gotosampleinformation(id) {
        let dialogCust = this.dialog.open(SampleInformationModalComponent, {
            height: "500px",
            width: "600px",
            data: {
                idsample: id,
            },
        });
        dialogCust.afterClosed().subscribe((result) => {});
    }

    gotoModalViewDetail(id) {
        let dialogCust = this.dialog.open(ViewContractDetComponent, {
            height: "auto",
            width: "1000px",
            data: {
                idsample: id,
                sample: this.dataSource,
                hide: this.hidingprice,
                hidesee: this.seehasiluji,
            },
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
        this.checkconditioncontract();
        // this.checksendresult();
    }

    checksendresult() {
        this._complainServ
            .getDataComplainTechnical({
                contract: this.idContrack,
                statuscomplain: "all",
                currentstatus: "all",
            })
            .then((x: any) => {
                if (x.data.length > 0) {
                    this.sendresult = this.sendresult.concat(x.data);
                }
            });
    }

    async ComplainData(v) {
        const dialogRef = await this.dialog.open(ComplainModalComponent, {
            height: "auto",
            width: "800px",
            panelClass: "parameter-modal",
            data: v,
        });
        await dialogRef.afterClosed().subscribe(async (result) => {
            console.log(result);
        });
    }

    checkconditioncontract() {
        this._kontrakServ.checkcondition(this.idContrack).then((x: any) => {
            if (x[0].status == 2) {
                this.approvebutton = true;
            } else {
                this.approvebutton = false;
            }
        });
    }

    async downloadparameter() {
        this.loadingparameter = await true;
        await this._kontrakServ
            .getParameterByContract(this.idContrack)
            .then(async (x: any) => {
                const filename = await `${x[0].contract_no}.xlsx`;
                const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(x);
                const wb: XLSX.WorkBook = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, `Data`);
                await XLSX.writeFile(wb, filename);
                this.loadingparameter = await false;
            });
    }

    getSampleData() {
        this._kontrakServ
            .samplegetfromcontract(this.idContrack)
            .then((xu) => {
                this.datasample = this.datasample.concat(xu);
                this.dataSource = this.datasample;
                if (this.sendresult.length > 0) {
                    this.datasample = this.datasample.map((v) => {
                        return {
                            ...v,
                            complain:
                                this.sendresult.filter(
                                    (e) =>
                                        e.complain.id_transaction_sample == v.id
                                ).length > 0
                                    ? this.sendresult
                                          .filter(
                                              (e) =>
                                                  e.complain
                                                      .id_transaction_sample ==
                                                  v.id
                                          )
                                          .map((p) => p.complain_det)[0]
                                    : [],
                        };
                    });
                    this.dataSource = this.datasample;
                } else {
                    this.datasample = this.datasample.map((v) => {
                        return {
                            ...v,
                            complain:
                                []
                        };
                    });
                    this.dataSource = this.datasample;
                }
            })
            .then(() => {
                console.log(this.datasample);
                this.totalbiaya = this.dataSource
                    .map((o) => o.price)
                    .reduce((a, b) => a + b);
                this.samplingprice =
                    this.dataview[0].sampling_trans.length > 0
                        ? this.dataview[0].sampling_trans
                              .map((h) => h.jumlah * h.samplingmaster.price)
                              .reduce((i, o) => i + o)
                        : 0;
                this.akgprice =
                    this.dataview[0].akg_trans.length > 0
                        ? this.dataview[0].akg_trans
                              .map((h) => h.jumlah * h.masterakg.price)
                              .reduce((y, z) => y + z)
                        : 0;
                this.getInfoInvoice();
            });
    }

    getData() {
        this._kontrakServ
            .getDataContractDetail(this.idContrack)
            .then(async (x: any) => {
                // this.discountvalue = ((x.payment_condition.discount_lepas / x.payment_condition.biaya_pengujian ) * 100).toFixed()
                this.dataview = this.dataview.concat(x);
            })
            .then(() => this.checksendresult())
            .then(() => this.getSampleData())

            .then(() => this.checkme());
    }

    gotoContract(v) {
        this._route.navigateByUrl("analystpro/view-contract/" + v);
    }

    getSubTotal() {
        return (
            this.totalbiaya -
            this.dataview[0].payment_condition.discount_lepas +
            this.akgprice +
            this.samplingprice
        );
    }

    getppn(v) {
        let a = v.payment_condition.ppn.toFixed();

        return parseInt(a);
    }

    checkme() {
        this._loginServ
            .checking_me()
            .then((x) => (this.me = this.me.concat(x)))
            .then(() => {
                if (this.me[0].id_bagian == 12) {
                    this.seehasiluji = true;
                    if (this.me[0].id_level > 18) {
                        this.hidingprice = true;
                    } else {
                        this.hidingprice = false;
                    }
                } else if (this.me[0].id_bagian == 1) {
                    this.seehasiluji = true;
                } else if (this.me[0].id_bagian == 5) {
                    this.seehasiluji = true;
                } else if (this.me[0].id_bagian == 10) {
                    this.seehasiluji = true;
                } else if (this.me[0].id_bagian == 16) {
                    this.seehasiluji = true;
                } else if (this.me[0].id_bagian == 13) {
                    this.seehasiluji = true;
                } else {
                    if (this.me[0].user_id == 93) {
                        this.seehasiluji = true;
                    } else {
                        this.seehasiluji = false;
                    }
                }
            });
    }

    paginated(f) {
        this.dataSource = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getSampleData();
    }

    edit() {
        this._route.navigateByUrl("analystpro/kontrak/" + this.idContrack);
    }

    download() {
        this.loading = true;
        this._kontrakServ
            .getDataDetailKontrak(this.idContrack)
            .then((x) => {
                this._pdfServ.generatePdf(x, "download");
            })
            .then(() => (this.loading = false));
    }

    preview() {
        this.loadingprev = true;
        this._kontrakServ
            .getDataDetailKontrak(this.idContrack)
            .then((x) => {
                this._pdfServ.generatePdf(x, "open");
            })
            .then(() => (this.loadingprev = false));
    }

    approveContract() {
        global.swalyousure("Action cant be undone").then((e) => {
            if (e.isConfirmed) {
                this.loadingprevapp = true;
                if (this.approveContractUser.includes(this.me[0].employee_id)) {
                    this._kontrakServ
                        .approveContract(this.idContrack)
                        .then((x) =>
                            global.swalsuccess(
                                "success",
                                "Success Approving Contract"
                            )
                        )
                        .then(() =>
                            this._route.navigateByUrl("/analystpro/contract")
                        );
                } else {
                    global.swalerror(
                        "Hanya Asst. Manager / Manager yang dapat melakukan approve pada Kontrakuji ini !"
                    );
                    this.loadingprevapp = false;
                }
            }
        });
    }

    send() {
        this._kontrakServ.sendchat(this.idContrack, this.sendchat).then((x) => {
            document.getElementById("remove").innerHTML = "";
            this.sendchat = "";
        });
    }

    getInfoInvoice() {
        this._kontrakServ.getInvoice(this.idContrack).then((z) => {
            this.datainvoice = this.datainvoice.concat(z);
        });
    }

    async openchat() {
        const dialogRef = await this.dialog.open(
            DescriptionModalContractComponent,
            {
                height: "auto",
                width: "800px",
                panelClass: "parameter-modal",
                data: {
                    idcontract: this.idContrack,
                },
            }
        );
        await dialogRef.afterClosed().subscribe(async (result) => {
            console.log(result);
        });
    }

    gotoRevisi() {
        this._route.navigateByUrl(
            "/analystpro/revision-contract/" + this.idContrack
        );
    }

    // getDataInternal() {
    //     this._kontrakServ.getChat(this.idContrack).then(async (x) => {
    //       let xx = await [];
    //       xx = await xx.concat(x);
    //       if(this.chatnumber < xx.length){
    //         this.chat = this.chat.concat(xx);
    //         xx.forEach((v,i) => {
    //           this.chatnew.push({
    //             id: i,
    //             status: 'not read'
    //           })
    //         })
    //         this.chatnumber = xx.length;
    //         this.setHtml();
    //       }
    //     });
    // }

    async setHtml() {
        let a = await "";
        await this.chat.forEach((c) => {
            if (c.insert_user === this.me[0].user_id) {
                a += `
              <div class="container">
                <img src="${url}assets/img/${c.user.photo}" alt="Avatar" style="width:100%;">
                <p>${c.desc}</p>
                <span class="time-right">${c.created_at} - You</span>
              </div>`;
            } else {
                a += `
              <div class="container darker">
                <img src="${url}assets/img/${c.user.photo}" alt="Avatar" class="right">
                <p>${c.desc}</p>
                <span class="time-left">${c.created_at} - ${c.user.employee_name}</span>
              </div>`;
            }
        });
        await this.d1.nativeElement.insertAdjacentHTML("beforeend", a);
    }

    // closechat(){
    //   this.chatopen = this.chatopen !== 0 ? this.chatopen - 1 : this.chatopen;
    //   document.getElementById("myForm").style.display = "none";
    // }

    getdataMou() {
        this._kontrakServ
            .getDataMou(this.dataview[0].customers_handle.id_customer)
            .then((e: any) => {
                this.mouset = e.status;
            });
    }
}
