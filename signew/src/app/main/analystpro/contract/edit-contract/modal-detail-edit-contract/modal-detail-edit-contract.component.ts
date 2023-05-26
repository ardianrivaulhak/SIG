import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as _moment from "moment";
import * as global from "app/main/global";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { SubcatalogueService } from "app/main/analystpro/master/subcatalogue/subcatalogue.service";
import { TujuanpengujianService } from "app/main/analystpro/services/tujuanpengujian/tujuanpengujian.service";

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
    selector: "app-modal-detail-edit-contract",
    templateUrl: "./modal-detail-edit-contract.component.html",
    styleUrls: ["./modal-detail-edit-contract.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    encapsulation: ViewEncapsulation.None,

})
export class ModalDetailEditContractComponent implements OnInit {
  statuspengujianarray = [
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

    sampleForm: FormGroup;
    datasub = {
        page: 1,
        id_catalogue: null,
        search: null,
    };
    subCatalogueData = [];
    tujuanpengujianarray = [];
    certificateinfoarray = [
      {
          id: 1,
          name: 'Draft'
      },
      {
          id: 0,
          name: 'Release'
      }
    ];

    originalprice: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalDetailEditContractComponent>,
        private _subCatalogueServ: SubcatalogueService,
        private _formBuilder: FormBuilder,
        private _tujuanServ: TujuanpengujianService
    ) {
        if (data) {
            
            setTimeout(() => {
                this.addForm(data.sample);
            }, 1000);
        }
    }

    ngOnInit(): void {
        this.sampleForm = this.createForm();
        this.getDataSubCatalogue();
        this.getDataTujuanPengujian();
    }

    createForm(): FormGroup {
        

        return this._formBuilder.group({
            no_sample: new FormControl(),
            sample_name: new FormControl(),
            kode_sample: new FormControl(),
            tujuanpengujian: new FormControl(),
            statuspengujian: new FormControl({
                value: null
            }),
            sub_catalogue: new FormControl(),
            tgl_input: new FormControl({
                value: null,
            }),
            tgl_kadaluarsa: new FormControl(),
            tgl_produksi: new FormControl(),
            tgl_selesai: new FormControl({
                value: null,
            }),
            nama_pabrik: new FormControl(),
            alamat_pabrik: new FormControl(),
            nama_dagang: new FormControl(),
            lot_number: new FormControl(),
            jenis_kemasan: new FormControl(),
            batch_number: new FormControl(),
            no_notifikasi: new FormControl(),
            no_pengajuan: new FormControl(),
            no_registrasi: new FormControl(),
            no_principalcode: new FormControl(),
            certificate_info: new FormControl(),
            keterangan_lain: new FormControl(),
            sample_price: new FormControl()
        });
    }

    setStatusPengujian(v){
        this.sampleForm.controls.sample_price.setValue(this.originalprice * this.sampleForm.controls.statuspengujian.value);
    }

    async addForm(v) {
        console.log(v);
        this.originalprice = await v.sample_price / this.statuspengujianarray.filter(i => i.id == v.statuspengujian)[0].value;
        
        await this.getDataSubCatalogueDetail(v.sub_catalogue);
        await this.sampleForm.patchValue({
            no_sample: v.no_sample,
            sample_name: v.sample_name,
            kode_sample: v.kode_sample,
            tujuanpengujian: v.tujuanpengujian.toString(),
            statuspengujian: v.statuspengujian.toString(),
            sub_catalogue: v.sub_catalogue,
            tgl_input: _moment(v.tgl_input).format('YYYY-MM-DD'),
            tgl_kadaluarsa: v.tgl_kadaluarsa
                ? _moment(v.tgl_kadaluarsa).format('YYYY-MM-DD')
                : null,
            tgl_produksi: v.tgl_produksi ? _moment(v.tgl_produksi).format('YYYY-MM-DD') : null,
            tgl_selesai: _moment(v.tgl_selesai).format('YYYY-MM-DD'),
            nama_pabrik: v.nama_pabrik,
            alamat_pabrik: v.alamat_pabrik,
            nama_dagang: v.nama_dagang,
            lot_number: v.lot_number,
            jenis_kemasan: v.jenis_kemasan,
            batch_number: v.batch_number,
            no_notifikasi: v.no_notifikasi,
            no_pengajuan: v.no_pengajuan,
            no_registrasi: v.no_registrasi,
            no_principalcode: v.no_principalcode,
            certificate_info: v.certificate_info.toString(),
            keterangan_lain: v.keterangan_lain,
            sample_price: v.sample_price,
        });
    }

    async getDataTujuanPengujian() {
        await this._tujuanServ
            .getDataTujuanPengujian({ pages: 1, search: null })
            .then(
                (x) =>
                    (this.tujuanpengujianarray =
                        this.tujuanpengujianarray.concat(x["data"]))
            );
    }

    async getDataSubCatalogueDetail(v) {
        this._subCatalogueServ
            .getDataSubcatalogueDetail(v)
            .then(
                (x) => (this.subCatalogueData = this.subCatalogueData.concat(x))
            )
            .then(
                () =>
                    (this.subCatalogueData = global.uniq(
                        this.subCatalogueData,
                        (it) => it.id_sub_catalogue
                    ))
            );
    }

    async getDataSubCatalogue() {
        await this._subCatalogueServ
            .getDataSubcatalogue(this.datasub)
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

    onScrollToEnd(e) {
        switch (e) {
            case "subcatalogue":
                this.datasub.page = this.datasub.page + 1;
                this.getDataSubCatalogue();
                break;
        }
    }

    onSearchi(ev, status) {
        switch (status) {
            case "subcatalogue":
                this.datasub.search = ev.term;
                this.datasub.page = 1;
                this.subCatalogueData = [];
                this.getDataSubCatalogue();
                break;
        }
    }

    reset(status) {
        switch (status) {
            case "subcatalogue":
                this.subCatalogueData = [];
                this.datasub = {
                    search: null,
                    id_catalogue: null,
                    page: 1,
                };
                this.getDataSubCatalogue();
                break;
        }
    }

    async saveData() {
        this.sampleForm.controls.sample_price.setValue(this.originalprice * parseInt(this.sampleForm.controls.statuspengujian.value))
        await this.dialogRef.close(this.sampleForm.value);
    }
    close() {
        this.dialogRef.close();
    }
}
