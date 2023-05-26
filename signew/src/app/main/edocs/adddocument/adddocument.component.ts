import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef,MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { EdocsService } from '../edocs.service';
import * as globals from "app/main/global";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { url, urlApi, urlFrontend } from "app/main/url";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  selector: 'app-adddocument',
  templateUrl: './adddocument.component.html',
  styleUrls: ['./adddocument.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class AdddocumentComponent implements OnInit {
  load = false;
  loadingfirst = true;
  filterMaster = {
    id : null,
    value : null 
  }
  masterData = [];

  filterMasterInhetitance = {
    id : null,
    value : null 
  }
  masterDataInhetitance = [];
  viewmasterInheritance = false;

  formData = {
    type_document : null,
    type_inheritance : null,
    title : null,
    document_number: null,
    issue_number : null,
    issued_date : null,
    revision_number : null,
    revision_date : null,
    total_pages : 0,
    information: null,
    documents : [],
    amandements : [],
    flowcharts : [],
    form : [],
    amandement_form : [],
    changeHistory : []
  }

  fileUpload = this._fb.group({
    file: "",
    fileName: "",
    type: "",
  });

  amandements = [];
  flowcharts = [];
  amandement_form = [];
  formulirs = [];
  histories = [];
  memory = [];
  memory_amandement = [];

  constructor(
    private _edocServ : EdocsService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { } 

  ngOnInit(): void {
    this.getMasterData();
  }


  async getMasterData() {
    await this._edocServ
        .masterDocument(this.filterMaster)
        .then((x) => {
            this.masterData = this.masterData.concat(
                Array.from(x["data"])
            );
            this.masterData = globals.uniq(
                this.masterData, (it) => it.id
            );                
    });
  }

  async getMasterDataInheritance(ev)
  {
    this.masterDataInhetitance = await [];
    await console.log(ev.value.id);
    this.filterMasterInhetitance.id = await ev.value.id;
    await this._edocServ
        .masterDocumentInheritance(this.filterMasterInhetitance)
        .then((x) => {
          this.masterDataInhetitance = this.masterDataInhetitance.concat(
              Array.from(x["data"])
          );
          this.masterDataInhetitance = globals.uniq(
              this.masterDataInhetitance, (it) => it.id
          );                
    });
  }

  async selecttype(ev) {
    this.formData.type_inheritance = await 0;
     if(ev.value.inheritance == 1){
      await this.getMasterDataInheritance(ev);
        this.viewmasterInheritance = await true;
     }else{
        this.viewmasterInheritance = await false;
     }
  }

  async uploadDocument(event, parameter, index){
    if (event.target.files.length > 0) {
      const file = await event.target.files[0];
      await this.fileUpload.patchValue({
          file: file,
          fileName: file.name
      });      
      if(parameter == 'document'){
        await this.sendData(parameter, index);
      }else{
        await this.sendDataOthers(parameter, index);
      }
    }
  }

  async sendData(parameter, index) {
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
         this.memory = this.memory.concat(a)
        });
        console.log(this.memory)
    this.formData.documents = await this.memory;
  }

  async sendDataOthers(parameter, index) {
    let a = {
      file : null,
      type : null,
      index : null
    }

    let memory = [];
    const formData  = await new FormData();
    await formData.append("file", this.fileUpload.controls.file.value);

    if(parameter == 'amandement'){
        await this._edocServ
        .attachmentDocument(formData)
        .then((x) => {
          a.file = x;
          a.type = parameter;
          a.index = index;
        });        
        memory = memory.concat(a)
        this.amandements[index].file = memory;
    }   

    if(parameter == 'flowcharts'){
      await this._edocServ
      .attachmentDocument(formData)
      .then((x) => {
        a.file = x;
        a.type = parameter;
        a.index = index;
      });        
      memory = memory.concat(a)
      this.flowcharts[index].file = memory;
    }  
    
    if(parameter == 'formulir'){
      await this._edocServ
      .attachmentDocument(formData)
      .then((x) => {
        a.file = x;
        a.type = parameter;
        a.index = index;
      });        
      memory = memory.concat(a)
      this.formulirs[index].file = memory;
    }  

    if(parameter == 'amandement_form'){
      await this._edocServ
      .attachmentDocument(formData)
      .then((x) => {
        a.file = x;
        a.type = parameter;
        a.index = index;
      });        
      memory = memory.concat(a)
      this.amandement_form[index].file = memory;
  }   

    if(parameter == 'history'){
      await this._edocServ
      .attachmentDocument(formData)
      .then((x) => {
        a.file = x;
        a.type = parameter;
        a.index = index;
      });        
      memory = memory.concat(a)
      this.histories[index].file = memory;
    }  
  }

  

  
  async saveForm()
  {
    this.formData.amandements = await this.formData.amandements.concat(this.amandements)
    this.formData.flowcharts = await this.formData.flowcharts.concat(this.flowcharts)
    this.formData.form = await this.formData.form.concat(this.formulirs)
    this.formData.amandement_form = await this.formData.form.concat(this.amandement_form)
    this.formData.changeHistory = await this.formData.changeHistory.concat(this.histories)
   
    await this._edocServ.addNewDocuments(this.formData).then((x) => {
      this.load = true;
      let message = {
          text: "Data Succesfully Updated",
          action: "Done",
      };
      setTimeout(() => {
          this.openSnackBar(message);
          this._route.navigateByUrl("edoc/documents");
          this.load = false;
      }, 2000);
     });
  }

  addRowAmandement(parameter)
  {    
    let content = {
      title : '',
      document_number : '',
      issue_number : '',
      date_of_issue : '',
      revision_number : '',
      date_of_revision : '',
      total_pages : '',
      file: ''
    }    
    if(parameter == 'amandement') {
      this.amandements = this.amandements.concat(content);
    }else if(parameter == 'flowcharts'){
      this.flowcharts = this.flowcharts.concat(content);
    }else if(parameter == 'formulirs'){
      this.formulirs = this.formulirs.concat(content);
    }else if(parameter == 'histories'){
      this.histories = this.histories.concat(content);
    }else if(parameter == 'amandement_form'){
      this.amandement_form = this.amandement_form.concat(content);
    }
    
  }


  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
        duration: 2000,
    });
  }

  openDocument(v) {
    let a = {
      id : v.file.file.id
    }
    console.log(a);

    let urla = `${urlFrontend}#/edoc/pdf/${a.id}`;
    window.open(urla, "_blank");
    // this._edocServ.viewDocument(a).then( x => {
    //   let z : any;
    //   z = x
    //   let urla = `${urlFrontend}edoc/pdf/${a.id}`;
    //   window.open(urla, "_blank");
    // })
  }

  removeFile(v,i, cat)
  {
    let a = {
      id : v.file.file.id
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
        this._edocServ.removeFile(a).then(x => {
        })
        this.refreshFile(a, i, cat);
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
        this.loadingfirst =  true;  
      },1000)
    })
  }

  async refreshFile(v, i,cat)
  {
    console.log(v)
    console.log(i)
    console.log(cat)

    let a = await [];
    

    if(cat == 'document'){
      a = await a.concat(this.formData.documents);
      this.formData.documents = await [];
      a = await a.filter(x => {
        return x.file.file.id != v.id;
      });
      await console.log(a);
      this.formData.documents = await a;
    }

    if(cat == 'amandement'){  
      this.amandements[0].file = await [];
    }

    if(cat == 'flowchart'){
      this.flowcharts = await [];
    }

    if(cat == 'form'){
      this.formulirs = await [];
    }

    if(cat == 'amandement_form'){
      this.amandement_form = await [];
    }

    if(cat == 'history'){
      this.histories = await [];
    }
   

  }

  async removeOtherDocument(i, cat)
  {
    console.log(i)
    let a = await [];

    if(cat == 'amandement'){
        a = a.concat(this.amandements);
        console.log(a[i])
        if(a[i].file.length > 0){
            let z = {
              id : a[i].file[0].file.file.id
            }
            this._edocServ.removeFile(z).then(x => {
            })
        }
        this.amandements = await [];
        a = await a.filter((x, z) => {
            return z != i;
        });
        this.amandements = await this.amandements.concat(a);
    }

    if(cat == 'flowchart'){
      a = a.concat(this.flowcharts);
      console.log(a[i])
      if(a[i].file.length > 0){
          let z = {
            id : a[i].file[0].file.file.id
          }
          this._edocServ.removeFile(z).then(x => {
          })
      }
      this.flowcharts = await [];
      a = await a.filter((x, z) => {
          return z != i;
      });
      this.flowcharts = await this.flowcharts.concat(a);
    }

    if(cat == 'form'){
      a = a.concat(this.formulirs);
      console.log(a[i])
      if(a[i].file.length > 0){
          let z = {
            id : a[i].file[0].file.file.id
          }
          this._edocServ.removeFile(z).then(x => {
          })
      }
      this.formulirs = await [];
      a = await a.filter((x, z) => {
          return z != i;
      });
      this.formulirs = await this.formulirs.concat(a);
    }

    if(cat == 'amandement_form'){
      a = a.concat(this.amandement_form);
      console.log(a[i])
      if(a[i].file.length > 0){
          let z = {
            id : a[i].file[0].file.file.id
          }
          this._edocServ.removeFile(z).then(x => {
          })
      }
      this.amandement_form = await [];
      a = await a.filter((x, z) => {
          return z != i;
      });
      this.amandement_form = await this.amandement_form.concat(a);
    }

    if(cat == 'history'){
      a = a.concat(this.histories);
      console.log(a[i])
      if(a[i].file.length > 0){
          let z = {
            id : a[i].file[0].file.file.id
          }
          this._edocServ.removeFile(z).then(x => {
          })
      }
      this.histories = await [];
      a = await a.filter((x, z) => {
          return z != i;
      });
      this.histories = await this.histories.concat(a);
    }


  }

  

}
