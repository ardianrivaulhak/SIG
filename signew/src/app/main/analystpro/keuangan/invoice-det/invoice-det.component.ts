import { map } from 'rxjs/operators';
// import { forEach } from 'lodash';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { KeuanganService } from '../keuangan.service';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../master/customers/customer.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { InvoiceFormService } from "../invoice/pdf/invoice.service";
import { ContractService } from "../../services/contract/contract.service";
import * as global from "app/main/global";
import { MatTable } from "@angular/material/table";
import { CommonModule, CurrencyPipe} from '@angular/common';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { controllers } from 'chart.js';
const terbilang = require('angka-menjadi-terbilang')


@Component({
  selector: 'app-invoice-det',
  templateUrl: './invoice-det.component.html',
  styleUrls: ['./invoice-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class InvoiceDetComponent implements OnInit {

    @ViewChild("table") MatTable: MatTable<any>;
    @ViewChild("tablePrice") MatTablePrice: MatTable<any>;
    load = false;
    invoicedata : any
    idinvoice : any;
    noKontrak = [];
    contractSelect = [];
    dataKeuangan = [];
    dataFilterContract = {
        pages : 1,
        type : "paginate",
        category : null,
        month: null,
        customers: null,
        contact_person: null,
        date: null,
        search : null
      }
    customerSelect : string[];
    dataSample = [];
    customerAdd = [];
    contactPersonSelect = [];
    contactAdd = [];
    alamatcustomer = [];
    alamatSelect = [];
    alamatAdd = [];
    sampleAdd = [];
    allDataAkg  = null;
    priceAkg = null;
    akgData = [];
    allSampling  = null;
    samplingData = []
    pricePPN = null;
    allPPN = null;
    allDP  = null;
    discountTotal = null;
    allDisc  = null;
    priceSubTotal = null;
    allSubtotal = null
    priceDP = null;
    priceTotal = null;
    allTotal = null;
    terbilangan: string = null
    format = null;    
    split = null
    
    priceTotalSample = null;
    allTotalSample = null

    priceSampling = null;
    delSample = null;
    
  checked : boolean;
    // =============================================== //
    dataStatus = [
      {
          id: 1,
          name: "Invoice",
      },
      {
          id: 3,
          name: "Sampling Fee",
      },
  ];
  selectStatus: any;
  selectDate: any;
  selectDueDate: any;
  datacontract = [];
  total : number;
  from : number;
  to : number;
  datasentCustomer = {
    pages : 1,
    search : null
  }
  datasentCP = {
    pages : 1,
    search : null
  } 
  datasentTaxAddres = {
    pages : 1,
    search : null
  }
  customersData = [];
  cpData =[];
  idCP: any;

  dataTaxAddres = [];
  idAlamatPajak: any;

  hideViewContract = false;

  datasampleSemua = [];
  datasample2 = [];
  dataSource = []
  selectedValue = ['1']
  
  dataMou = [];

  invoiceForm : FormGroup;
  dataalamat = {
    pages: 1,
    search: null,
    id_customer: null,
  };
 
  idCustomerAddres: any;
  tgl_fakturs= null;
  tgl_jatuh_tempo = null;
  tgl_berita_acara = null;

  taxAddress = [];
  allsampleData = [];
  displayedColumns: string[] = ["no", "nosample", "samplename",  "statuspengujian",  "price","discount", "total", "action"];

 
  mouStatusPengujian = [];
  mouDiskon = [];
  mouspecial = true;
  allData = false;
  rekeningCheck = false;
  splitCheck = false;
  editSampling = null;
  editIng = null;
  editDP = null;
  remainingpayment = null;

  ppnData = [
    {
        name: "10%",
        value: 0.10,
    },
    {
        name: "11%",
        value: 0.11,
    },
]

selectPPN = null
selectFormat = 1;
disabledForm : boolean

  constructor(
    private _router: Router,
    private _menuServ: MenuService,
    private _masterServ: KeuanganService,
    private _customersServ: CustomerService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private invoicePdf: InvoiceFormService,
    private _kontrakServ: ContractService,
    private currencyPipe : CurrencyPipe
  ) {
    this.idinvoice = this._actRoute.snapshot.params['id'];
   }

  status_invoice : any;
  sementara = [];


  ngOnInit(): void {
      
    this.getDataDetails();
  }

  async getDataDetails(){
    await this._masterServ.invoiceDetails(this.idinvoice).then( async x => {
        this.invoicedata = await x;
      });
      console.log(this.invoicedata)
      this.invoiceForm = await this.createLabForm();
      await this.invoiceForm.controls['cust_penghubung'].setValue(this.invoicedata.idcp);
      await this.invoiceForm.controls['id_cust'].setValue(this.invoicedata.idcust);
      await  this.invoiceForm.controls['cust_addres'].setValue(this.invoicedata.id_cust_address);
      this.customerSelect = await this.invoicedata.idcust
      this.contactPersonSelect = await this.invoicedata.idcp
      this.alamatSelect = await this.invoicedata.id_cust_address      
      this.allDataAkg = await this.invoicedata.ingfees
      this.allSampling = await this.invoicedata.samplingfee
      this.allDP = await this.invoicedata.invoice_detail[0].kontrakuji.payment_data.length < 1 ? 0 : this.invoicedata.invoice_detail[0].kontrakuji.payment_data.map(x => x.payment).reduce((a,b) => a + b)
      this.status_invoice = await this.invoicedata.invoice_condition[0].status
      this.noKontrak = await this.invoicedata.invoice_detail[0].kontrakuji.contract_no
      this.format = await this.invoicedata.format;
      this.split = await this.invoicedata.split
      this.splitInvoice = await this.invoicedata.split
      this.checked = await  this.split == 1 ? true : false
      this.tgl_jatuh_tempo = await  this.invoicedata.tgl_jatuhtempo
      this.tgl_berita_acara = await this.invoicedata.tgl_berita_acara
      this.selectDate = await this.invoicedata.tgl_faktur
      this.selectPPN = await this.invoicedata.ppn /this.invoicedata.subtotal
      this.selectFormat = await this.invoicedata.format;
      await this.getDataSample();
      await this.getDataInvoice();
      await this.getData();
      await this.getPrice('new');
      this.sementara = await this.uniq(this.invoicedata.invoice_detail, (it) => it.id_contract);
      console.log(this.contractSelect)
  }

  async getDataSample(){
    let checkDiscount = this.invoicedata.invoice_detail[0].kontrakuji.payment_condition.discount_lepas;
    let totalDiscSample = []
    await this._masterServ.getDataSampleInvoice( this.idinvoice).then( async x => {      
      totalDiscSample = totalDiscSample.concat(x);
    })
    console.log(totalDiscSample)
    let resultDiscountSample = totalDiscSample.map(x => x.transaction_sample.discount).reduce((a,b) => a + b)
    // console.log(resultDiscountSample)
    if(resultDiscountSample > 0){
        await this._masterServ.getDataSampleInvoice( this.idinvoice).then( async x => {
            let b = await []
            b = b.concat(x);
          
            await b.forEach( z => {
                this.dataSample = this.dataSample.concat({
                    id : z.transaction_sample.id,
                    no_sample : z.transaction_sample.no_sample,
                    sample_name : z.transaction_sample.sample_name,
                    statuspengujian : z.transaction_sample.statuspengujian,
                    price : z.transaction_sample.price,
                    discount : Math.round(z.transaction_sample.discount),
                    total : z.transaction_sample.price - z.transaction_sample.discount
                })
            })
          this.allTotalSample = await this.dataSample.map(x => x.price).reduce((a,b) => a + b)
          this.allDisc = this.dataSample.map(x => x.discount).reduce((a,b) => a + b)
        });   
    }else{
        await this._masterServ.getDataSampleInvoice( this.idinvoice).then( async x => {
            let b = await []
            b = b.concat(x);
            let discountLepas = checkDiscount;
            let per =(discountLepas/this.invoicedata.invoice_detail[0].kontrakuji.payment_condition.biaya_pengujian)*100;
            
            await b.forEach( z => {
                this.dataSample = this.dataSample.concat({
                    id : z.transaction_sample.id,
                    no_sample : z.transaction_sample.no_sample,
                    sample_name : z.transaction_sample.sample_name,
                    statuspengujian : z.transaction_sample.statuspengujian,
                    price : z.transaction_sample.price,
                    discount : Math.round(z.transaction_sample.price  * per/100) ,
                    total : Math.round(z.transaction_sample.price - (z.transaction_sample.price * per/100))
                })
            })
          
          this.allTotalSample = await this.dataSample.map(x => x.price).reduce((a,b) => a + b)
          this.allDisc = this.dataSample.map(x => x.discount).reduce((a,b) => a + b)
        });   
    }
     

    // this.totalNewData()
  }

  async getTermin()
  {
    console.log(this.customersData)
    await this.invoiceForm.controls.termin.setValue(this.customersData[0].termin);
    console.log(this.invoiceForm)
  }

  async getDataInvoice(){
    console.log(this.idinvoice)
    await this._masterServ.getDataInvoiceDetail(this.idinvoice).then( async x => {
        this.contractSelect = this.contractSelect.concat(x);
        console.log(this.contractSelect)        
      });
    this.contractSelect = await this.contractSelect.map(x => x.id_contract )
     this.contractSelect = this.uniq(this.contractSelect, (it) => it.id_contract);
    console.log(this.contractSelect)
    
    
   
    await this.getDataContract();
  }

  disableBUtton = true;
  async onChangeToggle(ev) {
    this.splitCheck = await ev.checked;
    await this.splitCheck == true ?  this.disableBUtton = await false : await this.splitCheck == false ? this.disableBUtton = await true : this.disableBUtton = await false
    await console.log(this.disableBUtton)
    await this.MatTable.renderRows();
    this.dataSample = await []
    await this.getDataSample()
    //
  }

  splitInvoice : any;
  async changeRadio(ev)
  {
    ev.value == 1 ? this.splitInvoice = true : this.splitInvoice = false
    await console.log(ev.value)
    await ev.value == 1 ? this.disableBUtton = await false : ev.value == 0 ? this.disableBUtton = await true : this.disableBUtton = await true
    await console.log(this.disableBUtton)
    this.dataSample = await []
    await this.getDataSample()
  }

   async getData() 
  {
    if( this.allData == true){
        console.log("true all")
        this.getAllDataCustomer();
        this.getAllDataCP();
        this.getDataCustomerAddress();
    }else{
        
        console.log("not all")
        this.getDataCustomer();
        this.getDataCP();
        this.getDataCustomerAddress();
    }
  
  }

  async priceData(ev){
    await this.nullPrice();
    await this.getPrice(ev);
  }


  async getPrice(ev){
    console.log(this.dataSample)
    this.priceTotalSample = await this.allTotalSample
    this.priceAkg =  await this.allDataAkg
    this.priceSampling =  await this.allSampling
    // ev == await 'new' ? this.discountTotal = await  Math.round(this.invoicedata.discount) : this.discountTotal =+ await Math.round(this.dataSample.map(x => x.discount).reduce((a,b) => a + b)); 
    this.discountTotal =+ await Math.round(this.dataSample.map(x => x.discount).reduce((a,b) => a + b)) 
    this.priceSubTotal =  await (this.priceTotalSample - this.discountTotal) + this.priceSampling + this.priceAkg ;    
    // this.pricePPN = await this.invoicedata.ppn 
    this.pricePPN = await Math.round(this.priceSubTotal*11/100);
    this.priceDP = await this.allDP;
    this.priceTotal = await this.priceTotalSample + this.priceSampling + this.priceAkg + this.pricePPN - this.discountTotal - this.priceDP;
    this.remainingpayment = await Math.round((((this.priceTotalSample - this.discountTotal) + this.priceSampling + this.priceAkg) + this.pricePPN )- this.priceDP)
    this.terbilangan = await terbilang(this.remainingpayment)  
    
   
    
    // this.priceAkg = await this.invoicedata.ingfees;
    // this.priceSampling = await this.invoicedata.samplingfee;
    // this.discountTotal = await this.invoicedata.discount;
    // this.priceSubTotal = await  this.invoicedata.subtotal;
    // this.pricePPN = await this.invoicedata.ppn
    // this.priceDP = await  this.invoicedata
    // this.priceTotal = await this.invoicedata
    // this.terbilangan = await terbilang(this.invoicedata.remainingpayment)    
    // this.remainingpayment = await this.invoicedata.remainingpayment;
    
  } 
  
  nullPrice(){      
    this.priceTotalSample = null
    this.priceAkg = null
    this.priceSampling = null
    this.pricePPN = null
    this.discountTotal = null
    this.priceSubTotal =  null
    this.priceDP = null
    this.priceTotal = null
  }



  async getDataContract(){
    this.dataFilterContract.search =  this.noKontrak 
    console.log(this.dataFilterContract.search)
    await this._masterServ.getDataKontrak(this.dataFilterContract).then(x => {
      this.datacontract = this.datacontract.concat(Array.from(x['data']));
      this.datacontract = this.uniq(this.datacontract, (it) => it.id_kontrakuji);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      } 
    });
    console.log(this.datacontract)
    this.invoiceForm = this.createLabForm()
        console.log(this.invoiceForm)
  }

  async getDataContractAll(){
    await this._masterServ.getDataKontrak(this.dataFilterContract).then(x => {
      this.datacontract = this.datacontract.concat(Array.from(x['data']));
      this.datacontract = this.uniq(this.datacontract, (it) => it.id_kontrakuji);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      } 
      console.log(this.datacontract);
     this.invoiceForm = this.createLabForm()
    console.log(this.invoiceForm)
    });
  }

  async getValKontrak(ev){
    await console.log(ev);
    this.dataSample= await [];
    this.dataSample = ev;
    ev.forEach(x => {
        x.customers_handle.id_customer != this.customerSelect ? 
        this.customerAdd.push(x.customers_handle.id_customer) : x.customers_handle.id_customer;
        x.customers_handle.id_cp != this.contactPersonSelect ? 
        this.contactAdd.push(x.customers_handle.id_cp) : x.customers_handle.id_cp;

        x.akg_trans.length  > 0 ?  
        x.akg_trans.forEach(p => {
          this.akgData = this.akgData.concat({
            akg : p.total
          }) 
        }) : this.akgData = [ { akg : 0} ]
        console.log(this.akgData)

        x.sampling_trans.length  > 0 ?  
        x.sampling_trans.forEach(p => {
            this.samplingData = this.samplingData.concat({
                sample : p.total
            }) 
          }) : this.samplingData = [ { sample : 0} ]

          
          
    });
    console.log(this.contractSelect)

    this.allDataAkg = await this.akgData.map( x => x.akg).reduce((a,b) => a + b);
    this.allSampling = await this.samplingData.map( x => x.sample).reduce((a,b) => a + b);
    this.allPPN = null;
    // this.allPPN = await this.allTotalSample * 10/100;  
    // this.allSubtotal = null; 
    // this.allSubtotal = await (this.allTotalSample + this.allSampling + this.allDataAkg + this.allPPN ) - this.allDisc;
    // this.allTotal = null;
    // this.allTotal = await this.allTotalSample + this.allSampling + this.allDataAkg + this.allPPN - this.allDisc - this.allDP;
    // console.log(this.allSubtotal)

    this.customersData = await [];
    this.customersData.push(this.customerAdd)

    this.cpData = await [];
    this.cpData.push(this.contactAdd)
    await this.addDataSample();
    await this.getData(); 
    console.log(this.customersData)

  }

  // async totalNewData(){
   
  //   // this.allDisc = await this.dataSample.map(x => x.payment_condition.discount_lepas).reduce((a,b) => a + b)
  //   // this.allDP = await this.dataSample.map(x => x.payment_condition.downpayment).reduce((a,b) => a + b)
  //   // this.allPPN = null;
  //   // this.allPPN = await this.allTotalSample * 10/100;  
  //   // this.allSubtotal = null; 
  //   // this.allSubtotal = await (this.allTotalSample + this.allSampling + this.allDataAkg + this.allPPN ) - this.allDisc;
  //   // this.allTotal = null;
  //   // this.allTotal = await this.allTotalSample + this.allSampling + this.allDataAkg + this.allPPN - this.allDisc - this.allDP;
  //   // console.log(this.allSubtotal)
  //   // this.priceData();
  // }

  async getAllDataCustomer(){      
    this.customersData = [];
   await this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
      this.customersData = this.customersData.concat(Array.from(x['data']));
      this.customersData = this.uniq(this.customersData, (it) => it.id_customer);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to'];
      }
    });
    await console.log(this.customersData);
  } 

  async getDataCustomer(){
      this.customersData = [];
      this.customerAdd.push(this.customerSelect)
    await this._masterServ.getSelectedCustomer(this.customerAdd).then(x => {
       this.customersData = this.customersData.concat(Array.from(x['data']));
       this.customersData = this.uniq(this.customersData, (it) => it.id_customer);
       if(!this.total){
         this.total = x['total'];
         this.from = x['from'] - 1;
         this.to = x['to'];
       }
     });
     await console.log(this.customersData);
   } 

  

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  onsearchselect(ev, val) {
    if (val === "kontrak") {
        this.datacontract = [];
        this.dataFilterContract.search = ev.term;
        this.dataFilterContract.pages = 1;
        this.getDataContractAll();
    }
    if (val === "customer") {
        this.customersData = [];
        this.datasentCustomer.search = ev.term;
        this.datasentCustomer.pages = 1;
        this.getAllDataCustomer();
    }
    if (val === "cp") {
        this.cpData = [];
        this.datasentCP.search = ev.term;
        this.datasentCP.pages = 1;
        this.getAllDataCP();
    }
    if (val === "address") {
        this.alamatcustomer = [];
        this.dataalamat.search = ev.term;
        this.dataalamat.pages = 1;
        this.getDataCustomerAddress();
    }
  }

  async addDataSample(){
    console.log(this.dataSample)
    let a = await []
    let checkDiscount = await this.dataSample[this.dataSample.length - 1].payment_condition.discount_lepas;
    //let b = await this.dataSample[this.dataSample.length - 1].transactionsample;
   
  //   this.dataSample.map( x =>  a = x.transactionsample)
  //   if(checkDiscount < 1){
  //         await b.forEach( z => {
  //           console.log(z)
  //             a = a.concat({
  //                 id : z.id,
  //                 no_sample : z.no_sample,
  //                 sample_name : z.sample_name,
  //                 statuspengujian : z.statuspengujian,
  //                 price : z.price,
  //                 discount : z.discount,
  //                 total : z.price - z.discount
  //             })
              
  //         this.dataSample.push(a)
  //         })
  //         console.log(a)
  //       // this.allTotalSample = await this.dataSample.map(x => x.price).reduce((a,b) => a + b)
  //       // this.allDisc = this.dataSample.map(x => x.discount).reduce((a,b) => a + b)
  //     }  
  // console.log(this.dataSample)
  // //else{
  // //     await this._masterServ.getDataSampleInvoice( this.idinvoice).then( async x => {
  // //         let b = await []
  // //         b = b.concat(x);
  // //         let discountLepas = checkDiscount;
  // //         let per =(discountLepas/this.invoicedata.invoice_detail[0].kontrakuji.payment_condition.biaya_pengujian)*100;
          
  // //         await b.forEach( z => {
  // //             this.dataSample = this.dataSample.concat({
  // //                 id : z.transaction_sample.id,
  // //                 no_sample : z.transaction_sample.no_sample,
  // //                 sample_name : z.transaction_sample.sample_name,
  // //                 statuspengujian : z.transaction_sample.statuspengujian,
  // //                 price : z.transaction_sample.price,
  // //                 discount : z.transaction_sample.price  * per/100 ,
  // //                 total : Math.round(z.transaction_sample.price - (z.transaction_sample.price * per/100))
  // //             })
  // //         })
        
  // //       this.allTotalSample = await this.dataSample.map(x => x.price).reduce((a,b) => a + b)
  // //       this.allDisc = this.dataSample.map(x => x.discount).reduce((a,b) => a + b)
  // //     });   
  // // }
  this.dataSample.forEach( x => {
    this.dataSample = []
        x.transactionsample.forEach( z => {
            a = a.concat({
                id : z.id,
                no_sample : z.no_sample,
                sample_name : z.sample_name,
                statuspengujian : z.statuspengujian,
                price : z.price,
                discount : z.discount,
                total : z.price - z.discount
            })
       
        })
        this.dataSample.push(a)
   })
   this.dataSample = this.dataSample[0];
   this.allTotalSample = 0;
   this.allTotalSample = await this.dataSample.map(x => x.price).reduce((a,b) => a + b) - this.dataSample.map(x => x.discount).reduce((a,b) => a + b) 
   
   this.priceData('add');
  }

  async getValCustomer(ev){   
    this.dataalamat.id_customer = await ev.id_customer;
    if(ev.warning == 1)
    {
        await Swal.fire({
            title: "INFO PENTING!",
            text: "MOHON PILIH ALAMAT YANG SESUAI PADA FAKTUR",
            icon: "warning",
            confirmButtonText: "Ok",
          });
    }
  } 

  getAllDataCP(){
    this._masterServ.getDataContactPersons(this.datasentCP).then(x => {
      this.cpData = this.cpData.concat(x['data']);
      this.cpData = this.uniq(this.cpData, (it) => it.id_cp);
      console.log(this.cpData);
    })
  }

  getDataCP(){
    this.cpData = [];
    this.contactAdd.push(this.contactPersonSelect)
    this._masterServ.getSelectedContact(this.contactAdd).then(x => {
      this.cpData = this.cpData.concat(x['data']);
      this.cpData = this.uniq(this.cpData, (it) => it.id_cp);
      console.log(this.cpData);
    })
  }

  async getValCP(ev){
    await console.log(ev);
    this.idCP = ev.id_cp;
  }

  async getDataCustomerAddress() {
    // this.alamatAdd.push(this.alamatAdd)
    this.customersData = [];
    this.alamatcustomer = await [];
    console.log(this.customerAdd)
    this._masterServ.getSelectedDataAddressCustomer(this.customerAdd).then(x => {
        this.alamatcustomer = this.alamatcustomer.concat(x['data']);
        this.alamatcustomer = this.uniq(this.alamatcustomer, (it) => it.id_address);
        console.log(this.alamatcustomer);
      })
       
  }
  
  async getValAddress(ev){
    await console.log(ev);
    this.idCustomerAddres = ev.id_address;
  }

  createLabForm(): FormGroup {       
    return this._formBuild.group({
      id_cust: [this.customerSelect],
      cust_penghubung:[this.contactPersonSelect],
      cust_addres:[this.alamatSelect],
      other_ref: this.invoicedata.description == null ||  this.invoicedata.description == '' ? '' : this.invoicedata.description,
      no_invoice:this.invoicedata.no_invoice, 
      no_faktur:this.invoicedata.no_faktur,
      no_po:this.invoicedata.no_po,
      termin: this.invoicedata.termin,
      no_rekening: this.invoicedata.no_rekening,
      tgl_faktur: this.selectDate,
      tgl_jatuh_tempo:  this.tgl_jatuh_tempo == null ? '' :  this.tgl_jatuh_tempo,
      tgl_berita_acara: this.tgl_berita_acara == null ? '' :  this.tgl_berita_acara,
      samplingfee: this.invoicedata.samplingfee,
      ingfees: this.invoicedata.ingfees,
      downpayment: this.invoicedata.downpayment,
      format : this.format,
      split : this.split

    })
  }

   

