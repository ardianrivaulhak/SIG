import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    Output,
    EventEmitter,
    AfterViewInit,
} from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { LabPengujianService } from "../lab-pengujian.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MetodeService } from "../../master/metode/metode.service";
import { LodService } from "../../master/lod/lod.service";
import { LabService } from "../../master/lab/lab.service";
import { UnitService } from "app/main/analystpro/master/unit/unit.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ModalSetComplainStatusComponent } from "../modal-set-complain-status/modal-set-complain-status.component";
import { ComplainService } from "app/main/analystpro/complain/complain.service";
import { MemocomplainqcComponent } from "app/main/analystpro/complain/complain-qc/modals/memocomplainqc/memocomplainqc.component";
import { StatuspengujianService } from "app/main/analystpro/services/statuspengujian/statuspengujian.service";
import { ContractcategoryService } from "app/main/analystpro/master/contractcategory/contractcategory.service";
import * as global from "app/main/global";
import * as _moment from 'moment';
@Component({
    selector: "app-lab-done",
    templateUrl: "./lab-done.component.html",
    styleUrls: ["./lab-done.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class LabDoneComponent implements OnInit {
    datasent = {
        pages: 1,
        search: null,
        status: 0,
        idlab: null,
        contractcategory: null,
        estimasi_lab: null,
        id_parameteruji: null,
        status_prep: 'all'
    };
    datametode = [];
    dataunit = [];
    datalod = [];
    datacomplain = [];

    checkedparam = 0;

    datacontractcategory = [];
    datastatuspengujian = [];
    dataparameter = [];
    datasentParameter = {
        pages: 1,
        search: null,
        sample: [],
    };

    constructor(
        private _spinner: NgxSpinnerService,
        private _labserv: LabPengujianService,
        private _actRoute: ActivatedRoute,
        private _metodeServ: MetodeService,
        private _lodServ: LodService,
        private _satuanServ: UnitService,
        private dialog: MatDialog,
        private _complainServ: ComplainService,
        private _contractcategoryServ: ContractcategoryService,
        private _statusPengujianServ: StatuspengujianService
    ) {
        this._actRoute.data.subscribe((v) => {
            this.datasent.idlab = v.idlab;
        });
    }

    ngOnInit(): void {
        this.getData();
        this.getDataUnit();
        this.getDataMetode();
        this.getDataLod();
        this.getDataContractCategory();
        this.getStatusPengujian();
        this.getDataParameter();

    }

    onsearchselect(ev, stat) {
        switch (stat) {
            case "parameter":
                this.datasentParameter.sample = [];
                this.datasentParameter.pages = 1;
                this.datasentParameter.search = ev.term;
                this.dataparameter = [];
                this.getDataParameter();
                break;
        }
    }

    setValParameterUji(ev) {
        this.datacomplain = [];
        this.getData();
    }

    setStatusPrep(ev){
        this.datacomplain = [];
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

    onScrollToEndSelect(e) {
        switch (e) {
            case "parameter":
                this.datasentParameter.pages = this.datasentParameter.pages + 1;
                this.getDataParameter();
                break;
        }
    }

    getDataParameter() {
        this._labserv
            .getSelectParameteruji(this.datasentParameter)
            .then(
                (g: any) =>
                    (this.dataparameter = this.dataparameter.concat(g["data"]))
            )
            .then(() => {
                this.dataparameter = global.uniq(
                    this.dataparameter,
                    (it) => it.id
                );
            });
    }

    getDataContractCategory() {
        this._contractcategoryServ
            .getDataContractCategory({ status: "all" })
            .then(
                (x: any) =>
                    (this.datacontractcategory =
                        this.datacontractcategory.concat(
                            x["data"].map((g) => ({
                                id_contract_category: g.id,
                                title: g.title,
                            }))
                        ))
            );
    }

    onRefresh() {
        this.datacomplain = [];
        this.datasent = {
            pages: 1,
            search: null,
            status: 0,
            idlab: this.datasent.idlab,
            contractcategory: null,
            estimasi_lab: null,
            id_parameteruji: null,
            status_prep: 'all'
        };
        this.getData();
    }

    setStatusPengujian(ev) {
        console.log(ev.value);
    }

    setValueContract(ev) {
        this.datacomplain = [];
        this.getData();
    }

    setValue(v) {
        return parseInt(v);
    }

    searching() {
        this.datacomplain = [];
        this.getData();
    }

    tglEstimasiLabChange(){
        this.datasent.estimasi_lab = _moment(this.datasent.estimasi_lab).format("YYYY-MM-DD");
        this.datacomplain = [];
        this.getData();
    }

    async actionSave(st) {
        
        let a = await this.datacomplain.filter((x) => x.checked).map(ab => ({...ab, status: st}));
        await global.swalyousure("Sure?").then((x) => {
            if (x.isConfirmed) {
                this._labserv
                    .savingDataComplain(a)
                    .then((x) => global.swalsuccess("success", "Mantap"))
                    .catch((e) => global.swalerror("Error at database"));
            }
        });
        this.datacomplain = await [];
        await this.getData();
    }

    async getData() {
        await this._spinner.show();
        this.checkedparam = await 0;
        await this._labserv.getDataComplain(this.datasent).then((x) => {
            if (x["data"].length > 0) {
                x["data"].forEach((d) => {
                    this.datacomplain = this.datacomplain.concat({
                        checked: false,
                        status_prep: d.status_prep.toString(),
                        complain_no: d.complain_no,
                        complain_date: d.complainhead.complain_date,
                        contract_no:
                            d.transactionparameter.transaction_sample.kontrakuji
                                .contract_no,
                        id_sample: d.transactionparameter.id_sample,
                        no_sample:
                            d.transactionparameter.transaction_sample.no_sample,
                        name_id:
                            d.transactionparameter.parameteruji_one.name_id,
                        position: d.transactionparameter.position,
                        matriks:
                            d.transactionparameter.transaction_sample
                                .subcatalogue.sub_catalogue_name,
                        estimate_date: d.complainhead.estimate_date,
                        sample_name:
                            d.transactionparameter.transaction_sample
                                .sample_name,
                        hasiluji_awal: d.transactionparameter.hasiluji,
                        actual_result: d.transactionparameter.actual_result,
                        complain_result: d.complain_result,
                        complain_arresult: d.actual_complain_result,
                        complain_desc: d.complain_desc,
                        expectation: d.expectation,
                        id_unit: d.transactionparameter.id_unit,
                        metode: d.transactionparameter.id_metode,
                        id_lod: d.transactionparameter.id_lod,
                        idtechdet: d.id,
                        memo: d.memo,
                    });
                });
            }
        });
        await this._spinner.hide();
    }

    info(d) {
        let dialogCust = this.dialog.open(MemocomplainqcComponent, {
            height: "auto",
            width: "600px",
        });

        dialogCust.afterClosed().subscribe(async (result) => {
            console.log("aw");
        });
    }

    setUjiUlang(v) {
        global.swalyousure("will change data").then((x) => {
            if (x.isConfirmed) {
                this._complainServ
                    .setDataPrep(v.idtechdet, 1)
                    .then(async (c) => {
                        await global.swalsuccess("success", "update success");
                        this.datacomplain = await [];
                        await this.getData();
                    });
            }
        });
    }

    setTidakUjiUlang(v) {
        global.swalyousure("will change data").then((x) => {
            if (x.isConfirmed) {
                this._complainServ
                    .setDataPrep(v.idtechdet, 0)
                    .then(async (c) => {
                        await global.swalsuccess("success", "update success");
                        this.datacomplain = await [];
                        await this.getData();
                    });
            }
        });
    }

    onScroll(ev) {
        this.datasent.pages = this.datasent.pages + 1;
        this.getData();
    }

    checkAll(ev, value, index) {
        if (value !== "all") {
            this.checked(ev, index);
        } else {
            let d = this.datacomplain.filter(e => e.status_prep !== '3');
            for (let i = 0; i < d.length; i++) {
                this.checked(ev, i);
            }
        }
        this.checkedparam = this.datacomplain.filter((x) => x.checked).length;
    }

    checked(ev, index) {
        this.datacomplain[index].checked = ev;
    }

    modalstatus(v) {
        let dialogCust = this.dialog.open(ModalSetComplainStatusComponent, {
            height: "auto",
            width: "600px",
        });

        dialogCust.afterClosed().subscribe(async (result) => {
            console.log("aw");
        });
    }

    getDataUnit() {
        this._satuanServ.getDataUnit({ status: "all" }).then(
            (x: any) =>
                (this.dataunit = this.dataunit.concat(
                    x.map((g) => ({
                        id_unit: g.id,
                        kode_unit: g.kode_unit,
                        nama_unit: g.nama_unit,
                    }))
                ))
        );
    }

    getDataMetode() {
        this._metodeServ.getDataMetode({ status: "all" }).then(
            (x: any) =>
                (this.datametode = this.datametode.concat(
                    x.map((g) => ({
                        id_metode: g.id,
                        kode_metode: g.kode_metode,
                        metode: g.metode,
                    }))
                ))
        );
    }

    getDataLod() {
        this._lodServ.getDataLod({ status: "all" }).then(
            (x: any) =>
                (this.datalod = this.datalod.concat(
                    x.map((g) => ({
                        id_lod: g.id,
                        kode_lod: g.kode_lod,
                        nama_lod: g.nama_lod,
                    }))
                ))
        );
    }

    setStatus(e, num) {
        global
            .swalyousure("This change can`t be undo !")
            .then((x) => {
                if (x.isConfirmed) {
                    this._complainServ
                        .setStatusComplain(e.idtechdet, num)
                        .then(async (d) => {
                            await global.swalsuccess("success", d["message"]);
                            this.datacomplain = await [];
                            this.datasent.pages = await 1;
                            this.datasent.search = await null;
                            this.datasent.status = await 0;
                            await this.getData();
                            //   await this._mesServ.sendMessage({title: 'Status Perubahan QC', body: 'test'
                            // },'analystpro')
                        });
                }
            })
            .catch((e) => global.swalerror(e["message"]));
    }
}
