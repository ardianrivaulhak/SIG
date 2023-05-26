import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlService } from '../../control.service';

@Component({
  selector: 'app-description-modals',
  templateUrl: './description-modals.component.html',
  styleUrls: ['./description-modals.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DescriptionModalsComponent implements OnInit {

  descriptionData = [];
  descForm: FormGroup;
  load = false;

  constructor(
    public dialogRef: MatDialogRef<DescriptionModalsComponent>,
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
    .then(c => console.log(this.descriptionData))
  }

  createForm(): FormGroup {
    return this._formBuild.group({
      desc_internal : [this.descriptionData[0] == null  ? '' : this.descriptionData[0].desc,{ validator: Validators.required }]
    })
  }

  saveForm(){
    console.log(this.descForm);
    this._controlService.updateDescriptionContract(this.data.idContract, this.descForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.closeModal(false);
        this.load = false;
      },1000)
    })
  }

  closeModal(ev){
    return this.dialogRef.close({
      ev
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }
}
