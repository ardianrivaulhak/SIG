import { Component, OnInit, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { ModalPhotoComponent } from "../../modal/modal-photo/modal-photo.component";
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
import { ContractService } from "../../services/contract/contract.service";
import { url, urlApi } from 'app/main/url';
@Component({
  selector: 'app-modal-add-photo',
  templateUrl: './modal-add-photo.component.html',
  styleUrls: ['./modal-add-photo.component.scss']
})
export class ModalAddPhotoComponent implements OnInit {

  urlnow = url;
  dataPhoto = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalAddPhotoComponent>,
        private fb: FormBuilder, 
        private dialog: MatDialog,
        private _kontrakServ: ContractService,
    ) { 
        if(data){
            this.dataPhoto = this.dataPhoto.concat(data);
            console.log(this.dataPhoto);
          }
          this.dialogRef.backdropClick().subscribe(v => {
            this.closeModal()
          });
    }

    closeModal(){
        return this.dialogRef.close({
          a:"close"
        });
      }
    
      ngOnInit(): void {
      }

    
      picture(e){
        return `${this.urlnow}${e}`;
      }

}