async deleteRow(i){
    console.log(i)
    this.delSample = this.dataSample[i].price
    await console.log({
        i: this.dataSample[i],
    });    
    console.log(this.delSample)
    this.allTotalSample = this.allTotalSample - this.delSample
    console.log(this.allTotalSample)
    await this.dataSample.splice(i,1);
    this.MatTable.renderRows();
    this.priceData('add');
    console.log(this.dataSample)
  }


  async editForm(){
    // let sample = await [];
    // await this.dataSample.forEach( x => {
    //     console.log(x)
    //     sample = sample.concat(x.id);
      // });
    if(this.notif_dic == true){
      await Swal.fire({
          title: "Discount error",
          text: "there is a problem with the discount!",
          icon: "warning",
          confirmButtonText: "Ok",
      });
  }else{
    let data = await {
      id : parseInt(this.idinvoice),
      no_invoice: this.invoiceForm.value.no_invoice,
      no_faktur: this.invoiceForm.value.no_faktur,        
      no_rekening: this.invoiceForm.value.no_rekening,
      rek: this.rekeningCheck == true ? 'Y' : 'N',
      no_po: this.invoiceForm.value.no_po,
      totalcostsample: this.priceTotalSample,
      samplingfee: this.priceSampling,
      ingfees: this.priceAkg,
      tgl_faktur: this.invoiceForm.value.tgl_faktur == '' ? null : _moment(this.invoiceForm.value.tgl_faktur).format('YYYY-MM-DD'),
      tgl_jatuh_tempo: this.invoiceForm.value.tgl_jatuh_tempo == '' || this.invoiceForm.value.tgl_jatuh_tempo == "Invalid date" ? null : _moment(this.invoiceForm.value.tgl_jatuh_tempo).format('YYYY-MM-DD') ,
      tgl_berita_acara: this.invoiceForm.value.tgl_berita_acara == '' ? null : _moment(this.invoiceForm.value.tgl_berita_acara).format('YYYY-MM-DD'),
      other_ref: this.invoiceForm.value.other_ref,
      termin: this.invoiceForm.value.termin == null ? null : this.invoiceForm.value.termin,
      priceSubTotal : this.priceSubTotal,
      downpayment:this.priceDP,
      ppn : this.priceSubTotal*this.selectPPN,
      discount : this.discountTotal,
      remainingpayment : this.priceTotal,
      id_kontrakuji: this.contractSelect[0],
      idsample: this.dataSample,
      id_cust:  this.invoiceForm.value.id_cust,
      cust_penghubung: this.invoiceForm.value.cust_penghubung,
      cust_addres: this.invoiceForm.value.cust_addres,
      terbilang: this.terbilangan,
      format:  this.selectFormat, 
      split:  this.splitInvoice

    }
    console.log(data)
    if(this.totDiscount == undefined){
        await this._masterServ.editInvoice(data).then(x => { 
          this.load = true;
          let message = {
            text: 'Data Succesfully Updated',
            action: 'Done'
          }
          setTimeout(()=>{
            this.openSnackBar(message);
            // this.getDataDetails();
            // this.dataSample = [];
            this._route.navigateByUrl("analystpro/finance-invoice");
            this.load = false;
          },2000)
        });
    console.log(data)
    }else{
      await this._masterServ.updateDataWithDiscount(data).then(x => { 
            this.load = true;
            let message = {
              text: 'Data Succesfully Updated',
              action: 'Done'
            }
            setTimeout(()=>{
              this.openSnackBar(message);
              // this.getDataDetails();
              // this.dataSample = [];
              this._route.navigateByUrl("analystpro/finance-invoice");
              this.load = false;
            },2000)
          });
          console.log(data)
    }
   
  }
    
  }
  
