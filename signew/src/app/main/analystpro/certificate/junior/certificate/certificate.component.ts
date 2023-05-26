import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CertificateService } from '../../certificate.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractcategoryService } from '../../../services/contractcategory/contractcategory.service';
import { StatuspengujianService } from '../../../services/statuspengujian/statuspengujian.service';
import { CustomerService } from '../../../master/customers/customer.service';
import { ParameterCertificatemodalsComponent } from "../modals/parametermodals/parametermodals.component";
import { ModalSetContractComponent } from './modal-set-contract/modal-set-contract.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from "xlsx";
@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CertificateComponent implements OnInit {

  loadingfirst = true;
  displayedColumns: string[] = [ 'contract_no', 'hold', 'customer_name' , 'desc', 'progress','action'];
  certData = [];

  total: number;
  from: number;
  to: number;
  pages = 1;

  totalcust: number;
  fromcust: number;
  tocust: number;
  pagescust = 1;

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
    pages : 1,
    type : "paginate",
    marketing : '',
    status: '',
    customer_name: '',
    lhu: '',
    category: '',
    hold: ''
  }

  contractcategory = [];
  statusPengujian = [];

  cobaData = null;
  cancelSearch = false;
  resultForm : FormGroup;

  status_cert = [ 
    {
      "title" : "ROA",
      "id" : 1
    }, 
    {
      "title" : "ROA Approve",
      "id" : 2
    }, 
    {
      "title" : "Draft",
      "id" : 3
    }, 
  ]

  status_inv = [ 
    {
      "title" : "Hold",
      "id" : "Y"
    }, 
    {
      "title" : "Unhold",
      "id" : "N"
    }, 
  ]


  datasentCustomer = {
    pages : 1,
    search : null
  }
  customersData = [];

  formdata = {
      marketing: null,
      category: null,
      customer: null,
      lhu: null,
      status: null,
      hold: null
  }

  
  downloadExcel = []


  constructor(
    private _masterServ: CertificateService,
    private _matDialog: MatDialog,
    private _kontrakategori: ContractcategoryService,
    private _statuspengujian: StatuspengujianService,
    private _custService: CustomerService,
    private _formBuild: FormBuilder,
    private _customersServ: CustomerService,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getDataContractCategory();
    this.getDataCustomer();
  }

  async getData(){
    await this._masterServ.getContractData(this.dataFilter).then(x => {
      this.certData = this.certData.concat(Array.from(x['data']));
      this.certData = this.uniq(this.certData, (it) => it.id_kontrakuji);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to'];
      }  
       
    })
    .then(() => this.resultForm = this.createLabForm());
    this.loadingfirst =  await false;
  }

  async getDataContractCategory(){
    await this._kontrakategori.getDataContractCategory(this.datasent).then(x => {
      this.contractcategory = this.contractcategory.concat(x['data']);
    })
  }

  getDataCustomer(){
    this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
      this.customersData = this.customersData.concat(Array.from(x['data']));
      this.customersData = this.uniq(this.customersData, (it) => it.id_customer);
      if(!this.totalcust){
        this.totalcust = x['total'];
        this.fromcust = x['from'] - 1;
        this.tocust = x['to'];
      }
    });
  } 

  exportSampleInformation(){
      const dialogRef = this._matDialog.open(ModalSetContractComponent, {
      width: '400px'
      });

      dialogRef.afterClosed().subscribe( result => {
          if(result){
            this.getDataExcelByContract(result);
          }
      });
  }


  getDataExcelByContract(v){
    this._masterServ.sampleCertInformationByContract(v).then(x =>
    { 
     this.downloadExcel = this.downloadExcel.concat(x)
     const fileName = "report.xlsx"
     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.downloadExcel)
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, "data");
     XLSX.writeFile(wb, fileName);
    })
   

    
  }

  paginated(f){
    this.certData = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getData();
  }

  sortData(sort: Sort) {
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
        case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'desc': return this.compare(a.desc, b.desc, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  createLabForm(): FormGroup {       
    return this._formBuild.group({
      marketing:[''],
      category:[''],
      customer:[''],
      lhu:[''],
      status:['']
    })
  }

  async searchButton(){
    this.dataFilter.marketing = this.formdata.marketing
    this.dataFilter.customer_name = this.formdata.customer
    this.dataFilter.category =   this.formdata.category
    this.dataFilter.status = this.formdata.status
    this.dataFilter.lhu = this.formdata.lhu
    this.dataFilter.hold = this.formdata.hold
    this.certData = await [];
    this.loadingfirst = await true;
    await this.getData();
  }

  async cancelSearchMark()
  {
    this.formdata.marketing = await ''
    this.formdata.customer = await ''
    this.formdata.category = await ''
    this.formdata.status = await ''
    this.formdata.lhu = await ''
    this.formdata.hold = await ''

    this.dataFilter.marketing = await ''
    this.dataFilter.customer_name  = await ''
    this.dataFilter.category  = await ''
    this.dataFilter.status  = await ''
    this.dataFilter.lhu  = await ''
    this.dataFilter.hold = await ''

    this.certData = await [];
    this.loadingfirst = await true;
    await this.getData();
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
    if (e === "marketing") { 
      this.dataFilter.marketing = null; 
      this.loadingfirst = true;
      this.certData = [];
      this.getData();
    } else if (e === "customer_name"){  
      this.dataFilter.customer_name = null;
      this.loadingfirst = true;
      this.certData = [];
      this.getData();
    } else if (e === "category"){  
      this.dataFilter.category = null; 
      this.loadingfirst = true;
      this.certData = [];
      this.getData();
    } 
  }


  parameterModals(id)
  {
      const dialogRef = this._matDialog.open(ParameterCertificatemodalsComponent, {
      panelClass: 'certificate-parameter-dialog',
      width: '100%',
      data: {idtransactionsample : id}
      });

      dialogRef.afterClosed().subscribe( result => {
      id = result;
      });
  }

  onScrollToEnd(e) {
    if (e === "customer") {
      this.datasentCustomer.pages = this.datasentCustomer.pages + 1; 
      this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(x['data']);
      });
    }
    
  }

  goToDetail(id)
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/analystpro/certificate/${id}/lhu`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

  goSample(id)
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/analystpro/certificate/${id}/samplelab`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }



}
