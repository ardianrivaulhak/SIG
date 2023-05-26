import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LodService } from '../lod.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-lod-det',
  templateUrl: './lod-det.component.html',
  styleUrls: ['./lod-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class LodDetComponent implements OnInit {
  
  lodForm: FormGroup;
  detaildata = [];
  idLod: any;
  hide = true;
  load = false;
  saving = true;
  active = [
    {value: 1, viewValue: 'Active'},
    {value: 0, viewValue: 'Not Active'},
  ];

  constructor(
    private _masterServ: LodService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) 
  { 
    this.idLod = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getdatadetail();
  }

  enableForm(){
    this.hide = false;
    // this.lodForm.get('kode_lod').enable();
    this.lodForm.get('nama_lod').enable();
    this.lodForm.get('ket_lod').enable();
  }

  disableForm(){
    this.hide = true;
    // this.lodForm.get('kode_lod').disable();
    this.lodForm.get('nama_lod').disable();
    this.lodForm.get('ket_lod').disable();
    this.lodForm.get('disable').enable();
  }

  saveForm(){
    // console.log(this.lodForm);
    this._masterServ.updateDataDetailLod(this.idLod, this.lodForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this._route.navigateByUrl('analystpro/lod');
        this.openSnackBar(message);
        this.load = false;
      },2000)
    })
  }

  deleteForm(){
    this._masterServ.deleteDataLod(this.idLod).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Deleted',
        action: 'Done'
      }
      setTimeout(()=>{
        this._route.navigateByUrl('analystpro/lod');
        this.openSnackBar(message);
        this.load = false;
      },2000)
    });
  }

  saveNewForm(){
    let value = this.lodForm.value;
    if(value.nama_lod.length > 0){
      this._masterServ.addDataLod(this.lodForm.value).then(g => {
        this.load = true;
        let message = {
          text: 'Data Succesfully Save',
          action: 'Done'
        }
        setTimeout(()=>{
          this.openSnackBar(message);
          this._route.navigateByUrl('analystpro/lod');
          this.load = false;
        },2000)
      });
    } else {
      this.saving = true;
    }
  }

  validation(ev){
    if(this.lodForm.value.nama_lod > 0) {
      this.saving = false;
    } else {
      this.saving = true;
    }
  }
  getdatadetail(){
    this._masterServ.getDataDetailLod(this.idLod)
    .then(x => this.detaildata = this.detaildata.concat(x))
    .then(()=> this.lodForm = this.createLabForm());
  }

  createLabForm(): FormGroup {
        return this._formBuild.group({
            nama_lod:  [{
              value: this.idLod !== 'add' ? this.detaildata[0].nama_lod : '',
              disabled: this.idLod !== 'add' ? true : false
            }, { validator: Validators.required }],
            ket_lod: [{
              value: this.idLod !== 'add' ? this.detaildata[0].ket_lod : '',
              disabled: this.idLod !== 'add' ? true : false
            }],
        },)
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }
}
