import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { KeuanganService } from "../../keuangan/keuangan.service";

@Component({
  selector: 'app-modal-infofinance',
  templateUrl: './modal-infofinance.component.html',
  styleUrls: ['./modal-infofinance.component.scss']
})
export class ModalInfofinanceComponent implements OnInit {

  descriptionData = [];
  descForm: FormGroup;
  load = false;

  constructor(
    public dialogRef: MatDialogRef<ModalInfofinanceComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _keuService: KeuanganService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
   console.log(this.data)
   this. getDataDescription()
  }

  getDataDescription()
  {
    this._keuService.memoFInance(this.data)
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
    this._keuService.postMemoFInance(this.data, this.descForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.closeModal();
        this.load = false;
      },1000)
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
