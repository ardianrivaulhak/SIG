import { Component, OnInit, ViewEncapsulation, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import * as _moment from 'moment';
import { fuseAnimations } from '@fuse/animations';
import { KeuanganService } from '../../keuangan.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable } from "@angular/material/table";

@Component({
  selector: 'app-holdcontract',
  templateUrl: './holdcontract.component.html',
  styleUrls: ['./holdcontract.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class HoldcontractComponent implements OnInit {

    dataFilterContract = {
        pages : 1,
        type : "paginate",
        category : null,
        month: null,
        customers: null,
        contact_person: null,
        date: null,
        search : null
      }
    datapayment = [];
    datacontract = [];
    total: number;
    from: number;
    to: number;
    paymentForm: FormGroup;
    cekData = [];
    load = false

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<HoldcontractComponent>,
    private _masterServ: KeuanganService,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
      this.getDataContract();      
      this.paymentForm = this.createLabForm(); 
  }

  async getDataContract(){
    await this._masterServ.getDataKontrak(this.dataFilterContract).then(x => {
      this.datacontract = this.datacontract.concat(Array.from(x['data']));
      this.datacontract = this.uniq(this.datacontract, (it) => it.id_kontrakuji);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      } 
      console.log(this.datacontract)
      this.paymentForm = this.createLabForm();
    });
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
      }
      
    createLabForm(): FormGroup {
        return this._formBuild.group({
          contract_id:[this.cekData == null ?   '' :  this.cekData['id_kontrakuji']],
          hold:[this.cekData == null ?   '' :  this.cekData['hold']]
        })
      }

    async getValKontrak(ev){
        await console.log(ev); 
        this.cekData = await ev;
        await this.getDataContract();
        await console.log(this.paymentForm)
    }

  closeModal(){
    return this._dialogRef.close({
      
    });
  }

  saveForm(){
    console.log(this.paymentForm);
    this._masterServ.editHold(this.paymentForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this.closeModal();
        this.load = false;
      },2000)
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  onScrollToEnd(e) {
    if (e === "no_kontrak") {
      this.dataFilterContract.pages = this.dataFilterContract.pages + 1; 
      this.getDataContract();
    }
 }

 onsearchselect(ev, val) {
    if (val === "kontrak") {
        this.datacontract = [];
        this.dataFilterContract.search = ev.term;
        this.dataFilterContract.pages = 1;
        this.getDataContract();
    }
  }


}
