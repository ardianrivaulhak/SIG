import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GroupAnalisService } from "../../group-analis.service";

@Component({
  selector: 'app-addgroup',
  templateUrl: './addgroup.component.html',
  styleUrls: ['./addgroup.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class AddgroupComponent implements OnInit {

  descriptionData = [];
  descForm: FormGroup;
  load = false;
  displayedColumns: string[] = ['employee', 'nip','action' ];
  total: number;
  from: number;
  to: number;
  pages = 1;
  datasent = {
    pages : 1,
    search : null
  }
  addData = [];

  constructor(
    public dialogRef: MatDialogRef<AddgroupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _analystServ: GroupAnalisService
  ) { }

  ngOnInit(): void {
    this.addGroup();
  }

  addGroup()
  {
    this.descForm = this.createForm()
  }

  createForm(): FormGroup {
    return this._formBuild.group({
      desc_internal : [this.descriptionData[0] == null  ? '' : this.descriptionData[0].desc,{ validator: Validators.required }]
    })
  }

  closeDialog()
  {
    return this.dialogRef.close({
    });
  }

}
