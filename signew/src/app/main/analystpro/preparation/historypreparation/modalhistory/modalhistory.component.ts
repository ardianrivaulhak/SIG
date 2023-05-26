import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import * as _moment from 'moment';

@Component({
  selector: 'app-modalhistory',
  templateUrl: './modalhistory.component.html',
  styleUrls: ['./modalhistory.component.scss']
})
export class ModalhistoryComponent implements OnInit {

    dateExcelStart = null;
    dateExcelEnd = null;

    constructor( 
      @Inject(MAT_DIALOG_DATA) private data: any,
      private _dialogRef: MatDialogRef<ModalhistoryComponent>
    ) { 
      
     }
  
    ngOnInit(): void {
    }
  
  
    exportexcelFaktur()
    {   
  
        console.log(this.dateExcelStart);
        let dateStart =  _moment(this.dateExcelStart).format('YYYY-MM-DD');
        let dateEnd =  _moment(this.dateExcelEnd).format('YYYY-MM-DD');
        console.log(dateEnd);
  
        return this._dialogRef.close({
          b: "close",
          c: dateStart,
          d: dateEnd
        });
  
    } 

}
