import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from "xlsx";
import { ComplainService } from "../complain.service";
import { ActionprepComponent } from "./modals/actionprep/actionprep.component";
import * as globals from "app/main/global";
import { ExportDataComponent } from "./modals/export-data/export-data.component";
import { PreparationComponent } from '../../preparation/preparation/preparation.component';

@Component({
  selector: 'app-complain-preparation',
  templateUrl: './complain-preparation.component.html',
  styleUrls: ['./complain-preparation.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ComplainPreparationComponent implements OnInit {

  loadingfirst = true;
  displayedColumns: string[] = [ 
    'marketing', 
    'no_complaint',
    'sample' ,
    'parameter', 
    'lab',   
    'confirmation', 
    'stats',
    'action'
  ];

  prepData = [];
  total: number;
  from: number;
  to: number;
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
    pages : 1,
    type : "paginate",
    marketing : '',
    sample_name: '',
    sample_number: '',
    complain_number: '',
    status: '',
    parameter: ''
  }

  contractcategory = [];
  statusPengujian = [];

  cobaData = null;
  cancelSearch = false;
  resultForm : FormGroup;

  status_cert = [ 
    {
      "title" : "New",
      "id" : 2
    }, 
    {
      "title" : "Hold",
      "id" : 3
    }, 
    {
      "title" : "Go",
      "id" : 4
    }, 
  ]

  datasentCustomer = {
    pages : 1,
    search : null
  }
  customersData = [];

  dataExcel = [];
  tglExcelStart = '';
  tglExcelEnd = ''

  constructor(
    private _masterServ : ComplainService,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
    await this._masterServ.getDataPrep(this.dataFilter).then(x => {
      this.prepData = this.prepData.concat(Array.from(x['data']));
      this.prepData = globals.uniq(this.prepData, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to'];
      }  
    })
    .then(() => this.resultForm = this.createLabForm());
    this.loadingfirst =  await false;
    await console.log(this.prepData)
  }

  paginated(f){
    console.log(f)
      this.prepData = [];
      this.dataFilter.pages = f.pageIndex + 1;
      this.getData();
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

  actionPreparation(data)
  {
    const dialogRef = this._matDialog.open(ActionprepComponent, {
      panelClass: 'complain-actionprep-dialog',
      width: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe( result => {
        console.log(result)
        if(result.v == false){
          this.prepData = []
          this.getData() 
        }
    });
  }

  async searchButton()
  {
    this.prepData = await [];
    await this.getData();
  }

  async cancelSearchMark()
  {
    this.dataFilter.marketing = await '';
    this.dataFilter.sample_name = await '';
    this.dataFilter.sample_number = await '';
    this.dataFilter.complain_number = await '';
    this.dataFilter.parameter = await '';
    this.dataFilter.status = await '';
    this.dataFilter.pages = 1;
    this.prepData = await [];
    await this.getData();
  }
 
  ReportModals() : void 
  {
    let dialogCust = this._matDialog.open(ExportDataComponent, {
      panelClass: 'prep-complain-dialog',
      data: 'asd'
    });
   
    dialogCust.afterClosed().subscribe(async (result) => {
        this.tglExcelStart = await result.c;
        this.tglExcelEnd = await result.d;
        this.downloadExcel();
    });
  }

  async downloadExcel(){
    console.log([this.tglExcelStart, this.tglExcelEnd])
    this.dataExcel = []; 
   let a = {
     tglStart : this.tglExcelStart,
     tglEnd : this.tglExcelEnd
   }
    await this._masterServ.exportData(a).then(x => {
        let b = []
        b = b.concat(x);  
        b.forEach((s , i) => {
            this.dataExcel = this.dataExcel.concat({
                contract_no : s.complain_tech.complain_cs.transaction_sample.kontrakuji.contract_no,
                sample: s.complain_tech.complain_cs.transaction_sample.no_sample,              
                no_complaint : s.complain_tech.complain_no,                 
                matriks : s.complain_tech.complain_cs.transaction_sample.subcatalogue.sub_catalogue_name,
                parameter : s.parameteruji.name_id,
                lab : s.lab.nama_lab,
                confirmation : s.memo,
            })
        })
        const fileName = 'report' + this.tglExcelStart + 'sampai' + this.tglExcelEnd  + '.xlsx' ; 
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'data');  

        XLSX.writeFile(wb, fileName);
    });
  }

}
