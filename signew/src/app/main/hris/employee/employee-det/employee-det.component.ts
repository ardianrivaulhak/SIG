import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { EmployeeService } from "../employee.service";
import * as global from "app/main/global";
import {
  Employee_status,
  dataEmployeeStatus,
  Level,
  Bagian
} from '../data-select';
import { DepartementService } from 'app/main/hris/departement/departement.service';
import { url, urlApi } from 'app/main/url';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  MomentDateModule,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";


export const MY_FORMATS = {
  parse: {
      dateInput: "LL",
  },
  display: {
      dateInput: "DD/MM/YYYY",
      monthYearLabel: "YYYY",
      dateA11yLabel: "LL",
      monthYearA11yLabel: "YYYY",
  },
};

@Component({
  selector: 'app-employee-det',
  templateUrl: './employee-det.component.html',
  styleUrls: ['./employee-det.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
],
})
export class EmployeeDetComponent implements OnInit {

  employeeForm: FormGroup;
  status;
  employeestatus: Employee_status[] = dataEmployeeStatus;
  level: Level[] = [{
    id_level: '0',
    level_name: 'Not Set'
  }];
  bagian: Bagian[] = [{
    id_div: '0',
    division_name: 'Not Set'
  }]
  subdiv = [];
  city = [];
  search;
  position = [];
  datadept = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _employeeServ: EmployeeService,
    private dialogRef: MatDialogRef<EmployeeDetComponent>,
    private _fb: FormBuilder,
    private deptServ: DepartementService
  ) {
    if(data){
      this.status = data.idstatus ? data.idstatus : 'add';
      if(data.idstatus){
        this.setData(data.idstatus);
      }
    }
    this.dialogRef.backdropClick().subscribe((v) => { 
      this.close();
    });
  }

  close(){
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.employeeForm = this.createForm();
    this.getBagianData();
    this.getLevelData();
    this.getSubDiv();
    this.getDataCity();
    this.getDepartementData();
    this.getDataPosition();
  }

  getDataPosition(){
    this._employeeServ.getDataPosition().then(x => this.position = this.position.concat(x['data']));
  }

  createForm(){
    return this._fb.group({
      nik: new FormControl(),
      employee_name: new FormControl(),
      division: new FormControl(),
      dept: new FormControl(),
      level: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      tempatlahir: new FormControl(),
      tgl_lahir: new FormControl(),
      alamat: new FormControl(),
      gender: new FormControl(),
      religion: new FormControl(),
      photo: new FormControl(),
      martial_status: new FormControl(),
      subdiv: new FormControl(),
      employee_status: new FormControl(),
      position: new FormControl(),
      tgl_masuk: new FormControl(),
    })
  }

  async setData(id){
    this.employeeForm = await this.createForm();
    await this._employeeServ.getDataDetail(id).then((c:any) => {
        this.employeeForm.patchValue({
          nik: c[0].nik,
          employee_name: c[0].employee_name,
          division: c[0].id_bagian ? c[0].id_bagian.toString() : null,
          dept: c[0].id_departement ? c[0].id_departement.toString() : null,
          level: c[0].id_level ? c[0].id_level.toString() : null,
          email: c[0].user ? c[0].user.email : '-',
          phone: c[0].phone ? c[0].phone : null,
          tempatlahir: c[0].tempat_lahir ? c[0].tempat_lahir.toString() : null,
          tgl_lahir: c[0].tgl_lahir ? c[0].tgl_lahir : null ,
          alamat: c[0].alamat ? c[0].alamat : null,
          gender: c[0].gender ? c[0].gender : null,
          religion: c[0].religion ? c[0].religion : null,
          photo: c[0].photo ? `${url}assets/img/user/${c[0].photo}` : null,
          martial_status: c[0].martial_status ? c[0].martial_status : null,
          subdiv: c[0].id_sub_bagian ? c[0].id_sub_bagian.toString() : null,
          employee_status: c[0].id_employee_status ? c[0].id_employee_status.toString() : null,
        })
    })
  }

  getLevelData() {
    this._employeeServ.getDataLevel()
      .then(v => {
        let a = [];
        a = a.concat(v);
        this.level = this.level.concat(a);
      })
  }

  getDepartementData(){
    this.deptServ.getDataDepartement(this.search).then(x => this.datadept = this.datadept.concat(x));
  }

  getSubDiv(){
    this._employeeServ.getSubDiv().then(x => this.subdiv = this.subdiv.concat(x));
  }

  uploadGambar(ev) : void { 
    // ev.pre
    this.readThis(ev.target); 
  }

  readThis(inputValue: any): void {

    var file:File = inputValue.files[0];

    var pattern = /image-*/;
    if (!file.type.match(pattern)) {
        alert('Upload Only Image');
        return;
    }
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => { 
        this.employeeForm.controls.photo.setValue(myReader.result);
    }
    myReader.readAsDataURL(file);
  }

  getBagianData() {
    this._employeeServ.getDataBagian().then(x => {
      let y = [];
      y = y.concat(x);
      this.bagian = this.bagian.concat(y);
    })
  }

  getDataCity(){
    this._employeeServ.getDataCity().then(h => this.city = this.city.concat(h))
  }

  // serviceAct(){
  //   if(this.status !== 'add'){
  //     this._employeeServ.updateEmployee(this.employeeForm.value,this.status).then(x => {
  //       global.swalsuccess("Success","Success Adding Employee");
  //     })
  //     .then(() => this.close())
  //     .catch(e => global.swalerror("Failed Adding Employee"));
  //   } else {
  //     this._employeeServ.storeEmployee(this.employeeForm.value)
  //     .then(x => global.swalsuccess("Success","Update Success"))
  //     .catch(e => global.swalerror("Error Update Data"))
  //   }
  // }

  serviceAct(){
    console.log(this.employeeForm.controls);
    if(
      this.employeeForm.controls.nik.value &&
      this.employeeForm.controls.employee_name.value &&
      this.employeeForm.controls.division.value &&
      this.employeeForm.controls.level.value &&
      this.employeeForm.controls.email.value &&
      this.employeeForm.controls.phone.value &&
      this.employeeForm.controls.tempatlahir.value &&
      this.employeeForm.controls.tgl_lahir.value &&
      this.employeeForm.controls.alamat.value &&
      this.employeeForm.controls.gender.value &&
      this.employeeForm.controls.religion.value &&
      this.employeeForm.controls.martial_status.value &&
      this.employeeForm.controls.subdiv.value &&
      this.employeeForm.controls.employee_status
    ) {
      if(this.status !== 'add'){
        this._employeeServ.updateEmployee(this.employeeForm.value,this.status).then(x => {
          global.swalsuccess("Success","Success Adding Employee");
        })
        .then(() => this.close())
        .catch(e => global.swalerror("Failed Adding Employee"));
      } else {
        this._employeeServ.storeEmployee(this.employeeForm.value)
        .then(x => global.swalsuccess("Success","Update Success"))
        .then(() => this.close())
        .catch(e => global.swalerror("Error Update Data"))
      }
    } else {
      global.swalerror("Harap Isi Semua Field, Gunakan '-' Untuk Mengisi tidak ada");
    }
  }
}
