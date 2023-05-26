import { Component, OnInit, Inject, enableProdMode, ViewEncapsulation  } from '@angular/core';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SampleUjiService } from '../sample-uji.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  trigger,
  transition,
  query,
  style,
  animate,
  group
} from '@angular/animations';
import { url } from "app/main/url";
import Swal from 'sweetalert2';
import { ModalPhotoViewcontractComponent } from "app/main/analystpro/view-contract/modal/modal-photo-viewcontract/modal-photo-viewcontract.component";
import { PageEvent } from "@angular/material/paginator";

@Component({ 
  selector: 'app-sample-uji-det',
  templateUrl: './sample-uji-det.component.html', 
  styleUrls: ['./sample-uji-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
  
})
export class SampleUjiDetComponent implements OnInit {
  
  pageEvent: PageEvent;
  selectedIndex: number = 0;
  datasampleBobot = [];
  datasample = [];
  dataGambar = [];
  sampleujiForm: FormGroup;
  displayedColumns: string[] = ['no', 'nama_lab', 'value' ];
  sampleujiData = [];
  idsample = '';
  datasent = {
    pages : 1,
    search : null,
    idsample : null,
    datafilter : null
  } 
  detailSample  = [];
  urls : any;
  load = false;
  loadingfirst = false;

  pages = 1
  total: number;
  from: number;
  to: number;  
  current_page : number;
  
  constructor(
    private _masterSampleujiServ: SampleUjiService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar, 
    private _dialogRef: MatDialogRef<SampleUjiDetComponent>,
    private _dialog : MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
      console.log(data)
      if(data){
        this.idsample = this.idsample.concat(data.id_sample);
        
      }
    }

    

  ngOnInit(): void {
    //this.getData();
   // this.getSampleDetail();
    //this.getCheck();
    this.firstIndex();
    this.datasent.idsample = this.idsample ;
   this.datasent.datafilter = this.data.data_filter
  }

  navigateToSection(ev){
      window.location.hash = '';
      window.location.hash = ev;
  }

  // getData(){
  //   // this._masterSampleujiServ.getDataSampleUjiDetail(this.data.id_sample).then(x => { 
  //   //     this.sampleujiData = this.sampleujiData.concat(Array.from(x['data']));
  //   //     console.log(this.sampleujiData)
  //   //     // this.sampleujiData = this.sampleujiData.filter(
  //   //     //   (v) => v.status  == null && v.id == this.idsample
  //   //     //   );
          
  //   //     //   this.sampleujiData.forEach(x=>{
  //   //     //     this.datasample = this.datasample.concat(Array.from(x['bobotsample']));
  //   //     //   })

  //   //     //   this.sampleujiData.forEach(x=>{ 
  //   //     //     x.images.forEach(z=>{
  //   //     //       this.dataGambar = this.dataGambar.concat(z.photo);
  //   //     //     }); 
  //   //     //   });
  //   //     // console.log(this.sampleujiData);
  //   //     // console.log(this.datasample);
       
        
  //   //   }) 
  //   //   .then(() => this.urls = url)
  //   //   .then(() =>console.log(this.sampleujiData))
  //   }

    // getCheck(){
    //   this._masterSampleujiServ.getDataSampleUjiCheck(this.data.id_sample).then(x => { 
    //       this.sampleujiData = this.sampleujiData.concat(Array.from(x['data']));
    //       console.log(this.sampleujiData)          
    //     }) 
    //   }
      
    
  closeModal(){
    return this._dialogRef.close({
        
    });
  }

  
  // getSampleDetail()
  // {
  //   let cek = {
  //     id_sample : this.idsample
  //   }

  //   console.log(cek)
  //   this._masterSampleujiServ.getSampleDetail(cek)
  //   .then(x => this.detailSample = this.detailSample.concat(x))
  //   .then(c => console.log(this.detailSample))
  // }

  createLabForm(): FormGroup {
        return this._formBuild.group({       
      sample_name :[{
          value: this.sampleujiData[0].sample_name
        }],
      no_sample :[{
          value: this.sampleujiData[0].no_sample
        }],
      contract_no :[{
          value: this.sampleujiData[0].kontrakuji.contract_no
        }],
      desc_kendali :[{
        value:  this.sampleujiData[0].kontrakuji.description_kendali[0].desc
      }],
      desc_prep :[{
        value:  this.sampleujiData[0].kontrakuji.description_preparation[0].desc
      }],
    })
  }

  saveForm()
  {
    Swal.fire({
      title: 'Approve Sample?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
  }).then((result) => {
      if (result.value) {
          this.load = true;
            this._masterSampleujiServ.approveOneSample(this.idsample); 
            let message = {
              text: 'Data Succesfully Approved',
              action: 'Done'
              }
            setTimeout( async ()=>{
              this.openSnackBar(message);
              this.sampleujiData = await [];
              this.datasample = await [];
              this.datasent.pages = await  this.datasent.pages + 1;
              await this.getDataSampleUji(); 
              this.load = false;
            },2000) 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Cancel Approve Data',
          'error'
        )
      }
  })
  }

  async getModalAddPhoto(v) {
    console.log(v)
    const dialogRef = await this._dialog.open(
        ModalPhotoViewcontractComponent,
        {
            height: "auto",
            width: "800px",
            panelClass: "parameter-modal",
            data: {
                samplename: v.sample_name,
                id_sample: v.id,
                no_sample: v.no_sample,
            },
        }
    );

    await dialogRef.afterClosed().subscribe(async (result) => {
        await console.log(result);
    });
}

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  async getDataSampleUji(){
    console.log(this.datasent)
    await this._masterSampleujiServ.getDatSampleUji(this.datasent).then(async x => { 
      this.sampleujiData = await  this.sampleujiData.concat(Array.from(x['data']));  
      console.log(this.sampleujiData)
      this.total = x["total"];
      this.current_page = x["current_page"] - 1;
      this.from = x["from"];
      this.to = x["per_page"];

      await  this.sampleujiData.forEach(x=>{
            this.datasample = this.datasample.concat(Array.from(x['bobotsample']));
      })
      
    })
    await console.log(this.sampleujiData)
  }

  async firstIndex(){
    this.sampleujiData = [];
    this.datasent.pages = await this.data.index + 1;
    await this.getDataSampleUji();
  }

  async paginated(f){
    console.log(f)
    this.sampleujiData = await [];
    this.datasample = await [];
    this.datasent.pages = await f.pageIndex + 1;
    await this.getDataSampleUji();
  }

}
