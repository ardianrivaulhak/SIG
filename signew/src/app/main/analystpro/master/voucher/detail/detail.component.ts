import { Component, OnInit, Inject, ɵCompiler_compileModuleSync__POST_R3__ } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VoucherService } from '../voucher.service';
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
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
],
})
export class DetailComponent implements OnInit {

  formVoucher: FormGroup;
  statusdata;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<DetailComponent>,
    private fb: FormBuilder,
    private _vocServ: VoucherService
  ) {
    if(data){
      this.formVoucher = this.setForm();
      this.statusdata = data.data;
      if(data.data !== 'add'){
        this.setFormEdit(data.data);
      }
    }
   }

  ngOnInit(): void {
  }

  setForm(): FormGroup{
    return this.fb.group({
      vouchername : new FormControl(),
      validate: new FormControl(),
      price: new FormControl(),
      disc: new FormControl(),
      status: new FormControl(),
      desc: new FormControl()
    })
  }

  setFormEdit(v){
    this._vocServ.getDataVoucherDet(v).then((x: any) => {
      this.formVoucher.patchValue({
        vouchername : x.voucher_name,
        validate: new Date(x.valid_until),
        price: x.price ? x.price : '',
        disc: x.discount ? x.discount : '',
        status: x.status.toString(),
        desc: x.desc
      })
    });
  }

  saveData(){
    let x = this.statusdata !== 'add' ? this._vocServ.upDateVoucher(this.formVoucher.value, this.statusdata) : this._vocServ.storeDataVoucher(this.formVoucher.value);
    x.then(o => global.swalsuccess('Success','Data Success di Save'))
    .then(() =>  this.closeModal());
  }

  setValueChange(){
    if(this.formVoucher.controls.status.value > 0){
      this.formVoucher.controls.disc.setValue(null);
    } else {
      this.formVoucher.controls.price.setValue(null);
    }
  }

  closeModal(){
    return this._dialogRef.close({
      b: "close"
    });
  }

}
