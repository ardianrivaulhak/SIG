import {
    Component,
    OnInit,
    ViewEncapsulation,
    HostListener,
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormArray,
    FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PaketparameterService } from "../paketparameter.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import { StandartService } from "../../../master/standart/standart.service";
import { LodService } from "../../../master/lod/lod.service";
import { UnitService } from "../../unit/unit.service";
import { MetodeService } from "../../metode/metode.service";
import { LabService } from "../../lab/lab.service";
import Swal from "sweetalert2";
import { Observable, BehaviorSubject, of } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { PaketparameterModalComponent } from "../paketparameter-modal/paketparameter-modal.component";
import { ContractService } from "../../../services/contract/contract.service";
import { TujuanpengujianService } from "app/main/analystpro/services/tujuanpengujian/tujuanpengujian.service";
import * as global from "app/main/global";
@Component({
    selector: "app-paketparameter-det",
    templateUrl: "./paketparameter-det.component.html",
    styleUrls: ["./paketparameter-det.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class PaketparameterDetComponent implements OnInit {
    parameterForm: FormArray = this._formBuild.array([]);
    subject: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
    array$: Observable<any> = this.subject.asObservable();
    _unsubscribeAll = new BehaviorSubject<any>([]);
    datasub = {
        page: 1,
        id_catalogue: null,
        search: null,
    };

    dataunit = [];
    dataMetode = [];
    datasendunit = {
        pages: 1,
        search: null,
    };
    datasendmetode = {
        pages: 1,
        search: null,
    };

    paketparameterForm: FormGroup;
    detaildata = [];
    displayedColumns: string[] = [
        "no",
        "action",
        "name_id",
        "lab",
        "lod",
        "unit",
        "metode",
        "standart",
    ];
    idpaketparameter: any;
    paketujichoose = [];
    paketujiData = [];
    paketparameterchoose = [];
    paketparametercombine = [];
    parameterUjiData = [];
    paketparametertotal: number = 0;
    jumlah: number;
    valuechoose = [];
    loading = false;

    datastandart = [];
    detailmodal = false;

    datasendstandart = {
        pages: 1,
        search: null,
    };
    datasendlab = {
        pages: 1,
        search: null,
    };
    datalod = [];
    datalab = [];
    datasendlod = {
        pages: 1,
        search: null,
    };

    datasend = {
        pages: 1,
        search: null,
    };
    datasendParameterUji = {
        pages: 1,
        search: null,
    };
    dataId = {
        id_paketuji: "",
        parameteruji: [],
    };
    ideditpaketuji: number;
    hide = true;
    load = false;
    saving = false;
    disc = [
        { value: 1, viewValue: "Yes" },
        { value: 0, viewValue: "No" },
    ];
    dataCopy = null;
    btnPaste = false;
    selectedReference: string;

    dataselectPaketParameter = {
        page: 1,
        search: null,
    };
    dataPaketuji = [];
    screenHeight;
    screenWidth;
    @HostListener("window:resize", ["$event"]) onResize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
    }
    jumlahapprove = 0;
    copydataparameter = [];
    disablepasteall = true;

    constructor(
        private _masterServ: PaketparameterService,
        private _actRoute: ActivatedRoute,
        private _formBuild: FormBuilder,
        private _snackBar: MatSnackBar,
        private _route: Router,
        private _standartServ: StandartService,
        private _lodServ: LodService,
        private _unitServ: UnitService,
        private _labServ: LabService,
        private dialog: MatDialog,
        private _metodeServ: MetodeService,
        private _kontrakServ: ContractService
    ) {
        this.onResize();

        this.dataId.id_paketuji = this._actRoute.snapshot.params["id"];
        this.idpaketparameter = this._actRoute.snapshot.params["id"];
    }

    checkstatus(value) {
        console.log(value);
    }

    copydata(value, index) {
        this.copydataparameter = [];
        this.copydataparameter = this.copydataparameter.concat(
            this.parameterForm.controls[index].value
        );
        this.disablepasteall = false;
    }

    deletedata(value, index) {
        if (index == "all") {
            this.parameterForm.controls = [];
            this.paketparameterchoose = [];
        } else {
            this.parameterForm.removeAt(index);
            this.paketparameterchoose = this.paketparameterchoose.filter(
                (x) => x.id !== value.id
            );
        }
    }

    checkAll(event, status, index?) {
        if (status !== "all") {
            this.setvaluecheck(event, index);
        } else {
            for (let z = 0; z < this.parameterForm.length; z++) {
                this.setvaluecheck(event, z);
            }
        }
        this.setjumlahceklist();
    }

    setjumlahceklist() {
        this.jumlahapprove = this.parameterForm.controls.filter(
            (x) => x.value.checked
        ).length;
    }

    setvaluecheck(event, index) {
        if (event) {
            this.parameterForm.controls[index]["controls"].checked.setValue(
                true
            );
        } else {
            this.parameterForm.controls[index]["controls"].checked.setValue(
                false
            );
        }
    }

    ngOnInit(): void {
        if (this.idpaketparameter === "add") {
            this.detailmodal = true;
            this.paketparameterForm = this.createLabForm();
        } else {
            this.getdatadetail();
        }
        this.getParameterUji();
        this.getdataPaketuji();
        this.getDataLab();
    }

    selectingReference(ev) {
        console.log(ev);
    }

    swalyousure(text) {
        return Swal.fire({
            title: "Are you sure?",
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes !",
            cancelButtonText: "No, cancel it",
        });
    }

    swalerror(text) {
        return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: text,
        });
    }

    delete(value, index) {
        if (status) {
            this.parameterForm.controls = [];
            this.paketparameterchoose = [];
        } else {
            this.parameterForm.controls = this.parameterForm.controls.filter(
                (x) => x.value.checked == false
            );
            // this.paketparameterchoose = this.paketparameterchoose.filter(y=> y.checked);
        }
    }

    pastedata(a, i) {
        if (i == "all") {
            this.swalyousure("You will paste this Data!").then((result) => {
                if (result.value) {
                    for (
                        let z = 0;
                        z < this.parameterForm.controls.length;
                        z++
                    ) {
                        this.setValue(z);
                    }
                    Swal.fire(
                        "Paste success!",
                        "Your data has been change.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire("Cancelled", "Your Data is Safe", "error");
                }
            });
        } else {
            this.setValue(i);
        }
    }

    getdataPaketuji() {
        this._kontrakServ
            .getDataPaketUji(this.dataselectPaketParameter)
            .then((paketparameter) => {
                this.dataPaketuji = this.dataPaketuji.concat(
                    paketparameter["data"]
                );
            })
            .then(
                () =>
                    (this.dataPaketuji = this.uniq(
                        this.dataPaketuji,
                        (it) => it.id
                    ))
            );
    }

    setValue(i, e?) {
        this.parameterForm.controls[i]["controls"].id_parameter_uji.setValue(
            !e ? this.copydataparameter[0].id_parameter_uji : e.id
        );
        this.parameterForm.controls[i]["controls"].parameteruji_code.setValue(
            !e
                ? this.copydataparameter[0].parameteruji_code
                : e.parameteruji[0].parameter_code
        );
        this.parameterForm.controls[i]["controls"].parameteruji_name.setValue(
            !e
                ? this.copydataparameter[0].parameteruji_name
                : e.parameteruji[0].name_id
        );
        this.parameterForm.controls[i]["controls"].nama_standart.setValue(
            !e
                ? this.copydataparameter[0].nama_standart
                : e.standart.nama_standart
        );
        this.parameterForm.controls[i]["controls"].kode_standart.setValue(
            !e
                ? this.copydataparameter[0].kode_standart
                : e.standart.kode_standart
        );
        this.parameterForm.controls[i]["controls"].id_standart.setValue(
            !e ? this.copydataparameter[0].id_standart : e.standart.id
        );
        this.parameterForm.controls[i]["controls"].nama_unit.setValue(
            !e ? this.copydataparameter[0].nama_unit : e.unit.nama_unit
        );
        this.parameterForm.controls[i]["controls"].kode_unit.setValue(
            !e ? this.copydataparameter[0].kode_unit : e.unit.kode_unit
        );
        this.parameterForm.controls[i]["controls"].id_unit.setValue(
            !e ? this.copydataparameter[0].id_unit : e.unit.id
        );
        this.parameterForm.controls[i]["controls"].metode.setValue(
            !e ? this.copydataparameter[0].metode : e.metode.metode
        );
        this.parameterForm.controls[i]["controls"].kode_metode.setValue(
            !e ? this.copydataparameter[0].kode_metode : e.metode.kode_metode
        );
        this.parameterForm.controls[i]["controls"].id_metode.setValue(
            !e ? this.copydataparameter[0].id_metode : e.metode.id
        );
        this.parameterForm.controls[i]["controls"].id_lod.setValue(
            !e ? this.copydataparameter[0].id_lod : e.lod.id
        );
        this.parameterForm.controls[i]["controls"].kode_lod.setValue(
            !e ? this.copydataparameter[0].kode_lod : e.lod.kode_lod
        );
        this.parameterForm.controls[i]["controls"].nama_lod.setValue(
            !e ? this.copydataparameter[0].nama_lod : e.lod.nama_lod
        );
        this.parameterForm.controls[i]["controls"].id_lab.setValue(
            !e ? this.copydataparameter[0].id_lab : e.lab.id
        );
        this.parameterForm.controls[i]["controls"].kode_lab.setValue(
            !e ? this.copydataparameter[0].kode_lab : e.lab.kode_lab
        );
        this.parameterForm.controls[i]["controls"].nama_lab.setValue(
            !e ? this.copydataparameter[0].nama_lab : e.lab.nama_lab
        );
    }

    async getValPaketuji(v) {
        await console.log(v);
    }

    tambah() {
        // console.log();
        if (this.paketparameterForm.controls.reference.value == "nonpaket") {
            if (this.paketparameterForm.controls.parameterpick.value !== null) {
                let getdataparameter = this.parameterUjiData.filter(
                    (x) =>
                        x.id ===
                        this.paketparameterForm.controls.parameterpick.value
                );
                let ev = getdataparameter[0];
                this.paketparameterchoose =
                    this.paketparameterchoose.concat(ev);
                let parameteruji = this._formBuild.group({
                    checked: [false],
                    id_parameter_uji: [ev.id],
                    parameteruji_code: [ev.parameter_code],
                    parameteruji_name: [ev.name_id],
                    nama_standart: [null],
                    kode_standart: [null],
                    id_standart: [null],
                    nama_unit: [null],
                    kode_unit: [null],
                    id_unit: [null],
                    metode: [null],
                    kode_metode: [null],
                    id_metode: [null],
                    id_lod: [null],
                    kode_lod: [null],
                    nama_lod: [null],
                    id_lab: [ev.lab.id],
                    kode_lab: [ev.lab.kode_lab],
                    nama_lab: [ev.lab.nama_lab],
                });
                this.datalab = this.datalab.concat({
                    id: ev.lab.id,
                    kode_lab: ev.lab.kode_lab,
                    nama_lab: ev.lab.nama_lab,
                });

                this.datalab = this.uniq(this.datalab, (it) => it.id);
                this.parameterForm.push(parameteruji);
            } else {
                global.swalerror(
                    "Harap Isi Parameter uji / Refrensi paket terlebih dahulu"
                );
            }
        } else {
            this._kontrakServ
                .getDataPaketParameter(
                    this.paketparameterForm.controls.paketujipick.value
                )
                .then((paket) => {
                    let a = [];
                    a = a.concat(paket);
                    a.forEach((f) => {
                        f.paketparameter.forEach((k) => {
                            this.paketparameterchoose =
                                this.paketparameterchoose.concat({
                                    id: k.id_parameter_uji,
                                    id_paket: k.id_paketuji,
                                    info_id: k.id_paketuji,
                                    no: this.paketparameterchoose.length + 1,
                                    name_id: k.parameteruji[0].name_id,
                                    name_en: k.parameteruji[0].name_en,
                                    parameter_code:
                                        k.parameteruji[0].parameter_code,
                                    lod: k.lod.nama_lod,
                                    standart: k.standart.nama_standart,
                                    unit: k.unit.nama_unit,
                                    status: f.kode_paketuji,
                                    metode: k.metode.metode,
                                    hargaParameter: f.price,
                                    id_lod: k.id_lod,
                                    id_standart: k.id_standart,
                                    id_unit: k.id_unit,
                                    id_metode: k.id_metode,
                                    id_lab: k.id_lab,
                                });
                            this.setValueTemporary(k);
                            this.addFormParameter(k);
                        });
                    });
                });
        }
    }

    setValueTemporary(k) {
        this.datalab = this.datalab.concat({
            id: k.lab.id,
            kode_lab: k.lab.kode_lab,
            nama_lab: k.lab.nama_lab,
        });

        this.datalab = this.uniq(this.datalab, (it) => it.id);

        this.datalod = this.datalod.concat({
            id: k.lod.id,
            kode_lod: k.lod.kode_lod,
            nama_lod: k.lod.nama_lod,
        });

        this.datalod = this.uniq(this.datalod, (it) => it.id);

        this.dataunit = this.dataunit.concat({
            id: k.unit.id,
            kode_unit: k.unit.kode_unit,
            nama_unit: k.unit.nama_unit,
        });

        this.dataunit = this.uniq(this.dataunit, (it) => it.id);

        this.dataMetode = this.dataMetode.concat({
            id: k.metode.id,
            kode_metode: k.metode.kode_metode,
            metode: k.metode.metode,
        });

        this.dataMetode = this.uniq(this.dataMetode, (it) => it.id);

        this.datastandart = this.datastandart.concat({
            id: k.standart.id,
            kode_standart: k.standart.kode_standart,
            nama_standart: k.standart.nama_standart,
        });

        this.datastandart = this.uniq(this.datastandart, (it) => it.id);
    }

    event(e) {
        this.valuechoose = this.valuechoose.concat(e);
    }

    async getDataUnit() {
        await this._unitServ.getDataUnit(this.datasendunit).then((x) => {
            this.dataunit = this.dataunit.concat(x["data"]);
            // console.log(this.dataunit);
        });
    }

    async getDataMetode() {
        await this._metodeServ.getDataMetode(this.datasendmetode).then((x) => {
            this.dataMetode = this.dataMetode.concat(x["data"]);
        });
    }

    getDataLab() {
        this._labServ.getDataLab(this.datasendlab).then((x) => {
            this.datalab = this.datalab.concat(Array.from(x["data"]));
        });
    }

    getDataStandart() {
        this._standartServ.getDataStandart(this.datasendstandart).then((x) => {
            this.datastandart = this.datastandart.concat(Array.from(x["data"]));
        });
    }

    getDataLod() {
        this._lodServ.getDataLod(this.datasendlod).then((x) => {
            this.datalod = this.datalod.concat(Array.from(x["data"]));
        });
    }

    getValDataPaketuji(ev, identifier) {
        if (identifier === "lod") {
            // console.log(ev);
            this.paketujichoose = [];
            this.paketujichoose = this.paketujichoose.concat(ev);
        } else if (identifier === "standart") {
            // console.log(ev);
            this.paketujichoose = [];
            this.paketujichoose = this.paketujichoose.concat(ev);
        } else if (identifier === "unit") {
            // console.log(ev);
            this.paketujichoose = [];
            this.paketujichoose = this.paketujichoose.concat(ev);
        } else {
            this.paketujichoose = [];
            this.paketujichoose = this.paketujichoose.concat(ev);
            this.paketparameterchoose = this.paketparameterchoose.filter(
                (x) => x
            );
            // console.log(this.paketujichoose);
        }
        // console.log(this.paketujichoose);
    }

    // onScrollToEnd() {
    //
    // }

    resetPaketuji() {
        this.paketujichoose = [];
        // this.getPaketuji();
    }

    onScrollToEnd(e) {
        this.loading = true;
        if (e === "lod") {
            this.datasendlod.pages = this.datasendlod.pages + 1;
            this.getDataLod();
        }

        if (e === "standart") {
            this.datasendstandart.pages = this.datasendstandart.pages + 1;
            this.getDataStandart();
        }

        if (e === "paketuji") {
            this.datasend.pages = this.datasend.pages + 1;
            // this.getPaketuji();
        } else {
            this.datasendunit.pages = this.datasendunit.pages + 1;
            this.getDataUnit();
        }
        setTimeout(() => {
            this.loading = false;
        }, 200);
    }

    onSearch(ev, identifier) {
        if (identifier === "lod") {
            this.datasendlod.search = ev.term;
            this.datasendlod.pages = 1;
            this.datalod = [];
            this.getDataLod();
        } else if (identifier == "standart") {
            this.datasendstandart.search = ev.term;
            this.datasendstandart.pages = 1;
            this.datastandart = [];
            this.getDataStandart();
        } else if (identifier == "paketuji") {
            this.datasend.search = ev.term;
            this.datasend.pages = 1;
            this.paketujiData = [];
            // this.getPaketuji();
        } else if (identifier == "metode") {
            this.datasendmetode.search = ev.term;
            this.datasendmetode.pages = 1;
            this.dataMetode = [];
            this.getDataMetode();
        }
    }

    resetAll(ev) {
        if (ev === "lod") {
            this.datasendlod.search = null;
            this.datasendlod.pages = 1;
            this.datalod = [];
            this.getDataLod();
        } else if (ev === "standart") {
            this.datasendstandart.search = null;
            this.datasendstandart.pages = 1;
            this.datastandart = [];
            this.getDataStandart();
        } else if (ev === "paketuji") {
            this.datasend.search = null;
            this.datasend.pages = 1;
            this.paketujiData = [];
            // this.getPaketuji();
        } else {
            this.datasendunit.search = null;
            this.datasendunit.pages = 1;
            this.dataunit = [];
            this.getDataUnit();
        }
    }

    async getParameterUji() {
        await this._masterServ
            .getDataParameterUji(this.datasendParameterUji)
            .then((x) => {
                this.parameterUjiData = this.parameterUjiData.concat(x["data"]);
            });
        this.parameterUjiData = await this.uniq(
            this.parameterUjiData,
            (it) => it.id
        );
    }

    clickSelect(e, v) {
        if (v == "satuan") {
            this.getDataUnit();
        } else if (v == "lod") {
            this.getDataLod();
        } else if (v == "metode") {
            this.getDataMetode();
         } else {
            this.getDataStandart();
        }
    }

    getValDataPaketparameter(ev) {
        console.log(ev);
    }

    onScrollToEndParameter(ev) {
        if (ev === "parameteruji") {
            this.datasendParameterUji.pages =
                this.datasendParameterUji.pages + 1;
            this.getParameterUji();
        } else if (ev == "satuan") {
            this.datasendunit.pages = this.datasendunit.pages + 1;
            this.getDataUnit();
        } else if (ev == "lod") {
            this.datasendlod.pages = this.datasendlod.pages + 1;
            this.getDataLod();
        } else if (ev == "metode") {
            this.datasendmetode.pages = this.datasendmetode.pages + 1;
            this.getDataMetode();
        } else if (ev == "lab") {
            this.datasendlab.pages = this.datasendlab.pages + 1;
            this.getDataLab();
        } else {
            this.datasendstandart.pages = this.datasendstandart.pages + 1;
            this.getDataStandart();
        }
    }

    onSearchPaketParameter(ev) {
        this.dataselectPaketParameter.search = ev.term;
        this.dataselectPaketParameter.page = 1;
        this.dataPaketuji = [];
        this.getdataPaketuji();
    }

    clearSelect(v) {
        if (v === "paketparameter") {
            this.dataselectPaketParameter.search = null;
            this.dataselectPaketParameter.page = 1;
            this.dataPaketuji = [];
            this.getdataPaketuji();
        }
    }

    deleteall() {
        this.paketparametercombine = [];
        this.paketparameterchoose = [];
    }

    resetPaketparameter() {
        this.datasendParameterUji.pages = 1;
        this.datasendParameterUji.search = null;
        this.getParameterUji();
    }

    sad(ev) {
        // console.log(ev);
        this.datasendParameterUji.search = ev.term;
        this.datasendParameterUji.pages = 1;
        this.getParameterUji();
    }

    async onSearchParameter(ev) {
        this.datasendParameterUji.search = await ev.term;
        this.datasendParameterUji.pages = await 1;
        await this.getParameterUji();
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    saveNewForm() {

        let checkdata_metode = this.parameterForm.controls.filter(
            (b) => b.value.id_metode == null
        ).length;
        let checkdata_lod = this.parameterForm.controls.filter(
            (b) => b.value.id_lod == null
        ).length;
        let checkdata_standart = this.parameterForm.controls.filter(
            (b) => b.value.id_standart == null
        ).length;
        let checkdata_unit = this.parameterForm.controls.filter(
            (b) => b.value.id_unit == null
        ).length;

        let total =
            checkdata_metode +
            checkdata_lod +
            checkdata_standart +
            checkdata_unit;

        if (total > 0) {
            global.swalerror("Lod, Metode, Satuan, Standart Harus di isi");
        } else {
            this.swalyousure(
                `this will add 1 package with name "${this.paketparameterForm.value.nama_paket.toUpperCase()}" and ${
                    this.paketparameterForm.value.parameter.length
                } Parameter`
            ).then((result) => {
                        let urlgo =
                            this.idpaketparameter !== "add"
                                ? this._masterServ.updateDataPaketparameter(
                                      this.idpaketparameter,
                                      this.paketparameterForm.value
                                  )
                                : this._masterServ.addDataPaketparameter(
                                      this.paketparameterForm.value
                                  );
                        urlgo.then((g) => {
                            let a = [];
                            a = a.concat(g);

                            if (a[0]["success"]) {
                                Swal.fire(
                                    "Add Package Success!",
                                    "Your data has been Added. Please Accept it to Use it",
                                    "success"
                                );
                                setTimeout(() => {
                                    this._route.navigateByUrl(
                                        "analystpro/paket-parameter"
                                    );
                                }, 2000);
                            } else {
                                Swal.fire("Error !", a[0]["message"], "error");
                            }
                        });
            });
        }
    }

    getVal(ev, st) {
        console.log(st);
    }

    async getdatadetail() {
        this.paketparameterForm = await this.createLabForm();
        await this._masterServ
            .getDataDetailPaketparameter(this.idpaketparameter)
            .then((x) => {
                this.paketparameterForm.controls.nama_paket.setValue(
                    x["nama_paketuji"]
                );
                this.paketparameterForm.controls.nama_paket_en.setValue(
                    x["nama_paketuji_en"]
                );
                this.paketparameterForm.controls.description.setValue(
                    x["description"]
                );
                this.paketparameterForm.controls.price.setValue(x["price"]);
                this.paketparameterForm.controls.discount.setValue(
                    x["discount"].toString()
                );
                x["paketparameter"].forEach((e) => {
                    this.paketparameterchoose =
                        this.paketparameterchoose.concat({
                            id: e.id,
                            name_id: e.parameteruji[0].name_id,
                            name_en: e.parameteruji[0].name_en,
                            parameter_code: e.parameteruji[0].parameter_code,
                            id_parameteruji: e.parameteruji[0].id,
                            id_lab: e.lab.id_lab,
                            id_metode: e.metode.id,
                            id_unit: e.unit.id,
                            id_standart: e.standart.id,
                            id_lod: e.lod.id,
                        });
                    this.addFormParameter(e);
                    this.setValueTemporary(e);
                });
            });
    }

    createLabForm(): FormGroup {
        return this._formBuild.group({
            nama_paket: new FormControl(),
            nama_paket_en: new FormControl(),
            price: new FormControl(),
            description: new FormControl(),
            reference: new FormControl(),
            discount: new FormControl(),
            parameterpick: [null],
            paketujipick: [null],
            parameter: this.parameterForm,
        });
    }

    addFormParameter(d) {
        const parameterFormat = this._formBuild.group({
            checked: [false],
            id_parameter_uji: [d.id_parameter_uji],
            parameteruji_code: [d.parameteruji[0].parameter_code],
            parameteruji_name: [d.parameteruji[0].name_id],
            nama_standart: [d.standart.nama_standart],
            kode_standart: [d.standart.kode_standart],
            id_standart: [d.standart.id],
            nama_unit: [d.unit.nama_unit],
            kode_unit: [d.unit.kode_unit],
            id_unit: [d.unit.id],
            metode: [d.metode.metode],
            kode_metode: [d.metode.kode_metode],
            id_metode: [d.metode.id],
            id_lod: [d.lod.id],
            kode_lod: [d.lod.kode_lod],
            nama_lod: [d.lod.nama_lod],
            id_lab: [d.lab.id],
            kode_lab: [d.lab.kode_lab],
            nama_lab: [d.lab.nama_lab],
        });
        this.parameterForm.push(parameterFormat);
    }
}
