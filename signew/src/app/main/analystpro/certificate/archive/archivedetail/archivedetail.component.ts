import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { CertificateService } from '../../certificate.service';
import { MatSort, Sort } from '@angular/material/sort';
import { AddakgComponent } from "../../junior/modals/akg/addakg/addakg.component";
import { AkgmodalsComponent } from "../../junior/modals/akg/akgmodals/akgmodals.component";
import { InformationdialogComponent } from '../../manager/certificate/modals/informationdialog/informationdialog.component';
import { ChangeConditionComponent } from '../modals/change-condition/change-condition.component';
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import { ModalAttachmentContractComponent } from "app/main/analystpro/contract/modal-attachment-contract/modal-attachment-contract.component";
import { DataUpdateComponent } from '../../manager/certificate/modals/data-update/data-update.component';
@Component({
  selector: 'app-archivedetail',
  templateUrl: './archivedetail.component.html',
  styleUrls: ['./archivedetail.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ArchivedetailComponent implements OnInit {

  loadingfirst = true;
  dataCertificate = [];
  contractData = [];
  displayedColumns: string[] =  ['checkbox', 'lhu_number', 'no_sample' , 'status_pengujian' ,'tgl_selesai', 'tgl_lab','cert_status', 'action'];
  total: number;
  from: number;
  to: number;
  pages = 1;
  load = false;

  data = {
    id : ''
  };

  datasent = {
    id_contract: this._actRoute.snapshot.params['id'],
    pages : 1,
    status : null,
    lhu: null,
    no_sample: null,
    nama_sample : null,
    type : "paginate"
  }

  checkList = []
  allComplete: boolean = false;
  jumlahakg : number;
  nominalakg : number;
  sisaAkg: number;
  wow : number;

  formdata = {
    lhu: null,
    sample: null,
    no_sample: null
  }


  constructor(
    private _certServ: CertificateService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _kontrakServ: ContractService,
    private PdfServ: PdfService,
  ) { }

  ngOnInit(): void {
    this.getContractDetail();
    this.getData();
  }
  
  async getContractDetail()
  {
    await this._certServ.getContractDetail(this.datasent.id_contract)
    .then(x => this.contractData = this.contractData.concat(x))
    .then(() => console.log(this.contractData[0].akg_trans))
      .then(() => {
        this.jumlahakg = this.contractData[0].akg_trans.length > 0 ? this.contractData[0].akg_trans.map(x => x.jumlah).reduce((a,b) => a + b) : 0;
        console.log(this.jumlahakg);
      })
      .then(() => {
        this.nominalakg = this.contractData[0].akg_trans.length > 0 ? this.contractData[0].akg_trans.map(x => x.total).reduce((a,b) => a + b) : 0;
        console.log(this.nominalakg);
      })
      .then(() => {
        this.wow = this.contractData[0].total_akg.length
        console.log(this.wow)
      })
      await this.getSisaAkg();
      console.log(this.contractData)
  }

  getSisaAkg(){
    this.sisaAkg = this.jumlahakg - this.wow;
    console.log(this.wow)
}

  async getData(){
    await this._certServ.getArchiveDetail(this.datasent).then(async x => {
      let b = [];
      b = await b.concat(Array.from(x['data']));
      console.log(b)
      await b.forEach(x => {
        this.dataCertificate = this.dataCertificate.concat({
          id : x.transaction_sample_cert.id,
          lhu_number: x.transaction_sample_cert.lhu_number,
          cl_number: x.transaction_sample_cert.cl_number,
          no_sample : x.transaction_sample_cert.no_sample,
          sample_name : x.transaction_sample_cert.sample_name,
          id_statuspengujian : x.transaction_sample_cert.id_statuspengujian,
          statuspengujian : x.transaction_sample_cert.status_pengujian.name,
          tgl_input : x.transaction_sample_cert.tgl_input,
          tgl_selesai : x.transaction_sample_cert.tgl_selesai,
          print_info: x.transaction_sample_cert.print_info == null ? 1 : 2,
          sc: x.transaction_sample_cert.condition_cert[x.transaction_sample_cert.condition_cert.length - 1].cert_status,
          actived : x.transaction_sample_cert.active,
          date_at : x.transaction_sample_cert.date_at,
          approve_lab : x.transaction_sample_cert.transaction_sample.status_lab[0].inserted_at,
          // condition_lab: x.transaction_sample.condition_contract_lab.inserted_at,
          status : x.status,
          insert_cert : x.inserted_at
        })
      })
      this.dataCertificate = this.uniq(this.dataCertificate, (it) => it.id);
      this.total = x['total'];
      this.from = x['from'] - 1;
      this.to = x['to'];
    })
    .then(x => console.log(this.dataCertificate));
    this.loadingfirst =  await false;
  }

  


  paginated(f){
    this.dataCertificate = [];
    this.datasent.pages = f.pageIndex + 1;
    console.log(this.datasent)
    this.getData();
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
        case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'tgl_selesai': return this.compare(a.tgl_selesai, b.tgl_selesai, isAsc);
        case 'sample_name': return this.compare(a.sample_name, b.sample_name, isAsc);
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

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  activedButton(data){
    console.log(data)
    let send = {
        data : null,
        id : data.id
    }
    data.actived == "N" ? data.actived = "Y" : data.actived = "N"
    send.data = data.actived
    console.log(send)
    this._certServ.activedCertificate(send).then(o => {
      this.load = true;
      let message = {
          text: 'Succesfully',
          action: 'Done'
      }
      setTimeout(()=>{
          this.dataCertificate=[];
          this.loadingfirst =  true; 
          this.getData();
          this.openSnackBar(message);
          this.load = false;
      },1000)
      })
}


  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.dataCertificate == null) {
      return;
    }
    if(completed == true)
    {
      this.dataCertificate.forEach(t => t.completed = completed);
      this.dataCertificate.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.checkList = this.uniq(this.checkList, (it) => it.id);
    }else{
      this.dataCertificate.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }

  updateAllComplete() {
    this.allComplete = this.dataCertificate != null && this.dataCertificate.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.dataCertificate == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.dataCertificate.filter(t => t.completed).length > 0 && !this.allComplete;      
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


  addAkgModals(id)
  {
    const dialogRef = this._matDialog.open(AddakgComponent, {
      panelClass: 'certificate-akg-dialog',
      height: '400px',
      width: '100%px',
      data: {idtransactionsample : id}
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log('dialog close')
      id = result;
    });
  }

  AkgModals(id)
  {
    const dialogRef = this._matDialog.open(AkgmodalsComponent, {
      panelClass: 'certificate-akg-modals-dialog',
      data: {idcontract : id}
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log('dialog close')
      id = result;
    });
  }

  informationDialog(id)
    {
      console.log(id)
      const dialogRef = this._matDialog.open(InformationdialogComponent, {
        panelClass: 'certificate-information-dialog',
        height: '300px',
        width: '100%',
        data: {idsample : id}
      });

      dialogRef.afterClosed().subscribe((result) => {
      
        this.dataCertificate=[];
        this.loadingfirst =  true;
        this.getData();
      });
    }

    resendingEmail(){
      let u = [];
      this.checkList.forEach((x) => {
          if (x.checked) {
              u = u.concat({
                  id: x.id,
              });
          }
      });
      console.log(u)
      this._certServ.resendEmail(u).then( () => {
        this.load = true;
        let message = {
          text: 'Resend Succesfully',
          action: 'Done'
        }
        setTimeout(()=>{  
          this.dataCertificate=[];
          this.getData();
          this.checkList=[];
          this.openSnackBar(message);
          this.load = false;
        },1000)
      })
    }

    sendEmailAkg(){
      console.log(this.checkList)
      this._certServ.sendEmailAkg(this.checkList).then( () => {
        this.load = true;
        let message = {
          text: 'Send Akg Succesfully',
          action: 'Done'
        }
        setTimeout(()=>{  
          this.dataCertificate=[];
          this.getData();
          this.checkList=[];
          this.openSnackBar(message);
          this.load = false;
        },1000)
      })
    }

    Revision(status)
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
      const dialogRef = this._matDialog.open(ChangeConditionComponent, {
        panelClass: 'change-condition-modals',
        width: '100%',
        data: { data : u, idcontract : this.datasent.id_contract, status: status  },
        disableClose: true 
      });
      let message = {
        text: 'Revision',
        action: 'Done'
      }
      dialogRef.afterClosed().subscribe( result => {
      
        if(result.v == false){          
          this.checkList=[];
          this.dataCertificate=[];
          this.getData();
          this.openSnackBar(message);
          this.load = false;
        }
      });
    }

    openPdf(v,val) {
      console.log(v)
          this._kontrakServ.getDataDetailKontrak(v).then((x) => {
            console.log(x)
              this.PdfServ.generatePdf(x,val);
          });
      }

      async searchButton(){    
        console.log(this.formdata); 
        this.datasent.lhu = await this.formdata.lhu
        this.datasent.no_sample  = await this.formdata.no_sample
        this.datasent.nama_sample =  await this.formdata.sample      
        console.log(this.datasent)    
        this.dataCertificate = await [];
        this.loadingfirst = await true;
        await this.getData();
      }

      async cancelSearchMark()
      {
        this.formdata.lhu = await null;
        this.formdata.no_sample = await null;
        this.formdata.sample = await null;
    
    
        this.datasent.lhu  = await null;
        this.datasent.no_sample  = await null;
        this.datasent.nama_sample  = await null;
    
        this.dataCertificate = await [];
        this.loadingfirst = await true;
        await this.getData();
      }

      openPdfContract(v,val) {
        console.log(v)
            this._kontrakServ.getDataDetailKontrak(v).then((x) => {
              console.log(x)
                this.PdfServ.generatePdf(x,val);
            });
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

      UpdateData(id_contract) : void 
      {
        let dialogCust = this._matDialog.open(DataUpdateComponent, {
          panelClass: 'email-cert-dialog',
          data: { id_contract: id_contract } 
        });
        dialogCust.afterClosed().subscribe((result) => {
          this.dataCertificate=[];
          this.getData();
        });
      }
    
  



}

