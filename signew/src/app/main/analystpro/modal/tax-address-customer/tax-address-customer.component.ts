import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomertaxaddressService } from '../../master/customertaxaddress/customertaxaddress.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-tax-address-customer',
  templateUrl: './tax-address-customer.component.html',
  styleUrls: ['./tax-address-customer.component.scss']
})
export class TaxAddressCustomerComponent implements OnInit {

  loading: boolean = false;
  cust_name: string;
  id_cust: number;
  taxaddress;
  desc;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<TaxAddressCustomerComponent>,
    private _custAdress: CustomertaxaddressService,
    private _snackBar: MatSnackBar
  ) {
    if(data){
      this.cust_name = data.cust_name;
      this.id_cust = data.id_customer;
    }
    this._dialogRef.backdropClick().subscribe(v => {
      this.closeModal(this.id_cust)
    });
   }

   ngOnInit(): void {
  }

  closeModal(data){
    return this._dialogRef.close({
      id_cust: data.customer_id
    });
  }

  save(){
    
    this.loading = true;
    
    console.log({a:this.taxaddress, b: this.desc, c: this.id_cust});
    
    let data = {
      address: this.taxaddress,
      customer_id: this.id_cust,
      desc: this.desc
    }

    this._custAdress.addData(data)
    .then(x => this.openSnackBar('Success Adding New Customer Address'))
    .then(() => this.closeModal(data))
    .catch(e => this.openSnackBar('Failed Saving New Customer Address'));
  }

  openSnackBar(message: string) {
    this._snackBar.open(message,'', {
      duration: 2000,
    });
  }


}
