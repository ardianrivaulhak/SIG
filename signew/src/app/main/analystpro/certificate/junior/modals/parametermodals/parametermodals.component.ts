import { Component, OnInit, Optional, Inject, ViewEncapsulation, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../certificate.service';
import { CertmodalsComponent } from "../certmodals/certmodals.component";
import { MatDialog } from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { MatTable } from "@angular/material/table";
import { ParameterujiService } from "../../../../master/parameteruji/parameteruji.service";

@Component({
  selector: 'app-parametermodals',
  templateUrl: './parametermodals.component.html',
  styleUrls: ['./parametermodals.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class ParameterCertificatemodalsComponent implements OnInit {
  @ViewChild("table") MatTable: MatTable<any>;
  displayedColumns: string[] = [
  'action',
  'parameteruji_id', 
  'parameteruji_en',
  'hasiluji',
  'unit',
  'simplo',
  'duplo',
  'triplo',
  'metode',
  'lod',
  'standart',
  'n',
  'c',
  'm',
  'mm'
  ];

// displayedColumns =
// ['name', 'position', 'weight', 'symbol', 'position', 'weight', 'symbol', 'star'];
// dataSource = ELEMENT_DATA;
  
  listDataParameter : any;
  dragDrop = false;
  loadingfirst = true;
  dataParameter = [];
  id_transaction = this.datas.idtransactionsample;

  parameterForm: FormGroup;
  datasertifikat: FormArray = this._formBuild.array([]);
  // parameterForm: FormGroup = this._formBuild.group({
  //     parameter: this.datasertifikat,
  // });
  parameters= [];
  status_parameter = false;
  editing: number = -1;
  oldValue: any;
  parameterid = {
    id_parameter : '',
    id_sample : this.datas.idtransactionsample
  };
  load = false;
  dataFilter = {
    id_transaction : this.datas.idtransactionsample,
    pages : 1
  }

  dataSentParameters = {
    pages : 1,
    search : null
  }

  total: number;
  from: number;
  to: number;
  last_page: number;
  
  copydata = [];
  copyid = 'id';
  copyen = 'en';
  copyresult = 'hasiluji';
  copyunit = 'unit';
  copysimplo = 'simplo';
  copyduplo = 'duplo';
  copytriplo = 'triplo';
  copymetode = 'metode';
  copylod = 'lod';
  copystandart = 'standart';
  copyn = 'n';
  copyc = 'c';
  copym = 'm';
  copymm = 'mm';

  iddeleted = [];
  data_lhu = this.datas.bac
  status_lhu = false

  getIdLhu : any

  checkList = []
  allComplete: boolean = false;
  idParameter : any;

  constructor(
    public dialogRef: MatDialogRef<ParameterCertificatemodalsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public datas: any,
    private _certServ: CertificateService,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _parameterServ: ParameterujiService,
    private cdRef: ChangeDetectorRef
  ) 
  {
  
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
 }


  ngOnInit(): void {
    this.parameterForm = this._formBuild.group({
      parameters: this._formBuild.array([])
    })
    this.choiceSample(this.dragDrop);
    console.log(this.data_lhu)
  }

  async choiceSample(data){
    this.dragDrop = await data;
    console.log(this.dragDrop)
    this.dragDrop == true ? this.getSampleLabNormal() : this.getSampleLab();
  }

  async getSampleLabNormal(){
    console.log(this.dragDrop)
    await this._certServ.getParameter(this.dataFilter).then( async x => {
        let b = []
        b = await b.concat(Array.from(x['data']));
        this.total = x["total"];
        this.from = x["from"] - 1;
        this.to = x["to"];
        this.last_page = x["last_page"]; 
        this.listDataParameter = [] 
        console.log(b)
       await b.forEach( (x, index) => {
            this.listDataParameter = this.listDataParameter.concat({
                no: index + 1,
                id: x.id ,
                id_parameteruji: x.id_parameteruji,
                parameteruji_id: x.parameteruji_id,
                parameteruji_en: x.parameteruji_en,
                simplo: x.simplo,
                duplo : x.duplo,
                triplo : x.triplo,
                hasiluji : x.hasiluji,
                standart : x.standart,
                n: x.n,
                c: x.c,
                m: x.m,
                mm: x.mm,
                lod: x.lod,
                lab : x.lab,
                unit : x.unit,
                metode : x.metode,
                format_hasil : x.format_hasil,
                status : x.status,
                info_id : x.info_id,
                position : x.position + 1
            })
       })
    })
    this.listDataParameter = this.uniq(this.listDataParameter, (it) => it.id);
    await console.log(this.listDataParameter)
  }
  

  async getSampleLab(){
    console.log(this.dragDrop)
    this.listDataParameter = []
    await this._certServ.getParameter(this.dataFilter).then(async x => {
      let b = [];
      b = await b.concat(Array.from(x['data'])); 
      this.total = x["total"];
      this.from = x["from"] - 1;
      this.to = x["to"];
      this.last_page = x["last_page"];     
      this.dataParameter = b;
      await b.forEach((x, index) => {
        //(this.parameterForm.get('parameters') as FormArray)
        const phone = this._formBuild.group({ 
          no: index + 1,
          id: [ x.id ],
          id_parameteruji:  [ x.id_parameteruji ],
          parameteruji_id: [x.parameteruji_id, { validator: Validators.required }],
          parameteruji_en: [x.parameteruji_en, { validator: Validators.required }],
          simplo: [x.simplo],
          duplo : [x.duplo],
          triplo : [x.triplo],
          hasiluji : [x.hasiluji],
          standart : [x.standart],
          n: [x.n],
          c: [x.c],
          m: [x.m],
          mm: [x.mm],
          lod: [x.lod],
          lab : [x.lab],
          unit : [x.unit],
          metode : [x.metode],
          format_hasil : [x.format_hasil],
          status : [x.status],
          info_id : [x.info_id],
          position : [x.position + 1]
        })
        this.phoneForms.push(phone);
      })
     
    })
    .then(() => this.listDataParameter = this.parameterForm.controls.parameters['controls'])
    this.listDataParameter = await [];
    this.listDataParameter = await this.uniq(this.listDataParameter, (it) => it.id);
    // await  this.MatTable.renderRows();
    this.loadingfirst =  await false;
    console.log(this.listDataParameter)
  }

  get phoneForms() {
    return this.parameterForm.get("parameters") as FormArray
  }


  
  addPhone() {
  
    const phone = this._formBuild.group({ 
      id: [],
      parameteruji_id: [],
      parameteruji_en: [],
      simplo: [],
      duplo : [],
      triplo : [],
      hasiluji : [],
      standart : [],
      n: [],
      c: [],
      m: [],
      mm: [],
      lod: [],
      lab : [],
      unit : [],
      metode : [],
      position : []
    })
  
    this.phoneForms.push(phone);
  }
  
  deleteParameter(i, e) {
   
    console.log(e.value.id)
    this.iddeleted.push(e.value.id)
    this.phoneForms.removeAt(i)
    this.MatTable.renderRows();
    console.log(this.iddeleted)
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'You will not be able to recover this Data!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes, Delete it!',
    //   cancelButtonText: 'Cancel'
    // }).then((result) => {
    //   if (result.value) {
    //     this.phoneForms.removeAt(i)
    //     this.MatTable.renderRows();
    //     Swal.fire(
    //       'Parameter Deleted!',
    //       'Your parameter data has been delete.',
    //       'success'
    //     )
    //   } else if (result.dismiss === Swal.DismissReason.cancel) {
    //     Swal.fire(
    //       'Cancelled',
    //       'Your imaginary file is safe :)',
    //       'error'
    //     )
    //   }
    // })
  }

  certModals(id)
  {
    const dialogRef = this._matDialog.open(CertmodalsComponent, {
      panelClass: 'certificate-control-dialog',
      width: '100%',
      data: {idtransactionsample : id}
    });

    this.closeDialog();

    dialogRef.afterClosed().subscribe( result => {
      console.log('dialog close')
      id = result;
    });
  }

  closeDialog()
  {
    return this.dialogRef.close({
    });
  }

  drop(event: CdkDragDrop<string[]>) {

    if (this.isInvalidDragEvent) {
        this.isInvalidDragEvent = false;
        return;
    }
    const prevIndex = this.listDataParameter.findIndex((d) => d === event.item.data);
    moveItemInArray(this.listDataParameter, prevIndex, event.currentIndex);
    console.log([prevIndex, event.currentIndex, this.listDataParameter])
    this.MatTable.renderRows();
  }

  isInvalidDragEvent:boolean=false;

  activeNote: string;

  onInvalidDragEventMouseDown(){
    this.isInvalidDragEvent=true;
  }

  dragStarted(event){
    if(this.isInvalidDragEvent){
       document.dispatchEvent(new Event('mouseup'));
    }
  }

  enter(i) {
      console.log(i)
    this.activeNote = this.parameterForm.get('parameters')['controls'][i].get('id').value;
  }

  saveForm(boolean){
    console.log(boolean);
    if(boolean == true){
        this._certServ.parameterListing(this.listDataParameter)
        .then(y => {
          this.load = true;
          let message = {
            text: 'Data Succesfully Updated',
            action: 'Done'
          }
          setTimeout(()=>{  
            this.openSnackBar(message);
            this.closeDialog();
            this.loadingfirst =  true;
            this.load = false;
          },1000)
        })
    }
    if(boolean == false){
        console.log([this.parameterForm.value, this.iddeleted])
        this._certServ.parameterUpdate(this.parameterForm.value, this.iddeleted)
            .then(y => {
            this.load = true;
            let message = {
                text: 'Data Succesfully Updated',
                action: 'Done'
            }
            setTimeout(()=>{  
                this.openSnackBar(message);
                this.closeDialog();
                this.loadingfirst =  true;
                this.load = false;
            },1000)
        })
    }
   
    
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  copyParameter(data, ev){
    this.copydata = [{data : data, ev : ev}];
    console.log(this.copydata)
  }

  pasteParameter(i){
    let ev = this.copydata[0].ev;
    let data = this.copydata[0].data;

    switch (ev) {
      case this.copyid : 
        const controlid = <FormArray> this.parameterForm.get('parameters');
        controlid.controls[i].get('parameteruji_id').setValue(data);
        break;
      case this.copyen : 
        const controlen = <FormArray> this.parameterForm.get('parameters');
        controlen.controls[i].get('parameteruji_en').setValue(data);
        break;
      case this.copyresult : 
        const controlresult = <FormArray> this.parameterForm.get('parameters');
        controlresult.controls[i].get('hasiluji').setValue(data);
        break;
      case this.copyunit : 
        const controlunit = <FormArray> this.parameterForm.get('parameters');
        controlunit.controls[i].get('unit').setValue(data);
        break;
      case this.copysimplo : 
        const controlsimplo = <FormArray> this.parameterForm.get('parameters');
        controlsimplo.controls[i].get('simplo').setValue(data);
        break;
      case this.copyduplo : 
        const controlduplo = <FormArray> this.parameterForm.get('parameters');
        controlduplo.controls[i].get('duplo').setValue(data);
        break;
      case this.copytriplo : 
        const controltriplo = <FormArray> this.parameterForm.get('parameters');
        controltriplo.controls[i].get('triplo').setValue(data);
        break;
      case this.copymetode : 
        const controlmetode = <FormArray> this.parameterForm.get('parameters');
        controlmetode.controls[i].get('metode').setValue(data);
        break;
      case this.copylod : 
        const controllod = <FormArray> this.parameterForm.get('parameters');
        controllod.controls[i].get('lod').setValue(data);
        break;
      case this.copystandart : 
        const controlstandart = <FormArray> this.parameterForm.get('parameters');
        controlstandart.controls[i].get('standart').setValue(data);
        break;
      case this.copyn : 
        const controln = <FormArray> this.parameterForm.get('parameters');
        controln.controls[i].get('n').setValue(data);
        break;
      case this.copyc : 
        const controlc = <FormArray> this.parameterForm.get('parameters');
        controlc.controls[i].get('c').setValue(data);
        break;
      case this.copym : 
        const controlm = <FormArray> this.parameterForm.get('parameters');
        controlm.controls[i].get('m').setValue(data);
        break;
      case this.copymm : 
        const controlmm = <FormArray> this.parameterForm.get('parameters');
        controlmm.controls[i].get('mm').setValue(data);
        break;
    }  
   
  }

  pasteAllParameter(){
    console.log(this.copydata)
    let ev = this.copydata[0].ev;
    let data = this.copydata[0].data;

    switch (ev) {
      case this.copyid :         
        for(let i = 0; i < this.dataParameter.length; i++){
          const controlid = <FormArray> this.parameterForm.get('parameters');
          controlid.controls[i].get('parameteruji_id').setValue(data);
        }        
        break;
      case this.copyen : 
        for(let i = 0; i < this.dataParameter.length; i++){
          const controlen = <FormArray> this.parameterForm.get('parameters');
          controlen.controls[i].get('parameteruji_en').setValue(data);
        }
        break;
      case this.copyresult : 
        for(let i = 0; i < this.dataParameter.length; i++){
          const controlresult = <FormArray> this.parameterForm.get('parameters');
          controlresult.controls[i].get('hasiluji').setValue(data);
        }
        break;
      case this.copyunit : 
        for(let i = 0; i < this.dataParameter.length; i++){
          const controlunit = <FormArray> this.parameterForm.get('parameters');
          controlunit.controls[i].get('unit').setValue(data);
        }
        break;
      case this.copysimplo : 
        for(let i = 0; i < this.dataParameter.length; i++){
          const controlsimplo = <FormArray> this.parameterForm.get('parameters');
          controlsimplo.controls[i].get('simplo').setValue(data);
        }
        break;
      case this.copyduplo : 
        for(let i = 0; i < this.dataParameter.length; i++){
          const controlduplo = <FormArray> this.parameterForm.get('parameters');
          controlduplo.controls[i].get('duplo').setValue(data);
        }
        break;
      case this.copytriplo : 
        for(let i = 0; i < this.dataParameter.length; i++){
          const controltriplo = <FormArray> this.parameterForm.get('parameters');
          controltriplo.controls[i].get('triplo').setValue(data);
        }
        break;
      case this.copymetode : 
        for(let i = 0; i < this.dataParameter.length; i++){
          const controlmetode = <FormArray> this.parameterForm.get('parameters');
          controlmetode.controls[i].get('metode').setValue(data);
        }
        break;
      case this.copylod : 
        for(let i = 0; i < this.dataParameter.length; i++){
          const controllod = <FormArray> this.parameterForm.get('parameters');
          controllod.controls[i].get('lod').setValue(data);
        }
        break;
      case this.copystandart : 
        for(let i = 0; i < this.dataParameter.length; i++){
          const controlstandart = <FormArray> this.parameterForm.get('parameters');
          controlstandart.controls[i].get('standart').setValue(data);
        }
        break;
      
    }  
  
  }

  cancelCopyParameter()
  {
    this.copydata = [];
  }

  onScroll(e) {
    console.log([e, 'scroll'])
  }

  onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight; // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight; // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled

    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 200;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (this.dataFilter.pages < this.last_page) {
        if (scrollLocation > limit) {
            this.dataFilter.pages = this.dataFilter.pages + 1;
            this.getSampleLab();
      }
    }
  }

 async  getParameters() {
    await this._parameterServ.getDataParameterUji(this.dataSentParameters).then(x => {
       this.parameters = this.parameters.concat(Array.from(x['data']));
      this.parameters = this.uniq(this.parameters, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }  
    })
    .then(x => console.log(this.parameters))
    this.loadingfirst =  await false;
  }

  searchParameters(ev)
  {
      this.dataSentParameters.search = null
      console.log(ev)
      this.dataSentParameters.search = ev.term;
      this.dataSentParameters.pages = 1;
      this.getParameters();
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  onScrollToEnd(e) {
    if (e === "parameters") {
      this.dataSentParameters.pages = this.dataSentParameters.pages + 1; 
      this._parameterServ.getDataParameterUji(this.dataSentParameters).then(x => {
        this.parameters = this.parameters.concat(x['data']);
        console.log(this.parameters);
      });
    }
  }

  statParam(param){
  this.status_parameter = param;
  this.getParameters();
      if(this.status_parameter == false){
        this.parameters = [];
        this.loadingfirst = true;
        this.getSampleLab();
      } 
  }

  statLhu(param){
      this.status_lhu = param;
      if(this.status_parameter == false){
        this.loadingfirst = true;
        this.getSampleLab();
      }
  }

  addParameters(){
    console.log(this.dataParameter.length)
    this._certServ.addParameter(this.parameterid).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.parameters = [];
        this.dataParameter = [];
        this.listDataParameter = [];
        this.loadingfirst = true;
        this.statParam(false);
        this.getSampleLabNormal();
        this.load = false;
      },1000)
    })
  }

  CopyDataParameters(data){

    console.log(data)
    this._certServ.copyDataParameter(data, this.id_transaction).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.parameters = [];
        this.dataParameter = [];
        this.listDataParameter = [];
        this.loadingfirst = true;
        this.statParam(false);
        this.getSampleLabNormal();
        this.load = false;
      },1000)
    })
  }

  closeModal(){
    return this.dialogRef.close({
      
    });
  }

  getParameterinSample()
  {
    console.log(this.dataFilter.id_transaction)
    let id = this.dataFilter.id_transaction;
    Swal.fire({
        title: 'Are you sure?',
        text: 'you will get parameter in sample lab',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Lets Go!',
        cancelButtonText: 'No, Maybe later'
      }).then((result) => {
        if (result.value) {
          this._certServ.getParameterHasBeenDelete(id).then(x => {
          })
          Swal.fire(
            'Success!',
            'Parameter Restore',
            'success'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
        let message = {
            text: 'Data Succesfully Updated',
            action: 'Done'
        }
        setTimeout(()=>{
            this.openSnackBar(message);
            this.closeDialog();
            this.loadingfirst =  true;
            this.load = false;
        },1000)
      })
  }

  getParameterinLab()
  {
    console.log(this.dataFilter.id_transaction)
    let id = this.dataFilter.id_transaction;
    Swal.fire({
        title: 'Are you sure?',
        text: 'you will get parameter in sample lab',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Lets Go!',
        cancelButtonText: 'No, Maybe later'
      }).then((result) => {
        if (result.value) {
          this._certServ.getParameterinLab(id).then(x => {
          })
          Swal.fire(
            'Success!',
            'Parameter Restore',
            'success'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
        let message = {
            text: 'Data Succesfully Updated',
            action: 'Done'
        }
        setTimeout(()=>{
            this.openSnackBar(message);
            this.closeDialog();
            this.loadingfirst =  true;
            this.load = false;
        },1000)
      })
  }

  getParameterinOtherLhu()
  {
    let send = {
        id_lhu : this.id_transaction,
        send_id : this.getIdLhu
    }
    console.log(send)
    this._certServ.addParameterInOtherLhu(send).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.parameters = [];
        this.dataParameter = [];
        this.listDataParameter = [];
        this.loadingfirst = true;
        this.statLhu(false);
        this.getSampleLabNormal();
        this.load = false;
      },1000)
    })
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.dataParameter == null) {
      return;
    }
    if(completed == true)
    {
      this.dataParameter.forEach(t => t.completed = completed);
      this.dataParameter.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.idParameter = this.dataParameter[0].id
      this.checkList = this.uniq(this.checkList, (it) => it.id);
    }else{
      this.dataParameter.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }

  updateAllComplete() {
    this.allComplete = this.dataParameter != null && this.dataParameter.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.dataParameter == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.dataParameter.filter(t => t.completed).length > 0 && !this.allComplete;      
  }

  checkBox(ev, id){
    let z = this.checkList.filter(o => o.id == id);
   
    console.log(this.idParameter)
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
    this.idParameter = this.checkList[0].id;
  }


  
 
  


}
