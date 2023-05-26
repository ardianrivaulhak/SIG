import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreparationService } from '../../preparation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabService } from "../../../master/lab/lab.service";
import { PhotoPrepComponent  } from "../../photo-prep/photo-prep.component";
import { MemopreparationdialogComponent } from '../memopreparationdialog/memopreparationdialog.component'; 
import * as globals from "app/main/global";
import { ModalPhotoViewcontractComponent } from "app/main/analystpro/view-contract/modal/modal-photo-viewcontract/modal-photo-viewcontract.component";
@Component({
  selector: 'app-modalbobot',
  templateUrl: './modalbobot.component.html',
  styleUrls: ['./modalbobot.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ModalbobotComponent implements OnInit {

  

  idpreparation = '';
  detaildata = [];
  labData = [];
  labchoose = [];
  valuechoose = [];
  bobotcombine = [];
  dataId = {
    data: []
  }
  bobottotal: number = 0;
  displayedColumns: string[] = ['no',
  'nama_lab', 
  'value', 
  'select' ];

  displayedColumnsParam: any[] = [
  'no', 
  'name_id', 
  'name_en', 
  'nama_lab'];

  dataTambahBobot = {
    id_sample: '',
    id_lab: '',
    value: ''
  };
 
 
  loading = false;
  hide = true;
  load = false;
  saving = false;
  jumlah: number;
  dataBobotButton = '';
  getDataParameter = [];
  modalBobotForm: FormGroup;

  // bachtiar edited
  getDataBobots = [];
  addBobotForm: FormGroup;
  totalbot: number;
  frombot: number;
  tobot: number;
  pagesbot = 1;
  datasendBot = {
    page: 1,
    sampleid : this.data.id_sample,
    search: null,
  }
  parameterData = [];
  total: number;
  from: number;
  to: number;
  pages = 1;
  datasend = {
    page: 1,
    sampleid : this.data.id_sample,
    search: null,
  }
  descData = [];
  // end edited
  datasentLab = {
    pages : 1,
    search : null,
    typeContract: null
  }
  labs = [];
  idsample = this.data.id_sample;
  samples= this.data;

  constructor(
    private _masterServ: PreparationService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _formBuild: FormBuilder,
    private _route: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _labService: LabService,
    private _dialogRef: MatDialogRef<ModalbobotComponent>
  ) {
   
   }

  ngOnInit(): void {
    this.getBobot();
    this.modalBobotForm = this.createLabForm();
    this.addBobotForm = this.bobotForm();
    this.getDataLab();
    this.getParameter();
    console.log(this.data)
  }

  getDataLab(){
    this._labService.getDataLab(this.datasentLab).then(x => {
      this.labs = this.labs.concat(x['data']);
      console.log(this.labs);
    })
  }

  onScrollToEnd(e) {
    this.load = true;
    if (e === "lab") {
        this.datasentLab.pages = this.datasentLab.pages + 1;
        this.getDataLab();
    }
    setTimeout(() => {
        this.load = false;
    }, 200);
  }

  async getParameter(){
    await this._masterServ.getDataDetailPreparationParameter(this.datasend).then(x => {
      this.parameterData = this.parameterData.concat(x['data']);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }  
      console.log(this.parameterData)
    }) 
  }

  paginated(f){
    this.parameterData = [];
    this.datasend.page = f.pageIndex + 1;
    this.getParameter();
  }

  sortData(sort: Sort) {
    const data = this.parameterData.slice();
    if ( !sort.active || sort.direction === '') {
      this.parameterData = data;
      return;
    }
    this.parameterData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name_id': return this.compare(a.parameteruji.name_id, b.parameteruji.name_id, isAsc);
        case 'name_en': return this.compare(a.parameteruji.name_en, b.parameteruji.name_en, isAsc);
        case 'nama_lab': return this.compare(a.parameteruji.lab.nama_lab, b.parameteruji.lab.nama_lab, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

   async getBobot(){
     console.log(this.datasendBot)
      await this._masterServ.getDataBobot(this.datasendBot).then(x => {
        this.getDataBobots = this.getDataBobots.concat(x['data']);
        if(!this.totalbot){
          this.totalbot = x['total'];
          this.frombot = x['from'] - 1;
          this.tobot = x['to']
        }  
        console.log(this.getDataBobots)
    })
  }

  paginateBobot(f){
    this.getDataBobots = [];
    this.datasendBot.page = f.pageIndex + 1;
    this.getBobot();
  }

  bobotForm(): FormGroup { 
    return this._formBuild.group({
      id_lab : ['',{ validator: Validators.required }],
      value : ['',{ validator: Validators.required }]
    })
  }

  saveDataBobot(){
    console.log(this.addBobotForm);
    this._masterServ.addBobotinSample(this.data.id_sample, this.addBobotForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.getDataBobots = [];
        this.getBobot();
        this.load = false;
      },1000)
    })
  }

  async deleteDataBobot(id){
    console.log(id);
    this._masterServ.deleteBobotinSample(id).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.getDataBobots = [];
        this.getBobot();
        this.load = false;
      },1000)
    })
  }
  
 
  onScrollToEndLab() {
    this.loading = true; 
          this.datasend.page = this.datasend.page + 1;
          this.getDataLab(); 
    
    setTimeout(() => {
        this.loading = false;
    }, 200);
  }

  createLabForm(): FormGroup {
    return this._formBuild.group({
      value_bobot :[{
          value: this.dataTambahBobot.value !== 'add' ? this.dataTambahBobot.value : '',
          disabled: this.dataTambahBobot.value !== 'add' ? false : true
        }]
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  closeModal(ev){
    return this._dialogRef.close({
      ev
    });
  }

  photogallery(id_sample) : void {
    const dialogRef = this.dialog.open(PhotoPrepComponent, {
      data: id_sample,
      height: "auto",
      width: "600px",
      panelClass: 'photo-controls-modal',
    });
    console.log(id_sample)

    dialogRef.afterClosed().subscribe(result => {
     
    });
  }

  async getModalAddPhoto(v) {
    console.log(v)
    const dialogRef = await this.dialog.open(
        ModalPhotoViewcontractComponent,
        {
            height: "auto",
            width: "800px",
            panelClass: "parameter-modal",
            data: {
                samplename: v.sample.sample_name,
                id_sample: v.id_sample,
                no_sample: v.sample.no_sample,
            },
        }
    );

    await dialogRef.afterClosed().subscribe(async (result) => {
        await console.log(result);
    });
}


  descriptionInfoModals(id, select) : void 
  {
    let dialogCust = this.dialog.open(MemopreparationdialogComponent, {
      panelClass: 'memoprep-dialog',
      data: { idContract : this.data.id_kontrakuji,  idSample : id, select : select} ,
      disableClose : true,
    });
    
    dialogCust.afterClosed().subscribe((result) => {
      if(result.ev == false){
       console.log('wew')
       }
    });
  }


  

}
