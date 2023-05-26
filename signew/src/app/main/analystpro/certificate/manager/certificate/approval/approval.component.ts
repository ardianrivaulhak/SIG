import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CertificateService } from '../../../certificate.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ApproveModalComponent } from '../../certificate/modals/approve-modal/approve-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CertificateApprovalComponent implements OnInit {

  displayedColumns: string[] = [ 'checkbox', 'contract_no' ,'lhu', 'customer_name', 'tgl_selesai' ,'sample_name', 'status','format', 'action'];
  certData = [];
  total: number;
  from: number;
  to: number;
  pages = 1;
  data = {
    id : ''
  };
  draft = 1
  release = 2
  searchFilter = false;
  datasent = {
    pages : 1,
    marketing : null,
  }
  load = false;
  checkList = []
  allComplete: boolean = false;

  constructor(
    private _masterServ: CertificateService,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
    console.log(this.datasent);
    await this._masterServ.getDataResultofAnalysis(this.datasent).then(async x => {
      let b = [];
      b = await b.concat(Array.from(x['data']));
      console.log(b)
      await b.forEach(x => {
        this.certData = this.certData.concat({
          id : x.id,
          contract_id : x.transaction_sample.kontrakuji.id_kontrakuji,
          contract_no : x.transaction_sample.kontrakuji.contract_no,
          lhu_number : x.lhu_number,
          cl_number : x.cl_number,
          customer : x.customer_name,
          tgl_selesai : x.tgl_selesai,
          sample_name : x.sample_name,
          no_sample : x.no_sample,
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
    .then(x => console.log(this.certData));
  }

  paginated(f){
    this.certData = [];
    this.datasent.pages = f.pageIndex + 1;
    this.getData();
  }

  onSearchChange(ev){
    this.certData = [];    
    this.datasent.marketing = ev;
    console.log(this.datasent)
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

  contractDialog(data): void {
    const dialogRef = this._matDialog.open(ApproveModalComponent, {
      panelClass: 'resultofanalysis-dialog',
      data: { data: data } 
    });

    dialogRef.afterClosed().subscribe(result => {
      this.certData=[];
      this.getData();
    });
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.certData == null) {
      return;
    }
    this.certData.forEach(t => t.completed = completed);
  }

  someComplete(): boolean {
    if (this.certData == null) {
      return false;
    }
    return this.certData.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  updateAllComplete() {
    this.allComplete = this.certData != null && this.certData.every(t => t.completed);
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

  approveManager(data)
  {
    console.log([data, this.checkList])
    console.log(this.checkList)
    let u = [];
   this.checkList.forEach(x => {
     if(x.checked){
       u = u.concat({
         id: x.id, 
         data : data
       })
     }
   })
   console.log(u)
   this._masterServ.approveRoManager(u).then( z => {
    this.load = true;
    let message = {
      text: 'LHU successfully created',
      action: 'Done'
    }
    setTimeout(()=>{
      this.openSnackBar(message);
      this._route.navigateByUrl('analystpro/resultofanalysis');
      this.load = false;
    },2000)
   })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  


}
