import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PreparationService } from '../preparation.service';
import { fuseAnimations } from '@fuse/animations';
import { Sort } from '@angular/material/sort';
import { ContractcategoryService } from '../../services/contractcategory/contractcategory.service';
import { StatuspengujianService } from '../../services/statuspengujian/statuspengujian.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import Swal from 'sweetalert2';
import { CustomerService } from 'app/main/analystpro/master/customers/customer.service';
import * as globals from "app/main/global";
import { ModalhistoryComponent } from '../historypreparation/modalhistory/modalhistory.component';
import { MatDialog } from "@angular/material/dialog";
import * as XLSX from 'xlsx';
import { PageEvent } from "@angular/material/paginator";
@Component({
  selector: 'app-preparation',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PreparationComponent implements OnInit {

  loadingfirst = false;
  preparationData = [];
  displayedColumns: string[] = [
    'nama_prinsipal', 
    'no_kontrakuji',
    'user_kendali',
    'progress',    
    'statuses',
    'ket_spesifikasi'
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
    information: null,
    pages: 1,
    customer : null,
    sample_name : null,
    sample_number : null,
    status_rev : null,
    user : null
};
  datasentCategory = {
    pages : 1,
    search : null,
    typeContract: null
  }

  searchFilter = false;
  load = false;
  access = [];	
  contractcategory = [];
  statusPengujian = [];

  cobaData = null;
  cancelSearch = false;
  customersData = [];
  datasentCustomer = {
    pages: 1,
    search: null,
    typeContract: null,
  };

  totalCust: number;
  fromCust: number;
  toCust: number;
  pagesCust = 1;
  current_pageCust : number;

  tglExcelStart: number;
  tglExcelEnd: number;
  dataExcel = [];
  pageEvent: PageEvent;

  constructor(
    private _menuServ: MenuService,
    private _masterPreparationServ: PreparationService,
    private _kontrakategori: ContractcategoryService,
    private _statuspengujian: StatuspengujianService,
    private _route: Router,
    private _snackBar: MatSnackBar,
    private _customersServ : CustomerService,
    private _dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.getData();
    this.checkauthentication(); 
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
    await this._masterPreparationServ.getContractData(this.dataFilter).then(async x => {
      this.preparationData = this.preparationData.concat(Array.from(x['data']));
      this.preparationData = globals.uniq(this.preparationData, (it) => it.id_kontrakuji);
      this.total = x["total"];
      this.current_page = x["current_page"] - 1;
      this.from = x["from"];
      this.to = x["per_page"];
    })
    this.loadingfirst =  await true;
   
  }

  
  async searchButton() {
    this.preparationData = await [];
    this.loadingfirst = await true;
    await this.getData();
}

async cancelSearchMark() {
    this.dataFilter.marketing = await null;
    this.dataFilter.memo = await null;
    this.dataFilter.category = await null;
    this.dataFilter.pages = await 1;
    this.dataFilter.customer = await null;
    this.dataFilter.sample_name = await null;
    this.dataFilter.sample_number = await null;
    this.dataFilter.status_rev = await null;
    this.dataFilter.user = await null;
    this.preparationData = await [];
    this.loadingfirst = await true;
    await this.getData();
}

  async getDataContractCategory(){
    await this._kontrakategori.getDataContractCategory(this.datasentCategory).then(x => {
      this.contractcategory = this.contractcategory.concat(x['data']);
    })
  }

  async getDataCustomer() {
    await this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(Array.from(x['data']));
        this.customersData = globals.uniq(this.customersData, (it) => it.id_customer);

        this.totalCust = x["total"];
        this.current_pageCust = x["current_page"] - 1;
        this.fromCust = x["from"];
        this.toCust = x["per_page"];
    });
} 



  changeDate(v){
    let b = new Date(v);
    return `${this.addZero(b.getDate())}-${this.addZero(b.getMonth())}-${b.getFullYear()}`;
  }

  addZero(i){
    return i > 9 ? `${i}` : `0${i}`;
  }

  paginated(f){
    this.preparationData = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getData();
  }

  reset(e) {
    if (e === "marketing") {
        this.dataFilter.marketing = null;
        this.preparationData = [];
        this.getData();
    } else if (e === "memo") {
        this.dataFilter.memo = null;
        this.preparationData = [];
        this.getData();
    } else if (e === "customer") {
        this.dataFilter.customer = null;
        this.preparationData = [];
        this.getData();
    } else if (e === "category") {
        this.dataFilter.category = null;
        this.preparationData = [];
        this.getData();
    }  else if ( e === "status_rev") {
        this.dataFilter.status_rev = null;
        this.preparationData = [];
        this.getData();
    }
}

  searchMarketing(ev){
      
    this.dataFilter.marketing = ev;
    this.preparationData = [];
    this.getData();
  }

  searchInformation(ev){
    this.preparationData = [];    
    this.dataFilter.information = ev;
    this.getData();
  }

  searchCompany(ev){
    this.preparationData = [];    
    this.dataFilter.customer = ev;
    this.getData();
  }


  searchCategory(ev){
    this.dataFilter.category = ev.value;
    this.preparationData = [];
    this.getData();
  }

  sortData(sort: Sort) {
    const data = this.preparationData.slice();
    if ( !sort.active || sort.direction === '') {
      this.preparationData = data;
      return;
    }
    this.preparationData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nama_prinsipal': return this.compare(a.nama_prinsipal, b.nama_prinsipal, isAsc);
        case 'no_kontrakuji': return this.compare(a.no_kontrakuji, b.no_kontrakuji, isAsc);
        case 'contract_type': return this.compare(a.contract_type, b.contract_type, isAsc);
        default: return 0;
      }
    });
  }
  
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onScrollToEnd(e) {
    if (e === "customer") {
        this.datasentCustomer.pages = this.datasentCustomer.pages + 1; 
        this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(x['data']);
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

  goDetail(id) {
    const url = this._route.serializeUrl(
        this._route.createUrlTree([`/analystpro/preparation/${id}`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

  ReportModals() : void 
  {
    let dialogCust = this._dialog.open(ModalhistoryComponent, {
      panelClass: 'memoprep-dialog',
      data: 'asd'
    });
   
    dialogCust.afterClosed().subscribe(async (result) => {
        this.tglExcelStart = await result.c;
        this.tglExcelEnd = await result.d;
        this.downloadExcel();
    });
  }

  async downloadExcel(){
    this.dataExcel = []; 
   let a = {
     tglStart : this.tglExcelStart,
     tglEnd : this.tglExcelEnd
   }
    await this._masterPreparationServ.downloadExcel(a).then(x => {
        let b = []
        b = b.concat(x);  
        b.forEach((s , i) => {
            this.dataExcel = this.dataExcel.concat({
                contract_no : s.contract_no,
                sample_no : s.no_sample,
                sample_name: s.sample_name,
                subcatalog : s.sub_catalogue_name,
                status : s.name,
                estiamsilab : s.tgl_estimasi_lab,
                ket_sample : s.desc,
                kendali_desc : s.dest,
                user_prep : s.user_prep,
                user_sample : s.user_sample,
                user_kendali : s.user_kendali,
            })
        })
        const fileName = 'report' + this.tglExcelStart + 'sampai' + this.tglExcelEnd  + '.xlsx' ; 
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'data');  

        XLSX.writeFile(wb, fileName);
    });
  }

  refreshPage()
  {
      this.loadingfirst = true;
      this.preparationData = [];
      this.getData();

  }




}
