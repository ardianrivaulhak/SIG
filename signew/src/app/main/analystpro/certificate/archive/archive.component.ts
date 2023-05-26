import { Component, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../certificate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { ContractcategoryService } from '../../services/contractcategory/contractcategory.service';
import { StatuspengujianService } from '../../services/statuspengujian/statuspengujian.service';
import { CustomerService } from 'app/main/analystpro/master/customers/customer.service';
import * as globals from 'app/main/global';


@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ArchiveComponent implements OnInit {

  loadingfirst = true;
  searchFilter = false;
  dataCertificate = [];
  displayedColumns: string[] =  ['contract_no', 'hold', 'customer_name' , 'desc' ,'team'];
  total: number;
  from: number;
  to: number;
  pages = 1;
  load = false;
  data = {
    id : ''
  };
  dataFilter = {
    status : null,
    pages : 1,
    type : "paginate",
    marketing : null,
    team: null,
    customer_name: null,
    category: null,
    lhu: null,
    hold: null,
    date_lhu: null
  }

  formdata = {
    marketing : null,
    status : null,
    category : null,
    lhu: null,
    customer: null,
    team : null
  }

  status_cert = [
    {
      'name' : 'Draft',
      'value' : 3
    },
    {
      'name' : 'Certificate',
      'value' : 4
    }
  ]

  checkList = []
  allComplete: boolean = false;
  contractcategory = [];
  statusPengujian = [];

  cobaData = null;
  cancelSearch = false;
  categories = null
  teamates = null
  custName = null
  
  team = [];
  datasentCustomer = {
    pages : 1,
    search : null
  }
  customersData = [];

  dataHold = [
    {
      "id" : 'Y',
      "hold": "hold"
    },
    {
      "id" : 'N',
      "hold": "unhold"
    }
  ];

  constructor(
    private _certServ: CertificateService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _kontrakategori: ContractcategoryService,
    private _statuspengujian: StatuspengujianService,
    private _customersServ: CustomerService,
  ) { }

  ngOnInit(): void {
    this.getSampleLab();
    this.getDataContractCategory();
    this.getDataStatusPengujian();
    this.getTeam();
    this.getDataCustomer();
  }

  getDataCustomer(){
    console.log(this.datasentCustomer)
    this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
      this.customersData = this.customersData.concat(Array.from(x['data']));
      this.customersData = globals.uniq(this.customersData, (it) => it.id_customer);
      // this.total = x['total'];
      // this.from = x['from'] - 1;
      // this.to = x['to'];
    });
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
  
  async getSampleLab(){
    console.log(this.dataFilter)
    await this._certServ.getArchiveData(this.dataFilter).then(async x => {
      this.dataCertificate = await this.dataCertificate.concat(x['data']);
      this.dataCertificate = await globals.uniq(this.dataCertificate, (it) => it.id_contract);
     
        this.total = await x['total'];
        this.from = await x['from'] - 1;
        this.to = await x['to']
    })
    .then(() => console.log(this.dataCertificate));
    this.loadingfirst =  await false; 
  }


  async getDataContractCategory(){
    await this._kontrakategori.getDataContractCategory(this.dataFilter).then(x => {
      this.contractcategory = this.contractcategory.concat(x['data']);
    })
    console.log(this.contractcategory)
  }

  async getDataStatusPengujian(){
    await this._statuspengujian.getDataStatusPengujian(this.dataFilter).then(x => {
      this.statusPengujian = this.statusPengujian.concat(x['data']);
    })
  }

  paginated(f){
    this.dataCertificate = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getSampleLab();
  }

  sortData(sort: Sort) {
    const data = this.dataCertificate.slice();
    if ( !sort.active || sort.direction === '') {
      this.dataCertificate = data;
      return;
    }
    this.dataCertificate = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'lhu': return this.compare(a.lhu, b.lhu, isAsc);
        case 'contract_no': return this.compare(a.contract_no, b.contract_no, isAsc);
        case 'category_code': return this.compare(a.category_code, b.category_code, isAsc);
        case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'pic': return this.compare(a.pic, b.pic, isAsc);
        case 'team': return this.compare(a.team, b.team, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  // async searchMarketing(ev){      
  //   this.dataFilter.marketing = await ev;
  //   this.dataCertificate = await [];
  //   this.loadingfirst = await true;
  //   await this.getSampleLab();
  //   console.log(this.dataFilter);
  // }

  // async searchTeam(ev){    
  //   this.dataFilter.team = await ev;
  //   this.loadingfirst = await true;
  //   this.dataCertificate = await [];      
  //   await  this.getSampleLab();
  //   console.log(this.dataFilter);
  // }

  // async searchCompany(ev){    
  //   this.dataFilter.customer_name = await ev;    
  //   this.loadingfirst = await true; 
  //   this.dataCertificate = await []; 
  //   await this.resetStatisic();    
  //   await this.getSampleLab();
  //   console.log(this.dataFilter);
  // }


  // async searchCategory(ev){
  //   this.dataFilter.category = await ev.id;
  //   this.loadingfirst = await true;
  //   this.dataCertificate = await[];
  //   await this.resetStatisic();
  //   await this.getSampleLab();
  //   console.log(this.dataFilter);
  // }

  async reset(e){ 
    if (e === "marketing") { 
      this.dataFilter.marketing = null; 
      this.loadingfirst = true;
      this.dataCertificate = [];
      this.getSampleLab();
    } else if (e === "team"){ 
      this.dataFilter.team = null; 
      this.loadingfirst = true;
      this.dataCertificate = [];
      this.getSampleLab();
    } else if (e === "customer_name"){  
      this.dataFilter.customer_name = null;
      this.loadingfirst = true;
      this.dataCertificate = [];
      this.getSampleLab();
    } else if (e === "category"){  
      this.dataFilter.category = null; 
      this.loadingfirst = true;
      this.dataCertificate = [];
      this.getSampleLab();
    } 
    await this.resetStatisic();
  }

  clickFilter(param)
  {   
      this.searchFilter = param
      if(this.searchFilter == false){
        this.dataCertificate = [];
        this.dataFilter.marketing = null; 
        this.dataFilter.customer_name = null; 
        this.dataFilter.category = null; 
        this.dataFilter.team = null;
        this.loadingfirst = true;
        this.getSampleLab();
      } 
      
  }

  async searchButton(){
    
    console.log(this.dataFilter)    
    this.dataCertificate = await [];
    this.loadingfirst = await true;
    await this.getSampleLab();
  }

  async cancelSearchMark()
  {
    this.dataFilter.status  = await null;
    this.dataFilter.marketing  = await null;
    this.dataFilter.team  = await null;
    this.dataFilter.customer_name  = await null;
    this.dataFilter.category  = await null;
    this.dataFilter.lhu  = await null;
    this.dataFilter.date_lhu  = await null;
    this.dataFilter.hold = await null;

    this.dataCertificate = await [];
    this.loadingfirst = await true;
    await this.getSampleLab();
    await console.log(this.dataFilter);
  }

  resetStatisic()
  { 
    this.total = null;
    this.from = null
    this.to = null
    this.pages = null;
  }

  goToDetail(id)
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/analystpro/archive-certificate/${id}`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

  async getTeam(){
    await this._certServ.getTeam(this.dataFilter).then(x => {
      this.team = this.team.concat(x);
    })
    console.log(this.team)
  }



  
}
