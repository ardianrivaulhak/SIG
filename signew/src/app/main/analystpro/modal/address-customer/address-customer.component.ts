import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerAddressService } from '../../master/customer-address/customer-address.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-address-customer',
  templateUrl: './address-customer.component.html',
  styleUrls: ['./address-customer.component.scss']
})
export class AddressCustomerComponent implements OnInit {

  loading: boolean = false;
  cust_name: string;
  id_cust: number;
  address;
  desc;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<AddressCustomerComponent>,
    private _custAdress: CustomerAddressService,
    private _snackBar: MatSnackBar
  ) { 
    if(data){
      this.cust_name = data.cust_name;
      this.id_cust = data.id_customer;
    }
    this._dialogRef.backdropClick().subscribe(v => {
      this.closeModal()
    });
  }

  ngOnInit(): void {
  }

  closeModal(){
    return this._dialogRef.close();
  }

  save(){
    
    this.loading = true;
    
    console.log({a:this.address, b: this.desc});
    
    let data = {
      alamat: this.address,
      customer_id: this.id_cust
    }

    this._custAdress.addData(data)
    .then(x => this.openSnackBar('Success Adding New Customer Address'))
    .then(() => this.closeModal())
    .catch(e => this.openSnackBar('Failed Saving New Customer Address'));
  }

  openSnackBar(message: string) {
    this._snackBar.open(message,'', {
      duration: 2000,
    });
  }

}
