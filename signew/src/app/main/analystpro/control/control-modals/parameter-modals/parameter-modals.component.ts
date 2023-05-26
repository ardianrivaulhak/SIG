import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlService } from '../../control.service';
import { LabService } from "../../../master/lab/lab.service";
import { UnitService } from "../../../master/unit/unit.service";
import * as globals from "app/main/global";

@Component({
  selector: 'app-parameter-modals',
  templateUrl: './parameter-modals.component.html',
  styleUrls: ['./parameter-modals.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ParameterModalsComponent implements OnInit {

  loadbtn = false;
  disablebtn = false;
  parameterData = [];
  id_parameter = this.data;
  parameterForm: FormGroup;
  datasentLab = {
    pages : 1,
    search : null,
    typeContract: null
  }
  labs = [];
  datasentUnit = {
    pages : 1,
    search : null,
    typeContract: null
  }
  units = [];
  load = false;
  checkParam = [];
  checkSampleAll = false;

  constructor(
    public dialogRef: MatDialogRef<ParameterModalsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _controlService: ControlService,
    private _labService: LabService,
    private _unitService: UnitService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
   this.data.select == 'nonchecklist' ? this.getParameter() : this.parameterForm = this.createForm();     
    this.getDataLab();
    this.getDataUnit();
    console.log(this.data)
  }

  getParameter(){
    this._controlService.getDetailDataParameter(this.data.id_parameter)
    .then(x => this.parameterData = this.parameterData.concat(x))
    .then(() => this.parameterForm = this.createForm())
  }

  createForm(): FormGroup {
    return this._formBuild.group({
        id_lab : [ this.data.select == 'nonchecklist' ? this.parameterData[0].id_lab == null ? '' : this.parameterData[0].id_lab : ''  ],
        id_unit : [ this.data.select == 'nonchecklist' ?  this.parameterData[0].id_unit == null ? '' : this.parameterData[0].id_unit : '']
    })
  }

  getDataLab(){
    this._labService.getDataLab(this.datasentLab).then(x => {
      this.labs = this.labs.concat(x['data']);
    })
  }

  getDataUnit(){
    this._unitService.getDataUnit(this.datasentUnit).then(x => {
      this.units = this.units.concat(x['data']);
    })
  }

  searchUnit(ev){
    console.log(ev)
    this.datasentUnit.search = ev.term;
    this.datasentUnit.pages = 1;
    this.getDataUnit();
  }

  onScrollToEnd(e) {
    this.load = true;
    if (e === "lab") {
        this.datasentLab.pages = this.datasentLab.pages + 1;
        this.getDataLab();
    }
    if (e === "unit") {
      this.datasentUnit.pages = this.datasentUnit.pages + 1;
      this.getDataUnit(); 
    }
    setTimeout(() => {
        this.load = false;
    }, 200);
  }

  saveForm(){
    console.log(this.checkSampleAll)
    if(this.data.select == 'nonchecklist'){
      console.log(this.parameterForm);
      this._controlService.updateParameter(this.id_parameter.id_parameter, this.parameterForm.value).then(y => {
        this.load = true;
        this.loadbtn = true;
        this.disablebtn = true;
        let message = {
          text: 'Data Succesfully Updated',
          action: 'Done'
        }
        setTimeout(()=>{  
          this.openSnackBar(message);
          this.closeModal(false);
          this.loadbtn = false;
          this.disablebtn = false;
          this.load = false;
        },2000)
      })
    } else {      
      let u = [];
      this.checkParam.forEach((x) => {
          if (x.ev) {
              u = u.concat({
                  e: x.parameter,
                  d : x.parameter == 'lab' ? this.parameterForm.value.id_lab :  this.parameterForm.value.id_unit
              });
          }
      });
      if(this.checkSampleAll == true){
        this._controlService.updateBulkParameterAllSample(this.id_parameter, u, this.data.id_contract).then(y => {
          this.load = true;
          this.loadbtn = true;
          this.disablebtn = true;
          let message = {
            text: 'Data Succesfully Updated',
            action: 'Done'
          }
          setTimeout(()=>{  
            this.openSnackBar(message);
            this.closeModal(false);
            this.load = false;
            this.loadbtn = false;
            this.disablebtn = false;
          },2000)
        })
      }else{
        this._controlService.updateBulkParameter(this.id_parameter, u).then(y => {
          this.load = true;
          this.loadbtn = true;
          this.disablebtn = true;
          let message = {
            text: 'Data Succesfully Updated',
            action: 'Done'
          }

          setTimeout(()=>{  
            this.openSnackBar(message);
            this.closeModal(false);
            this.load = false;
            this.loadbtn = false;
            this.disablebtn = false;
          },2000)
        })
      }
     
    }   
  }  

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  closeModal(ev){
    return this.dialogRef.close({
      ev
    });
  }

  showOptions(ev, parameter) {
    let p = {
      ev : ev,
      parameter : parameter
    }
    this.checkParam = this.checkParam.concat(p)
    this.checkParam = globals.uniq(
      this.checkParam,
      (it) => it.parameter
    );
    console.log(this.checkParam)
  }

  checkAllSample(ev) {
    this.checkSampleAll = ev;
    console.log(this.checkSampleAll)
  }

}
