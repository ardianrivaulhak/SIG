import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ContractService } from "../../services/contract/contract.service";
import * as global from 'app/main/global';
@Component({
    selector: "app-modal-param-edit",
    templateUrl: "./modal-param-edit.component.html",
    styleUrls: ["./modal-param-edit.component.scss"],
})
export class ModalParamEditComponent implements OnInit {
    price;
    formathasil = 1;
    id_price;

    dataParameterPrice = [];
    dataFormatHasil = [
        { id: 1, hasil: "Simplo" },
        { id: 2, hasil: "Duplo" },
        { id: 3, hasil: "Triplo" },
    ];
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalParamEditComponent>,
        private _kontrakServ: ContractService
    ) {
        if (data) {
            this.getdataprice(data);
        }
    }

    ngOnInit(): void {}

    getdataprice(v) {
        this.dataParameterPrice = [];
        this._kontrakServ.getDataPrice(v).then((x) => {
            this.dataParameterPrice = this.dataParameterPrice.concat(x);
        });
    }

    getValPrice(v) {
        this.id_price = v.id;
    }

    getValformatHasil(e) {
        console.log(e);
    }

    close() {
        this.dialogRef.close({});
    }
    saving() {
      if(this.price !== undefined){
        this.dialogRef.close({
          formathasil: this.formathasil,
          price: this.price,
          idprice: this.id_price
        })  
      } else {
        global.swalerror('Harap isi form dengan benar');
      }
      
    }
}
