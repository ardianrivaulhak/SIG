import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { AkgService } from "../../master/akg/akg.service";
import Swal from "sweetalert2";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatTable } from "@angular/material/table";

@Component({
    selector: "app-akg-modal",
    templateUrl: "./akg-modal.component.html",
    styleUrls: ["./akg-modal.component.scss"],
})
export class AkgModalComponent implements OnInit {
    @ViewChild("table") MatTable: MatTable<any>;

    displayedColumns: string[] = [
        "no",
        "akg_name",
        "price",
        "jumlah",
        "total",
        "select",
    ];
    valuechoose = [];
    akgchoose = [];
    akgcombine = [];
    akgtotal: number = 0;
    jumlah: 0;
    datakg = [];
    datasent = {
        page: 1,
        search: null,
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<AkgModalComponent>,
        private _akgServ: AkgService
    ) {
        if (data) {
            this.setData(data);
        }
        this._dialogRef.backdropClick().subscribe((v) => {
            this.closeModal();
        });
    }

    ngOnInit(): void {
        this.getDataAkg();
        this.jumlah = 0;
    }

    setData(d) {
        if (d.contract_id) {
            this._akgServ
                .get_akg_data_contract(d.contract_id)
                .then((e: any) => {
                    e.forEach((a) => {
                        this.akgcombine = this.akgcombine.concat({
                            id: a.id,
                            akg_name: a.akg_name,
                            price: a.price,
                            jumlah: a.jumlah,
                            total: a.total,
                        });
                    });
                    this.akgtotal = this.akgcombine
                        .map((x) => x.total)
                        .reduce((a, b) => a + b);
                });
        } else {
            d.forEach((x) => {
                this.akgcombine = this.akgcombine.concat({
                    id: x.masterakg ? x.masterakg.id : x.id,
                    akg_name: x.masterakg ? x.masterakg.akg_name : x.akg_name,
                    price: x.masterakg ? x.masterakg.price : x.price,
                    desc: x.masterakg ? x.masterakg.desc : x.desc,
                    jumlah: x.jumlah,
                    total: x.total,
                });
            });
            this.akgtotal = this.akgcombine
                .map((x) => x.total)
                .reduce((a, b) => a + b);
        }
    }

    async getDataAkg() {
        await this._akgServ
            .getData(this.datasent)
            .then((x) => (this.datakg = this.datakg.concat(x["data"])));
    }

    getVal(ev) {
        this.akgchoose = [];
        this.akgchoose = this.akgchoose.concat(ev);
    }

    reset() {
        this.akgchoose = [];
    }

    async satuin() {
        if (this.jumlah) {
            let a = this.akgcombine.filter(
                (b) => b.id === this.akgchoose[0].id
            );
            if (a.length > 0) {
                this.akgcombine = [];
            }
            await this.akgchoose.forEach((x, i) => {
                this.akgcombine = this.akgcombine.concat({
                    id: x.id,
                    akg_name: x.akg_name,
                    price: x.price,
                    desc: x.desc,
                    jumlah: this.jumlah,
                    total: parseInt(x.price) * this.jumlah,
                });
            });

            this.akgchoose = [];
            this.akgtotal = this.akgcombine
                .map((x) => x.total)
                .reduce((a, b) => a + b);
            this.jumlah = 0;
        } else {
            Swal.fire({
                title: "Harap isi Jumlah !",
                icon: "warning",
                confirmButtonText: "Ok",
            });
        }
    }

    deleterow(e) {
        this.akgcombine = this.akgcombine.splice(e, 1);
        this.MatTable.renderRows();
        this.akgtotal = this.akgcombine
            .map((x) => x.total)
            .reduce((a, b) => a + b);
    }

    closeModal() {
        return this._dialogRef.close({
            a: this.akgcombine,
            b: this.akgtotal,
        });
    }
}
