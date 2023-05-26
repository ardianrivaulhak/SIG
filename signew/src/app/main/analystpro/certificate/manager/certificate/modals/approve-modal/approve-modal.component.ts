import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { CertificateService } from '../../../../certificate.service';

@Component({
  selector: 'app-approve-modal',
  templateUrl: './approve-modal.component.html',
  styleUrls: ['./approve-modal.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class ApproveModalComponent implements OnInit {

  displayedColumns: string[] = [ 'checkbox', 'contract_no' ,'lhu', 'customer_name', 'tgl_selesai' ,'sample_name', 'status','format', 'action'];
  certData = [];
  total: number;
  from: number;
  to: number;
  pages = 1;
  searchFilter = false;
  datasent = {
    pages : 1,
    marketing : null,
    id_contract : this.data
  }
  
  allComplete: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<ApproveModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private _masterServ: CertificateService,
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
          contract_id : x.transaction_sample.kontrakuji.id_kontrakuji,
          contract_no : x.transaction_sample.kontrakuji.contract_no,
          lhu_number : x.lhu_number,
          cl_number : x.cl_number,
          customer : x.customer_name,
          tgl_selesai : x.tgl_selesai,
          sample_name : x.sample_name,
          no_sample : x.no_sample,
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

  closeModal(){
    return this.dialogRef.close({
      
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
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

}
