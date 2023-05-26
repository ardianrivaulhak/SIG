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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractcategoryService } from 'app/main/analystpro/master/contractcategory/contractcategory.service';
import { ContractService } from "../../services/contract/contract.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import * as globals from "app/main/global";
import { PorformaInvoiceService } from "../invoice/pdf/performa-invoice.service";
import { LoginService } from 'app/main/login/login.service';


@Component({
  selector: 'app-contract-stat',
  templateUrl: './contract-stat.component.html',
  styleUrls: ['./contract-stat.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ContractStatComponent implements OnInit {

    displayedColumns: string[] = [
      'contract_no',
      'customer_name',
      'hold',
      'total' ,
      'payment', 
      'status_invoice', 
      'action'];

    porformaData : any;
    datainvoice = [];
    total: number;
    from: number;
    to: number;
    pages = 1;
    dataSent = {
        marketing: null,        
        ponumber : null,
        contractdate: '',
        category: null,
        status : '',
        customers: null,
        pages : 1,
      }
  loadingfirst = false;
  searchFilter = false;
  akgData = [];
  samplingData = [];
  paymentData = [];
  load = false;

  data : any;
  cobaData = null;
  cancelSearch = false;
  notshowing = true;
  mine = [];

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

  dataCustomer = [];
  datasentCustomer = {
    pages: 1,
    search: null,
  };
  datasentCategory = {
    pages : 1,
    search : null,
    typeContract: null
  }
  contractcategory = [];

  
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


  constructor(
    private _masterServ : KeuanganService,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _kontrakategori: ContractcategoryService,
    private _menuServ: MenuService,
    private _route: Router,
    private _kontrakServ: ContractService,
    private PdfServ: PdfService,
    private _msterCust: CustomerService,
    private _porforma : PorformaInvoiceService,
    private _loginServ: LoginService,
  ) { }

  ngOnInit() {
    this.getData();
    this.getDataContractCategory();
    this.getCustomer();
    this.getMe();
  }

  
  getMe(){
    this._loginServ.checking_me().then(x => {
      console.log(x[0])
      if(x[0].id_bagian == 2 && x[0].id_level < 18 ){
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
    console.log(this.dataSent);
    await this._masterServ.ContractStatus(this.dataSent).then(async x => {
      let b = [];
      b = await b.concat(Array.from(x['data']));      
      await b.forEach(x => {
        console.log(x)
        x.akg_trans.length  > 0 ?  
        x.akg_trans.forEach(p => {
          this.akgData = this.akgData.concat({
            akg : p.total
          }) 
        }) : this.akgData = [ { akg : 0} ]

        x.sampling_trans.length  > 0 ?  
        x.sampling_trans.forEach(p => {
            this.samplingData = this.samplingData.concat({
                sample : p.total
            }) 
          }) : this.samplingData = [ { sample : 0} ]

        x.payment_data.length  > 0 ?  
        x.payment_data.forEach(p => {
            this.paymentData = this.paymentData.concat({
              payment : p.payment
            }) 
          }) : this.paymentData = [ { payment : 0} ]          

        this.datainvoice = this.datainvoice.concat({
          id: x.id_kontrakuji,
          hold : x.hold,
          contract_no: x.contract_no,
          created: x.created_at,
          customer_name : x.customers_handle.customers.customer_name,
          contact_person : x.customers_handle.contact_person.name,
          total : x.payment_condition.biaya_pengujian === null ? 0 : x.payment_condition.biaya_pengujian +  x.payment_condition.ppn + this.akgData[0].akg + this.samplingData[0].sample,
          payments : this.paymentData.map(oop => oop.payment).reduce((a,b) => a + b),
         // payments : this.paymentData[0].payment
          invoice_status : x.status_inv,
          category : x.contract_category.title
        }) 
      })
      this.datainvoice = await globals.uniq(this.datainvoice, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }
    })
    await console.log(this.datainvoice);
    this.loadingfirst =  await false;
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  paginated(f){
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
        case 'contract_no': return this.compare(a.contract_no, b.contract_no, isAsc);
        case 'category_code': return this.compare(a.category_code, b.category_code, isAsc);
        case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'contact_person': return this.compare(a.contact_person, b.contact_person, isAsc);
        case 'progress': return this.compare(a.progress, b.progress, isAsc);
        case 'desc': return this.compare(a.desc, b.desc, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  async getDataContractCategory(){
    await this._kontrakategori.getDataContractCategory(this.datasentCategory).then(x => {
      this.contractcategory = this.contractcategory.concat(x['data']);
    })
  }

  clickFilter(param)
  {   
      this.searchFilter = param
      if(this.searchFilter == false){
        this.datainvoice = [];
        this.dataSent.marketing = null; 
        this.dataSent.category = null; 
        this.loadingfirst = true;
        this.getData();
      } 
      
  }

  searchMarketing(ev)
  {    
    this.dataSent.marketing = ev;
    this.datainvoice = [];
    this.loadingfirst = true;
    this.getData();
    console.log(this.dataSent);
  }

  reset(e){ 
    if (e === "marketing") { 
      this.dataSent.marketing = null; 
      this.loadingfirst = true;
      this.datainvoice = [];
      this.getData();
    } else if (e === "category"){  
      this.dataSent.category = null; 
      this.loadingfirst = true;
      this.datainvoice = [];
      this.getData();
    } 
  }

  holdButton(data, id){
    let send = {
        data : data,
        id : id
    }
    console.log(send)
    Swal.fire({
      title: 'Are you sure?',
      text: 'Hold or Unhold Contract!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Do it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._masterServ.HoldContractByContract(send).then(x => {
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

openPdf(v,val) {
  console.log(v)
      this._kontrakServ.getDataDetailKontrak(v).then((x) => {
        console.log(x)
          this.PdfServ.generatePdf(x,val);
      });
  }

  async searchButton() {
    this.datainvoice = await [];
    this.loadingfirst = await true;
    await this.getData();
}

async cancelSearchMark() {
  this.dataSent.marketing = await null;
  this.dataSent.ponumber = await null;
  this.dataSent.contractdate = await null;
  this.dataSent.category = await null;
  this.dataSent.status = await null;
  this.dataSent.customers = await null;
  this.datainvoice = await [];
  this.loadingfirst = await true;
  await this.getData();
}
  
  resetStatisic()
  { 
    this.total = null;
    this.from = null
    this.to = null
    this.pages = null;

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
            this.dataCustomer = globals.uniq(
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


  goDetail(id) {
    const url = this._route.serializeUrl(
        this._route.createUrlTree([`/analystpro/finance-contract/${id}`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  } 

  async openPerforma(id){
      

    await this._masterServ.getDataPerforma(id).then( async x => {
        this.porformaData = await x;        
    });
    //   //cek diskon
    let checkDiscount = await this.porformaData.payment_condition.discount_lepas;    
    let a = await [];    

    if(checkDiscount < 1){ 
      await this.porformaData.transactionsample.forEach((x,i) => {
            a = a.concat({
              idsample: x.id,
              nosample: x.no_sample,
              samplename: x.sample_name,
              statuspengujian: x.statuspengujian.name,
              price: x.price,
              tgl_selesai: x.tgl_selesai,
              discount : x.discount
            })
        })
    }else{
      let ngantuk = await this.porformaData.transactionsample.map(oop => oop.price).reduce((a,b) => a + b)
      let discountLepas = await (checkDiscount/ngantuk)*100;
      await this.porformaData.transactionsample.forEach((x,i) => {
        a = a.concat({
          idsample: x.id,
          nosample: x.no_sample,
          samplename: x.sample_name,
          statuspengujian: x.statuspengujian.name,
          price: x.price,
          tgl_selesai: x.tgl_selesai,
          discount : x.price*discountLepas/100
        })
      })
    }
    await console.log(this.porformaData)
    let biay = this.porformaData.sampling_trans.length > 0 ? this.porformaData.sampling_trans.map(z => z.total).reduce((a,b) => a + b) : 0;
    let www = await this.porformaData.contract_no
    let invoiceNumber = await www.replaceAll('.', '/').replace('SIG/MARK', 'SIG.PRO');
    let data = {
          customer : this.porformaData.customers_handle.customers.customer_name,
          address : this.porformaData.cust_address.address,
          phone : this.porformaData.customers_handle.phone,
          cp : 'CP ' + this.porformaData.customers_handle.contact_person.name,
          date :  _moment(new Date(this.porformaData.created_at)).format("DD/MM/YYYY"),
          inv : invoiceNumber,
          sample : a,
          sub : a.map(z => z.price).reduce((a,b) => a + b),
          dis : a.map(z => z.discount).reduce((a,b) => a + b),
          ppn : (a.map(z => z.price).reduce((a,b) => a + b) - a.map(z => z.discount).reduce((a,b) => a + b)) * 11/100,
          sampling : this.porformaData.sampling_trans.length > 0 ? this.porformaData.sampling_trans.map(z => z.total).reduce((a,b) => a + b) : 0,
          tot : ((a.map(z => z.price).reduce((a,b) => a + b) - a.map(z => z.discount).reduce((a,b) => a + b)) + (a.map(z => z.price).reduce((a,b) => a + b) - a.map(z => z.discount).reduce((a,b) => a + b))* 11/100) + biay,
          terbilang : terbilang(((a.map(z => z.price).reduce((a,b) => a + b) - a.map(z => z.discount).reduce((a,b) => a + b)) + (a.map(z => z.price).reduce((a,b) => a + b) - a.map(z => z.discount).reduce((a,b) => a + b))* 11/100) + biay)
    }
      await console.log(data);
      await this._porforma.generatePdf(data);
      this.datainvoice = await [];
      await this.getData();
  
  }

  approve(id)
  {
    this._masterServ.approveRev(id).then(y => {
      this.load = true;
      let message = {
        text: 'Revision Contract',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.load = false;
      },1000)
    })
  }

}
