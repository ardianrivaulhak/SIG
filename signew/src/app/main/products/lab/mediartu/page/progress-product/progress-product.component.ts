import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef,MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as globals from "app/main/global";
import { ProductsService } from "../../../../products.service";
import { ModalPhotoComponent } from "app/main/analystpro/modal/modal-photo/modal-photo.component";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { url, urlApi } from "app/main/url";
import * as global from "app/main/global";
import { LabService } from "../../../lab.service";

@Component({
  selector: 'app-progress-product',
  templateUrl: './progress-product.component.html',
  styleUrls: ['./progress-product.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ProgressProductComponent implements OnInit {

  formData = {
    id_transaction_mediartu : 0,
    unit: 0
  }

  dataFilter = {
    id_transaction_mediartu : this.data.id
  }
  load = false;
  loadingfirst = true;
  total: number;
  from: number;
  to: number;
  pages = 1;
  current_page : number;
  labData = []; 
  totalHistory: number;

  disabled:boolean;

  constructor(
    public dialogRef: MatDialogRef<ProgressProductComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _productServ: ProductsService,
    private _labServ: LabService,
    private _snackBar: MatSnackBar,
    private _matDialog: MatDialog,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.formData.id_transaction_mediartu = this.data.id;
    this.getData();
  }

  async getData()
  {
    await this._labServ
    .getProgress(this.dataFilter)
    .then((x: any) => {
        this.labData = this.labData.concat(Array.from(x));
        this.labData = globals.uniq(
            this.labData,
            (it) => it.id_product_progress
        );
        this.total = x["total"];
        this.current_page = x["current_page"] - 1;
        this.from = x["from"];
        this.to = x["per_page"];
    })
    .then((x) =>
        setTimeout(() => {
            this.loadingfirst = false;
        }, 500)
    );    
    await console.log(this.labData)
    this.totalHistory = await this.labData.length < 1 ? 0 :  this.labData.map(w => w.unit).reduce((a,b) => a + b);
    this.totalHistory >= this.data.unit ? this.disabled = true : this.disabled = false;
    console.log(this.totalHistory)
  }

  submitProduct()
  {
    let u =  this.data.unit - this.totalHistory
    if(this.formData.unit > u){
      Swal.fire(
        'Over limit!',
        'Your unit over limit.',
        'error'
      )
    }else{
      Swal.fire({
        title: 'Are you sure?',
        text: 'Approve Media!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Do it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this._labServ.sendProgress(this.formData).then(x => {
            console.log(x)
          })
          Swal.fire(
            'Success!',
            'Your imaginary file has been update.',
            'success'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
          let message = {
            text: 'Succesfully',
            action: 'Done'
        }
        setTimeout(()=>{
                // this.labData=[];
                // this.loadingfirst =  true; 
                // this.getData();
                this.openSnackBar(message);
                this.load = false;
        },1000)
      })
    }
    
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
