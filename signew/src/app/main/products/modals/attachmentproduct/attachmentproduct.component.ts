import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef,MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as globals from "app/main/global";
import { ProductsService } from "../../products.service";
import { ModalPhotoComponent } from "app/main/analystpro/modal/modal-photo/modal-photo.component";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { CameraphotoComponent } from "../cameraphoto/cameraphoto.component";
import { url, urlApi } from "app/main/url";
import * as global from "app/main/global";

@Component({
  selector: 'app-attachmentproduct',
  templateUrl: './attachmentproduct.component.html',
  styleUrls: ['./attachmentproduct.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AttachmentproductComponent implements OnInit {


  fileUpload = this._fb.group({
    file: "",
    fileName: "",
    type: "",
});
id_contract: number;
dataProduct = [];
loadingupload = false;

  constructor(
    public dialogRef: MatDialogRef<AttachmentproductComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _contractServ: ContractService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _productServ: ProductsService,
    private _fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.id_contract = this.data.id_product_contract;
    this.getContractDetail(this.id_contract);
  }

  async getContractDetail(data) {
    this.loadingupload = await true;
    await this._productServ
        .getListPhotoProduct(data)
        .then((x) => (this.dataProduct = this.dataProduct.concat(x)));
    this.loadingupload = await false;
    await console.log(this.dataProduct)
}


  async uploadGambar(event) {
    if (event.target.files.length > 0) {
      const file = await event.target.files[0];
     console.log(file)
      await this.fileUpload.patchValue({
          file: file,
          fileName: file.name,
          type: "file",
      });
      await this.sendData();
  }
}

sendData() {
  const formData = new FormData();
  console.log(this.fileUpload.controls.file.value)
  formData.append("file", this.fileUpload.controls.file.value);
  console.log(formData)
  this._productServ
      .sendAttachmentFile(formData, this.id_contract)
      .then((x) => {
        console.log(x)
        this.dataProduct = [];
        this.getContractDetail(this.id_contract);
      });
}

  openmodalphoto() {
    const dialogRef = this.dialog.open(ModalPhotoComponent, {});
    dialogRef.afterClosed().subscribe((result) => {});
  }

  webcam() {
    const dialogRef = this.dialog.open(CameraphotoComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
        this._productServ
            .sendImageAttachment({
                id_contract: this.id_contract,
                contract_no: this.data.contract_number,
                photo: result.c[0],
            })
            .then((x) => {
              this.dataProduct = [];
              this.getContractDetail(this.id_contract);
            });
    });
  }

  // async Download(v) {
  //   console.log(v)
  //   this._productServ.downloadFiles(v).then((x) => console.log(x));
  // }

  // setPhoto(val) {
  //   console.log(val)
  //   return `${url}${this.data.contract_number}/attachment/${val.filename}`;
  // }

  opendetailphoto(v) {
    console.log(this.data)
    let urla = `${url}/${this.data.contract_product.contract_number}/attachment/${v.filename}`;
    window.open(urla, "_blank");
  }

  deleteAttachment(v) {
    console.log(v)
    global.swalyousure("Delete").then((x) => {
        if (x.isConfirmed) {
            this._productServ
                .deleteFileAttachment(v.id_product_image)
                .then((x) =>
                    global.swalsuccess("success", "delete success")
                )
                .then(() => {
                    this.dataProduct = [];
                    this.getContractDetail(this.id_contract);
                })
                .catch((e) => global.swalerror("Error At Database"));
        }
    });
}

closeModal(){
  return this.dialogRef.close({
    
  });
}

}
