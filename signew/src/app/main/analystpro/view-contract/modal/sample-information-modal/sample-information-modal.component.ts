import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractService } from 'app/main/analystpro/services/contract/contract.service';  

@Component({
  selector: 'app-sample-information-modal',
  templateUrl: './sample-information-modal.component.html',
  styleUrls: ['./sample-information-modal.component.scss']
})
export class SampleInformationModalComponent implements OnInit {

  dataSample = [];

  constructor(
    private _kontrakServ: ContractService,
    private _snackBar: MatSnackBar, 
    private _dialogRef: MatDialogRef<SampleInformationModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    if(data){
      this._kontrakServ.getDataDetailParameter(data.idsample).then(x => {
        this.dataSample = this.dataSample.concat(x); 
      });
    }
  }

  ngOnInit(): void {
  }

}
