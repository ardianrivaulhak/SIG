import { CustomerService } from '../customer.service';
import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import * as global from 'app/main/global';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent implements OnInit {

  datainfo = [];
  hideForm = true;
  coa;
  gr;
  po;
  spk;
  ttb;
  lunas;
  id_cust;
  ba;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<ModalInfoComponent>,
    private _custServ: CustomerService,
    private _matDialog: MatDialog
  ) {
    if(data){
      this.id_cust = data.data;
      this.getDataInfoCustomers(data.data);
    }
   }

  ngOnInit(): void {
  }

  tambahkententuan(){
    this.hideForm = false;
  }

  canceling(){
    this.hideForm = true;
  }

  saving(){
    let a = {
      coa: this.coa,
      gr: this.gr,
      po: this.po,
      spk: this.spk,
      ttb: this.ttb,
      lunas: this.lunas,
      id_cust: this.id_cust,
      ba: this.ba
    }
    this._custServ.sendDataInfoCust(a).then(x => {
      this.getDataInfoCustomers(this.id_cust);
    }).then(()=>this.datainfo = []);
  }

  getDataInfoCustomers(data){
    this._custServ.getInfoCustomers(data)
    .then(x => this.datainfo = this.datainfo.concat(x))
    .then(() => this.hideForm = true);
  }


}
