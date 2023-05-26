import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { HighlightSpanKind } from 'typescript';
import { KeuanganService } from "app/main/analystpro/keuangan/keuangan.service";
import { FinanceService } from "../../../finance.service";
import Swal from 'sweetalert2';
import * as globals from "app/main/global";
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PaymentsComponent implements OnInit {

  payment = {
    subtotal : 0,
    discount : 0,
    shippingcost : 0,
    ppn : 0,
    total : 0,
    historypay: 0,
    remaining: 0,
    history: []
  }

  form = {
    id: 0 ,
    payment : 0,
    bank : null,
    information: null,
    date : null
  }

  bankAccount = [];
  load = false;

  constructor(
    public dialogRef: MatDialogRef<PaymentsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _keuanganServ: KeuanganService,
    private _financeServ : FinanceService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.getData();
    this.bankAccounts();
  }

  async getData()
  {
    this.payment.subtotal = await parseFloat(this.data.subtotal);
    this.payment.discount = await parseFloat(this.data.discount);
    this.payment.shippingcost = await parseFloat(this.data.shipping_cost);
    this.payment.ppn = await parseFloat(this.data.ppn);
    this.payment.total = await parseFloat(this.data.subtotal) - parseFloat(this.data.discount) + parseFloat(this.data.shipping_cost) + parseFloat(this.data.ppn);
    this.payment.historypay = await parseFloat(this.data.price.product_payment.length > 0 ? this.data.price.product_payment.map(w => w.payment).reduce((a,b) => a + b) : 0);
    this.payment.remaining = await this.payment.total - this.payment.historypay
    this.form.id = await parseFloat(this.data.price.id_product_price);
    this.form.payment = await this.payment.remaining;
    this.payment.history = this.data.price.product_payment;

    console.log(typeof(this.payment.total))
  }

  async bankAccounts() {
    await this._keuanganServ.getBankAccount().then((x) => {
        this.bankAccount = this.bankAccount.concat(x);
    });
}

  async submitData()
  {
    if(this.form.payment > this.payment.remaining){
      this.load = await true;
      let message =  await {
        text: 'Overpayment',
        action: 'Done'
      }
      await setTimeout( async ()=>{        
        this.load = await false;
        await this.openSnackBar(message);   
      }, 3000);
    }else{
      await this._financeServ.submitPayment(this.form).then(async x => {
        this.load = true;
        let message =  await {
          text: 'Data Succesfully Updated',
          action: 'Done'
        }
        await setTimeout( async ()=>{        
          this.load = await false;
          await this.openSnackBar(message);             
          await this.closeModal(false);
        }, 3000);
      })
    }    
  }

  closeModal(v) {
    return this.dialogRef.close({
      v
    });
}

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
