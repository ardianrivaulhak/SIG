import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../certificate.service';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-revisiondata',
  templateUrl: './revisiondata.component.html',
  styleUrls: ['./revisiondata.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class RevisiondataComponent implements OnInit {

  loadingfirst = true;
  load = false;

  total: number;
  from: number;
  to: number;
  pages = 1;

  revisionData = [];


  constructor(
    public dialogRef: MatDialogRef<RevisiondataComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certServ: CertificateService,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData()
  {
    this.revisionData = await this.revisionData.concat(this.data.data.revision);
    this.loadingfirst =  await false;
    console.log(this.revisionData)
  }

  closeDialog(v) {
    return this.dialogRef.close({
        v
    });
}



}
