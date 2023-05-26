import { Component, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import * as globals from "app/main/global";
import { PageEvent } from "@angular/material/paginator";
import { ProductsService } from "../../products.service";
import { FinanceService } from "../finance.service";
import * as _moment from 'moment';
const terbilang = require('angka-menjadi-terbilang')
import { InvoiceEssentialsFormService } from "app/main/analystpro/keuangan/invoice/pdf/invoiceessentials.service";
import { LoginService } from 'app/main/login/login.service';
import * as global from 'app/main/global';
@Component({
  selector: 'app-approve-invoice',
  templateUrl: './approve-invoice.component.html',
  styleUrls: ['./approve-invoice.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ApproveInvoiceComponent implements OnInit {
  load = false;
  loadingfirst = true;
  displayedColumns: string[] = [
  'checkbox',
  'invoice', 
  'category',
  'customer', 
  'tgl_faktur',
  'tgl_jatuhtempo', 
  'user',
  'action'
  ];
  total: number;
  from: number;
  to: number;
  pages = 1;
  current_page : number;
  dataFilter = {
    marketing: null,
    memo: null,
    category: null,
    user_kendali: null,
    pages: 1,
    customer : null,
    sample_name : null,
    sample_number : null,
    status_rev : null,
    user : null
  };
  financeProduct = [];
  pageEvent: PageEvent;

  getProduct = [];
  dataProduct = null;
  
  data: any;
  datasampleSemua = [];
  allComplete: boolean = false;
  checkList = [];

  constructor(
    private _productServ: ProductsService,
    private _financeServ: FinanceService,
    private invoicePdf: InvoiceEssentialsFormService,
    private _snackBar: MatSnackBar,
    private _loginServ: LoginService,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    this.getMe();
  }

  async getMe(){
    await this._loginServ.checking_me().then(async x => {
      console.log(x[0])
      if(x[0].id_bagian !== 2 && x[0].id_level < 18 ){
        if(x[0].user_id == 1 ){
          await this.getData();
        }else{
          await global.swalerror("Sorry you're not supposed in this page").then(() => {
            this._route.navigateByUrl("apps");
          })       
        } 
      }else{
        await this.getData();
      }
    });
  }

  async getData() {
    await this._financeServ
        .approveFinanceIndex(this.dataFilter)
        .then((x: any) => {
            this.financeProduct = this.financeProduct.concat(Array.from(x['data']));
            this.financeProduct = globals.uniq(
                this.financeProduct,
                (it) => it.id_product_invoice
            );
            this.total = x["total"];
            this.current_page = x["current_page"] - 1;
            this.from = x["from"];
            this.to = x["per_page"];
        })
        .then((x) =>
            setTimeout(() => {
                this.loadingfirst = false;
            }, 500)
        );
        
        await console.log(this.financeProduct)
    }

    paginated(f) {
      console.log(f);
      this.financeProduct = [];
      this.dataFilter.pages = f.pageIndex + 1;
      this.getData();
    }

    sortData(sort: Sort) {
      const data = this.financeProduct.slice();
      if (!sort.active || sort.direction === "") {
          this.financeProduct = data;
          return;
      }
      this.financeProduct = data.sort((a, b) => {
          const isAsc = sort.direction === "asc";
          switch (sort.active) {
              case "category_code":
                  return this.compare(
                      a.category_code,
                      b.category_code,
                      isAsc
                  );
              case "contract_no":
                  return this.compare(a.contract_no, b.contract_no, isAsc);
              case "customer_name":
                  return this.compare(
                      a.customer_name,
                      b.customer_name,
                      isAsc
                  );
              case "status_pengujian":
                  return this.compare(
                      a.status_pengujian,
                      b.status_pengujian,
                      isAsc
                  );
              case "desc":
                  return this.compare(a.desc, b.desc, isAsc);
              default:
                  return 0;
          }
      });
    }

  compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.financeProduct == null) {
      return;
    }
    if(completed == true)
    {
      this.financeProduct.forEach(t => t.completed = completed);
      this.financeProduct.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id_product_invoice,
          checked : true
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.financeProduct.forEach(t => t.completed = completed);
      this.checkList = [];
    }
  }

  updateAllComplete() {
    this.allComplete = this.financeProduct != null && this.financeProduct.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.financeProduct == null) {
      return false;
    }
    return this.financeProduct.filter(t => t.completed).length > 0 && !this.financeProduct;      
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
    console.log(this.checkList)
  }

  approve()
  {
    let u = [];
    this.checkList.forEach(x => {
      if(x.checked){
        u = u.concat({
          id: x.id, 
          checked : x.checked
        })
      }
    })
    this._financeServ.approvedInvoice(u).then(y => {
      this.load = true;
      let message = {
        text: 'Successfully approve',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.checkList = []
        this.financeProduct = [];
        this.getData();
        this.load = false;
      },1000)
    })
  }

  async cancelChecklist()
  {
    this.checkList = await [];
    this.financeProduct = await [];
    await this.getData();
  }

  async openInvoice(data, status)
  {
    await this._financeServ.getDetailInvoiceProduct(data).then( x => {
        console.log(x)
       this.dataProduct = x;
    })

    if(await this.dataProduct.contract.product_media_r_t_u.length > 0)
    {
        let b = [];
         b = await b.concat(this.dataProduct.contract.product_media_r_t_u)
         console.log(b)
         await b.forEach((x,i) => {
            this.datasampleSemua = this.datasampleSemua.concat({ 
                idsample: x.id,
                samplename: x.master_media_rtu.product_name,
                qty : x.unit,
                price: x.price,
                total : x.price * x.unit
            });
         })
    }
    // if(this.dataProduct[0].contract.product_media_r_t_u.length > 0){
    //     this.datasampleSemua = this.datasampleSemua.concat(this.dataProduct[0].contract.product_media_r_t_u)
    // //     await this._masterServ.getDataInvoiceDetail(id).then( async x => {
    // //         this.samplePdf = await x;
    // //         let discountLepas = checkDiscount/this.samplePdf.length;
    // //         this.samplePdf.forEach((x,i) => {
    // //             this.datasampleSemua = this.datasampleSemua.concat({ 
    // //               idsample: x.id_sample,
    // //               nosample: x.transaction_sample.no_sample,
    // //               samplename: x.transaction_sample.sample_name,
    // //               statuspengujian: x.transaction_sample.statuspengujian.name,
    // //               price: x.transaction_sample.price,
    // //               tgl_selesai: x.transaction_sample.tgl_selesai,
    // //               discount : x.transaction_sample.discount
    // //             });
    // //           });
    // //       });
        //   }

    let print = 0;
    await status == 'print' ? print = 1 : print = 0;

    this.data = await {
        no_invoice: this.dataProduct.no_invoice,        
        customer: this.dataProduct.customers.customer_name,
        cust_penghubung:  this.dataProduct.contactpersons.name,
        cust_addres: this.dataProduct.address.address,
        telp: this.dataProduct.contract.telp_number,
        phone : this.dataProduct.contract.mobile_number,
        fax: '',
        kontrak: this.dataProduct.contract.contract_number,
        no_po: this.dataProduct.contract.po_number,
        no_faktur: '',
        tgl_faktur: this.dataProduct.tgl_faktur == null? '-' :  _moment(new Date(this.dataProduct.tgl_faktur)).format("YYYY-MM-DD"),
        tgl_jatuh_tempo: this.dataProduct.tgl_jatuh_tempo == '' ? '-' : _moment(new Date(this.dataProduct.tgl_jatuhtempo)).format("YYYY-MM-DD"),
        tgl_berita_acara: '',
        other_ref: '',
        samples: this.datasampleSemua,       
        ppn : this.dataProduct.ppn,
        discount : this.dataProduct.discount,
        priceSubTotal : this.dataProduct.subtotal,
       // downpayment: this.dataProduct.price.product_payment.map(w => w.payment).reduce((a,b) => a + b),
        downpayment: this.dataProduct.price.product_payment.length > 0 ? this.dataProduct.price.product_payment.map(w => w.payment).reduce((a,b) => a + b) : 0,
        //remainingpayment :  this.dataProduct.total - this.dataProduct.price.product_payment.map(w => w.payment).reduce((a,b) => a + b),
        remainingpayment :  (this.dataProduct.total - (this.dataProduct.price.product_payment.length > 0 ? this.dataProduct.price.product_payment.map(w => w.payment).reduce((a,b) => a + b) : 0)),
        conditionInvoice : '',
        shipping_cost: this.dataProduct.shipping_cost,
        alltotal : this.dataProduct.total,
        printed : print,
        //terbilang: terbilang(this.dataProduct.total - this.dataProduct.price.product_payment.map(w => w.payment).reduce((a,b) => a + b)),
        terbilang: terbilang(this.dataProduct.total - (this.dataProduct.price.product_payment.length > 0 ? this.dataProduct.price.product_payment.map(w => w.payment).reduce((a,b) => a + b) : 0))
      }

      await console.log(this.data)
      await print == 1 ?  this._financeServ.printedInvoice(data) : '-';
      await this.invoicePdf.generatePdf(this.data);
      this.financeProduct = await [];
      await this.getData();
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }




}
