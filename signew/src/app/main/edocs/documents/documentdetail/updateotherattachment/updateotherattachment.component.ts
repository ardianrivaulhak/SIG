import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { EdocsService } from "../../../edocs.service";

@Component({
  selector: 'app-updateotherattachment',
  templateUrl: './updateotherattachment.component.html',
  styleUrls: ['./updateotherattachment.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class UpdateotherattachmentComponent implements OnInit {

  load = false;
  formEdit = {
    id_document: '',
    document_title : '',
    document_number : '',
    issue_number : '',
    date_of_issue : '',
    revision_number : '',
    date_of_revision : '',
    total_pages : '',
    information : '',
    type : 0,
    type_document : 0,
    doc : null
  }

  amandements = [];
  fileUpload = this._fb.group({
    file: "",
    fileName: "",
    type: "",
  });

  constructor(
    public dialogRef: MatDialogRef<UpdateotherattachmentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _edocServ : EdocsService,
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.dataEdit();
  }

  
  dataEdit()
  {
    console.log(this.data)
    this.formEdit.id_document = this.data.data.id;
    this.formEdit.type = this.data.type;
    this.formEdit.type_document = this.data.data.type_doc;
    // this.formEdit.document_title = this.data.data.title;
    // this.formEdit.document_number = this.data.data.document_number;
    // this.formEdit.issue_number = this.data.data.issue_number;
    // this.formEdit.date_of_issue = this.data.data.date_of_issue;
    // this.formEdit.revision_number = this.data.data.revision_number;
    // this.formEdit.date_of_revision = this.data.data.date_of_revision;
    // this.formEdit.total_pages = this.data.data.total_pages;
    // this.formEdit.information = this.data.data.information;
  }

  async save()
  {
      this.formEdit.doc = await this.amandements;
      console.log(this.formEdit)
      await this._edocServ.addNewOtherDocument(this.formEdit).then( (x) => {
        
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

  async uploadDocument(event, parameter){
    if (event.target.files.length > 0) {
      const file = await event.target.files[0];
      await this.fileUpload.patchValue({
          file: file,
          fileName: file.name
      });      
      await this.sendData(parameter);
      // if(parameter == 'document'){
      //   await this.sendData(parameter, index);
      // }else{
      //   await this.sendDataOthers(parameter, index);
      // }
    }
  }

  async sendData(parameter) {
    let a = {
      file : null,
      type : null
    }

    const formData  = await new FormData();
    await formData.append("file", this.fileUpload.controls.file.value);
    await console.log(formData)
    await this._edocServ
        .attachmentDocument(formData)
        .then((x) => {
          console.log(x)
          a.file = x;
          a.type = parameter;
         this.amandements = this.amandements.concat(a)
        });
        console.log(this.amandements)
  }


}
