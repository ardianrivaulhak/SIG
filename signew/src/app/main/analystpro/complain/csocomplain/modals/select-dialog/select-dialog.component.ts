import {
    Component,
    OnInit,
    Optional,
    Inject,
    ViewEncapsulation,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as global from "app/main/global";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { BrowserModule } from "@angular/platform-browser";
import { ComplainService } from "../../../complain.service";
import { DivisionService } from "app/main/hris/division/division.service";
var momentbussiness = require("moment-business-days");
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
import * as _moment from "moment";

@Component({
    selector: "app-select-dialog",
    templateUrl: "./select-dialog.component.html",
    styleUrls: ["./select-dialog.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class SelectDialogComponent implements OnInit {
    selectChange = [
        {
            id: 1,
            name: "Technical",
        },
        {
            id: 2,
            name: "Non Technical",
        },
    ];

    formdata = {
        status_select: null,
        id_complain: null,
        contract_no: null,
        id_lhp: null,
        complaintype: null,
        id_contract: null,
        id_transaction_sample: null,
        id_cert: null,
        idch: null,
        parameterarray: [],
        status_cek: null,
        date_complain: null,
        finish_complain: null,
        customer: null,
        bagian: null,
        complain: null,
        message: null,
    };

    loading = false;
    complaindata = [];
    pickingupparameter;
    parameterpick = new Array();
    complainlist = [
        {
            id: 1,
            val: "Hasil Ketinggian",
        },
        {
            id: 2,
            val: "Hasil Kerendahan",
        },
        {
            id: 3,
            val: "Tidak Sesuai Spec",
        },
    ];

    statusselect;
    idtechdet;
    search = null;
    datadiv = [];
    load = false;
    date = {
        value: null,
    };

    constructor(
        public dialogRef: MatDialogRef<SelectDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialog: MatDialog,
        private _complainServ: ComplainService,
        private _divServ: DivisionService,
        private _snackBar: MatSnackBar,
        private datePipe: DatePipe
    ) {
        if (data) {
            console.log(data);
            this.statusselect = data.status;
            if (data.status == "cs") {
                this.complaindata = this.complaindata.concat(data.data);
                this.formdata.id_complain = this.complaindata[0].id;
                this.formdata.id_contract =
                    data.data.transaction_sample.id_contract;
                this.formdata.id_transaction_sample =
                    data.data.id_transaction_sample;
                this.formdata.id_cert = data.data.id_cert;
                this.formdata.idch =
                    data.data.transaction_sample.kontrakuji.id_customers_handle;
            } else {
                this.idtechdet = data.data.id;
                this.formdata.complaintype = 1;
                this.getDataParameter(data.data.id_sample);
            }
        }
    }

    ngOnInit(): void {
        console.log("a");
        this.getDate();
    }

    getDate() {
        this.formdata.date_complain = _moment(
            this.complaindata[0].created_at
        ).format("YYYY-MM-DD");
        this.date.value = this.formdata.date_complain;
        console.log(this.date);
        this.getDateInvoice(this.date);
        console.log(this.formdata.date_complain);
    }

    getDataParameter(v) {
        this._complainServ
            .getDataComplaindetChild(this.idtechdet)
            .then(async (c: any) => {
                if (c.length > 0) {
                    await c.forEach((u) => {
                        this.formdata.parameterarray =
                            this.formdata.parameterarray.concat({
                                checked: false,
                                id: u.id,
                                id_complain_tech_det: this.idtechdet,
                                nama_lab: u.transactionparameter.lab.nama_lab,
                                info_name: u.transactionparameter.info_name,
                                name_id:
                                    u.transactionparameter.parameteruji_one
                                        .name_id,
                                matriks:
                                    this.complaindata.length > 0
                                        ? this.complaindata[0]
                                              .transaction_sample.subcatalogue
                                              .sub_catalogue_name
                                        : u.transactionparameter
                                              .transaction_sample.subcatalogue
                                              .sub_catalogue_name,
                                hasiluji: u.transactionparameter.hasiluji,
                                unit: u.transactionparameter.unit.nama_unit,
                                statusuji:
                                    this.complaindata.length > 0
                                        ? this.complaindata[0]
                                              .transaction_sample
                                              .statuspengujian.name
                                        : null,
                                complain: 1,
                                expetation: null,
                                complain_result: null,
                            });
                    });
                    this.parameterpick = await this.formdata.parameterarray;
                } else {
                    return;
                }
            });
        this.getData(v);
    }

    checkdata() {
        return this.parameterpick.filter((x) => x.checked).length > 0
            ? false
            : true;
    }

    test() {
        this.formdata.contract_no =
            this.complaindata[0].transaction_sample.id_contract;
        this.formdata.id_lhp = this.complaindata[0].transaction_certificate.id;
        this.formdata.customer =
            this.complaindata[0].transaction_certificate.customer_name;
        this.formdata.complain = this.complaindata[0].subject;
        this.formdata.message = this.complaindata[0].message;

        // teknis
        if (this.formdata.complaintype == 1) {
            this.getData();
        }

        // non teknis
        if (this.formdata.complaintype == 2) {
            this.getDataBagian();
        }
    }

    getData(v?) {
        this.formdata.parameterarray = [];
        this._complainServ
            .getDataParameter(
                v ? v : this.complaindata[0].transaction_certificate.id
            )
            .then((x: any) =>
                x.forEach((u) => {
                    this.formdata.parameterarray =
                        this.formdata.parameterarray.concat({
                            checked: false,
                            id: u.id,
                            id_complain_tech_det: this.idtechdet,
                            nama_lab: u.lab,
                            name_id: u.parameteruji_id,
                            id_parameteruji: u.id_parameteruji,
                            hasiluji: u.hasiluji,
                            actual_result: u.actual_result,
                            unit: u.unit,
                            complain: 1,
                            expetation: null,
                            complain_result: null,
                            lod: u.lod,
                            metode: u.metode,
                            standart: u.standart,
                        });
                })
            );
    }

    checkAll(ev, st) {
        if (st == "all") {
            for (let i = 0; i < this.parameterpick.length; i++) {
                this.parameterpick[i].checked = ev;
            }
        } else {
            this.parameterpick[st].checked = ev;
        }
    }

    getDataParmater(ev) {
        console.log(ev);
        this.pickingupparameter = ev;
    }

    async addParameter() {
        await this.parameterpick.push(this.pickingupparameter);
        this.parameterpick = await global.uniq(
            this.parameterpick,
            (it) => it.id
        );
    }

    async saving() {
        this.formdata.parameterarray = await [];
        this.formdata.status_select = await this.statusselect;
        this.formdata.parameterarray =
            await this.formdata.parameterarray.concat(
                global.uniq(this.parameterpick, (i) => i.id)
            );

        this.formdata.finish_complain = await _moment(
            this.formdata.finish_complain
        ).format("YYYY-MM-DD");
        this.formdata.date_complain = await _moment(
            this.formdata.date_complain
        ).format("YYYY-MM-DD");

        await global
            .swalyousure("it will send data complain to qc")
            .then((x) => {
                if (x.isConfirmed) {
                    this._complainServ
                        .sendDataComplain(this.formdata)
                        .then(async (x) => {
                            await global.swalsuccess(
                                "success",
                                "saving success"
                            );
                            await this.closeModal(false);
                        })
                        .catch((e) => global.swalerror("Harap Hubungi IT"));
                }
            });
    }

    deleteParameter() {
        this.parameterpick = this.parameterpick.filter((g) => !g.checked);
    }

    cancel() {
        this.dialogRef.close(true);
    }
    getDataBagian() {
        this._divServ
            .getDataDivision(this.search)
            .then((x) => (this.datadiv = this.datadiv.concat(x)));
        console.log(this.datadiv);
    }

    async getDateInvoice(ev) {
        console.log(ev);
        let temp = ev.value;
        let stat_pengujian =
            this.complaindata[0].transaction_sample.id_statuspengujian;
        console.log(stat_pengujian);
        let datetime = null;

        // status normal
        if (stat_pengujian == 1) {
            datetime = momentbussiness(temp, "YYYY-MM-DD").businessAdd(5)._d;
        }
        // status urgent
        if (stat_pengujian == 2) {
            datetime = momentbussiness(temp, "YYYY-MM-DD").businessAdd(4)._d;
        }
        // status very urgent
        if (stat_pengujian == 3) {
            datetime = momentbussiness(temp, "YYYY-MM-DD").businessAdd(2)._d;
        }

        this.formdata.finish_complain = datetime;
        console.log(datetime);
    }

    closeModal(a) {
        return this.dialogRef.close({
            a,
        });
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }

    saveForm() {
        if (this.formdata.bagian == null) {
            Swal.fire({
                title: "Incomplete Data",
                text: "Please complete the blank data!",
                icon: "warning",
                confirmButtonText: "Ok",
            });
        } else {
            this._complainServ.addDataNonTeknis(this.formdata).then((y) => {
                this.load = true;
                let message = {
                    text: "Data Succesfully Updated",
                    action: "Done",
                };
                setTimeout(() => {
                    this.openSnackBar(message);
                    this.closeModal(false);
                    this.load = false;
                }, 1000);
            });
        }
    }
}
