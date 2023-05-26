import { Component, OnInit, Inject } from '@angular/core'; 
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 

@Component({
  selector: 'app-modal-formathasil',
  templateUrl: './modal-formathasil.component.html',
  styleUrls: ['./modal-formathasil.component.scss']
})
export class ModalFormathasilComponent implements OnInit {

  fileName= 'ExcelSheet.xlsx'; 
  dataExcel = [];
  dataExcelKontrak = [];
  dataExcelFull = [];
  datasent : any;
  preparationDateEstimasiLab= null;
  preparationDateApproval= null;

  constructor( 
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<ModalFormathasilComponent>
  ) {
      if(data){
        this.datasent = data.datasent;
        console.log(this.datasent);
      }  
  }

  ngOnInit(): void {
  }


  exportexcelEstimasiLab()
  {    
    console.log(this.preparationDateEstimasiLab.value);
    var year = this.preparationDateEstimasiLab._i.year;
    var month = this.preparationDateEstimasiLab._i.month + 1;
    var date = this.preparationDateEstimasiLab._i.date;  
    var tangal = `${year}-${month}-${date}`
    console.log(tangal);

    return this._dialogRef.close({
      b: "close",
      c: tangal
    });
  }  

}
