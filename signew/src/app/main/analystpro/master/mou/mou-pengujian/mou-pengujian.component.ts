import { Component, OnInit, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormControlName, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-mou-pengujian',
  templateUrl: './mou-pengujian.component.html',
  styleUrls: ['./mou-pengujian.component.scss'],
  animations   : fuseAnimations 
})
export class MouPengujianComponent implements OnInit {

  dataSource = []; 
  statusPengujianForm: FormArray = this._formBuild.array([]);
  MouForm: FormGroup = this._formBuild.group({
    status: this.statusPengujianForm
  });
  idmou: any;
  display = [
    'title',
    'values',
    'discount'
  ]
  constructor(
    private _formBuild: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MouPengujianComponent>
  ) {
    if (data) {
      console.log(data);
      for(let i = 0; i < 5; i++){        
        this.testForm(i);
      }
      if(data.controls.length > 0){
        this.setFormValue(data);
      }
    }
    this.dialogRef.backdropClick().subscribe((v) => {
      this.exit();

    });
   }

  ngOnInit(): void {
    
  }

  setFormValue(data){
    for(let u=0; u < data.value.length; u++){
      this.MouForm.controls.status['controls'][u].setValue({
        id_status_pengujian: data.value[u].id_status_pengujian,
        values: data.value[u].values,
        discount: data.value[u].discount
      })
    }
  }

  getValPengujian(ev){
    console.log(this.MouForm.value)
  }

  testForm(i){
    const parameter = this._formBuild.group({
      id_status_pengujian: [i + 1],
      discount: ['', Validators.required],
      values: [i+1, Validators.required]
    });
    this.statusPengujianForm.push(parameter);
  }


  saveFrom(){ 
    return this.dialogRef.close({
      b: "close",
      c: this.MouForm.controls,
    });
  }

  exit(){
    return this.dialogRef.close();
  }

}
