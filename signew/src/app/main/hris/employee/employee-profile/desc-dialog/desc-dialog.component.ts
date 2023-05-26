import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-desc-dialog',
  templateUrl: './desc-dialog.component.html',
  styleUrls: ['./desc-dialog.component.scss']
})
export class DescDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DescDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    console.log(this.data)
  }

}
