import { Component, OnInit, Inject } from "@angular/core";
import { MetodeService } from "app/main/analystpro/master/metode/metode.service";
import { LodService } from "app/main/analystpro/master/lod/lod.service";
import { UnitService } from "app/main/analystpro/master/unit/unit.service";
import { ParameterujiService } from "app/main/analystpro/master/parameteruji/parameteruji.service";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import * as global from "app/main/global";
@Component({
    selector: "app-info-param",
    templateUrl: "./info-param.component.html",
    styleUrls: ["./info-param.component.scss"],
})
export class InfoParamComponent implements OnInit {
    paraminfo = {
        lod: null,
        loq: null,
        metode: null,
        satuan: null,
    };

    datametode = [];
    datalod = [];

    datasent = {
        pages: "all",
        search: null,
    };
    sentinfoparam = [];
    dataunit = [];

    constructor(
        private _metodeServ: MetodeService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<InfoParamComponent>,
        private _lodServ: LodService,
        private _unitServ: UnitService,
        private _parameterServ: ParameterujiService
    ) {
        if (data) {
            this.sentinfoparam = this.sentinfoparam.concat(data);
            this.getData(data);
        }
    }

    ngOnInit(): void {
        this.getMetode();
        this.getLod();
        this.getSatuan();
    }

    getData(v) {
        this._parameterServ
            .getDataParameterUjiDetail(v.id_parameter_uji)
            .then((x: any) => {
                if (x.parameterinfo) {
                    this.paraminfo = {
                        lod: x.parameterinfo.id_lod
                            ? x.parameterinfo.id_lod
                            : null,
                        loq: x.parameterinfo.loq ? x.parameterinfo.loq : null,
                        metode: x.parameterinfo.id_metode
                            ? x.parameterinfo.id_metode
                            : null,
                        satuan: x.parameterinfo.id_unit
                            ? x.parameterinfo.id_unit
                            : null,
                    };
                }
            });
    }

    getSatuan() {
        this._unitServ.getDataUnit({ status: "All" }).then((x) => {
            this.dataunit = this.dataunit.concat(x);
        });
    }

    getMetode() {
        this._metodeServ
            .getDataMetode(this.datasent)
            .then((e) => (this.datametode = this.datametode.concat(e)));
    }

    getLod() {
        this._lodServ
            .getDataLod(this.datasent)
            .then((n) => (this.datalod = this.datalod.concat(n)));
    }

    saving() {
        this._parameterServ.addParameterinfo(this.paraminfo).then((x) => {
            global.swalsuccess("success", "success adding info at non paket");
        });
    }
}
