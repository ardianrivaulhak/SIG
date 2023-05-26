import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {

  constructor( 
    public dialogRef: MatDialogRef<EditGroupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,) { }

  ngOnInit(): void {
    console.log(this.data)
  }

}
