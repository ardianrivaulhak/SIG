import { Component, OnInit, ViewEncapsulation, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlService } from '../control.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { ParameterModalsComponent } from "../control-modals/parameter-modals/parameter-modals.component";
import { PhotoModalsComponent } from "../control-modals/photo-modals/photo-modals.component";
import { forEach } from 'lodash';
import { MatSort, Sort } from '@angular/material/sort';
import { ModalPhotoComponent } from "../../modal/modal-photo/modal-photo.component";
import { ImageModalComponent } from "../../modal/image-modal/image-modal.component";
import { ModalPhotoParameterComponent } from "../../contract/modal-photo-parameter/modal-photo-parameter.component";
import { ContractService } from "../../services/contract/contract.service";
import Swal from 'sweetalert2';
import { LabService } from 'app/main/analystpro/master/lab/lab.service';
import * as globals from 'app/main/global';
import { ModalPhotoViewcontractComponent } from "app/main/analystpro/view-contract/modal/modal-photo-viewcontract/modal-photo-viewcontract.component";
@Component({
  selector: 'app-control-parameter',
  templateUrl: './control-parameter.component.html',
  styleUrls: ['./control-parameter.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ControlParameterComponent implements OnInit {

  loadingfirst = true;

  displayedColumns: string[] = [ 'no', 'checkbox', 'parameter_type', 'lod', 'metode',  'lab', 'parameter_name', 'unit' ,'paket', 'action'];
  idSample: any;
  sampleData = [];
  parameterData = [];
  total: number;
  from: number;
  to: number;
  current_page : number;

  copyDataParameter = [];
  parameter_data = {
    id_parameter : ''
  }
  load = false;
  btnCheck = false;
  pasteParameter: '';
  checkList = [];
  copyBulkParameterData = [];
  dataFilter = {
    pages : 1,
    id_sample : this._actRoute.snapshot.params['id'],
    parameter_id : null,
    parameter_en : null,
    lab : null,
    paket : null,
  }
  labcode = 1;
  unitcode = 2;

 

  checkPhoto = false;
  dataSample = [];
  dataLab = [];
  datasentLab = {
    pages : 1,
    search : null
  }
  totalLab: number;
  fromLab: number;
  toLab: number;
  

  allComplete: boolean = false;

  constructor(
    private _controlService: ControlService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _kontrakServ: ContractService,
    private _labServ : LabService
  ) { 
    this.idSample = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getDataSample();
    this.getDataParameterinSample();
    this.getDataLab();
  }

  getDataSample() {
    this._controlService.getDetailDataSample(this.idSample)
    .then(x => this.sampleData = this.sampleData.concat(x))
    .then(c => console.log(this.sampleData))
  }

  async getDataParameterinSample() {
    console.log(this.dataFilter)
    await this._controlService.getDataParameterInSample(this.dataFilter)
    .then(x => { this.parameterData = this.parameterData.concat(Array.from(x['data']));
    console.log(x)
    this.total = x["total"];
    this.current_page = x["current_page"] - 1;
    this.from = x["from"];
    this.to = x["per_page"];
    })
    await console.log(this.parameterData)
  }

  sortData(sort: Sort) {
    const data = this.parameterData.slice();
    if ( !sort.active || sort.direction === '') {
      this.parameterData = data;
      return;
    }
    this.parameterData = data.sort((a, b) => {
        console.log(a)
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'parameter_type': return this.compare(a.parameter_type, b.parameter_type, isAsc);
        case 'lod': return this.compare(a.lod, b.lod, isAsc);
        case 'metode': return this.compare(a.metode, b.metode, isAsc);
        case 'lab': return this.compare(a.lab, b.lab, isAsc);
        case 'parameter_name': return this.compare(a.parameter_name, b.parameter_name, isAsc);
        case 'unit': return this.compare(a.unit, b.unit, isAsc);
        case 'paket': return this.compare(a.paket, b.paket, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  paginated(f) {
    this.parameterData = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getDataParameterinSample();
  }


  editParameter(id_parameter, ev) : void {
    console.log(id_parameter)
    let u = [];
        this.checkList.forEach((x) => {
            if (x.checked) {
                u = u.concat({
                    id: x.id,
                });
            }
        });
    const dialogRef = this._matDialog.open(ParameterModalsComponent, {
      panelClass: 'parameter-control-dialog',
      width : '500px',
      disableClose: true,
      data: ev == 'nonchecklist'?  { id_parameter : id_parameter , select : ev } : { id_parameter : u, select : ev, id_contract : id_parameter.id_contract } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.ev == false){
        this.parameterData = [];
        this.checkList = [];
        this.getDataParameterinSample();
      }
   
     
    });
  }

  copyParameterData(ev, param) {
    console.log([ev, param]);
    this.copyDataParameter = [];
    this.parameter_data.id_parameter = ev;
   
    this._controlService.getDetailDataParameter(this.parameter_data.id_parameter).then( x => {
      param == 1 ?
      this.copyDataParameter = this.copyDataParameter.concat({
        id: x[0]['id'], 
        id_lab: x[0]['id_lab'], 
        id_parameteruji : x[0]['id_parameteruji'], 
        id_contract : x[0]['transactionsamples']['id_contract'], 
        param : this.labcode}) 
      :
      this.copyDataParameter = this.copyDataParameter.concat({
        id: x[0]['id'],  
        id_unit : x[0]['id_unit'], 
        id_parameteruji : x[0]['id_parameteruji'], 
        id_contract : x[0]['transactionsamples']['id_contract'], 
        param : this.unitcode});

      console.log(this.copyDataParameter)
    })

  }

  cancelButtonCopy()  {
    this.copyDataParameter = [];
  }

  pasteParameterData(v)  {
    console.log(this.copyDataParameter)
    this.parameter_data.id_parameter = v;
    this.copyDataParameter.forEach( x => {
      this.pasteParameter = x;
    })
    console.log(this.pasteParameter)
    this._controlService.pasteParameter(this.parameter_data.id_parameter, this.pasteParameter).then( () => {
      this.load = true;
      let message = {
        text: 'Paste Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.parameterData=[];
        this.getDataParameterinSample();
        this.copyDataParameter=[];
        this.openSnackBar(message);
        this.load = false;
      },1000)
    })

  }
  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }


  pasteAllParameter()
  {
    this.copyDataParameter.forEach( x => {
      this.pasteParameter = x;
    })
    console.log(this.pasteParameter)
    this._controlService.pasteAllParameter(this.idSample, this.pasteParameter).then(o => {
      this.load = true;
      let message = {
        text: 'Paste Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.parameterData=[];
        this.getDataParameterinSample();
        this.copyDataParameter=[];
        this.openSnackBar(message);
        this.load = false;
      },1000)
    })
  }

  pasteAllinContractParameterData()
  {
    this.copyDataParameter.forEach( x => {
      this.pasteParameter = x;
    })
    console.log(this.pasteParameter)
    this._controlService.pasteAllParameterInContract(this.pasteParameter).then(o => {
      this.load = true;
      let message = {
        text: 'Paste Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.parameterData=[];
        this.getDataParameterinSample();
        this.copyDataParameter=[];
        this.openSnackBar(message);
        this.load = false;
      },1000)
    })

  }

  copyBulkParameter()
  {
    console.log(this.checkList)
  }

  photoInSample(id_sample) : void {
    const dialogRef = this._matDialog.open(ModalPhotoComponent, {
      data: id_sample,
     
    });
    console.log(id_sample)

    dialogRef.afterClosed().subscribe(result => {
      this.checkPhoto = false;
      console.log(result) 
      let data = {
          idsample: id_sample,
          photo: result.c[0],
          id: result
      }
      this._controlService.savePhoto(data).then((x) => {
        console.log(data)
      }).then(() => {
        console.log(this.dataSample);
        this.checkPhoto = true
      }); 
    });
  }

  photogallery(id_sample) : void {
    const dialogRef = this._matDialog.open(PhotoModalsComponent, {
      data: id_sample,
      height: "auto",
      width: "600px",
      panelClass: 'photo-controls-modal',
    });
    console.log(id_sample)
    dialogRef.afterClosed().subscribe(result => {
     
    });
  }

  async searchButton() {         
    console.log(this.dataFilter)
    this.loadingfirst = false;
    this.parameterData = [];
    this.getDataParameterinSample();
  }

  async cancelSearchMark() {    
    this.dataFilter.parameter_id = null;
    this.dataFilter.parameter_en = null;
    this.dataFilter.lab = null;
    this.loadingfirst = false;
    this.parameterData = [];
    this.getDataParameterinSample();
  }

  async getDataLab(){
    await this._labServ.getDataLab(this.datasentLab).then(x => {
      this.dataLab = this.dataLab.concat(Array.from(x['data']));
        this.totalLab = x['total'];
        this.fromLab = x['from'] - 1;
        this.toLab = x['to']
    })
  }

  onScrollToEnd(e) {
    if (e === "lab") {
      this.datasentLab.pages = this.datasentLab.pages + 1; 
      this._labServ.getDataLab(this._labServ).then(x => {
        this.dataLab = this.dataLab.concat(x['data']);
      });
    }
    
  }

  onsearchselect(ev, val) {
    if (val === "lab") {
        this.dataLab = [];
        this.datasentLab.search = ev.term;
        this.datasentLab.pages = 1;
        this.getDataLab();
    }
  }

  reset(e) { 
    if (e === "lab") { 
      this.datasentLab.search = null; 
      this.loadingfirst = true;
      this.dataLab = [];
      this.getDataLab();
    } 
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.parameterData == null) {
      return;
    }
    if(completed == true)
    {
      this.parameterData.forEach(t => t.completed = completed);
      this.parameterData.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.parameterData.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }


  updateAllComplete() {
    this.allComplete = this.parameterData != null && this.parameterData.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.parameterData == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.parameterData.filter(t => t.completed).length > 0 && !this.allComplete;      
  }

  checkBox(ev,id){
    let z = this.checkList.filter(o => o.id == id);
    console.log(ev)
    if(ev){
      if(z.length > 0){
        z[0].checked = ev
      } else {
        this.checkList = this.checkList.concat({
          id: id,
          checked : true
        });
      }
    } else {
      let z = this.checkList.filter(x => x.id == id);
      z[0].checked = ev;
    }
    console.log(this.checkList)
  }

  async getModalAddPhoto(v) {
    const dialogRef = await this._matDialog.open(
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

  async refresh()
  {
    this.parameterData = await [];
    this.checkList = await [];
    await this.getDataParameterinSample();
  }


 


}
