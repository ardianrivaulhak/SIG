import { Component, OnInit, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { StandartService } from '../../../master/standart/standart.service';
import { LodService } from '../../../master/lod/lod.service';
import { UnitService } from '../../unit/unit.service';
import { MetodeService } from '../../metode/metode.service';
import { LabService } from '../../lab/lab.service';

@Component({
  selector: 'app-paketparameter-modal',
  templateUrl: './paketparameter-modal.component.html',
  styleUrls: ['./paketparameter-modal.component.scss']
})
export class PaketparameterModalComponent implements OnInit {

  loading = false;
  dataunit = [];
  dataMetode = [];
  datalab = [];
  datastandart = [];
  datalod= [];

  datasendlod = {
    pages: 1,
    search: null
  }
  datasendunit = {
    pages: 1,
    search: null
  }
  datasendmetode = {
    pages: 1,
    search: null
  }
  datasendstandart ={
    pages: 1,
    search: null
  }
  datasendlab ={
    pages: 1,
    search: null
  }
  detail = true;

  dataSource: any; 
  SubPaketForm: FormGroup; 
  paketparameter: any;
  idparameteruji: any;

  constructor( 
    private _standartServ: StandartService, 
    private _unitServ: UnitService,
    private _labServ: LabService,
    private _metodeServ: MetodeService,
    private _lodServ: LodService,
    private _formBuild: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<PaketparameterModalComponent>
  ) {
    if (data) {
      this.paketparameter = data.idpaketparameter;
      this.idparameteruji = data.idparameteruji;
      this.detail = data.detail;
      this.dataSource = data.subpacket;
      console.log(this.dataSource);
      this.SubPaketForm = this.mouForm();
      
    }
    this.dialogRef.backdropClick().subscribe((v) => {
      // this.saveFrom();

    });
   }

  ngOnInit(): void {
    this.getDataUnit();
    this.getDataMetode();
    this.getDataLab();
    this.getDataStandart(); 
    this.getDataLod();   
  }


  async getDataUnit(){
    await this._unitServ.getDataUnit(this.datasendunit).then(x => {
      this.dataunit = this.dataunit.concat(x['data']);
      console.log(this.dataunit);
    })
  }

  getDataLod(){
    this._lodServ.getDataLod(this.datasendlod).then(x => {
      this.datalod = this.datalod.concat(Array.from(x['data'])); 
      console.log(this.datalod);
    })
  }

  async getDataMetode(){
    await this._metodeServ.getDataMetode(this.datasendmetode).then(x => {
      this.dataMetode = this.dataMetode.concat(x['data']);
      console.log(this.dataMetode);
    })
  }

  getDataLab(){
    this._labServ.getDataLab(this.datasendlab).then(x => {
      this.datalab = this.datalab.concat(Array.from(x['data'])); 
      console.log(this.datalab);
    })
  }

  getDataStandart(){
    this._standartServ.getDataStandart(this.datasendstandart).then(x => {
      this.datastandart = this.datastandart.concat(Array.from(x['data'])); 
      console.log(this.datastandart);
    })
  }

  onScrollToEnd(e) {
    this.loading = true;
    if (e === "metode") {
      this.datasendmetode.pages = this.datasendmetode.pages + 1;
      this.getDataMetode();
    }

    if (e === "lod") {
        this.datasendlod.pages = this.datasendlod.pages + 1;
        this.getDataLod();
    }

    if (e === "lab") {
        this.datasendlab.pages = this.datasendlab.pages + 1;
        this.getDataLab();
    }
    
    if(e === 'standart'){
      this.datasendstandart.pages = this.datasendstandart.pages + 1;
      this.getDataStandart();
    } 

    if(e === 'unit') {
      this.datasendunit.pages = this.datasendunit.pages + 1;
      this.getDataUnit();
    }
    setTimeout(() => {
        this.loading = false;
    }, 200);
  }
  
  mouForm(){

    if(this.paketparameter === 'add'){ 
      return this._formBuild.group({
          id_lod:  [{
            value:  this.paketparameter === 'add' ? this.dataSource.id_lod : '',
            disabled: this.detail === false ? true : false
          }], 
          id_lab:  [{
              value:  this.paketparameter === 'add' ? this.dataSource.id_lab : '',
              disabled: this.detail === false  ? true : false
            }],     
          id_standart:  [{
              value:  this.paketparameter === 'add' ? this.dataSource.id_standart : '',
              disabled: this.detail === false ? true : false
            }],   
          id_metode:  [{
              value:  this.paketparameter === 'add' ? this.dataSource.id_metode : '',
              disabled: this.detail === false ? true : false
            }],    
          id_unit:  [{
              value:  this.paketparameter === 'add' ? this.dataSource.id_unit : '',
              disabled: this.detail === false ? true : false
            }],     
          idparameteruji:  [{
              value:  this.paketparameter === 'add' ? this.idparameteruji : this.idparameteruji,
              disabled: this.detail === false ? true : false
            }], 
      });  
    }
    
    if(this.paketparameter !== 'add'){ 
      return this._formBuild.group({
          id_lod:  [{
            value:  this.paketparameter !== 'add' ? this.dataSource.id_lod : '',
            disabled: this.detail === false ? true : false
          }], 
          id_lab:  [{
              value:  this.paketparameter !== 'add' ? this.dataSource.id_lab : '',
              disabled: this.detail === false  ? true : false
            }],     
          id_standart:  [{
              value:  this.paketparameter !== 'add' ? this.dataSource.id_standart : '',
              disabled: this.detail === false ? true : false
            }],   
          id_metode:  [{
              value:  this.paketparameter !== 'add' ? this.dataSource.id_metode : '',
              disabled: this.detail === false ? true : false
            }],    
          id_unit:  [{
              value:  this.paketparameter !== 'add' ? this.dataSource.id_unit : '',
              disabled: this.detail === false ? true : false
            }],     
          idparameteruji:  [{
              value:  this.paketparameter !== 'add' ? this.idparameteruji : this.idparameteruji,
              disabled: this.detail === false ? true : false
            }], 
      });  
    }
  }

  saveFrom(){
    console.log(this.SubPaketForm.value);

    return this.dialogRef.close({
      b: "close",
      c: this.SubPaketForm.value,
    });
  }


}
