import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../customers/customer.service';
import { CustomerAddressService } from '../customer-address.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-customer-address-det',
  templateUrl: './customer-address-det.component.html',
  styleUrls: ['./customer-address-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CustomerAddressDetComponent implements OnInit {

  customersAddressForm: FormGroup;
  detaildata = [];
  idCustomerAddress: any;
  hide = true;
  load = false;
  loading = false;
  saving = false;
  datacustomer = {
    pages: 1,
    search: null
  };
  customerid: number ;
  customerdisable = true;
  alamatid: string ;
  alamatdisable = true;

  customersdata= [];
  constructor(
    private _custServ: CustomerService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _custAddress: CustomerAddressService
  ) {
    this.idCustomerAddress = this._actRoute.snapshot.params['id'];
   }


  ngOnInit(): void {
    if(this.idCustomerAddress !== 'add'){
      this.getdatadetail();
    }
    // this.customersAddressForm = this.createLabForm();
    this.getDataCust();
    this.customerdisable = this.idCustomerAddress !== 'add' ? true : false;
    this.alamatdisable = this.idCustomerAddress !== 'add' ? true : false;
  }

  enableForm(){
    this.hide = false;
    this.customerdisable = false;
    this.alamatdisable = false;
  }

  disableForm(){
    this.hide = true;
    this.customerdisable = true;
    this.alamatdisable = true;
  }

  async getDataCust(){
    await this._custServ.getDataCustomers(this.datacustomer)
    .then(x => {
      console.log(x['data']);
      this.customersdata = this.customersdata.concat(x['data'])
    }).then(()=> {
      this.customersdata = this.customersdata.filter((item,pos) => {
        return this.customersdata.indexOf(item) == pos
      })
    });
  }

  onScrollToEnd(e) {
    this.loading = true;
    if(e === 'customer'){
      this.datacustomer.pages = this.datacustomer.pages + 1;
      this.getDataCust();
    } 
    setTimeout(() => {
      this.loading = false;
    }, 200)
  }

  onSearch(ev,identifier) {
    if(identifier === 'customer'){
      this.datacustomer.search = ev.term;
      this.datacustomer.pages = 1;
      this.customersdata = [];
      this.getDataCust();
    }
  }

  getVal(e){
    console.log(e);
  }

  saveForm(){
    let a = {
      customer_id : this.customerid,
      alamat : this.alamatid,
      id_customeraddress : this.idCustomerAddress

    }
    this._custAddress.updateData(a).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/customeraddress');
        this.load = false;
      },2000)
    })
  }

  deleteForm(){
    this._custAddress.deleteData(this.idCustomerAddress).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Deleted',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/customeraddress');
        this.load = false;
      },2000)
    });
  }

  saveNewForm(){
    let a = {
      alamat: this.alamatid,
      customer_id: this.customerid
    }
    this._custAddress.addData(a).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Save',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/customeraddress');
        this.load = false;
      },2000)
    });
  }

  getdatadetail(){
    this._custAddress.getDataDetail(this.idCustomerAddress)
    .then(x => {
      this.detaildata = this.detaildata.concat(x);
      console.log(this.detaildata);
    })
    .then(()=> this.getDataCust())
    .then(async ()=> {
      this.customersdata = await this.customersdata.concat(this.detaildata[0].customers);
      console.log(this.customersdata);
    })
    .then(()=> this.customerid = this.idCustomerAddress ? this.detaildata[0].customers.id_customer : null)
    .then(()=> this.alamatid = this.idCustomerAddress ? this.detaildata[0].address : null);
  }

  createLabForm(): FormGroup {
    return this._formBuild.group({
        customersinfo: [null],
        address: [null],
    },)
}

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
