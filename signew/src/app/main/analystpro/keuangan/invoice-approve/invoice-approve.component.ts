import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import { KeuanganService } from '../keuangan.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HoldcontractComponent } from '../invoice-approve/holdcontract/holdcontract.component';
import * as _moment from 'moment';
import { InvoiceFormService } from "../invoice/pdf/invoice.service";
const terbilang = require('angka-menjadi-terbilang')
import { CustomerService } from "../../master/customers/customer.service";
import * as globals from "app/main/global";

@Component({
  selector: 'app-invoice-approve',
  templateUrl: './invoice-approve.component.html',
  styleUrls: ['./invoice-approve.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class InvoiceApproveComponent implements OnInit {
  loadingfirst = true;
  load = false;
  total: number;
  from: number;
  to: number;
  pages = 1;
  dataSent = {
    status : 0,
    pages : 1,   
    customers: null,
    invoice_number: null,
    user: null
  }
  dataInvoice = [];
  displayedColumns: string[] = [ 
    'checkbox',
    'no_invoice', 
    'nama_prisipal', 
    'tgl_faktur',
    'tgl_jthTempo',
    'user', 
    'format',
    'userAr',
    'action'
  ];
  checkList = [];
  allComplete: boolean = false;
  searchFilter = false;
  userFinance = [];
  dataCustomer = [];
  datasentCustomer = {
    pages: 1,
    search: null,
  };
  data : any;
  callPdf = null;
  samplePdf = null;
  datasampleSemua = [];

  constructor(
    private _masterServ: KeuanganService,
    private _router: Router,
    private dialog: MatDialog,
    private _menuServ: MenuService,
    private _snackBar: MatSnackBar,
    private invoicePdf: InvoiceFormService,
    private _msterCust: CustomerService,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.DataUserFinance();
    this.getDataCustomer();
  }

  async getData(){
    console.log(this.dataSent)
    await this._masterServ.getDataApprove(this.dataSent).then(x => {
      this.dataInvoice = this.dataInvoice.concat(Array.from(x['data']));
      this.dataInvoice = globals.uniq(this.dataInvoice, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      } 
    });
    this.loadingfirst =  await false;
  }

  paginated(f){
    this.dataInvoice = [];
    this.dataSent.pages = f.pageIndex + 1;
    this.getData();
  }

  sortData(sort: Sort) {
    const data = this.dataInvoice.slice();
    if ( !sort.active || sort.direction === '') {
      this.dataInvoice = data;
      return;
    }
    this.dataInvoice = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {   
        case 'no_invoice': return this.compare(a.no_invoice, b.no_invoice, isAsc);
        case 'nama_prisipal': return this.compare(a.customer_name, b.customer_name, isAsc); 
        case 'tgl_faktur': return this.compare(a.tgl_faktur, b.tgl_faktur, isAsc);
        case 'tgl_jthTempo': return this.compare(a.tgl_jatuhtempo, b.tgl_jatuhtempo, isAsc);
        case 'user': return this.compare(a.customer_name, b.customer_name, isAsc);        
        default: return 0; 
      }
    });
  }
  
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.dataInvoice == null) {
      return;
    }
    if(completed == true)
    {
      this.dataInvoice.forEach(t => t.completed = completed);
      this.dataInvoice.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.dataInvoice.forEach(t => t.completed = completed);
      this.checkList = [];
    }
  }

  updateAllComplete() {
    this.allComplete = this.dataInvoice != null && this.dataInvoice.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.dataInvoice == null) {
      return false;
    }
    return this.dataInvoice.filter(t => t.completed).length > 0 && !this.allComplete;      
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
  }

  approveInvoice(){
    let u = [];
    this.checkList.forEach(x => {
      if(x.checked){
        u = u.concat({
          id: x.id, 
          checked : x.checked
        })
      }
    })
    this._masterServ.approveInvoice(u).then(y => {
      this.load = true;
      let message = {
        text: 'Successfully approve',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.checkList = []
        this.dataInvoice = [];
        this.getData();
        this.load = false;
      },1000)
    })
  }

  cancelInvoice(){
    let u = [];
    this.checkList.forEach(x => {
      if(x.checked){
        u = u.concat({
          id: x.id, 
          checked : x.checked
        })
      }
    })
    this._masterServ.cancelInvoice(u).then(y => {
      this.load = true;
      let message = {
        text: 'Cancel Invoice',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.checkList = []
        this.dataInvoice = [];
        this.getData();
        this.load = false;
      },1000)
    })
  }

  holdContract(){
    console.log(this.checkList)
    this._masterServ.HoldContract(this.checkList).then(y => {
      this.load = true;
      let message = {
        text: 'Hold Contract',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.load = false;
      },1000)
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  ModalHold(){
    let dialogCust = this.dialog.open(HoldcontractComponent, {
      panelClass:'hold-dialog',
      
      width: '100%',
    });

    dialogCust.afterClosed().subscribe(async ( result) => {
      await console.log(result); 
      this.dataInvoice = await [];
      await this.getData();
    }); 
  }

  cancelChecklist(){
    console.log(this.checkList)
    this.checkList = [];
    this.getData();
  }
 


  clickFilter(param)
  {   
      this.searchFilter = param
      if(this.searchFilter == false){
        this.dataInvoice = [];
        this.dataSent.status = null;
        this.dataSent.user = null;
        this.loadingfirst = true;
        this.getData();
      } 
      
  }

  async getValCustomer(ev){
    console.log(ev);
    this.dataInvoice = await [];
    this.dataSent.customers = await ev.id_customer;
    await this.getData();
  }

  async DataUserFinance(){
    await this._masterServ.getDataUser().then(x => {
        this.userFinance = this.userFinance.concat(x);
        this.userFinance = globals.uniq(this.userFinance, (it) => it.employee_id);
        console.log(this.userFinance);
    });
    this.loadingfirst =  await false;
  } 

  getDataCustomer() {
    console.log(this.datasentCustomer);
    this._msterCust
        .getDataCustomers(this.datasentCustomer)
        .then((x) => {
            this.dataCustomer = this.dataCustomer.concat(
                Array.from(x["data"])
            );
            this.dataCustomer = globals.uniq(
                this.dataCustomer,
                (it) => it.id_customer
            );
        });
  }

  onsearchselect(ev, val){
    if (val === "customer") {
      this.dataCustomer = [];
      this.datasentCustomer.search = ev.term;
      this.datasentCustomer.pages = 1;
      this.getDataCustomer();
    }
  }

  onScrollToEnd(e) {
    if (e === "customer") {
        this.datasentCustomer.pages = this.datasentCustomer.pages + 1;
        this._msterCust
            .getDataCustomers(this.datasentCustomer)
            .then((x) => {
                this.dataCustomer = this.dataCustomer.concat(x["data"]);
                console.log(this.dataCustomer);
            });
    }
  }

  async openInvoice(id){

    this.datasampleSemua = [];
    await this._masterServ.invoiceDetails(id).then( async x => {
        this.callPdf = await x;
        console.log(this.callPdf)
        
      });
    //cek diskon
    let checkDiscount = this.callPdf.invoice_detail[0].kontrakuji.payment_condition.discount_lepas;
      if(checkDiscount < 1){
        console.log(id)
        await this._masterServ.getDataInvoiceDetail(id).then( async x => {
            this.samplePdf = await x;
            console.log(this.samplePdf)
            this.samplePdf.forEach((x,i) => {
                this.datasampleSemua = this.datasampleSemua.concat({ 
                  idsample: x.id_sample,
                  nosample: x.transaction_sample.no_sample,
                  samplename: x.transaction_sample.sample_name,
                  statuspengujian: x.transaction_sample.statuspengujian.name,
                  price: x.transaction_sample.price,
                  tgl_selesai: x.transaction_sample.tgl_selesai,
                  discount : x.transaction_sample.discount
                });
              });
            console.log( this.datasampleSemua)
          });
      }else{
        console.log(id)
        await this._masterServ.getDataInvoiceDetail(id).then( async x => {
            this.samplePdf = await x;
            let ngantuk = this.samplePdf.map(oop => oop.transaction_sample.price).reduce((a,b) => a + b)
            let discountLepas = (checkDiscount/ngantuk)*100;
            console.log(discountLepas);

            this.samplePdf.forEach((x,i) => {
                this.datasampleSemua = this.datasampleSemua.concat({ 
                  idsample: x.id_sample,
                  nosample: x.transaction_sample.no_sample,
                  samplename: x.transaction_sample.sample_name,
                  statuspengujian: x.transaction_sample.statuspengujian.name,
                  price: x.transaction_sample.price,
                  tgl_selesai: x.transaction_sample.tgl_selesai,
                  discount : x.transaction_sample.price*discountLepas/100
                });
              });
            console.log( this.datasampleSemua)
          });
      }  
      this.data = await {
        no_invoice: this.callPdf.no_invoice,        
        customer: this.callPdf.customer.customer_name,
        cust_penghubung:  this.callPdf.contactperson.name,
        cust_addres: this.callPdf.cust_address.address,
        telp: this.callPdf.invoice_detail[0].kontrakuji.customers_handle.telp,
        phone : this.callPdf.invoice_detail[0].kontrakuji.customers_handle.phone ,
        fax: this.callPdf.invoice_detail[0].kontrakuji.customers_handle.fax,
        kontrak: this.callPdf.invoice_detail[0].kontrakuji.contract_no,
        no_po: this.callPdf.no_po,
        no_faktur: this.callPdf.no_faktur,
        tgl_faktur:  _moment(new Date(this.callPdf.tgl_faktur)).format("YYYY-MM-DD"),
        tgl_jatuh_tempo: this.callPdf.tgl_jatuh_tempo == '' ? '-' : _moment(new Date(this.callPdf.tgl_jatuhtempo)).format("YYYY-MM-DD"),
        tgl_berita_acara: this.callPdf.tgl_berita_acara == '' ? '-' :  _moment(this.callPdf.tgl_berita_acara).format('DD MMMM YYYY'),
        other_ref: this.callPdf.description,
        termin: this.callPdf.termin == null ? '-' : this.callPdf.termin,
        id_kontrakuji: 's',
        samples: this.datasampleSemua,       
        no_rekening: 's',
        rek: this.callPdf.rek == true ? 'Y' : 'N',
        split: this.callPdf.split == true ? 'Y' : 'N',
        totalcostsample: this.callPdf.totalcostsample,
        samplingfee: this.callPdf.samplingfee,
        ingfees: this.callPdf.ingfees,
        ppn : this.callPdf.ppn,
        discount : this.callPdf.discount,
        priceSubTotal : this.callPdf.subtotal,
        downpayment: this.callPdf.dp,
        remainingpayment : this.callPdf.remainingpayment,
        terbilang: terbilang(this.callPdf.remainingpayment),
        conditionInvoice : this.callPdf.invoice_condition[0].status,
        printed : 0
      }
      await console.log(this.data);
      await this.invoicePdf.generatePdf(this.data);
      this.dataInvoice = await [];
      await this.getData();
  }

  async search()
  {
    console.log(this.dataSent)
      this.dataInvoice = await [];
      await this.getData();
  }

  async reset()
  {
      this.dataSent.invoice_number = await '';
      this.dataSent.customers =  await'';
      this.dataSent.user = await'';
      this.dataInvoice = await [];
      await this.getData();
  }
 


}
