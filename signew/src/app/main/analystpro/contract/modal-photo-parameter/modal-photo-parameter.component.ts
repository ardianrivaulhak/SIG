import { Component, OnInit, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { ModalAddPhotoComponent } from "../modal-add-photo/modal-add-photo.component";
import { SamplePhotoService } from 'app/main/analystpro/services/sample/sample-photo.service';
import { url } from 'app/main/url';
import * as global from 'app/main/global';
@Component({
  selector: 'app-modal-photo-parameter',
  templateUrl: './modal-photo-parameter.component.html',
  styleUrls: ['./modal-photo-parameter.component.scss']
})
export class ModalPhotoParameterComponent implements OnInit {
  urlnow = url;
  displayedColumns: string[] = ["no", "nosample", "samplename", "action"];
  dataSample = [];
  pageindex: number; 
  idContrack; 
  status;
  load = false;
  checkPhoto = false;
  contract_id;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalPhotoParameterComponent>,
        private fb: FormBuilder, 
        private dialog: MatDialog,
        private _kontrakServ: ContractService,
        private _route: Router,
        private _snackBar: MatSnackBar,
        private _sampleFotoServ: SamplePhotoService
  ) {
    if (data) {
      console.log(data);
      this.status = data.status;
      this.contract_id = data;
      this.getSamplePhoto(data);
      // data.sample.forEach( x => {
      //   this.dataSample = this.dataSample.concat({
      //     id: x.id,
      //     id_contract: x.id_contract,
      //     no_sample: x.no_sample,
      //     sample_name: x.sample_name,
      //     detailPhoto: [],
      //     photo : [] 
      //   });  
      // });

    this.dialogRef.backdropClick().subscribe((v) => { 
      // this.save();
    });
    }
  }

  addfoto(i){
    this.dataSample[i].photo = this.dataSample[i].photo.concat({
      id: this.dataSample[i].photo.length + 1,
      photo: null
    })
  }

  deletePhoto(v, i, g){
    console.log(v);
    global.swalyousure("will delete photo permanently").then(x => {
      if(x.isConfirmed){
        this._kontrakServ.deletePhoto(v.id, g).then(async xi => {
          await global.swalsuccess('success','delete success');
          this.dataSample[g].photo = await this.dataSample[g].photo.filter(h => h.photo !== this.dataSample[g].photo[i].photo);
        })
      }
    })
  }

  openmodalphoto(v, i, g) {

    const dialogRef = this.dialog.open(ModalPhotoComponent, { 
        data:{
                contract_no: this.dataSample[g].id_contract,
                no_sample: this.dataSample[g].no_sample,
                foto: v.photo ? v.photo : null,
                idphoto: v.id
            }
    });
    dialogRef.afterClosed().subscribe((result) => {
        this.checkPhoto = false;
        let data = {
            idsample: this.dataSample[g].id,
            photo: result.c[0],
            id: result
        }
        this._kontrakServ.savePhoto(data).then((x) => {
          let indexPhoto = this.dataSample[g].photo.findIndex(zz => zz.id == result.d);
          this.dataSample[g].photo[indexPhoto].id = x['data'] ? x['data']['id'] : this.dataSample[g].photo[indexPhoto].id;
          this.dataSample[g].photo[indexPhoto].photo = x['data'] ? x['data']['photo'] : null;
        }).then(() => {
          this.checkPhoto = true
        }); 
        
    });
} 

uploadGambar($event, id, g) : void { 
    this.readThis($event.target,id, g); 
}

setFoto(e,o){
  if(o.transactionsample){
    return `${this.urlnow}/${o.transaction_sample.kontrakuji.contract_no}/${o.transaction_sample.no_sample}/${o.photo}`;
  } else {
  return `${this.urlnow}/${o.photo}`;
  }
}

openseephoto(o,i,z) {
  let dialogCust = this.dialog.open(ModalAddPhotoComponent, {
      height: "auto",
      width: "500px",
      data: {
          data: o,
          contract_no: this.dataSample[z].contract_no,
          no_sample: this.dataSample[z].no_sample
      }
  });
  dialogCust.afterClosed().subscribe(async (result) => {});
}

readThis(inputValue: any, i, g): void {

    var file:File = inputValue.files[0];

    var pattern = /image-*/;
    if (!file.type.match(pattern)) {
        alert('Upload Only Image');
        return;
    }
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => { 
        this.dataSample[g].photo[i].photo = myReader.result;


            let data = {
                idsample: this.dataSample[g].id,
                id: i,
                photo: myReader.result
            }
            console.log(data);
            this._kontrakServ.savePhoto(data).then((x) => {
                console.log(x); 
            }); 
        

    }
    myReader.readAsDataURL(file);
  }
 
  close(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will Save this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save!',
      cancelButtonText: 'No, Cancel It'
    }).then((result) => {
      if (result.value) {   
          this.load = true;
          let message = {
            text: 'Succesfully Upload Photo',
            action: 'Done'
          }

          setTimeout(()=>{
            this.openSnackBar(message);
            // this._route.navigateByUrl('analystpro/contract'); 
            this.load = false;
          },2000) 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })  
  }

  async getSamplePhoto(data){
    await this._kontrakServ.samplePhotoContract(data).then((x:any) => {
      x.forEach(h => {
        this.dataSample = this.dataSample.concat({
          id: h.id,
          no_sample: h.no_sample,
          sample_name: h.sample_name,
          photo: h.photo
        })
        
      })
    });

    await console.log(this.dataSample);
    // await data.sample.forEach(x => {
    //   this.dataSample = this.dataSample.concat({
    //     id: x.id,
    //     id_contract: x.id_contract,
    //     contract_no: data.contract_no,
    //     no_sample: x.no_sample,
    //     sample_name: x.sample_name,
    //     photo : []
    //   })
    //   this._sampleFotoServ.getData(x.id).then(xy => {
    //     if(xy['length'] > 0) {
    //       let a = [];
    //       a = a.concat(xy);
    //       let y = this.dataSample.findIndex(z => z.id == xy[0].id_sample);
    //       this.dataSample[y].photo = this.dataSample[y].photo.concat(xy);
    //     }
    //     console.log(this.dataSample);
    //     this.checkPhoto = true;
    //   });
    // })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  ngOnInit(): void {
  }

  paginated(ev) {
    this.pageindex = ev.pageIndex;
    if (ev.pageIndex > 0) {
        console.log(ev.pageIndex * 5);
    } 
  } 

  async openModalParameter(v, i) {
    console.log(v);   
     
            const dialogRef = await this.dialog.open(ModalAddPhotoComponent, {
            height: "auto",
            width: "600px",
            disableClose: true,
            panelClass:'parameter-modal',
            data: {   
                  idContrack: this.idContrack,  
                  no_sample: v.nosample,
                  sample: this.dataSample[i],
                  samplename: v.samplename, 
                  status: this.status
              },
            });
            await dialogRef.afterClosed().subscribe(async (result) => {
              await console.log(result);
              this.dataSample[i].photo.findIndex(zz => zz.id) 
            });  
  }

  async save(){
    console.log(this.dataSample);
    return this.dialogRef.close({
      b: "close",  
      status: "edit",
      c: this.dataSample,
    });
  }

}
