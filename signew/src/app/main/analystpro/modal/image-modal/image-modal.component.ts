import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent implements OnInit {

  dataphoto = []; 
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ImageModalComponent>
  ) {
    if(data){
      this.dataphoto = this.dataphoto.concat(data);
      console.log(data)
    }

    this.dialogRef.backdropClick().subscribe(v => {
      
    });
   }

  ngOnInit(): void {
  }

  fileChangeEvent(event: any): void {
    this.dataphoto = event;
  }

}
