import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
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
import * as global from "app/main/global";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { UserService } from '../user.service';

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
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  providers: [
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class UserModalComponent implements OnInit {
  datasendemployee = {
    pages: 1,
    search: null,
    status: 1
  };
  userForm: FormGroup;
  employee_data = [];
  divisiondata = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<UserModalComponent>,
    private _fb: FormBuilder,
    private employeeServ: EmployeeService,
    private _userServ: UserService
  ) { 
    if(data){
        setTimeout(()=>{
            if(data.status == 'edit'){
              this.setEdit(data.data);
            }
        },1000);
      }
  }

  ngOnInit(): void {
    this.userForm = this.createUserForm();
    this.getDataEmployee();
    this.getDataDiv();
  }

  createUserForm(): FormGroup {
    return this._fb.group({
        id_employee: new FormControl(),
        email: new FormControl(),
        divisi: new FormControl(),
        active: new FormControl(),
    })

  }

  getDataEmployee() {
    this.employeeServ
        .getData(this.datasendemployee)
        .then(
            (x) =>
                (this.employee_data = this.employee_data.concat(x["data"]))
        ).then(() => global.uniq(this.employee_data, it => it.employee_id));
}

getDataDiv(){
  this._userServ.getDivision().then(h => this.divisiondata = this.divisiondata.concat(h['data']))
}

  setEdit(h){
      this.employee_data = this.employee_data.concat({
        employee_id: h.employee_id,
        employee_name: h.employee_name,
        nik: h.nik
      });
      this.employee_data = global.uniq(this.employee_data, it => it.employee_id);
      this.userForm.patchValue({
          id_employee: h.employee_id,
          email: h.email ? h.email : null,
          divisi: h.bagian ? h.bagian : null,
          active: h.email ? 1 : 0
    })
  }

  reset(val) {
    switch (val) {
      case 'employee' : 
        this.datasendemployee = {
          pages: 1,
          search: null,
          status: 1
        };
        this.employee_data = [];
        this.getDataEmployee();
      break;
    } 
}

async onSearch(ev) {
  this.datasendemployee = await {
      pages: 1,
      search: ev.term.toUpperCase(),
      status: 1
  };
  this.employee_data = await [];
  await this.getDataEmployee();
}

onScrollToEnd(d) {
  this.datasendemployee = {
      pages: this.datasendemployee.pages + 1,
      search: null,
      status: 1
  };
  this.getDataEmployee();
}

action(val){
  return this._dialogRef.close({
    data: this.userForm.value,
    status: val
  });
}

}
