import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { Sort } from "@angular/material/sort";
import Swal from "sweetalert2";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { TujuanpengujianService } from "../../services/tujuanpengujian/tujuanpengujian.service";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    FormArray,
    Form,
} from "@angular/forms";
import { ContractService } from "../../services/contract/contract.service";
import { LodService } from "../../master/lod/lod.service";
import { StandartService } from "../../master/standart/standart.service";
import { MetodeService } from "../../master/metode/metode.service";
import { UnitService } from "../../master/unit/unit.service";
import { url } from "app/main/url";
import { ParameterujiService } from "app/main/analystpro/master/parameteruji/parameteruji.service";
import { PaketparameterService } from "app/main/analystpro/master/paketparameter/paketparameter.service";
import { PaketPkmService } from "app/main/analystpro/master/paket-pkm/paket-pkm.service";
import { MatTable } from "@angular/material/table";
import { SubcatalogueService } from "app/main/analystpro/master/subcatalogue/subcatalogue.service";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";
import * as global from "app/main/global";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ModalPaketParameterComponent } from "app/main/analystpro/revision-contract/modal-paket-parameter/modal-paket-parameter.component";
import { InfoParamComponent } from "app/main/analystpro/penawaran/info-param/info-param.component";
import { ModalParamEditComponent } from "../modal-param-edit/modal-param-edit.component";
export interface Datasample {
    id: string;
    sample_name: string;
    jenis_kemasan: string;
}

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
    selector: "app-modal-parameter",
    templateUrl: "./modal-parameter.component.html",
    styleUrls: ["./modal-parameter.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class ModalParameterComponent implements OnInit {
    @ViewChild("MatTableNonPaket") MatTableNonPaket: MatTable<any>;

    samplename: String;
    loading = true;
    deleterowpaketparameter = [];
    deleterowpaketparameterall = [];
    deleterowpaketpkm = [];
    deletenonpaketparameter = [];
    tujuanpengujian = [];
    subCatalogueData = [];
    anehsendiriu = [];

    datasub = {
        page: 1,
        id_catalogue: null,
        search: null,
    };

    perkalian;

    statuspengujian = [
        {
            id: 1,
            status: "Normal",
            value: 1,
            disc: 0,
        },
        {
            id: 2,
            status: "Urgent",
            value: 2,
            disc: 0,
        },
        {
            id: 3,
            status: "Very Urgent",
            value: 3,
            disc: 0,
        },
        {
            id: 4,
            status: "Custom 2 Hari",
            value: 4,
            disc: 0,
        },
        {
            id: 5,
            status: "Custom 1 Hari",
            value: 5,
            disc: 0,
        },
    ];
    deletingnonparameter = [];
    deletingpaketparameter = [];
    deletingpaketpkm = [];
    nonpaketparameter: FormArray = this.fb.array([]);
    paketparameter: FormArray = this.fb.array([]);
    paketparameter_temporary = [];
    paketPKM: FormArray = this.fb.array([]);
    loadbuttonnonparameter = true;
    SampleForm: FormGroup;
    parameteruji: FormArray = this.fb.array([]);

    //parameter form
    nonpaketColumn = [
        "no",
        "name_id",
        "lab",
        "parametertype",
        "formathasil",
        "price",
    ];

    dataFormatHasil = [
        { id: 1, hasil: "Simplo" },
        { id: 2, hasil: "Duplo" },
        { id: 3, hasil: "Triplo" },
    ];

    dataselectParameter = {
        page: 1,
        search: null,
    };

    dataParameter = [];
    dataParameterPrice = [];
    deleteparam = true;
    pricenonpaket: number;
    //end parameter

    //paket parameter variable
    // discstatus = 0;
    dataPaketuji = [];
    dataselectPaketParameter = {
        page: 1,
        search: null,
        active: 1,
    };
    deletepaketdisabled = true;
    //end paket parameter variable

    //paket pkm variable
    dataselectPaketPKM = {
        page: 1,
        search: null,
        active: 1,
    };
    dataPaketPKM = [];
    paketpkm_temporary = [];
    deletepaketpkmdisabled = true;
    //end paket pkm variable
    datenow = new Date();
    statusform: String;
    discsample;
    buatsort = 1;
    datasampleinfo;

    paketbedaasendiri = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalParameterComponent>,
        private _dialog: MatDialog,
        private _tujuanServ: TujuanpengujianService,
        private fb: FormBuilder,
        private _kontrakServ: ContractService,
        private _subcatalogServ: SubcatalogueService,
        private _parameterujiServ: ParameterujiService,
        private _paketParameterServ: PaketparameterService,
        private _paketPkmServ: PaketPkmService,
        private _snackBar: MatSnackBar
    ) {
        if (data) {
            console.log(data);
            this.datasampleinfo = data.st == "penawaran" ? true : false;
            this.statusform = data.status;
            this.samplename = data.sampleForm.samplename;
            if (data.sampleForm.parameter.totalpricesample !== null) {
                this.setDatatoForm(data.sampleForm.parameter);
            }
            if (data.mouData.length > 0) {
                this.statuspengujian = [];
                this.statuspengujian = [
                    {
                        id: 1,
                        status: "Normal",
                        value: data.mouData[0].values,
                        disc: data.mouData[0].discount,
                    },
                    {
                        id: 2,
                        status: "Urgent",
                        value: data.mouData[1].values,
                        disc: data.mouData[1].discount,
                    },
                    {
                        id: 3,
                        status: "Very Urgent",
                        value: data.mouData[2].values,
                        disc: data.mouData[2].discount,
                    },
                    {
                        id: 4,
                        status: "Custom 2 Hari",
                        value: data.mouData[3].values,
                        disc: data.mouData[3].discount,
                    },
                    {
                        id: 5,
                        status: "Custom 1 Hari",
                        value: data.mouData[4].values,
                        disc: data.mouData[4].discount,
                    },
                ];
            }
            this.dialogRef
                .backdropClick()
                .subscribe((v) => this.setForm("save"));
        }
    }

    ngOnInit(): void {
        this.SampleForm = this.createSampleForm();
        setTimeout(() => (this.loading = false), 1000);
        this.getDataParameter();
        this.getdataPaketuji();
        this.getdataPaketPKM();
        this.getDataTujuanPengujian();
        this.getDataSubCatalogue();
        this._kontrakServ
            .hargaaneh()
            .then((x) => (this.anehsendiriu = this.anehsendiriu.concat(x)))
            .then(
                () =>
                    (this.anehsendiriu = this.anehsendiriu.map(
                        (a) => a.id_paketuji
                    ))
            );
    }

    async getValPengujian(ev) {
        this.SampleForm.controls.discstatus.setValue(ev.disc);
        let hargadisc =
            (await ((this.getTotalNonParameter() +
                this.getTotalPaketParameter()) *
                this.SampleForm.controls.valuesstatuspengujian.value)) *
            (this.SampleForm.controls.discstatus.value / 100);
        await this.SampleForm.controls.discountsample.setValue(hargadisc);
        await this.SampleForm.controls.valuesstatuspengujian.setValue(ev.value);
    }

    async getDataTujuanPengujian() {
        await this._tujuanServ
            .getDataTujuanPengujian({ pages: 1, search: null })
            .then(
                (x) =>
                    (this.tujuanpengujian = this.tujuanpengujian.concat(
                        x["data"]
                    ))
            );
    }

    async getDataSubCatalogue() {
        await this._kontrakServ
            .getDataSubCatalogue(this.datasub)
            .then((g) => {
                this.subCatalogueData = this.subCatalogueData.concat(g["data"]);
            })
            .then(
                () =>
                    (this.subCatalogueData = global.uniq(
                        this.subCatalogueData,
                        (it) => it.id_sub_catalogue
                    ))
            );
    }

    async getValPrice(ev) {
        this.pricenonpaket = await ev.id;
        this.loadbuttonnonparameter =
            (await this.SampleForm.controls.parameteruji.value) &&
            this.SampleForm.controls.formathasil.value &&
            this.pricenonpaket
                ? false
                : true;
    }

    formattanggaledit(v) {
        let val = new Date(v);
        return {
            date: val.getDate(),
            month: val.getMonth(),
            year: val.getFullYear(),
        };
    }

    async infoparameter(v) {
        let dialogCust = await this._dialog.open(InfoParamComponent, {
            height: "auto",
            width: "400px",
            data: this.SampleForm.controls.nonpaketparameter["controls"][v]
                .value,
        });
        await dialogCust.afterClosed().subscribe(async (result) => {
            console.log(result);
        });
    }

    async setDatatoForm(v) {
        await this._subcatalogServ
            .getDataSubcatalogueDetail(v.subcatalogue)
            .then((g) => {
                this.subCatalogueData = this.subCatalogueData.concat(g);
            });
        this.SampleForm = await this.createSampleForm();
        let tgl_input = await this.formattanggaledit(v.tgl_input);
        let tgl_selesai = (await v.tgl_selesai)
            ? this.formattanggaledit(v.tgl_selesai)
            : null;
        let tgl_produksi = (await v.tgl_produksi)
            ? this.formattanggaledit(v.tgl_produksi)
            : null;
        let tgl_kadaluarsa = (await v.tgl_kadaluarsa)
            ? this.formattanggaledit(v.tgl_kadaluarsa)
            : null;

        setTimeout(async () => {
            let setvalue = await this.statuspengujian.filter(
                (g) => g.id == v.statuspengujian
            );
            this.loading = await false;
            await this.SampleForm.patchValue({
                id: v.id ? v.id : null,
                kodesample: v.kodesample,
                tujuanpengujian: v.tujuanpengujian,
                statuspengujian: v.statuspengujian,
                subcatalogue: v.subcatalogue,
                tgl_input: _moment([
                    tgl_input.year,
                    tgl_input.month,
                    tgl_input.date,
                ]),
                tgl_selesai: tgl_selesai
                    ? _moment([
                          tgl_selesai.year,
                          tgl_selesai.month,
                          tgl_selesai.date,
                      ])
                    : null,
                tgl_produksi: v.tgl_produksi
                    ? _moment([
                          tgl_produksi.year,
                          tgl_produksi.month,
                          tgl_produksi.date,
                      ])
                    : null,
                tgl_kadaluarsa: v.tgl_kadaluarsa
                    ? _moment([
                          tgl_kadaluarsa.year,
                          tgl_kadaluarsa.month,
                          tgl_kadaluarsa.date,
                      ])
                    : null,
                factoryname: v.factoryname,
                factory_address: v.factory_address,
                trademark: v.trademark,
                lotno: v.lotno,
                jeniskemasan: v.jeniskemasan,
                batchno: v.batchno,
                ket_lain: v.ket_lain,
                no_notifikasi: v.no_notifikasi,
                no_pengajuan: v.no_pengajuan,
                no_registrasi: v.no_registrasi,
                no_principalCode: v.no_principalCode,
                certificate_info: v.certificate_info
                    ? v.certificate_info.toString()
                    : null,
                formathasil: v.formathasil,
                parameteruji: v.parameteruji,
                discount_nonpacket: 0,
                price: [null],
                paketparametername: v.paketparametername,
                discount_paket: v.discount_paket,
                paketPkm: v.paketPkm,
                discount_paketpkm: 0,
                discountsample: v.discountsample ? v.discountsample : 0,
                totalpricesample: v.totalpricesample,
                valuesstatuspengujian: setvalue[0].value,
            });
            this.SampleForm.controls.discstatus.setValue(
                (v.discountsample / v.price) * 100
            );
            if (v.nonpaketparameter.length > 0) {
                await v.nonpaketparameter.forEach((np) => {
                    if (np.parameteruji) {
                        let rubah = {
                            id: np.id ? np.id : null,
                            checked: false,
                            discount: np.disc_parameter ? np.disc_parameter : 0,
                            formathasil: np.format_hasil,
                            id_lab: np.id_lab,
                            id_parameter_uji: np.id_parameteruji,
                            id_price: np.info_id,
                            lab: np.lab.nama_lab,
                            parametertype: np.parameteruji.parametertype.name,
                            parameteruji_code: np.parameteruji.parameter_code,
                            parameteruji_name: np.parameteruji.name_id,
                            price: np.price_normal ? np.price_normal : np.price,
                            id_for: np.idfor,
                        };
                        this.nonpaketparameter.push(this.fb.group(rubah));
                    } else {
                        let rubah = {
                            id: np.id ? np.id : null,
                            checked: false,
                            discount: np.disc_parameter ? np.disc_parameter : 0,
                            formathasil: np.format_hasil ? np.format_hasil : np.formathasil,
                            id_lab: np.id_lab,
                            id_parameter_uji: np.id_parameteruji ? np.id_parameteruji : np.id_parameter_uji,
                            id_price: np.info_id ? np.info_id : np.id_price,
                            lab: np.lab?.nama_lab ? np.lab.nama_lab : np.lab,
                            parametertype: np.parametertype ? np.parametertype : np.parameteruji.parametertype.name,
                            parameteruji_code: np.parameteruji ? np.parameteruji.parameter_code : np.parameteruji_code,
                            parameteruji_name: np.parameteruji ? np.parameteruji.name_id : np.parameteruji_name,
                            price: np.price_normal ? np.price_normal : np.price,
                            id_for: np.idfor ? np.idfor : np.id_for,
                        };
                        this.nonpaketparameter.push(this.fb.group(rubah));
                        
                    }
                });
            }
            if (v.paketparameter.length > 0) {
                if (v.paketparameter[0]["info"]) {
                    let pisahid = await global.uniq(
                        v.paketparameter,
                        (it) => it.idfor
                    );
                    await pisahid.forEach((val) => {
                        this.paketparameter_temporary =
                            this.paketparameter_temporary.concat({
                                checked: false,
                                discount: val["disc_parameter"],
                                id_for: val["idfor"],
                                id_paketuji: val["info_id"],
                                kode_paketuji: val["info"].split(" - ")[0],
                                nama_paketuji: val["info"].split(" - ")[1],
                                price: val["price"],
                                paketparameter: v.paketparameter.filter(
                                    (cc) =>
                                        cc.idfor   == val["idfor"] &&
                                        cc.info_id == val["info_id"]
                                ),
                            });
                    });
                } else {
                    v.paketparameter.forEach((pp) => {
                        this.paketparameter_temporary =
                            this.paketparameter_temporary.concat({
                                checked: false,
                                discount: pp["disc_parameter"] ? pp["disc_parameter"] : pp['discount'],
                                id_for: pp["idfor"] ? pp['idfor'] : pp['id_for'],
                                id_paketuji: pp["info_id"] ? pp['info_id'] : pp['id_paketuji'],
                                kode_paketuji: pp["info"] ? pp["info"].split(" - ")[0] : pp['kode_paketuji'],
                                nama_paketuji: pp["info"] ? pp['info'].split(" - ")[1] : pp['nama_paketuji'],
                                price: pp["price_normal"] ? pp['price_normal'] : pp['price'],
                                paketparameter: pp['paketparameter'] ? pp['paketparameter'] : v.paketparameter.filter(
                                    (cc) =>
                                        cc.idfor   == pp["idfor"] &&
                                        cc.info_id == pp["info_id"]
                                ),
                            });
                    });
                }
            }

            if (v.paketPKM.length > 0) {
                if (v.paketPKM[0]["info"]) {
                    let pisahidpkm = await global.uniq(
                        v.paketPKM,
                        (it) => it.idfor
                    );
                    await pisahidpkm.forEach((x) => {
                        let pisahsubpkm = global
                            .uniq(v.paketPKM, (it) => it.info_id)
                            .map((i) => i["info_id"]);
                        this.paketpkm_temporary =
                            this.paketpkm_temporary.concat({
                                checked: false,
                                discount: x["disc_parameter"]
                                    ? x["disc_parameter"]
                                    : 0,
                                id_for: x["idfor"],
                                id_paketpkm: x["id_paketpkm"],
                                nama_paketpkm: x["info"].split(" - ")[1],
                                kode_paketpkm: x["info"].split(" - ")[0],
                                price: null,
                                subpackage: [],
                            });
                        this._paketPkmServ
                            .getDataDetailpaketpkmBySub({ data: pisahsubpkm })
                            .then((h) => {
                                let format = [];
                                format = format.concat(h);
                                let indexTag =
                                    this.paketpkm_temporary.findIndex(
                                        (h) => h.id_for == x["idfor"]
                                    );
                                this.paketpkm_temporary[indexTag]["price"] =
                                    format
                                        .filter(
                                            (b) =>
                                                b.mstr_specific_package_id ==
                                                parseInt(
                                                    this.paketpkm_temporary[
                                                        indexTag
                                                    ]["id_paketpkm"]
                                                )
                                        )
                                        .map((harga) => harga.price)
                                        .reduce((a, b) => a + b);
                                this.paketpkm_temporary[indexTag][
                                    "subpackage"
                                ] = this.paketpkm_temporary[indexTag][
                                    "subpackage"
                                ].concat(
                                    format.filter(
                                        (b) =>
                                            b.mstr_specific_package_id ==
                                            parseInt(
                                                this.paketpkm_temporary[
                                                    indexTag
                                                ]["id_paketpkm"]
                                            )
                                    )
                                );
                            });
                    });
                } else {
                    v.paketPKM.forEach((pkm) => {
                        pkm.subpackage = pkm.subpackage.map(a => ({...a, price: a.price_normal ? a.price_normal : a.price}));
                        pkm.price = pkm.subpackage.map(a => a.price).reduce((a,b) => a + b);
                        console.log(pkm);
                        this.paketpkm_temporary =
                            this.paketpkm_temporary.concat(pkm);
                    });
                }
            }
            this.MatTableNonPaket.renderRows();
        }, 1000);
    }

    sortData(index) {
        let az = false;
        this.buatsort = this.buatsort + 1;
        if (this.buatsort % 2 == 0) {
            az = true;
        } else {
            az = false;
        }
        this.paketparameter_temporary[index].paketparameter.sort((a, b) => {
            return this.compare(
                a.parameteruji[0].name_id,
                b.parameteruji[0].name_id,
                az
            );
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    createSampleForm() {
        return this.fb.group({
            id: [null],
            tujuanpengujian: [1],
            statuspengujian: [null],
            valuesstatuspengujian: [null],
            subcatalogue: [null],
            tgl_input: [
                _moment([
                    this.datenow.getFullYear(),
                    this.datenow.getMonth(),
                    this.datenow.getDate(),
                ]),
            ],
            kodesample: [null],
            tgl_selesai: [null],
            ket_lain: [null],
            tgl_produksi: [null],
            tgl_kadaluarsa: [null],
            factoryname: [null],
            factory_address: [null],
            trademark: [null],
            lotno: [null],
            jeniskemasan: [null],
            batchno: [null],
            no_notifikasi: [null],
            no_pengajuan: [null],
            no_registrasi: [null],
            no_principalCode: [null],
            certificate_info: ["0"],
            formathasil: 1,
            parameteruji: [null],
            discount_nonpacket: [
                {
                    value: 0,
                    disabled: true,
                },
            ],
            price: [null],
            paketparametername: [null],
            discount_paket: [
                {
                    value: 0,
                    disabled: true,
                },
            ],
            paketPkm: [null],
            discount_paketpkm: [
                {
                    value: 0,
                    disabled: true,
                },
            ],
            nonpaketparameter: this.nonpaketparameter,
            paketparameter: this.paketparameter,
            paketPKM: this.paketPKM,
            totalpricesample: [null],
            discountsample: [0],
            discstatus: [0],
        });
    }

    async checkAllnonpaket(row, index?) {
        this.deletenonpaketparameter = [];
        if (row !== "all") {
            let checkindex = this.nonpaketparameter.controls.findIndex(
                (rr) => rr.value.id_for == row.value.id_for
            );
            this.deletenonpaketparameter.push(
                this.nonpaketparameter.controls[checkindex]
            );
            this.nonpaketparameter.removeAt(checkindex);
            this.openSnackBarNonPaket(
                row,
                checkindex,
                "Parameter Deleted",
                "Undo"
            );
            this.MatTableNonPaket.renderRows();
        } else {
            let data = this.nonpaketparameter.controls
                .filter((g) => g.value.id)
                .map((b) => b.value);
            if (data.length > 0) {
                this._kontrakServ
                    .deleteParameter(data)
                    .then((x) => console.log(x));
            }
            this.nonpaketparameter.controls = [];
            this.MatTableNonPaket.renderRows();
        }
        this.onSearchChange(this.SampleForm.controls.discstatus.value);
    }

    openSnackBarNonPaket(row, checkindex, message: string, action: string) {
        let a = this._snackBar.open(message, action, { duration: 3000 });

        a.onAction().subscribe(() => {
            this.nonpaketparameter.controls.splice(
                checkindex,
                0,
                this.deletenonpaketparameter[0]
            );
            this.MatTableNonPaket.renderRows();
        });

        a.afterDismissed().subscribe(() => {
            if (row.value.id) {
                let data = [];
                data.push(row.value);
                this._kontrakServ
                    .deleteParameter(data)
                    .then((c) => console.log(c));
            }
        });
    }

    formatDatefromMoment(v) {
        let year = v[0] ? v[0] : v["year"];
        let month = v[1] ? v[1] + 1 : v["month"] + 1;
        let date = v[2] ? v[2] : v["date"];
        let format = `${year}-${this.addZero(month)}-${this.addZero(date)}`;
        return format;
    }

    setdatetostring() {
        this.SampleForm.controls.tgl_input.setValue(
            _moment(this.SampleForm.controls.tgl_input.value).format(
                "YYYY-MM-DD"
            )
        );
        this.SampleForm.controls.tgl_selesai.setValue(
            _moment(this.SampleForm.controls.tgl_selesai.value).format(
                "YYYY-MM-DD"
            )
        );
        if (this.SampleForm.controls.tgl_produksi.value) {
            this.SampleForm.controls.tgl_produksi.setValue(
                _moment(this.SampleForm.controls.tgl_produksi.value).format(
                    "YYYY-MM-DD"
                )
            );
        }
        if (this.SampleForm.controls.tgl_kadaluarsa.value) {
            this.SampleForm.controls.tgl_kadaluarsa.setValue(
                _moment(this.SampleForm.controls.tgl_kadaluarsa.value).format(
                    "YYYY-MM-DD"
                )
            );
        }
    }

    async setForm(val) {
        if (val == "save") {
            await this.setdatetostring();
        }

        await this.SampleForm.controls.totalpricesample.setValue(
            this.getTotalBiayaSample()
        );

        await this.SampleForm.controls.price.setValue(
            this.getTotalPricesample()
        );

        if (this.paketparameter_temporary.length > 0) {
            await this.paketparameter_temporary.forEach((x) => {
                this.paketparameter.push(
                    this.fb.group({
                        checked: [x.checked],
                        discount: [x.discount],
                        id_for: [x.id_for],
                        id_paketuji: [x.id_paketuji],
                        kode_paketuji: [x.kode_paketuji],
                        nama_paketuji: [x.nama_paketuji],
                        price: [x.price],
                        paketparameter: this.fb.array(x.paketparameter),
                    })
                );
            });
        }
        if (this.paketpkm_temporary.length > 0) {
            await this.paketpkm_temporary.forEach((y) => {
                this.paketPKM.push(
                    this.fb.group({
                        checked: [y.checked],
                        discount: [y.discount],
                        id_for: [y.id_for],
                        id_paketpkm: [y.id_paketpkm],
                        nama_paketpkm: [y.nama_paketpkm],
                        price: [y.price],
                        subpackage: this.fb.array(y.subpackage),
                    })
                );
            });
        }
        this.MatTableNonPaket.renderRows();

        let paketpkmkenad =
            this.SampleForm.value.paketPKM.filter((r) => r.discount == 1)
                .length > 0
                ? this.SampleForm.value.paketPKM
                      .filter((r) => r.discount == 1)
                      .map((ao) =>
                          ao.subpackage
                              .map(
                                  (a) =>
                                      a.price *
                                      parseInt(
                                          this.SampleForm.controls
                                              .valuesstatuspengujian.value
                                      )
                              )
                              .reduce((z, j) => z + j)
                      )
                      .reduce((a, b) => a + b)
                : 0;
        let paketparamd =
            this.SampleForm.value.paketparameter.filter((r) => r.discount == 1)
                .length > 0
                ? this.SampleForm.value.paketparameter
                      .filter((r) => r.discount == 1)
                      .map(
                          (ao) =>
                              ao.price *
                              parseInt(
                                  this.SampleForm.controls.valuesstatuspengujian
                                      .value
                              )
                      )
                      .reduce((a, b) => a + b)
                : 0;

        let nonpaketkenadisc =
            this.SampleForm.value.nonpaketparameter.length > 0
                ? this.SampleForm.value.nonpaketparameter
                      .map((ap) => ap.price)
                      .reduce((a, b) => a + b)
                : 0;
        let paketparameterkenadisc =
            this.SampleForm.value.paketparameter.length > 0 ? paketparamd : 0;
        let paketPKMkenadisc =
            this.SampleForm.value.paketPKM.length > 0 ? paketpkmkenad : 0;

        let totalkenadisc =
            nonpaketkenadisc + paketparameterkenadisc + paketPKMkenadisc;

        await this.dialogRef.close({
            b: "close",
            c: this.SampleForm.value,
            d: totalkenadisc,
        });
    }

    async toggleParameter(ev) {
        if (ev == "save") {
            this.swalyousure(
                `total price of this sample is ${this.getTotalBiayaSample().toLocaleString()}`
            ).then(async (result) => {
                if (result.value) {
                    // if (this.SampleForm.controls.statuspengujian.value) {
                    if (this.datasampleinfo) {
                        if (this.getTotalPricesample() > 0) {
                            await this.setForm("save");
                        } else {
                            global.swalerror("Harga sample tidak boleh 0");
                        }
                        // } else {
                        //     global.swalerror(
                        //         "Status pengujian dan matriks harus diisi"
                        //     );
                        // }
                    } else {
                        if (
                            this.SampleForm.controls.statuspengujian.value ==
                                null ||
                            this.SampleForm.controls.subcatalogue.value ==
                                null ||
                            this.SampleForm.controls.tgl_selesai.value == null
                        ) {
                            await this.swalerror(
                                "Please fill form Correctly !"
                            );
                        } else {
                            await this.setForm("save");
                        }
                    }
                } else {
                    await Swal.fire("Cancelled", "Your Data is Safe", "error");
                }
            });
        } else {
            await this.setForm("cancel");
        }
    }

    checkcheck(ev, paketindex, e) {
        this.paketparameter_temporary[paketindex].paketparameter[e].checked = ev
            ? true
            : false;
    }

    // checkallparent(ev, row, index?){
    //     this.paketparameter_temporary.filter()
    // }

    async checkAll(ev, row, paketindex, index?) {
        if (row == "all") {
            for (
                let t = 0;
                t <
                this.paketparameter_temporary[paketindex].paketparameter.length;
                t++
            ) {
                this.checkcheck(ev, paketindex, t);
            }
        } else {
            this.checkcheck(ev, paketindex, index);
        }
        this.deletepaketdisabled =
            this.paketparameter_temporary[paketindex].filter((x) => x.checked)
                .length > 0
                ? false
                : true;
    }

    async checkAllpkm(ev, row, index) {
        if (ev) {
            this.paketpkm_temporary[index].checked = await true;
        } else {
            this.paketpkm_temporary[index].checked = await false;
        }
        this.deletepaketdisabled =
            this.paketpkm_temporary.filter((x) => x.checked).length > 0
                ? false
                : true;
    }

    getpricepaketpkm(v) {
        return v["subspecific"]
            ? v["subspecific"]
                  .map((price) => price.price)
                  .reduce((a, b) => a + b, 0)
            : v["subpackage"]
                  .map((price) => price.price)
                  .reduce((a, b) => a + b, 0);
    }

    tambahpaketpkm() {
        if (this.SampleForm.controls.statuspengujian.value) {
            this._paketPkmServ
                .getDataDetailpaketpkm(this.SampleForm.controls.paketPkm.value)
                .then((x) => {
                    let price_normal = this.getpricepaketpkm(x);
                    this.paketpkm_temporary = this.paketpkm_temporary.concat({
                        checked: false,
                        id_for: this.paketpkm_temporary.length + 1,
                        id_paketpkm: x["id"],
                        kode_paketpkm: x["package_code"],
                        nama_paketpkm: x["package_name"],
                        discount: x["disc"],
                        price: price_normal,
                        subpackage: x["subspecific"],
                    });
                    this.onSearchChange(
                        this.SampleForm.controls.discstatus.value
                    );
                    // let hargadisc =
                    //     ((this.getTotalNonParameter() +
                    //         this.getTotalPaketParameter()) *
                    //         this.SampleForm.controls.valuesstatuspengujian
                    //             .value) *
                    //     (this.SampleForm.controls.discstatus.value / 100);
                    // this.SampleForm.controls.discountsample.setValue(hargadisc);
                });
        } else {
            global.swalerror("Harap isi Status Pengujian Terlebih dahulu");
        }
    }

    onSearchChange(ev) {
        let a = this.paketparameter_temporary.filter((x) => x.discount > 0);
        let b = this.paketpkm_temporary.filter((x) => x.discount > 0);
        let pricepkm = 0;

        if (b.length > 0) {
            let pricesub = [];

            b.forEach((bc) => {
                pricesub = pricesub.concat(bc.subpackage.map((h) => h.price));
            });
            console.log(pricesub);
            pricepkm = pricesub.reduce((o, i) => o + i);
        }

        let paketparameterprice =
            a.length > 0 ? a.map((g) => g.price).reduce((a, i) => a + i) : 0;

        let hargadisc =
            (this.getTotalNonParameter() + paketparameterprice + pricepkm) *
            parseInt(this.SampleForm.controls.valuesstatuspengujian.value) *
            (parseInt(ev) / 100);

        this.SampleForm.controls.discountsample.setValue(hargadisc);
    }

    async tambahpaket() {
        if (
            this.SampleForm.controls.statuspengujian.value ||
            this.SampleForm.controls.paketparametername.value
        ) {
            await this._paketParameterServ
                .getDataDetailPaketparameter(
                    this.SampleForm.controls.paketparametername.value
                )
                .then(async (x) => {
                    this.paketparameter_temporary =
                        await this.paketparameter_temporary.concat({
                            checked: false,
                            id_for: this.paketparameter_temporary.length + 1,
                            id_paketuji: x["id"],
                            kode_paketuji: x["kode_paketuji"],
                            nama_paketuji: x["nama_paketuji"],
                            discount: x["discount"],
                            price: x["price"],
                            id_price: this.pricenonpaket,
                            paketparameter: x["paketparameter"],
                        });
                });
        } else {
            await global.swalerror(
                "Harap isi Status Pengujian / Pilih Paket Terlebih dahulu"
            );
        }
        this.onSearchChange(this.SampleForm.controls.discstatus.value);
    }

    async tambahpaket2() {
        if (
            this.SampleForm.controls.statuspengujian.value &&
            this.SampleForm.controls.paketparametername.value
        ) {
            let dialogCust = await this._dialog.open(
                ModalPaketParameterComponent,
                {
                    height: "auto",
                    width: "800px",
                    data: this.SampleForm.controls.paketparametername.value,
                    disableClose: true,
                }
            );
            await dialogCust.afterClosed().subscribe(async (result) => {
                if (result) {
                    await this._paketParameterServ
                        .getDataDetailPaketparameter(
                            this.SampleForm.controls.paketparametername.value
                        )
                        .then(async (x) => {
                            this.paketparameter_temporary =
                                await this.paketparameter_temporary.concat({
                                    checked: false,
                                    id_for:
                                        this.paketparameter_temporary.length +
                                        1,
                                    id_paketuji: x["id"],
                                    kode_paketuji: x["kode_paketuji"],
                                    nama_paketuji: x["nama_paketuji"],
                                    discount: x["discount"],
                                    price: x["price"],
                                    id_price: this.pricenonpaket,
                                    paketparameter: result,
                                });
                        });
                    await this.onSearchChange(
                        this.SampleForm.controls["discstatus"].value
                    );
                }
            });
        }
    }

    async getValformatHasil(e) {
        this.loadbuttonnonparameter =
            (await this.SampleForm.controls.parameteruji.value) &&
            this.SampleForm.controls.formathasil.value &&
            this.pricenonpaket
                ? false
                : true;
    }

    deletepaket(index, row?) {
        // console.log(this.paketparameter_temporary);
        this.deleterowpaketparameterall = [];
        if (row) {
            let set = this.paketparameter_temporary.filter(
                (g) => g.id_for == row.id_for
            );
            this.deleterowpaketparameterall = set;

            let checkinfo = set
                .map((x) => x.paketparameter)[0]
                .filter((i) => i.info_id);

            this.paketparameter_temporary =
                this.paketparameter_temporary.filter(
                    (x) => x.id_for !== row.id_for
                );
            this.openSnackBarAllpaket(
                index,
                checkinfo,
                "Package Deleted",
                "Undo"
            );
        } else {
            let set = this.paketparameter_temporary
                .filter((x) => x.checked)
                .map((x) => x.paketparameter);
            let checkinfo = set[0].filter((i) => i.info_id);
            if (checkinfo.length > 0) {
                this._kontrakServ
                    .deleteParameter(checkinfo)
                    .then((c) => console.log(c));
            }
            this.paketparameter_temporary =
                this.paketparameter_temporary.filter((x) => !x.checked);
        }
        this.onSearchChange(this.SampleForm.controls.discstatus.value);
    }

    deletepaketpkm(index, row?) {
        this.deleterowpaketpkm = [];
        if (row) {
            console.log(row);
            this.deleterowpaketpkm.push(
                this.paketparameter_temporary.filter(
                    (x) => x.id_for !== row.id_for
                )[0]
            );
            this.paketpkm_temporary = this.paketpkm_temporary.filter(
                (x) => x.id_for !== row.id_for
            );
            // this.openSnackBarPaketPKm(index,"Paket PKM Deleted","Undo");
        } else {
            this.paketpkm_temporary = this.paketpkm_temporary.filter(
                (x) => !x.checked
            );
        }
        this.onSearchChange(this.SampleForm.controls.discstatus.value);
    }

    openSnackBarPaketPKm(i, index, message: string, action: string) {
        let a = this._snackBar.open(message, action, { duration: 3000 });

        a.onAction().subscribe(() => {
            this.paketpkm_temporary[i].subpackage.splice(
                index,
                0,
                this.deleterowpaketpkm[0]
            );
            this.paketpkm_temporary[i].price = this.getpricepaketpkm(
                this.paketpkm_temporary[i]
            );
            a.dismiss();
        });

        a.afterDismissed().subscribe(() => {
            this.paketpkm_temporary[i].price = this.getpricepaketpkm(
                this.paketpkm_temporary[i]
            );
            this.deleterowpaketpkm = [];
        });
    }

    deletepaketdetailfunc(row, index) {
        this.deleterowpaketparameter = [];
        this.paketparameter_temporary.forEach((v, i) => {
            if (v.id_for == row.id_for) {
                let checkinfo = v.paketparameter.filter((iv) => iv.info_id);
                // console.log(checkinfo[index]);

                this.deleterowpaketparameter.push(
                    this.paketparameter_temporary[i].paketparameter[index]
                );

                this.paketparameter_temporary[i].paketparameter.splice(
                    index,
                    1
                );
                this.openSnackBar(
                    checkinfo,
                    i,
                    index,
                    "Parameter Deleted",
                    "Undo"
                );
            } else {
                return;
            }
        });
        this.onSearchChange(this.SampleForm.controls.discstatus.value);
    }

    openSnackBar(checkinfo, i, index, message: string, action: string) {
        let a = this._snackBar.open(message, action, { duration: 3000 });

        a.onAction().subscribe(() => {
            this.paketparameter_temporary[i].paketparameter.splice(
                index,
                0,
                this.deleterowpaketparameter[0]
            );
            a.dismiss();
        });

        a.afterDismissed().subscribe(() => {
            if (checkinfo.length > 0) {
                let data = [];
                data.push(checkinfo[index]);
                this._kontrakServ
                    .deleteParameter(data)
                    .then((c) => console.log(c));
            }
        });
    }

    openSnackBarAllpaket(index, checkinfo, message: string, action: string) {
        let a = this._snackBar.open(message, action, { duration: 3000 });

        a.onAction().subscribe(() => {
            this.paketparameter_temporary.splice(
                index,
                0,
                this.deleterowpaketparameterall[0]
            );
            a.dismiss();
        });

        a.afterDismissed().subscribe(() => {
            if (checkinfo.length > 0) {
                this._kontrakServ
                    .deleteParameter(checkinfo)
                    .then((c) => console.log(c));
            }
        });
    }

    deletepaketpkmdetailfunc(row, index) {
        this.paketpkm_temporary.forEach((v, i) => {
            if (v.id_for == row.id_for) {
                this.deleterowpaketpkm.push(
                    this.paketpkm_temporary[i].subpackage[index]
                );
                this.paketpkm_temporary[i].subpackage.splice(index, 1);
                this.openSnackBarPaketPKm(
                    i,
                    index,
                    "Paket PKM deleted",
                    "Undo"
                );
                this.paketpkm_temporary[i].price = this.getpricepaketpkm(
                    this.paketpkm_temporary[i]
                );
            } else {
                return;
            }
        });
        this.onSearchChange(this.SampleForm.controls.discstatus.value);
    }

    tambahnonpaket() {
        this.loadbuttonnonparameter = true;
        if (this.SampleForm.controls.statuspengujian.value) {
            this._parameterujiServ
                .getDataParameterUjiDetail(
                    this.SampleForm.controls.parameteruji.value
                )
                .then(async (x) => {
                    let price_normal =
                        this.SampleForm.controls.price.value -
                        (this.SampleForm.controls.discount_nonpacket.value /
                            100) *
                            this.SampleForm.controls.price.value;
                    let price_kali2 =
                        this.SampleForm.controls.price.value * 2 -
                        (this.SampleForm.controls.discount_nonpacket.value /
                            100) *
                            (this.SampleForm.controls.price.value * 2);
                    let data = await [];
                    data = await data.concat({
                        id_for: this.nonpaketparameter.length + 1,
                        id_parameter_uji: x["id"],
                        parameteruji_code: x["parameter_code"],
                        parameteruji_name: x["name_id"],
                        parametertype: x["parametertype"]["name"],
                        formathasil: this.SampleForm.controls.formathasil.value,
                        price:
                            this.SampleForm.controls.formathasil.value === 3
                                ? price_kali2
                                : price_normal,
                        discount:
                            this.SampleForm.controls.discount_nonpacket.value,
                        lab: x["lab"]["nama_lab"],
                        id_lab: x["lab"]["id"],
                        id_price: this.pricenonpaket,
                    });

                    await this.addFormParameter(data[0]);

                    await this.SampleForm.controls.parameteruji.setValue(null);
                    await this.SampleForm.controls.price.setValue(null);
                    await this.SampleForm.controls.discount_nonpacket.setValue(
                        0
                    );
                    this.dataParameterPrice = await [];
                    await this.onSearchChange(
                        this.SampleForm.controls.discstatus.value
                    );
                    this.loadbuttonnonparameter = await false;
                });
        } else {
            global
                .swalerror("Harap isi Status Pengujian Terlebih dahulu")
                .then((e) => (this.loadbuttonnonparameter = false));
        }
    }

    addFormPaketParameter(d) {
        const paketFormat = this.fb.group({
            checked: [false],
            id_for: [d.id_for],
            id_paketuji: [d.id_paketuji],
            id_parameteruji: [d.id_parameteruji],
            kode_paketuji: [d.kode_paketuji],
            nama_paketuji: [d.nama_paketuji],
            discount: [d.discount],
            price: [d.price],
            parameteruji_name: [d.parameteruji_name],
            parameteruji_code: [d.parameteruji_code],
            id_standart: [d.id_standart],
            kode_standart: [d.kode_standart],
            nama_standart: [d.nama_standart],
            id_lod: [d.id_lod],
            kode_lod: [d.kode_lod],
            nama_lod: [d.nama_lod],
            id_unit: [d.id_unit],
            kode_unit: [d.kode_unit],
            nama_unit: [d.nama_unit],
            id_metode: [d.id_metode],
            kode_metode: [d.kode_metode],
            metode: [d.metode],
            id_lab: [d.id_lab],
            kode_lab: [d.kode_lab],
            nama_lab: [d.nama_lab],
        });
        this.paketparameter.push(paketFormat);
    }

    addEvent(e, v) {
        console.log({ a: e, b: v });
    }

    addFormParameter(d) {
        const parameterFormat = this.fb.group({
            checked: [false],
            id_parameter_uji: [d.id_parameter_uji],
            parameteruji_code: [d.parameteruji_code],
            parameteruji_name: [d.parameteruji_name],
            parametertype: [d.parametertype],
            formathasil: [d.formathasil],
            price: [d.price],
            discount: [d.discount],
            lab: [d.lab],
            id_price: [d.id_price],
            id_lab: [d.id_lab],
            id_for: [d.id_for],
        });
        this.nonpaketparameter.push(parameterFormat);
        this.MatTableNonPaket.renderRows();
        this.loadbuttonnonparameter = false;
    }

    getTotalNonParameter() {
        return this.nonpaketparameter.controls
            .map((j) => j.value.price)
            .reduce((a, b) => a + b, 0);
    }
    getTotalPaketParameter() {
        this.paketbedaasendiri = this.paketparameter_temporary.filter((e) =>
            this.anehsendiriu.includes(e.id_paketuji)
        );
        return this.paketparameter_temporary
            .filter((e) => !this.anehsendiriu.includes(e.id_paketuji))
            .map((x) => x.price)
            .reduce((a, b) => a + b, 0);
    }
    getTotalPaketPkm() {
        return this.paketpkm_temporary
            .map((x) => x.price)
            .reduce((a, b) => a + b, 0);
    }

    getTotalPricesample() {
        let pengkalibedasendiri =
            this.SampleForm.controls.statuspengujian.value == 1
                ? 1
                : this.SampleForm.controls.statuspengujian.value == 2
                ? 1.5
                : 2;

        let ii = this.paketbedaasendiri
            .map((p) => p.price * pengkalibedasendiri)
            .reduce((ae, ab) => ae + ab, 0);

        return (
            (this.getTotalNonParameter() +
                this.getTotalPaketParameter() +
                this.getTotalPaketPkm()) *
                this.SampleForm.controls.valuesstatuspengujian.value +
            ii
        );
    }

    setDiscount() {}

    getTotalBiayaSample() {
        return (
            this.getTotalPricesample() -
            parseInt(this.SampleForm.controls.discountsample.value)
        );
    }

    deletenonpaket() {
        let check = Object.keys(
            this.nonpaketparameter.controls.filter((ff) => ff.value["checked"])
        );
        for (let u = 0; u < check.length; u++) {
            this.nonpaketparameter.removeAt(parseInt(check[u]));
        }
        this.MatTableNonPaket.renderRows();
        this.onSearchChange(this.SampleForm.controls.discstatus.value);
    }

    setvaluecheck(event, index) {
        if (event) {
            this.nonpaketparameter.controls[index]["controls"].checked.setValue(
                true
            );
        } else {
            this.nonpaketparameter.controls[index]["controls"].checked.setValue(
                false
            );
        }
    }

    getDataParameter() {
        this._kontrakServ
            .getDataParameterContract(this.dataselectParameter)
            .then((parameteruji) => {
                this.dataParameter = this.dataParameter.concat(
                    parameteruji["data"]
                );
            })
            .then(
                () =>
                    (this.dataParameter = global.uniq(
                        this.dataParameter,
                        (it) => it.id
                    ))
            );
    }

    getdataPaketuji() {
        this._kontrakServ
            .getDataPaketUjiContract(this.dataselectPaketParameter)
            .then((paketparameter) => {
                this.dataPaketuji = this.dataPaketuji.concat(
                    paketparameter["data"]
                );
            })
            .then(
                () =>
                    (this.dataPaketuji = global.uniq(
                        this.dataPaketuji,
                        (it) => it.id
                    ))
            );
    }

    getdataPaketPKM() {
        this._kontrakServ
            .getDataPaketPKMContract(this.dataselectPaketPKM)
            .then((paketparameter) => {
                this.dataPaketPKM = this.dataPaketPKM.concat(
                    paketparameter["data"]
                );
            })
            .then(
                () =>
                    (this.dataPaketPKM = global.uniq(
                        this.dataPaketPKM,
                        (it) => it.mstr_specific_package_id
                    ))
            );
    }

    OnScrollEnd(e) {
        // this.loading = true;
        // if (e === "paketPKM") {
        //     this.dataselectPaketPKM.page = this.dataselectPaketPKM.page + 1;
        //     this.getdataPaketPKM();
        // }
        if (e === "parameteruji") {
            this.dataselectParameter.page = this.dataselectParameter.page + 1;
            this.getDataParameter();
        } else if (e === "paketparameter") {
            this.dataselectPaketParameter.page =
                this.dataselectPaketParameter.page + 1;
            this.getdataPaketuji();
        } else if (e === "subcatalogue") {
            this.datasub.page = this.datasub.page + 1;
            this.getDataSubCatalogue();
        }
        // setTimeout(() => {
        //     this.loading = false;
        // }, 200);
    }

    async getValParameter(v) {
        if (this.SampleForm.controls.statuspengujian.value) {
            this.dataParameterPrice = await [];
            await this._kontrakServ.getDataPrice(v.id).then((x) => {
                this.dataParameterPrice = this.dataParameterPrice.concat(x);
            });
        } else {
            await this.SampleForm.controls.parameteruji.setValue(null);
            await global.swalerror(
                "Harap isi status pengujian terlebih dahulu !!"
            );
        }
        this.loadbuttonnonparameter =
            (await this.SampleForm.controls.parameteruji.value) &&
            this.SampleForm.controls.formathasil.value &&
            this.pricenonpaket
                ? false
                : true;
    }

    async getValPaketPKM(v) {
        console.log(v);
    }

    getValPaketuji(ev) {
        console.log(ev);
    }

    onSearchPaketPKM(ev) {
        this.dataselectPaketPKM.search = ev.term;
        this.dataselectPaketPKM.page = 1;
        this.dataPaketPKM = [];
        this.getdataPaketPKM();
    }

    onSearchPaketParameter(ev) {
        this.dataselectPaketParameter.search = ev.term;
        this.dataselectPaketParameter.page = 1;
        this.dataPaketuji = [];
        this.getdataPaketuji();
    }

    onSearchParameter(ev) {
        this.dataselectParameter.search = ev.term;
        this.dataselectParameter.page = 1;
        this.dataParameter = [];
        this.getDataParameter();
    }

    onSearchi(ev, identifier) {
        if (identifier === "subcatalogue") {
            this.datasub.search = ev.term;
            this.datasub.page = 1;
            this.subCatalogueData = [];
            this.getDataSubCatalogue();
        }
    }

    resetAll(ev) {
        if (ev === "subcatalogue") {
            this.datasub.search = null;
            this.datasub.page = 1;
            this.subCatalogueData = [];
            this.getDataSubCatalogue();
        }
    }

    clearSelect(v) {
        if (v === "parameteruji") {
            this.dataselectParameter.search = null;
            this.dataselectParameter.page = 1;
            this.dataParameter = [];
            this.getDataParameter();
        } else if (v === "paketparameter") {
            this.dataselectPaketParameter.search = null;
            this.dataselectPaketParameter.page = 1;
            this.dataPaketuji = [];
            this.getdataPaketuji();
        } else if (v === "paketPKM") {
            this.dataselectPaketPKM.search = null;
            this.dataselectPaketPKM.page = 1;
            this.dataPaketPKM = [];
            this.getdataPaketPKM();
        }
    }

    async getValSubCatalogue(ev) {
        await this.SampleForm.controls.subcatalogue.setValue(
            ev.id_sub_catalogue
        );
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

    swalsuccess(text) {
        return Swal.fire({
            icon: "success",
            title: "Success",
            text: text,
        });
    }

    closeSelect(v) {
        this.clearSelect(v);
    }

    addZero(r) {
        return r < 9 ? `0${r}` : r;
    }
}
