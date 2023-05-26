import { Component, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../certificate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class RevisionComponent implements OnInit {

  dataCertificate = [];
  displayedColumns: string[] =  [ 'checkbox', 'contract_no' ,'lhu', 'customer_name', 'tgl_selesai' ,'sample_name', 'status','format', 'action'];
  total: number;
  from: number;
  to: number;
  pages = 1;
  load = false;
  data = {
    id : ''
  };
  datasent = {
    pages : 1,
    status : null,
    type : "paginate"
  }
  checkList = []
  allComplete: boolean = false;

  constructor(
    private _certServ: CertificateService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) {
    
   }

  ngOnInit(): void {
    this.getSampleLab();
  }

  async getSampleLab(){
    await this._certServ.getArchiveData(this.datasent).then(async x => {
      let b = [];
      b = await b.concat(Array.from(x['data']));
      console.log(b)
      await b.forEach(x => {
        this.dataCertificate = this.dataCertificate.concat({
          id : x.id,
          contract_id : x.transaction_sample.kontrakuji.id_kontrakuji,
          contract_no : x.transaction_sample.kontrakuji.contract_no,
          lhu_number : x.lhu_number,
          cl_number : x.cl_number,
          customer : x.customer_name,
          tgl_selesai : x.tgl_selesai,
          sample_name : x.sample_name,
          no_sample : x.no_sample,
          id_statuspengujian : x.id_statuspengujian,
          cert_status : x.condition_cert.cert_status,
          format : x.format,
          completed : false
        })
      })
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to'];
      }  
    })
    .then(x => console.log(this.dataCertificate));
  }


  paginated(f){
    this.dataCertificate = [];
    this.datasent.pages = f.pageIndex + 1;
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

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.dataCertificate == null) {
      return;
    }
    this.dataCertificate.forEach(t => t.completed = completed);
  }

  someComplete(): boolean {
    if (this.dataCertificate == null) {
      return false;
    }
    return this.dataCertificate.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  updateAllComplete() {
    this.allComplete = this.dataCertificate != null && this.dataCertificate.every(t => t.completed);
    console.log(this.allComplete)
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

}
