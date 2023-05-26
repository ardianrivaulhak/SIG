import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ComplainService } from "../complain.service";
import { MatDialog } from "@angular/material/dialog";
import { SelectDialogComponent } from "../csocomplain/modals/select-dialog/select-dialog.component";
import { InformationmodalsqcComponent } from "./modals/informationmodalsqc/informationmodalsqc.component";
import { ResultmodalcomplainComponent } from "./modals/resultmodalcomplain/resultmodalcomplain.component";
import { MemocomplainqcComponent } from "./modals/memocomplainqc/memocomplainqc.component";
import { SendresultqcComponent } from "./modals/sendresultqc/sendresultqc.component";
import { LabService } from "app/main/analystpro/master/lab/lab.service";
import * as global from "app/main/global";
import { urlApi } from "app/main/url";
import { Router } from "@angular/router";
import { FromToAnalystproComponent } from "./modals/from-to-analystpro/from-to-analystpro.component";
import { ModalGalleryComponent } from "../../lab-pengujian/modal-gallery/modal-gallery.component";
import { MessagingService } from "app/messaging.service";
import { StatuspengujianService } from "app/main/analystpro/services/statuspengujian/statuspengujian.service";
import { ModeSetDateRecapComponent } from "app/main/analystpro/complain/mode-set-date-recap/mode-set-date-recap.component";
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
import * as _ from "lodash";
import * as XLSX from "xlsx";

import { KeuanganService } from "../../keuangan/keuangan.service";
import { ExpectationModalComponent } from "./modals/expectation-modal/expectation-modal.component";

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
    selector: "app-complain-qc",
    templateUrl: "./complain-qc.component.html",
    styleUrls: ["./complain-qc.component.scss"],
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
export class ComplainQcComponent implements OnInit {
    datasent = {
        search: null,
        page: 1,
        estimasi: null,
        rev: null,
        lab: null,
        estimasi_lab: null,
        statuspengujian: "all",
        statuscomplain: "all",
        statusprep: "all",
        currentstatus: "all",
        statussend: "all",
        contract: null,
    };

    datacontract = [];
    dataFilterContract = {
        pages: 1,
        type: "paginate",
        category: null,
        month: null,
        customers: null,
        contact_person: null,
        date: null,
        search: null,
    };
    totalgetsample = 36;
    savedisabled = true;
    searchinput;
    ComplainForm = [];
    // ComplainForm = formComplain;
    datastatuspengujian = [];
    datacomplaintechnical = [];
    datalab = [];

    url_api = urlApi;

    constructor(
        private _complainServ: ComplainService,
        private _matDialog: MatDialog,
        private _route: Router,
        private _dialog: MatDialog,
        private _mesServ: MessagingService,
        private _labServ: LabService,
        private _statusPengujianServ: StatuspengujianService,
        private _keuServ: KeuanganService
    ) {}

    ngOnInit(): void {
        this.getData();
        this.getDataLab();
        this.getStatusPengujian();
        this.getDataContract();
    }

    getDataLab() {
        this._labServ
            .getDataLabFull()
            .then((x) => (this.datalab = this.datalab.concat(x)));
    }

    getValue(ev) {
        this.datasent.page = 1;
        this.ComplainForm = [];
        this.getData();
    }

    getStatusPengujian() {
        this._statusPengujianServ
            .getDataStatusPengujian({ pages: 1 })
            .then((h) => {
                this.datastatuspengujian = this.datastatuspengujian.concat(
                    h["data"]
                );
            });
    }

    onScrollToEnd(e) {
        if (e === "no_kontrak") {
            this.dataFilterContract.pages = this.dataFilterContract.pages + 1;
            this.getDataContract();
        }
    }

    onsearchselect(ev, val) {
        if (val === "kontrak") {
            this.datacontract = [];
            this.dataFilterContract.search = ev.term;
            this.dataFilterContract.pages = 1;
            this.getDataContract();
        }
    }

