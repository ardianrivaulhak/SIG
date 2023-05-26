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
  selector: 'app-modal-sample-kesimpulan',
  templateUrl: './modal-sample-kesimpulan.component.html',
  styleUrls: ['./modal-sample-kesimpulan.component.scss'],
  providers: [
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
],
})
export class ModalSampleKesimpulanComponent implements OnInit {

  conclusionForm: FormArray = this._formBuilder.array([]);
  labSampleConclusion: FormGroup = this._formBuilder.group({
    sample: this.conclusionForm,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<ModalSampleKesimpulanComponent>,
    private _labApproveServ: LabApprovalService,
    private _formBuilder: FormBuilder
  ) {
    if(data){
      console.log(data);
      data.sample.forEach(v => {
        this.addFormData(v);
      });
    }
    this._dialogRef.backdropClick().subscribe(v => {
      this.closeModal()
    });
   }

  ngOnInit(): void {
  }



  addFormData(d) {
    const parameterFormat = this._formBuilder.group({
      checked : [0],
      id_sample: [d.transaction_sample.id],
      no_sample: [d.transaction_sample.no_sample],
      sample_conclude: [d.transaction_sample.kesimpulan ? d.transaction_sample.kesimpulan : '']
    });
    this.conclusionForm.push(parameterFormat);
  }

  closeModal(){
    return this._dialogRef.close({
      b: "close",
      c: this.labSampleConclusion.value
    });
  }

}
