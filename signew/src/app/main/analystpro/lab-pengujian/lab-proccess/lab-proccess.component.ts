import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Sort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import { MetodeService } from "../../master/metode/metode.service";
import { LodService } from "../../master/lod/lod.service";
import { LabService } from "../../master/lab/lab.service";
import { LabPengujianService } from "../../lab-pengujian/lab-pengujian.service";
import { GroupService } from "app/main/analystpro/services/group/group.service";
import { MatDialog } from "@angular/material/dialog";
import { ModalDateComponent } from "../../lab-pengujian/modal-date/modal-date.component";
import { ModalGalleryComponent } from "../../lab-pengujian/modal-gallery/modal-gallery.component";
import { ModalInformationComponent  } from "../modal-information/modal-information.component";
import {  ModalLateCommentComponent } from "../modal-late-comment/modal-late-comment.component";
import { DescriptionModalContractComponent } from "../../modal/description-modal-contract/description-modal-contract.component";
import * as XLSX from "xlsx";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import { UnitService } from "app/main/analystpro/master/unit/unit.service";
import { StandartService } from "app/main/analystpro/master/standart/standart.service";
import { StatuspengujianService } from "app/main/analystpro/services/statuspengujian/statuspengujian.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  Form,
} from "@angular/forms";
import { MatTable } from "@angular/material/table";
import { ContractcategoryService } from "app/main/analystpro/master/contractcategory/contractcategory.service";
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
import * as model from "../data.model";
import * as global from 'app/main/global';
import { Xliff } from "@angular/compiler";

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
  selector: 'app-lab-proccess',
  templateUrl: './lab-proccess.component.html',
  styleUrls: ['./lab-proccess.component.scss'],
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
export class LabProccessComponent implements OnInit {

  copydataparameter = []; 
    parameterForm: FormArray = this._formBuilder.array([]);
    labdataparameter: FormGroup = this._formBuilder.group({
        parameter: this.parameterForm,
    });
    datacontractcategory = [];
    dataunit = [];
    datametode = [];
    datastandart = [];
    datalod = [];
    datacontract = [];
    datasample = [];
    dataparameter = [];
    datastatuspengujian = [];

    loading = true;
    totalgetsample;
    datasent = {
        idlab: null,
        pages: 1,
        search: null,
        typeContract: null,
        approve: 1,
        parameterstatus: 1,
        contract: [],
        sample: [],
        parametertype: null,
        id_statuspengujian: null,
        parameteruji: [],
        estimasi_lab: null,
        tgl_approval: null,
        excel: null,
        hasiluji: null,
    };
    datasentContract = {
        pages: 1,
        search: null,
        contractcategory: null
    }

    datasentSample = {
        pages: 1,
        search: null,
        contract: []
    }

    datasentParameter = {
        pages: 1,
        search: null,
        sample: []
    }

    statuschecked = 0;
    loadingbutton = false;

