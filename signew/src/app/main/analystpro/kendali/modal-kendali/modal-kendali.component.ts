import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-kendali',
  templateUrl: './modal-kendali.component.html',
  styleUrls: ['./modal-kendali.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ModalKendaliComponent implements OnInit {

  fromPage: string;
  fromDialog: string;
  descForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalKendaliComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuild: FormBuilder,
  ) { 
    this.fromPage = data;
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  closeDialog() {
    this.dialogRef.close({ event: 'close', data: this.fromDialog });
  }

  // createContactForm(): FormGroup
  //   {
  //       return this._formBuilder.group({
  //           id      : [this.contact.id],
  //           name    : [this.contact.name],
  //           lastName: [this.contact.lastName]
  //       });
  //   }

}
