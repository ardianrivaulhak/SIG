import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    Output,
    EventEmitter,
    AfterViewInit,
    ElementRef,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Sort } from "@angular/material/sort";
import { MetodeService } from "../../master/metode/metode.service";
import { LodService } from "../../master/lod/lod.service";
import { LabService } from "../../master/lab/lab.service";
import { LabPengujianService } from "../../lab-pengujian/lab-pengujian.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ModalDateComponent } from "../../lab-pengujian/modal-date/modal-date.component";
import { ModalGalleryComponent } from "../../lab-pengujian/modal-gallery/modal-gallery.component";
import { ModalInformationComponent } from "../modal-information/modal-information.component";
import { ModalLateCommentComponent } from "../modal-late-comment/modal-late-comment.component";
import { DescriptionModalContractComponent } from "../../modal/description-modal-contract/description-modal-contract.component";
import * as XLSX from "xlsx";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import { UnitService } from "app/main/analystpro/master/unit/unit.service";
import { StandartService } from "app/main/analystpro/master/standart/standart.service";
import { StatuspengujianService } from "app/main/analystpro/services/statuspengujian/statuspengujian.service";
import { MemokendaliprepComponent } from "../memokendaliprep/memokendaliprep.component";
import { ComplainService } from "app/main/analystpro/complain/complain.service";
import { GetSampleComponentComponent } from "../get-sample-component/get-sample-component.component";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    FormArray,
    Form,
} from "@angular/forms";
import { LabApprovalService } from "app/main/analystpro/lab-approval/lab-approval.service";
import { ContractcategoryService } from "app/main/analystpro/master/contractcategory/contractcategory.service";
import { MessagingService } from "app/messaging.service";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MatDatepickerInputEvent,
    MatCalendarCellCssClasses,
} from "@angular/material/datepicker";
import { ModalDateLabapproveComponent } from "../../lab-approval/modal-date-labapprove/modal-date-labapprove.component";

import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { NgxSpinnerService } from "ngx-spinner";
import { AngularFireMessaging } from "@angular/fire/messaging";
import * as _moment from "moment";
import * as model from "../data.model";
import * as global from "app/main/global";
import { BehaviorSubject, Subject } from "rxjs";

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
    selector: "app-lab-pengujian",
    templateUrl: "./lab-pengujian.component.html",
    styleUrls: ["./lab-pengujian.component.scss"],
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
export class LabPengujianComponent implements OnInit {
    @ViewChild("_fileInput") InputVariable: ElementRef;

    copydataparameter = [];
    parameterForm: FormArray = this._formBuilder.array([]);
    labdataparameter: FormGroup = this._formBuilder.group({
        parameter: this.parameterForm,
    });
    total;
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
    totalgetsample = null;
    datasent: any = {
        idlab: null,
        pages: 1,
        search: null,
        typeContract: null,
        approve: 0,
        parameterstatus: 1,
        contract: [],
        sample: [],
        rev: "all",
        parametertype: null,
        id_statuspengujian: null,
        parameteruji: [],
        estimasi_lab: null,
        tgl_approval: null,
        excel: null,
        hasiluji: null,
        id_parameteruji: null,
    };
    datasentContract = {
        pages: 1,
        search: null,
        contractcategory: null,
    };

    datasentSample = {
        pages: 1,
        search: null,
        contract: [],
    };

    datasentParameter = {
        pages: 1,
        search: null,
        sample: [],
    };

