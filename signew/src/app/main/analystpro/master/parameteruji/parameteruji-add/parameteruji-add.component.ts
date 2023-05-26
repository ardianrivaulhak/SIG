import { Component, OnInit, ViewEncapsulation } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParameterujiService } from '../parameteruji.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-parameteruji-add',
  templateUrl: './parameteruji-add.component.html',
  styleUrls: ['./parameteruji-add.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ParameterujiAddComponent implements OnInit {

  detaildata = [];
  dataLab = [];
  dataParameterType = [];

  parameterujiForm: FormGroup;
  idParameteruji: any;
  hide = true;
  load = false;
  saving = false;
  active = [
    {value: 1, viewValue: 'Active'},
    {value: 0, viewValue: 'Not Active'},
  ];

  constructor(
    private _parameterujiServ: ParameterujiService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
    // private _fuseNav: FuseNavigationService
  ) { 
    this.idParameteruji = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
  }

  
  enableForm(){
    this.hide = false;
    this.parameterujiForm.get('name_id').enable();
    this.parameterujiForm.get('name_en').enable();
    this.parameterujiForm.get('n').enable();
    this.parameterujiForm.get('m').enable();
    this.parameterujiForm.get('mm').enable();
    this.parameterujiForm.get('description').enable();
    this.parameterujiForm.get('active').enable();
    this.parameterujiForm.get('mstr_laboratories_laboratory_id').enable();
    this.parameterujiForm.get('mstr_laboratories_parametertype_id').enable();
    this.parameterujiForm.get('hris_employee_id').enable();
  }

  disableForm(){
    this.hide = true;
    this.parameterujiForm.get('name_id').disable();
    this.parameterujiForm.get('name_en').disable();
    this.parameterujiForm.get('n').disable();
    this.parameterujiForm.get('m').disable();
    this.parameterujiForm.get('mm').disable();
    this.parameterujiForm.get('description').disable();
    this.parameterujiForm.get('active').disable();
    this.parameterujiForm.get('mstr_laboratories_laboratory_id').disable();
    this.parameterujiForm.get('mstr_laboratories_parametertype_id').disable();
    this.parameterujiForm.get('hris_employee_id').disable();
    this.parameterujiForm.get('disable').enable();
  }

  // saveForm(){
  //   console.log(this.parameterujiForm);
  //   this._parameterujiServ.updateDataParameterUji(this.idParameteruji, this.parameterujiForm.value).then(y => {
  //     this.load = true;
  //     let message = {
  //       text: 'Data Succesfully Updated',
  //       action: 'Done'
  //     }
  //     setTimeout(()=>{
  //       this.openSnackBar(message);
  //       this._route.navigateByUrl('analystpro/parameteruji');
  //       this.load = false;
  //     },2000)
  //   })
  // }

  deleteForm(){
    this._parameterujiServ.deleteDataParameterUji(this.idParameteruji).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Deleted',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/parameteruji');
        this.load = false;
      },2000)
    });
  }

  saveNewForm(){
    this._parameterujiServ.addDataParameterUji(this.parameterujiForm.value).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Save',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/parameteruji');
        this.load = false;
      },2000)
    });
  }

  getdatadetail(){
    this._parameterujiServ.getDataParameterUjiDetail(this.idParameteruji)
    .then(x => this.detaildata = this.detaildata.concat(x))
    .then(()=> this.parameterujiForm = this.createLabForm());
  }

  getdatalab(){
    this._parameterujiServ.getDataLabFull()
    .then(x => this.dataLab = this.dataLab.concat(x));
  }

  getdataparametertype(){
    this._parameterujiServ.getDataParameterTypeFull()
    .then(u => this.dataParameterType = this.dataParameterType.concat(u));
  }

  createLabForm(): FormGroup {
        return this._formBuild.group({
            name_id: [{
              value: this.idParameteruji !== 'add' ? this.detaildata[0].name_id : '',
              disabled: this.idParameteruji !== 'add' ? true : false
            },{ validator: Validators.required }],
            name_en: [{
              value: this.idParameteruji !== 'add' ? this.detaildata[0].name_en : '',
              disabled: this.idParameteruji !== 'add' ? true : false
            },{ validator: Validators.required }],
            n: [{
              value: this.idParameteruji !== 'add' ? this.detaildata[0].n : '',
              disabled: this.idParameteruji !== 'add' ? true : false
            },{ validator: Validators.required }],
            m: [{
              value: this.idParameteruji !== 'add' ? this.detaildata[0].m : '',
              disabled: this.idParameteruji !== 'add' ? true : false
            },{ validator: Validators.required }],
            mm: [{
              value: this.idParameteruji !== 'add' ? this.detaildata[0].mm : '',
              disabled: this.idParameteruji !== 'add' ? true : false
            },{ validator: Validators.required }],
            description: [{
              value: this.idParameteruji !== 'add' ? this.detaildata[0].description : '',
              disabled: this.idParameteruji !== 'add' ? true : false
            },{ validator: Validators.required }],
            active: [{
              value: this.idParameteruji !== 'add' ? this.detaildata[0].active : '',
              disabled: this.idParameteruji !== 'add' ? true : false
            },{ validator: Validators.required }],
            mstr_laboratories_laboratory_id: [{
              value: this.idParameteruji !== 'add' ? this.detaildata[0].mstr_laboratories_laboratory_id : '',
              disabled: this.idParameteruji !== 'add' ? true : false
            },{ validator: Validators.required }],
            mstr_laboratories_parametertype_id: [{
              value: this.idParameteruji !== 'add' ? this.detaildata[0].mstr_laboratories_parametertype_id : '',
              disabled: this.idParameteruji !== 'add' ? true : false
            },{ validator: Validators.required }],
            hris_employee_id: [{
              value: this.idParameteruji !== 'add' ? this.detaildata[0].hris_employee_id : '',
              disabled: this.idParameteruji !== 'add' ? true : false
            },{ validator: Validators.required }],
        })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