    getValKontrak(v) {
        this.datasent.page = 1;
        this.ComplainForm = [];
        this.getData();
    }

    details(v) {
        this._route.navigateByUrl("/analystpro/qc/" + v);
    }

    reset() {
        this.ComplainForm = [];
        this.getData();
    }

    resetDataSent() {
        this.datasent = {
            search: null,
            page: 1,
            estimasi: null,
            rev: null,
            lab: null,
            estimasi_lab: null,
            statuspengujian: "all",
            statuscomplain: "all",
            statusprep: "all",
            currentstatus: "all",
            statussend: "all",
            contract: null,
        };
        this.ComplainForm = [];
        this.getData();
    }

    getData() {
        this._complainServ
            .getDataComplainTechnical(this.datasent)
            .then((o: any) => {
                o.data.forEach((e) => {
                    this.ComplainForm = this.ComplainForm.concat({
                        checked: false,
                        id_tech: e.id,
                        id_cert: e.complain.id_cert,
                        status: e.status_ticket,
                        complain_no: e.complain_no,
                        idch: e.complain.transactionsample_compact.kontrakuji
                            .id_customers_handle,
                        cp: e.complain.transactionsample_compact.kontrakuji
                            .customers_handle.contact_person,
                        complain_date: e.complain_date,
                        statusdone: e.status_done ? e.status_done : null,
                        estimate_date: e.estimate_date,
                        sendingcert: e.sending_cert,
                        no_sample:
                            e.complain.transactionsample_compact.no_sample,
                        id_sample: e.complain.transactionsample_compact.id,
                        sample_name:
                            e.complain.transactionsample_compact.sample_name,
                        lhu_number:
                            e.complain.transaction_certificate.lhu_number,
                        contract_no:
                            e.complain.transactionsample_compact.kontrakuji
                                .contract_no,
                        id_contract:
                            e.complain.transactionsample_compact.id_contract,
                        customer_name:
                            e.complain.transactionsample_compact.kontrakuji
                                .customers_handle.customers.customer_name,
                        email: e.complain.transactionsample_compact.kontrakuji
                            .customers_handle.email,
                        message_email: e.complain.message
                            ? e.complain.message
                            : "-",
                        statuscert: e.complain.status,
                    });
                });
            });
    }

    onScroll(ev) {
        this.datasent.page = this.datasent.page + 1;
        this.getData();
    }

    resetform() {
        this.datasent = {
            search: null,
            page: 1,
            estimasi: null,
            rev: null,
            lab: null,
            estimasi_lab: null,
            statuspengujian: "all",
            statuscomplain: "all",
            statusprep: "all",
            currentstatus: "all",
            statussend: "all",
            contract: null,
        };
    }

    approve(v, st) {
        global.swalyousure("You cant revert this action").then((e) => {
            if (e.isConfirmed) {
                this._complainServ
                    .setStatusComplain(v.id_tech, st)
                    .then((x) =>
                        global
                            .swalsuccess("Success", "Saving Success")
                            .then((e) => {
                                if (e.isConfirmed) {
                                    this.resetDataSent();
                                }
                            })
                    )
                    .catch((e) =>
                        global.swalerror("Error in backend, Please Contact IT")
                    );
            }
        });
    }

    recapcomplain() {
        let dialogCust = this._dialog.open(FromToAnalystproComponent, {
            height: "auto",
            width: "500px",
        });
        dialogCust.afterClosed().subscribe(async (result) => {
            this._complainServ
                .dataRecapDownload(result,'qc')
                .then(async (x: any) => {
                    const fileName = await `Data For Complain ${_moment(
                        result.from
                    ).format("DD/MM/YYYY")}-${_moment(result.to).format(
                        "DD/MM/YYYY"
                    )}.xlsx`;

                    const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(
                        x
                    );
                    const wb: XLSX.WorkBook = await XLSX.utils.book_new();
                    await XLSX.utils.book_append_sheet(wb, ws, `Data`);

                    await XLSX.writeFile(wb, fileName);
                });
        });
    }

