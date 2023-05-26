import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SampleUjiService } from '../sample-uji.service';
import { fuseAnimations } from '@fuse/animations';
import { Sort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { SampleUjiDetComponent } from "../sample-uji-det/sample-uji-det.component";
import { url } from "app/main/url";
import { ContractcategoryService } from '../../services/contractcategory/contractcategory.service';
import { StatuspengujianService } from '../../services/statuspengujian/statuspengujian.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import Swal from 'sweetalert2';
import * as globals from "app/main/global";
import { PageEvent } from "@angular/material/paginator";


@Component({
  selector: 'app-sample-uji',
  templateUrl: './sample-uji.component.html',
  styleUrls: ['./sample-uji.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SampleUjiComponent implements OnInit {

  pageEvent: PageEvent;
  loadingfirst = false;
  url = url;
  sampleujiData = [];
  displayedColumns: any[] = ['checkbox', 'no_kontrak' , 'sample_name', 'no_sample', 'test_status','tgl_input', 'action'];
  total: number;
  from: number;
  to: number;
  pages = 1;
  current_page : number;
  data = {
    idsample : ''
  };
  dataSelected = {
    sample: [],
    status: '' 
  };
  datasent = {
    pages : 1,
    search : null
  }
  load = false;
  checkList = [];
  allComplete: boolean = false;

  dataFilter = {
    marketing : '',
    samplenumber : '',
    category: '',
    samplename: '',
    status: '',
    pages : 1,
  }

  status = [ 
    {
      "title" : "Normal",
      "id" : 1
    }, 
    {
      "title" : "Urgent",
      "id" : 2
    }, 
    {
      "title" : "Very Urgent",
      "id" : 3
    }, 
    {
      "title" : "Custom 2 Day",
      "id" : 4
    }, 
    {
      "title" : "Custom 1 Day",
      "id" : 5
    }, 
  ]


  access = [];
  searchFilter = false;

  datasentCategory = {
    pages : 1,
    search : null,
    typeContract: null
  }
  contractcategory = [];
  statusPengujian = [];
  
  cobaData = null;
  cancelSearch = false;

  constructor(
    private _menuServ: MenuService,
    private _masterSampleujiServ: SampleUjiService,
    private dialog: MatDialog,  
    private _kontrakategori: ContractcategoryService,
    private _statuspengujian: StatuspengujianService,
    private _route: Router,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getDataContractCategory();
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

  getData(){
    this._masterSampleujiServ.getDataSampleUji(this.dataFilter).then(x => { 
        this.sampleujiData = this.sampleujiData.concat(Array.from(x['data']));
        this.sampleujiData = globals.uniq(this.sampleujiData, (it) => it.id);
        this.total = x["total"];
        this.current_page = x["current_page"] - 1;
        this.from = x["from"];
        this.to = x["per_page"];
        console.log(this.sampleujiData);        
      
    })
  }

  refreshPage()
  {
      this.loadingfirst = true;
      this.sampleujiData = [];
      this.getData();

  }

  async getDataContractCategory(){
    await this._kontrakategori.getDataContractCategory(this.datasentCategory).then(x => {
      this.contractcategory = this.contractcategory.concat(x['data']);
    })
  }

  async cancelCheckbox()
  {
    this.checkList = await [];
    this.sampleujiData = await [];
    await this.getData();
  }

  async searchButton(){
    await console.log(this.dataFilter)
    this.sampleujiData = await [];
    this.loadingfirst = await true;
    await this.getData();
}

async cancelSearchMark() {    
  this.dataFilter.status = await null;
  this.dataFilter.marketing = await null;
  this.dataFilter.status = await null;
  this.dataFilter.category = await null;
  this.dataFilter.samplename = await null;
  this.dataFilter.samplenumber = await null;
  this.sampleujiData = await [];
  this.loadingfirst = await true;
  await this.getData();
}

  onSearchChange(ev){
    this.sampleujiData = [];
    this.dataFilter.marketing = ev;
    this.getData();
  }

  searchMarketing(ev){
      
    this.dataFilter.marketing = ev;
    this.sampleujiData = [];
    this.getData();
    console.log(this.dataFilter);
  }

    searchSampleName(ev){
    this.sampleujiData = [];    
    this.dataFilter.samplename = ev;
    this.getData();
    console.log(this.dataFilter);
  }

  searchSampleNumber(ev){
    this.sampleujiData = [];    
    this.dataFilter.samplenumber = ev;
    this.getData();
    console.log(this.dataFilter);
  }


  searchCategory(ev){
    console.log(ev)
    this.dataFilter.category = ev.value;
    this.sampleujiData = [];
    this.getData();
    console.log(this.dataFilter);
  }


  paginated(f){
    console.log(f)
    this.sampleujiData = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getData();
  }

  sortData(sort: Sort) {
    const data = this.sampleujiData.slice();
    if ( !sort.active || sort.direction === '') {
      this.sampleujiData = data;
      return;
    }
    this.sampleujiData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'no_sample': return this.compare(a.no_sample, b.no_sample, isAsc);
        case 'sample_name': return this.compare(a.sample_name, b.sample_name, isAsc);
        case 'tgl_input': return this.compare(a.tgl_input, b.tgl_input, isAsc);
        case 'no_kontrak': return this.compare(a.kontrakuji.contract_no, b.kontrakuji.contract_no, isAsc);
        default: return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  resetStatisic()
  { 
      this.total = null;
      this.from = null
      this.to = null
      this.pages = null;

  }

  changeStatus(v){
    this.dataSelected.sample = this.dataSelected.sample.concat({
      idsample: v
    });
    this.dataSelected.status = "SAMPLEUJI";
    console.log(this.dataSelected);
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change status sample!',
      cancelButtonText: 'No, cancel it'
    }).then((result) => {
      if (result.value) {
        this._masterSampleujiServ.changeStatusSample(this.dataSelected).then(x => {
          
          this.sampleujiData = [];
          this.getData();
        });
        Swal.fire(
          'Status Change!',
          'Your status sample has been change.',
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

  gotoModulSample(v, i) : void {

    const dialogRef = this.dialog.open(SampleUjiDetComponent, {
      height: "auto",
      width: "1000px",
      panelClass: 'sample-uji-modal',
      disableClose: true,
      data: {
            id_sample: v,
            index: i,
            data_filter : this.dataFilter
          }
    });

    dialogRef.afterClosed().subscribe(result => {
    //  this.sampleujiData = [];
    //  this.getData();
    });

  }

  // baru bachtiar
  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.sampleujiData == null) {
      return;
    }
    if(completed == true)
    {
      this.sampleujiData.forEach(t => t.completed = completed);
      this.sampleujiData.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.sampleujiData.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }

  updateAllComplete() {
    this.allComplete = this.sampleujiData != null && this.sampleujiData.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.sampleujiData == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.sampleujiData.filter(t => t.completed).length > 0 && !this.allComplete;      
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

  ApproveSample()
  {
    let a = [];
    this.checkList.forEach( x => {
        if(x.checked == true){
            a.push(x)
        }
    })
    console.log(a)
    Swal.fire({
      title: 'Approve Sample?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
  }).then((result) => {
      if (result.value) {
            this._masterSampleujiServ.approveSample(a); 
            let message = {
              text: 'Data Succesfully Approved',
              action: 'Done'
            }
          setTimeout(()=>{
            this.sampleujiData = [];
            this.getData();
            this.checkList = [];
            this.openSnackBar(message);
            this.load = false; 
          },2000) 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Cancel Approve Data',
          'error'
        )
      }
  })
  }

  cancelApprove()
  {
    this.checkList = [];
    this.sampleujiData = [];
    this.getData();
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  clickFilter(param)
  {   
      this.searchFilter = param
      if(this.searchFilter == false){
        this.sampleujiData = [];
        this.dataFilter.samplename = '';
        this.dataFilter.samplenumber = '';
        this.dataFilter.category = '';
        this.dataFilter.marketing = '';
        this.loadingfirst = true;
        this.getData();
      } 
      
  }

  reset(e){ 
    if (e === "marketing") { 
      this.dataFilter.marketing = null; 
      this.sampleujiData = [];
      this.getData();
    } else if (e === "samplenumber"){ 
      this.dataFilter.samplenumber = null; 
      this.sampleujiData = [];
      this.getData();
    } else if (e === "samplename"){  
      this.dataFilter.samplename = null;
      this.sampleujiData = [];
      this.getData();
    } else if (e === "category"){  
      this.dataFilter.category = null; 
      this.sampleujiData = [];
      this.getData();
    } 
  }

}
