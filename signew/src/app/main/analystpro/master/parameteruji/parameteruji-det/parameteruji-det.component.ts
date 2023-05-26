import { Component, OnInit, ViewEncapsulation,  ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParameterujiService } from '../parameteruji.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatTable } from "@angular/material/table";
import * as global from 'app/main/global';

@Component({
  selector: 'app-parameteruji-det',
  templateUrl: './parameteruji-det.component.html',
  styleUrls: ['./parameteruji-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class ParameterujiDetComponent implements OnInit {

  displayedColumns: string[] = ['no','tgl',  'price', 'desc', 'user', 'status'];
  @ViewChild("table") MatTable: MatTable<any>;
  parameterForm: FormArray = this._formBuilder.array([]);
  parameterujiForm: FormGroup = this._formBuilder.group({
    name_id: new FormControl(),
    name_en: new FormControl(),  
    active: new FormControl(),
    lab_id: new FormControl(),
    parametertype_id: new FormControl(),  
    group_id: new FormControl(),
    harga: new FormControl(),
    desc: new FormControl(),
    parameter: this.parameterForm,
  });
  dataParameterType = [];
  dataAnalyst = [];
  datasend = {
    pages : 1,
    search : null
  }
  idParameteruji;
  dataLab = [];
  hide = true;
  detaildata = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _parameterUjiServ: ParameterujiService,
    private _actRoute: ActivatedRoute,
    private _route: Router
  ){

    this.idParameteruji = this._actRoute.snapshot.params['id'];

  }

  ngOnInit() :void {
    this.getdataparametertype();
    this.getDataAnalyst();
    this.getdatalab();
    if(this.idParameteruji !== 'add'){
      this.getdatadetail();
    }
  }

  async getdataparametertype(){
    await this._parameterUjiServ.getDataParameterTypeFull()
    .then(u => this.dataParameterType = this.dataParameterType.concat(u));
  }


  async getDataAnalyst(){
    this._parameterUjiServ.getDataAnalyst(this.datasend).then(x => {
      this.dataAnalyst = this.dataAnalyst.concat(x['data']);
    });
  }

  async getdatalab(){
    await this._parameterUjiServ.getDataLabFull()
    .then(x => this.dataLab = this.dataLab.concat(x));
  }

  disableForm(){
    this.hide = true;
    this.parameterujiForm.get('name_id').disable();
    this.parameterujiForm.get('name_en').disable();
    this.parameterujiForm.get('active').disable();
    this.parameterujiForm.get('lab_id').disable();
    this.parameterujiForm.get('parametertype_id').disable();
    this.parameterujiForm.get('group_id').disable();
    this.parameterujiForm.get('desc').disable();
  }

  enableForm(){
    this.hide = false;
    this.parameterujiForm.get('name_id').enable();
    this.parameterujiForm.get('name_en').enable();
    this.parameterujiForm.get('active').enable();
    this.parameterujiForm.get('lab_id').enable();
    this.parameterujiForm.get('parametertype_id').enable();
    this.parameterujiForm.get('group_id').enable();
    this.parameterujiForm.get('desc').disable();
  }

  async getdatadetail(){

    await this._parameterUjiServ.getDataParameterUjiDetail(this.idParameteruji).then((x:any) => {
      
      this.parameterujiForm.patchValue({
        name_id: x.name_id,
        name_en: x.name_en,  
        active: x.active,
        lab_id: x.lab.id,
        parametertype_id: x.mstr_laboratories_parametertype_id,  
        group_id: x.id_analystgroup
      })

      x.parameterprice.forEach((xx, i) => { 
          this.setValuePriceParam(xx);          
      });
    }); 
  }

  addListParameter(){
    this.addFormValuePrice();
  }

  deleteListParameter(){
    this.parameterForm.controls.splice((this.parameterForm.controls.length - 1),1);
    this.MatTable.renderRows();
  }

  async addFormValuePrice(){
    const parameterpriceFormat = await this._formBuilder.group({
      idPrice: [null],
      price: [null],
      status: [2],
      created_at: [{
        value: 'Now',
        disabled: true
      }],
      desc: [null],
      insert_user: [{
        value: '',
        disabled: true
      }] 
    });
    await this.parameterForm.push(parameterpriceFormat);
    await this.MatTable.renderRows();
  }

  async setValuePriceParam(v){
    const parameterpriceFormat = await this._formBuilder.group({
      idPrice: [v.id],
      price: [v.price],
      status: [v.status],
      created_at: [{
        value: v.updated_at ? v.updated_at : 'Default',
        disabled: true
      }],
      desc: [v.description ? v.description : '-'],
      insert_user: [{
        value: v.employee ? v.employee.employee_name : 'Default',
        disabled: true
      }] 
    });
    await this.parameterForm.push(parameterpriceFormat);
    await this.MatTable.renderRows();

  }


  setActive(v){
    return v.status == 1 ? this.unapproveprice(v) : this.approveprice(v);
  }

  choose(){
    global.swalyousure('Are you sure to save this data ?').then(x => {
      if(x.isConfirmed){
        return this.idParameteruji !== 'add' ? this.updatePrice() : this.saveprice();
      }
    })
    
  }

  saveprice(){
    // if(this.parameterujiForm.controls.harga.value){
      this._parameterUjiServ.addDataParameterUji(this.parameterujiForm.value).then(x => {
        global.swalsuccess("Success","Rerouting to front !!");
      }).then(() => this._route.navigateByUrl('analystpro/parameteruji'))
      .catch(e => global.swalerror('Oops, Data Cant be saved, Sorry !!'));
    // } else {
    //   global.swalerror('ada Data yang belum terisi');
    // }
    
  }

  updatePrice(){
    this._parameterUjiServ.updateParameterUji(this.parameterujiForm.value,this.idParameteruji).then(x => {
      global.swalsuccess("Success","Rerouting to front !!");
    }).then(() => this._route.navigateByUrl('analystpro/parameteruji'))
    .catch(e => global.swalerror('Oops, Data Cant be saved, Sorry !!'));
  }

  cancel(){
    this._route.navigateByUrl('analystpro/parameteruji');
  }

  approveprice(v){
    this._parameterUjiServ.approvedPrice({id: v.idPrice, status: 1}).then(x => {
      this.parameterForm.controls = [];
      this.getdatadetail();
    });
  }

  unapproveprice(v){
    this._parameterUjiServ.approvedPrice({id: v.idPrice, status: 0}).then(x => {
      this.parameterForm.controls = [];
      this.getdatadetail();
    });
  }

  deleteprice(v){
    console.log(v);
  }
}