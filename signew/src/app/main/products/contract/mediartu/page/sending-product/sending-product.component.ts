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
import { LabService } from "../../../../lab/lab.service";
import { MediartuPartialService } from "../../../pdf/mediartu-partial.service";

@Component({
  selector: 'app-sending-product',
  templateUrl: './sending-product.component.html',
  styleUrls: ['./sending-product.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SendingProductComponent implements OnInit {

  formData = {
    id_transaction_mediartu : 0,
    unit: 0
  }

  dataFilter = {
    id_transaction_mediartu : this.data
  }

  contractData = {
    data : null,
    selectProduct : null
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
  checkList = [];
  allComplete: boolean = false;

wew : any;
  disabled:boolean;
  panelOpenState = false

  constructor(
    public dialogRef: MatDialogRef<SendingProductComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _productServ: ProductsService,
    private _snackBar: MatSnackBar,
    private _matDialog: MatDialog,
    private _route: Router,
    private _labServ : LabService,
    private _pdfData : MediartuPartialService
  ) { }

  ngOnInit(): void {
    // this.formData.id_transaction_mediartu = this.data.id_product_contract;
    this.getDetail()
    this.getData();
    console.log(this.data)
    
  }

  async getDetail()
  {
    await this._productServ.contractDetailMediartu(this.data).then((x: any) => {
        this.wew = x
      })
      await console.log(this.wew)
  }

  async getData()
  {
    await this._productServ
    .getSampleSend(this.dataFilter)
    .then((x: any) => {
      console.log(x)
        this.labData = this.labData.concat(x);
        this.labData = globals.uniq(
            this.labData,
            (it) => it.id
        );
    })
    .then((x) =>
        setTimeout(() => {
            this.loadingfirst = false;
        }, 500)
    );  
    await console.log( this.labData);  
    //
  }

  checkBox(ev,id){
    let z = this.checkList.filter(o => o.id == id);
    console.log(ev)
    if(ev){
      if(z.length > 0){
        z[0].checked = ev
      } else {
        this.checkList = this.checkList.concat({
          id: id,
          checked : true
        });
      }
    } else {
      let z = this.checkList.filter(x => x.id == id);
      z[0].checked = ev;
    }
    console.log(this.checkList)
  }

  updateAllComplete() {
    this.allComplete = this.labData != null && this.labData.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.labData == null) {
      return false;
    }
    return this.labData.filter(t => t.completed).length > 0 && !this.allComplete;      
  }

  async openTandaTerima()
  {
    this.contractData.data = await this.wew;
    this.contractData.selectProduct = await this.checkList;
    await this._pdfData.generatePdf(this.contractData);
    this.checkList = await [];
    this.labData = await [];
    await this.getData();
  }

  closeModal(){
    return this.dialogRef.close({
      
    });
  }
}
