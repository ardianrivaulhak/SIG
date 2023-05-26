import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from "../../../../certificate.service";

@Component({
  selector: 'app-data-update',
  templateUrl: './data-update.component.html',
  styleUrls: ['./data-update.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DataUpdateComponent implements OnInit {

  emailData = [];
  emailForm: FormGroup;
  load = false;

  constructor(
    public dialogRef: MatDialogRef<DataUpdateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _servCert: CertificateService,
  ) { }

  ngOnInit(): void {
    console.log(this.data.id_contract)
    this.getData();
  }

  getData()
  {
    this._servCert.getContractDetail(this.data.id_contract)
    .then(x => this.emailData = this.emailData.concat(x))
    .then(()=> this.emailForm = this.createForm())
    .then(c => console.log(this.emailData))
  }

  createForm(): FormGroup {
    return this._formBuild.group({
      email : [this.emailData[0] == null  ? '' : this.emailData[0].customers_handle.email,{ validator: Validators.required }]
    })
  }

  saveForm(){
    console.log(this.emailForm);
    this._servCert.emailUpdate(this.data.id_contract, this.emailForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this._route.navigateByUrl('/analystpro/admin-certificate/' + this.data.id_contract);
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
