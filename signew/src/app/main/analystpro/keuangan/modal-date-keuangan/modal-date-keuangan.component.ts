import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import * as _moment from 'moment';

@Component({
  selector: 'app-modal-date-keuangan',
  templateUrl: './modal-date-keuangan.component.html',
  styleUrls: ['./modal-date-keuangan.component.scss']
})
export class ModalDateKeuanganComponent implements OnInit {
  dateExcel = null;

  constructor( 
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<ModalDateKeuanganComponent>
  ) { 
    
   }

  ngOnInit(): void {
  }


  exportexcelFaktur()
  {   

      console.log(this.dateExcel);
      // var year = this.dateExcel._i.year;
      // var month = this.dateExcel._i.month + 1;
      // var date = this.dateExcel._i.date;  
      // var tangal = `${year}-${month}-${date}`
      let tanggal =  _moment(this.dateExcel).format('YYYY-MM-DD');
      console.log(tanggal);

      return this._dialogRef.close({
        b: "close",
        c: tanggal
      });

  } 

}
