
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
import { ProductsService } from "../../products.service";
import { MatTable } from "@angular/material/table";
import { timeStamp } from "console";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { KeuanganService } from "../../../analystpro/keuangan/keuangan.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddnewcontactComponent } from "./addnewcontact/addnewcontact.component";

@Component({
  selector: 'app-contractadd',
  templateUrl: './contractadd.component.html',
  styleUrls: ['./contractadd.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ContractaddComponent implements OnInit {
  products = [
    { 
      value: 0, 
      viewValue: '-', 
      selected : true
    },
    { 
      value: 14, 
      viewValue: 'Media RTU', 
      selected : false
    },
    { 
      value: 20, 
      viewValue: 'Dioxine Udara' , 
      selected : false
    },
  ];

  load = false;
  formdata = {
    type_product : '',
    customer : '',
    contactperson : '',
    telp : '',
    phone : '',
    address : '',
    tgl_terima : '',
    estimasi : '', 
    desc : '',
    penawaran : '',
    memo_internal : '',
    products : [],
    price_product : 0,
    discount : 0,
    shipping_cost : 0,
    subtotal : 0,
    ppn : 0,
    total : 0,
    remainingpay : 0,
    payment : 0,
    bank : '',
    tgl_bayar: '',
    info_payment : ''
  }

  product_form = {
    price : 0,
    unit : 0,
    subtotal : 0,
    discount: 0,
    total : 0,
    kode_media : '',
    product_name : '',
    no_katalog : '',
  }

  datasentCustomer = {
    pages : 1,
    search : null
  }
  totalcust : number;
  fromcust : number;
  tocust : number;
  customersData = [];

  datasentContact = {
    pages : 1,
    search : null,
    id: null
  } 
  totalcont : number;
  fromcont : number;
  tocont : number;
  contactData = [];

  datasentAddress = {
    pages : 1,
    search : null,
    id: null
  } 
  totaladdr : number;
  fromaddr : number;
  toaddr : number;
  addressData = [];

  datasendProduct = {
    pages : 1,
    search : null,
    id: null
  }
  totalprdct : number;
  fromprdct : number;
  toprdct : number;
  productData = [];

  displayedColumns: string[] = [
    "no",
    "kode_media",
    "product_name",
    "no_katalog",
    "price",
    "unit",
    "subtotal",
    "discount",
    "total",
    "action",
  ];
  @ViewChild("tableproducts") tableProducts: MatTable<any>;
  productvalue : any;  
  allProductSelect = [];
  bankAccount = [];
  
  discdisabled = true;
  selectDisable = true;
  
  constructor(
    private _customersServ: CustomerService,
    private _route: Router,
    private _matDialog: MatDialog,
    private _productServ: ProductsService,
    private _keuanganServ : KeuanganService,
    private _snackBar: MatSnackBar,
  ) { }

    ngOnInit(): void {
      this.getDataCustomer();
      this.bankAccounts();
    }

    getDataCustomer()
    {
      this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(Array.from(x['data']));
        this.customersData = globals.uniq(this.customersData, (it) => it.id_customer);
        this.totalcust = x['total'];
        this.fromcust = x['from'] - 1;
        this.tocust = x['to'];
      });
    } 

    async getValCustomer(ev)
    {
      await console.log(ev);
      this.datasentContact.id = await ev.id_customer
      this.datasentAddress.id = await ev.id_customer
      this.contactData = await [];
      this.addressData = await [];
      await this.getDataContactPerson();
      await this.getCustomerAddress();
    }


    async getDataContactPerson()
    {        
      this.contactData = await [];
      await this._productServ.contactPerson(this.datasentContact)
      .then( async x => {
        let b = [];
        b = await b.concat(Array.from(x['data']));
        await b.forEach(x => {
          if(x.contact_person != null){
            this.contactData = this.contactData.concat({
                id_contact : x.id_cp,
                contact_name : x.contact_person.name
            })
          }               
        })
        this.contactData = await globals.uniq(this.contactData, (it) => it.id_contact);
        this.totalcont = await x['total'];
        this.fromcont = await x['from'] - 1;
        this.tocont = await x['to'];
      })
    }

    async getCustomerAddress(){
      await this._productServ.getAddressListData(this.datasentAddress).then( async x => {
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

  async bankAccounts() {
    await this._keuanganServ.getBankAccount().then((x) => {
        this.bankAccount = this.bankAccount.concat(x);
    });
  }


  onScrollToEnd(e) {
    if (e === "customer") {
      this.datasentCustomer.pages = this.datasentCustomer.pages + 1; 
      this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(x['data']);
      });
    } else if (e === "contactperson") {
      this.datasentContact.pages = this.datasentContact.pages + 1; 
      this._productServ.contactPerson(this.datasentContact).then(x => {
        this.contactData = this.contactData.concat(x['data']);
      });
    } else if (e === "address") {
      this.datasentAddress.pages = this.datasentAddress.pages + 1; 
      this._productServ.contactPerson(this.datasentAddress).then(x => {
        this.addressData = this.addressData.concat(x['data']);
      });
    } else if (e === "product") {
      this.datasendProduct.pages = this.datasendProduct.pages + 1; 
      this._productServ.getListProducts(this.datasendProduct).then(x => {
        this.productData = this.productData.concat(x['data']);
      });
    }
  }

  onsearchselect(ev, val) {
    if (val === "customer") {
      this.customersData = [];
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
    } else if (val === "product") {
      this.productData = [];
      this.datasendProduct.search = ev.term;
      this.datasendProduct.pages = 1;
      this.getProducts();
    }
  }
  
  getDateEstimate(ev)
  {
    this.formdata.estimasi = momentbussiness(ev.value, "YYYY-MM-DD").businessAdd(6)._d
  }

  async selectProduct()
  { 
    this.productData = await [];
    let x = await parseInt(this.formdata.type_product);
    switch (x) {
        case 14:
          this.getProducts();
          this.selectDisable = false;
            break;
        case 20:
          this.getProductsDioxine();
          this.selectDisable = false;
            break;
        default:
            alert("none");
            break;
    }
  }

  async getProducts(){
    await this._productServ.getListProducts(this.datasendProduct).then(x => {
      this.productData = this.productData.concat(Array.from(x['data']));
      this.productData = globals.uniq(this.productData, (it) => it.id);
      this.totalprdct = x['total'];
      this.fromprdct = x['from'] - 1;
      this.toprdct = x['to'];
    });
    
  } 

  async getProductsDioxine(){
    this.productData = await [];
    await this._productServ.getListProductsDioxine(this.datasendProduct).then(x => {
      this.productData = this.productData.concat(Array.from(x['data']));
      this.productData = globals.uniq(this.productData, (it) => it.id);
      this.totalprdct = x['total'];
      this.fromprdct = x['from'] - 1;
      this.toprdct = x['to'];
    });
    this.selectDisable = false;
  } 

  async getValueProducts(ev)
  {
    this.productvalue = ev;
    this.product_form.kode_media =  ev.kode_media;
    this.product_form.product_name = ev.product_name;
    this.product_form.no_katalog =  ev.no_katalog;
    this.product_form.price =  ev.price;    
    this.product_form.unit = 0;
    this.product_form.subtotal = 0;
    this.product_form.discount = 0;
    this.product_form.total = 0;
    console.log(this.productvalue)
  }

  async changeUnit(ev)
  {
    console.log(ev)
    let sub  = await this.product_form.price * this.product_form.unit
    this.product_form.subtotal = await sub;
    this.product_form.total = await sub - this.product_form.discount;
    this.discdisabled = await false;
  }

  async changediscount(ev)
  {
  let tot: number = await this.product_form.subtotal - this.product_form.discount;
  this.product_form.total = tot;
  console.log(this.product_form)
    
  }


  async submitValueProduct()
  {
    this.productvalue.unit = await this.product_form.unit;
    this.productvalue.subtotal = await this.product_form.subtotal;
    this.productvalue.discount = await this.product_form.discount;
    this.productvalue.total = await this.product_form.total;
    this.formdata.products = await this.formdata.products.concat(this.productvalue) 
    this.product_form.unit = await 0;
    this.product_form.subtotal =  await 0;    
    this.product_form.discount =  await 0;
    this.product_form.total =  await 0;
    this.product_form.price =  await null;

     await this.pricingTotal();
  }

  async deleteSelectProduct(i)
  {
      this.formdata.products = await this.formdata.products.filter((v, ind) => {
        return ind != i
      })
      await this.pricingTotal();
  }

  async pricingTotal()
  {
    await  console.log(this.formdata.products)
    this.formdata.price_product = await this.formdata.products.map((x) => x.subtotal).reduce((a, b) => a + b);
    this.formdata.discount = await this.formdata.products.map((x) => x.discount).reduce((a, b) => a + b);
    console.log(this.formdata.discount)
    await this.subTotal();
  }

  async subTotal()
  {
    let s =   this.formdata.shipping_cost == null ? 0 : this.formdata.shipping_cost
    console.log(typeof this.formdata.shipping_cost)
    this.formdata.subtotal = await (this.formdata.price_product  + s) - this.formdata.discount;
    console.log(this.formdata.subtotal)
    this.ppnPrice();
  }

  async ppnPrice()
  {
    this.formdata.ppn = await this.formdata.subtotal * 11/100;
    console.log(this.formdata.ppn)
    await this.totalsPrice()
  }

  async totalsPrice()
  {
    let dp = await this.formdata.payment == null ? 0 : this.formdata.payment
    this.formdata.total = await this.formdata.subtotal + this.formdata.ppn;
    this.formdata.remainingpay = await this.formdata.total - dp;
    await console.log(this.formdata.remainingpay)
  }

  async saveContract()
  {
    await console.log(this.formdata.customer)
    if(this.formdata.customer == '' || this.formdata.contactperson == '' || this.formdata.address == ''){
      await Swal.fire({
        title: "Customer or Contact Person or Address  is Empty",
        text: "data must be filled. please check again!",
        icon: "warning",
        confirmButtonText: "Ok",
    });            
    }else{
      await this._productServ.contractAddMediartu(this.formdata).then(async y => {
        this.load = true;
        let message =  await {
          text: 'Data Succesfully Updated',
          action: 'Done'
        }
        setTimeout(async ()=>{  
          this.load = await false;
        await this.openSnackBar(message);  
        let x = await parseInt(this.formdata.type_product);
        switch (x) {
            case 14:
              this._route.navigateByUrl("products/contract/mediartu")
                break;
            case 20:
              this._route.navigateByUrl("products/contract/dioxin")
                break;
            default:
                alert("none");
                break;
        }
      }, 3000);
      } )
    }
    
  }

  payment(ev)
  {
    console.log(ev)
      this.formdata.remainingpay = this.formdata.total - this.formdata.payment;
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  addNewContact() : void {
    let dialogCust = this._matDialog.open(AddnewcontactComponent, {
      panelClass: 'add-contact-dialog',
      width : '400px',
      disableClose: true,
      data: { customer : this.formdata.customer }
    });

    dialogCust.afterClosed().subscribe((result) => {
      // console.log(result)
      if(result.ev == false){
          this.contactData = [];
          this.getDataContactPerson();
          this.formdata.telp = result.telp;
          this.formdata.phone = result.phone
      }       
    });
  }

}
