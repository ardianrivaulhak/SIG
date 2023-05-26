import { Component, OnInit, Inject  } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-attachment-see',
  templateUrl: './modal-attachment-see.component.html',
  styleUrls: ['./modal-attachment-see.component.scss']
})
export class ModalAttachmentSeeComponent implements OnInit {

  photo;


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ModalAttachmentSeeComponent>,
  ) { 
    if(data){
      console.log(data);
      this.photo = data;
    }
  }

  ngOnInit(): void {
  }

}
