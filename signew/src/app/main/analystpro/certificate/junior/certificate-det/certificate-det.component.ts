import { Component, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../certificate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { ModalSampleComponent } from "../modal-sample/modal-sample.component";
import {FormatAverageService } from "../../pdf/certificate_id/format-average.service";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



@Component({
  selector: 'app-certificate-det',
  templateUrl: './certificate-det.component.html',
  styleUrls: ['./certificate-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CertificateDetComponent implements OnInit {

  idContract: any;
  dataContract = [];
  dataSampleLab = [];
  displayedColumns: string[] = ['no_sample', 'sample_name', 'jenis_kemasan', 'batch_number', 'lot_number', 'tanggal_terima'];
 

  constructor(
    private _certServ: CertificateService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
     private _formatAverage: FormatAverageService
  ) { 
    this.idContract = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getContractDetail()
  }

  getContractDetail(){
    this._certServ.getContractDetail(this.idContract)
    .then(x => this.dataContract = this.dataContract.concat(x))
    .then(() => console.log(this.dataContract));
  }
  
 

  openDialog(idContract) {
    const dialogRef = this._matDialog.open(ModalSampleComponent, {
      panelClass: 'sample-lab-certificate-dialog',
      data: { data: idContract }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  

  

}
