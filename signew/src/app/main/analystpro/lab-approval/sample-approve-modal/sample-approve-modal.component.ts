import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { LabApprovalService } from '../lab-approval.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  Form,
} from "@angular/forms";
import * as global from 'app/main/global';

export const MY_FORMATS = {
    parse: {
        dateInput: "LL",
    },
    display: {
        dateInput: "DD/MM/YYYY",
        monthYearLabel: "YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "YYYY",
    },
};




@Component({
  selector: 'app-sample-approve-modal',
  templateUrl: './sample-approve-modal.component.html',
  styleUrls: ['./sample-approve-modal.component.scss'],
  providers: [
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
],
})
export class SampleApproveModalComponent implements OnInit {

  sampleApproveForm: FormArray = this._formBuilder.array([]);
  sampleDet: FormGroup = this._formBuilder.group({
    sample: this.sampleApproveForm,
  });
  parameter = [];
  disabledall = false;

  // totalapprove;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<SampleApproveModalComponent>,
    private _labApproveServ: LabApprovalService,
    private _formBuilder: FormBuilder
  ) { 
    if(data){
      
      this.parameter = this.parameter.concat(data.sample);
      global.uniq(data.sample, (it) => it.id_sample).forEach(v => {
        this.addFormData(v);
      });
      this.disabledall = this.sampleApproveForm.controls.filter(g => g.status).length < 1 ? true : false;
    }
    this._dialogRef.backdropClick().subscribe(v => {
      this.closeModal()
    });
  }

  ngOnInit(): void {
  }

  addFormData(d) {
    const parameterFormat = this._formBuilder.group({
      id_sample: [d.id_sample],
      no_sample: [d.transaction_sample.no_sample],
      sample_name: [d.transaction_sample.sample_name],
      status: this.parameter.filter(g => g.conditionlabdone.length < 1 && g.id_sample === d.id_sample).length > 0 ? true : false,
      kesimpulan: d.transaction_sample.kesimpulan ? d.transaction_sample.kesimpulan : new FormControl()
    });
    this.sampleApproveForm.push(parameterFormat);
  }

  sendSample(v){
    let a = [];
    a = a.concat(v);
    this._labApproveServ.sendSampleCertificate(a).then(c => {
      global.swalsuccess("Success","Data Sent to Certificate !")
    })
    .then(() => this.closeModal())
    .catch(e => global.swalerror("Error Sending Sample to Certificate !"));
  }

  sendSampleAll(){
      this._labApproveServ.sendSampleCertificate(this.sampleDet.controls.sample['controls'].filter(z => !z.value.status).map(c => c.value)).then(c => {
        global.swalsuccess("Success","Data Sent to Certificate !")
      })
      .then(() => this.closeModal())
      .catch(e => global.swalerror("Error Sending Sample to Certificate !"));
  }

  closeModal(){
    return this._dialogRef.close({
      b: "close",
      c: this.sampleDet.value
    });
  }

}
