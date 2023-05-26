import {
    Component,
    OnInit,
    Inject,
    Optional,
    ChangeDetectorRef,
} from "@angular/core";
import { TujuanpengujianService } from "../../services/tujuanpengujian/tujuanpengujian.service";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { NgxSpinnerService } from "ngx-spinner";
import * as _moment from "moment";
import * as global from "app/main/global";
import {
    statuspengujian,
    dataformathasil,
    dataselectparameter,
    setprice,
    formSample,
    isImportantForm,
} from "../data";
import { ModalPaketParameterComponent } from "app/main/analystpro/revision-contract/modal-paket-parameter/modal-paket-parameter.component";
import { ParameterujiService } from "app/main/analystpro/master/parameteruji/parameteruji.service";
import { PaketparameterService } from "app/main/analystpro/master/paketparameter/paketparameter.service";
import { PaketPkmService } from "app/main/analystpro/master/paket-pkm/paket-pkm.service";
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
    selector: "app-modal-parameter-revision",
    templateUrl: "./modal-parameter-revision.component.html",
    styleUrls: ["./modal-parameter-revision.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class ModalParameterRevisionComponent implements OnInit {
    // array
    tujuanpengujian = [];
    dataParameter = [];
    subCatalogueData = [];
    dataParameterPrice = [];
    dataPaketuji = [];
    dataPaketPKM = [];

    loading = true;

    //import data
    dataFormatHasil = dataformathasil;
    statuspengujiandata = statuspengujian;
    dsp = dataselectparameter;
    dataselectPaketParameter = {
        page: 1,
        search: null,
    };
    temporary = {
        nonpaket: [],
        paketparameter: [],
        paketpkm: [],
    };
    buttononpaket = false;
    pkmval;

    // json
    np = {
        price: null,
        parameteruji: null,
        formathasil: "Simplo",
    };

    datasub = {
        page: 1,
        id_catalogue: null,
        search: null,
    };
    pp = {
        paketuji: null,
    };
    formSample = formSample;
    paketpkmhead = [];
    dataselectPaketPKM = {
        page: 1,
        search: null,
    };
    // bool
    check = 1;
    checkpkm = 1;
    ready: boolean = false;
    disabledPackageDelete = true;
    disabledPackageDeletePkm = true;

    isImportantForm = isImportantForm;

    constructor(
        private _tujuanServ: TujuanpengujianService,
        @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalParameterRevisionComponent>,
        private _kontrakServ: ContractService,
        private dialog: MatDialog,
        private _paketParamServ: PaketparameterService,
        private _parameterujiServ: ParameterujiService,
        private _paketpkmServ: PaketPkmService,
        private changeDetectorRefs: ChangeDetectorRef,
        private _spinnerServ: NgxSpinnerService
    ) {
        if (data) {
            if (data.mou.length > 0) {
                this.setPriceMou(data);
            }
            if (data.detail) {
                this.formSample = data.detail;
                this.ready = true;
                this.loading = false;
            } else {
                if (data.idsample !== "add") {
                    this.getDataSampleOnly(data.idsample, data.index);
                    this.formSample = formSample;
                } else {
                    this.formSample = this.resetForm();
                    this.formSample.tgl_input = _moment(new Date());
                    this.ready = true;
                    this.loading = false;
                }
            }
        }
        this.dialogRef.backdropClick().subscribe((v) => {
            this.close();
        });
    }

    ngOnInit(): void {
        this.getDataTujuanPengujian();
        this.getDataSubCatalogue();
        this.getDataParameter();
        this.getdataPaketuji();
        this.getdataPaketPKM();
    }

    async setPriceMou(v) {
        await v.mou.forEach((e) => {
            this.statuspengujiandata.filter(
                (r) => r.id === e.id_status_pengujian
            )[0].value = e.values;
            this.statuspengujiandata.filter(
                (r) => r.id === e.id_status_pengujian
            )[0].disc = e.discount;
        });
    }

    async convertingdisc(v) {
        let paketpkmkenadisc = await this.formSample.paketparameter.filter(
            (er) => er.disc > 0
        );
        let paketparameterkenadisc =
            await this.formSample.paketparameter.filter(
                (er) => er.discount > 0
            );
        let paketparametersum =
            (await paketparameterkenadisc.length) > 0
                ? paketparameterkenadisc
                      .map((a) => a.price)
                      .reduce((e, c) => e + c)
                : 0;
        let paketpkmsubsum =
            (await paketpkmkenadisc.length) > 0
                ? paketpkmkenadisc
                      .map((p) => p.subpackage)
                      .map((a) => a.price)
                      .reduce((u, m) => u + m)
                : 0;
        let nonpaketsum =
            (await this.formSample.nonpaket.length) > 0
                ? this.formSample.nonpaket
                      .map((c) => c.price)
                      .reduce((i, o) => i + o)
                : 0;

        let totalharga =
            (await paketparametersum) + paketpkmsubsum + nonpaketsum;

        let totalhargadisc = (await (v / 100)) * totalharga;

        this.formSample.discount_sample = await totalhargadisc;
    }

    nonpaketConvert(v) {
        return v.map((v, i) => ({
            idfor: i + 1,
            id_parameteruji: v.id_parameteruji,
            parametercode: v.parameteruji.parameter_code,
            parametername: v.parameteruji.name_id,
            parametertype: v.parameteruji.parametertype.name,
            formathasil: v.format_hasil,
            price_original: v.format_hasil === "Triplo" ? v.price * 2 : v.price,
            price:
                v.format_hasil === "Triplo"
                    ? v.price *
                      this.statuspengujiandata.filter(
                          (c) => c.id === this.formSample.statuspengujian
                      )[0].value *
                      2
                    : v.price *
                      this.statuspengujiandata.filter(
                          (c) => c.id === this.formSample.statuspengujian
                      )[0].value,
            id_lab: v.lab.id_lab,
            nama_lab: v.lab.nama_lab,
            id_price: v.info_id,
        }));
    }

    paketpkmConv(v) {
        return v.map((z) => {
            return {
                desc: z.desc,
                detail_specific: z.detail_specific,
                id: z.id,
                mstr_specific_package_id: z.mstr_specific_package_id,
                perka: z.perka,
                jumlah: z.jumlah,
                priceoriginal: z.price,
                price:
                    z.price *
                    this.statuspengujiandata.filter(
                        (e) => e.id === this.formSample.statuspengujian
                    )[0].value,
                subpackage_name: z.subpackage_name,
            };
        });
    }

    async getDataSampleOnly(v, index) {
        await this._kontrakServ
            .getsampleOnly(v)
            .then((x) => this.setData(x, index));
        await this._kontrakServ
            .getParameterPerSample(v)
            .then(async (o: any) => {
                this.formSample.nonpaket = await o.filter((g) => g.status == 2);

                let ii = await this.nonpaketConvert(this.formSample.nonpaket);

                this.formSample.nonpaket = await global.uniq(
                    ii,
                    (t) => t.idfor
                );

                let zz = await global.uniq(
                    o.filter((v) => v.status == 4),
                    (i) => i.idfor
                );

                for (let xxz = 0; xxz < zz.length; xxz++) {
                    await this.formatpackagePKM(o, zz[xxz]);
                    let k = await global.uniq(
                        o.filter((et) => et.status == 4),
                        (az) => az.info_id
                    );
                    this.formSample.paketpkm[xxz].subpackage = await [];
                    await this._paketpkmServ
                        .getDataDetailpaketpkm(this.formSample.paketpkm[xxz].id)
                        .then((e) => {
                            k.forEach((ac) => {
                                let jk = e["subspecific"].filter(
                                    (er) => er.id == ac["info_id"]
                                );

                                let jz = this.paketpkmConv(jk);

                                this.formSample.paketpkm[xxz].subpackage =
                                    this.formSample.paketpkm[
                                        xxz
                                    ].subpackage.concat(jz);
                            });
                        });
                }

                let xx = await global.uniq(
                    o.filter((g) => g.status == 1),
                    (r) => r.idfor
                );

                for (let i = 0; i < xx.length; i++) {
                    await this.formatpackageParameter(o, xx[i]);
                }

                this.formSample.paketparameter =
                    await this.formSample.paketparameter.sort(
                        (a, b) => a.id - b.id
                    );

                // this.formSample.paketpkm = await o.filter((g) => g.status == 4);
            })
            .then(() => (this.ready = true))
            .then(() => this.convertingdisc(this.formSample.discount_conv))
            .then(() => (this.loading = false));
    }

    getSubpackagePrice(v) {
        return v.subpackage.length > 0
            ? v.subpackage.map((ap) => ap.price).reduce((e, c) => e + c)
            : 0;
    }

    getTotalPaketPkm() {
        var price = [];
        this.formSample.paketpkm.forEach((ac) => {
            price = price.concat(
                ac.subpackage.length > 0
                    ? ac.subpackage
                          .map((ap) => ap.price)
                          .reduce((e, c) => e + c)
                    : 0
            );
        });
        return this.formSample.paketpkm.length > 0
            ? price.reduce((a, b) => a + b)
            : 0;
    }

    setTotal() {
        return (
            this.getTotalNonPaket() +
            this.getTotalPaketParameter() +
            this.getTotalPaketPkm()
        );
    }

    async formatpackagePKM(o, v) {
        let a = await {
            data: [],
        };
        a.data = a.data.concat(v.info_id);
        await this._paketpkmServ
            .getDataDetailpaketpkmBySub(a)
            .then((x: any) => {
                this.formSample.paketpkm.push({
                    checked: false,
                    id: x[0].mstr_specific_package_id,
                    packagename: x[0].pkmpackage.package_name,
                    packagecode: x[0].pkmpackage.package_code,
                    disc: x[0]["pkmpackage"].disc,
                    subpackage: global
                        .uniq(
                            o.filter((e) => e.status === 4 && e.idfor == 1),
                            (iu) => iu.info_id
                        )
                        .map((ap) => {
                            return {
                                id: ap["info_id"],
                                subpackage_name: x[0]["subpackage_name"],
                                price:
                                    parseInt(x[0]["price"]) *
                                    this.statuspengujiandata.filter(
                                        (e) =>
                                            e.id ==
                                            this.formSample.statuspengujian
                                    )[0].value,
                                priceoriginal: parseInt(x[0]["price"]),
                                jumlah: x[0]["jumlah"],
                            };
                        }),
                });
            });
    }

    async getValPengujian(ev) {
        this.formSample.nonpaket = await this.formSample.nonpaket.map((a) => ({
            ...a,
            price:
                a.price_original *
                this.statuspengujiandata.filter((e) => e.id === ev.id)[0].value,
        }));

        this.formSample.paketparameter =
            await this.formSample.paketparameter.map((h) => ({
                ...h,
                price:
                    h.priceoriginal *
                    this.statuspengujiandata.filter((e) => e.id === ev.id)[0]
                        .value,
            }));

        this.formSample.paketpkm = this.formSample.paketpkm.map((p) => ({
            ...p,
            subpackage: p.subpackage.map((av) => ({
                ...av,
                price:
                    av.priceoriginal *
                    this.statuspengujiandata.filter((e) => e.id === ev.id)[0]
                        .value,
            })),
        }));

        this.formSample.discount_conv = await this.statuspengujiandata.filter(
            (l) => l.id === this.formSample.statuspengujian
        )[0].disc;
        await this.convertingdisc(this.formSample.discount_conv);
    }

    async checkedPackage(ev, value, index) {
        this.formSample.paketparameter[index].checked = await ev;
        this.disabledPackageDelete =
            (await this.formSample.paketparameter.filter((e) => e.checked)
                .length) > 0
                ? false
                : true;
        await this.convertingdisc(
            this.formSample.discount_conv ? this.formSample.discount_conv : 0
        );
    }

    tambahpaketpkm() {
        if (this.formSample.statuspengujian) {
            this._paketpkmServ
                .getDataDetailpaketpkm(this.pkmval)
                .then((x) => {
                    this.formSample.paketpkm = this.formSample.paketpkm.concat({
                        checked: false,
                        id: this.formSample.paketpkm.length + 1,
                        pkm_id: x,
                        id_paketpkm: x["id"],
                        packagename: x["package_name"],
                        packagecode: x["package_code"],
                        disc: x["disc"],
                        subpackage: x["subspecific"].map((p) => {
                            return {
                                id: p.id,
                                mstr_specific_package_id:
                                    p.mstr_specific_package_id,
                                subpackage_name: p.subpackage_name,
                                detail_specific: p.detail_specific,
                                jumlah: p.jumlah,
                                priceoriginal: p.price,
                                price:
                                    p.price *
                                    this.statuspengujiandata.filter(
                                        (e) =>
                                            e.id ===
                                            this.formSample.statuspengujian
                                    )[0].value,
                            };
                        }),
                    });
                })
                .then(() =>
                    this.convertingdisc(
                        this.formSample.discount_conv
                            ? this.formSample.discount_conv
                            : 0
                    )
                );
        } else {
            global.swalerror("Harap isi Status Pengujian Terlebih dahulu");
        }
        this.pkmval = null;
    }

    async formatpackageParameter(o, v) {
        await this._paketParamServ
            .getDataDetailPaketparameter(
                v["info_id"] ? v["info_id"] : v["id_paketuji"]
            )
            .then((ff) => {
                this.formSample.paketparameter.push({
                    id: v["idfor"]
                        ? v["idfor"]
                        : this.formSample.paketparameter.length + 1,
                    checked: false,
                    paketname: ff["nama_paketuji"],
                    paketcode: ff["kode_paketuji"],
                    priceoriginal: ff["price"],
                    price:
                        ff["price"] *
                        this.statuspengujiandata.filter(
                            (c) => c.id === this.formSample.statuspengujian
                        )[0].value,
                    discount: ff["discount"],
                    parameter: o
                        .filter((f) => {
                            if (f.idfor) {
                                return (
                                    f.idfor == v["idfor"] &&
                                    f.info_id == v["info_id"] &&
                                    f.status == 1
                                );
                            } else {
                                return f;
                            }
                        })
                        .map((z) => {
                            let g =
                                z.parameteruji.length > 0
                                    ? z.parameteruji[0]
                                    : z.parameteruji;
                            return {
                                parametername: g.name_id,
                                parametercode: g.parameter_code,
                                id_metode: z.id_metode ? z.id_metode : null,
                                idlab: z.id_lab ? z.id_lab : null,
                                idlod: z.id_lod ? z.id_lod : null,
                                idtransactionparameter: z.id,
                                id_standart: z.id_standart
                                    ? z.id_standart
                                    : null,
                                id_unit: z.id_unit ? z.id_unit : null,
                                metode: z.metode ? z.metode.metode : null,
                                lab: z.lab.nama_lab,
                                lod: z.lod ? z.lod.nama_lod : null,
                                standart: z.standart
                                    ? z.standart.nama_standart
                                    : null,
                                unit: z.unit ? z.unit.nama_unit : null,
                                id_parameteruji: z.id_parameter_uji
                                    ? z.id_parameter_uji
                                    : z.id_parameteruji,
                            };
                        }),
                });
            });
    }

    async checkAll(ev, val) {
        console.log(ev, val);
    }

    async setData(v, index) {
        console.log(v);
        this.subCatalogueData = await this.subCatalogueData.concat({
            id_sub_catalogue: v.id_subcatalogue,
            sub_catalogue_code: v.subcatalogue.sub_catalogue_code,
            sub_catalogue_name: v.subcatalogue.sub_catalogue_name,
        });

        this.formSample = await {
            index: index,
            tujuanpengujian: v.id_tujuanpengujian,
            statuspengujian: v.id_statuspengujian,
            subcatalogue: v.id_subcatalogue,
            tgl_input: v.tgl_input
                ? _moment(v.tgl_input).format("YYYY-MM-DD")
                : null,
            tgl_selesai: v.tgl_selesai
                ? _moment(v.tgl_selesai).format("YYYY-MM-DD")
                : null,
            tgl_produksi: v.tgl_produksi ? v.tgl_produksi : null,
            tgl_kadaluarsa: v.tgl_kadaluarsa ? v.tgl_kadaluarsa : null,
            factoryname: v.nama_pabrik,
            factory_address: v.alamat_pabrik,
            trademark: v.nama_dagang,
            lotno: v.lot_number,
            jeniskemasan: v.jenis_kemasan,
            batchno: v.batch_number,
            no_notifikasi: v.no_notifikasi,
            no_pengajuan: v.no_pengajuan,
            sample_name: v.sample_name,
            no_registrasi: v.no_registrasi,
            no_principalCode: v.no_principalcode,
            certificate_info: v.certificate_info.toString(),
            ket_lain: v.keterangan_lain,
            kode_sample: v.kode_sample,
            no_sample: v.no_sample,
            nonpaket: [],
            paketparameter: [],
            paketpkm: [],
            discount_sample: v.discount,
            price_sample: v.price,
            price_original:
                v.price /
                this.statuspengujiandata.filter(
                    (p) => p.id == v.id_statuspengujian
                )[0].value,
            discount_conv: this.statuspengujiandata.filter(
                (p) => p.id == v.id_statuspengujian
            )[0].disc,
        };

        this.formSample.discount_conv = await this.statuspengujiandata.filter(
            (er) => er.id === this.formSample.statuspengujian
        )[0].disc;
        this.ready = await true;
    }

    getTotalNonPaket() {
        return this.formSample.nonpaket.length > 0
            ? this.formSample.nonpaket
                  .map((j) => j.price)
                  .reduce((a, b) => a + b)
            : 0;
    }

    getTotalPaketParameter() {
        return this.formSample.paketparameter.length > 0
            ? this.formSample.paketparameter
                  .map((x) => x.price)
                  .reduce((a, b) => a + b)
            : 0;
    }

    async getDataParameter() {
        this._kontrakServ
            .getDataParameter(this.dsp)
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
            .getDataPaketUji(this.dataselectPaketParameter)
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
            .getDataPaketPKM(this.dataselectPaketPKM)
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

    async getValParameter(v) {
        this.dataParameterPrice = [];
        this._kontrakServ.getDataPrice(v.id).then((x) => {
            this.dataParameterPrice = this.dataParameterPrice.concat(x);
        });
    }

    onSearchParameter(ev, search) {
        switch (ev) {
            case "parameteruji":
                this.dsp.search = search.term;
                this.dsp.page = 1;
                this.dataParameter = [];
                this.getDataParameter();
                break;
            case "paketparameter":
                this.dataselectPaketParameter.search = search.term;
                this.dataselectPaketParameter.page = 1;
                this.dataPaketuji = [];
                this.getdataPaketuji();
                break;
        }
    }

    clearSelect(v) {
        switch (v) {
            case "parameteruji":
                this.dsp.search = null;
                this.dsp.page = 1;
                this.dataParameter = [];
                this.getDataParameter();
                break;
            case "paketparameter":
                this.dataselectPaketParameter.search = null;
                this.dataselectPaketParameter.page = 1;
                this.dataPaketuji = [];
                this.getdataPaketuji();
                break;
            case "paketPKM":
                this.dataselectPaketPKM.page = 1;
                this.dataselectPaketPKM.search = null;
                this.dataPaketPKM = [];
                this.getdataPaketPKM();
                break;
        }
    }

    getValPrice(v) {
        console.log(v);
    }

    tambahnonpaket() {
        if (this.formSample.statuspengujian) {
            this.buttononpaket = true;
            this._parameterujiServ
                .getDataParameterUjiDetail(this.np.parameteruji)
                .then((x: any) => {
                    this.formSample.nonpaket = this.formSample.nonpaket.concat({
                        idfor: this.formSample.nonpaket.length + 1,
                        id_parameteruji: x.id,
                        parametercode: x.parameter_code,
                        parametername: x.name_id,
                        parametertype: x.parametertype.name,
                        formathasil: this.np.formathasil,
                        price:
                            this.np.formathasil === "Triplo"
                                ? x.parameterprice
                                      .filter((g) => g.price == this.np.price)
                                      .map((x) => x.price[0] * 2) *
                                  this.statuspengujiandata.filter(
                                      (e) =>
                                          e.id ===
                                          this.formSample.statuspengujian
                                  )[0].value
                                : x.parameterprice
                                      .filter((g) => g.price == this.np.price)
                                      .map((x) => x.price)[0] *
                                  this.statuspengujiandata.filter(
                                      (e) =>
                                          e.id ===
                                          this.formSample.statuspengujian
                                  )[0].value,
                        price_original:
                            this.np.formathasil === "Triplo"
                                ? x.parameterprice
                                      .filter((g) => g.price == this.np.price)
                                      .map((x) => x.price[0] * 2)
                                : x.parameterprice
                                      .filter((g) => g.price == this.np.price)
                                      .map((x) => x.price)[0],
                        nama_lab: x.lab.nama_lab,
                        id_lab: x.lab.id,
                        id_price: x.parameterprice.filter(
                            (g) => g.price == this.np.price
                        )[0].id,
                    });
                })
                .then(() => {
                    this.convertingdisc(
                        this.formSample.discount_conv
                            ? this.formSample.discount_conv
                            : 0
                    );
                    this.np.parameteruji = null;
                    this.np.price = null;
                    setTimeout(() => {
                        this.buttononpaket = false;
                    }, 500);
                });
        } else {
            global.swalerror("Pilih Status Pengujian terlebih dahulu");
        }
    }

    async deleteParameterUji(index) {
        this.temporary.nonpaket = await this.temporary.nonpaket.concat(
            this.formSample.nonpaket.filter((d, m) => m == index)
        );
        this.formSample.nonpaket = await this.formSample.nonpaket.filter(
            (x, i) => i !== index
        );
        await this.convertingdisc(
            this.formSample.discount_conv ? this.formSample.discount_conv : 0
        );
    }

    async deletenonpaket() {
        this.temporary.nonpaket = await this.temporary.nonpaket.concat(
            this.formSample.nonpaket
        );
        await this.convertingdisc(
            this.formSample.discount_conv ? this.formSample.discount_conv : 0
        );
        this.formSample.nonpaket = await [];
    }

    async undoAllParameter() {
        this.formSample.nonpaket =
            (await this.temporary.nonpaket.length) > 0
                ? this.temporary.nonpaket
                : this.formSample.nonpaket;
        this.temporary.nonpaket = await [];
        await this.convertingdisc(
            this.formSample.discount_conv ? this.formSample.discount_conv : 0
        );
    }

    getValformatHasil() {
        console.log("v");
    }

    deletepaketdetailfunc(index, childindex, value) {
        if (this.formSample.paketparameter[index].parameter.length > 1) {
            this.formSample.paketparameter[index].parameter =
                this.formSample.paketparameter[index].parameter.filter(
                    (e) => e.id_parameteruji !== value.id_parameteruji
                );
        } else {
            this.formSample.paketparameter =
                this.formSample.paketparameter.filter(
                    (er) => er.id !== this.formSample.paketparameter[index].id
                );
            this.convertingdisc(
                this.formSample.discount_conv
                    ? this.formSample.discount_conv
                    : 0
            );
        }
    }

    close() {
        this.dialogRef.close(this.formSample);
    }

    async tambahpaket() {
        if (this.pp.paketuji) {
            let dialogCust = await this.dialog.open(
                ModalPaketParameterComponent,
                {
                    height: "auto",
                    width: "800px",
                    data: this.pp.paketuji,
                    disableClose: true,
                }
            );
            await dialogCust.afterClosed().subscribe(async (result) => {
                if (result.length > 0) {
                    let h = await global.uniq(result, (it) => it.id_paketuji);
                    for (let i = 0; i < h.length; i++) {
                        await this.formatpackageParameter(result, h[i]);
                    }
                    await this.convertingdisc(
                        this.formSample.discount_conv
                            ? this.formSample.discount_conv
                            : 0
                    );
                }
            });
            this.pp.paketuji = await null;
        }
    }

    async checkallpackage(v) {
        switch (v) {
            case "package":
                this.check = (await this.check) + 1;
                this.formSample.paketparameter =
                    await this.formSample.paketparameter.map((o) => ({
                        ...o,
                        checked: this.check % 2 == 0 ? true : false,
                    }));
                this.disabledPackageDelete =
                    (await this.check) % 2 == 0 ? false : true;
                break;
            case "pkm":
                this.checkpkm = (await this.checkpkm) + 1;
                this.formSample.paketpkm = await this.formSample.paketpkm.map(
                    (o) => ({
                        ...o,
                        checked: this.checkpkm % 2 == 0 ? true : false,
                    })
                );
                this.disabledPackageDeletePkm =
                    (await this.checkpkm) % 2 == 0 ? false : true;
                break;
        }
    }

    async deletepaket(value?) {
        if (value) {
            this.formSample.paketparameter =
                await this.formSample.paketparameter.filter(
                    (er) => er.id !== value.id
                );
            await this.convertingdisc(
                this.formSample.discount_conv
                    ? this.formSample.discount_conv
                    : 0
            );
        } else {
            this.formSample.paketparameter =
                await this.formSample.paketparameter.filter((e) => !e.checked);
            await this.convertingdisc(
                this.formSample.discount_conv
                    ? this.formSample.discount_conv
                    : 0
            );
        }
        this.disabledPackageDelete = await true;
    }

    async deletepaketpkmdetailfunc(row, index) {
        this.formSample.paketpkm.filter((e) => e.id == index.id)[0].subpackage =
            await this.formSample.paketpkm
                .filter((e) => e.id == index.id)[0]
                .subpackage.filter((r) => r.id !== row.id);
        await this.getTotalPaketPkm();
    }

    async savedata() {
        await global
            .swalyousure("Parameter yang terdelete akan terdelete permanent")
            .then(async (x) => {
                if (x.isConfirmed) {
                    if (
                        this.formSample.tujuanpengujian &&
                        this.formSample.statuspengujian &&
                        this.formSample.subcatalogue &&
                        this.formSample.tgl_input &&
                        this.formSample.tgl_selesai
                    ) {
                        // this.formSample.paketpkm = await this.paketpkmhead;
                        this.formSample.tgl_input = _moment(
                            this.formSample.tgl_input
                        ).format("YYYY-MM-DD");
                        this.formSample.tgl_selesai = _moment(
                            this.formSample.tgl_selesai
                        ).format("YYYY-MM-DD");
                        this.formSample.price_sample = await this.setTotal();
                        this.formSample.price_original =
                            (await this.setTotal()) /
                            this.statuspengujiandata.filter(
                                (f) => f.id === this.formSample.statuspengujian
                            )[0].value;
                        await this.dialogRef.close(this.formSample);
                    } else {
                        let innerHtml =
                            await `Ada Form yang tidak terisi&nbsp;: <br><br>`;
                        await global
                            .checknullImportant(
                                this.formSample,
                                this.isImportantForm
                            )
                            .forEach((ac) => {
                                innerHtml += `<span style="font-weight: bold">${ac}</span><br>`;
                            });
                        await global.swalerrorinnerHtml(innerHtml);
                    }
                }
            });
    }

    checkAllpkm(event, value, index) {
        this.formSample.paketpkm[index].checked = event;
        this.disabledPackageDeletePkm =
            this.formSample.paketpkm.filter((e) => e.checked).length > 0
                ? false
                : true;
    }

    async deletepaketpkm(value?) {
        if (value) {
            this.formSample.paketpkm = await this.formSample.paketpkm.filter(
                (er) => er.id !== value.id
            );
            await this.convertingdisc(
                this.formSample.discount_conv
                    ? this.formSample.discount_conv
                    : 0
            );
        } else {
            this.formSample.paketpkm = await this.formSample.paketpkm.filter(
                (e) => !e.checked
            );
            await this.convertingdisc(
                this.formSample.discount_conv
                    ? this.formSample.discount_conv
                    : 0
            );
        }
        this.disabledPackageDeletePkm = await true;
    }

    async bringback(i) {
        this.formSample.nonpaket = await this.formSample.nonpaket.concat(
            this.temporary.nonpaket.filter((g, z) => z === i)
        );
        this.temporary.nonpaket = await this.temporary.nonpaket.filter(
            (gg, uu) => uu !== i
        );
        await this.convertingdisc(
            this.formSample.discount_conv ? this.formSample.discount_conv : 0
        );
    }

    OnScrollEnd(e) {
        if (e === "subcatalogue") {
            this.datasub.page = this.datasub.page + 1;
            this.getDataSubCatalogue();
        } else if (e === "parameteruji") {
            this.dsp.page = this.dsp.page + 1;
            this.getDataParameter();
        } else if (e === "paketparameter") {
            this.dataselectPaketParameter.page =
                this.dataselectPaketParameter.page + 1;
            this.getdataPaketuji();
        } else if (e === "paketPKM") {
            this.dataselectPaketPKM.page = this.dataselectPaketPKM.page + 1;
        }
    }

    onSearchi(ev, identifier) {
        if (identifier === "subcatalogue") {
            this.datasub.search = ev.term;
            this.datasub.page = 1;
            this.subCatalogueData = [];
            this.getDataSubCatalogue();
        } else if (identifier === "paketPKM") {
            this.dataselectPaketPKM.page = 1;
            this.dataselectPaketPKM.search = ev.term;
            this.dataPaketPKM = [];
            this.getdataPaketPKM();
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

    resetForm() {
        return {
            index: null,
            tujuanpengujian: null,
            statuspengujian: null,
            subcatalogue: null,
            tgl_input: null,
            tgl_selesai: null,
            tgl_produksi: null,
            tgl_kadaluarsa: null,
            factoryname: null,
            factory_address: null,
            trademark: null,
            lotno: null,
            jeniskemasan: null,
            batchno: null,
            no_notifikasi: null,
            no_pengajuan: null,
            no_registrasi: null,
            no_principalCode: null,
            certificate_info: "0",
            ket_lain: null,
            kode_sample: null,
            no_sample: null,
            nonpaket: [],
            paketparameter: [],
            paketpkm: [],
            discount_sample: null,
            price_sample: null,
            price_original: null,
            discount_conv: null,
            sample_name: null,
        };
    }
}
