import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { EdocsService } from "../../../edocs.service";

@Component({
  selector: 'app-updatedocuments',
  templateUrl: './updatedocuments.component.html',
  styleUrls: ['./updatedocuments.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class UpdatedocumentsComponent implements OnInit {
  load = false;
  formEdit = {
    id: '',
    document_title : '',
    document_number : '',
    issue_number : '',
    date_of_issue : '',
    revision_number : '',
    date_of_revision : '',
    total_pages : '',
    information : ''
  }

  constructor(
    public dialogRef: MatDialogRef<UpdatedocumentsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _edocServ : EdocsService
  ) { 
    
  }

  ngOnInit(): void {
    this.dataEdit();
    
  }

  dataEdit()
  {
    console.log(this.data)
    this.formEdit.id = this.data.id_document
    this.formEdit.document_title = this.data.data.title;
    this.formEdit.document_number = this.data.data.document_number;
    this.formEdit.issue_number = this.data.data.issue_number;
    this.formEdit.date_of_issue = this.data.data.date_of_issue;
    this.formEdit.revision_number = this.data.data.revision_number;
    this.formEdit.date_of_revision = this.data.data.date_of_revision;
    this.formEdit.total_pages = this.data.data.total_pages;
    this.formEdit.information = this.data.data.information;
  }

  save()
  {
      this._edocServ.updateDetailDocument(this.formEdit).then( (x) => {
        this.load = true;
        let message = {
            text: "Data Succesfully Updated",
            action: "Done",
        };
        setTimeout(() => {
            this.openSnackBar(message);
            this.closeModal(false)
            this.load = false;
        }, 2000);
      })
  }

  closeModal(ev){
    return this.dialogRef.close({
      ev
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }



}
