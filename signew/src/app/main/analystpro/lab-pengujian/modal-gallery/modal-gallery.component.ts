import { Component, OnInit, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LabPengujianService } from '../lab-pengujian.service';
import {
  trigger,
  transition,
  query,
  style,
  animate,
  group
} from '@angular/animations';
import * as myurl from 'app/main/url';

export interface User {
  employee_name: String,
  gender: String,
  id_bagian: number,
  id_sub_bagian: number,
  nik: String,
  photo: String,
  user_id: number
}
@Component({
  selector: 'app-modal-gallery',
  animations: [
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
  templateUrl: './modal-gallery.component.html',
  styleUrls: ['./modal-gallery.component.scss'] 
})


export class ModalGalleryComponent implements OnInit {

  dataLab: any;
  selectedIndex: number = 0;
  _images = [];
  dataGambar = [];
  galleryPhoto = [];

  constructor(
    private _masterServ: LabPengujianService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _route: Router,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<ModalGalleryComponent> 
  ) {
    if(data){
      console.log(data);
      this.getData(data.data);
    }
    this._dialogRef.backdropClick().subscribe(v => {
      this.closeModal()
    });
   }

  closeModal(){
    return this._dialogRef.close({
      
    });
  }

  ngOnInit(): void {
  }

  getData(v){
    this._masterServ.getDataPhoto(v).then(x => { 
        this.galleryPhoto = this.galleryPhoto.concat(x); 
        
        this.galleryPhoto.forEach( (xx, index) => {
          this.dataGambar = this.dataGambar.concat(xx.photo); 
        }); 
      })
    }
    
    get images() {
    this._images = this.dataGambar.concat();
    console.log(this._images);
    return [this._images[this.selectedIndex]];
  }

  previous() {
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
  }

  next() {
    this.selectedIndex = Math.min(this.selectedIndex + 1, this._images.length - 1);
  }

  picture(e){
    return this.dataGambar.length > 0 ? `${myurl.url}${this.galleryPhoto[0].transaction_sample.kontrakuji.contract_no}/${this.galleryPhoto[0].transaction_sample.no_sample}/${e}` : 'assets/images/backgrounds/unnamed.png';
  }

}
