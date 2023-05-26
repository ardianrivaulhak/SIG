import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlService } from '../../control.service';

@Component({
  selector: 'app-memo-internal',
  templateUrl: './memo-internal.component.html',
  styleUrls: ['./memo-internal.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MemoInternalComponent implements OnInit {

  descriptionData = [];
  descForm: FormGroup;
  load = false;

  constructor(
    public dialogRef: MatDialogRef<MemoInternalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _controlService: ControlService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

}
