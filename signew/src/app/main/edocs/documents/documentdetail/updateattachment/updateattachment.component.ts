import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { EdocsService } from "../../../edocs.service";

@Component({
  selector: 'app-updateattachment',
  templateUrl: './updateattachment.component.html',
  styleUrls: ['./updateattachment.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class UpdateattachmentComponent implements OnInit {
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
    public dialogRef: MatDialogRef<UpdateattachmentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _edocServ : EdocsService
  ) { }

  ngOnInit(): void {
    this.dataEdit();
    
  }

  dataEdit()
  {
    console.log(this.data)
    this.formEdit.id = this.data.data.id_document_inheritance
    this.formEdit.document_title = this.data.data.inheritance_document.title;
    this.formEdit.document_number = this.data.data.inheritance_document.document_number;
    this.formEdit.issue_number = this.data.data.inheritance_document.issue_number;
    this.formEdit.date_of_issue = this.data.data.inheritance_document.date_of_issue;
    this.formEdit.revision_number = this.data.data.inheritance_document.revision_number;
    this.formEdit.date_of_revision = this.data.data.inheritance_document.date_of_revision;
    this.formEdit.total_pages = this.data.data.inheritance_document.total_pages;
    this.formEdit.information = this.data.data.inheritance_document.information;
  }

  save()
  {
      this._edocServ.updateAttachment(this.formEdit).then( (x) => {
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
