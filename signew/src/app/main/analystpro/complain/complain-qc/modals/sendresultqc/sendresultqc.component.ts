import {
    Component,
    OnInit,
    Optional,
    Inject,
    ViewEncapsulation,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ComplainService } from "app/main/analystpro/complain/complain.service";
import { UnitService } from "app/main/analystpro/master/unit/unit.service";
import { LodService } from "app/main/analystpro/master/lod/lod.service";
import { MetodeService } from "app/main/analystpro/master/metode/metode.service";
import * as global from "app/main/global";

@Component({
    selector: "app-sendresultqc",
    templateUrl: "./sendresultqc.component.html",
    styleUrls: ["./sendresultqc.component.scss"],
})
export class SendresultqcComponent implements OnInit {
    dataset = [];

    sendunit = {
        pages: 1,
        search: null,
    };
    dataunit = [];

    sendlod = {
        pages: 1,
        search: null,
    };
    datalod = [];

    sendMetode = {
        pages: 1,
        search: null,
    };

    dataMetode = [];

    constructor(
        public dialogRef: MatDialogRef<SendresultqcComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private _ComplServ: ComplainService,
        private _unitServ: UnitService,
        private _lodServ: LodService,
        private _metodeServ: MetodeService
    ) {
        if (data) {
            if (data.sendresult.length > 0) {
                this.setDataSudahAda(data.sendresult);
            } else {
                this.getDataChild(data.id_tech_det);
            }
        }
    }

    ngOnInit(): void {
        this.getDataUnit();
        this.getDataLod();
        this.getDataMetode();
    }

    setDataSudahAda(v) {
        console.log(v);
        this.dataset = [];
        v.forEach((x) => {
            this.dataset = this.dataset.concat({
                id_parameteruji: x.id_parameteruji,
                parametername: x.parameteruji ? x.parameteruji.name_id : "-",
                hasiluji: x.hasiluji,
                id_techdet: x.id_techdet,
                confirmation: x.confirmation,
                memo: x.memo,
                id_metode: x.id_metode,
                id_lod: x.id_lod,
                id_lab: x.id_lab,
                id_satuan: x.id_unit,
                id_tech: x.id_techdet,
                statushasil: x.selectcust,
            });
        });
    }

    getDataChild(v) {
        this._ComplServ.getDataComplaindetChild(v).then((x: any) => {
            if (x.length > 0) {
                for(let i = 0; i < x.length; i++){
                    this.setData(x[i]);
                }
            }
        });
    }

    getDataMetode() {
        this._metodeServ
            .getDataMetode(this.sendMetode)
            .then((e) => (this.dataMetode = this.dataMetode.concat(e["data"])))
            .then(
                () =>
                    (this.dataMetode = global.uniq(
                        this.dataMetode,
                        (t) => t.id
                    ))
            );
    }

    getDataLod() {
        this._lodServ
            .getDataLod(this.sendlod)
            .then((x) => (this.datalod = this.datalod.concat(x["data"])))
            .then(
                () => (this.datalod = global.uniq(this.datalod, (it) => it.id))
            );
    }
    getDataUnit() {
        this._unitServ
            .getDataUnit(this.sendunit)
            .then((u) => (this.dataunit = this.dataunit.concat(u["data"])))

            .then(
                () =>
                    (this.dataunit = global.uniq(this.dataunit, (it) => it.id))
            );
    }

    setData(x) {
        if(x.id_unit){
            this.dataunit = this.dataunit.concat({
                id: x.unit ? x.unit.id : x.id_unit,
                nama_unit: x.unit.nama_unit,
            })
        }

        if(x.id_lod){
            this.datalod = this.datalod.concat({
                id: x.lod ? x.lod.id : x.id_lod,
                nama_lod: x.lod ? x.lod.nama_lod : x.nama_lod,
            })
        }

        if(x.id_metode){
            this.dataMetode = this.dataMetode.concat({
                id: x.metode ? x.metode.id : x.id_metode,
                metode: x.metode ? x.metode.metode : x.metode,
            })
        }

        this.dataset = this.dataset.concat({
            id_parameteruji: x.id_parameteruji,
            parametername: x.parameteruji ? x.parameteruji.name_id : "-",
            hasiluji: x.complain_result,
            ar: x.complain_arresult,
            id_techdet: x.id,
            confirmation: null,
            memo: x.memo,
            id_metode: x.id_metode,
            metode: x.metode ? x.metode.metode : "-",
            satuan: x.unit ? x.unit.nama_unit : "-",
            lod: x.lod ? x.lod.nama_lod : "-",
            id_lod: x.id_lod,
            id_satuan: x.id_unit,
            lab: x.lab ? x.lab.nama_lab : "-",
            id_tech: x.id_tech_det,
            statushasil: null,
        });
    }

    savingdata() {
        console.log(this.dataset);
        this._ComplServ
            .savingsendcertificate(this.dataset)
            .then((x: any) => {
                if (x.status) {
                    global.swalsuccess("success", "Succesfully Done");
                    this.dialogRef.close();
                } else {
                    global.swalerror("Error Saving Data !");
                }
            })
            .catch((e) => {
                global.swalerror("Error Saving Data !");
            });
    }

    close() {
        this.dialogRef.close();
    }
}
