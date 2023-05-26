import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
@Component({
  selector: 'app-complain-modal',
  templateUrl: './complain-modal.component.html',
  styleUrls: ['./complain-modal.component.scss']
})
export class ComplainModalComponent implements OnInit {

  datacomplain = [];
  datadetail = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ComplainModalComponent>,
  ) { 
    if(data){
      console.log(data);
      this.datacomplain = this.datacomplain.concat(data);
    }
  }

  ngOnInit(): void {
  }

}
