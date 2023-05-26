import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from "xlsx";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
import * as globals from "app/main/global";
let momentbussiness = require("moment-business-days");
import { ProductsService } from "../../../products.service";
import { MatTable } from "@angular/material/table";
import { timeStamp } from "console";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { KeuanganService } from "../../../../analystpro/keuangan/keuangan.service";
import { FinanceService } from "../../finance.service";
import { NULL_EXPR } from "@angular/compiler/src/output/output_ast";
import { ContactPersonService  } from "app/main/analystpro/master/contact-person/contact-person.service";
import {CustomerAddressService  } from "app/main/analystpro/master/customer-address/customer-address.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detailinvoiceproduct',
  templateUrl: './detailinvoiceproduct.component.html',
  styleUrls: ['./detailinvoiceproduct.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DetailinvoiceproductComponent implements OnInit {

  load = false;
  loadingfirst = false;
  idProductInvoice : number;
  dataInvoice: any;
  form = {
    invoice_number : '',
    id_customer : 0,
    id_contact_person : 0,
    telephone : '',
    mobile : '',
    id_address : 0,
    po_number : '',
    invoice_date : '',
    due_date: '',
    termin : '',
    product : []
  }
  product = [];
  customersData = [];
  totalcont : number;
  fromcont : number;
  tocont : number;
  contactData = [];
  displayedColumns: string[] = [
    'product_name', 
    'price', 
    'unit',
    'subtotal', 
    'discount',
    'total',
    ];

    datasentCustomer = {
      pages : 1,
      search : null,
      id_customer : ''
    }
    totalcust : number;
    fromcust : number;
    tocust : number;
    datasentContact = {
      pages : 1,
      search : null,
      id_cp: '',
      id_customer: ''
    } 
    datasentAddress = {
      pages : 1,
      search : null,
      id: null,
      id_customer : ''
    } 
    totaladdr : number;
    fromaddr : number;
    toaddr : number;
    addressData = [];
    
  downpayment: number;
  remainingpayment: number;

  constructor(
    private _financeServ : FinanceService,
    private _actRoute: ActivatedRoute,
    private _customersServ: CustomerService,
    private _contactServ : ContactPersonService,
    private _addressServ : CustomerAddressService,
    private _snackBar: MatSnackBar,
  ) {
    this.idProductInvoice = this._actRoute.snapshot.params['id'];
   }

  ngOnInit(): void {
    this.getData();
  }

  async getData() {
    await this._financeServ
        .getDetailInvoiceProduct(this.idProductInvoice)
        .then((x: any) => {
          this.dataInvoice = x;
        })
        .then((x) =>
            setTimeout(() => {
                this.loadingfirst = false;
            }, 500)
        );
        
        this.datasentCustomer.id_customer = await this.dataInvoice.id_customer;
        await this.formdata();        
        await this.getDataCustomer();
        
        this.datasentContact.id_cp = await  this.dataInvoice.id_cp;
        this.datasentContact.id_customer = await this.customersData[0].id_customer;
        await this.getDataContactPerson();
        await this.getCustomerAddress();
        await this.getPayment();
  }

  async formdata()
  {
    this.form.invoice_number = this.dataInvoice.no_invoice;
    this.form.id_customer = this.dataInvoice.id_customer;
    this.form.id_contact_person = this.dataInvoice.id_cp;
    this.form.telephone = this.dataInvoice.contract.telp_number;
    this.form.mobile = this.dataInvoice.contract.mobile_number;
    this.form.id_address = this.dataInvoice.id_address;
    this.form.po_number = this.dataInvoice.no_po;
    this.form.invoice_date = this.dataInvoice.tgl_faktur;
    this.form.due_date = this.dataInvoice.tgl_jatuhtempo;
    this.form.termin = this.dataInvoice.termin;
    this.product = await this.dataInvoice.contract.product_media_r_t_u.length > 0 ? this.dataInvoice.contract.product_media_r_t_u :  this.dataInvoice.contract.product_dioxin.length > 0 ? this.dataInvoice.contract.product_dioxin : 'NULL';
    this.form.product = await this.product;
  }

  async getDataCustomer()
  {
    await console.log(this.datasentCustomer)
    await this._customersServ.customerSelect(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(Array.from(x['data']));
        this.customersData = globals.uniq(this.customersData, (it) => it.id_customer);
        this.totalcust = x['total'];
        this.fromcust = x['from'] - 1;
        this.tocust = x['to'];
    });    
   
  } 

  async getDataContactPerson()
  {        
    
    this.contactData = await [];
    await this._contactServ.contactSelect(this.datasentContact)
    .then( async x => {
        let b = [];
        b = await b.concat(Array.from(x['data']));    
        await b.forEach(x => {
          this.contactData = this.contactData.concat({
            id_contact : x.id_cp,
            contact_name : x.contact_person.name
        })          
        })
        this.contactData = await globals.uniq(this.contactData, 
          (it) => it.id_contact);

        this.totalcont = await x['total'];
        this.fromcont = await x['from'] - 1;
        this.tocont = await x['to'];
        console.log(this.contactData)
    })
  }

  async getCustomerAddress(){
    this.datasentAddress.id_customer = await this.customersData[0].id_customer;
    await this._addressServ.getCustomerAddressSelected(this.datasentAddress).then( async x => {
        let b = [];
        b = await b.concat(Array.from(x['data']));
        console.log(b)
        await b.forEach(x => {
            this.addressData = this.addressData.concat({
                id_address : x.id_address,
                address : x.address
            })               
        })
        this.addressData = await globals.uniq(this.addressData, (it) => it.id_address);
        this.totaladdr = await x['total'];
        this.fromaddr = await x['from'] - 1;
        this.toaddr = await x['to']
    })
  }

  async getPayment()
  {
    this.downpayment = await this.dataInvoice.price.product_payment.length > 0 ?  this.dataInvoice.price.product_payment.map(w => w.payment).reduce((a,b) => a + b) : 0;
    this.remainingpayment = await this.dataInvoice.price.total - this.dataInvoice.price.product_payment.map(w => w.payment).reduce((a,b) => a + b);
  }

  async saveContract()
  {
    console.log(this.form)
    this._financeServ.submitDataInvoice(this.form, this.idProductInvoice).then(async y => {
      this.load = true;
      let message =  await {
        text: 'Data Succesfully Updated',
        action: 'Done'
    }
    await setTimeout( async ()=>{        
       this.load = await false;
       await this.openSnackBar(message);   
    }, 3000);
    })
  }

  onScrollToEnd(e) {
    if (e === "customer") {
      this.datasentCustomer.pages = this.datasentCustomer.pages + 1; 
      this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(x['data']);
      });
    } else if (e === "contactperson") {
      this.datasentContact.pages = this.datasentContact.pages + 1; 
      this._contactServ.contactSelect(this.datasentContact).then(x => {
        this.contactData = this.contactData.concat(x['data']);
      });
    } else if (e === "address") {
      this.datasentAddress.pages = this.datasentAddress.pages + 1; 
      this._addressServ.getCustomerAddressSelected(this.datasentAddress).then(x => {
        this.addressData = this.addressData.concat(x['data']);
      });
    } 
  }

  onsearchselect(ev, val) {
    if (val === "customer") {
      this.customersData = [];
      this.datasentCustomer.id_customer = null;
      this.datasentCustomer.search = ev.term;
      this.datasentCustomer.pages = 1;
      this.getDataCustomer();
    } else if (val === "contactperson") {
      this.contactData = [];
      this.datasentContact.search = ev.term;
      this.datasentContact.pages = 1;
      this.getDataContactPerson();
    } else if (val === "address") {
      this.addressData = [];
      this.datasentAddress.search = ev.term;
      this.datasentAddress.pages = 1;
      this.getCustomerAddress();
    }
  }

  async onChange(ev)
  { 
    this.contactData = await [];
    this.datasentContact.id_cp = await null;
    this.datasentContact.id_customer = await ev.id_customer;
    this.datasentContact.pages = await 1;
    await this.getDataContactPerson();

    this.addressData = await [];
    this.datasentAddress.id_customer = await ev.id_customer; 
    this.datasentAddress.pages = await 1;
    await this.getCustomerAddress();
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }


}
