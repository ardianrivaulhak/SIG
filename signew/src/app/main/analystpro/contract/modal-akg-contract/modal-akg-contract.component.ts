import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { AkgService } from "../../master/akg/akg.service";
import Swal from "sweetalert2";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatTable } from "@angular/material/table";
import * as global from "app/main/global";
@Component({
    selector: "app-modal-akg-contract",
    templateUrl: "./modal-akg-contract.component.html",
    styleUrls: ["./modal-akg-contract.component.scss"],
})
export class ModalAkgContractComponent implements OnInit {
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
    disable: boolean = true;
    datasent = {
        page: 1,
        search: null,
    };
    idkontrakuji;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<ModalAkgContractComponent>,
        private _akgServ: AkgService
    ) {
        if (data) {
            this.setData(data);
            this.idkontrakuji = data;
        }
        this._dialogRef.backdropClick().subscribe((v) => {
            this.closeModal();
        });
    }

    ngOnInit(): void {
        this.getDataAkg();
        this.jumlah = 0;
    }

    async setData(d) {
        await this._akgServ
            .get_akg_data_contract(d)
            .then((x: any) => {
                x.forEach((a) => {
                    this.akgcombine = this.akgcombine.concat({
                        id: a.id,
                        id_transaction_kontrakuji: a.id_transaction_kontrakuji,
                        akg_name: a.akg_name,
                        price: a.price,
                        jumlah: a.jumlah,
                        total: a.total,
                        desc: a.desc,
                    });
                });
            })
            .then(() => {
                this.akgtotal =
                    this.akgcombine.length > 0
                        ? this.akgcombine
                              .map((z) => z.total)
                              .reduce((a, b) => a + b)
                        : 0;
            });
    }

    async getDataAkg() {
        await this._akgServ
            .getData(this.datasent)
            .then((x) => (this.datakg = this.datakg.concat(x["data"])));
    }

    async getVal(ev) {
        this.akgchoose = await [];
        this.akgchoose = await this.akgchoose.concat(ev);
        this.disable = await false;
    }

    reset() {
        this.akgchoose = [];
    }

    saveData() {
      
      if(this.akgcombine.length > 0){
        this.akgcombine = global.uniq(this.akgcombine, it => it.id);
        this._akgServ
        .addTransactionAkg(this.akgcombine)
        .then((x: any) => {
          global.swalsuccess('success',x.message);
        })
        .then(() => this._dialogRef.close())
        .catch(e => global.swalerror('error at database'));
      } else {
        this._akgServ.deleteAkgContract(this.idkontrakuji)
        .then((x: any) => {
          global.swalsuccess('success',x.message);
        })
        .catch(e => global.swalerror('error at database'));
      }
        
    }

    async satuin() {
        if (this.jumlah) {
            this.akgcombine = await [];
            await this.akgchoose.forEach((x, i) => {
                this.akgcombine = this.akgcombine.concat({
                    id: x.id,
                    akg_name: x.akg_name,
                    price: x.price,
                    desc: x.desc,
                    jumlah: this.jumlah,
                    id_transaction_kontrakuji: this.idkontrakuji,
                    total: parseInt(x.price) * this.jumlah,
                });
            });

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

    async deleterow(e) {
        await global.swalyousure("Delete Data").then(x => {
            if(x.isConfirmed){
                this._akgServ.deleteAkgContract(this.idkontrakuji).then(x => {
                    this.akgcombine = [];
                    this.setData(this.idkontrakuji);
                });
            }
        })        
    }

    closeModal() {
        return this._dialogRef.close({
            a: this.akgcombine,
            b: this.akgtotal,
        });
    }

    close(){
        return this._dialogRef.close();
    }
}
