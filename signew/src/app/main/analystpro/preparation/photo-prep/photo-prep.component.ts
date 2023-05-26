import { PreparationService } from '../preparation.service';
import { Component, OnInit, Inject, enableProdMode, ViewEncapsulation, Optional } from '@angular/core';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  import { Url } from 'url';
  import { url } from "app/main/url";

@Component({
  selector: 'app-photo-prep',
  templateUrl: './photo-prep.component.html',
  styleUrls: ['./photo-prep.component.scss'],
  animations   : [
    trigger('slider', [
      transition(":increment", group([
        query(':enter', [
          style({
            left: '100%'
          }),
          animate('0.5s ease-out', style('*'))
        ]),
        query(':leave', [
          animate('0.5s ease-out', style({
            left: '-100%'
          }))
        ])
      ])),
      transition(":decrement", group([
        query(':enter', [
          style({
            left: '-100%'
          }),
          animate('0.5s ease-out', style('*'))
        ]),
        query(':leave', [
          animate('0.5s ease-out', style({
            left: '100%'
          }))
        ])
      ])),
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class PhotoPrepComponent implements OnInit {

  showWebcam = true;
  allowCameraSwitch = true;
  multipleWebcamsAvailable = false;
  deviceId: string;
  urls : any;
 
  dataGambar = [];
  photoData = [];
  selectedIndex: number = 0;
  datasent = {
    idsample: this.id_sample
  }
  photoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PhotoPrepComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public id_sample: any,
    private _prepService: PreparationService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
      this.getData();
  }

  getData(){
    console.log(this.datasent)
    this._prepService.getDataPhotoSample(this.datasent)
    .then(x => { this.photoData = this.photoData.concat(x); 
    
    })
    .then(()=> this.photoForm = this.createForm())
    .then(() => this.urls = url)
    .then(() =>console.log(this.urls))
  }

  get images() {
    this.dataGambar = this.photoData.concat();
    return [this.dataGambar[this.selectedIndex]];
  }

  previous() {
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
  }

  next() {
    this.selectedIndex = Math.min(this.selectedIndex + 1, this.dataGambar.length - 1);
  }

  createForm(): FormGroup {
    return this._formBuild.group({
      photo : [this.photoData[0] == null  ? '' : this.photoData[0].desc,{ validator: Validators.required }]
    })
  }

  uploadGambar($event,) : void {
    this.readThis($event.target); 
    console.log($event.target);
  }

  readThis(inputValue: any): void {
    let file:File = inputValue.files[0];
    let pattern = /image-*/;
    if (!file.type.match(pattern)) {
        alert('Upload Only Image');
        return;
    }
    let myReader:FileReader = new FileReader();
    myReader.onloadend = (e) => { 
      console.log(this.photoForm.controls.photo.value);
        this.photoForm.controls.photo.value.photo = myReader.result;       
    }
    myReader.readAsDataURL(file);
  }

  
  closeModal(){
    return this.dialogRef.close({
      
    });
  }

}
