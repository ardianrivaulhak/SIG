import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../certificate.service';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { url, urlApi } from "app/main/url";
import * as _moment from 'moment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-revattachmentmodals',
  templateUrl: './revattachmentmodals.component.html',
  styleUrls: ['./revattachmentmodals.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class RevattachmentmodalsComponent implements OnInit {
  
  fileUpload = this._fb.group({
    file: "",
    fileName: "",
    type: "",
  });

  loadingfirst = true;
  revFile: FormGroup; 
  files: File[] = [];
  load = false;
  dataAttachmentRevision = [];
  dataHistoryRevision = []
  dataFilter = {
    id: this.data.id,
    pages : 1,
    status : null,
    type : "paginate"
  } 
  idcert = this.data.id;


  constructor(
    public dialogRef: MatDialogRef<RevattachmentmodalsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certServ: CertificateService,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.revFile = this.createForm();
    this.getData();
    this.getDataHistory();
  }

  async getData()
  {
    await this._certServ.attachmentDataRevision(this.dataFilter).then(x => {
      this.dataAttachmentRevision = this.dataAttachmentRevision.concat(Array.from(x['data']));
      this.dataAttachmentRevision = this.uniq(this.dataAttachmentRevision, (it) => it.id);
    })
    .then(x => console.log(this.dataAttachmentRevision))
    this.loadingfirst =  await false;
  }

  async getDataHistory()
  {
    await this._certServ.historyRevision(this.dataFilter).then(x => {
        this.dataHistoryRevision = this.dataHistoryRevision.concat(Array.from(x['data']));
        this.dataHistoryRevision = this.uniq(this.dataHistoryRevision, (it) => it.id);
      })
      .then(x => console.log(this.dataHistoryRevision))
      this.loadingfirst =  await false;
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  createForm(): FormGroup {
    return this._formBuild.group({
      fileAttachment : ['',{ validator: Validators.required }]
    })
  }


  onSelect(event) {
		console.log(event);
		this.files.push(...event.addedFiles);
    this.readThis(event.target);
	}

  onRemove(event) {
		console.log(event);   
		this.files.splice(this.files.indexOf(event), 1);
	}


  readThis(inputValue: any): void {
    console.log(inputValue)
    var file: File = inputValue.addedFiles[0].name;

    var pattern = /pdf-*/;
    if (!file.type.match(pattern)) {
        alert("Upload Only PDF");
        return;
    }
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
        this.revFile.controls.fileAttachment.value[0] =
            myReader.result;
        console.log(this.revFile.controls.fileAttachment.value);
    };
    myReader.readAsDataURL(file);
    console.log(inputValue.addedFiles)

    if (inputValue.addedFiles > 0) {
      const file = inputValue.addedFiles[0];
      this.fileUpload.patchValue({
          file: file,
          fileName: file.name,
          type: "file",
      });
      console.log(this.fileUpload)
    }
  }


  saveForm(){
    const formData = new FormData();
    formData.append("file", this.fileUpload.controls.file.value);

   this._certServ.uploadAttachmentRev(formData, this.idcert).then(y => {
    this.load = true;
    let message = {
      text: 'Data Succesfully Save',
      action: 'Done'
    }
    setTimeout(()=>{  
      this.openSnackBar(message);
      this.load = false;
      this.closeDialog(false);
    },1000)
  })

  }

  
  closeDialog(v){
    return this.dialogRef.close({
      v
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  async uploadGambar(event) {
    console.log(event);
		this.files.push(...event.addedFiles);
    // this.readThis(event.target);

    if (event.addedFiles.length > 0) {
      const file = await event.addedFiles[0];
      console.log(file)
      await this.fileUpload.patchValue({
          file: file,
          fileName: file.name,
          type: "file",
      });
      await console.log(this.fileUpload)
  }
}

opendetailphoto(v) {
  
  // let setmou =
  //     this.status == "mou" ? `mou/${this.nocustmou}` : this.contract_no;
  let urls = `${url}certificate/${_moment(v.created_at).format('YYYY')}/${_moment(v.created_at).format('MM')}/${this.dataHistoryRevision[0].transaction_sample.kontrakuji.contract_no}/attachment/${v.file}`;
  window.open(urls, "_blank");
}

  deleteAttachment(id){
    console.log(id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._certServ.attachmentDataRevisionRemove(id).then(x => {
        })
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
      setTimeout(()=>{
        // this.dataSampleLab=[];
        // this.loadingfirst =  true;
        // this.getSampleLab();
        // this.load = false;
      },1000)
    })
  }


}
