import { Kontrakuji } from './../../lab-pengujian/data.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PreparationService } from '../preparation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from "@angular/material/dialog";
import { Sort } from '@angular/material/sort';
import { ModalbobotComponent } from "../preparation-det/modalbobot/modalbobot.component";
import Swal from 'sweetalert2';
import { MemocontroldialogComponent } from './memocontroldialog/memocontroldialog.component'; 
import { MemopreparationdialogComponent } from './memopreparationdialog/memopreparationdialog.component'; 
import * as globals from "app/main/global";
import { ModalAttachmentContractComponent } from "app/main/analystpro/contract/modal-attachment-contract/modal-attachment-contract.component";
import { ContractService } from "../../services/contract/contract.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";

@Component({
  selector: 'app-preparation-det',
  templateUrl: './preparation-det.component.html',
  styleUrls: ['./preparation-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PreparationDetComponent implements OnInit {
  
  displayedColumns: any[] = [
  'checkbox',
   'sample_name',
   'no_sample',
   'stat_pengujian', 
   'stat_bobot',
   'sample_uji', 
   'action'
  ];
  load = false;

  idContract: any;
  contractData = [];
  loadingfirst = false;
  
  hide = true;
  dataPreparation = {
    idcontract: ''
  };
  detaildata = [];
  total: number;
  from: number;
  to: number;
  pages = 1;
  current_page : number;
  
  datasent = {
    pages : 1,
    search : null
  }
  dataDetailSample = {
    id_sample: ''
  };
  idbobotsample: number;
  databobotsample = [];
  copyIdBobotSample= [];
  copyBobotSample = [];
  pasteBobotSample = {
    data: []
  }
  pasteAllBobotSample = {
    data: []
  }
  sampledata = [];
  dataSample = {
    idcontract: ''
  };
  dataApprov = {
    id_contract: ''
  };
  
  parameterData = [];
  dataParameter = {
    id_sample: ''
  };
  idsample: any;

  hasSelected: boolean;
  isIndeterminate: boolean;
  selected: boolean;
  dataSelected = {
    sample: [],
    status: '' 
  };
  dataApprovSelect = [];
  checkList = [];
  dataFilter = {
    pages : 1,
    id_contract : this._actRoute.snapshot.params['id'],
    sample_name : null,
    sample_number : null,
    status : null
  }

  datasub = {
    page: 1,
    id_catalogue: null,
    search: null,
  };
  datasend = {
    page: 1,
    search: null,
  }
  
  preparationForm: FormGroup;
  idpreparation: any;
  allComplete: boolean = false;

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

  loadingprev = false;

  constructor(
    private _masterServ: PreparationService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _matDialog: MatDialog,
    private _kontrakServ: ContractService,
    private _pdfServ: PdfService,
  ) { 
    
  }
  
  ngOnInit(): void {
    this.getContractDetail();
    this.getDataSample();    
  }

  getContractDetail()
  {
    this._masterServ.getDetailContract(this.dataFilter.id_contract)
    .then(x => this.contractData = this.contractData.concat(x))
    .then(c => console.log(this.contractData))
  }

  async getDataSample(){
    await this._masterServ.getDataDetailPreparation(this.dataFilter)
        .then(async x => {
          this.sampledata = this.sampledata.concat(Array.from(x['data']));
          this.sampledata = globals.uniq(this.sampledata, (it) => it.id);

          this.total = x['total'];
          this.from = x['from'] - 1;
          this.to = x['to']
    })
    .then((x) =>
        setTimeout(() => {
            this.loadingfirst = false;
        }, 500)
    );
  }

  onSearchChange(ev){
    this.sampledata = [];
    this.datasend.search = ev;
    this.getDataSample();
  }

  approvContrak(){
    this.dataApprov.id_contract = this.idpreparation;
    this._masterServ.approvPreparation(this.dataApprov).then(x => {
      console.log(this.dataApprov)
      this.load = true;
      let message = {
        text: 'Data Succesfully Approved',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this.load = false;
        this._route.navigateByUrl('analystpro/preparation');
        this.load = false;
      },2000)
    }) 
  }
 

  approvSample(v){
    console.log(v);    
   
    this.dataSelected.sample = [];
    this.dataSelected.sample = this.dataSelected.sample.concat({
      idsample: v
    });
    this.dataSelected.status = "PREPARATION";
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
        
        this._masterServ.changeStatusSample(this.dataSelected).then(x => {
        }); 
        let message = {
          text: 'Data Succesfully Approved',
          action: 'Done'
        }
        setTimeout(()=>{
          this.sampledata = [];
          this.getDataSample();
          this.openSnackBar(message);
          this.load = false; 
        },2000) 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }

 

  descriptionModals() : void 
  {
    let dialogCust = this._matDialog.open(MemocontroldialogComponent, {
      panelClass: 'memocontrol-dialog',
      data: { idContract : this.dataFilter.id_contract
                } 
    });
    
    dialogCust.afterClosed().subscribe((result) => {
      if(result.ev == false){
        this.sampledata=[];
        this.getDataSample();
       }
    });
  }

  descriptionInfoModals(id, select) : void 
  {
    let dialogCust = this._matDialog.open(MemopreparationdialogComponent, {
      panelClass: 'memoprep-dialog',
      data: { idContract : this.dataFilter.id_contract,  idSample : id, bulkdata: this.checkList, select : select} ,
      disableClose : true,
    });
    
    dialogCust.afterClosed().subscribe((result) => {
      if(result.ev == false){
        this.checkList = []
        this.sampledata=[];
        this.getDataSample();
       }
    });
  }

 

  async searchButton() {         
    this.sampledata = await [];
    this.loadingfirst = await true;
    await this.getDataSample();
  }

  async cancelSearchMark() {    
      this.dataFilter.status = await null;
      this.dataFilter.sample_name = await null;
      this.dataFilter.sample_number = await null;
      this.sampledata = await [];
      this.loadingfirst = await true;
      await this.getDataSample();
  }

  
  paginated(f){
    this.sampledata = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getDataSample();
  }

  getDataParameter(v){    
    this.parameterData = [];
    this.dataParameter.id_sample = v;
    this._masterServ.getDataDetailPreparationParameter(this.dataParameter).then(x => {
      this.parameterData = this.parameterData.concat(Array.from(x['data']));
      console.log(this.parameterData);
    }) 
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.sampledata == null) {
      return;
    }
    if(completed == true)
    {
      this.sampledata.forEach(t => t.completed = completed);
      this.sampledata.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.sampledata.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }

  updateAllComplete() {
    this.allComplete = this.sampledata != null && this.sampledata.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.parameterData == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.parameterData.filter(t => t.completed).length > 0 && !this.allComplete;      
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

  async cancelCheckbox()
  {
    this.checkList = await [];
    this.sampledata = await [];
    await this.getDataSample();
  }


  approveData(){
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
            this._masterServ.approveSample(a);  
            let message = {
              text: 'Data Succesfully Approved',
              action: 'Done'
            }
            setTimeout(()=>{
              this.sampledata = [];
              this.getDataSample();
              this.openSnackBar(message);
              this.checkList = [];
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

  createLabForm(): FormGroup {
    
    console.log(this.detaildata);
    return this._formBuild.group({
       
      nama_prinsipal :[{
          value: this.detaildata[0].id !== 'add' ? this.detaildata[0].kontrakuji.customers_handle.customers.customer_name : '',
          disabled: this.detaildata[0].id !== 'add' ? true : false
        }],
      no_kontrakuji :[{
          value: this.detaildata[0].id !== 'add' ? this.detaildata[0].kontrakuji.contract_no : '',
          disabled: this.detaildata[0].id !== 'add' ? true : false
        }],
      estimasi_selesai :[{
          value: this.detaildata[0].id !== 'add' ? this.detaildata[0].kontrakuji.tanggal_selesai : '',
          disabled: this.detaildata[0].id !== 'add' ? true : false
        }]
    })
  }

  async gotoModulBobot(v){
    console.log(v);
    this.parameterData = await [];
    this.dataParameter.id_sample = await v;
    await console.log({a:this.parameterData ,b:this.databobotsample});
    this.databobotsample = await [];
    this.dataDetailSample.id_sample = await v.id;
     await this._masterServ.getDataDetailPreparationSample(this.dataDetailSample).then(x => {
       console.log(x['kontrakuji'].id_kontrakuji)
      this.databobotsample = this.databobotsample.concat(x['bobotsample']);
      console.log(this.databobotsample)
      
      let dialogCust = this._matDialog.open(ModalbobotComponent, {
            maxWidth: '90vw',
            maxHeight: '90vh',
            height: '100%',
            width: '100%',
            disableClose: true,
            panelClass: 'sample-dialog',
            data: {
                id_sample: v.id,
                dataBobot: this.databobotsample.length > 0 ? this.databobotsample : '',
                dataParameter: this.parameterData.length > 0 ? this.parameterData : '',
                id_preparation: this.idpreparation,
                id_kontrakuji : x['kontrakuji'].id_kontrakuji,
                sample : v
              }
            });
      dialogCust.afterClosed().subscribe((result) => {
        if(result == false){
          this.sampledata=[];
          this.getDataSample();
        }
      });
            
    }) 

  }


  sortData(sort: Sort) {
    const data = this.sampledata.slice();
    if ( !sort.active || sort.direction === '') {
      this.sampledata = data;
      return;
    }
    this.sampledata = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'sample_name': return this.compare(a.sample_name, b.sample_name, isAsc);
        case 'no_sample': return this.compare(a.no_sample, b.no_sample, isAsc);
        case 'stat_pengujian': return this.compare(a.stat_pengujian, b.stat_pengujian, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }



  getbobotSample(v){
    // this.copyBobotSample = [];
    console.log(v);
    console.log(this.copyBobotSample);
    console.log(this.pasteBobotSample);
    this.dataDetailSample.id_sample = v;
    this._masterServ.getDataDetailPreparationSample(this.dataDetailSample).then(async x => {
      this.databobotsample = this.databobotsample.concat(Array.from(x['bobotsample']));
      console.log(this.databobotsample);
    })
    
  }
  
  copybobotSambple(v){
    this.copyBobotSample = [];
    console.log(v);
    this.dataDetailSample.id_sample = v;
    this._masterServ.getDataDetailPreparationSample(this.dataDetailSample).then(async x => {
      this.copyBobotSample = this.copyBobotSample.concat(Array.from(x['bobotsample']));
      console.log(this.copyBobotSample);
    })
  }

  pastebobotSambple(v){ 
    this.pasteBobotSample.data = [];
    this.copyBobotSample.forEach(x=>{
      this.pasteBobotSample.data = this.pasteBobotSample.data.concat({
        id_sample: v,
        id_lab: x.id_lab,
        value: x.value,
      });
    })
    console.log(this.pasteBobotSample);


    this._masterServ.updateDataBobot(this.pasteBobotSample).then(y => {
      this.load = true;
      let message = {
        text: 'Paste Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.sampledata=[];
        this.getDataSample();
        this.copyBobotSample=[];
        this.openSnackBar(message);
        this.load = false;
      },2000)
    })
  }

  pasteallbobotSambple(){
    this.copyIdBobotSample = []; 
    this.pasteAllBobotSample.data = [];
    this.sampledata.forEach((x,i) => {
      this.copyIdBobotSample = this.copyIdBobotSample.concat(
        x.id,
        );
      this.copyBobotSample.forEach(f => {
        this.pasteAllBobotSample.data = this.pasteAllBobotSample.data.concat({
          id_sample :this.copyIdBobotSample[i],
          id_lab: f.id_lab,
          value: f.value,
        });
      })
    })
    this._masterServ.updateDataBobot(this.pasteAllBobotSample).then(y => {
      this.load = true;
      let message = {
        text: 'Paste Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.sampledata=[];
        this.getDataSample();
        this.copyBobotSample=[];
        this.openSnackBar(message);
        this.load = false;
      },2000)
    });

    console.log(this.copyIdBobotSample);
    console.log(this.copyBobotSample);
    console.log(this.pasteAllBobotSample);
  }

  deletebobotSambple(id){
    console.log(id)
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  async openAttachMent(v, st) {
    const dialogRef = await this._matDialog.open(
        ModalAttachmentContractComponent,
        {
            height: "auto",
            width: "500px",
            data: {
                value: v,
                status: st,
            },
        }
    );
    await dialogRef.afterClosed().subscribe(async (x) => {});
  }
  
  preview() {
    this.loadingprev = true;
    this._kontrakServ
        .getDataDetailKontrak(this.dataFilter.id_contract)
        .then((x) => {
            this._pdfServ.generatePdf(x, "open");
        })
        .then(() => (this.loadingprev = false));
  }

  refreshPage()
  {
      this.loadingfirst = true;
      this.sampledata = [];
      this.getDataSample();

  }

}
