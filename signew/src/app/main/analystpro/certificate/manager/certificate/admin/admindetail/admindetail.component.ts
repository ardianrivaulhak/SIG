import { Component, OnInit, ViewEncapsulation, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import { CertificateService  } from '../../../../certificate.service';
import { DataUpdateComponent } from '../../modals/data-update/data-update.component';
import { InformationdialogComponent } from '../../modals/informationdialog/informationdialog.component';
import Swal from 'sweetalert2';
import { AkgmodalsComponent } from "../../../../junior/modals/akg/akgmodals/akgmodals.component";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { ModalAttachmentContractComponent } from "app/main/analystpro/contract/modal-attachment-contract/modal-attachment-contract.component";


// ID Cert
import { FormatAverageService } from "../../../../pdf/certificate_id/format-average.service";
import { FormatDuploService  } from "../../../../pdf/certificate_id/format-duplo.service";
import { FormatTriploService } from "../../../../pdf/certificate_id/format-triplo.service";
import { FormatOtkService  } from "../../../../pdf/certificate_id/format-otk.service";
import { FormatSNIService } from "../../../../pdf/certificate_id/format-sni.serivce";
import { FormatOtkDuploService  } from "../../../../pdf/certificate_id/format-otkduplo.service";
import { FormatOtkTriploService  } from "../../../../pdf/certificate_id/format-otktriplo.service";
import { FormatStandartService  } from "../../../../pdf/certificate_id/format-standart.service";
import { FormatNormalManualService } from "../../../../pdf/certificate_id/format-normal-manual.service";

// EN Cert
import { FormatAverageEnService } from "../../../../pdf/certificate_en/format-average-en.service";
import { FormatDuploEnService } from "../../../../pdf/certificate_en/format-duplo-en.service";
import { FormatTriploEnService } from "../../../../pdf/certificate_en/format-triplo-en.service";
import { FormatStandartEnService } from "../../../../pdf/certificate_en/format-standart-en.service";
import { FormatSNIEnService } from "../../../../pdf/certificate_en/format-sni-en.service";
import { FormatOtkEnService } from "../../../../pdf/certificate_en/format-otk-en.service";
import { FormatOtkDuploEnService } from "../../../../pdf/certificate_en/format-otkduplo-en.service";
import { FormatOtkTriploEnService } from "../../../../pdf/certificate_en/format-otktriplo-en.service";
import { FormatNormalManualEnService } from "../../../../pdf/certificate_en/format-normal-manual-en.service";


@Component({
  selector: 'app-admindetail',
  templateUrl: './admindetail.component.html',
  styleUrls: ['./admindetail.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AdmindetailComponent implements OnInit {
  loadingfirst = true;
  load=false;
  displayedColumns: string[] = ['checkbox','lhu_number', 'no_sample', 'status_pengujian','tgl_selesai','stats','cs', 'cert_status', 'action'];
  idContract: any;
  contractData = [];
  sampleData= [];

  dataFilter = {
    pages : 1,
    id_contract : this._actRoute.snapshot.params['id']
  }

  jumlahakg : number;
  nominalakg : number;
  wow: any;
  sisaAkg: number; 

  total: number;
  from: number;
  to: number;
  checkList = []
  allComplete: boolean = false;
  parameterData = [];

  constructor(
    private _servCert: CertificateService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private PdfServ: PdfService,
    private _route: Router,
    private _kontrakServ: ContractService,

    // id cert
    private _formatAverage: FormatAverageService,
    private _formatDuplo: FormatDuploService,
    private _formatTriplo: FormatTriploService,
    private _formatOtk: FormatOtkService,
    private _formatStandart: FormatStandartService,
    private _formatSNI: FormatSNIService,
    private _formatOtkDuplo: FormatOtkDuploService,
    private _formatOtkTriplo: FormatOtkTriploService,
    private _formatNormalManual: FormatNormalManualService,

    //en cert
    private _formatAverageEn: FormatAverageEnService,
    private _formatDuploEn: FormatDuploEnService,
    private _formatTriploEn: FormatTriploEnService,
    private _formatStandartEn: FormatStandartEnService,
    private _formatSNIEn: FormatSNIEnService,
    private _formatOtkEn: FormatOtkEnService,
    private _formatOtkDuploEn: FormatOtkDuploEnService,
    private _formatOtkTriploEn: FormatOtkTriploEnService,
    private _formatNormalManualEn: FormatNormalManualEnService,
  ) { }

  ngOnInit(): void {
    this.getContractDetail();
    this.getCertificate();
  }

  async getContractDetail()
  {
    await this._servCert.getContractDetail(this.dataFilter.id_contract)
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
    .then(() => {
      console.log(this.contractData)
    })
    await this.getSisaAkg();
  }

  getSisaAkg(){
    this.sisaAkg = this.jumlahakg - this.wow;
    console.log(this.wow)
}

  async getCertificate()
  {
    console.log(this.dataFilter);
    await this._servCert.getDetailAdmin(this.dataFilter).then(async x => {
      let b = [];
      b = await b.concat(Array.from(x['data']));
      console.log(b)
      await b.forEach(x => {
        this.sampleData = this.sampleData.concat({
          id : x.id,
          lhu_number: x.lhu_number,
          cl_number: x.cl_number,
          no_sample : x.no_sample,
          sample_name : x.sample_name,
          id_statuspengujian : x.id_statuspengujian,
          statuspengujian : x.status_pengujian.name,
          tgl_input : x.tgl_input,
          tgl_selesai : x.tgl_selesai,
          cert_condition: x.condition_many[0].status,
          sc: x.condition_many[0].cert_status,
          print_info: x.print_info == null ? 1 : 2,
          actived : x.active,
          checkStatus : x.transaction_sample.certificate_info,
          conditionLab : x.transaction_sample.condition_contract_lab.inserted_at,
          checkPrint : x.print_info == null ? '-' : x.print_info,
          autosend : x.autosend == null ? '-' :  x.autosend.status
        })
      })
      this.sampleData = this.uniq(this.sampleData, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to'];
      }  
    })
    .then(x => console.log(this.sampleData));
    this.loadingfirst =  await false;
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  paginated(f){
    this.sampleData = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getCertificate();
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
        case 'lhu_number': return this.compare(a.lhu_number, b.lhu_number, isAsc);
        case 'no_sample': return this.compare(a.no_sample, b.no_sample, isAsc);
        case 'id_statuspengujian': return this.compare(a.id_statuspengujian, b.id_statuspengujian, isAsc);
        case 'tgl_input': return this.compare(a.tgl_input, b.tgl_input, isAsc);
        case 'tgl_selesai': return this.compare(a.tgl_selesai, b.tgl_selesai, isAsc);
        case 'print_info': return this.compare(a.print_info, b.print_info, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openPdfContract(v,val) {
    console.log(v)
        this._kontrakServ.getDataDetailKontrak(v).then((x) => {
          console.log(x)
            this.PdfServ.generatePdf(x,val);
        });
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
          id_contract: this.dataFilter.id_contract,
          checked : true,
          enkrp : btoa( this.dataFilter.id_contract)
        })
      })
      this.checkList = this.uniq(this.checkList, (it) => it.id);
    }else{
      this.sampleData.forEach(t => t.completed = completed);
      this.checkList = [];
    }
   
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

  checkBox(ev,id, id_contract){
    let z = this.checkList.filter(o => o.id == id);
    console.log(ev)
    if(ev){
      if(z.length > 0){
        z[0].checked = ev
      } else {
        this.checkList = this.checkList.concat({
          id: id,
          id_contract: id_contract,
          checked : true,
          enkrp : btoa(id_contract)
        });
      }
    } else {
      let z = this.checkList.filter(x => x.id == id);
      z[0].checked = ev;
    }
    console.log(this.checkList)
  }

  draft()
  {
    console.log(this.checkList)
    let checkData = this.checkList.filter( x => x.checked == true)
    this._servCert.sendDraft(checkData, this.dataFilter.id_contract).then( () => {
      this.load = true;
      let message = {
        text: 'Send Draft Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.sampleData=[];
        this.getCertificate();
        this.checkList=[];
        this.openSnackBar(message);
        this.load = false;
      },1000)
    })
  }

  release()
  {
    let checkData = this.checkList.filter( x => x.checked == true)
    console.log(checkData)
    this._servCert.sendRelease(checkData).then( () => {
      this.load = true;
      let message = {
        text: 'Release Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.sampleData=[];
        this.getCertificate();
        this.checkList=[];
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/admin-certificate');
        this.load = false;
      },1000)
    })
  }

  releaseWithOutEmail()
  {
    console.log(this.checkList)
    this._servCert.sendReleaseWithOutEmail(this.checkList).then( () => {
      this.load = true;
      let message = {
        text: 'Release Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.sampleData=[];
        this.getCertificate();
        this.checkList=[];
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/admin-certificate');
        this.load = false;
      },1000)
    })
  }

  cancelChecklist()
  {
   this.checkList = [];
   this.getCertificate(); 
  }

  UpdateData(id_contract) : void 
  {
    let dialogCust = this._matDialog.open(DataUpdateComponent, {
      panelClass: 'email-cert-dialog',
      data: { id_contract: id_contract } 
    });
    dialogCust.afterClosed().subscribe((result) => {
      this.sampleData=[];
      this.getCertificate();
    });
  }

  // printForm(){
  //   this._servCert.getDataParameterinContract(this.dataFilter).then(x => {
  //       console.log(x)
  //       this._pdfserv.generatePdf(x);
  //     })
  // }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
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
      
        this.sampleData=[];
        this.loadingfirst =  true;
        this.getCertificate();
      });
    }

    AkgModals(id)
  {
    const dialogRef = this._matDialog.open(AkgmodalsComponent, {
      panelClass: 'certificate-akg-modals-dialog',
     
      width: '100%',
      data: {idcontract : id}
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log('dialog close')
      id = result;
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

}
