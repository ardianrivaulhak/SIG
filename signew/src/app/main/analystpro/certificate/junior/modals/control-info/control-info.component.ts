import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../certificate.service';

@Component({
  selector: 'app-control-info',
  templateUrl: './control-info.component.html',
  styleUrls: ['./control-info.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ControlInfoComponent implements OnInit {
  controlData = [];

  constructor(
    public dialogRef: MatDialogRef<ControlInfoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certServ: CertificateService,
  ) { }

  ngOnInit(): void {
    this.data
    console.log(this.data)
  }

}
