import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StandartService } from "app/main/analystpro/master/standart/standart.service";
import { MetodeService } from "../../master/metode/metode.service";
import { LodService } from "../../master/lod/lod.service";
import { UnitService } from "../../master/unit/unit.service";
import { LabService } from "../../master/lab/lab.service";
import { LabPengujianService } from "../../lab-pengujian/lab-pengujian.service";
import { MatDialog } from "@angular/material/dialog";
import { LabApprovalService } from "../lab-approval.service";
import * as global from "app/main/global";
import { StatuspengujianService } from "app/main/analystpro/services/statuspengujian/statuspengujian.service";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { SampleApproveModalComponent } from "../sample-approve-modal/sample-approve-modal.component";
import { ControlService } from "app/main/analystpro/control/control.service";
import { ModalGalleryComponent } from "../../lab-pengujian/modal-gallery/modal-gallery.component";
import * as XLSX from "xlsx";
import { ModalInformationComponent } from "../../lab-pengujian/modal-information/modal-information.component";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
    selector: "app-lab-approval-det",
    templateUrl: "./lab-approval-det.component.html",
    styleUrls: ["./lab-approval-det.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class LabApprovalDetComponent implements OnInit {
    idContract;

    datasent = {
        idcontract: null,
    };

    dataselectstatusuji = [];
    dataparameter = [];
    originaldata = [];
    datasample = [];
    testingcheck;

    datalod = [];
    datamasterlab = [];
    datasatuan = [];
    datametode = [];
    datastandart = [];
    datatransaksi = [];
    memointernal = [];
    memokendali = [];

    checkdata;
    jumlahcheck;
    parameter = [];
    sample = [];

    constructor(
        private _labServ: LabService,
        private _metodeServ: MetodeService,
        private _lodServ: LodService,
        private _satuanServ: UnitService,
        private _masterServ: LabPengujianService,
        private _labApproveServ: LabApprovalService,
        private dialog: MatDialog,
        private _router: Router,
        private _actRoute: ActivatedRoute,
        private _statusPengujianServ: StatuspengujianService,
        private _standartServ: StandartService,
        private _contractServ: ContractService,
        private _controlService: ControlService,
        private _spinner: NgxSpinnerService
    ) {
        this.idContract = this._actRoute.snapshot.params["id"];
    }

    ngOnInit(): void {
        this.datasent.idcontract = this.idContract;
        this.getDataMemoInternal();
        this.getData();
        this.getDataStatusPengujian();
        this.getDataLod();
        this.getDataLab();
        this.getDataMetode();
        this.getDataStandart();
        this.getDataUnit();
        this.getDataMemoKendali();
    }

    getDataStatusPengujian() {
        this._statusPengujianServ
            .getDataStatusPengujian({ pages: 1, search: null })
            .then((x) => {
                this.dataselectstatusuji = this.dataselectstatusuji.concat(
                    x["data"]
                );
            });
    }

    getDataParameter() {
        global
            .uniq(this.originaldata, (it) => it.id)
            .forEach((dt: any) => {
                this.dataparameter = this.dataparameter.concat({
                    id: dt.id,
                    name: dt.parameteruji_one.name_id,
                });
            });
    }

    async getDataSample() {
        await global
            .uniq(this.originaldata, (it) => it.transaction_sample.id)
            .forEach((dt: any) => {
                this.datasample = this.datasample.concat({
                    id: dt.transaction_sample.id,
                    name: dt.transaction_sample.sample_name,
                    nosample: dt.transaction_sample.no_sample,
                });
            });
    }

    goToModalPhoto(row) {
        let dialogCust = this.dialog.open(ModalGalleryComponent, {
            height: "auto",
            width: "500px",
            data: {
                data: row.id_sample,
            },
        });
        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    async tested(ev) {
        if (ev == 2) {
            await this.downloadfile();
        } else {
            await document.getElementById("selectedfile").click();
        }
    }

    approvesample() {
        let dialogCust = this.dialog.open(SampleApproveModalComponent, {
            height: "500px",
            width: "700px",
            data: {
                sample: this.datatransaksi,
            },
        });

        dialogCust.afterClosed().subscribe(async (result) => {
            this.resetData();
        });
    }

    onFileChange(ev) {
        const reader = new FileReader();
        const file = ev.target.files[0];
        let workBook = null;
        let jsonData = null;
        let jsonExcel = [];
        reader.onload = (event) => {
            const data = reader.result;
            workBook = XLSX.read(data, { type: "binary" });
            jsonData = workBook.SheetNames.reduce((initial, name) => {
                const sheet = workBook.Sheets[name];
                initial[name] = XLSX.utils.sheet_to_json(sheet);
                return initial;
            }, {});
            const dataString = JSON.stringify(jsonData);
            jsonData = JSON.parse(dataString);
            jsonExcel = jsonExcel.concat(jsonData["Data"]);
            this._masterServ
                .importExcel(jsonExcel, false)
                .then(async (x) => {
                    await this.resetData();
                })
                .then(() => (this.testingcheck = false));
        };
        reader.readAsBinaryString(file);
    }

    getDataLod() {
        this._lodServ
            .getDataLod({ status: "all" })
            .then((x) => (this.datalod = this.datalod.concat(x)));
    }

    getDataLab() {
        this._labServ
            .getDataLabFull()
            .then((x) => (this.datamasterlab = this.datamasterlab.concat(x)));
    }

    getDataUnit() {
        this._satuanServ
            .getDataUnit({ status: "all" })
            .then((x) => (this.datasatuan = this.datasatuan.concat(x)));
    }

    getDataMetode() {
        this._metodeServ
            .getDataMetode({ status: "all" })
            .then((x) => (this.datametode = this.datametode.concat(x)));
    }

    getDataStandart() {
        this._standartServ
            .getDataStandart({ status: "all" })
            .then((x) => (this.datastandart = this.datastandart.concat(x)));
    }

    async downloadfile() {
        let k = await [];
        await this.datatransaksi
            .filter((h) => h.conditionlabdone.length > 0)
            .forEach((g) => {
                k = k.concat({
                    id_trans_parameter: g.id,
                    no_sample: g.transaction_sample.no_sample,
                    sample_name: g.transaction_sample.sample_name,
                    parameter_name: g.position
                        ? g.parameteruji_one.name_id + " - " + g.position
                        : g.parameteruji_one.name_id,
                    statusuji: g.transaction_sample.statuspengujian.name,
                    tgl_selesai: g.transaction_sample.tgl_selesai,
                    hasiluji: g.hasiluji,
                    actual_result: g.actual_result,
                    id_satuan: g.id_unit,
                    simplo: g.simplo,
                    duplo: g.duplo,
                    triplo: g.triplo,
                    desc: g.desc,
                    id_lod: g.id_lod,
                    id_standart: g.id_standart,
                    id_metode: g.id_metode,
                    id_lab: g.id_lab,
                    tujuanpengujian: g.transaction_sample.tujuanpengujian.name
                });
            });

        let fileName = await `Data ${this.datatransaksi[0].transaction_sample.kontrakuji.contract_no}.xlsx`;
        let workbook = await XLSX.utils.book_new();

        let worksheet = await XLSX.utils.json_to_sheet(k);
        await XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        await XLSX.writeFile(workbook, fileName);
    }

    async savedata() {
        await global.swalyousure("Want to Save data ?").then(async (h) => {
            if (h.isConfirmed) {
                let y = await this.datatransaksi.filter((x) => x.checked);
                let u = await [];
                await y.forEach((t) => {
                    u = u.concat({
                        id_transaction_parameter: t.id_transaction
                            ? t.id_transaction
                            : t.id,
                        simplo: t.simplo,
                        duplo: t.duplo,
                        triplo: t.triplo,
                        hasiluji: t.hasiluji,
                        id_standart: t.id_standart,
                        id_lod: t.id_lod,
                        id_lab: t.id_lab,
                        id_unit: t.id_unit,
                        id_metode: t.id_metode,
                        id_sample: t.id_sample,
                        actual_result: t.actual_result,
                        desc: t.desc
                    });
                });
                await this._masterServ
                    .addDataLab(u)
                    .then((xx) => {
                        this.resetData();
                    })
                    .then(() => (this.testingcheck = false));
            }
        });
    }

    setbutton(ev) {
        console.log(ev.value);
        switch (ev.value) {
            case "sendsample":
                this.approvesample();
                break;
            case "export":
                this.getdatacheckimport();
                break;
            case "save":
                this.savedata();
                break;
        }
    }

    resetData() {
        this.originaldata = [];
        this.datatransaksi = [];
        this.getData();
    }

    approve() {
        let y = this.datatransaksi.filter((x) => x.checked);
        let u = [];
        y.forEach((c) => {
            u = u.concat({
                id_transaction_parameter: c.id,
                id_sample: c.id_sample,
                id_kontrakuji: c.transaction_sample.id_contract,
            });
        });
        this._masterServ
            .approveContractManager(u)
            .then((o) => {
                this.resetData();
            })
            .then(() => (this.testingcheck = false));
    }

    searchNameSample(ev) {
        if (ev.target.value.length > 2) {
            this.datatransaksi = this.originaldata.filter(
                (x) =>
                    x.transaction_sample.sample_name
                        .toLowerCase()
                        .indexOf(ev.target.value.toLowerCase()) > -1
            );
        } else {
            this.datatransaksi = this.originaldata;
        }
    }

    setvalue(ev, i, status) {
        switch (status) {
            case "simplo":
                this.datatransaksi[i].simplo = ev;
                break;
            case "duplo":
                this.datatransaksi[i].duplo = ev;
                break;
            case "triplo":
                this.datatransaksi[i].triplo = ev;
                break;
            case "hasiluji":
                this.datatransaksi[i].hasiluji = ev;
                break;
        }
    }

    async getData() {
        await this._spinner.show();
        await this._masterServ
            .getDataApproval(this.datasent.idcontract)
            .then(async (x: any) => {
                if (x.length > 0) {
                    this.originaldata = this.originaldata.concat(x);
                    this.datatransaksi = this.originaldata;
                } else {
                    this._router.navigateByUrl("analystpro/lab-approval");
                }
            })
            .then(() => {
                this.getDataParameter();
                this.getDataSample();
            })
            .then(() => {
                this.dataparameter = global.uniq(
                    this.dataparameter,
                    (it) => it.id
                );
                this.datasample = global.uniq(this.datasample, (it) => it.id);
            });
        await this._spinner.hide();
    }

    setDate(v) {
        let a = new Date(v);
        return `${global.addzero(a.getDate())}/${global.addzero(
            a.getMonth()
        )}/${a.getFullYear()}`;
    }

    getDataMemoInternal() {
        this._contractServ.getChat(this.idContract).then(async (x) => {
            this.memointernal = this.memointernal.concat(x);
        });
    }

    getDataMemoKendali() {
        this._controlService.getDataDescription(this.idContract).then((x) => {
            if (x) {
                this.memokendali = this.memokendali.concat(x);
            } else {
                this.memokendali = this.memokendali.concat({
                    desc: "-",
                });
            }
        });
    }

    unapprovesample() {
        console.log("test");
    }

    goToDetailContract(ev) {
        this._router.navigateByUrl(
            "/analystpro/view-contract/" + ev.id_kontrakuji
        );
    }

    // kesimpulan() {
    //     let dialogCust = this.dialog.open(ModalSampleKesimpulanComponent, {
    //         height: "auto",
    //         width: "700px",
    //         data: {
    //             sample: global.uniq(
    //                 this.datalab,
    //                 (it) => it.transaction_sample.id
    //             ),
    //         },
    //     });

    //     dialogCust.afterClosed().subscribe(async (result) => {
    //         this._labApproveServ
    //             .saveKesimpulan(
    //                 result.c.sample.filter((g) => g.sample_conclude)
    //             )
    //             .then((x) => {
    //                 global.swalsuccess("success", "Conculison Saved");
    //             })
    //             .then((g) => this.resetData())
    //             .catch((e) => global.swalerror("Error saving conclusion"));
    //     });
    // }

    info(value, index) {
        let dialogCust = this.dialog.open(ModalInformationComponent, {
            height: "auto",
            width: "700px",
            data: {
                infotransaction: this.datatransaksi[index],
            },
        });

        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    async checkAll(ev, row, index?) {
        console.log(ev);
        if (row == "all") {
            let indexall = await [];
            await this.datatransaksi.forEach((g, i) => {
                if (g.conditionlabdone.length > 0) {
                    this.datatransaksi[i].checked = ev ? 1 : 0;
                }
            });
        } else {
            this.datatransaksi[index].checked = ev ? 1 : 0;
        }
        this.checkdata =
            (await this.datatransaksi.filter((x) => x.checked).length) > 0
                ? false
                : true;
        this.jumlahcheck = this.datatransaksi.filter((x) => x.checked).length;
    }

    getValSample(ev) {
        this.parameter = null;
        this.datatransaksi = [];
        let filteredArray = ev.map(x => x.id);
        if(filteredArray.length > 0) {
            this.datatransaksi = this.originaldata.filter(x => filteredArray.indexOf(x.transaction_sample.id) > -1);
        } else {
            this.resetData();
            this.getData();
        }
    }

    getValParameter(ev) {
        this.sample = null;
        this.datatransaksi = [];
        if(ev) {
            this.datatransaksi = this.originaldata.filter(x => x.id == ev.id);
        } else {
            this.resetData();
            this.getData();
        }
    }

    getValStatusPengujian(ev) {
        this.sample = null;
        this.parameter = null;
        this.datatransaksi = [];
        if(ev){
            this.datatransaksi = this.originaldata.filter(x => x.transaction_sample.id_statuspengujian == ev.id);
        } else {
            this.resetData();
            this.getData();
        }
    }

    async getdatacheckimport() {
        let o = await this.datatransaksi.filter((x) => x.checked);
        let u = [];
        await o.forEach((v) => {
            u = u.concat({
                parametername: v.position
                    ? v.parameter_name + " - " + v.position
                    : v.parameter_name,
                no_sample: v.no_sample,
                hasiluji: v.hasiluji,
                simplo: v.simplo,
                duplo: v.duplo,
                triplo: v.triplo,
                info: v.info,
            });
        });

        let fileName = await `Check Data ${o[0].contract_no}.xlsx`;
        let workbook = await XLSX.utils.book_new();
        let worksheet = await XLSX.utils.json_to_sheet(u);
        await XLSX.utils.book_append_sheet(workbook, worksheet);
        await XLSX.writeFile(workbook, fileName);
    }

    // uniq(data, key) {
    //     return [...new Map(data.map((x) => [key(x), x])).values()];
    // }

    // sortData(index, status) {
    //     let az = false;
    //     this.buatsort = this.buatsort + 1;
    //     if(this.buatsort%2 == 0){
    //         az = true;
    //     } else {
    //         az = false;
    //     }
    //     this.sampleApproveForm.controls.sort((a,b) => {
    //         switch(status){
    //             case 'lab':
    //                 return this.compare(a.value.nama_lab, b.value.nama_lab, az);
    //             break;
    //             case 'hasil':
    //                 return this.compare(a.value.hasiluji, b.value.hasiluji, az);
    //             break;
    //         }
    //     })
    //   }

    //   compare(a: number | string, b: number | string, isAsc: boolean) {
    //     return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    //   }
}
