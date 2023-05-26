import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";
import * as globals from "app/main/global";
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from "@angular/router";
import { EdocsService } from "../../edocs.service";
import { UpdatedocumentsComponent } from "../documentdetail/updatedocuments/updatedocuments.component";
import { dataformathasil } from 'app/main/analystpro/revision-contract/data';
import { url, urlApi, urlFrontend } from "app/main/url";
import { UpdateattachmentComponent } from "../documentdetail/updateattachment/updateattachment.component";
import { ViewersDocumentComponent } from "../../dialog/viewers-document/viewers-document.component";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UpdateotherattachmentComponent } from "./updateotherattachment/updateotherattachment.component";

@Component({
  selector: 'app-documentdetail',
  templateUrl: './documentdetail.component.html',
  styleUrls: ['./documentdetail.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DocumentdetailComponent implements OnInit {
  load = false;
  tabAtachment = null;
  visibility = 0;
  datasend = {
    category : this._actRoute.snapshot.params["category"],
    id : this._actRoute.snapshot.params["id"],
    type_doc : 0
  }
  titles = ''
  documentData: any;
  bgColorAmandement = '#CBEDD5';
  bgColorDocument = '#CBEDD5';
  bgColorFlowchart = '#CBEDD5';
  bgColorForm = '#CBEDD5';
  bgColorChangeHistory = '#CBEDD5';
  bgColorAmandementForm = '#CBEDD5';
  amandementData = [];
  documentsData = [];
  flowchartData = [];
  formData = [];
  historiesData = [];
  amandementFormData = [];
  fileUpload = this._fb.group({
    file: "",
    fileName: "",
    type: "",
  });
  memory = [];
  dataForm = {
      document : [],
      id : ''
  }


  constructor(
    private _edocServ : EdocsService,
    private _actRoute: ActivatedRoute,
    private _route : Router,
    private _matDialog : MatDialog,
    private _snackBar: MatSnackBar,
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getData();
  }



  async getData()
  {
    await this._edocServ
            .getDetailDocuments(this.datasend)
            .then((x) => {
              this.documentData = x
            }) 
            console.log(this.documentData)
  }

  updateModals(data) : void 
  {
    let dialogCust = this._matDialog.open(UpdatedocumentsComponent, {
      panelClass: 'update-document-dialog',
      // disableClose : true,
      width : '600px',
      data: { data: data, id_document : this.datasend.id },
    });
    dialogCust.afterClosed().subscribe((result) => {
      console.log(result)
     if(result.ev == false){
      this.documentData= null; 
      this.getData();
     }
    });
  }

  updateAttachmentModals(data) : void 
  {
    let dialogCust = this._matDialog.open(UpdateattachmentComponent, {
      panelClass: 'update-attachemnt-dialog',
      // disableClose : true,
      width : '600px',
      data: { data: data, id : this.datasend.id },
    });
    dialogCust.afterClosed().subscribe((result) => {
      console.log(result)
     if(result.ev == false){
      this.amandementData = []; 
      this.openAttachmentAmandement();
     }
    });
  }

  
  openAttachmentTab(ev)
  {
    this.tabAtachment = ev;
    this.tabAtachment == 'amandement' ? this.openAttachmentAmandement() : this.bgColorAmandement = "#CBEDD5";
    this.tabAtachment == 'documents' ? this.openAttachmentDocument() : this.bgColorDocument = "#CBEDD5";
    this.tabAtachment == 'flowcharts' ? this.openAttachmentFlowchart() : this.bgColorFlowchart = "#CBEDD5";
    this.tabAtachment == 'forms' ? this.openAttachmentForm() : this.bgColorForm = "#CBEDD5";
    this.tabAtachment == 'history' ? this.openAttachmentHistory() : this.bgColorChangeHistory = "#CBEDD5";   
    this.tabAtachment == 'amandement_form' ? this.openAttachmentAmandementForm() : this.bgColorAmandementForm = "#CBEDD5";    
  }

  async openAttachmentAmandement()
  {
    this.datasend.type_doc = 2;
    this.amandementData = [];
    this.bgColorAmandement = await "#3C6255";
    await this._edocServ.listAmandementDocument(this.datasend).then((x) => {
      console.log(x)
      this.amandementData = this.amandementData.concat(x);
    });
    await console.log(this.amandementData);    
  }

  async openAttachmentDocument()
  {
    this.datasend.type_doc = 1;
    this.documentsData = [];
    this.bgColorDocument = await "#3C6255";
    await this._edocServ.listAmandementDocument(this.datasend).then((x) => {
      console.log(x)
      this.documentsData = this.documentsData.concat(x);
    });
    await console.log(this.documentsData);    
  }

  async openAttachmentFlowchart()
  {
    this.datasend.type_doc = 3;
    this.flowchartData = [];
    this.bgColorFlowchart = await "#3C6255";
    await this._edocServ.listAmandementDocument(this.datasend).then((x) => {
      console.log(x)
      this.flowchartData = this.flowchartData.concat(x);
    });
    await console.log(this.flowchartData);    
  }

  async openAttachmentForm()
  {
    this.datasend.type_doc = 4;
    this.formData = [];
    this.bgColorForm = await "#3C6255";
    await this._edocServ.listAmandementDocument(this.datasend).then((x) => {
      console.log(x)
      this.formData = this.formData.concat(x);
    });
    await console.log(this.formData);    
  }


  async openAttachmentHistory()
  {
    this.datasend.type_doc = 5;
    this.historiesData = [];
    this.bgColorChangeHistory = await "#3C6255";
    await this._edocServ.listAmandementDocument(this.datasend).then((x) => {
      console.log(x)
      this.historiesData = this.historiesData.concat(x);
    });
    await console.log(this.historiesData);    
  }

  async openAttachmentAmandementForm()
  {
    this.datasend.type_doc = 6;
    this.amandementFormData = [];
    this.bgColorAmandementForm = await "#3C6255";
    await this._edocServ.listAmandementDocument(this.datasend).then((x) => {
      console.log(x)
      this.amandementFormData = this.amandementFormData.concat(x);
    });
    await console.log(this.amandementFormData);    
  }

  openDocument(v) {
    let a = {
      data : v
    }
    console.log(a)
    let url = `${urlFrontend}#/edoc/pdf/${a.data.type + `/` +  a.data.id}`;
    window.open(url, "_blank");
  }

  atciveattachment(ev, id)
  { 
    let data = {
      active: ev,
      id:id
    }
    ev == 0 ? this.visibility = 0 : this.visibility = 1;
    this._edocServ.setActiveDocument(data).then( (x) => {
      this.load = true;
      let message = {
          text: "Data Succesfully Updated",
          action: "Done",
      };
      setTimeout(() => {
          this.amandementData = [];
          this.openAttachmentAmandement();
          this.openSnackBar(message);
          this.load = false;
      }, 2000);
    })

  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  viewersDocument(data) : void 
  {
    let dialogCust = this._matDialog.open(ViewersDocumentComponent, {
      panelClass: 'viewers-document-dialog',
      // disableClose : true,
      width : '600px',
      data: { data: data, id_document : this.datasend.id },
    });
    dialogCust.afterClosed().subscribe((result) => {
      console.log(result)
     if(result.ev == false){
      this.documentData= null; 
      this.getData();
     }
    });
  }

  async gotoAccess()
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/edoc/documents/${this.datasend.category}/${this.datasend.id}/access`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

  async uploadDocument(event, parameter){
    if (event.target.files.length > 0) {
      const file = await event.target.files[0];
      await this.fileUpload.patchValue({
          file: file,
          fileName: file.name
      });      
      await this.sendData(parameter);
    }
  }

  async sendData(parameter) {
    let a = {
      category : this.datasend.category,
      type : parameter,
      id_document : this.datasend.id,
      data : this.documentData,
      id_attachment : null
    }

    const formData  = await new FormData();
    await formData.append("file", this.fileUpload.controls.file.value);
    await this._edocServ
        .attachmentDocument(formData)
        .then(async (x) => {
            a.id_attachment = await x
            await this._edocServ.attachmentAddDocument(a)

        });
  }

  updateOtherAttachment(type) : void 
  {
    let dialogCust = this._matDialog.open(UpdateotherattachmentComponent, {
      panelClass: 'update-other-attachment-dialog',
      // disableClose : true,
      width : '600px',
      data: { data: this.datasend, type : this.documentData.type },
    });
    dialogCust.afterClosed().subscribe((result) => {
      console.log(result)
     if(result.ev == false){
      this.documentData= null; 
      this.getData();
     }
    });
  }

  deleteAttachment(id, category)
  {
    let a = {
      id : id,
      category : category
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._edocServ.deleteOtherDocument(a).then(x => {
        })
        this.refreshFile(a);
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
       // this.loadingfirst =  true;  
      },1000)
    })
  }

  async refreshFile(a)
  {

    let arr = [];
    if(a.category == 'documents'){
      
      arr = await arr.concat(this.documentsData);
      arr = await arr.filter(x => {
        return x.id != a.id;
      });
      this.documentsData = await arr;
      console.log(this.documentsData)
    }

    if(a.category == 'amandement'){  
      arr = await arr.concat(this.amandementData);
      arr = await arr.filter(x => {
        return x.id != a.id;
      });
      this.amandementData = await arr;
      console.log(this.amandementData)
    }

    if(a.category == 'flowchart'){
      arr = await arr.concat(this.flowchartData);
      arr = await arr.filter(x => {
        return x.id != a.id;
      });
      this.flowchartData = await arr;
      console.log(this.flowchartData)
    }

    if(a.category == 'form'){
      arr = await arr.concat(this.formData);
      arr = await arr.filter(x => {
        return x.id != a.id;
      });
      this.formData = await arr;
      console.log(this.formData)
    }

    if(a.category == 'amandement_form'){
      arr = await arr.concat(this.amandementFormData);
      arr = await arr.filter(x => {
        return x.id != a.id;
      });
      this.amandementFormData = await arr;
      console.log(this.amandementFormData)
    }

    if(a.category == 'history'){
      arr = await arr.concat(this.historiesData);
      arr = await arr.filter(x => {
        return x.id != a.id;
      });
      this.historiesData = await arr;
      console.log(this.historiesData)
    }
   

  }



}
