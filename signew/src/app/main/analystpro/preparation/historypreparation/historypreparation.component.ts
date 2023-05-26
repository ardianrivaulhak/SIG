import { forEach } from 'lodash';
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
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { ModalhistoryComponent } from '../historypreparation/modalhistory/modalhistory.component';
import { MatDialog } from "@angular/material/dialog";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-historypreparation',
  templateUrl: './historypreparation.component.html',
  styleUrls: ['./historypreparation.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class HistorypreparationComponent implements OnInit {

  loadingfirst = false;
  preparationData = [];
  displayedColumns: string[] = [
    'sample_name', 
    'no_sample',
    'contract_no',
    //'contract_category',
    'status',
    'estimation_lab',
    'user_sample',
    'desc_sample',
    'action'
  ];
  total: number;
  from: number;
  to: number;
  pages = 1;

  dataFilter = {
    marketing : null,
    information : null,
    category: null,
    customer_name: null,
    pages : 1,
  }

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
  dataExcel = [];
  tglExcel: number;

  constructor(
    private _menuServ: MenuService,
    private _masterPreparationServ: PreparationService,
    private _kontrakategori: ContractcategoryService,
    private _statuspengujian: StatuspengujianService,
    private _route: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getData();
   
    this.getDataContractCategory();
  }

  onSearchChange(ev){
    this.preparationData = [];
    this.dataFilter.marketing = ev;
    this.getData();
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
    console.log(this.dataFilter);
    await this._masterPreparationServ.getDataHistory(this.dataFilter).then(async x => {
      let b = [];
      b = await b.concat(Array.from(x['data']));      
      await b.forEach(x => {
        this.preparationData = this.preparationData.concat({
          id: x.id,
          id_contract: x.id_contract,
          sample_name : x.sample_name,
          no_sample : x.no_sample,
          contract_no : x.kontrakuji.contract_no,
          category : x.kontrakuji.contract_category.title,
          categorycode : x.kontrakuji.contract_category.category_code,
          status : x.statuspengujian.name,
          id_status : x.id_statuspengujian,
          id_statuspengujian : x.id_statuspengujian,
          catalogue : x.subcatalogue.sub_catalogue_name,
          estimasi_lab : x.tgl_estimasi_lab,
          user_smple : x.sample_condition_histprep.user.employee_name,
          desc : x.desc_prep == null ? '-' : x.desc_prep.desc
        })
      })
      this.preparationData = this.uniq(this.preparationData, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }
    })
    await console.log(this.preparationData);
   
  }

  async getDataContractCategory(){
    await this._kontrakategori.getDataContractCategory(this.datasentCategory).then(x => {
      this.contractcategory = this.contractcategory.concat(x['data']);
    })
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

  searchMarketing(ev){
      
    this.dataFilter.marketing = ev;
    this.preparationData = [];
    this.getData();
    console.log(this.dataFilter);
  }

  searchInformation(ev){
    this.preparationData = [];    
    this.dataFilter.information = ev;
    this.getData();
    console.log(this.dataFilter);
  }

  searchCompany(ev){
    this.preparationData = [];    
    this.dataFilter.customer_name = ev;
    this.getData();
    console.log(this.dataFilter);
  }


  searchCategory(ev){
    console.log(ev)
    this.dataFilter.category = ev.value;
    this.preparationData = [];
    this.getData();
    console.log(this.dataFilter);
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
        case 'sample_name': return this.compare(a.sample_name, b.sample_name, isAsc);
        case 'no_sample': return this.compare(a.no_sample, b.no_sample, isAsc);
        case 'contract_no': return this.compare(a.contract_no, b.contract_no, isAsc);
        case 'contract_type': return this.compare(a.contract_type, b.contract_type, isAsc);
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
        this.preparationData = [];
        this.dataFilter.customer_name = null;
        this.dataFilter.information = null;
        this.dataFilter.category = null;
        this.dataFilter.marketing = null;
        this.loadingfirst = true;
        this.getData();
      } 
      
  }

  reset(e){ 
    if (e === "marketing") { 
      this.dataFilter.marketing = null; 
      this.preparationData = [];
      this.getData();
    } else if (e === "information"){ 
      this.dataFilter.information = null; 
      this.preparationData = [];
      this.getData();
    } else if (e === "customer_name"){  
      this.dataFilter.customer_name = null;
      this.preparationData = [];
      this.getData();
    } else if (e === "category"){  
      this.dataFilter.category = null; 
      this.preparationData = [];
      this.getData();
    } 
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }


  backToControl(idcontract) {
   console.log(idcontract)
    Swal.fire({
      title: 'Are you sure?',
      text: 'The contract will return to control!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Do it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this._masterPreparationServ.toControl(idcontract)
        this.preparationData = [];
        this.getData();
        Swal.fire(
          'Success Back to Control!',
          'Your contract back to control.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }

  ReportModals() : void 
  {
    let dialogCust = this.dialog.open(ModalhistoryComponent, {
      panelClass: 'memoprep-dialog',
      data: 'asd'
    });
   
    dialogCust.afterClosed().subscribe(async (result) => {
        await console.log(result); 
        this.tglExcel = await result.c;
        this.downloadExcel();
    });
  }

  async downloadExcel(){
    this.dataExcel = []; 
    let a = 'asdasd'
    console.log(this.tglExcel)
    await this._masterPreparationServ.downloadExcel(this.tglExcel).then(x => {
        let b = []
        b = b.concat(x);  
        console.log( b)
        b.forEach((s , i) => {
            this.dataExcel = this.dataExcel.concat({
                contract_no : s.contract_no,
                sample_no : s.no_sample,
                sample_name: s.sample_name,
                subcatalog : s.sub_catalogue_name,
                status : s.name,
                estiamsilab : s.tgl_estimasi_lab,
                ket_sample : s.desc,
                user_prep : s.user_prep,
                user_sample : s.user_sample,
                // lab : [], 
            })
            // console.log(Object.keys(s.bobotinfo))
            // s.bobotinfo.forEach(( w, z) => {
            //     this.dataExcel[i][w.labname.nama_lab] = w.value;
            // })
        })
        console.log(this.dataExcel)
        const fileName = 'report' + this.tglExcel + '.xlsx' ; 
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'data');  

        XLSX.writeFile(wb, fileName);
    });
  }




}
