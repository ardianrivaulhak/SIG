import { Component, OnInit, ViewEncapsulation, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlService } from '../control.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { SampleModalsComponent } from "../control-modals/sample-modals/sample-modals.component";
import { DescriptionModalsComponent } from "../control-modals/description-modals/description-modals.component";
import { MatSort, Sort } from '@angular/material/sort';
import { PdfcontrolService } from '../pdf/pdfcontrol.service'
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import { ContractService } from "../../services/contract/contract.service";
import { MemoInternalComponent } from "../control-modals/memo-internal/memo-internal.component";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import Swal from "sweetalert2";
import * as globals from "app/main/global";
import { ModalAttachmentContractComponent } from "app/main/analystpro/contract/modal-attachment-contract/modal-attachment-contract.component";
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-control-det',
  templateUrl: './control-det.component.html',
  styleUrls: ['./control-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ControlDetComponent implements OnInit {
  pageEvent: PageEvent;
  loadingfirst = true;
  load=false;

  displayedColumns: string[] = [
    'no',
    'checkbox',
    'sample_name',
    'no_sample', 
    'jenis_kemasan', 
    'status_pengujian', 
    'tgl_input', 
    'tgl_estimasi_lab',
    'status', 
    'action'
  ];

  dataFilter = {
    pages : 1,
    id_contract : this._actRoute.snapshot.params['id'],
    sample_name : null,
    sample_number : null,
    status : null
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

  idContract: any;
  contractData = [];
  sampleData= [];
  
  sample_data = {
    id_sample : ''
  }
  copyEstlab = [];

  pasteEstlab = {
    data: []
  }

  contract_data = {
    id_contract:  ''
  }

  

  dataPdf = {
    pages : 1,
    id_sample : ''
  }

  checkDataLocal : any;
  total: number;
  from: number;
  to: number;
  current_page : number;

  checkList = []
  allComplete: boolean = false;
  dataFilterControl = {
    marketing : null,
    memo : null,
    category: null,
    customer_name: null,
    pages : 1,
  }
  access = [];
  loadingprev = false;

  constructor(  
    private _menuServ: MenuService,
    private _controlService: ControlService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _pdfserv: PdfcontrolService,
    private PdfServ: PdfService,
    private _kontrakServ: ContractService,
    private _route: Router,
    private _pdfServ: PdfService,
    ) 
    { 
      this.idContract = this._actRoute.snapshot.params['id'];
    }

  ngOnInit(): void 
  {
    this.getContractDetail();
    this.getSampleInContract();
  }

  checkauthentication() {
    this._menuServ.checkauthentication(this._route.url).then((x) => {
        if (!x.status) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You dont an access to this page !",
            }).then((res) => {
                if (res.isConfirmed || res.isDismissed) {
                    this._route.navigateByUrl("apps");
                }
            });
        } else {
            this.access = this.access.concat(x.access);
        }
    });
  }
  
  getContractDetail()
  {
    this._controlService.getDetailDataContract(this.idContract)
    .then(x => this.contractData = this.contractData.concat(x))
    .then(c => console.log(this.contractData))
  }

  async getSampleInContract()
  {
    this._controlService
    .getDataSampleInContract(this.dataFilter)
    .then( async x => {
        this.sampleData = this.sampleData.concat(Array.from(x['data']));
        this.sampleData = globals.uniq(
            this.sampleData,
            (it) => it.id
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
  }

  paginated(f){
    this.sampleData = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getSampleInContract();
  }

  sortData(sort: Sort) {
    const data = this.sampleData.slice();
    if ( !sort.active || sort.direction === '') {
      this.sampleData = data;
      return;
    }
    this.sampleData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'sample_name': return this.compare(a.sample_name, b.sample_name, isAsc);
        case 'no_sample': return this.compare(a.no_sample, b.no_sample, isAsc);
        case 'jenis_kemasan': return this.compare(a.jenis_kemasan, b.jenis_kemasan, isAsc);
        case 'id_statuspengujian': return this.compare(a.id_statuspengujian, b.id_statuspengujian, isAsc);
        case 'customer': return this.compare(a.customer, b.customer, isAsc);
        case 'tgl_input': return this.compare(a.tgl_input, b.tgl_input, isAsc);
        case 'tgl_estimasi_lab': return this.compare(a.tgl_estimasi_lab, b.tgl_estimasi_lab, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  async searchButton() {         
    this.sampleData = await [];
    this.loadingfirst = await true;
    await this.getSampleInContract();
  }

  async cancelSearchMark() {    
      this.dataFilter.status = await null;
      this.dataFilter.sample_name = await null;
      this.dataFilter.sample_number = await null;
      this.sampleData = await [];
      this.loadingfirst = await true;
      await this.getSampleInContract();
  }

  editSample(idSample, ev) : void {
    console.log(ev)
    let dialogCust = this._matDialog.open(SampleModalsComponent, {
      panelClass: 'sample-control-dialog',
      width : '400px',
      disableClose: true,
      data:  ev == 'nonchecklist' ?  { idSample: idSample, select : ev } : { idSample : this.checkList, select : ev }
    });

    dialogCust.afterClosed().subscribe((result) => {
      console.log(result)
      if(result == false){
        this.checkList = []
        this.sampleData=[];
        this.getSampleInContract(); 
      }       
    });
  }

  copyEstimasiLab(ev) {
    console.log(ev);
    this.copyEstlab = [];
    this.sample_data.id_sample = ev;
    this._controlService.getDetailDataSample(this.sample_data.id_sample).then( x => {
        this.copyEstlab = this.copyEstlab.concat(x[0]['tgl_estimasi_lab']);
        console.log(this.copyEstlab);
    })
  }

  cancelButtonCopy()
  {
    this.copyEstlab = [];
  }

  pasteEstimasiLab(ev)
  {
    console.log(this.copyEstlab)
    this.sample_data.id_sample = ev;
    this._controlService.pasteOneDataEstimateLab(this.sample_data.id_sample, this.copyEstlab).then(o => {
      this.load = true;
      let message = {
        text: 'Paste Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.sampleData=[];
        this.getSampleInContract();
        this.copyEstlab=[];
        this.openSnackBar(message);
        this.load = false;
      },1000)
    })
   
  }

  pasteAllEstimateLab(id_contract)
  {
    console.log(this.copyEstlab)
    this.contract_data.id_contract = id_contract
    this._controlService.pasteAllDataEstimateLab(this.contract_data.id_contract, this.copyEstlab).then(o => {
      this.load = true;
      let message = {
        text: 'Paste Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.sampleData=[];
        this.getSampleInContract();
        this.copyEstlab=[];
        this.openSnackBar(message);
        this.load = false;
      },1000)
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  descriptionModals(idContract) : void 
  {
    let dialogCust = this._matDialog.open(DescriptionModalsComponent, {
      panelClass: 'description-control-dialog',
      disableClose : true,
      width : '600px',
      data: { idContract: idContract } 
    });
    dialogCust.afterClosed().subscribe((result) => {
      // 
      console.log(result)
     if(result.ev == false){
      this.contractData=[];      
      this.load = true;
      this.getContractDetail();
     }
    });
  }

  pasteParamtoContract()
  {
    let a = localStorage.getItem("datas");
    console.log(a);
  }

  cancelLocalParam(){
    this.sampleData = [];
    this.getSampleInContract()
    localStorage.clear();
  }

setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.sampleData == null) {
      return;
    }
    if(completed == true)
    {
      this.sampleData.forEach(t => t.completed = completed);
      this.sampleData.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.sampleData.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }


  updateAllComplete() {
    this.allComplete = this.sampleData != null && this.sampleData.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.sampleData == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.sampleData.filter(t => t.completed).length > 0 && !this.allComplete;      
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

  approveSample()
  {
    this._controlService.approveSample(this.checkList).then(o => {
      this.load = true;
      let message = {
        text: 'Approve Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.contractData = [];
        this.getContractDetail();
        this.sampleData=[];
        this.getSampleInContract();
        this.checkList=[];
        this.openSnackBar(message);
        this.load = false;
      },1000)
    })
  }

  cancelApprove(){
    this.checkList = [];
    this.sampleData = [];
    this.getSampleInContract()
  }

  printForm(data){
      console.log(data)
    this._controlService.getDataParameterinContract(data).then(x => {
        console.log(x)
        let message = {
            text: 'Please Wait'
          }
          setTimeout(()=>{  
            this.openSnackBar(message);
            this.load = false;
          },1000)
        let datas = {
            contract: this.contractData,
            parameter: x
        }
        console.log(datas)
        this._pdfserv.generatePdf(datas);
      })
  }

  openPdf(v,val) {
      console.log({v, val})
    this._kontrakServ.getDataDetailKontrak(v).then((x) => {
        this.PdfServ.generatePdf(x, val);
    });
}

memoInternal() : void 
{
  let dialogCust = this._matDialog.open(MemoInternalComponent, {
    panelClass: 'memointernal-control-dialog',
    data: { teks : this.contractData[0].description_cs.length < 1 ?  '-' : this.contractData[0].description_cs[0]  } 
  });
  dialogCust.afterClosed().subscribe((result) => {
    this.sampleData=[];
    this.getSampleInContract();
  });
}


goDetail(id) {
  const url = this._route.serializeUrl(
      this._route.createUrlTree([`/analystpro/control/sample/${id}`])
  );
  
  let baseUrl = window.location.href.replace(this._route.url, '');
  window.open(baseUrl + url, '_blank');
}

async openAttachMent(v, st) {
  console.log([v,st])
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

  

  
}
