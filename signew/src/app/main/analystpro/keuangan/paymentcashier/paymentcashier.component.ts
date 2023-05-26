import { dataEmployeeStatus } from "./../../../hris/employee/data-select";
import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    Inject,
} from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { KeuanganService } from "../keuangan.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { MatTable } from "@angular/material/table";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import * as global from "app/main/global";
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
import Swal from 'sweetalert2';

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
    selector: "app-paymentcashier",
    templateUrl: "./paymentcashier.component.html",
    styleUrls: ["./paymentcashier.component.scss"],
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
export class PaymentcashierComponent implements OnInit {
    @ViewChild("table") MatTable: MatTable<any>;
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
    datapayment = [];
    datacontract = [];
    total: number;
    from: number;
    to: number;
    paymentForm: FormGroup;
    cekData = null;
    payment = null;
    load = false;
    displayedColumns: string[] = [
        "no",
        "payment",
        "user",
        "information",
        "serial",
        "created",
        "action",
    ];
    dataAkg = [];
    displayedAkg: string[] = ["no", "akg_name", "price", "unit", "total"];
    dataSampling = [];
    displayedSampling: string[] = [
        "no",
        "sampling_name",
        "price",
        "unit",
        "total",
    ];
    remainingPay: number;
    priceAkg: number;
    priceSampling: number;
    bankAccount = [];
    idkontrakuji;
    customerservice = false;
    proccess = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<PaymentcashierComponent>,
        private _masterServ: KeuanganService,
        private _formBuild: FormBuilder,
        private _snackBar: MatSnackBar,
        private _contractServ: ContractService,
        private _route: Router
    ) {
        if (data) {
            this.datacontract = this.datacontract.concat({
                id_kontrakuji: data.id_kontrakuji,
                contract_no: data.contract_no,
            });

            this.paymentForm = this.createLabForm();

            this.customerservice = true;
            setTimeout(() => {
                this.paymentForm.controls.id_contract.setValue(
                    data.id_kontrakuji
                );
                // this.getdataPaymentDetail(data.id_kontrakuji);
                this.getDataDetailContract(data.id_kontrakuji);
            }, 1000);
        }
    }

    searchterm(ev) {
        this.dataFilterContract.search = ev.term.toUpperCase();
        this.datacontract = [];
        this.dataFilterContract.pages = 1;
        this.getDataContract();
    }

    ngOnInit(): void {
        this.getDataContract();
        this.bankAccounts();
    }

    async getDataContract() {
        await this._masterServ
            .getDataKontrak(this.dataFilterContract)
            .then((x) => {
                this.datacontract = this.datacontract.concat(
                    Array.from(x["data"])
                );
                this.total = x["total"];
                this.from = x["from"] - 1;
                this.to = x["to"];
            });
        this.paymentForm = await this.createLabForm();
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    async akgData() {
        this.dataAkg = await this.cekData.akg_trans;
    }

    async samplingData() {
        this.dataSampling = await this.cekData.sampling_trans;
    }

    async onScrollToEnd(e) {
        if (e === "no_kontrak") {
            this.dataFilterContract.pages =
                (await this.dataFilterContract.pages) + 1;
            await this.getDataContract();
        }
    }

    getDataDetailContract(id) {
        this._contractServ.getDataContractDetail(id).then(async (x: any) => {
                this.getValKontrak(x)
        });
        
    }

    async getValKontrak(ev) {
        this.payment = await ev.payment_condition;
        this.cekData = await ev;
        console.log(this.payment)
        this.paymentForm = await this.createLabForm();
        await this.getDataPayment();

        await this.akgData();
        await this.samplingData();
    }

    createLabForm(): FormGroup {
        this.priceAkg =
            this.cekData == null
                ? 0
                : this.cekData.akg_trans.length < 1
                ? 0
                : this.cekData.akg_trans
                      .map((x) => x.total)
                      .reduce((a, b) => a + b);
        this.priceSampling =
            this.cekData == null
                ? 0
                : this.cekData.sampling_trans.length < 1
                ? 0
                : this.cekData.sampling_trans
                      .map((x) => x.total)
                      .reduce((a, b) => a + b);
        console.log([this.priceAkg, this.priceSampling]);
        return this._formBuild.group({
            samplingfee: [
                {
                    value:
                        this.cekData == null
                            ? ""
                            : this.payment.biaya_pengujian,
                    disabled: true,
                },
            ],
            discount: [
                {
                    value:
                        this.cekData == null ? "" : this.payment.discount_lepas,
                    disabled: true,
                },
            ],
            ppn: [
                {
                    value: this.cekData == null ? "" :  this.payment.ppn,
                    disabled: true,
                },
            ],
            pph: [
                {
                    value: this.cekData == null ? "" : this.payment.pph,
                    disabled: true,
                },
            ],
            downpayment: [
                {
                    value: this.cekData == null ? "" : this.payment.downpayment,
                    disabled: true,
                },
            ],
            subtotal: [
                {
                    value:
                        this.cekData == null
                            ? 0
                            : this.payment.biaya_pengujian +
                              this.payment.ppn +
                              this.priceAkg +
                              this.priceSampling -
                              this.payment.discount_lepas -
                              this.payment.downpayment,
                    disabled: true,
                },
            ],
            id_contract: [
                this.cekData == null ? "" : this.payment.id_contract,
                { validator: Validators.required },
            ],
            payment: ["", { validator: Validators.required }],
            bank: ["", { validator: Validators.required }],
            information: [""],
            tgl_bayar: [
                _moment(new Date()).format("YYYY-MM-DD"),
                { validator: Validators.required },
            ],
        });
    }

    getdataPaymentDetail(v) {
        this.datapayment = [];
        this._masterServ
            .getPayment(v)
            .then((x: any) => {
                this.datapayment = this.datapayment.concat(x);
            })
            .then(() => console.log(this.datapayment))
            .then(() => {
                let totalpayment =
                    this.datapayment.length > 0
                        ? this.datapayment
                              .map((x) => x.payment)
                              .reduce((a, b) => a + b)
                        : 0;
                this.remainingPay =
                    this.payment.biaya_pengujian +
                    this.payment.ppn +
                    this.priceAkg +
                    this.priceSampling -
                    this.payment.discount_lepas -
                    totalpayment;
            });
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }

    closeModal() {
        return this._dialogRef.close({});
    }

    saveForm() {
        this.paymentForm.controls.tgl_bayar.setValue(_moment(this.paymentForm.value.tgl_bayar).format('YYYY-MM-DD'));

        if (this.paymentForm.controls.bank.value == "") {
            global.swalerror("Bank Harus di isi");
            this.proccess = false;
        } else {
            let tot = (this.payment.biaya_pengujian - this.payment.discount_lepas) + 
                      this.priceSampling + this.priceAkg + this.payment.ppn
            let a = this.datapayment.length > 0 ? this.remainingPay : tot

            if(this.paymentForm.value.payment > a ){
                global.swalerror("Lebih Bayar");
                this.proccess = false;
            }else{
            this._masterServ
                    .savePayment(this.paymentForm.value)
                    .then((y) => {
                        this.load = true;
                        if (this.customerservice) {
                            this._masterServ
                                .setDownPayment({
                                    id_contract:
                                        this.paymentForm.controls.id_contract.value,
                                    downpayment:
                                        this.paymentForm.controls.payment.value,
                                })
                                .then((b) => console.log(b));
                        }
                    })
                    .then(() => {
                        this.proccess = false;
                    })
                    .then(() => {
                        let message = {
                            text: "Data Succesfully Updated",
                            action: "Done",
                        };
                        this.openSnackBar(message);
                        this.closeModal();
                        this.load = false;
                    });
            }
        
        console.log(a)
        }
    }

    async getDataPayment() {
        this.datapayment = [];
        await this.getdataPaymentDetail(this.payment.id_contract);
    }

    async bankAccounts() {
        await this._masterServ.getBankAccount().then((x) => {
            this.bankAccount = this.bankAccount.concat(x);
        });
    }

    async deleteHistory(id)
    {
        console.log(id)
        Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this Data!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
        }).then((result) => {
        if (result.value) {
            this._masterServ.deleteHistoryPayment(id).then(x => {
            })
            Swal.fire(
            'Deleted!',
            'Your imaginary file has been deleted.',
            'success'
            )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
            )
        }
        setTimeout(()=>{
            this.datapayment=[];
            this.load =  true;
            this.remainingPay = null;
            this.getDataPayment();
        },1000)
        })
    }
}