    statuschecked = 0;
    loadingbutton = false;
    message: string;
    searchinput;
    fbmessage = new Subject();

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
        private _spinner: NgxSpinnerService,
        private _formBuilder: FormBuilder,
        private dialog: MatDialog,
        private _complainServ: ComplainService,
        private _contractcategoryServ: ContractcategoryService,
        private _statusPengujianServ: StatuspengujianService,
        private _actRoute: ActivatedRoute,
        private _labApproveServ: LabApprovalService,
        private _fbServ: MessagingService,
        private _fbmessaging: AngularFireMessaging
    ) {
        this._actRoute.data.subscribe((v) => {
            this.datasent.idlab = v.idlab;
        });
    }

    ngOnInit(): void {
        this._spinner.show();
        this.setListenFb();
        setTimeout(() => {
            this.getData();
            this.getDataUnit();
            this.getDataMetode();
            this.getDataStandart();
            this.getDataLod();
            this.getDataContractCategory();
            this.getDataParameter();
            this.getStatusPengujian();
            this.getTotalParameter();
        }, 1000);
    }

    async setListenFb() {
        await this._fbServ.requestPermission("complain");
        await this._fbmessaging.messages.subscribe(async (payload: any) => {
            let o = await JSON.parse(payload.notification.body);
            await this._masterServ
                .getDataOnlyComplain(parseInt(o.idtechdet))
                .then((x) => {
                    this.parameterForm.controls
                        .filter((c) => c.value.idtechdet === x[0].id)[0]
                        .get("prepstatusgo")
                        .setValue(x[0].prepstatusgo);
                    this.parameterForm.controls
                        .filter((c) => c.value.idtechdet === x[0].id)[0]
                        .get("checked")
                        .setValue(x[0].checked);

                    if (parseInt(this.datasent.approve) === 4) {
                        if (x[0].prepstatusgo == 0 || x[0].prepstatusgo == 2) {
                            this.parameterForm.controls
                                .filter((c) => c.value.idtechdet === x[0].id)[0]
                                .get("checked")
                                .disable();
                        } else {
                            this.parameterForm.controls
                                .filter((c) => c.value.idtechdet === x[0].id)[0]
                                .get("checked")
                                .enable();
                        }
                    } else {
                        this.parameterForm.controls
                            .filter((c) => c.value.idtechdet === x[0].id)[0]
                            .get("checked")
                            .enable();
                    }
                })
                .then(() => console.log(this.parameterForm.value));
        });
    }

    getTotalParameter() {
        this._masterServ
            .getTotalParameter(this.datasent.idlab, this.datasent.approve)
            .then((x: any) => (this.totalgetsample = x));
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
        this._spinner.show();
        this.datasent.id_statuspengujian = ev.value == "all" ? null : ev.value;
        this.datasent.pages = 1;
        this.parameterForm.controls = [];
        this.getData();
    }

    async getData() {
        await this._masterServ
            .getData(this.datasent)
            .then((x: any) => {
                if (x.data.length > 0) {
                    x["data"].forEach((f) => {
                        this.addFormData(f);
                    });
                }
            })
            .then(() => this._spinner.hide());
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

    getDataStandart() {
        this._standartServ.getDataStandart({ status: "all" }).then(
            (x: any) =>
                (this.datastandart = this.datastandart.concat(
                    x.map((g) => ({
                        id_standart: g.id,
                        kode_standart: g.kode_standart,
                        nama_standart: g.nama_standart,
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

    setValueContract(ev) {
        this._spinner.show();
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
        let je = JSON.stringify(ev.map((g) => g.id));
        this.datasample = [];
        this.getDataSample();
        this.datasent.contract = this.datasentSample.contract;
        this.datasent.pages = 1;
        this.parameterForm.controls = [];
        this.getData();
    }

    setValParameterUji(ev) {
        this._spinner.show();
        this.parameterForm.controls = [];
        this.datasent.pages = 1;
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
        this._spinner.show();
        this.datasent.estimasi_lab = _moment(this.datasent.estimasi_lab).format(
            "YYYY-MM-DD"
        );
        this.parameterForm.controls = [];
        this.datasent.pages = 1;
        this.getData();
    }

    copydata(value, index) {
        this.copydataparameter = [];
        this.copydataparameter = this.copydataparameter.concat(value);
    }

    pasteall() {
        for (let i = 0; i < this.parameterForm.controls.length; i++) {
            this.pastedata("a", i);
        }
    }

    pastedata(v, index) {
        let d: any = this.copydataparameter[0];
        this.parameterForm.controls[index].patchValue({
            duplo: d.duplo,
            hasiluji: d.hasiluji,
            id_lod: d.id_lod,
            id_metode: d.id_metode,
            id_standart: d.id_standart,
            id_unit: d.id_unit,
            nama_standart: d.nama_standart,
            metode: d.metode,
            nama_lab: d.nama_lab,
            nama_lod: d.nama_lod,
            nama_unit: d.nama_unit,
            simplo: d.simplo,
            triplo: d.triplo,
        });
    }

    resetAllVariable() {
        this.datasent = {
            idlab: this.datasent.idlab,
            pages: 1,
            search: null,
            typeContract: null,
            approve: this.datasent.approve,
            parameterstatus: 1,
            contract: [],
            sample: [],
            rev: "all",
            parametertype: null,
            id_statuspengujian: null,
            parameteruji: [],
            estimasi_lab: null,
            tgl_approval: null,
            excel: null,
            hasiluji: null,
            id_parameteruji: null,
        };
        this.datasentContract = {
            pages: 1,
            search: null,
            contractcategory: null,
        };

        this.datasentSample = {
            pages: 1,
            search: null,
            contract: [],
        };

        this.datasentParameter = {
            pages: 1,
            search: null,
            sample: [],
        };
        this.statuschecked = 0;
        this.copydataparameter = [];
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

    checkedif(val) {
        if (parseInt(this.datasent.approve) === 4) {
            if (val.prep_status !== 2) {
                if (val.prepstatusgo == 0 || val.prepstatusgo == 2) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    returntext() {
        return this.datasent.approve == "4"
            ? "Search Complain"
            : "Search Contract / No Sample / Sample Name";
    }

    addFormData(d) {
        const parameterFormat = this._formBuilder.group({
            inserted_at: [d.inserted_at],
            checked: [
                {
                    value: d.checked == 0 ? false : true,
                    disabled: this.checkedif(d),
                },
            ],
            idtechdet: [d["id"]],
            customer: [d["customers"]],
            contract_no: [d["contract_no"]],
            prep_status: [d["prep_status"]],
            prepstatusgo: d["prepstatusgo"],
            duplo: [
                {
                    value: d.duplo,
                    disabled:
                        this.datasent.approve == 0 || this.datasent.approve == 2
                            ? true
                            : false,
                },
            ],
            format_hasil: [d.format_hasil],
            complain_result: [d.complain_result],
            complain_arresult: [d.complain_arresult],
            expectation: [
                {
                    value: d.expectation,
                    disabled: true,
                },
            ],
            complain_no: [d.complain_no],
            memo: [d.memo],
            hasiluji: [
                {
                    value: d.hasiluji,
                    disabled:
                        this.datasent.approve == 0 ||
                        this.datasent.approve == 2 ||
                        this.datasent.approve == 4
                            ? true
                            : false,
                },
            ],
            info: [d.info],
            status_contract: [d.status_contract],
            id_parameter: [d.id_parameteruji],
            id_kontrakuji: [d.id_contract],
            id_lab: [d.id_lab],
            id_lod: [d.id_lod],
            id_metode: [d.id_metode],
            id_transaction_parameter: [d.id],
            id_sample: [d.id_sample],
            id_standart: [d.id_standart ? d.id_standart : null],
            id_unit: [d.id_unit ? d.id_unit : null],
            name_id: [d["name_id"]],
            no_sample: [d["no_sample"]],
            position: [d.position ? d.position : ""],
            tujuanpengujian: [d.tujuanpengujian ? d.tujuanpengujian : ""],
            sample_name: [d["sample_name"]],
            simplo: [
                {
                    value: d.simplo,
                    disabled:
                        this.datasent.approve == 0 || this.datasent.approve == 2
                            ? true
                            : false,
                },
            ],
            status_pengujian: [d["status_pengujian"]],
            sub_catalogue_name: [d["matriks"]],
            tgl_estimasi_lab: [d["tgl_estimasi_lab"]],
            group: [d["team_name"]],
            triplo: [
                {
                    value: d.triplo,
                    disabled:
                        this.datasent.approve == 0 || this.datasent.approve == 2
                            ? true
                            : false,
                },
            ],
        });
        this.parameterForm.push(parameterFormat);
        this._spinner.hide();
    }

    goToDetailContract(v) {
        const url = this._router.serializeUrl(
            this._router.createUrlTree([`/analystpro/view-contract/${v}`])
        );

        let baseUrl = window.location.href.replace(this._router.url, "");
        window.open(baseUrl + url, "_blank");
    }

    setuji(v, i) {
        this._complainServ.setDataPrep(v.idtechdet, i).then((x) => {
            global.swalsuccess("Success", "Saving Success").then((g) => {
                if (g.isConfirmed) {
                    this._spinner.show();
                    this.datasent.rev = "all";
                    this.datasent.pages = 1;
                    this.parameterForm.controls = [];
                    this.getData();
                }
            });
        });
    }

    searching() {
        this._spinner.show();
        this.resetAllVariable();
        this.datasent.search = this.searchinput;
        this.parameterForm.controls = [];
        this.getData();
    }

    setStatusLab(ev) {
        this.datasent.approve = ev.value;
        this._spinner.show();
        this.datasent.rev = "all";
        this.datasent.pages = 1;
        this.parameterForm.controls = [];
        this.getTotalParameter();
        this.getData();
    }

    exportparameterinfo() {
        let dialogCust = this.dialog.open(ModalDateLabapproveComponent, {
            height: "auto",
            width: "600px",
        });

        dialogCust.afterClosed().subscribe(async (result) => {
            if (result) {
                this.exportAcceptedParameter(result);
            }
        });
    }

    async exportAcceptedParameter(v) {
        await this._spinner.show();
        let a: any = await [];
        await this._labApproveServ
            .getDataParameterInfo(v, this.datasent.idlab)
            .then((x: any) => {
                x.forEach((g, index) => {
                    a = a.concat({
                        no: index + 1,
                        contract_no: g.contract_no,
                        customer: g.customer_name,
                        nama_lab: g.nama_lab,
                        no_sample: g.no_sample,
                        parameter_name: g.name_id,
                        status: g.status_pengujian,
                        tgl_buat_kontrak: g.tgl_input,
                        tgl_selesai: g.tgl_selesai,
                        approve_man_lab:
                            g.conditionlabdone.length > 0
                                ? g.conditionlabdone[0].inserted_at
                                : "-",
                        user_approve:
                            g.conditionlabdone.length > 0
                                ? g.conditionlabdone[0].user.employee_name
                                : "-",
                    });
                });
            });

        const filename = await `parameterinfo-from-${v.from}-to-${v.to}.xlsx`;

        const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(a);
        const wb: XLSX.WorkBook = await XLSX.utils.book_new();

        await XLSX.utils.book_append_sheet(wb, ws, a[0].contract_no);
        await XLSX.writeFile(wb, filename);

        await this._spinner.hide();
    }

    setStatusContract(v) {
        this._spinner.show();
        this.datasent.rev = v.value;
        this.datasent.pages = 1;
        this.parameterForm.controls = [];
        this.getData();
    }

    changingvalue(v) {
        return v.includes("^")
            ? `${v.split("^")[0]}${v.split("^")[1].sup()}`
            : `${v}`;
    }

    info(value, index) {
        let dialogCust = this.dialog.open(ModalInformationComponent, {
            height: "auto",
            width: "500px",
            data: {
                infotransaction: value,
            },
        });
        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    onScroll(e) {
        this.datasent.pages = this.datasent.pages + 1;
        this.getData();
    }

    saveData() {
        var checkapprovecome = this.parameterForm.controls
            .filter(
                (z) =>
                    z.value.checked && !z.value.labdone && !z.value.labproccess
            )
            .map((b) => b.value);
        var checkapprovedone = this.parameterForm.controls
            .filter((z) => z.value.checked && z.value.labdone)
            .map((b) => b.value);
        var checkapproveprocess = this.parameterForm.controls
            .filter((z) => z.value.checked && z.value.labproccess)
            .map((b) => b.value);
        if (checkapproveprocess.length > 0 || checkapprovedone.length > 0) {
            let checkinghasil = this.parameterForm.controls
                .filter((z) => !z.value.hasiluji)
                .map((b) => b.value);
            if (checkinghasil.length > 0) {
                global.swalerror(
                    "Data Belum Lengkap Di isi, Harap isi Terlebih Dahulu"
                );
            } else {
                this.actionSave();
            }
        } else if (checkapprovecome.length > 0) {
            this.actionSave();
        }
    }

    actionSave() {
        global
            .swalyousure(
                "Are you Sure Saving " +
                    this.parameterForm.controls.filter((x) => x.value.checked)
                        .length +
                    " Parameter"
            )
            .then((x) => {
                if (x.isConfirmed) {
                    // console.log(this.parameterForm.value)
                    this._spinner.show();
                    let v =
                        this.datasent.approve < 4
                            ? this._masterServ.addDataLab(
                                  this.parameterForm.controls
                                      .filter((x) => x.value.checked)
                                      .map((h) => h.value)
                              )
                            : this._complainServ.saveDataParamQC(
                                  this.parameterForm.controls
                                      .filter((x) => x.value.checked)
                                      .map((h) => h.value)
                              );

                    v.then(async (j) => {
                        await this.resetAllVariable();
                        await global.swalsuccess(
                            "Successs",
                            "Saving " +
                                this.parameterForm.controls.filter(
                                    (x) => x.value.checked
                                ).length +
                                " Parameter"
                        );
                        this.parameterForm.controls = await [];
                        await this.getData();
                    })
                        .then(() => this._spinner.hide())
                        .catch((e) =>
                            global.swalerror(
                                "Data Not Saved, Please Contact IT"
                            )
                        );
                } else {
                    global.swalsuccess("Canceled", "Data Has not Changed");
                }
            });
    }

    openMemo(v) {
        let dialogCust = this.dialog.open(GetSampleComponentComponent, {
            height: "auto",
            width: "500px",
            data: v,
        });
        dialogCust.afterClosed().subscribe(async (result) => {
            this.parameterForm.controls = await [];
            await this.getData();
        });
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

    exportExcelAnalyst(val) {
        let dialog = this.dialog.open(ModalDateComponent, {
            height: "auto",
            width: "700px",
            data: {
                status: val,
                idlab: this.datasent.idlab,
            },
        });
        dialog.afterClosed().subscribe(async (result) => {
            if (result.status == "spk") {
                if (result.date) {
                    if (this.datasent.approve == 4) {
                        this.exportExcelSPKcomplain(result);
                    } else {
                        this.exportExcelSPK(result);
                    }
                }
            } else if (result.status === "formathasil") {
                if (result.date) {
                    if (this.datasent.approve == 4) {
                        this.exportformathasilcomplain(result);
                    } else {
                        this.exportformathasil(result);
                    }
                }
            } else {
                if (this.datasent.approve == 4) {
                    this.exportFormatHasilwithComplain(result);
                } else {
                    this.exportFormatHasilwithContract(result);
                }
            }
        });
    }

    async exportFormatHasilwithComplain(v) {
        console.log("b");
    }

    async exportformathasilcomplain(v) {
        this._complainServ
            .dataRecapDownload(
                {
                    from: v.date,
                    to: v.date2,
                },
                this.datasent.idlab
            )
            .then(async (x: any) => {
                const filename =
                    await `Complain Date ${v.date}-${v.date2}.xlsx`;

                const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(x);
                const wb: XLSX.WorkBook = await XLSX.utils.book_new();

                await XLSX.utils.book_append_sheet(wb, ws, `DATA`);

                await XLSX.writeFile(wb, filename);
            });
    }

    async exportExcelSPKcomplain(data) {
        await this._spinner.show();
        await this._complainServ
            .getDataExcelComplain({ id: this.datasent.idlab, data: data })
            .then(async (x: any) => {
                console.log(x);
            });
    }

    async exportFormatHasilwithContract(val) {
        await this._spinner.show();
        await this._masterServ
            .getDataExcelFromContract(this.datasent.idlab, val.contract)
            .then(async (x: any) => {
                if (x.length > 0) {
                    let a: any = await [];
                    await x.forEach((data, index) => {
                        a = a.concat({
                            no: index + 1,
                            contract_no: data.contract_no,
                            no_sample: data.no_sample,
                            matriks: data.sub_catalogue_name,
                            sample_name: data.sample_name,
                            status_pengujian: data.statuspengujian,
                            Keterangan_preparation: data.prep_memo,
                            Keterangan_kendali: data.kendali_memo,
                            estimasi_lab: data.tgl_estimasi_lab,
                            id_trans_parameter: data.id,
                            name_id: data.name_id,
                            info: data.info,
                            id_standart: data.id_standart,
                            id_lab: data.id_lab,
                            id_unit: data.id_unit,
                            id_lod: data.id_lod,
                            id_metode: data.id_metode,
                            simplo: data.simplo,
                            duplo: data.duplo,
                            triplo: data.triplo,
                            hasiluji: data.hasiluji,
                            tujuan_pengujian: data.tujuanpengujian,
                        });
                    });
                    const filename = await `${x[0].contract_no}.xlsx`;

                    const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(
                        a
                    );
                    const wb: XLSX.WorkBook = await XLSX.utils.book_new();

                    await XLSX.utils.book_append_sheet(
                        wb,
                        ws,
                        x[0].contract_no
                    );
                    await XLSX.writeFile(wb, filename);
                    await this._spinner.hide();
                } else {
                    await this._spinner.hide();
                    await global.swalerror(
                        "Error tidak ada data parameter di kontrakuji ini"
                    );
                }
            });
    }

    async exportExcelSPK(v) {
        var u: any = await [];
        await this._spinner.show();
        await this._masterServ
            .getDataExcelSPK(v.date2, v.date, this.datasent.idlab)
            .then((x: any) => {
                x.forEach((data, index) => {
                    u = u.concat({
                        no: index + 1,
                        no_sample: data.no_sample,
                        contract_no: data.contract_no,
                        matriks: data.sub_catalogue_name,
                        parameteruji: data.position
                            ? `${data.name_id} - ${data.position}`
                            : data.name_id,
                        status_uji: data.status_uji,
                        tgl_approve_prep: data.tgl_approval,
                        tgl_estimasi_lab: data.tgl_estimasi_lab,
                        keterangan_prep: data.prep_desc ? data.prep_desc : "-",
                        keterangan_kendali: data.kendali_desc
                            ? data.kendali_desc
                            : "-",
                        nama_sample: data.sample_name,
                        metode: data.metode,
                        satuan: data.nama_unit,
                        tujuan_pengujian: data.tujuanpengujian,
                    });
                });
            });
        const fileName = await `Data For Analyst ${v.date}.xlsx`;
        const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(u);
        const wb: XLSX.WorkBook = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, `Data ${v.date}`);
        await XLSX.writeFile(wb, fileName);
        await this._spinner.hide();
    }
    approveLab() {
        this.loadingbutton = true;
        let i = this.parameterForm.controls
            .filter((x) => x.value.checked)
            .map((h) => ({
                id_transaction_parameter: h.value.id_transaction_parameter,
            }));
        if (this.datasent.approve == 0) {
            this._masterServ
                .approveDataGetSample(i)
                .then((j) =>
                    j["success"]
                        ? global.swalsuccess("Success", j["message"])
                        : global.swalerror("Your Data Not Saved")
                )
                .then(() => {
                    this._spinner.show();
                    this.resetAllVariable();
                })
                .then(() => (this.parameterForm.controls = []))
                .then(() => this.getData());
        } else if (this.datasent.approve == 1) {
            this._masterServ
                .approveDataLabProccess(i)
                .then((j) =>
                    j["success"]
                        ? global.swalsuccess("Success", j["message"])
                        : global.swalerror("Your Data Not Saved")
                )
                .then(() => {
                    this._spinner.show();
                    this.resetAllVariable();
                })
                .then(() => (this.parameterForm.controls = []))
                .then(() => this.getData());
        } else if (this.datasent.approve == 4) {
            let zx = this.parameterForm.value.filter((x) => x.checked);
            this._complainServ
                .approveComplainDet(zx)
                .then((j) =>
                    j["success"]
                        ? global.swalsuccess("Success", j["message"])
                        : global.swalerror("Your Data Not Saved")
                )
                .then(() => {
                    this._spinner.show();
                    this.resetAllVariable();
                })
                .then(() => (this.parameterForm.controls = []))
                .then(() => this.getData());
        } else {
            this._masterServ
                .unapproveDataLabDone(i)
                .then((j) =>
                    j["success"]
                        ? global.swalsuccess("Success", j["message"])
                        : global.swalerror("Your Data Not Saved")
                )
                .then(() => {
                    this._spinner.show();
                    this.resetAllVariable();
                })
                .then(() => (this.parameterForm.controls = []))
                .then(() => this.getData());
        }
    }

    memo(v) {
        console.log(v);
        let dialog = this.dialog.open(MemokendaliprepComponent, {
            height: "auto",
            width: "800px",
            data: {
                id_kontrakuji: v.id_kontrakuji,
            },
        });
        dialog.afterClosed().subscribe(async (result) => {});
    }

    async memointernal(v) {
        const dialogRef = await this.dialog.open(
            DescriptionModalContractComponent,
            {
                height: "700px",
                width: "500px",
                panelClass: "parameter-modal",
                data: {
                    idcontract: v.id_kontrakuji,
                },
            }
        );
        await dialogRef.afterClosed().subscribe(async (result) => {
            console.log(result);
        });
    }

    async exportformathasil(value) {
        await this._spinner.show();
        await this._masterServ
            .getDataExcel(this.datasent.idlab, value.date, value.date2)
            .then(async (x: any) => {
                let a: any = await [];
                if (x.length > 0) {
                    await x.forEach((data, index) => {
                        a = a.concat({
                            no: index + 1,
                            contract_no: data.contract_no,
                            no_sample: data.no_sample,
                            matriks: data.sub_catalogue_name,
                            sample_name: data.sample_name,
                            status_pengujian: data.statuspengujian,
                            Keterangan_preparation: data.prep_memo,
                            Keterangan_kendali: data.kendali_memo,
                            estimasi_lab: data.tgl_estimasi_lab,
                            id_trans_parameter: data.id,
                            name_id: data.name_id,
                            info: data.info,
                            id_standart: data.id_standart,
                            id_lab: data.id_lab,
                            id_unit: data.id_unit,
                            id_lod: data.id_lod,
                            id_metode: data.id_metode,
                            simplo: data.simplo,
                            duplo: data.duplo,
                            triplo: data.triplo,
                            hasiluji: data.hasiluji,
                            tujuan_pengujian: data.tujuanpengujian,
                        });
                    });
                } else {
                    await this._spinner.hide();
                    await global.swalerror(
                        "Error tidak ada data parameter pada tgl estimasi yang di pilih"
                    );
                }
                const filename = await `${
                    value.date ? value.date : "ALLDATA(PARAMETER)"
                }.xlsx`;

                const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(a);
                const wb: XLSX.WorkBook = await XLSX.utils.book_new();

                await XLSX.utils.book_append_sheet(
                    wb,
                    ws,
                    value.date ? `Data ${value.date}` : `ALL DATA TRANSACTION`
                );

                await XLSX.writeFile(wb, filename);
                await this._spinner.hide();
            });
    }

    onRefresh() {
        this._spinner.show();
        this.parameterForm.controls = [];
        this.resetAllVariable();
        this.getData();
    }

    onFileChange(ev) {
        if (ev.target.files[0].name.includes(".xls")) {
            global
                .choosing()
                .then((o) => {
                    this._spinner.show();
                    const reader = new FileReader();
                    const file = ev.target.files[0];
                    let workBook: any = null;
                    let jsonData: any = null;
                    reader.onload = () => {
                        const data = reader.result;
                        workBook = XLSX.read(data, { type: "binary" });
                        jsonData = workBook.SheetNames.reduce(
                            (initial, name) => {
                                const sheet = workBook.Sheets[name];
                                initial[name] = XLSX.utils.sheet_to_json(sheet);
                                return initial;
                            },
                            {}
                        );
                        let firstkey = Object.keys(jsonData)[0];
                        if (this.datasent.approve !== '4') {
                            console.log(this.datasent);
                            this._masterServ
                                .importExcel(jsonData[firstkey], o.isConfirmed)
                                .then((resp: any) => {
                                    if (resp.success) {
                                        global.swalsuccess(
                                            "Success",
                                            resp.message
                                        );
                                        this.parameterForm.controls = [];
                                        this.statuschecked = 0;
                                        this.getData();
                                    } else {
                                        this._spinner.hide();
                                        global.swalerror(resp.message);
                                    }
                                });
                        } else {
                            console.log(this.datasent);
                            this._complainServ
                                .uploadFileComplain(jsonData[firstkey],o.isConfirmed)
                                .then((x: any) => {
                                    if (x.success) {
                                        global.swalsuccess(
                                            "Success",
                                            x.message
                                        );
                                        this.parameterForm.controls = [];
                                        this.statuschecked = 0;
                                        this.getData();
                                    } else {
                                        this._spinner.hide();
                                        global.swalerror(x.message);
                                    }
                                });
                        }
                    };
                    reader.readAsBinaryString(file);
                })
                .then(() => {
                    this.InputVariable.nativeElement.value = "";
                });
        } else {
            global.swalerror("File Harus Berbentuk Excel");
        }
    }
}
