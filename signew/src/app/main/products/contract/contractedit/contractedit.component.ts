import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from "xlsx";
import * as globals from "app/main/global";
let momentbussiness = require("moment-business-days");
import { ProductsService } from "../../products.service";
import { MatTable } from "@angular/material/table";
import { timeStamp } from "console";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { KeuanganService } from "../../../analystpro/keuangan/keuangan.service";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
import { ContactPersonService  } from "app/main/analystpro/master/contact-person/contact-person.service";
import {CustomerAddressService  } from "app/main/analystpro/master/customer-address/customer-address.service";
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-contractedit',
  templateUrl: './contractedit.component.html',
  styleUrls: ['./contractedit.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ContracteditComponent implements OnInit {
  load = false;
  contract : any;
  dataSend = {
    id_product: this._activedRoute.snapshot.params['id_product']
  }
  dataForm = {
    id_product_contract: this.dataSend.id_product,
    product: '',
    contract_number: '',
    id_customer : '',
    id_cp : '',
    telp : '',
    mobile: '',
    id_address: '',
    tgl_terima: '',
    estimasi: '',
    desc: '',
    penawaran: '',
    memo_internal: '',
    products : [],
    deleteProduct : [],
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
    deleteProduct : [],
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
  customersData = [];
  datasentCustomer = {
    pages : 1,
    search : null,
    id_customer : ''
  }
  totalcust : number;
  fromcust : number;
  tocust : number;

  contactData = [];
  datasentContact = {
    pages : 1,
    search : null,
    id_cp: '',
    id_customer: ''
  } 
  totalcont : number;
  fromcont : number;
  tocont : number;

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
  totalprdct : number;
  fromprdct : number;
  toprdct : number;
  productData = [];
  datasendProduct = {
    pages : 1,
    search : null,
    id: null
  }
  productvalue : any;  
  product_form = {
    id_master_mediartu : null,
    price : 0,
    unit : 0,
    subtotal : 0,
    discount: 0,
    total : 0,
    kode_media : '',
    product_name : '',
    no_katalog : '',
  }

  discdisabled = true;
  selectDisable = true;
  dataSendProduct = {
    id_product_contract: ''
  }
  dataProductValue = [];
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
  bankAccount = [];


  constructor(
    private _productServ: ProductsService,
    private _activedRoute: ActivatedRoute,
    private _customersServ: CustomerService,
    private _contactServ : ContactPersonService,
    private _addressServ : CustomerAddressService,
    private _keuanganServ : KeuanganService,
    private _route: Router,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.bankAccounts();
  }

  async bankAccounts() {
    await this._keuanganServ.getBankAccount().then((x) => {
        this.bankAccount = this.bankAccount.concat(x);
    });
  }

  async getData()
  {
    await this._productServ.getDetailContract(this.dataSend).then(x => {
        this.contract = x ;
    });
        this.dataForm.product = await this.contract.product_dioxin.length > 0 ? 'Dioxin' : this.contract.product_media_r_t_u.length > 0 ? 'Media RTU' : null;
        this.dataForm.contract_number = await this.contract.contract_number;
        this.dataForm.telp = await this.contract.telp_number;
        this.dataForm.mobile = await this.contract.mobile_number;
        await this.getDataCustomer();
        await this.getDataContactPerson();
        await this.getCustomerAddress();
         this.dataForm.tgl_terima = await this.contract.tgl_terima;
         this.dataForm.estimasi = await this.contract.estimasi;
         this.dataForm.desc = await this.contract.desc;
         this.dataForm.penawaran = await this.contract.po_number;
         this.dataForm.memo_internal = await this.contract.internal_memo;
       
         if(this.dataForm.product == 'Dioxin'){
            await this.getProductsDioxine();
         }
         if(this.dataForm.product == 'Media RTU'){
            await this.getProductMediaRTU();
         }
         await this.getValueProduct();

         this.dataForm.price_product = await this.contract.productprice.price;
         this.dataForm.discount = await this.contract.productprice.discount;
         this.dataForm.shipping_cost = await this.contract.productprice.shippingcost;
         this.dataForm.subtotal = await this.contract.productprice.subtotal;
         this.dataForm.ppn = await this.contract.productprice.ppn;
         this.dataForm.total= await this.contract.productprice.total;
         this.dataForm.payment= await this.contract.productprice.product_payment.length < 1 ? 0 : this.contract.productprice.product_payment;
         this.dataForm.remainingpay = await this.dataForm.total - this.dataForm.payment ;
         await console.log(this.contract)
  } 


  async getProductMediaRTU(){
    await this._productServ.getListProducts(this.datasendProduct).then(x => {
      this.productData = this.productData.concat(Array.from(x['data']));
      this.productData = globals.uniq(this.productData, (it) => it.id);
      this.totalprdct = x['total'];
      this.fromprdct = x['from'] - 1;
      this.toprdct = x['to'];
    });
    this.selectDisable = await false;
    await console.log(this.productData)
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
    this.selectDisable = await false;
  } 

  async getValueProduct()
  {
    this.dataSendProduct.id_product_contract = await this.dataSend.id_product;
    await this._productServ.getValProduct(this.dataSendProduct).then( async x => {
      console.log(x)
      let arr = [];
      arr = await arr.concat(x)
      await arr.forEach( z => {
        this.dataProductValue = this.dataProductValue.concat({
            id: z.id,
            id_master_mediartu : z.id_mstr_mediartu,
            product_name : z.master_media_rtu.product_name,
            kemasan: z.master_media_rtu.kemasan,
            no_katalog: z.master_media_rtu.no_katalog,
            kode_media: z.master_media_rtu.kode_media,
            unit: z.unit,
            price: z.price,
            discount: z.discount,
            subtotal: z.subtotal,
            total: z.total,
            deleted_at : z.deleted_at
        })
      })
      this.dataProductValue = globals.uniq(this.dataProductValue, (it) => it.id);
   })
  this.dataForm.products = await this.dataForm.products.concat(this.dataProductValue);
  console.log(this.dataForm.products)
  }

  async getDataCustomer()
  {
    this.datasentCustomer.id_customer = await this.contract.id_customer;
    await this._customersServ.customerSelect(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(Array.from(x['data']));
        this.customersData = globals.uniq(this.customersData, (it) => it.id_customer);
        this.totalcust = x['total'];
        this.fromcust = x['from'] - 1;
        this.tocust = x['to'];
    });
    this.dataForm.id_customer = await this.customersData[0].id_customer;
    
   
  } 

  async getDataContactPerson()
  {        
    this.datasentContact.id_customer = await this.customersData[0].id_customer;
    this.contactData = await [];
    this.datasentContact.id_cp = await this.contract.id_cp;
    await this._contactServ.contactSelect(this.datasentContact)
    .then( async x => {
        let b = [];
        b = await b.concat(Array.from(x['data']));    
        console.log(b)
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
        this.dataForm.id_cp = await this.contactData[0].id_contact;
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
    this.dataForm.id_address = this.contract.id_address
  }

  getDateEstimate(ev)
  {
    this.dataForm.estimasi = momentbussiness(ev.value, "YYYY-MM-DD").businessAdd(6)._d
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
      //this.getProducts();
    }
  }

  // async getProducts(){
  //   await this._productServ.getListProducts(this.datasendProduct).then(x => {
  //     this.productData = this.productData.concat(Array.from(x['data']));
  //     this.productData = globals.uniq(this.productData, (it) => it.id);
  //     this.totalprdct = x['total'];
  //     this.fromprdct = x['from'] - 1;
  //     this.toprdct = x['to'];
  //   });
    
  // } 

  async getValueProducts(ev)
  {
    console.log(ev)
    this.productvalue = ev;
    this.product_form.id_master_mediartu =  ev.id;
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
    this.productvalue.id_master_mediartu =  await this.product_form.id_master_mediartu;
    this.productvalue.unit = await this.product_form.unit;
    this.productvalue.subtotal = await this.product_form.subtotal;
    this.productvalue.discount = await this.product_form.discount;
    this.productvalue.total = await this.product_form.total;
    this.dataForm.products = await this.dataForm.products.concat(this.productvalue) 
    this.product_form.unit = await 0;
    this.product_form.subtotal =  await 0;    
    this.product_form.discount =  await 0;
    this.product_form.total =  await 0;
    this.product_form.price =  await null;

    console.log(this.productvalue)
    await this.pricingTotal();
  }

  async pricingTotal()
  {
    await  console.log(this.dataForm.products)
    this.dataForm.price_product = await this.dataForm.products.map((x) => x.subtotal).reduce((a, b) => a + b);
    this.dataForm.discount = await this.dataForm.products.map((x) => x.discount).reduce((a, b) => a + b);
    console.log(this.dataForm.discount)
    await this.subTotal();
  }

  async subTotal()
  {
    let s =   this.dataForm.shipping_cost == null ? 0 : this.dataForm.shipping_cost
    console.log(typeof this.dataForm.shipping_cost)
    this.dataForm.subtotal = await (this.dataForm.price_product  + s) - this.dataForm.discount;
    console.log(this.dataForm.subtotal)
    this.ppnPrice();
  }

  async ppnPrice()
  {
    this.dataForm.ppn = await this.dataForm.subtotal * 11/100;
    console.log(this.dataForm.ppn)
    await this.totalsPrice()
  }

  async totalsPrice()
  {
    console.log(this.dataForm)
    let dp = await this.dataForm.payment == null ? 0 : this.dataForm.payment
    this.dataForm.total = await this.dataForm.subtotal + this.dataForm.ppn;
    this.dataForm.remainingpay = await this.dataForm.total - dp;
    await console.log(dp)
    await this.payment(dp)
  }

  payment(ev)
  {
    console.log(ev)
    this.dataForm.remainingpay = this.dataForm.total - this.dataForm.payment;
  }

  async deleteSelectProduct(i)
  {
    
      this.dataForm.products = await this.dataForm.products.filter((v, ind) => {
        console.log([i, ind])
        ind == i ?  this.dataForm.deleteProduct = this.dataForm.deleteProduct.concat(v) : ''  
        ind != i ?  this.dataForm.products = this.dataForm.products.concat(v) : ''    
        return ind != i
      })
      await console.log(this.dataForm)
      await this.pricingTotal();
  }

  saveContract()
  {
    console.log(this.dataForm)
    this._productServ.contractEditMediartu(this.dataForm).then(async y => {
      this.load = true;
      let message =  await {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(async ()=>{  
        this.load = await false;
       await this.openSnackBar(message);   
       await this._route.navigateByUrl("products/contract/mediartu");
    }, 3000);
    } )
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }


  

}
