import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CertificateService } from '../../certificate.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import { ContractcategoryService } from '../../../master/contractcategory/contractcategory.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from "xlsx";
import { CustomerService } from 'app/main/analystpro/master/customers/customer.service'
import * as globals from "app/main/global";

@Component({
  selector: 'app-data-follow',
  templateUrl: './data-follow.component.html',
  styleUrls: ['./data-follow.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DataFollowComponent implements OnInit {

  access = [];
  displayedColumns: string[] = [ 'checkbox', 'contract_no', 'sample_name', 'customer_name', 'action'];
  certData = [];
  total: number;
  from: number;
  to: number;

  loadingfirst = true;
  
  pages = 1;
  searchFilter = false;
  datasent = {
    pages : 1,
    marketing : null,
    principle : null,
    category : null,
    status : null
  }

  datasentCategory = {
    pages : 1,
    search : null,
    typeContract: null
  }

  dataFilter = {
    status : "accepted",
    pages : 1,
    type : "paginate",
    marketing : '',
    desc: '',
    customer: '',
    sample_name: '',
    kontrakStat : false
  }

  checkList = [];
  contractcategory = [];
  allComplete: boolean = false;
  cobaData = null;
  cancelSearch = false;
  dataExcel = [];

  datasentCustomer = {
    pages : 1,
    search : null
  }
  customersData = []

  constructor(
    // public dialogRef: MatDialogRef<DataFollowComponent>,
    // @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _masterServ: CertificateService,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _kontrakategori: ContractcategoryService,
    private _menuServ: MenuService,
    private _route: Router,
    private _customersServ: CustomerService,
  ) { }

  ngOnInit(): void {
      this.getData();
      this.getDataCustomer();
  }

  async getData(){
    await this._masterServ.getFollowData(this.dataFilter).then(x => {
      this.certData = this.certData.concat(Array.from(x['data']));
      this.certData = globals.uniq(this.certData, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }  
    })
    .then(x => console.log(this.certData));
    this.loadingfirst =  await false;
  }

  // uniq(data, key) {
  //   return [...new Map(data.map((x) => [key(x), x])).values()];
  // }
  
  getDataCustomer(){
    console.log(this.datasentCustomer)
    this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
      this.customersData = this.customersData.concat(Array.from(x['data']));
      this.customersData = globals.uniq(this.customersData, (it) => it.id_customer);
    });
    console.log(this.customersData);
  } 

  onScrollToEnd(e) {
    if (e === "customer") {
      this.datasentCustomer.pages = this.datasentCustomer.pages + 1; 
      this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(x['data']);
        console.log(this.customersData);
      });
    }
    
  }

  onsearchselect(ev, val) {
    if (val === "customer") {
        this.customersData = [];
        this.datasentCustomer.search = ev.term;
        this.datasentCustomer.pages = 1;
        this.getDataCustomer();
    }
  }
  

  paginated(f){
    this.certData = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getData();
  }

  sortData(sort: Sort) {
    console.log(sort)
  const data = this.certData.slice();
  if ( !sort.active || sort.direction === '') {
    this.certData = data;
    return;
  }
  this.certData = data.sort((a, b) => {
    const isAsc = sort.direction === 'asc';
    switch (sort.active) {
      case 'contract_no': return this.compare(a.contract_no, b.contract_no, isAsc);
      case 'sample_name': return this.compare(a.sample_name, b.sample_name, isAsc);
      case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
      case 'action': return this.compare(a.action, b.action, isAsc);
      default: return 0;
    }
  });
}


compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.certData == null) {
      return;
    }
    if(completed == true)
    {
      this.certData.forEach(t => t.completed = completed);
      this.certData.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.certData.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }


  updateAllComplete() {
    this.allComplete = this.certData != null && this.certData.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.certData == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.certData.filter(t => t.completed).length > 0 && !this.allComplete;
    
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

  cancelSelect()
  {
    this.checkList = [];
    this.certData=[];
    this.loadingfirst = true;
    this.getData();
  }

  async aproveSelectSample(){
    this.loadingfirst = await true;
    let u = [];
        this.checkList.forEach((x) => {
            if (x.checked) {
                u = u.concat({
                    id: x.id,
                });
            }
        });
    console.log(u)
    await this._masterServ.approveFollowData(u).then(y => {      
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{        
        //this.closeModal();
        this.loadingfirst = false;
      },1000)
    })
  }

  // closeModal(){
  //   return this.dialogRef.close({
      
  //   });
  // }

  async searchData()
  {
    this.loadingfirst == await true;
    this.certData = await [];
      await this.getData();
  }

  async resetData()
  {
    this.loadingfirst == await true;
    this.dataFilter.marketing = await null;
    this.dataFilter.customer = await null;
    this.dataFilter.sample_name = await null;
    this.certData = await []
    await this.getData();
  }


}
