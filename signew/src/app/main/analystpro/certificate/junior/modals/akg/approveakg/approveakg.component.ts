import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../../certificate.service';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { MatSort, Sort } from '@angular/material/sort'
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import * as globals from "app/main/global";

@Component({
  selector: 'app-approveakg',
  templateUrl: './approveakg.component.html',
  styleUrls: ['./approveakg.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class ApproveakgComponent implements OnInit {

  loadingfirst = true;
  load = false;
  dataFilter = {
    contract: '',
    lhunumber: '',
    status : null,
    pages : 1,
    type : "paginate"
  } 
  dataAkg = [];
  displayedColumns: string[] = [
    'checkbox',
    'marketing',
    'lhu',   
    'format',
    'status',
    'inserted_at', 
    'user', 
    'action'
  ];
  total: number;
  from: number;
  to: number;
  pages = 1;

  akgData = [];

  loading = false;
  allComplete: boolean = false;
  
  checkList = [];

  constructor(
    private _certServ: CertificateService,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _actRoute: ActivatedRoute,
    private _kontrakServ: ContractService,
    private PdfServ: PdfService,
    private _route: Router
  ) { }

  ngOnInit(): void {
    this.getCertificate();
  }

  async getCertificate(){
    await this._certServ.getApproveAkg(this.dataFilter).then(async x => {
      this.akgData = this.akgData.concat(Array.from(x['data']))
      this.akgData = globals.uniq(this.akgData, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to'];
      }  
    })
    .then(()=> console.log(this.akgData))
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.akgData == null) {
      return;
    }
    if(completed == true)
    {
      this.akgData.forEach(t => t.completed = completed);
      this.akgData.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.akgData.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }

  updateAllComplete() {
    this.allComplete = this.akgData != null && this.akgData.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.akgData == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.akgData.filter(t => t.completed).length > 0 && !this.allComplete;      
  }

  checkBox(ev, id){
    let z = this.checkList.filter(o => o.id == id);
   
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
  }

  sortData(sort: Sort) {
    const data = this.akgData.slice();
    if ( !sort.active || sort.direction === '') {
      this.akgData = data;
      return;
    }
    this.akgData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'marketing': return this.compare(a.marketing, b.marketing, isAsc);
        case 'lhu': return this.compare(a.lhu, b.lhu, isAsc);
        case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'no_sample': return this.compare(a.no_sample, b.no_sample, isAsc);
        case 'sample_name': return this.compare(a.sample_name, b.sample_name, isAsc);
        case 'jenis_kemasan': return this.compare(a.jenis_kemasan, b.jenis_kemasan, isAsc);
        case 'batch_number': return this.compare(a.batch_number, b.batch_number, isAsc);
        case 'lot_number': return this.compare(a.lot_number, b.lot_number, isAsc);
        case 'tanggal_terima': return this.compare(a.tanggal_terima, b.tanggal_terima, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  cancelCheckList()
  {
    this.checkList = [];
    this.akgData = [];
    this.getCertificate();
  }

  submitData()
  {
    let u = [];
      this.checkList.forEach((x) => {
        if (x.checked) {
            u = u.concat({
                id: x.id,
            });
        }
      });
      let checkData = this.checkList.filter( x => x.checked == true)
      console.log(checkData)
      this._certServ.approveListAkg(u).then( () => {
        this.load = true;
        let message = {
          text: 'Release Succesfully',
          action: 'Done'
        }
        setTimeout(()=>{  
          this.akgData=[];
          this.getCertificate();
          this.checkList=[];
          // this.openSnackBar(message);
          // this._route.navigateByUrl('analystpro/admin-certificate');
          this.load = false;
        },1000)
      })

  }

  async search(){
    this.akgData = await  [];
    await this.getCertificate();
  }

  async resetSearch()
  {
    this.dataFilter.contract = await '';
    this.dataFilter.lhunumber = await '';
    this.dataFilter.status = await '';
    this.akgData = await [];
    await this.getCertificate();
  }

  goToAkg(id) {
    const url = this._route.serializeUrl(this._route.createUrlTree([`/akg/pdf-akg/` + id ]));      
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

}
