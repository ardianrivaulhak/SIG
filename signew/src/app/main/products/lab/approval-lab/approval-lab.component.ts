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
import { LabService } from "../lab.service";
import * as _moment from 'moment';
import { DetailApproveComponent  } from "./modals/detail-approve/detail-approve.component";
import { AttachmentproductComponent } from "app/main/products/modals/attachmentproduct/attachmentproduct.component";
import { LoginService } from 'app/main/login/login.service';
import * as global from 'app/main/global';
@Component({
  selector: 'app-approval-lab',
  templateUrl: './approval-lab.component.html',
  styleUrls: ['./approval-lab.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ApprovalLabComponent implements OnInit {
  
  load = false;
  loadingfirst = true;
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
  }
  total: number;
  from: number;
  to: number;
  pages = 1;
  current_page : number;
  labData = [];
  checkList = [];
  pageEvent: PageEvent;
  displayedColumns: string[] = [
    'checkbox',
    'contract_number', 
    'customer', 
    'tgl_terima',
    'estimasi',
    'total',
    'status',
    'user',
    'action'
    ];
    allComplete: boolean = false;

  constructor(
    private _productServ: ProductsService,
    private _labServ: LabService,
    private _snackBar: MatSnackBar,
    private _matDialog: MatDialog, 
    private _route: Router,  
    private _loginServ: LoginService,
  ) { }

  ngOnInit(): void {
    this.getMe();
  }

  async getMe(){
    await this._loginServ.checking_me().then(async x => {
      console.log(x[0])
      if(x[0].id_bagian !== 16 && x[0].id_sub_bagian !== 11 ){
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
    await this._labServ
        .getApprovalData(this.dataFilter)
        .then((x: any) => {
            this.labData = this.labData.concat(Array.from(x['data']));
            this.labData = globals.uniq(
                this.labData,
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
        
        await console.log(this.labData)
    }


    paginated(f) {
      console.log(f);
      this.labData = [];
      this.dataFilter.pages = f.pageIndex + 1;
      this.getData();
    }

    sortData(sort: Sort) {
      const data = this.labData.slice();
      if (!sort.active || sort.direction === "") {
          this.labData = data;
          return;
      }
      this.labData = data.sort((a, b) => {
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

  openDetail(ev) : void {
    console.log(ev)
    let dialogCust = this._matDialog.open(DetailApproveComponent, {
      panelClass: 'approval-dialog',
      width : '100%',
      //disableClose: true,
      data:  ev
    });

    dialogCust.afterClosed().subscribe((result) => {
      console.log(result)
      if(result.v == false){
        this.load = true;
        this.labData = [];
        this.getData();
        // setTimeout(()=>{  
        //   this.openDetail(ev)
        //   this.load = false;
        // },2000)
      }       
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.labData == null) {
      return;
    }
    if(completed == true)
    {
      this.labData.forEach(t => t.completed = completed);
      this.labData.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id_product_invoice,
          checked : true
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.labData.forEach(t => t.completed = completed);
      this.checkList = [];
    }
  }

  updateAllComplete() {
    this.allComplete = this.labData != null && this.labData.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.labData == null) {
      return false;
    }
    return this.labData.filter(t => t.completed).length > 0 && !this.labData;      
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

  async cancelChecklist()
  {
    this.checkList = await [];
    this.labData = await [];
    await this.getData();
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

  approve()
  {
    
  }



}
