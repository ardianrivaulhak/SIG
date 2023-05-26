import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlService } from '../../control.service';
import { datakendaliElement } from 'app/main/analystpro/kendali/kendali-detail/sidebars/details/details.component';


@Component({
  selector: 'app-sample-modals',
  templateUrl: './sample-modals.component.html',
  styleUrls: ['./sample-modals.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SampleModalsComponent implements OnInit {

  idSample = this.data.idSample;
  sampleData = [];
  sampleForm: FormGroup;
  load = false;

  constructor(
    public dialogRef: MatDialogRef<SampleModalsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _controlService: ControlService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) {
    
   }

  ngOnInit(): void {
    if(this.data.select == 'nonchecklist') {
      this.getDetailSample();
    }else {
      this.sampleForm = this.createForm()
    }
   
  }

  getDetailSample()
  {
    this._controlService.getDetailDataSample(this.idSample)
    .then(x => this.sampleData = this.sampleData.concat(x))
    .then(()=> this.sampleForm = this.createForm())
    .then(c => console.log(this.sampleForm))
  }

  createForm(): FormGroup {
    return this._formBuild.group({
      tgl_estimasi_lab: [new Date ( this.data.select == 'nonchecklist' ? this.sampleData[0].tgl_estimasi_lab == null ? new Date : this.sampleData[0].tgl_estimasi_lab : new Date).toISOString(), { validator: Validators.required }],
    })
  }

  saveForm(){
    if (this.data.select == 'nonchecklist') {
      this._controlService.updateEstimasiLab(this.idSample, this.sampleForm.value).then(y => {
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
    } else {
      let u = [];
      this.idSample.forEach((x) => {
          if (x.checked) {
              u = u.concat({
                  id: x.id,
              });
          }
      });
      console.log(u)
      this._controlService.updateBulkEstimasiLab(u, this.sampleForm.value).then(y => {
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

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  
  closeModal(ev){
    return this.dialogRef.close(
       ev
    );
  }


}
