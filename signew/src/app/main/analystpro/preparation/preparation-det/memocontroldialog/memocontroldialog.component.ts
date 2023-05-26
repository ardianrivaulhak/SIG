import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlService } from '../../../control/control.service';

@Component({
  selector: 'app-memocontroldialog',
  templateUrl: './memocontroldialog.component.html',
  styleUrls: ['./memocontroldialog.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MemocontroldialogComponent implements OnInit {

  descriptionData = [];
  descForm: FormGroup;
  load = false;

  constructor(
    public dialogRef: MatDialogRef<MemocontroldialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _controlService: ControlService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    this.getDataDescription();
  }

  getDataDescription()
  {
    this._controlService.getDataDescription(this.data.idContract)
    .then(x => this.descriptionData = this.descriptionData.concat(x))
    .then(()=> this.descForm = this.createForm())
    .then(c => console.log(this.data))
    .then(c => console.log(this.descriptionData[0]))
  }

  createForm(): FormGroup {
    return this._formBuild.group({
        desc_internal: [{
        value: this.descriptionData[0] == null  ? '' : this.descriptionData[0].desc,
        disabled: true
      },{ validator: Validators.required }],
    })
  }

  closeModal(){
    return this.dialogRef.close({
      
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
