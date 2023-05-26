import { Component, OnInit, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { PaketPkmService } from '../paket-pkm.service';

@Component({
  selector: 'app-modal-paket-pkm',
  templateUrl: './modal-paket-pkm.component.html',
  styleUrls: ['./modal-paket-pkm.component.scss'],
  animations   : fuseAnimations 
})
export class ModalPaketPkmComponent implements OnInit {
  
  datavalue = [];

  constructor( 
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ModalPaketPkmComponent>,
    private paketPkmServ: PaketPkmService
  ) {
    if (data) {
      this.getDataDetail(data.value);
    }
    this.dialogRef.backdropClick().subscribe((v) => {
      // this.saveFrom();
    });
   }

  ngOnInit(): void {
    
  }


  saveFrom(){
    return this.dialogRef.close();
  }

  getDataDetail(val){
    this.paketPkmServ.getDataDetailpaketpkm(val).then(x => {
      this.datavalue = this.datavalue.concat(x);
    })
  }

  changingvalue(v) {
    return v.includes("^")
        ? `${v.split("^")[0]}${v
              .split("^")[1]
              .sup()}`
        : `${v}`;
}


}
