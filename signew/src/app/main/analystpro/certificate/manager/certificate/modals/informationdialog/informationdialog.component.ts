import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from "../../../../certificate.service";

@Component({
  selector: 'app-informationdialog',
  templateUrl: './informationdialog.component.html',
  styleUrls: ['./informationdialog.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class InformationdialogComponent implements OnInit {

  informationData = [];
  infoForm: FormGroup;
  load = false;

  constructor(
    public dialogRef: MatDialogRef<InformationdialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certService: CertificateService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
    console.log(this.data)
  }

  async getData(){
    await this._certService.informationPrint(this.data.idsample)
    .then(x => this.informationData = this.informationData.concat(x))
    .then(()=> this.infoForm = this.createForm())
    .then(() => console.log(this.informationData));
  }

  createForm(): FormGroup {
    return this._formBuild.group({
      information : [this.informationData[0] == null  ? '' : this.informationData[0].print_info,{ validator: Validators.required }]
    })
  }

  saveForm(){
    console.log(this.informationData[0].id);
    this._certService.addInformationPrint(this.infoForm.value, this.informationData[0].id).then(x => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this._route.navigateByUrl('/analystpro/archive-certificate/');
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
