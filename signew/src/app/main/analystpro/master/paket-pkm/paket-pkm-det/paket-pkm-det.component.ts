import { Component, OnInit, ViewEncapsulation, HostListener, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaketparameterService } from '../../paketparameter/paketparameter.service';
import { PaketPkmService } from '../paket-pkm.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { StandartService } from '../../../master/standart/standart.service';
import { LodService } from '../../../master/lod/lod.service';
import { UnitService } from '../../unit/unit.service';
import { MetodeService } from '../../metode/metode.service';
import { LabService } from '../../lab/lab.service';
import Swal from 'sweetalert2';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { MatDialog } from "@angular/material/dialog"; 
import { ContractService } from '../../../services/contract/contract.service';
import * as global from 'app/main/global';
import { MatTable } from "@angular/material/table";

@Component({
  selector: 'app-paket-pkm-det',
  templateUrl: './paket-pkm-det.component.html',
  styleUrls: ['./paket-pkm-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PaketPkmDetComponent implements OnInit {

  @ViewChild("table") MatTable: MatTable<any>;
  parameterForm: FormArray = this._formBuild.array([]);
  subject: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
  array$: Observable<any> =  this.subject.asObservable();
  _unsubscribeAll = new BehaviorSubject<any>([]);
  datasub = {
    page: 1,
    id_catalogue: null,
    search: null,
  };

  dataunit = [];
  dataMetode = [];
  datasendunit = {
    pages: 1,
    search: null
  }
  datasendmetode = {
    pages: 1,
    search: null
  }

  paketparameterForm: FormGroup;
  detaildata = [];
  displayedColumns: string[] = ['no','action','name_id', 'lab', 'n', 'c', 'm', 'mm', 'harga' , 'unit', 'metode', 'standart' ];
  idpaketparameter: any;
  paketujichoose = [];
  paketujiData = [];
  paketparameterchoose = [];
  paketparametercombine = [];
  parameterUjiData = [];
  paketparametertotal: number = 0;
  jumlah: number;
  valuechoose = [];
  loading = false;

  datastandart = [];
  detailmodal = false;

  datasendstandart ={
    pages: 1,
    search: null
  }
  datasendlab ={
    pages: 1,
    search: null
  }
  datalod = [];
  datalab= [];
  datasendlod = {
    pages: 1,
    search: null
  }

  datasend = {
    pages: 1,
    search: null,
  }
  datasendParameterUji = {
    pages: 1,
    search: null,
  }
  dataId = {
    id_paketuji: '',
    parameteruji: []
  }
  ideditpaketuji: number;
  hide = true;
  load = false;
  saving = false;
  disc = [
    {value: 1, viewValue: 'Yes'},
    {value: 0, viewValue: 'No'},
  ];
  dataCopy = null;
  btnPaste = false;
  selectedReference: string;

  dataselectPaketParameter = {
    page: 1,
    search: null,
};
dataPaketuji = [];
screenHeight;
screenWidth;
@HostListener('window:resize', ['$event'])onResize(event?) {
  this.screenHeight = window.innerHeight;
  this.screenWidth = window.innerWidth;
}
jumlahapprove = 0;
copydataparameter = [];
disablepasteall = true;
allchecked = false;

  constructor(
    private _masterServ: PaketparameterService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _standartServ: StandartService,
    private _lodServ: LodService,
    private _unitServ: UnitService,
    private _labServ: LabService,
    private dialog: MatDialog,
    private _metodeServ: MetodeService,
    private _kontrakServ: ContractService,
    private _paketPkmServ: PaketPkmService

  ) {  
    this.onResize();
    this.idpaketparameter = this._actRoute.snapshot.params['id'];
  }

  checkstatus(value){
    console.log(value);
  }

  copydata(value, index){
    this.copydataparameter = [];
        this.copydataparameter = this.copydataparameter.concat(
            this.parameterForm.controls[index].value
        );
        this.disablepasteall = false;
  }

  deletedata(value,index){
    if(index == 'all'){
      this.parameterForm.controls = [];
      this.paketparameterchoose = [];
      this.allchecked = false;
    } else {
      this.parameterForm.removeAt(index);
      this.paketparameterchoose = this.paketparameterchoose.filter(x => x.id !== value.id);
    }
  }

  

  checkAll(event, status, index?){
    if (status !== "all") {
      this.setvaluecheck(event, index);
  } else {
    this.allchecked = true;
      for (let z = 0; z < this.parameterForm.length; z++) {
          this.setvaluecheck(event, z);
      }
  }
  this.setjumlahceklist();
  }

  setjumlahceklist() {
    this.jumlahapprove = this.parameterForm.controls.filter(
        (x) => x.value.checked
    ).length;
}

  setvaluecheck(event, index) {
    if (event) {
        this.parameterForm.controls[index]["controls"].checked.setValue(
            true
        );
    } else {
        this.parameterForm.controls[index]["controls"].checked.setValue(
            false
        );
    }
    this.allchecked = false;
}

  ngOnInit(): void {
    
    if(this.idpaketparameter === "add"){ 
      this.detailmodal = true; 
      this.paketparameterForm = this.createLabForm();
    } else {
      this.getDetailPaketPkm(this.idpaketparameter);
    }
    this.getParameterUji();
  }

  selectingReference(ev){
    console.log(ev);
  }

  getDetailPaketPkm(v){
    this._paketPkmServ.getDataDetailpaketpkm(v).then(x => {
      this.paketparameterForm = this.addValueForm(x);
      x['subspecific'].forEach(v => {
        this.paketparameterchoose = this.paketparameterchoose.concat(v);
        this.addFormParameterEdit(v);
        this.setValueTemporary(v.detail_specific[0]);
      })
    });
  }

  addValueForm(e): FormGroup {

    return this._formBuild.group({ 
        nama_paket :[e.package_name],
        nama_paket_en :[e.package_name_en],
        price :[''], 
        description:[e.description],
        discount: [e.disc.toString()],
        reference:['nonpaket'],
        parameterpick: [this.idpaketparameter],
        paketujipick: [null],
        parameter: this.parameterForm
    })
  }

  pastedata(a, i) {
    if (i == "all") {
        global.swalyousure("You will paste this Data!").then((result) => {
            if (result.value) {
                for (
                    let z = 0;
                    z < this.parameterForm.controls.length;
                    z++
                ) {
                    this.setValue(z);
                }
                Swal.fire(
                    "Paste success!",
                    "Your data has been change.",
                    "success"
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "Your Data is Safe", "error");
            }
        });
    } else {
        this.setValue(i);
    }
}


  getdataPaketuji() {
    this._kontrakServ
        .getDataPaketUji(this.dataselectPaketParameter)
        .then((paketparameter) => {
            console.log(paketparameter["data"]);
            this.dataPaketuji = this.dataPaketuji.concat(
                paketparameter["data"]
            );
        }).then(() => this.dataPaketuji = global.uniq(this.dataPaketuji, it => it.id));
}

setValue(i,e?) {
  this.parameterForm.controls[i]["controls"].id_parameter_uji.setValue(
      !e ? this.copydataparameter[0].id_parameter_uji : e.id
  );
  this.parameterForm.controls[i]["controls"].parameteruji_code.setValue(
      !e ? this.copydataparameter[0].parameteruji_code : e.parameteruji[0].parameter_code
  );
  this.parameterForm.controls[i]["controls"].parameteruji_name.setValue(
      !e ? this.copydataparameter[0].parameteruji_name : e.parameteruji[0].name_id
  );
  this.parameterForm.controls[i]["controls"].nama_standart.setValue(
      !e ? this.copydataparameter[0].nama_standart : e.standart.nama_standart
  );
  this.parameterForm.controls[i]["controls"].kode_standart.setValue(
      !e ? this.copydataparameter[0].kode_standart : e.standart.kode_standart
  );
  this.parameterForm.controls[i]["controls"].id_standart.setValue(
      !e ? this.copydataparameter[0].id_standart : e.standart.id
  );
  this.parameterForm.controls[i]["controls"].nama_unit.setValue(
      !e ? this.copydataparameter[0].nama_unit : e.unit.nama_unit
  );
  this.parameterForm.controls[i]["controls"].kode_unit.setValue(
      !e ? this.copydataparameter[0].kode_unit : e.unit.kode_unit
  );
  this.parameterForm.controls[i]["controls"].id_unit.setValue(
      !e ? this.copydataparameter[0].id_unit : e.unit.id
  );
  this.parameterForm.controls[i]["controls"].metode.setValue(
      !e ? this.copydataparameter[0].metode : e.metode.metode
  );
  this.parameterForm.controls[i]["controls"].kode_metode.setValue(
      !e ? this.copydataparameter[0].kode_metode : e.metode.kode_metode
  );
  this.parameterForm.controls[i]["controls"].id_metode.setValue(
    !e ? this.copydataparameter[0].id_metode : e.metode.id
);
  this.parameterForm.controls[i][
      "controls"
  ].id_lod.setValue(
      !e ? this.copydataparameter[0].id_lod : e.lod.id
  );
  this.parameterForm.controls[i]["controls"].n.setValue(
      !e ? this.copydataparameter[0].n : ''
  );
  this.parameterForm.controls[i]["controls"].harga.setValue(
    !e ? this.copydataparameter[0].harga : ''
);
  this.parameterForm.controls[i]["controls"].m.setValue(
      !e ? this.copydataparameter[0].m : ''
  );
  this.parameterForm.controls[i]["controls"].mm.setValue(
    !e ? this.copydataparameter[0].mm : ''
);
this.parameterForm.controls[i]["controls"].c.setValue(
  !e ? this.copydataparameter[0].c : ''
);
  this.parameterForm.controls[i]["controls"].id_lab.setValue(
      !e ? this.copydataparameter[0].id_lab : e.lab.id
  );
  this.parameterForm.controls[i]["controls"].kode_lab.setValue(
      !e ? this.copydataparameter[0].kode_lab : e.lab.kode_lab
  );
  this.parameterForm.controls[i]["controls"].nama_lab.setValue(
      !e ? this.copydataparameter[0].nama_lab : e.lab.nama_lab
  );
}

  async getValPaketuji(v) {
    await console.log(v);
  }

  getVal(value,st){
    console.log('a');
  }

  tambah(){
    if(this.paketparameterForm.controls.paketujipick.value == null){
      let getdataparameter = this.parameterUjiData.filter(x => x.id === this.paketparameterForm.controls.parameterpick.value);
      let ev =getdataparameter[0];
      this.paketparameterchoose = this.paketparameterchoose.concat(ev);
      let parameteruji = this._formBuild.group({
        id: [null],
        checked: [false],
        id_parameter_uji: [ev.id],
        parameteruji_code: [ev.parameter_code],
        parameteruji_name: [ev.name_id],
        nama_standart: [null],
        kode_standart: [null],
        id_standart: [null],
        nama_unit: [null],
        kode_unit: [null],
        id_unit: [null],
        metode: [null],
        kode_metode: [null],
        id_metode: [null],
        id_lod: [null],
        n: [null],
        m: [null],
        c: [null],
        mm: [null],
        harga: [null],
        id_lab: [ev.lab.id],
        kode_lab: [ev.lab.kode_lab],
        nama_lab: [ev.lab.nama_lab]
    });
    this.datalab = this.datalab.concat({
      id: ev.lab.id,
      kode_lab: ev.lab.kode_lab,
      nama_lab: ev.lab.nama_lab
    });

    this.datalab = global.uniq(this.datalab, it => it.id);
    this.parameterForm.push(parameteruji);
    } else {
      this._kontrakServ.getDataPaketParameter(this.paketparameterForm.controls.paketujipick.value).then((paket) => {
        let a = [];
        a = a.concat(paket); 
        a.forEach((f) => {
            f.paketparameter.forEach((k) => {
                this.paketparameterchoose = this.paketparameterchoose.concat({
                    id: k.id_parameter_uji,
                    id_paket: k.id_paketuji,
                    info_id: k.id_paketuji,
                    no: this.paketparameterchoose.length + 1,
                    name_id: k.parameteruji[0].name_id, 
                    name_en: k.parameteruji[0].name_en, 
                    parameter_code: k.parameteruji[0].parameter_code,
                    lod: k.lod.nama_lod,
                    standart: k.standart.nama_standart,
                    unit: k.unit.nama_unit,  
                    status: f.kode_paketuji,
                    metode: k.metode.metode,
                    hargaParameter: f.price,
                    id_lod: k.id_lod,
                    id_standart: k.id_standart,
                    id_unit: k.id_unit,
                    id_metode: k.id_metode,
                    id_lab: k.id_lab, 
                });
                this.setValueTemporary(k);
                this.addFormParameter(k);
            });
        });
    });
    }
  }

  setValueTemporary(k){
    this.datalab = this.datalab.concat({
      id: k.lab.id,
      kode_lab: k.lab.kode_lab,
      nama_lab: k.lab.nama_lab
    });

    this.datalab = global.uniq(this.datalab, it => it.id);

    this.dataunit = this.dataunit.concat({
      id: k.unit.id,
      kode_unit: k.unit.kode_unit,
      nama_unit: k.unit.nama_unit
    })

    this.dataunit = global.uniq(this.dataunit, it => it.id);

    this.dataMetode = this.dataMetode.concat({
      id: k.metode.id,
      kode_metode: k.metode.kode_metode,
      metode: k.metode.metode
    })

    this.dataMetode = global.uniq(this.dataMetode, it => it.id);

    this.datastandart = this.datastandart.concat({
      id: k.standart.id,
      kode_standart: k.standart.kode_standart,
      nama_standart: k.standart.nama_standart
    })

    this.datastandart = global.uniq(this.datastandart, it => it.id);
  }

  event(e){
    this.valuechoose = this.valuechoose.concat(e);
  }

  async getDataUnit(){
    await this._unitServ.getDataUnit({status: 'all'}).then(x => {
      this.dataunit = this.dataunit.concat(x);
    })
    this.dataunit = await global.uniq(this.dataunit, it=> it.id);
  }

  async getDataMetode(){
    await this._metodeServ.getDataMetode({status: 'all'}).then(x => {
      this.dataMetode = this.dataMetode.concat(x);
    })
    this.dataMetode = await global.uniq(this.dataMetode, it=> it.id);
  }

  async getDataLab(){
    await this._labServ.getDataLab({all: 'all',}).then(x => {
      this.datalab = this.datalab.concat(x); 
    })
    this.datalab = await global.uniq(this.datalab, it=> it.id);
  }

  async getDataStandart(){
    await this._standartServ.getDataStandart({status: 'all'}).then(x => {
      this.datastandart = this.datastandart.concat(x); 
    })
    this.datastandart = await global.uniq(this.datastandart, it=> it.id);
  }

  async getDataLod(){
    await this._lodServ.getDataLod({status: "all"}).then(x => {
      this.datalod = this.datalod.concat(x); 
    })
    this.datalod = await global.uniq(this.datalod, it=> it.id);
  }
 

  getValDataPaketuji(ev,identifier){
    if(identifier === 'lod'){
      // console.log(ev); 
      this.paketujichoose = [];
      this.paketujichoose = this.paketujichoose.concat(ev);
    } else if (identifier === 'standart'){
      // console.log(ev);
      this.paketujichoose = [];
      this.paketujichoose = this.paketujichoose.concat(ev);
    } else if (identifier === 'unit'){
      // console.log(ev);
      this.paketujichoose = [];
      this.paketujichoose = this.paketujichoose.concat(ev);
    } else {
      this.paketujichoose = [];
      this.paketujichoose = this.paketujichoose.concat(ev);
      this.paketparameterchoose = this.paketparameterchoose.filter(x => x);
      // console.log(this.paketujichoose);
    }  
    // console.log(this.paketujichoose);
  }
  
  // onScrollToEnd() {
  // 
  // }
  
 

  resetPaketuji() { 
    this.paketujichoose = [];
    // this.getPaketuji();
  }


  onScrollToEnd(e) {
    this.loading = true;
    if (e === "lod") {
        this.datasendlod.pages = this.datasendlod.pages + 1;
        this.getDataLod();
    }
    
    if(e === 'standart'){
      this.datasendstandart.pages = this.datasendstandart.pages + 1;
      this.getDataStandart();
    }

    if(e === 'paketuji'){
      this.datasend.pages = this.datasend.pages + 1;
      // this.getPaketuji();
    }

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
    } else if(identifier == 'paketuji'){
      this.datasend.search = ev.term;
      this.datasend.pages = 1;
      this.paketujiData = [];
      // this.getPaketuji();
    } else if(identifier == 'lab'){
      // console.log('lab');
    } else {
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
    } else if (ev === 'paketuji'){
        this.datasend.search = null;
        this.datasend.pages = 1;
        this.paketujiData = [];
        // this.getPaketuji();
    } else {
      this.datasendunit.search = null;
        this.datasendunit.pages = 1;
        this.dataunit = [];
        this.getDataUnit();
    }
}


  async getParameterUji(){
    await this._masterServ.getDataParameterUji(this.datasendParameterUji).then(x => {
      this.parameterUjiData = this.parameterUjiData.concat(x['data']);
    })
    this.parameterUjiData = await global.uniq(this.parameterUjiData, it => it.id); 
  }

  clickSelect(e, v) {
    if (v == "satuan") {
        this.getDataUnit();
    } else if (v == "lod") {
        this.getDataLod();
    } else if (v == "metode") {
        this.getDataMetode();
    } else if (v == "lab"){
        this.getDataLab();
    } else {
      this.getDataStandart();
    }
}

  getValDataPaketparameter(ev){ 
    console.log(ev);
  } 

  onScrollToEndParameter(ev){
    this.datasendParameterUji.pages = this.datasendParameterUji.pages + 1;
    if(ev === 'parameteruji'){      
      this.getParameterUji();
    } else {
      this.getdataPaketuji();
    }
  }

  onSearchPaketParameter(ev) {
    this.dataselectPaketParameter.search = ev.term;
    this.dataselectPaketParameter.page = 1;
    this.dataPaketuji = [];
    this.getdataPaketuji();
}

clearSelect(v) {
  if (v === "paketparameter") {
      this.dataselectPaketParameter.search = null;
      this.dataselectPaketParameter.page = 1;
      this.dataPaketuji = [];
      this.getdataPaketuji();
  } 
}

  deleteall(){
    this.paketparametercombine = [];
    this.paketparameterchoose = [];
  }
 

  resetPaketparameter() { 
    this.datasendParameterUji.pages = 1;
    this.datasendParameterUji.search = null;
    this.getParameterUji();
  } 

  sad(ev){
    console.log(ev);
    this.datasendParameterUji.search = ev.term;
    this.datasendParameterUji.pages = 1;
    this.getParameterUji();
  }
  
  async onSearchParameter(ev){
    this.datasendParameterUji.search = await ev.term;
    this.datasendParameterUji.pages = await 1;
    await this.getParameterUji();
  }

  saveNewForm(){ 
    global.swalyousure(`this will add 1 package with name "${this.paketparameterForm.value.nama_paket.toUpperCase()}" and ${this.paketparameterForm.value.parameter.length} Parameter`).then(result => {
      if(result.value){
       let checkdata = this.parameterForm.value.filter(x => !x.id_metode || !x.id_lab || !x.id_standart || !x.harga || !x.n || !x.id_unit);
        if(checkdata.length > 0 || !this.paketparameterForm.value.nama_paket){
          Swal.fire('Error','Semua Form Harus di isi mohon maaf','error');
        } else {
          this._paketPkmServ.addDatapaketpkm(this.paketparameterForm.value).then(x => {
            if(x[0]['status']){
              Swal.fire('Success',x[0]['message'],'success');
              setTimeout(()=>{
                this._route.navigateByUrl('analystpro/paket-special');
              })
            } else {
              Swal.fire('Error',x[0]['message'],'error');
            }
          })
        }
      } else {
        Swal.fire("Cancelled", "Your Data is Safe", "error");
      }
    })
    // console.log();

  }


  editForm(){ 
    global.swalyousure(`this will add 1 package with name "${this.paketparameterForm.value.nama_paket.toUpperCase()}" and ${this.paketparameterForm.value.parameter.length} Parameter`).then(result => {
      if(result.value){
       let checkdata = this.parameterForm.value.filter(x => !x.id_metode || !x.id_lab || !x.id_standart || !x.n || !x.id_unit);
        if(checkdata.length > 0 || !this.paketparameterForm.value.nama_paket){
          Swal.fire('Error','Semua Form Harus di isi mohon maaf','error');
        } else {
          // console.log(this.paketparameterForm.value);
          this._paketPkmServ.updateDatapaketpkm(this.idpaketparameter, this.paketparameterForm.value).then(x => {
            if(x[0]['status']){
              Swal.fire('Success',x[0]['message'],'success');
              setTimeout(()=>{
                this._route.navigateByUrl('analystpro/paket-special');
              })
            } else {
              Swal.fire('Error',x[0]['message'],'error');
            }
          })
        }
      } else {
        Swal.fire("Cancelled", "Your Data is Safe", "error");
      }
    })
  }



  createLabForm(): FormGroup {

    return this._formBuild.group({
       
        nama_paket :[''],
        nama_paket_en :new FormControl(),
        price :[''], 
        description:[''],
        reference:['nonpaket'],
        discount: [''],
        parameterpick: [null],
        paketujipick: [null],
        parameter: this.parameterForm
    })
  }

  addFormParameterEdit(d){
    const parameterFormat = this._formBuild.group({
      id: [d.id],
      checked: [false],
      id_parameter_uji: [d.detail_specific[0].parameteruji_id],
      discount: [d.disc],
      parameteruji_code: [d.detail_specific[0].parameteruji.parameter_code],
      parameteruji_name: [d.detail_specific[0].parameteruji.name_id],
      nama_standart: [d.detail_specific[0].standart.nama_standart],
      kode_standart: [d.detail_specific[0].standart.kode_standart],
      id_standart: [d.detail_specific[0].standart.id],
      nama_unit: [d.detail_specific[0].unit.nama_unit],
      kode_unit: [d.detail_specific[0].unit.kode_unit],
      id_unit: [d.detail_specific[0].unit.id],
      metode: [d.detail_specific[0].metode.metode],
      kode_metode: [d.detail_specific[0].metode.kode_metode],
      id_metode: [d.detail_specific[0].metode.id],
      n: [d.jumlah],
      c: [d.perka ? d.perka.c : null],
      m: [d.perka ? d.perka.m: null],
      mm: [d.perka ? d.perka.mm : null],
      harga: [d.price],
      id_lab: [d.detail_specific[0].lab.id],
      kode_lab: [d.detail_specific[0].lab.kode_lab],
      nama_lab: [d.detail_specific[0].lab.nama_lab]
  });
  this.parameterForm.push(parameterFormat);
  }

  addFormParameter(d){
    const parameterFormat = this._formBuild.group({
      checked: [false],
      id_parameter_uji: [d.id_parameter_uji],
      parameteruji_code: [d.parameteruji[0].parameter_code],
      parameteruji_name: [d.parameteruji[0].name_id],
      nama_standart: [d.standart.nama_standart],
      kode_standart: [d.standart.kode_standart],
      id_standart: [d.standart.id],
      nama_unit: [d.unit.nama_unit],
      kode_unit: [d.unit.kode_unit],
      id_unit: [d.unit.id],
      metode: [d.metode.metode],
      kode_metode: [d.metode.kode_metode],
      id_metode: [d.metode.id],
      id_lod: [d.lod.id],
      n: [d.n],
      c: [d.c],
      m: [d.m],
      mm: [d.mm],
      harga: [d.harga],
      id_lab: [d.lab.id],
      kode_lab: [d.lab.kode_lab],
      nama_lab: [d.lab.nama_lab]
  });
  this.parameterForm.push(parameterFormat);
  }
}
