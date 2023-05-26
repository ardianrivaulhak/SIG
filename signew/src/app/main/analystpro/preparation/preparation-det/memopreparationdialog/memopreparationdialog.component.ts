import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { PreparationService } from '../../preparation.service';


@Component({
  selector: 'app-memopreparationdialog',
  templateUrl: './memopreparationdialog.component.html',
  styleUrls: ['./memopreparationdialog.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MemopreparationdialogComponent implements OnInit {

  descriptionData = [];
  descForm: FormGroup;
  load = false;

  constructor(
    public dialogRef: MatDialogRef<MemopreparationdialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _prepService: PreparationService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    this.getDataDescription()
  }

  getDataDescription()
  {
    this._prepService.getDataDescription(this.data)
    .then(x => this.descriptionData = this.descriptionData.concat(x))
    .then(()=> this.descForm = this.createForm())
    .then(c => console.log(this.data.idSample))
    .then(c => console.log(this.data))
  }

  createForm(): FormGroup {
    return this._formBuild.group({
      desc_internal : [ this.data.select == 'withoutID' ? '' : this.descriptionData[0] == null  ? '' : this.descriptionData[0].desc , { validator: Validators.required }],
      idsample : this.data.select == 'withoutID' ? this.data.bulkdata : this.data.idSample,
      idcontract : this.data.idContract
    })
  }

  saveForm(){
    if(this.data.select == 'withID') {
      this._prepService.updateDescriptionContract(this.descForm.value).then(y => {
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
    }else{
      this._prepService.updateBulkDescriptionContract(this.descForm.value, this.data.bulkdata).then(y => {
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