    modalexpectation(v){
        let dialogCust = this._dialog.open(ExpectationModalComponent, {
            height: "auto",
            width: "500px",
            data: v
        });
        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    onSearchChange(ev?) {
        this.datasent.page = 1;
        this.datasent.search = ev;
        this.ComplainForm = [];
        this.getData();
    }

    setStatusPengujian(e) {
        this.ComplainForm = [];
        this.getData();
    }



    momentformatdate(v) {
        return _moment(v).format("YYYY-MM-DD");
    }

    setValueStatusSend(ev) {
        this.ComplainForm = [];
        this.getData();
    }

    gotocertificate(v) {
        const url = this._route.serializeUrl(
            this._route.createUrlTree([
                `/certificate/pdf-certificate/${v.id_cert}/id`,
            ])
        );

        let baseUrl = window.location.href.replace(this._route.url, "");
        window.open(baseUrl + url, "_blank");
    }

    setValueStatusPrep(ev) {
        this.ComplainForm = [];
        this.getData();
    }

    gotocontract(v) {
        const url = this._route.serializeUrl(
            this._route.createUrlTree([
                `/analystpro/view-contract/${v.id_contract}`,
            ])
        );

        let baseUrl = window.location.href.replace(this._route.url, "");
        window.open(baseUrl + url, "_blank");
    }

    gotophoto(v) {
        let dialogCust = this._dialog.open(ModalGalleryComponent, {
            height: "auto",
            width: "500px",
            data: {
                data: v.id_sample,
            },
        });
        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    SeeResult(v) {
        let dialogCust = this._dialog.open(ResultmodalcomplainComponent, {
            height: "auto",
            width: "800px",
            data: v,
        });
        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    async savingData() {
        let u = await this.ComplainForm.filter((e) => e.checked);
        u = await u.map((p) => {
            return {
                ...p,
                estimate_date: _moment(p.estimate_date).format("YYYY-MM-DD"),
            };
        });
        await this._complainServ.sendingExpectation(u).then((x) => {
            if (x["status"]) {
                global.swalsuccess("success", x["message"]);
                this.resetDataSent();
            }
        });
        // this._complainServ.sendingExpectation(u)
        //   console.log(this.ComplainForm.filter(e => e.checked));
    }

    checkAll(ev, v, index?) {
        if (v !== "all") {
            this.ComplainForm[index].checked = ev;
        } else {
            for (let j = 0; j < this.ComplainForm.length; j++) {
                this.ComplainForm[j].checked = ev;
            }
        }

        this.savedisabled =
            this.ComplainForm.filter((x) => x.checked).length > 0
                ? false
                : true;
    }

    Select(val, num) {
        let a = parseInt(num);

        this.ComplainForm.filter((e) => e.id == val.id)[0].status = num;
        console.log(this.ComplainForm);
    }

    setValueStatusCompl(ev) {
        this.datasent.page = 1;
        this.ComplainForm = [];
        this.getData();
    }

    setValueStatusCurrent(ev) {
        this.datasent.page = 1;
        this.ComplainForm = [];
        this.getData();
    }

    setStatusContract(ev) {
        console.log("a");
    }

    async getDataContract() {
        await this._keuServ
            .getDataKontrak(this.dataFilterContract)
            .then((x) => {
                this.datacontract = this.datacontract.concat(
                    Array.from(x["data"])
                );
                this.datacontract = global.uniq(
                    this.datacontract,
                    (it) => it.id_kontrakuji
                );
            });
    }

    tglEstimasiLabChange() {
        this.datasent.page = 1;
        this.datasent.estimasi_lab = _moment(this.datasent.estimasi_lab).format(
            "YYYY-MM-DD"
        );
        this.ComplainForm = [];
        this.getData();
    }

    copydata(v, i) {
        console.log(v);
    }

    onRefresh() {
        this.ComplainForm = [];
        this.getData();
    }

    doneUji(v) {
        global.swalyousure("Yakin ?").then((x) => {
            if (x.isConfirmed) {
                this._complainServ
                    .doneDetailParameteruji(v)
                    .then((o) => {
                        global.swalsuccess("success", "Canceling Success");
                    })
                    .then(() => {
                        this.datacomplaintechnical = [];
                        this.getData();
                    });
            }
        });
    }
    seeMoreDetailResult(v) {
        console.log(v);
    }

    edittanggal(v) {
        let dialogCust = this._dialog.open(MemocomplainqcComponent, {
            height: "auto",
            width: "500px",
            data: v,
        });
        dialogCust.afterClosed().subscribe(async (result) => {
            this.resetDataSent();
        });
    }
    sendMoreDetailResult(v) {
        let dialogCust = this._dialog.open(SendresultqcComponent, {
            height: "auto",
            width: "1024px",
            data: {
                id_tech_det: v.id_tech,
                sendresult: v.sendingcert,
            },
        });
        dialogCust.afterClosed().subscribe(async (result) => {
            this.resetDataSent();
        });
    }

    pastedata(v, i) {
        console.log(i);
    }

    setValueSelect(ev) {
        this.ComplainForm = [];
        this.getData();
    }

    searching() {
        this.datasent.search = this.searchinput.toLowerCase();
        this.ComplainForm = [];
        this.getData();
    }

    cancelUji(v) {
        global.swalyousure("Yakin ?").then((x) => {
            if (x.isConfirmed) {
                this._complainServ
                    .cancelDetailParameter(v)
                    .then((o) => {
                        global.swalsuccess("success", "Canceling Success");
                    })
                    .then(() => {
                        this.datacomplaintechnical = [];
                        this.getData();
                    });
            }
        });
    }

    info(v) {
        const dialogRef = this._matDialog.open(InformationmodalsqcComponent, {
            data: v,
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("dialog close");
        });
    }

    selectData(data) {
        const dialogRef = this._matDialog.open(SelectDialogComponent, {
            panelClass: "complain-select-dialog",
            autoFocus: false,
            width: "100%",
            data: {
                data: data,
                status: "qc",
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("dialog close");
        });
    }

    statusChange(val, num) {
        if (num == 4) {
            global.three_option().then(async (x) => {
                let a;
                if (x.isConfirmed) {
                    a = await 5;
                } else if (x.isDenied) {
                    a = await 6;
                } else if (x.isDismissed) {
                    a = await 7;
                }

                await this._complainServ
                    .setStatusComplain(val.id, a)
                    .then(async (d) => {
                        await global.swalsuccess("success", d["message"]);
                        await this.resetDataSent();
                        await this._mesServ.sendMessage(
                            {
                                title: "Status Perubahan QC",
                                body: "test",
                            },
                            "analystpro"
                        );
                    });
            });
        } else {
            global
                .swalyousure("This change can`t be undo !")
                .then((x) => {
                    if (x.isConfirmed) {
                        this._complainServ
                            .setStatusComplain(val.id, num)
                            .then(async (d) => {
                                await global.swalsuccess(
                                    "success",
                                    d["message"]
                                );
                                await this.resetDataSent();
                                await this._mesServ.sendMessage(
                                    {
                                        title: "Status Perubahan QC",
                                        body: "test",
                                    },
                                    "analystpro"
                                );
                            });
                    }
                })
                .catch((e) => global.swalerror(e["message"]));
        }
    }

    setStatus(v) {
        if (v == 1) {
            return "On Going";
        } else if (v == 2) {
            return "On Going";
        } else if (v == 3) {
            return "Cancel";
        } else if (v == 4) {
            return "Done";
        } else {
            return "Pending";
        }
    }

    memo(v, i) {
        console.log(i);
    }

    memointernal(v, i) {
        console.log(i);
    }
}
