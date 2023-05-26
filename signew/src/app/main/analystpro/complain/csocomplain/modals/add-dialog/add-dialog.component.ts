import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { KeuanganService } from "app/main/analystpro/keuangan/keuangan.service";
import { ComplainService } from "../../../complain.service";
import Swal from 'sweetalert2';
import * as globals from "app/main/global";
@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AddDialogComponent implements OnInit {

  complainForm: FormGroup;
  files: File[] = [];
  load = false;
  datacontract = []
  dataFilterContract = {
    pages: 1,
    type: "paginate",
    category: null,
    month: null,
    customers: null,
    contact_person: null,
    date: null,
    search: null,
  };  
  total: number;
  from: number;
  to: number;
  dataLhu = []
  form_data = {
    idContract : null,
    idLhu : null,
    idSample : null,
    subject : null,
    message: null,
    type: null,
    typeAdd : 1
  }

  typeStat = [ 
    {
      "title" : "Certificate",
      "value" : 1,
    }, 
    {
      "title" : "Result",
      "value" : 2,
    }, 
  ]


 
  constructor( 
    public dialogRef: MatDialogRef<AddDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _kontrakServ: ContractService,
    private _keuServ : KeuanganService,
    private _compServ : ComplainService
    ) { }

  ngOnInit(): void {
    this.getData();
    this.getDataContract();
  }

  async getDataContract() {
    await this._keuServ
        .getDataKontrak(this.dataFilterContract)
        .then((x) => {
            this.datacontract = this.datacontract.concat(
                Array.from(x["data"])
            );
            this.datacontract = globals.uniq(
                this.datacontract,
                (it) => it.id_kontrakuji
            );
            this.total = x["total"];
            this.from = x["from"] - 1;
            this.to = x["to"];
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

async getValKontrak(ev) {
  console.log(ev.id_kontrakuji)
  this.dataLhu = [];
  await this._compServ
  .getLHUinComplaint(ev.id_kontrakuji)
  .then((x) => {
      this.dataLhu = this.dataLhu.concat(x);
      this.dataLhu = this.dataLhu.map( x => x.transaction_sample_cert)
      console.log(this.dataLhu)
      this.dataLhu = globals.uniq(
          this.dataLhu, (it) => it.id
      );
      console.log(this.dataLhu);
  });
  
}

  async getLhu(ev)
  {
    console.log(ev)
    this.form_data.idSample = ev.id_transaction_sample;
  }

  getData(){
    console.log(this.data)
  }

  async checkDataLhu()
  {
    let cond: any;
    await this._compServ.checkDataCso(this.form_data).then((x) => {
      this.load = true;
      cond = x;
    });
    if(cond > 0){
      Swal.fire({
        title: 'Are you sure?',
        text: 'Your LHP number has been used!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Lets Go!',
        cancelButtonText: 'No, Maybe later'
      }).then((result) => {
        if (result.value) {
          this.saveForm();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
      })
    }else{
      this.saveForm();
    }
  }

  async saveForm()
  {
    await this._compServ.addDataCso(this.form_data).then((x) => {
        this.load = true;
        let message = {
            text: "Data Succesfully Updated",
            action: "Done",
        };
        setTimeout(() => {
            this.openSnackBar(message);
            this.closeModal(false)
            this.load = false;
        }, 2000);
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
        duration: 2000,
    });
  }

  closeModal(v){
    return this.dialogRef.close({
        v
    });
    
  }

}
