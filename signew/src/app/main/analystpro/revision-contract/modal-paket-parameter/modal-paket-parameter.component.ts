import { Component, OnInit, Inject } from "@angular/core";
import { PaketparameterService } from "app/main/analystpro/master/paketparameter/paketparameter.service";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import * as global from "app/main/global";
@Component({
    selector: "app-modal-paket-parameter",
    templateUrl: "./modal-paket-parameter.component.html",
    styleUrls: ["./modal-paket-parameter.component.scss"],
})
export class ModalPaketParameterComponent implements OnInit {
    datapaket = [];
    selectparameteruji = [];
    datamentah = [];
    dataselect = [];
    checkall = true;
    totalchecked;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalPaketParameterComponent>,
        private paketujiServ: PaketparameterService
    ) {
        if (data) {
            this.getDataPaketUjiChoose(data);
        }
    }

    ngOnInit(): void {}

    async getDataPaketUjiChoose(v) {
        await this.paketujiServ
            .getDataDetailPaketparameter(v)
            .then((x: any) => {
                x.paketparameter.forEach((v, i) => {
                    this.datamentah = this.datamentah.concat({
                        id: i,
                        checked: true,
                        id_lab: v.id_lab,
                        id_lod: v.id_lod,
                        id_metode: v.id_metode,
                        id_paketuji: v.id_paketuji,
                        id_parameter_uji: v.id_parameter_uji,
                        id_standart: v.id_standart,
                        id_unit: v.id_unit,
                        lab: v.lab,
                        lod: v.lod,
                        metode: v.metode,
                        parameteruji: v.parameteruji,
                        standart: v.standart,
                        unit: v.unit,
                    });
                });
            });
        this.datapaket = await this.datamentah;
        this.totalchecked = await this.datapaket.length;
        this.totalchecked = await this.datamentah.length;
        this.selectparameteruji = await this.datamentah.map((h) => ({
            id_parameteruji: h.id_parameter_uji,
            parametername: h.parameteruji[0].name_id,
            parametercode: h.parameteruji[0].parameter_code,
        }));
    }

    resetdata() {
        this.datapaket = this.datamentah;
    }

    getValueChange(v) {
        if (v) {
            this.datapaket = this.datamentah.filter(
                (e) => e.id_parameter_uji == v.id_parameteruji
            );
        }
    }

    sort() {
        this.datapaket = this.datapaket.sort((a, b) =>
            this.compare(
                a["parameteruji"][0].name_id,
                b["parameteruji"][0].name_id,
                true
            )
        );
        this.datamentah = this.datamentah.sort((a, b) =>
            this.compare(
                a["parameteruji"][0].name_id,
                b["parameteruji"][0].name_id,
                true
            )
        );
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    async checkedEvent(ev, index) {
        if (index == "all") {
            for (let i = 0; i < this.datapaket.length; i++) {
                this.datapaket[i].checked = ev;
                this.datamentah[i].checked = ev;
            }
        } else {
            this.datapaket.filter((l) => l.id == index)[0].checked = await ev;
            this.datamentah.filter((l) => l.id == index)[0].checked = await ev;
        }
        this.totalchecked = this.datapaket.filter((r) => r.checked).length;
        this.totalchecked = this.datamentah.filter((r) => r.checked).length;
    }

    setParameter() {
        this.dialogRef.close(this.datamentah.filter((r) => r.checked));
    }

    close() {
        this.dialogRef.close();
    }
}
