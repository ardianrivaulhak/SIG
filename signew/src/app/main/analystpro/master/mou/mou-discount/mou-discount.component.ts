import { Component, OnInit, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-mou-discount',
  templateUrl: './mou-discount.component.html',
  styleUrls: ['./mou-discount.component.scss']
})
export class MouDiscountComponent implements OnInit {

  dataSource = []; 
  DiscountForm: FormGroup;
  idmou: any;

  constructor(
    private _formBuild: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MouDiscountComponent>
  ) {
    if (data) {
      this.idmou = data.idMou;
      this.dataSource = data.condition;
      console.log(this.dataSource);
      this.DiscountForm = this.discountForm();
      
    }
    this.dialogRef.backdropClick().subscribe((v) => {
      this.saveFrom();

    });
   }

  ngOnInit(): void {
  }

  discountForm() { 
    return this._formBuild.group({
      discount:  [{
            value:  this.idmou !== 'add' ? '' : '',
            disabled: this.idmou !== 'add' ? false : false
          }],    
    });  
  }

  saveFrom(){ 
    console.log(this.DiscountForm.value);

    let condition = []; 
    let normal = {
      condition : 2,
      values : this.DiscountForm.value.discount,
      description : `Discount ${this.DiscountForm.value.discount}%`, 
      type : "1"
    }
    condition = condition.concat(normal);
    console.log(condition);


    return this.dialogRef.close({
      b: "close",
      c: condition,
    });
  }

}
