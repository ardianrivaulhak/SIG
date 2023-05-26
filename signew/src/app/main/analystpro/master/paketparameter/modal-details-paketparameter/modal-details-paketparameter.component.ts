import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { PaketparameterService } from "../paketparameter.service";

@Component({
  selector: 'app-modal-details-paketparameter',
  templateUrl: './modal-details-paketparameter.component.html',
  styleUrls: ['./modal-details-paketparameter.component.scss']
})
export class ModalDetailsPaketparameterComponent implements OnInit {
  idpaketparameter;
  datapaket = [];
  constructor(
    private _masterServ: PaketparameterService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ModalDetailsPaketparameterComponent>,
  ) { 
    if(data){
      this.idpaketparameter = data;
      this.getdatadetail();
    }
  }

  ngOnInit(): void {
  }

  async getdatadetail() {
    await this._masterServ
        .getDataDetailPaketparameter(this.idpaketparameter)
        .then((x) => {
           this.datapaket = this.datapaket.concat(x);
        });
}

}
