import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ComplainService } from "../../complain.service";
import * as global from "app/main/global";
import { AddMoreParameterComponent } from "../modals/add-more-parameter/add-more-parameter.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-complain-qc-det",
    templateUrl: "./complain-qc-det.component.html",
    styleUrls: ["./complain-qc-det.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ComplainQcDetComponent implements OnInit {
    idComplain;
    data = [];

    datasent = {
        search: null,
        parameteruji: null,
    };
    saveenable = true;
    dataparameter = [];
    complain_no;
    est_date;
    comp_date;
    addnewparam = false;
    totalchecked = 0;
    datatemporary = [];
    deletedcan = 0;

    constructor(
        private _actRoute: ActivatedRoute,
        private _router: Router,
        private _complainServ: ComplainService,
        private _dialog: MatDialog
    ) {
        this.idComplain = this._actRoute.snapshot.params["id"];
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.getData();
            this.getDataParameterByComplain();
        });
    }

    setStatus(st) {
        let o = this.data.filter((r) => r.checked && r.status_parameter == 0);
        global.swalyousure("cant revert").then((d) => {
            if (d.isConfirmed) {
                this._complainServ
                    .setStatusComplainDet({ data: o, st: st })
                    .then((x) => {
                        global
                            .swalsuccess("success", "saving success")
                            .then((e) => {
                                if (e.isConfirmed) {
                                    this.resetCalc();
                                    this.data = [];
                                    this.getData();
                                }
                            });
                    })
                    .catch((e) => global.swalerror("Error at backend"));
            }
        });
    }

    goback(){
        this._router.navigateByUrl("analystpro/qc");
    }

    gotomodalcomplain(v) {
        let dialogCust = this._dialog.open(AddMoreParameterComponent, {
            height: "auto",
            width: "500px",
            data: this.data[v],
        });
        dialogCust.afterClosed().subscribe(async (result) => {
            if (result) {
                this.data[v] = await {
                    complain_result: result.complain_result,
                    complain_arresult: result.complain_arresult,
                    id_metode: result.id_metode,
                    id_lod: result.id_lod,
                    id_standart: result.id_standart,
                    id_unit: result.id_unit,
                    checked: this.data[v].checked,
                    id_parameteruji: this.data[v].id_parameteruji,
                    parameter: this.data[v].parameter,
                    id_transaction_parameter:
                        this.data[v].id_transaction_parameter,
                    hasiluji: this.data[v].hasiluji,
                    actual_result: this.data[v].actual_result,
                    id: this.data[v].id,
                    id_lab: this.data[v].id_lab,
                    status: this.data[v].status,
                    status_parameter: result.status_parameter,
                    nama_lab: this.data[v].nama_lab,
                    nama_unit: result.nama_unit,
                    metode: result.metode,
                    nama_standart: result.nama_standart,
                    expectation: this.data[v].expectation,
                    prepstatus: this.data[v].prepstatus,
                    status_complain: this.data[v].status_complain,
                    id_tech_det: parseInt(this.idComplain),
                    complain_desc: this.data[v].complain_desc,
                    memo: this.data[v].memo,
                    id_parameter_lhu: this.data[v].id_parameter_lhu,
                };
            }
        });
    }

    getDataParameterByComplain() {
        this._complainServ
            .getParameterByComplain(this.idComplain)
            .then((x) => (this.dataparameter = this.dataparameter.concat(x)))
            .then(
                () =>
                    (this.dataparameter = global
                        .uniq(this.dataparameter, (it) => it.id_parameteruji)
                        .map((a: any) => {
                            return {
                                id_parameteruji: a.id_parameteruji,
                                id: null,
                                name_id: a.name_id,
                                hasiluji: a.hasiluji,
                                actual_result: a.ar,
                                id_unit: a.id_unit,
                                id_lab: a.id_lab,
                                id_standart: a.id_standart,
                                id_metode: a.id_metode,
                                nama_unit: a.unit,
                                nama_lab: a.lab,
                                nama_lod: a.lod,
                                nama_standart: a.standart,
                                metode: a.metode,
                                expectation: null,
                                status: [],
                                status_parameter: 1,
                                prepstatus: null,
                                status_complain: 0,
                                id_tech_det: parseInt(this.idComplain),
                                complain_desc: null,
                                memo: null,
                                id_parameter_lhu: a.id_parameter_lhu
                            };
                        }))
            )
            .then(() => console.log(this.dataparameter));
    }

    deleteParameter() {
        this.data = this.data.filter((e) => !e.checked);
    }

    setValueSelect(ev, index) {
        console.log(this.datasent.parameteruji);
        this.datatemporary = [];
        this.datatemporary = this.datatemporary.concat({
            checked: false,
            complain_result: null,
            parameter: ev.name_id,
            status: [],
            id_transaction_parameter: ev.id_transaction_parameter,
            complain_arresult: null,
            hasiluji: ev.hasiluji,
            id_parameteruji: ev.id_parameteruji,
            actual_result: ev.actual_result,
            id: null,
            id_lab: ev.id_lab,
            id_lod: ev.id_lod,
            id_metode: ev.id_metode,
            id_standart: ev.id_standart,
            id_unit: ev.id_unit,
            status_parameter: 1,
            nama_lab: ev.nama_lab,
            nama_unit: ev.nama_unit,
            metode: ev.metode,
            expectation: null,
            prepstatus: null,
            complain_desc: null,
            status_complain: null,
            id_tech_det: parseInt(this.idComplain),
            memo: ev.memo,
            id_parameter_lhu: ev.id_parameter_lhu
        });
    }

    getData() {
        this._complainServ
            .getDataComplaindetChild(parseInt(this.idComplain))
            .then((x) => {
                console.log(x);
                this.data = this.data.concat(x);
                (this.complain_no = x[0].complain_tech.complain_no),
                    (this.est_date = x[0].complain_tech.estimate_date);
                this.comp_date = x[0].complain_tech.complain_date;
            })
            .then(
                () =>
                    (this.data = global
                        .uniq(this.data, (it) => it.id)
                        .map((a: any) => {
                            return {
                                checked: false,
                                complain_result: a.complain_result,
                                status: a.status,
                                parameter: a.parameteruji.name_id,
                                complain_arresult: a.complain_arresult,
                                id_parameteruji: a.id_parameteruji,
                                hasiluji: a.hasiluji,
                                actual_result: a.ar,
                                complain_desc: a.complain_desc,
                                id: a.id,
                                id_lab: a.id_lab,
                                id_lod: a.id_lod,
                                id_metode: a.id_metode,
                                id_standart: a.id_standart,
                                id_unit: a.id_unit,
                                status_parameter: a.status_parameter,
                                nama_lab: a.lab ? a.lab.nama_lab : "-",
                                nama_unit: a.unit ? a.unit.nama_unit : "-",
                                metode: a.metode ? a.metode.metode : "-",
                                nama_standart: a.standart
                                    ? a.nama_standart
                                    : "-",
                                expectation: a.expectation,
                                prepstatus: a.preparation_status,
                                status_complain: a.status_complain
                                    ? a.status_complain.toString()
                                    : "0",
                                id_tech_det: parseInt(this.idComplain),
                                memo: a.memo,
                            };
                        }))
            );
    }

    // setDisabled(){
    //     this.data
    // }

    check(ev, st) {
        if (st == "all") {
            this.data = this.data.map((a) => ({
                ...a,
                checked: ev,
            }));
        } else {
            this.data[st].checked = this.data[st].checked = ev;
        }
        this.saveenable =
            this.data.filter((e) => e.checked).length > 0 ? false : true;

        this.totalchecked = this.data.filter((e) => e.checked).length;
        this.deletedcan = this.data.filter(
            (e: any) => e.status_parameter == 1 && e.checked
        ).length;
    }

    addmoreparam() {
        this.addnewparam = true;
    }

    actmoreparam() {
        if (this.datasent.parameteruji) {
            if (
                this.data
                    .map((p) => p.id_parameteruji)
                    .includes(this.datatemporary[0].id_parameteruji)
            ) {
                global.swalerror("Data sudah ada tidak bisa ditambah lagi");
            } else {
                this.data = this.data.concat(this.datatemporary);
            }
        } else {
            global.swalerror("Please select parameter first !");
        }
    }

    savingParameter() {
        if (this.data.filter((e) => e.checked).length > 0) {
            global.swalyousure("Cant revert").then((x) => {
                if (x.isConfirmed) {
                    this._complainServ
                        .saveDataParamQC(this.data.filter((e) => e.checked))
                        .then((x) =>
                            global.swalsuccess("Success", "Saving Success")
                        )
                        .then(() => {
                            this.resetCalc();
                            this.data = [];
                            this.getData();
                        })
                        .catch((e) =>
                            global.swalerror(
                                "Error at database, Please Contact IT"
                            )
                        );
                } else {
                    global.swalsuccess("Success", "Your data wont Change");
                }
            });
        } else {
            global.swalerror(
                "There is no data is checked, check it first then save"
            );
        }
    }

    resetCalc() {
        this.saveenable = false;
        this.deletedcan = 0;
        this.totalchecked = 0;
    }

    onScroll(ev) {
        console.log(ev);
    }
}
