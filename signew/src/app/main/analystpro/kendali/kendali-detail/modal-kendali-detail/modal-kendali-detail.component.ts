import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-kendali-detail',
  templateUrl: './modal-kendali-detail.component.html',
  styleUrls: ['./modal-kendali-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalKendaliDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalKendaliDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  closeDialog(){
    console.log('hsi');
  }

}