// ------------------------------------------------------------------------------------------------------------------// 
// ------------------------------------------------------------------------------------------------------------------//
// ------------------------------------------------------------------------------------------------------------------//
  onScrollToEnd(e) {
    if (e === "customer") {
      this.datasentCustomer.pages = this.datasentCustomer.pages + 1; 
      this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(x['data']);
        console.log(this.customersData);
      });
    }
    if (e === "CP") {
      this.datasentCP.pages = this.datasentCP.pages + 1; 
      this.getDataCP();
    }
    if (e === "taxAddress") {
      this.datasentTaxAddres.pages = this.datasentTaxAddres.pages + 1; 
      this.getDataTaxAddres();
    }
    if (e === "no_kontrak") {
      this.dataFilterContract.pages = this.dataFilterContract.pages + 1; 
      this.getDataContract();
    }
    
  }



 

  getDataTaxAddres(){
    this._masterServ.getDataTaxAddress(this.datasentTaxAddres).then(x => {
      this.dataTaxAddres = this.dataTaxAddres.concat(Array.from(x['data']));
      console.log(this.dataTaxAddres);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }
    })
  }

  async getValTaxAddress(ev){
    await console.log(ev);
    this.idAlamatPajak = ev.id_taxaddress;
  }

  

  async getDateInvoice(ev) {
    let temp = ev.value;
    console.log(temp)
    let a = new Date(ev.value)
    await this.invoiceForm.controls.tgl_faktur.setValue(a);
    console.log(this.invoiceForm.controls.tgl_faktur)
    let cek = this.dataMou.length < 1 ? this.invoiceForm.get('termin').value : this.dataMou[0].termin;
    let tes = parseInt(cek)
    console.log(tes)
    temp.setDate(temp.getDate() + tes);
    let b = new Date(temp)
    await this.invoiceForm.controls.tgl_jatuh_tempo.setValue(b);
    console.log(this.invoiceForm.controls.tgl_jatuh_tempo)
    console.log(this.invoiceForm.controls.tgl_faktur)
}

  

  // inputSampling(ev){
  //   this.priceSampling = ev
  //   console.log(this.priceSampling)
  //   //this.priceData();
  // }

  // inputIng(ev){
  //   this.priceAkg = ev
  //   console.log(this.priceAkg)
  //   //this.priceData();
  // }

  // inputDP(ev){
  //   this.priceDP = ev
  //   console.log(this.priceDP)
  //   //this.priceData();
  // }


  async getMou() {
    this.mouStatusPengujian = await [];
    this.mouDiskon = await [];
    this.mouspecial = await true;
    console.log(this.dataKeuangan[0].customers_handle.customers.id_customer)

    await this._kontrakServ
        .getDataMou(this.dataKeuangan[0].customers_handle.customers.id_customer) 
       
        .then((p) => {
           
            if (
                
                p["status"] !== false &&
                p["message"] === "Data Mou Found"
                
            ) {
                this.dataMou = this.dataMou.concat(Array.from(p['data'])) 
                console.log(this.dataMou)
                this.invoiceForm.controls.termin.setValue(this.dataMou[0].termin)
                global.swalsuccess(`${p["message"]}`, "success");
                this.mouStatusPengujian = p["data"][0]["detail"].filter(
                    (x) => x.condition == 1
                );

                this.mouDiskon = p["data"][0]["detail"].filter(
                    (x) => x.condition == 2
                );

                this.mouspecial =
                    p["data"][0]["detail"].filter((x) => x.condition == 3)
                        .length > 0
                        ? false
                        : true;
            } else if (
                p["message"].message === "Data Mou Expired" &&
                p["status"] == false
            ) {
                global.swalwarning(
                    p["message"].message,
                    `At ${p["data"][0].end_date}`
                );
            } else {
                return;
            }
        })
        //  .then((x) => {  
        //     this.dataMou = this.dataMou.concat(Array.from(x['data'])) 
        // })
        .then(( ) => console.log(this.dataMou))
        console.log(this.mouStatusPengujian)
        console.log(this.mouspecial)
}

  

  async saveForm(){
   
    // console.log(this.dataSample)
    // let sample = await [];
    // await this.dataSample.forEach( x => {
    //   sample = sample.concat(x.id);
    // });
    // await console.log(this.dataSample);

    if( this.invoiceForm.value.tgl_faktur === "" ){
      await Swal.fire({
        title: 'Incomplete Data',
        text: 'Please complete the blank data!',
        icon: 'warning', 
        confirmButtonText: 'Ok'
      });
    } else { 
      let data = await {
        no_invoice: this.invoiceForm.value.no_invoice,
        no_faktur: this.invoiceForm.value.no_faktur,
        tgl_faktur: _moment(this.invoiceForm.value.tgl_faktur).format('YYYY-MM-DD'),
        tgl_jatuh_tempo: _moment(this.invoiceForm.value.tgl_jatuh_tempo).format('YYYY-MM-DD'),
        tgl_berita_acara: _moment(this.invoiceForm.value.tgl_berita_acara).format('YYYY-MM-DD'),
        other_ref: this.invoiceForm.value.other_ref,
        termin: this.invoiceForm.value.termin == null ? null : this.invoiceForm.value.termin,
        id_kontrakuji: this.noKontrak,
        idsample: this.dataSample,
        id_cust:  this.invoiceForm.value.id_cust,
        cust_penghubung: this.invoiceForm.value.cust_penghubung,
        cust_addres: this.invoiceForm.value.cust_addres,
        no_rekening: this.invoiceForm.value.no_rekening,
        rek: this.rekeningCheck == true ? 'Y' : 'N',
        split: this.splitCheck == true ? 'Y' : 'N',
        totalcostsample: this.priceTotalSample,
        samplingfee: this.priceSampling,
        ingfees: this.priceAkg,
        ppn : this.pricePPN,
        discount : this.discountTotal,
        priceSubTotal : this.priceSubTotal,
        downpayment:this.priceDP,
        remainingpayment : this.priceSubTotal + (this.priceSubTotal*this.selectPPN)
      }      
      console.log(data)
      await this._masterServ.saveData(data).then(x => { 
        this.load = true;
        let message = {
          text: 'Data Succesfully Updated',
          action: 'Done'
        }
        setTimeout(()=>{
          this.openSnackBar(message);
          this.getDataDetails();
          this.dataSample = [];
          this.load = false;
        },2000)
      });
     }
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  


  disableForm(){
    console.log(this.invoiceForm)
    this.invoiceForm.get('termin').disable();
    this.invoiceForm.get('no_rekening').disable();
  }

  async enableForm(){
    await this.invoiceForm.get('no_rekening').enable();
  }
  custNamee : any
  nameee : any
  addresss : any
  
  async openInvoice(){
      
    console.log(this.invoiceForm.value)
    this.dataSample.forEach((x,i) => {
        this.datasampleSemua = this.datasampleSemua.concat({ 
          idsample: x.id,
          nosample: x.no_sample,
          samplename: x.sample_name,
          statuspengujian: x.statuspengujian.name,
          price: x.price,
          tgl_selesai: x.tgl_selesai,
          discount : x.discount
        });
      });

    console.log(this.datasampleSemua)

    // this.custNamee = await null
    // this.nameee = await null
    // this.addresss = await null

    // await this._masterServ.checkCustomer(this.invoiceForm.value.id_cust).then((x : any) => { this.custNamee = x.customer_name })
    // await this._masterServ.checkCP(this.invoiceForm.value.cust_penghubung).then((x : any) => {   this.nameee = x.name  })
    // await this._masterServ.checkAddress(this.invoiceForm.value.cust_addres).then((x : any) => {   this.addresss = x.address })

    let data = await {
        no_invoice: this.invoiceForm.value.no_invoice,        
        customer: this.customersData[0].customer_name,
        cust_penghubung: this.cpData[0].name,
        cust_addres: this.alamatcustomer[0].address,
        telp:this.cpData[0].telpnumber,
        fax: this.cpData[0].fax,
        kontrak: this.noKontrak,
        no_po: this.invoiceForm.value.no_po,
        no_faktur: this.invoiceForm.value.no_faktur,
        tgl_faktur: _moment(this.invoiceForm.value.tgl_faktur).format("YYYY-MM-DD"),
        tgl_jatuh_tempo: this.invoiceForm.value.tgl_jatuh_tempo == '' ? '-' : _moment(this.invoiceForm.value.tgl_jatuh_tempo).format("YYYY-MM-DD"),
        tgl_berita_acara: this.invoiceForm.value.tgl_berita_acara == '' ? '-' : _moment(this.invoiceForm.value.tgl_berita_acara).format("YYYY-MM-DD"),
        other_ref: this.invoiceForm.value.other_ref,
        termin: this.invoiceForm.value.termin == null ? '-' : this.invoiceForm.value.termin,
        id_kontrakuji: this.noKontrak,
        samples: this.datasampleSemua,       
        no_rekening: this.invoiceForm.value.cust_addres,
        rek: this.rekeningCheck == true ? 'Y' : 'N',
        split: this.splitInvoice == true ? 'Y' : 'N',
        totalcostsample: this.priceTotalSample,
        samplingfee: this.splitCheck == true ? this.editSampling : this.invoicedata.samplingfee,
        ingfees: this.splitCheck == true ? this.editIng : this.priceAkg,
        ppn : this.pricePPN,
        discount : this.discountTotal,
        priceSubTotal : this.priceSubTotal,
        downpayment: this.splitCheck == true ? this.priceDP : this.priceDP,
        remainingpayment : this.priceTotal,
        terbilang: this.terbilangan,
        conditionInvoice :  this.status_invoice
      }
    await console.log(data);
    this.invoicePdf.generatePdf(data);
  }

  async clickAllData(param)
  {   
      this.allData = param
      this.getData();
    // if( this.allData == true){

    //     console.log('true all data')
    //     this.customersData = await [];
    //     this.cpData = await [];
    //     this.alamatcustomer = await [];

    //     this.getDataCustomer();
    //     //this.getDataCustomerAddress();
    //     this.getDataCP();

    // }else{

    //     console.log('false all data')
    //     this.customersData = await [];
    //     this.cpData = await [];
    //     this.alamatcustomer = await [];
    //     await this.dataKeuangan.forEach( (x, i) => {
            
    //         // for select into customer 
    //         let a =  {  
    //             id_customer: this.dataKeuangan[i].customers_handle.customers.id_customer,
    //             customer_name: this.dataKeuangan[i].customers_handle.customers.customer_name
    //             }
    //         // for select into contact persons 
    //         let c =  {
    //             id_cp: this.dataKeuangan[i].customers_handle.contact_person.id_cp,
    //             name: this.dataKeuangan[i].customers_handle.contact_person.name
    //             }

    //         // for select into address 
    //         let m =  {
    //             id_address: this.dataKeuangan[i].cust_address.id_address,
    //             address: this.dataKeuangan[i].cust_address.address
    //             }

    //         this.customersData.push(a)
    //         this.cpData.push(c)
    //         this.alamatcustomer.push(m)
    //     })

    // }
      
  }

  checkRek(check: boolean) 
  {
    this.rekeningCheck = check;
    this.rekeningCheck == true ?  this.enableForm() : this.disableForm();
  }

  async checkSplit(checkSplit: boolean) 
  {
    console.log(checkSplit)
    this.splitCheck = await checkSplit;
    await this.invoiceForm.controls.samplingfee.setValue(this.priceSampling)
    await this.invoiceForm.controls.ingfees.setValue(this.priceAkg)
    await this.invoiceForm.controls.downpayment.setValue(this.priceDP)
    console.log([this.priceSampling, this.priceAkg, this.priceDP])
  }

  async downloadExcel(){
    console.log(this.dataSample);
      let b = [];
      console.log(b)
      await this.dataSample.forEach(x => {
        b = b.concat({
          id : x.id,
          sample_name : 'Jasa pengujian sampel ' + x.sample_name,
          no_sample : x.no_sample,
        })
      })
      
      const fileName = 'report ' + this.noKontrak + '.xlsx' ; 
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(b);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'data');  

      XLSX.writeFile(wb, fileName);
  }

  updateNew()
  {
    console.log(this.idinvoice)
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._masterServ.updateNewData(this.idinvoice).then(x => {
        })
        Swal.fire(
          'Updated!',
          'Your imaginary file has been updated.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your cancel update data :)',
          'error'
        )
      }
      setTimeout(()=>{
          
        this.dataSample = [];
        this.invoicedata = [];
        this.getDataDetails();
      },1000)
    })
  }

  calcAgain()
  {
    console.log(this.idinvoice)
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._masterServ.calculationAgain(this.idinvoice).then(x => {
        })
        Swal.fire(
          'Updated!',
          'Your imaginary file has been updated.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your cancel update data :)',
          'error'
        )
      }
      setTimeout(()=>{
          
        this.dataSample = [];
        this.invoicedata = [];
        this.getDataDetails();
      },1000)
    })
  }

  totDiscount: number;
  notif_dic= false;
  sisa: number;


  async discount(ev)
  {
      console.log(ev)
      console.log(this.dataSample)

      this.totDiscount = await Math.round(this.dataSample
      .map((x) => x.discount)
      .reduce((a, b) => a + b))

      await this.totDiscount > await this.discountTotal ? this.notif_dic = await true : this.notif_dic =  await false
      await console.log(this.notif_dic)
      this.sisa = await Math.round(this.discountTotal - this.totDiscount)
  } 

  async inputDiscount(ev, i){
    // console.log(this.discountTotal)
    this.priceTotalSample = await this.allTotalSample
    this.priceAkg =  await  this.splitInvoice == true ? this.priceAkg :  this.allDataAkg
    this.priceSampling =   await  this.splitInvoice == true ? this.priceSampling :  this.allSampling
    this.discountTotal = await  this.splitInvoice == true ? this.discountTotal : this.allDisc
    this.priceSubTotal =  await (this.priceTotalSample - this.discountTotal) + this.priceSampling + this.priceAkg ;    
    this.pricePPN = await this.invoicedata.ppn;
    this.priceDP =  await  this.splitInvoice == true ?  this.priceDP :  this.allDP;
    this.priceTotal = await this.priceTotalSample + this.priceSampling + this.priceAkg + this.pricePPN - this.discountTotal - this.priceDP;
    this.terbilangan = await terbilang(this.priceTotal)
  }


}