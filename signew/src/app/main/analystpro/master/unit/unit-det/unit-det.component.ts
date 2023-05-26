import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitService } from '../unit.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-unit-det',
  templateUrl: './unit-det.component.html',
  styleUrls: ['./unit-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class UnitDetComponent implements OnInit {

  unitForm: FormGroup;
  detaildata = [];
  idUnit: any;
  hide = true;
  load = false;
  saving = false;
  active = [
    {value: 1, viewValue: 'Active'},
    {value: 0, viewValue: 'Not Active'},
  ];

  constructor(
    private _unitServ: UnitService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) {
    this.idUnit = this._actRoute.snapshot.params['id'];
   }

  ngOnInit(): void {
    this.getdatadetail();
  }

  enableForm(){
    this.hide = false;
    // this.unitForm.get('kode_unit').enable();
    this.unitForm.get('nama_unit').enable();
    this.unitForm.get('description').enable();
    this.unitForm.get('active').enable();
  }

  disableForm(){
    this.hide = true;
    // this.unitForm.get('kode_unit').disable();
    this.unitForm.get('nama_unit').disable();
    this.unitForm.get('description').disable();
    // this.unitForm.get('disable').enable();
  }

  saveForm(){
    console.log(this.unitForm);
    this._unitServ.updateDataUnit(this.idUnit, this.unitForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/unit');
        this.load = false;
      },2000)
    })
  }

  deleteForm(){
    this._route.navigateByUrl('analystpro/unit');
  }

  saveNewForm(){
    this._unitServ.addDataUnit(this.unitForm.value).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Save',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/unit');
        this.load = false;
      },2000)
    });
  }

  getdatadetail(){
    this._unitServ.getDataDetailUnit(this.idUnit)
    .then(x => this.detaildata = this.detaildata.concat(x))
    .then(()=> this.unitForm = this.createLabForm());
  }

  createLabForm(): FormGroup {
        return this._formBuild.group({
            // kode_unit: [{
            //   value: this.idUnit !== 'add' ? this.detaildata[0].kode_unit : '',
            //   disabled: this.idUnit !== 'add' ? true : false
            // },{ validator: Validators.required }],
            nama_unit: [{
              value: this.idUnit !== 'add' ? this.detaildata[0].nama_unit : '',
              disabled: this.idUnit !== 'add' ? true : false
            },{ validator: Validators.required }],
            description: [{
              value: this.idUnit !== 'add' ? this.detaildata[0].description : '',
              disabled: this.idUnit !== 'add' ? true : false
            },{ validator: Validators.required }],
            // active: [{
            //   value: this.idUnit !== 'add' ? this.detaildata[0].active : '',
            //   disabled: this.idUnit !== 'add' ? true : false
            // },{ validator: Validators.required }],
        })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
