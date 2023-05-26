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
import { MediartucontractService } from "../pdf/mediartucontract.service";
import { AttachmentproductComponent } from "../../modals/attachmentproduct/attachmentproduct.component";
import { SendingProductComponent  } from "./page/sending-product/sending-product.component";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
import * as _moment from 'moment';
import { RevisionComponent } from "../../modals/revision/revision.component";
import { LoginService } from 'app/main/login/login.service';
import * as global from 'app/main/global';
@Component({
  selector: 'app-mediartu',
  templateUrl: './mediartu.component.html',
  styleUrls: ['./mediartu.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MediartuComponent implements OnInit {
  load = false;
  loadingfirst = true;
  displayedColumns: string[] = [
  'contract_no', 
  'customer', 
  'tgl_terima',
  'estimasi', 
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
    marketing: null,
    customer : null,
    contact_person: null,
    status: null,
    received_date: null,
    estimate: null,
    pages: 1,
    user : null
  };
  mediartuData = [];
  pageEvent: PageEvent;

  getProduct = [];
  dataCustomer = [];

  datasentCustomer = {
    pages: 1,
    search: null,
  };



  constructor(
    private _productServ: ProductsService,
    private _pdfConMedia : MediartucontractService,
    private _route: Router,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _msterCust: CustomerService,    
    private _loginServ: LoginService,
  ) { }

  ngOnInit(): void {
    this.getMe();
    
  }

  async getMe(){
    await this._loginServ.checking_me().then(async x => {
      console.log(x[0])
      if(x[0].id_sub_bagian !== 20 ){
        if(x[0].user_id == 1 ){
          await this.getData();
          await this.getDataCustomer();
        }else{
          await global.swalerror("Sorry you're not supposed in this page").then(() => {
            this._route.navigateByUrl("apps");
          })       
        } 
      }else{
        await this.getData();
        await this.getDataCustomer();
      }
    });
  }

  getData() {
    this._productServ
        .contractListMediartu(this.dataFilter)
        .then((x: any) => {
            this.mediartuData = this.mediartuData.concat(x.data);
            this.mediartuData = globals.uniq(
                this.mediartuData,
                (it) => it.id_product_contract
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
    }

    paginated(f) {
      console.log(f);
      this.mediartuData = [];
      this.dataFilter.pages = f.pageIndex + 1;
      this.getData();
    }

    sortData(sort: Sort) {
      const data = this.mediartuData.slice();
      if (!sort.active || sort.direction === "") {
          this.mediartuData = data;
          return;
      }
      this.mediartuData = data.sort((a, b) => {
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

  async openContractProduct(data)
  {
        this.getProduct = await [];
        let dt: any;

        await this._productServ.getProductMediaRTU(data).then( async x => {
            dt  = x
        })
          console.log(dt)
        // data.product = this.getProduct;
        // await console.log(data);
        await this._pdfConMedia.generatePdf(dt);
        this.mediartuData = await [];
        await this.getData();
  } 

  goToContract(id) {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/products/pdf-contract/` + id  ])
    );      
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

  goDetail(id) {
    const url = this._route.serializeUrl(
        this._route.createUrlTree([`/products/contract-edit/` + id ]) 
    );      
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

  attachment(ev) : void {
    console.log(ev)
    let dialogCust = this._matDialog.open(AttachmentproductComponent, {
      panelClass: 'sample-control-dialog',
      width : '600px',
      //disableClose: true,
      data:  ev
    });

    dialogCust.afterClosed().subscribe((result) => {
      console.log(result)
    //   if(result.v == false){
    //     this.financeProduct = [];
    //     this.getData();
    //   }       
    });
  }

  approveToLab(data)
  {
   
    let dd = {
      id_condition : data.conditions[data.conditions.length - 1].id_product_condition,
      id_product_contract: data.id_product_contract
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Approve Contract!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Do it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._productServ.approveMediaRtu(dd).then(x => {
          console.log(x)
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
            this.mediartuData=[];
              this.loadingfirst =  true; 
              this.getData();
              this.openSnackBar(message);
              this.load = false;
      },1000)
    })
  }

  deleteContract(data)
  {
    let dt = {
      id_condition : data.conditions[data.conditions.length - 1].id_product_condition,
      id_product_contract: data.id_product_contract,
      id_product_price : data.productprice.id_product_price
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete Contract!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Do it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._productServ.deleteMediaRtu(dt).then(x => {
          console.log(x)
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
            this.mediartuData=[];
              this.loadingfirst =  true; 
              this.getData();
              this.openSnackBar(message);
              this.load = false;
      },1000)
    })
  }

  sendingProduct(ev) : void {
    console.log(ev)
    let dialogCust = this._matDialog.open(SendingProductComponent, {
      panelClass: 'sample-control-dialog',
      width : '800px',
      //disableClose: true,
      data:  ev
    });

    dialogCust.afterClosed().subscribe((result) => {
      console.log(result)
    //   if(result.v == false){
    //     this.financeProduct = [];
    //     this.getData();
    //   }       
    });
  }

  async FilteringData()
  {
    await console.log(this.dataFilter)
    _moment(new Date(this.dataFilter.estimate)).format("YYYY-MM-DD")
    this.mediartuData = await [];
    await this.getData();
  }

  async reset()
  {
    this.dataFilter.marketing =  await null
    this.dataFilter.customer = await null
    this.dataFilter.contact_person = await null
    this.dataFilter.status = await null
    this.dataFilter.received_date = await null
    this.dataFilter.estimate = await null
    this.dataFilter.pages =  await 1
    this.dataFilter.user = await null
    this.mediartuData = await [];
    await this.getData();
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

  revision(ev) : void {
    console.log(ev)
    let dialogCust = this._matDialog.open(RevisionComponent, {
      panelClass: 'sample-control-dialog',
      width : '600px',
      //disableClose: true,
      data:  ev
    });

    dialogCust.afterClosed().subscribe((result) => {
      console.log(result)
    //   if(result.v == false){
    //     this.financeProduct = [];
    //     this.getData();
    //   }       
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }


}


