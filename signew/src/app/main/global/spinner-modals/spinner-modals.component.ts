import { Component, OnInit, Inject, Optional } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: 'app-spinner-modals',
  templateUrl: './spinner-modals.component.html',
  styleUrls: ['./spinner-modals.component.scss']
})
export class SpinnerModalsComponent implements OnInit {

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<SpinnerModalsComponent>,
  ) {
    if(data){
      this.sethowlongittakes(data)
    }
   }

  ngOnInit(): void {}


  sethowlongittakes(v){
    setTimeout(() =>{
      this.dialogRef.close();
    },v);
  }

}
