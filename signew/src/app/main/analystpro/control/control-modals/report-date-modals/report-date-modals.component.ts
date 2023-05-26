import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import * as _moment from 'moment';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-report-date-modals',
  templateUrl: './report-date-modals.component.html',
  styleUrls: ['./report-date-modals.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ReportDateModalsComponent implements OnInit {
  dateExcel = null;
  from;
  to;
  loadingprev = false;
  load = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<ReportDateModalsComponent>
  ) { }

  ngOnInit(): void {
  }
  
  exportexcelFaktur()
  {   

      console.log([this.from, this.to]);
      let tanggal =  [ _moment(this.from).format('YYYY-MM-DD'), _moment(this.to).format('YYYY-MM-DD')];
      console.log(tanggal);

      return this._dialogRef.close({
        b: "close",
        c: tanggal
      });

  } 


}
