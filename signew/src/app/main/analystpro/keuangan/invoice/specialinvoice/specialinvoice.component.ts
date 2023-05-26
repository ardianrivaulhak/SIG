import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { KeuanganService } from '../../keuangan.service';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import { ModalDateKeuanganComponent } from "../../modal-date-keuangan/modal-date-keuangan.component";
import { PaymentcashierComponent } from "../../paymentcashier/paymentcashier.component";
import * as XLSX from 'xlsx';
import { CustomerService } from "../../../master/customers/customer.service";
import * as _moment from 'moment';
import { InvoiceFormService } from "../../invoice/pdf/invoice.service";
const terbilang = require('angka-menjadi-terbilang')
import * as moment from 'moment';
import { ContractService } from "../../../services/contract/contract.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'app/main/login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceSamplingFormService } from "../pdf/invoiceSampling.service";

@Component({
  selector: 'app-specialinvoice',
  templateUrl: './specialinvoice.component.html',
  styleUrls: ['./specialinvoice.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class SpecialinvoiceComponent implements OnInit {

  access = []; 
  searchFilter = false;
  loadingfirst = true;
  total: number;
  from: number;
  to: number;
  pages = 1;
  dataSent = {
    pages : 1,    
    invoice_number : null,
    status : null,
    status_invoice : null,    
    users: null,
    customers: null,    
    invoice_date: null,
    po_number : null,
    download : false
  }
  userFinance = []
  displayedColumns: string[] = [ 
    'no_invoice', 
    'nama_prisipal',    
    'tgl_faktur',
    'tgl_jthTempo',
    'status',
    'stats',
    'user', 
    'userAr',
    'action'
  ];
  datainvoice = [];

  status = [
    {
      "id": 0,
      "name": "Created"

    },
    {
      "id": 1,
      "name": "Approve"

    },
    {
      "id": 2,
      "name": "Cancel"

    },
  ];

  status_invoice = [
    {
      "id": 'Y',
      "name": "Hold"

    },
    {
      "id": 'N',
      "name": "Unhold"

    },
  ];

  selectStatus = 0;
  dataUser = [];
  dataInvoce = [];
  dataCustomer = [];
  dataCategory = [];
  dataTglfaktur = [];
  dataTgljatuhtempo = [];
  dataContract =[];
  tglExcel: number;
  dataExcel = [];
  callPdf = null;
  samplePdf = null;
  datasampleSemua = [];

  data : any;
  cobaData = null;
  cancelSearch = false;
  load = false;
  notshowing = true;
  mine = [];
  resultForm : FormGroup;

  customersData = [];
  datasentCustomer = {
    pages: 1,
    search: null,
  };

  dataform = {
    invoice_number : '',
    status:'',
    users:'',
    invoice_date:'',
    customers:'',
    status_invoice:'',
    po_number:''
  }

  
  custNamee : any
  nameee : any
  addresss : any

  constructor(
    private _masterServ: KeuanganService,
    private _router: Router,
    private dialog: MatDialog,
    private _menuServ: MenuService,
    private _msterCust: CustomerService,
    private invoicePdf: InvoiceFormService,
    private _kontrakServ: ContractService,
    private PdfServ: PdfService,
    private _snackBar: MatSnackBar,
    private _loginServ: LoginService,
    private _formBuild: FormBuilder,
    private _samplingPdf : InvoiceSamplingFormService
  ) { }

  ngOnInit(): void {
    this.getMe();
    this.getData();
    this.getCustomer();
    this.DataUserFinance();
  }

  checkauthentication(){
    this._menuServ.checkauthentication(this._router.url).then(x => {
      if(!x.status){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You dont an access to this page !',
        }).then(res => {
          if(res.isConfirmed || res.isDismissed) {
            this._router.navigateByUrl('apps');
          }
        });
      } else {
        this.access = this.access.concat(x.access);
      }
    });
  }

  getMe(){
    this._loginServ.checking_me().then(x => {
      console.log(x[0])
      if(x[0].id_bagian == 2 && x[0].id_level < 18){
        this.notshowing = false;
      }else{
        if(x[0].user_id == 1){          
          this.notshowing = false;
        }else{
          this.notshowing = true;
        }
      }

      this.mine = this.mine.concat(x[0]);
      console.log(this.notshowing)
    });
  }


  async getData(){
    await this._masterServ.getDataSpecial(this.dataSent).then(x => {
      this.datainvoice = this.datainvoice.concat(Array.from(x['data']));
      this.datainvoice = this.uniq(this.datainvoice, (it) => it.id);
      this.total = x['total'];
      this.from = x['from'] - 1;
      this.to = x['to'];
      console.log(this.dataSent);
    })
    .then(() => console.log(this.datainvoice));
    this.loadingfirst =  await false;
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
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

  getDataCustomer() {
    console.log(this.datasentCustomer);
    this._msterCust
        .getDataCustomers(this.datasentCustomer)
        .then((x) => {
            this.dataCustomer = this.dataCustomer.concat(
                Array.from(x["data"])
            );
            this.dataCustomer = this.uniq(
                this.dataCustomer,
                (it) => it.id_customer
            );
            console.log(this.dataCustomer);
            this.total = x["total"];
            this.from = x["from"] - 1;
            this.to = x["to"];
        });
    console.log(this.dataCustomer);
}

  async searchButton(){
      console.log(this.dataform);
      this.dataSent.invoice_number = this.dataform.invoice_number
      this.dataSent.status = this.dataform.status
      this.dataSent.status_invoice =   this.dataform.status_invoice
      this.dataSent.po_number =   this.dataform.po_number
      this.dataSent.users = this.dataform.users
      this.dataSent.customers = this.dataform.customers
      this.dataSent.invoice_date =  this.dataform.invoice_date  == '' ? '' : _moment(new Date(this.dataform.invoice_date)).format("YYYY-MM-DD") 
      console.log(this.dataSent);    
      this.datainvoice = await [];
      this.loadingfirst = await true;
      await this.getData();
  }

  async cancelSearchMark()
  {
    this.dataSent.invoice_number = await ''
    this.dataSent.status  = await ''
    this.dataSent.status_invoice  = await ''
    this.dataSent.po_number  = await ''
    this.dataSent.status  = await ''
    this.dataSent.users  = await ''
    this.dataSent.customers  = await ''
    this.dataSent.invoice_date = await ''
    this.dataform.invoice_number = await ''
    this.dataform.status  = await ''
    this.dataform.status_invoice  = await ''
    this.dataform.po_number  = await ''
    this.dataform.status  = await ''
    this.dataform.users  = await ''
    this.dataform.customers  = await ''
    this.dataform.invoice_date = await ''
    this.datainvoice = await [];
    this.total = await null
    this.from = await null
    this.to = await null
    this.loadingfirst = await true;
    await this.getData();
  }

  async getValStatus(ev){
      console.log(ev.id)
    this.dataSent.status =  await ev.id;
    this.datainvoice = await [];
    this.loadingfirst = await true; 
    await this.getData();
  }

  async searchUser(ev){
    await console.log(ev.employee_id);
     this.dataSent.users = await ev.employee_id;
     this.datainvoice = await [];
    this.loadingfirst = await true; 
    await this.getData();
  }

  getCustomer(){
    let data = {
      pages : 1,
      search: null
    }
    console.log(data);
    this._msterCust.getDataCustomers(data).then(x => {
      console.log("select Succses");
      this.dataCustomer = this.dataCustomer.concat(Array.from(x['data']));
    });
  }

  async getValCustomer(ev){
    console.log(ev);
    this.datainvoice = await [];
    this.dataSent.customers = await ev.id_customer;
    await this.getData();
  }


  paginated(f){
      console.log(f)
    this.datainvoice = [];
    this.dataSent.pages = f.pageIndex + 1;
    this.getData();
  }

  sortData(sort: Sort) {
    const data = this.datainvoice.slice();
    if ( !sort.active || sort.direction === '') {
      this.datainvoice = data;
      return;
    }
    this.datainvoice = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {  
 
        case 'no_invoice': return this.compare(a.no_invoice, b.no_invoice, isAsc);
        case 'nama_prisipal': return this.compare(a.customer_name, b.customer_name, isAsc); 
        case 'no_po': return this.compare(a.no_po, b.no_po, isAsc);
        case 'tgl_faktur': return this.compare(a.tgl_faktur, b.tgl_faktur, isAsc);
        case 'tgl_jthTempo': return this.compare(a.tgl_jatuhtempo, b.tgl_jatuhtempo, isAsc);
        case 'user': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'other_ref': return this.compare(a.other_ref, b.other_ref, isAsc); 
        
        default: return 0; 
      }
    });
  }
  
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  clickFilter(param)
  {   
      this.searchFilter = param
      if(this.searchFilter == false){
        this.datainvoice = [];
        this.dataSent.status = null;
        this.dataSent.users = null;
        this.loadingfirst = true;
        this.getData();
      } 
      
  }
 

  async DataUserFinance(){
      await this._masterServ.getDataUser().then(x => {
          this.userFinance = this.userFinance.concat(x);
          this.userFinance = this.uniq(this.userFinance, (it) => it.employee_id);
          console.log(this.userFinance);
      });
      this.loadingfirst =  await false;
  }

  gotoModulExcel(){
    let dialogCust = this.dialog.open(ModalDateKeuanganComponent, {
      height: "auto",
      width: "500px"
    });
    dialogCust.afterClosed().subscribe(async ( result) => {
      await console.log(result); 
      this.tglExcel = await result.c;
      await this.downloadExcel();
    }); 
  }

  downloadExcel(){
    console.log(this.tglExcel);
    this.dataExcel = []; 
    this._masterServ.getDataExportExcel(this.tglExcel).then(x => {
      console.log(x);   
      this.dataExcel = this.dataExcel.concat(x);
      console.log(this.dataExcel);

        const fileName = 'formatFaktur.xlsx'; 
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'data');  

        XLSX.writeFile(wb, fileName);
    });
  }


  deleteInvoice(id){
    console.log(id)
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._masterServ.deleteInvoice(id).then(x => {
        })
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
      setTimeout(()=>{
        this.datainvoice=[];
        this.loadingfirst =  true;
        this.getData();
      },1000)
    })
  }

  ModalsPayment(){
    let dialogCust = this.dialog.open(PaymentcashierComponent, {
      panelClass:'payment-cashier-dialog',
      
      width: '100%',
    });

    dialogCust.afterClosed().subscribe(async ( result) => {
      await console.log(result); 
      this.datainvoice = await[]
      await this.getData();
    }); 
  }



  async openInvoice(id){
    this.datasampleSemua = [];
    await this._masterServ.invoiceDetails(id).then( async x => {
        this.callPdf = await x;        
      });
      let cekdis = await this.callPdf.invoice_detail.map(x => x.transaction_sample.discount).reduce((a,b) => a + b);
      
      //cek diskon
      let checkDiscount = await this.callPdf.invoice_detail[0].kontrakuji.payment_condition.discount_lepas;  
      if(cekdis > 0) {
        
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
          });
      }else{
        await this._masterServ.getDataInvoiceDetail(id).then( async x => {
            this.samplePdf = await x;
            let ngantuk = this.samplePdf.map(oop => oop.transaction_sample.price).reduce((a,b) => a + b)
            let discountLepas = (checkDiscount/ngantuk)*100;
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
          });
      }
     if(this.callPdf.format == 1 || this.callPdf.format == 4){
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
        await this.invoicePdf.generatePdf(this.data);
     
     }else{
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
        samples: this.callPdf.invoice_detail[0].kontrakuji.sampling_trans,       
        no_rekening: 's',
        rek: this.callPdf.rek == true ? 'Y' : 'N',
        split: this.callPdf.split == true ? 'Y' : 'N',
        totalcostsample: this.callPdf.totalcostsample,
        samplingfee: this.callPdf.samplingfee,
        ingfees: this.callPdf.ingfees,
        ppn : this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b)*11/100,
        discount : 0,
        // priceSubTotal : this.callPdf.subtotal,
        priceSubtotal : this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b),
        total : this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b) + 
        (this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b)*11/100),
        downpayment: this.callPdf.dp,
        remainingpayment : (this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b) + 
                          (this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b)*11/100)) - this.callPdf.dp,
        terbilang: terbilang(this.callPdf.remainingpayment),
        conditionInvoice : this.callPdf.invoice_condition[0].status,
        printed : 0
      }
      await console.log(this.data)
      await this._samplingPdf.generatePdf(this.data);
     }

     this.datainvoice = await [];
     await this.getData();
  
      
  }

   async printInvoice(id){
    this.datasampleSemua = [];
    await this._masterServ.invoiceDetails(id).then( async x => {
        this.callPdf = await x;
      });
      let cekdis = this.callPdf.invoice_detail.map(x => x.transaction_sample.discount).reduce((a,b) => a + b);
      console.log(cekdis)
      //cek diskon

      let checkDiscount = this.callPdf.invoice_detail[0].kontrakuji.payment_condition.discount_lepas;
      if(cekdis > 0){
        await this._masterServ.getDataInvoiceDetail(id).then( async x => {
            this.samplePdf = await x;
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
          });
      }else{
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
          });
      }

      if(this.callPdf.format == 1 || this.callPdf.format == 4){
        this.data = await {
          id: id,
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
          tgl_faktur: _moment(new Date(this.callPdf.tgl_faktur)).format("YYYY-MM-DD"),
          tgl_jatuh_tempo: this.callPdf.tgl_jatuh_tempo == '' ? '-' : _moment(new Date(this.callPdf.tgl_jatuhtempo)).format('YYYY-MM-DD'),
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
          printed : 1
        }
  
        await console.log(this.data);
        this.invoicePdf.generatePdf(this.data);
      }else{
        console.log(this.callPdf.invoice_detail[0].kontrakuji.sampling_trans)
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
          samples: this.callPdf.invoice_detail[0].kontrakuji.sampling_trans,       
          no_rekening: 's',
          rek: this.callPdf.rek == true ? 'Y' : 'N',
          split: this.callPdf.split == true ? 'Y' : 'N',
          totalcostsample: this.callPdf.totalcostsample,
          samplingfee: this.callPdf.samplingfee,
          ingfees: this.callPdf.ingfees,
          ppn : this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b)*11/100,
          discount : 0,
          // priceSubTotal : this.callPdf.subtotal,
          priceSubtotal : this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b),
          total : this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b) + 
          (this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b)*11/100),
          downpayment: this.callPdf.dp,
          remainingpayment : (this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b) + 
                            (this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b)*11/100)) - this.callPdf.dp,
          terbilang: terbilang(this.callPdf.remainingpayment),
          conditionInvoice : this.callPdf.invoice_condition[0].status,
          printed : 0
        }
        await console.log(this.data)
        await this._samplingPdf.generatePdf(this.data);
      }
      

       await this._masterServ.printedInvoice(this.data).then(x => { 
       
      });
  }

  openPdf(v,val) {
    console.log(v)
        this._kontrakServ.getDataDetailKontrak(v).then((x) => {
          console.log(x)
            this.PdfServ.generatePdf(x,val);
        });
    }



    async openInvoiceTTD(id){
        this.datasampleSemua = [];
        await this._masterServ.invoiceDetails(id).then( async x => {
            this.callPdf = await x;
            console.log( this.callPdf)
          });
          
          let cekdis = this.callPdf.invoice_detail.map(x => x.transaction_sample.discount).reduce((a,b) => a + b);
          console.log(cekdis)
          
          let checkDiscount = this.callPdf.invoice_detail[0].kontrakuji.payment_condition.discount_lepas;

          if(cekdis > 0){
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
          });
          }else{
            await this._masterServ.getDataInvoiceDetail(id).then( async x => {
                this.samplePdf = await x;
                let ngantuk = this.samplePdf.map(oop => oop.transaction_sample.price).reduce((a,b) => a + b)
                let discountLepas = (checkDiscount/ngantuk)*100;
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
              });
          }
  
          if(this.callPdf.format == 1 || this.callPdf.format == 4){
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
              tgl_faktur: _moment(new Date(this.callPdf.tgl_faktur)).format("YYYY-MM-DD"),
              tgl_jatuh_tempo: this.callPdf.tgl_jatuh_tempo == '' ? '-' : _moment(new Date(this.callPdf.tgl_jatuhtempo)).format('YYYY-MM-DD'),
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
               printed : 2
            }
            await this.invoicePdf.generatePdf(this.data);
          }else{
            console.log(this.callPdf.invoice_detail[0].kontrakuji.sampling_trans)
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
              samples: this.callPdf.invoice_detail[0].kontrakuji.sampling_trans,       
              no_rekening: 's',
              rek: this.callPdf.rek == true ? 'Y' : 'N',
              split: this.callPdf.split == true ? 'Y' : 'N',
              totalcostsample: this.callPdf.totalcostsample,
              samplingfee: this.callPdf.samplingfee,
              ingfees: this.callPdf.ingfees,
              ppn : this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b)*11/100,
              discount : 0,
              // priceSubTotal : this.callPdf.subtotal,
              priceSubtotal : this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b),
              total : this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b) + 
              (this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b)*11/100),
              downpayment: this.callPdf.dp,
              remainingpayment : (this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b) + 
                                (this.callPdf.invoice_detail[0].kontrakuji.sampling_trans.map(x => x.total).reduce((a,b) => a + b)*11/100)) - this.callPdf.dp,
              terbilang: terbilang(this.callPdf.remainingpayment),
              conditionInvoice : this.callPdf.invoice_condition[0].status,
              printed : 0
            }
            await console.log(this.data)
            await this._samplingPdf.generatePdf(this.data);
          }
          
          this.datainvoice = await [];
          await this.getData();
      }

      holdButton(data, id){
        let send = {
            data : data,
            id : id
        }
        Swal.fire({
          title: 'Are you sure?',
          text: 'Hold or Unhold Contract!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Do it!',
          cancelButtonText: 'No, keep it'
        }).then((result) => {
          if (result.value) {
            this._masterServ.HoldContractByInvoice(send).then(x => {
            })
            Swal.fire(
              'Success!',
              'Your imaginary file has been update.',
              'success'
            )
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelled',
              'Your imaginary file is safe :)',
              'error'
            )
          }
             let message = {
              text: 'Succesfully',
              action: 'Done'
          }
          setTimeout(()=>{
                 this.datainvoice=[];
                  this.loadingfirst =  true; 
                  this.getData();
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

    async approveInvoice(id)
    {
      await this._masterServ.approveDataSpecial(id).then((x) => {
        this.load = true;
        let message = {
            text: "Data Succesfully Updated",
            action: "Done",
        };
        setTimeout(() => {
            this.load = false;
            this.openSnackBar(message);
            this.datainvoice = [];
            this.getData();
        }, 2000);
    });
    }

    async exportExcel() {
      this.load = await true;
      this.dataSent.download = true;
      await this._masterServ.getDataSpecial(this.dataSent).then( async (x: any) => {
              console.log(x)
            let a = await [];
            await x.forEach((b,c) => {
              a = a.concat({
                no: c + 1,
                invoice_number: b.no_invoice,
                customer: b.customer.customer_name,
                contactperson : b.contactperson == null ? '-' : b.contactperson.name  ,
                tgl_faktur: b.tgl_faktur == null   ? '-' : b.tgl_faktur  ,
                user_ar : b.customer.ar_user == null ?  '-' : b.customer.ar_user.employee_name,
                hold : b.invoice_detail[0].kontrakuji_light.hold
              })
            })
            const filename = await `InvoicePending.xlsx`;
            const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(a);
            const wb: XLSX.WorkBook = await XLSX.utils.book_new();
            await XLSX.utils.book_append_sheet(wb, ws, `Data`);
            await XLSX.writeFile(wb, filename);
          });
      this.load = await false;
  }

}
