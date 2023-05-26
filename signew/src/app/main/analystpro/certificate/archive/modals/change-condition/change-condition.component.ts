import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../certificate.service';
import { MatDialog } from '@angular/material/dialog';
interface changeData {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-change-condition',
  templateUrl: './change-condition.component.html',
  styleUrls: ['./change-condition.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ChangeConditionComponent implements OnInit {

  conditionData = [];
  changeForm: FormGroup;
  load = false;

  chnge: changeData[] = [
    {
      value: 'Revision', 
      viewValue: '2'
    },
    {
      value: 'Retest', 
      viewValue: '3'
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<ChangeConditionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certServ: CertificateService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.changeForm = this.createForm();
  }

  createForm(): FormGroup {
    return this._formBuild.group({
      condition : ['',{ validator: Validators.required }],
      reason : ['',{ validator: Validators.required }]
    })
  }

  disabledBUtton = false;

  async saveForm(){
    this.disabledBUtton = await true;
    await console.log(this.data);
    if (this.data.status == 2) {
      await this._certServ.changeCondition(this.data, this.changeForm.value).then(y => {
            this.load = true;
            let message = {
              text: 'Change Condition Succesfully',
              action: 'Done'
            }
            setTimeout(()=>{  
              this.openSnackBar(message);
              this._route.navigateByUrl('/analystpro/archive-certificate/' + this.data.idcontract);
              this.closeModal(false);
              this.load = false;
            },1000)
        })
    }

    if(this.data.status == 1){
      await this._certServ.changeConditionDraft(this.data, this.changeForm.value).then(y => {
            this.load = true;
            let message = {
              text: 'Change Condition Succesfully',
              action: 'Done'
            }
            setTimeout(()=>{  
              this.openSnackBar(message);
              this._route.navigateByUrl('/analystpro/certificate/' + this.data.idcontract + '/lhu');
              this.closeModal(false);
              this.load = false;
            },1000)
        })
    }
    this.disabledBUtton = await true;
    
  }

  closeModal(v){
    return this.dialogRef.close({
        v
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
