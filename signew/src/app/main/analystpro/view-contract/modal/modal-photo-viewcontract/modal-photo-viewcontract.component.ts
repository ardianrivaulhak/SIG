import { Component, OnInit, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  Form,
} from "@angular/forms";
import { SamplePhotoService } from '../../../services/sample/sample-photo.service';
import { ContractService } from "../../../services/contract/contract.service";
import { url, urlApi, urlImage } from 'app/main/url';
import { ModalPhotoComponent } from "../../../modal/modal-photo/modal-photo.component";
import { ModalAddPhotoComponent } from "app/main/analystpro/contract/modal-add-photo/modal-add-photo.component";
import * as global from 'app/main/global';
@Component({
  selector: 'app-modal-photo-viewcontract',
  templateUrl: './modal-photo-viewcontract.component.html',
  styleUrls: ['./modal-photo-viewcontract.component.scss']
})
export class ModalPhotoViewcontractComponent implements OnInit {

  idsample;
  samplename;
  nosample;
  photo = [];
  datareal = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalPhotoViewcontractComponent>,
        private fb: FormBuilder, 
        private dialog: MatDialog,
        private _samplePhotoServ: SamplePhotoService,
        private _kontrakServ: ContractService
  ) {
    if(data){
      this.idsample = data.id_sample;
      this.nosample = data.no_sample;
      this.samplename = data.samplename;
      this.getData();
    }
   }

  ngOnInit(): void {
  }


  getData(){
    this._samplePhotoServ.getData(this.idsample).then((x: any)=>{
      this.photo = [];
      if(x.length > 0){
        x.forEach(a => {
          this.photo = this.photo.concat({
            id: a.id,
            photo: `${url}${a.transaction_sample.kontrakuji.contract_no}/${a.transaction_sample.no_sample}/${a.photo}`
          })
          this.datareal = this.datareal.concat({
            id: a['id'],
            contract_no: a['transaction_sample'].kontrakuji.contract_no,
            no_sample: a.transaction_sample.no_sample,
            photo: a.photo,
          });
        })
        
    } else {
 
      this._kontrakServ.getSampleData(this.idsample).then(d => this.datareal = this.datareal.concat(d));
  }
})
  }

  opendetailphoto(v){
    console.log(v);
    let dialogCust = this.dialog.open(ModalAddPhotoComponent, {
      height: "auto",
      width: "500px",
      data: {
          data: v.photo
      }
  });
  dialogCust.afterClosed().subscribe(async (result) => {});
  }

    webcam() {

      
      const dialogRef = this.dialog.open(ModalPhotoComponent, { 
          data:{
                  id: this.photo.length + 1,
                  photo: null
              }
      });
      dialogRef.afterClosed().subscribe((result) => {
        let data = {
          idsample: this.idsample,
          photo: result.c[0],
          id: this.photo.length + 1
        }

        this._kontrakServ.savePhoto(data).then((x) => {
            this.photo = this.photo.concat({
              id: x['data']['id'],
              photo:  `${url}${x['data'].photo}`
            })
          })
        })
      }

  uploadGambar($event) : void { 
    this.readThis($event.target);      
  }

readThis(inputValue: any): void {
    // this.btnUpdate = true;
    // this.getDetailPhoto();
    
    var file:File = inputValue.files[0];

    var pattern = /image-*/;
    if (!file.type.match(pattern)) {
        alert('Upload Only Image');
        return;
    }
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => { 

            let data = {
                idsample: this.idsample,
                photo: myReader.result
            }
            console.log(data);
            this._kontrakServ.savePhoto(data).then((x) => {
                this.getData();
            }); 
        

    }
    myReader.readAsDataURL(file);
  }


  delete(ev){
    global.swalyousure("are you sure").then(x => {
      if(x.isConfirmed){
        this._kontrakServ.deletePhoto(ev,'asd').then((x) => {
          this.getData();
        })
        .then(() => global.swalsuccess('success','delete complete')); 
      }
    })
  }

}
