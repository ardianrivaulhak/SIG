import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../certificate.service';
import { ParameterCertificatemodalsComponent } from "../parametermodals/parametermodals.component";
import { MatDialog } from '@angular/material/dialog';
import {ClipboardModule} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-addresslist-dialog',
  templateUrl: './addresslist-dialog.component.html',
  styleUrls: ['./addresslist-dialog.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AddresslistDialogComponent implements OnInit {

  addressData = [];
  constructor(
    public dialogRef: MatDialogRef<AddresslistDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certServ: CertificateService,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
   console.log(this.data['idtransactionsample'])
   this._certServ.getAddressListData(this.data['idtransactionsample']).then(x => this.addressData = this.addressData.concat(x))
   .then(c => console.log(this.addressData))
    
  }

}
