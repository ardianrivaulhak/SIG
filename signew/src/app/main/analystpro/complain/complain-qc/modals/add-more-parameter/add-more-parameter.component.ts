import { Component, OnInit, Optional, Inject } from "@angular/core";
import { UnitService } from "app/main/analystpro/master/unit/unit.service";
import { StandartService } from "app/main/analystpro/master/standart/standart.service";
import { LodService } from "app/main/analystpro/master/lod/lod.service";
import { MetodeService } from "app/main/analystpro/master/metode/metode.service";
import * as global from "app/main/global";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: "app-add-more-parameter",
    templateUrl: "./add-more-parameter.component.html",
    styleUrls: ["./add-more-parameter.component.scss"],
})
export class AddMoreParameterComponent implements OnInit {
    datasent = {
        complain_result: null,
        complain_arresult: null,
        id_metode: null,
        id_lod: null,
        id_standart: null,
        id_unit: null,
        metode: null,
        nama_standart: null,
        nama_unit: null,
        nama_lod: null,
        status_parameter: null,
    };

    datalod = [];
    dataunit = [];
    datastandart = [];
    datametode = [];

    constructor(
        private _lodServ: LodService,
        private _metodeServ: MetodeService,
        private _unitServ: UnitService,
        private _standartServ: StandartService,
        public dialogRef: MatDialogRef<AddMoreParameterComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (data) {
            this.datasent.complain_result = data.complain_result;
            this.datasent.complain_arresult = data.complain_arresult;
            this.datasent.metode = data.metode;
            this.datasent.nama_unit = data.nama_unit;
            this.datasent.nama_standart = data.nama_standart;
            this.datasent.nama_lod = data.nama_lod;
            this.datasent.id_lod = data.id_lod;
            this.datasent.id_unit = data.id_unit;
            this.datasent.id_metode = data.id_metode;
            this.datasent.id_standart = data.id_standart;
            this.datasent.status_parameter = data.status_parameter;
        }
    }

    ngOnInit(): void {
        this.getDataLod();
        this.getDataUnit();
        this.getDataStandart();
        this.getDataMetode();
    }

    getDataMetode() {
        this._metodeServ
            .getDataMetode({ status: "all" })
            .then((x) => (this.datametode = this.datametode.concat(x)))
            .then(
                () =>
                    (this.datametode = global.uniq(
                        this.datametode,
                        (it) => it.id
                    ))
            );
    }

    getDataLod() {
        this._lodServ
            .getDataLod({ status: "all" })
            .then((x) => {
                this.datalod = this.datalod.concat(x);
            })
            .then(() => {
                this.datalod = global.uniq(this.datalod, (it) => it.id);
            });
    }

    getDataUnit() {
        this._unitServ
            .getDataUnit({ status: "all" })
            .then((x) => (this.dataunit = this.dataunit.concat(x)))
            .then(
                () =>
                    (this.dataunit = global.uniq(this.dataunit, (it) => it.id))
            );
    }

    getDataStandart() {
        this._standartServ
            .getDataStandart({ status: "all" })
            .then((x) => (this.datastandart = this.datastandart.concat(x)))
            .then(
                () =>
                    (this.datastandart = global.uniq(
                        this.datastandart,
                        (it) => it.id
                    ))
            );
    }

    save(v) {
        this.dialogRef.close(this.datasent);
    }

    getValue(ev, st) {
        switch (st) {
            case "metode":
                this.datasent.metode = ev.metode;
                break;
            case "lod":
                this.datasent.nama_lod = ev.nama_lod;
                break;
            case "unit":
                this.datasent.nama_unit = ev.nama_unit;
                break;
            case "standart":
                this.datasent.nama_standart = ev.nama_standart;
                break;
        }
    }
}
