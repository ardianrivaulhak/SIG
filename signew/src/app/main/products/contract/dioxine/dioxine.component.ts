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
import { LoginService } from 'app/main/login/login.service';
import * as global from 'app/main/global';
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
@Component({
  selector: 'app-dioxine',
  templateUrl: './dioxine.component.html',
  styleUrls: ['./dioxine.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class DioxineComponent implements OnInit {

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
  mediartuData = [];
  pageEvent: PageEvent;

  getProduct = [];

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

  getData() {
    this._productServ
        .contractListDioxineUdara(this.dataFilter)
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
        await this._productServ.getProductMediaRTU(data).then( async x => {
            this.getProduct =this.getProduct.concat(x)
        })
        data.product = this.getProduct;
        await console.log(data);
        await this._pdfConMedia.generatePdf(data);
        // this.datainvoice = await [];
        // await this.getData();
  } 

}

