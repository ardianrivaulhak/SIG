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
import { PaymentsComponent } from "./dialog/payments/payments.component";
import { LoginService } from 'app/main/login/login.service';
import * as global from 'app/main/global';
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
@Component({
  selector: 'app-invoiceproduct',
  templateUrl: './invoiceproduct.component.html',
  styleUrls: ['./invoiceproduct.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class InvoiceproductComponent implements OnInit {

  loadingfirst = true;
  displayedColumns: string[] = [
  'invoice', 
  'category',
  'customer', 
  'tgl_faktur',
  'tgl_jatuhtempo', 
  'status',
  'user',
  'action'
  ];
  total: number;
  from: number;
  to: number;
  pages = 1;
  current_page : number;
  dataFilter = {
    invoice: null,
    category: null,
    customer : null,
    status: null,
    date: null,
    pages: 1,
  };
  financeProduct = [];
  pageEvent: PageEvent;

  getProduct = [];
  dataProduct = null;
  
  data: any;
  datasampleSemua = [];
  dataCustomer = [];

  datasentCustomer = {
    pages: 1,
    search: null,
  };

  status = [
    {
      id : 1,
      name : 'Not Yet'
    },
    {
      id : 2,
      name : 'Approved'
    }
  ];

  category = [
    {
      id : 14,
      name : 'Media RTU'
    },
    {
      id : 20,
      name : 'Dioxine'
    }
  ];
  totalcustomer: number;
  fromcustomer: number;
  tocustomer: number;
  pagescustomer = 1;

  constructor(
    private _productServ: ProductsService,
    private _financeServ: FinanceService,
    private invoicePdf: InvoiceEssentialsFormService,
    private _matDialog: MatDialog,
    private _loginServ: LoginService,
    private _route: Router,
    private _msterCust: CustomerService,  
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getDataCustomer();
  }

  async getMe(){
    await this._loginServ.checking_me().then(async x => {
      console.log(x[0])
      if(x[0].id_bagian !== 2  ){
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
        .getListInvoiceProducts(this.dataFilter)
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
        ppn : parseFloat(this.dataProduct.ppn),
        discount : parseFloat(this.dataProduct.discount),
        priceSubTotal : parseFloat(this.dataProduct.subtotal),
        downpayment: this.dataProduct.price.product_payment.length > 0 ? this.dataProduct.price.product_payment.map(w => w.payment).reduce((a,b) => a + b) : 0,
        remainingpayment :  (this.dataProduct.total - (this.dataProduct.price.product_payment.length > 0 ? this.dataProduct.price.product_payment.map(w => w.payment).reduce((a,b) => a + b) : 0)),
        conditionInvoice : this.dataProduct.condition_invoice[this.dataProduct.condition_invoice.length - 1].status,
        shipping_cost: parseFloat(this.dataProduct.shipping_cost),
        alltotal : parseFloat(this.dataProduct.total),
        printed : print,
        terbilang: terbilang(this.dataProduct.total - (this.dataProduct.price.product_payment.length > 0 ? this.dataProduct.price.product_payment.map(w => w.payment).reduce((a,b) => a + b) : 0))
      }

      await console.log(this.data)
      await print == 1 ?  this._financeServ.printedInvoice(data) : '-';
      await this.invoicePdf.generatePdf(this.data);
      this.financeProduct = await [];
      await this.getData();
  }

  async approvedInvoice(data)
  {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this Data!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, approved it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this._financeServ.approveWaiting(data).then(x => {
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
          this.financeProduct=[];
          this.loadingfirst =  true;
          this.getData();
        },1000)
      })
  }

  addPayments(ev) : void {
    console.log(ev)
    let dialogCust = this._matDialog.open(PaymentsComponent, {
      panelClass: 'sample-control-dialog',
      width : '400px',
      disableClose: true,
      data:  ev
    });

    dialogCust.afterClosed().subscribe((result) => {
      console.log(result)
      if(result.v == false){
        this.financeProduct = [];
        this.getData();
      }       
    });
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
            this.totalcustomer = x["total"];
            this.fromcustomer = x["from"] - 1;
            this.tocustomer = x["to"];
        });
    console.log(this.dataCustomer);
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

  goToContract(id) {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/products/pdf-contract/` + id  ])
    );      
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

  filterData()
  {
    this.financeProduct = [];
    this.getData();
  }

  resetFilter()
  {
    this.dataFilter.invoice = null;
    this.dataFilter.category =  null;
    this.dataFilter.customer = null;
    this.dataFilter.status = null;
    this.dataFilter.date = null;
    this.dataFilter.pages = 1;
    this.financeProduct = [];
    this.getData();
  }

}