  constructor(
    private _router: Router,
        private _menuServ: MenuService,
        private _labServ: LabService,
        private _metodeServ: MetodeService,
        private _lodServ: LodService,
        private _satuanServ: UnitService,
        private _masterServ: LabPengujianService,
        private _standartServ: StandartService,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private dialog: MatDialog,
        private _contractcategoryServ: ContractcategoryService,
        private _groupServ: GroupService,
        private _statusPengujianServ: StatuspengujianService,
        private _actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._actRoute.data.subscribe((v) => {
        this.datasent.idlab = v.idlab;
    });
    setTimeout(() => {
        this.getData();
        this.getDataUnit();
        this.getDataMetode();
        this.getDataStandart();
        this.getDataLod();
        this.getDataContractCategory();
        this.getDataContract();
        this.getDataSample();
        this.getDataParameter();
        this.getStatusPengujian();
    }, 1000);
}

checkAll(ev, row, index) {
    if (row == "all") {
        for (let i = 0; i < this.parameterForm.controls.length; i++) {
            this.setChecked(ev, i);
        }
    } else {
        this.setChecked(ev, index);
    }
    this.statuschecked = this.parameterForm.controls.filter(
        (g) => g.value.checked
    ).length;
}

setChecked(ev, i) {
    this.parameterForm.controls[i].get("checked").setValue(ev);
}

setStatusPengujian(ev) {
    this.datasent.id_statuspengujian = ev.value == "all" ? null : ev.value;
    this.datasent.pages = 1;
    this.parameterForm.controls = [];
    this.getData();
}

async getData() {
    await this._masterServ
        .getData(this.datasent)
        .then((x) => {
            this.totalgetsample = x["total"];
            x["data"].forEach((f) => {
                this.addFormData(f);
            });
        })
        .then(() => (this.loading = false));
}

getDataUnit() {
    this._satuanServ
        .getDataUnit({ status: "all" })
        .then(
            (x: any) =>
                (this.dataunit = this.dataunit.concat(
                    x.map((g) => ({
                        id_unit: g.id,
                        nama_unit: g.nama_unit,
                    }))
                ))
        );
}

getDataMetode() {
    this._metodeServ
        .getDataMetode({ status: "all" })
        .then(
            (x: any) =>
                (this.datametode = this.datametode.concat(
                    x.map((g) => ({ id_metode: g.id, metode: g.metode }))
                ))
        );
}

getDataStandart() {
    this._standartServ
        .getDataStandart({ status: "all" })
        .then(
            (x: any) =>
                (this.datastandart = this.datastandart.concat(
                    x.map((g) => ({
                        id_standart: g.id,
                        nama_standart: g.nama_standart,
                    }))
                ))
        );
}

getDataLod() {
    this._lodServ
        .getDataLod({ status: "all" })
        .then(
            (x: any) =>
                (this.datalod = this.datalod.concat(
                    x.map((g) => ({ id_lod: g.id, nama_lod: g.nama_lod }))
                ))
        );
}

setValueContract(ev) {
    this.datacontract = [];
    this.getDataContract();
    this.datasent.typeContract = this.datasentContract.contractcategory;
    this.parameterForm.controls = [];
    this.datasent.pages = 1;
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

setValContract(ev) {
    this.datasample = [];
    this.getDataSample();
    this.datasent.contract = this.datasentSample.contract;
    this.datasent.pages = 1;
    this.parameterForm.controls = [];
    this.getData();
}

setValSample(ev) {
    this.dataparameter = [];
    this.getDataParameter();
    this.datasent.sample = this.datasentParameter.sample;
    this.parameterForm.controls = [];
    this.datasent.pages = 1;
    this.getData();
}

tglEstimasiLabChange() {
    this.datasent.estimasi_lab = _moment(this.datasent.estimasi_lab).format(
        "YYYY-MM-DD"
    );
    this.parameterForm.controls = [];
    this.datasent.pages = 1;
    this.getData();
}

tglApprovalChange() {
    this.datasent.tgl_approval = _moment(this.datasent.tgl_approval).format(
        "YYYY-MM-DD"
    );
    this.parameterForm.controls = [];
    this.datasent.pages = 1;
    this.getData();
}

onScrollToEndSelect(e) {
    switch (e) {
        case "contract":
            this.datasentContract.pages = this.datasentContract.pages + 1;
            this.getDataContract();
            break;
        case "sample":
            this.datasentSample.pages = this.datasentSample.pages + 1;
            this.getDataSample();
            break;
        case "parameter":
            this.datasentParameter.pages = this.datasentParameter.pages + 1;
            this.getDataParameter();
            break;
    }
}

onsearchselect(ev, stat) {
    switch (stat) {
        case "contract":
            this.datasentContract.contractcategory = null;
            this.datasentContract.pages = 1;
            this.datasentContract.search = ev.term;
            this.datacontract = [];
            this.getDataContract();
            break;
        case "sample":
            this.datasentSample.contract = [];
            this.datasentSample.pages = 1;
            this.datasentSample.search = ev.term;
            this.datasample = [];
            this.getDataSample();
            break;
        case "parameter":
            this.datasentParameter.sample = [];
            this.datasentParameter.pages = 1;
            this.datasentParameter.search = ev.term;
            this.dataparameter = [];
            this.getDataParameter();
            break;
    }
}

getDataContract() {
    this._masterServ
        .getSelectContract(this.datasentContract)
        .then(
            (g: any) =>
                (this.datacontract = this.datacontract.concat(
                    g["data"].map((o) => ({
                        id: o.id_kontrakuji,
                        contract_no: o.contract_no,
                    }))
                ))
        )
        .then(
            () =>
                (this.datacontract = global.uniq(
                    this.datacontract,
                    (it) => it.id
                ))
        );
}

getDataSample() {
    this._masterServ
        .getSelectSample(this.datasentSample)
        .then(
            (g: any) =>
                (this.datasample = this.datasample.concat(
                    g["data"].map((o) => ({
                        id: o.id,
                        no_sample: o.no_sample,
                    }))
                ))
        )
        .then(
            () =>
                (this.datasample = global.uniq(
                    this.datasample,
                    (it) => it.id
                ))
        );
}

getDataParameter() {
    this._masterServ
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

addFormData(d) {
    const parameterFormat = this._formBuilder.group({
        checked: [d.checked == 0 ? false : true],
        catalogue_name: [
            d["transaction_sample"]["subcatalogue"]
                ? d["transaction_sample"]["subcatalogue"].sub_catalogue_name
                : "",
        ],
        contract_no: [d["transaction_sample"]["kontrakuji"].contract_no],
        duplo: [d.duplo],
        format_hasil: [d.format_hasil],
        hasiluji: [d.hasiluji],
        info: [d.info],
        inserted_at: [
            d.conditionlabproccess.length > 0 ? d.conditionlabproccess[0].inserted_at : "-",
        ],
        id_parameter: [d.id_parameteruji],
        id_kontrakuji: [
            d["transaction_sample"]["kontrakuji"].id_kontrakuji,
        ],
        id_lab: [d.id_lab],
        id_team: [
            d["parameteruji_one"].analystgroup
                ? d["parameteruji_one"].analystgroup.group_name
                : null,
        ],
        id_lod: [d.id_lod],
        id_metode: [d.id_metode],
        id_transaction_parameter: [d.id],
        id_sample: [d.id_sample],
        id_standart: [d.id_standart ? d.id_standart : null],
        id_unit: [d.id_unit ? d.id_unit : null],
        nama_standart: [d.standart ? d.standart.nama_standart : "-"],
        metode: [d.metode ? d["metode"].metode : "-"],
        nama_lab: [d.lab ? d["lab"].nama_lab : "-"],
        nama_lod: [d.lod ? d["lod"].nama_lod : "-"],
        nama_unit: [d.unit ? d["unit"].nama_unit : "-"],
        name_en: [d["parameteruji_one"].name_en],
        name_id: [d["parameteruji_one"].name_id],
        no_sample: [d["transaction_sample"].no_sample],
        parametertype_name: [d["parameteruji_one"]["parametertype"].name],
        position: [d.position ? d.position : ""],
        sample_name: [d["transaction_sample"].sample_name],
        simplo: [d.simplo],
        status_pengujian: [d["transaction_sample"]["statuspengujian"].name],
        sub_catalogue_name: [
            d["transaction_sample"]["subcatalogue"].sub_catalogue_name,
        ],
        tgl_estimasi_lab: [d["transaction_sample"].tgl_estimasi_lab],
        group: [
            d["parameteruji_one"]["analystgroup"]
                ? d["parameteruji_one"]["analystgroup"].group_name
                : "-",
        ],
        tgl_input: [d["transaction_sample"].tgl_input],
        tgl_selesai: [d["transaction_sample"].tgl_selesai],
        value_M: [this.changingvalue(d.mm)],
        value_c: [this.changingvalue(d.c)],
        value_m: [this.changingvalue(d.m)],
        triplo: [d.triplo],
    });
    this.parameterForm.push(parameterFormat);
}

changingvalue(v) {
    return v.includes("^")
        ? `${v.split("^")[0]}${v.split("^")[1].sup()}`
        : `${v}`;
}

onScroll(e) {
    this.datasent.pages = this.datasent.pages + 1;
    this.getData();
}

goToModalPhoto(v) {
    let dialogCust = this.dialog.open(ModalGalleryComponent, {
        height: "auto",
        width: "500px",
        data: {
            data: v,
        },
    });
    dialogCust.afterClosed().subscribe(async (result) => {});
}

exportExcelAnalyst() {
    let dialog = this.dialog.open(ModalDateComponent, {
        height: "auto",
        width: "500px",
        disableClose: true,
        data: {
            status: "spk",
        },
    });
    dialog.afterClosed().subscribe(async (result) => {
        if (result.status == "spk") {
            this.exportExcelSPK(result);
        }
    });
}

async exportExcelSPK(v) {
    var u = await [];
    await this._masterServ
        .getDataExcelSPK(v.date2, v.date, this.datasent.idlab)
        .then((x: any) => {
            x.forEach((data, index) => {
                u = u.concat({
                    no: index + 1,
                    no_sample: data.no_sample,
                    matriks: data.sub_catalogue_name,
                    parameteruji: data.position
                        ? `${data.name_id} - ${data.position}`
                        : data.name_id,
                    tgl_approve_prep: data.tgl_approval,
                    tgl_estimasi_lab: data.tgl_estimasi_lab,
                    keterangan_prep: data.prep_desc ? data.prep_desc : "-",
                    keterangan_kendali: data.kendali_desc
                        ? data.kendali_desc
                        : "-",
                    nama_sample: data.sample_name,
                    metode: data.metode,
                });
            });
        });
    const fileName = await `Data For Analyst ${v.date}.xlsx`;
    const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(u);
    const wb: XLSX.WorkBook = await XLSX.utils.book_new();
    await XLSX.utils.book_append_sheet(wb, ws, `Data ${v.date}`);
    await XLSX.writeFile(wb, fileName);
}
// approveLab() {
//     this.loadingbutton = true;
//     let i = this.parameterForm.controls
//         .filter((x) => x.value.checked)
//         .map((h) => ({
//             id_transaction_parameter: h.value.id_transaction_parameter,
//         }));

//     this._masterServ.approveDataLab(i).then((j) => console.log(j));
// }

}
