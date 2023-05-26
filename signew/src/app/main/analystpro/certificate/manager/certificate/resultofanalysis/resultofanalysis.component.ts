import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CertificateService } from '../../../certificate.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import { ContractcategoryService } from '../../../../master/contractcategory/contractcategory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectTeamComponent } from '../modals/select-team/select-team.component';
import { SampleDataComponent } from '../modals/sample-data/sample-data.component';
import * as XLSX from "xlsx";
import { DataFollowComponent } from "../../data-follow/data-follow.component";
import { CustomerService } from '../../../../master/customers/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as globals from "app/main/global";
import { PageEvent } from "@angular/material/paginator";
@Component({
  selector: 'app-resultofanalysis',
  templateUrl: './resultofanalysis.component.html',
  styleUrls: ['./resultofanalysis.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ResultofanalysisComponent implements OnInit {

  access = [];
  displayedColumns: string[] = [ 'checkbox', 'contract_no', 'category_code', 'customer_name', 'progress', 'desc', 'action'];
  certData = [];
  total: number;
  from: number;
  to: number;
  current_page : number;

  totalCust: number;
  fromCust: number;
  toCust: number;
  current_pageCust : number;

  loadingfirst = true;
  
  pages = 1;
  data = {
    id : ''
  };
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
    category: '',
    kontrakStat : false,
    download : false
  }

  datasentCustomer = {
    pages : 1,
    search : null
  }

  pageEvent: PageEvent;
  

  checkList = [];
  contractcategory = [];
  allComplete: boolean = false;
  cobaData = null;
  cancelSearch = false;
  dataExcel = []
  customersData = [];
  resultForm : FormGroup;

  constructor(
    private _masterServ: CertificateService,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _kontrakategori: ContractcategoryService,
    private _menuServ: MenuService,
    private _route: Router,
    private _customersServ: CustomerService,
    private _formBuild: FormBuilder,
  ) { 
    
  }

  ngOnInit(): void {
    this.getData();
    this.getDataContractCategory();
    this.getDataCustomer();
  }

  checkauthentication(){
    this._menuServ.checkauthentication(this._route.url).then(x => {
      if(!x.status){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You dont an access to this page !',
        }).then(res => {
          if(res.isConfirmed || res.isDismissed) {
            this._route.navigateByUrl('apps');
          }
        });
      } else {
        this.access = this.access.concat(x.access);
      }
    });
  }

  async getData(){
    await this._masterServ.getResultOfAnalysis(this.dataFilter).then(x => {
      this.certData = this.certData.concat(Array.from(x['data']));
      this.certData = globals.uniq(this.certData, (it) => it.id_kontrakuji);     
      this.total = x["total"];
      this.current_page = x["current_page"] - 1;
      this.from = x["from"];
      this.to = x["per_page"];
    })
    .then(() => this.resultForm = this.createLabForm())
    .then(() => console.log(this.certData))
    this.loadingfirst =  await false;
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

  async getDataContractCategory(){
    await this._kontrakategori.getDataContractCategory(this.datasentCategory).then(x => {
      this.contractcategory = this.contractcategory.concat(x['data']);
    })
  }


  paginated(f){
    this.certData = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getData();
  }

  searchButton(){
    this.dataFilter.marketing = this.resultForm.value.marketing
    this.dataFilter.customer  = this.resultForm.value.customer
    this.dataFilter.category  = this.resultForm.value.category
    this.certData = [];    
    this.loadingfirst = true;
    this.getData();
    
  }

  cancelSearchMark()
  {
    this.dataFilter.marketing = ''
    this.dataFilter.customer  = ''
    this.dataFilter.category  = ''
    this.certData = [];
    this.total = null
    this.from = null
    this.to = null
    this.loadingfirst = true;
    this.getData();
  }

  getDataCustomer(){
    console.log(this.datasentCustomer)
    this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
      this.customersData = this.customersData.concat(Array.from(x['data']));
      this.customersData = globals.uniq(this.customersData, (it) => it.id_customer);
      console.log(this.customersData);
        this.totalCust = x['total'];
        this.fromCust = x['from'] - 1;
        this.toCust = x['to'];
        this.current_page = x["current_page"] - 1;
    });
    console.log(this.customersData);
  } 

  createLabForm(): FormGroup {       
    return this._formBuild.group({
      marketing:[''],
      category:[''],
      customer:['']
    })
  }


  onsearchselect(ev, val) {
    if (val === "customer") {
        this.customersData = [];
        this.datasentCustomer.search = ev.term;
        this.datasentCustomer.pages = 1;
        this.getDataCustomer();
    }
  }

  reset(e){ 
    if (e === "customer"){  
      this.dataFilter.customer = null;
      this.loadingfirst = true;
      this.certData = [];
      this.getData();
    } 
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
        case 'category_code': return this.compare(a.category_code, b.category_code, isAsc);
        case 'customer': return this.compare(a.customer, b.customer, isAsc);
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

  clickFilter(param)
  {   
      this.searchFilter = param
      if(this.searchFilter == false){
        this.certData = [];
        this.dataFilter.marketing = null; 
        this.dataFilter.customer = null; 
        this.dataFilter.category = null; 
        this.dataFilter.desc = null;
        this.loadingfirst = true;
        this.getData();
      } 
      
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  selectTeam() : void 
  {
    let u = [];
        this.checkList.forEach((x) => {
            if (x.checked) {
                u = u.concat({
                    id: x.id,
                });
            }
        });
    console.log(u)

    let dialogCust = this._matDialog.open(SelectTeamComponent, {
      panelClass: 'selectteam-control-dialog',
      data: { data : u } 
    });

    dialogCust.afterClosed().subscribe((result) => {
      this.loadingfirst = true;
      this.certData=[];
      this.checkList = [];
      this.getData();
    });
  }

  cancelSelectTeam()
  {
    this.checkList = [];
    this.certData=[];
    this.loadingfirst = true;
    this.getData();
  }

  sampleDataModals(id_contract) : void 
  {
    let dialogCust = this._matDialog.open(SampleDataComponent, {
      panelClass: 'sampledata-roa-dialog',
      data: { id_contract: id_contract } ,
      width : '1200px'
    });
    dialogCust.afterClosed().subscribe((result) => {
    
    });
  }

  // setAll(completed: boolean) {
  //   this.allComplete = completed;
  //   if (this.certData == null) {
  //     return;
  //   }
  //   this.certData.forEach(t => t.completed = completed);
  //   this.certData.forEach( x => {
  //     this.checkList = this.checkList.concat({
  //       id: x.id_kontrakuji,
  //       checked : true
  //     })
  //   })
  //   console.log(this.checkList)
  // }

  // updateAllComplete() {
  //   this.allComplete = this.dataCertificate != null && this.dataCertificate.every(t => t.completed);
  //   console.log(this.allComplete)
  // }

  // someComplete(): boolean {
  //   if (this.dataCertificate == null) {
  //     return false;
  //   }
  //   console.log(this.allComplete)
  //   return this.dataCertificate.filter(t => t.completed).length > 0 && !this.allComplete;
    
  // }

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
          id: x.id_kontrakuji,
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


  async downloadExcel() {
    this.dataFilter.download = true;
    this.dataExcel = [];
    
    console.log(this.dataFilter)
    await this._masterServ.getResultOfAnalysis(this.dataFilter).then((x) => {
        let b = [];
        b = b.concat(x);
        console.log(b);
        b.forEach((s) => {
            this.dataExcel = this.dataExcel.concat({
                contract_no: s.contract_no,                
                customer_name: s.customers_handle.customers.customer_name,
                contact_person: s.customers_handle.contact_person.name,
                contract_category: s.contract_category.title,
                desc: s.desc,
            });
        });
        console.log(this.dataExcel);
        const fileName = "report ROA.xlsx";
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "data");

        XLSX.writeFile(wb, fileName);
    });
}

    modalFollows()
    {
   
    const dialogRef = this._matDialog.open(DataFollowComponent, {
        panelClass: 'datafollow-certificate',
        width: '100%',
        height: '500px'
    });

    dialogRef.afterClosed().subscribe((result) => {
    
        this.certData=[];
        this.loadingfirst =  true;
        this.getData();
    });
    }

    refreshData()
    {
      this.certData=[];
      this.loadingfirst =  true;
      this.getData();
    }
    
}