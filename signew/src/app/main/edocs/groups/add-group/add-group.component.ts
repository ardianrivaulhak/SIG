import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { EdocsService } from "../../edocs.service";
import *  as global from "app/main/global";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AddGroupComponent implements OnInit {
  loadingfirst = true
  load = false;
  datasend = {
    search : '',
    pages : 1
  }
  employeeData = [];
  dataForm = {
    group_name : '',
    employee : []
  }
  constructor(
    public dialogRef: MatDialogRef<AddGroupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _edocServ : EdocsService
  ) { }

  ngOnInit(): void {
    this.getDataEmployee();
  }

  async getDataEmployee(){
    await this._edocServ.masterEmployee(this.datasend).then( async  x  => {
      let b = await [];
      b = await b.concat(Array.from(x['data']));
      b.forEach(a => {
          this.employeeData = this.employeeData.concat({
            id : a.employee_id,
            employee_name : a.employee_name,
            division : a.bagian.division_name,
            add : false

          })
      });
      this.employeeData = global.uniq(this.employeeData, (i) => i.id)
    })
    await console.log(this.employeeData)
    this.loadingfirst =  await false;
  }

  async onScrollToEnd(e) {
    this.datasend.pages = this.datasend.pages + 1; 
    await this._edocServ.getEmployee(this.datasend).then(async x => {
      let b = await [];
      b = await b.concat(Array.from(x['data']));
      b.forEach(a => {
          this.employeeData = this.employeeData.concat({
            id : a.employee_id,
            employee_name : a.employee_name,
            division : a.bagian.division_name,
            add : false

          })
      });
      this.employeeData = global.uniq(this.employeeData, (i) => i.id)
    });
    
  }

  async searching(e)
  { 

    let result = this.employeeData.filter(o => o.employee_name.includes(this.datasend.search));
     this.employeeData = await []
     this.employeeData = this.employeeData.concat(result)
  }

  closeModal(ev){
    return this.dialogRef.close({
      ev
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  addMember(i, id)
  {
    console.log(i)
    let a = [];
    this.employeeData[i].add = true;
    a = a.concat(i);
    console.log(a)
    a.forEach( x => {
      this.dataForm.employee = this.dataForm.employee.concat({id})
    })
    this.dataForm.employee = global.uniq(this.dataForm.employee, (i) => i.id)
    console.log(this.dataForm)
  }

  async removeMember(i, id)
  {
    await console.log(i)
    this.employeeData[i].add = await false;
    this.dataForm.employee = await this.dataForm.employee.filter( x => {  
      return id != x.id
    })
    await console.log(this.dataForm.employee)
  }

  async createGroup()
  {
    if(this.dataForm.group_name == ''){
      await Swal.fire({
        title: "Incomplete Data",
        text: "Please complete the blank data!",
        icon: "warning",
        confirmButtonText: "Ok",
    });
    }else{
      await this._edocServ.addNewGroup(this.dataForm).then((x) => {
        this.load = true;
        let message = {
            text: "Data Succesfully Created",
            action: "Done",
        };
        setTimeout(() => {
            this.openSnackBar(message);
            this.closeModal(false)
            this.load = false;
        }, 2000);
    });
    await console.log(this.dataForm)
    }
  }

}
