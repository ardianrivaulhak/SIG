import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaketujiService } from '../paketuji.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { StandartService } from '../../../master/standart/standart.service';
import { LodService } from '../../../master/lod/lod.service';
import { UnitService } from '../../unit/unit.service';
import { MetodeService } from '../../metode/metode.service';

@Component({
  selector: 'app-paketuji-det',
  templateUrl: './paketuji-det.component.html',
  styleUrls: ['./paketuji-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PaketujiDetComponent implements OnInit {


  //unit

  dataunit = [];
  datasendunit = {
    pages: 1,
    search: null
  }

  //end unit


  //standart

  datastandart = [];
  datasendstandart = {
    pages: 1,
    search: null
  }

  //end standart


  //lod

  datalod = [];
  datasendlod = {
    pages: 1,
    search: null
  }

  //end lod


  //metode

  datametode = [];
  datasendmetode = {
    pages: 1,
    search: null
  }

  //end metode

  paketujiForm: FormGroup;
  detaildata = [];
  idpaketuji: any;
  hide = true;
  load = false;
  loading = false;
  saving = false;
  disc = [
    {value: 1, viewValue: 'Yes'},
    {value: 0, viewValue: 'No'},
  ];

  constructor(
    private _masterServ: PaketujiService,
    private _standartServ: StandartService,
    private _lodServ: LodService,
    private _metodeServ: MetodeService,
    private _unitServ: UnitService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) { 
    this.idpaketuji = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getdatadetail();
  }

  enableForm(){
    this.hide = false;
    this.paketujiForm.get('kode_paketuji').enable();
    this.paketujiForm.get('nama_paketuji').enable();
    this.paketujiForm.get('price_is').enable();
    this.paketujiForm.get('price_id').enable();
    this.paketujiForm.get('price_it').enable();
    this.paketujiForm.get('price_ie').enable();
    this.paketujiForm.get('description').enable();
    this.paketujiForm.get('unit').enable();
    this.paketujiForm.get('standart').enable();
    this.paketujiForm.get('metode').enable();
    this.paketujiForm.get('lod').enable();
    this.paketujiForm.get('discount').enable();
    this.getDataLod();
    this.getDataMetode();
    this.getDataStandart();
    this.getDataUnit();

  }

  disableForm(){
    this.hide = true;
    this.paketujiForm.get('kode_paketuji').disable();
    this.paketujiForm.get('nama_paketuji').disable();
    this.paketujiForm.get('price_is').disable();
    this.paketujiForm.get('price_id').disable();
    this.paketujiForm.get('price_it').disable();
    this.paketujiForm.get('price_ie').disable();
    this.paketujiForm.get('description').disable();
    this.paketujiForm.get('discount').disable();
    this.paketujiForm.get('disable').enable();
    this.paketujiForm.get('unit').enable();
    this.paketujiForm.get('standart').enable();
    this.paketujiForm.get('metode').enable();
    this.paketujiForm.get('lod').enable();
  }

  saveForm(){
    // console.log(this.paketujiForm);
    this._masterServ.updateDataPaketuji(this.idpaketuji, this.paketujiForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/paketuji');

        this.load = false;
      },2000)
    })
  }

  deleteForm(){
    this._masterServ.deleteDataPaketUji(this.idpaketuji).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Deleted',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this.load = false;
        this._route.navigateByUrl('analystpro/paketuji');

      },2000)
    });
  }

  saveNewForm(){
    this._masterServ.addDataPaketuji(this.paketujiForm.value).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Save',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this.load = false;
        this._route.navigateByUrl('analystpro/paketuji');
      },2000)
    });
  }

  getDataLod(){
    this._lodServ.getDataLod(this.datasendlod)
    .then(x => this.datalod =this.datalod.concat(x['data']))
    .then(()=> this.datalod = this.uniq(this.datalod, it => it.id));
  }

  getDataUnit(){
    this._unitServ.getDataUnit(this.datasendunit)
    .then(x => this.dataunit = this.dataunit.concat(x['data']))
    .then(()=> this.dataunit = this.uniq(this.dataunit, it => it.id));
  }

  getDataStandart(){
    this._standartServ.getDataStandart(this.datasendstandart)
    .then(x => this.datastandart = this.datastandart.concat(x['data']))
    .then(()=> this.datastandart = this.uniq(this.datastandart, it => it.id));
  }

  getDataMetode(){
    this._metodeServ.getDataMetode(this.datasendmetode)
    .then(x => this.datametode = this.datametode.concat(x['data']))
    .then(()=> this.datametode = this.uniq(this.datametode, it => it.id));

  }

  getdatadetail(){
    this._masterServ.getDataDetailPaketuji(this.idpaketuji)
    .then(async x => {
      this.detaildata = await this.detaildata.concat(x);
      if(this.detaildata.length > 0){
        let dd = this.detaildata[0];
        this.datalod = await this.datalod.concat(dd.lod);
        this.datastandart = await this.datastandart.concat(dd.standart);
        this.datametode = await this.datametode.concat(dd.metode);
        this.dataunit = await this.dataunit.concat(dd.unit);
      } else {
        await this.getDataLod();
        await this.getDataMetode();
        await this.getDataStandart();
        await this.getDataUnit();
      }
    })
    .then(()=> this.paketujiForm = this.createLabForm());
  }

  uniq(data,key) {
    return [
      ...new Map(
        data.map(x => [key(x),x])
      ).values()
    ]
   }

  createLabForm(): FormGroup {
    console.log(this.detaildata);
    return this._formBuild.group({
        kode_paketuji:  [{
          value: this.idpaketuji !== 'add' ? this.detaildata[0].kode_paketuji : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }, { validator: Validators.required }],
        nama_paketuji: [{
          value: this.idpaketuji !== 'add' ? this.detaildata[0].nama_paketuji : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }, { validator: Validators.required }],
        price_is: [{
          value: this.idpaketuji !== 'add' ? this.detaildata[0].price_is : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }, { validator: Validators.required }],
        price_id: [{
          value: this.idpaketuji !== 'add' ? this.detaildata[0].price_id : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }],
        price_it:[{
          value:  this.idpaketuji !== 'add' ? this.detaildata[0].price_it : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }],
        price_ie: [{
          value:  this.idpaketuji !== 'add' ? this.detaildata[0].price_ie : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }],
        unit: [{
          value:  this.idpaketuji !== 'add' ? this.detaildata[0].unit.id : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }],
        standart: [{
          value:  this.idpaketuji !== 'add' ? this.detaildata[0].standart.id : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }],
        metode: [{
          value:  this.idpaketuji !== 'add' ? this.detaildata[0].metode.id : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }],
        lod: [{
          value:  this.idpaketuji !== 'add' ? this.detaildata[0].lod.id : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }],
        description: [{
          value:  this.idpaketuji !== 'add' ? this.detaildata[0].description : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }],
        discount:[{
          value: this.idpaketuji !== 'add' ? this.detaildata[0].discount : '',
          disabled: this.idpaketuji !== 'add' ? true : false
        }],
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  // ng-select activity

  getValData(ev,identifier){
    if(identifier === 'lod'){
      console.log(ev); 
    } else if (identifier === 'standart'){
      console.log(ev);
    } else if (identifier === 'unit'){
      console.log(ev);
    } else {
      console.log(ev);
      // this.paketujichoose = this.paketujichoose.concat(ev);
      // this.paketparameterchoose = this.paketparameterchoose.filter(x => x);
      // console.log(this.paketujichoose);
    }  
  }


  onScrollToEnd(e) {
    this.loading = true;

    if (e === "lod") {
        this.datasendlod.pages = this.datasendlod.pages + 1;
        this.getDataLod();
    }
    
    else if(e === 'standart'){
      this.datasendstandart.pages = this.datasendstandart.pages + 1;
      this.getDataStandart();
    }

    // if(e === 'paketuji'){
    //   this.datasend.pages = this.datasend.pages + 1;
    //   this.getPaketuji();
    // }

    else {
      this.datasendunit.pages = this.datasendunit.pages + 1;
      this.getDataUnit();
    }
    setTimeout(() => {
        this.loading = false;
    }, 200);
}

onSearchi(ev, identifier) {

    if (identifier === "lod") {
        this.datasendlod.search = ev.term;
        this.datasendlod.pages = 1;
        this.datalod = [];
        this.getDataLod();
    } else if (identifier == 'standart'){
      this.datasendstandart.search = ev.term;
      this.datasendstandart.pages = 1;
      this.datastandart = [];
      this.getDataStandart();
    } else if (identifier == 'unit') {
      this.datasendunit.search = ev.term;
      this.datasendunit.pages = 1;
      this.dataunit = [];
      this.getDataUnit();
    }
}

resetAll(ev) {
    if (ev === "lod") {
        this.datasendlod.search = null;
        this.datasendlod.pages = 1;
        this.datalod = [];
        this.getDataLod();
    } else if (ev === 'standart'){
        this.datasendstandart.search = null;
        this.datasendstandart.pages = 1;
        this.datastandart = [];
        this.getDataStandart();
    } else if (ev === 'unit'){
      this.datasendunit.search = null;
      this.datasendunit.pages = 1;
      this.dataunit = [];
      this.getDataUnit();
    }
    // } else if (ev === 'paketuji'){
    //     this.datasend.search = null;
    //     this.datasend.pages = 1;
    //     this.paketujiData = [];
    //     this.getPaketuji();
    // } else {
      
    // }
}

  // end activity

}
