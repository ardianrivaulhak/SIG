import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { KeuanganService } from '../keuangan.service';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import { ModalDateKeuanganComponent } from "../modal-date-keuangan/modal-date-keuangan.component";
import { PaymentcashierComponent } from "../paymentcashier/paymentcashier.component";
import * as XLSX from 'xlsx';
import { CustomerService } from "../../master/customers/customer.service";
import * as _moment from 'moment';
import { InvoiceFormService } from "../invoice/pdf/invoice.service";
const terbilang = require('angka-menjadi-terbilang')
import * as moment from 'moment';
import { ContractService } from "../../services/contract/contract.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class InvoiceFinanceComponent implements OnInit {

  access = []; 
  searchFilter = false;
  loadingfirst = true;
  total: number;
  from: number;
  to: number;
  pages = 1;
  dataSent = {
    pages : 1,
    date: '',
    status : '',
    users: '',
    customers: null,
    contact_person: null,    
    category: null,
    faktur: null,
    no_po: null,
    tglfaktur: null,
    tgl_jatuhtempo: null,
    contract: null,
    search : null
  }
  userFinance = []
  displayedColumns: string[] = [ 
    'no_invoice', 
    'nama_prisipal',    
    'tgl_faktur',
    'tgl_jthTempo',
    'no_po',
    'user', 
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


  constructor(
    private _masterServ: KeuanganService,
    private _router: Router,
    private dialog: MatDialog,
    private _menuServ: MenuService,
    private _msterCust: CustomerService,
    private invoicePdf: InvoiceFormService,
    private _kontrakServ: ContractService,
    private PdfServ: PdfService,
  ) { }

  ngOnInit(): void {
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

  async getData(){
    await this._masterServ.getData(this.dataSent).then(x => {
      this.datainvoice = this.datainvoice.concat(Array.from(x['data']));
      this.datainvoice = this.uniq(this.datainvoice, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to'];
      } 
      console.log(this.datainvoice);
    });
    this.loadingfirst =  await false;
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  async searchButton(){
    await console.log(this.cobaData)
    this.cancelSearch = await true;
    this.dataSent.search = await this.cobaData;
    await this.resetStatisic();
    this.datainvoice = await [];
    this.loadingfirst = await true;
    await this.getData();
    console.log(this.dataSent);
  }

  async cancelSearchMark()
  {
    await console.log(this.cancelSearch)
    this.cancelSearch = await false;  
    this.dataSent.search =await ''; 
    this.cobaData = await '';
    await this.resetStatisic();
    this.datainvoice = await [];
    this.loadingfirst = await true;
    await this.getData();
    await console.log(this.dataSent);
  }
  
  resetStatisic()
  { 
    this.total = null;
    this.from = null
    this.to = null
    this.pages = null;

  }

  async searchInvoice(ev){
    this.dataSent.search = await ev;   
    this.datainvoice = await [];
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
 
  async getValDate(ev){
    
    this.datainvoice = await [];
    this.dataSent.date = await _moment(ev.value).format('YYYY-MM-DD');
    console.log(this.dataSent.date);
    await this.getData();
  }



  async getValCategory(ev){
    await console.log(ev);
    this.datainvoice = await [];
    this.dataSent.category = await ev.category_code;
    await this.getData();
  }

  async getValTglfaktur(ev){
    await console.log(ev);
    this.datainvoice = await [];
    this.dataSent.tglfaktur =await  ev.tgl_faktur;
    await this.getData();
  }

  async getValContract(ev){
    await console.log(ev);
    this.datainvoice = await [];
    this.dataSent.contract = await ev.contract_no;
    await this.getData();
  }

  async getValTgljatuhtempo(ev){
    await console.log(ev);
    this.datainvoice = await [];
    this.dataSent.tgl_jatuhtempo = await ev.tgl_jatuhtempo;
    await this.getData();
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

  reset(e){ 
    // if (e === "marketing") { 
    //   this.dataSent.marketing = null; 
    //   this.loadingfirst = true;
    //   this.certData = [];
    //   this.getData();
    // } 
    // else if (e === "desc"){ 
    //   this.dataSent.desc = null; 
    //   this.loadingfirst = true;
    //   this.certData = [];
    //   this.getData();
    // } else if (e === "customer_name"){  
    //   this.dataSent.customer_name = null;
    //   this.loadingfirst = true;
    //   this.certData = [];
    //   this.getData();
    // } else if (e === "category"){  
    //   this.dataSent.category = null; 
    //   this.loadingfirst = true;
    //   this.certData = [];
    //   this.getData();
    // } 
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

  custNamee : any
  nameee : any
  addresss : any


  async openInvoice(id){
      
    this.data = {};
    this.datasampleSemua = [];


    await this._masterServ.invoiceDetails(id).then( async x => {
        this.callPdf = await x;
        console.log( this.callPdf)
      });
      //cek diskon
      let checkDiscount = this.callPdf.invoice_detail[0].kontrakuji.payment_condition.discount_lepas;
      console.log(checkDiscount)
    this.custNamee = await null
    this.nameee = await null
    this.addresss = await null

    await this._masterServ.checkCustomer(this.callPdf.idcust).then((x : any) => { this.custNamee = x.customer_name })
    await this._masterServ.checkCP(this.callPdf.idcp).then((x : any) => {   this.nameee = x.name  })
    await this._masterServ.checkAddress(this.callPdf.id_cust_address).then((x : any) => {   this.addresss = x.address })
    

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
            console.log(this.samplePdf)
            let discountLepas = checkDiscount/this.samplePdf.length;
            console.log(discountLepas);

            this.samplePdf.forEach((x,i) => {
                this.datasampleSemua = this.datasampleSemua.concat({ 
                  idsample: x.id_sample,
                  nosample: x.transaction_sample.no_sample,
                  samplename: x.transaction_sample.sample_name,
                  statuspengujian: x.transaction_sample.statuspengujian.name,
                  price: x.transaction_sample.price,
                  tgl_selesai: x.transaction_sample.tgl_selesai,
                  discount : discountLepas
                });
              });
            console.log( this.datasampleSemua)
          });

      }
     

      this.data = await {
        no_invoice: this.callPdf.no_invoice,        
        customer:this.custNamee ,
        cust_penghubung:  this.nameee,
        cust_addres:this.addresss,
        telp: this.callPdf.invoice_detail[0].kontrakuji.customers_handle.telp,
        fax: this.callPdf.invoice_detail[0].kontrakuji.customers_handle.fax,
        kontrak: this.callPdf.invoice_detail[0].kontrakuji.contract_no,
        no_po: this.callPdf.no_po,
        no_faktur: this.callPdf.no_faktur,
        tgl_faktur:  _moment(new Date(this.callPdf.tgl_faktur)).format("YYYY-MM-DD"),
        tgl_jatuh_tempo: this.callPdf.tgl_jatuh_tempo == '' ? '-' : _moment(this.callPdf.tgl_jatuh_tempo).format('DD MMMM YYYY'),
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
      this.datainvoice = await [];
      await this.getData();
  }

   async printInvoice(id){
    this.data = {};
    this.datasampleSemua = [];
    console.log(this.data)

    console.log(id)
    await this._masterServ.invoiceDetails(id).then( async x => {
        this.callPdf = await x;
        console.log( this.callPdf)
      });

      let checkDiscount = this.callPdf.invoice_detail[0].kontrakuji.payment_condition.discount_lepas;
    
      this.custNamee = await null
      this.nameee = await null
      this.addresss = await null
  
      await this._masterServ.checkCustomer(this.callPdf.idcust).then((x : any) => { this.custNamee = x.customer_name })
      await this._masterServ.checkCP(this.callPdf.idcp).then((x : any) => {   this.nameee = x.name  })
      await this._masterServ.checkAddress(this.callPdf.id_cust_address).then((x : any) => {   this.addresss = x.address })

      if(checkDiscount < 1){
        await this._masterServ.getDataInvoiceDetail(id).then( async x => {
            this.samplePdf = await x;
            console.log(this.samplePdf)
            let discountLepas = checkDiscount/this.samplePdf.length;
            console.log(discountLepas);
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
        await this._masterServ.getDataInvoiceDetail(id).then( async x => {
            this.samplePdf = await x;
            console.log(this.samplePdf)
            let discountLepas = checkDiscount/this.samplePdf.length;
            console.log(discountLepas);
            this.samplePdf.forEach((x,i) => {
                this.datasampleSemua = this.datasampleSemua.concat({ 
                  idsample: x.id_sample,
                  nosample: x.transaction_sample.no_sample,
                  samplename: x.transaction_sample.sample_name,
                  statuspengujian: x.transaction_sample.statuspengujian.name,
                  price: x.transaction_sample.price,
                  tgl_selesai: x.transaction_sample.tgl_selesai,
                  discount : discountLepas
                });
              });
            console.log( this.datasampleSemua)
          });
      }

      this.data = await {
        id: id,
        no_invoice: this.callPdf.no_invoice,        
        customer:this.custNamee ,
        cust_penghubung:  this.nameee,
        cust_addres:this.addresss,
        telp: this.callPdf.invoice_detail[0].kontrakuji.customers_handle.telp,
        fax: this.callPdf.invoice_detail[0].kontrakuji.customers_handle.fax,
        kontrak: this.callPdf.invoice_detail[0].kontrakuji.contract_no,
        no_po: this.callPdf.no_po,
        no_faktur: this.callPdf.no_faktur,
        tgl_faktur: _moment(new Date(this.callPdf.tgl_faktur)).format("YYYY-MM-DD"),
        tgl_jatuh_tempo: this.callPdf.tgl_jatuh_tempo == '' ? '-' : _moment(this.callPdf.tgl_jatuh_tempo).format('DD MMMM YYYY'),
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
        this.data = {};
        this.datasampleSemua = [];
        console.log(this.data)

        await this._masterServ.invoiceDetails(id).then( async x => {
            this.callPdf = await x;
            console.log( this.callPdf)
          });
    
          let checkDiscount = this.callPdf.invoice_detail[0].kontrakuji.payment_condition.discount_lepas;
      this.custNamee = await null
      this.nameee = await null
      this.addresss = await null
  
      await this._masterServ.checkCustomer(this.callPdf.idcust).then((x : any) => { this.custNamee = x.customer_name })
      await this._masterServ.checkCP(this.callPdf.idcp).then((x : any) => {   this.nameee = x.name  })
      await this._masterServ.checkAddress(this.callPdf.id_cust_address).then((x : any) => {   this.addresss = x.address })

          if(checkDiscount < 1){
            await this._masterServ.getDataInvoiceDetail(id).then( async x => {
                this.samplePdf = await x;
                console.log(this.samplePdf)
                let discountLepas = checkDiscount/this.samplePdf.length;
                console.log(discountLepas);
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
            await this._masterServ.getDataInvoiceDetail(id).then( async x => {
                this.samplePdf = await x;
                console.log(this.samplePdf)
                let discountLepas = checkDiscount/this.samplePdf.length;
                console.log(discountLepas);
                this.samplePdf.forEach((x,i) => {
                    this.datasampleSemua = this.datasampleSemua.concat({ 
                      idsample: x.id_sample,
                      nosample: x.transaction_sample.no_sample,
                      samplename: x.transaction_sample.sample_name,
                      statuspengujian: x.transaction_sample.statuspengujian.name,
                      price: x.transaction_sample.price,
                      tgl_selesai: x.transaction_sample.tgl_selesai,
                      discount : discountLepas
                    });
                  });
                console.log( this.datasampleSemua)
              });
          }
    
          this.data = await {
            no_invoice: this.callPdf.no_invoice,        
            customer:this.custNamee ,
            cust_penghubung:  this.nameee,
            cust_addres:this.addresss,
            telp: this.callPdf.invoice_detail[0].kontrakuji.customers_handle.telp,
            fax: this.callPdf.invoice_detail[0].kontrakuji.customers_handle.fax,
            kontrak: this.callPdf.invoice_detail[0].kontrakuji.contract_no,
            no_po: this.callPdf.no_po,
            no_faktur: this.callPdf.no_faktur,
            tgl_faktur: _moment(new Date(this.callPdf.tgl_faktur)).format("YYYY-MM-DD"),
            tgl_jatuh_tempo: this.callPdf.tgl_jatuh_tempo == '' ? '-' : _moment(this.callPdf.tgl_jatuh_tempo).format('DD MMMM YYYY'),
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
          await console.log(this.data);
          await this.invoicePdf.generatePdf(this.data);
          this.datainvoice = await [];
          await this.getData();
      }






}
