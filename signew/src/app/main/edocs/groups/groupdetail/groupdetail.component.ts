import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { EdocsService } from "../../edocs.service";
import *  as global from "app/main/global";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-groupdetail',
  templateUrl: './groupdetail.component.html',
  styleUrls: ['./groupdetail.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class GroupdetailComponent implements OnInit {
  id_group = this._actRoute.snapshot.params["id"];
  load = false;
  loadingfirst = true;
  employeeData = [];
  datasend = {
    search : '',
    added : '',
    pages : 1
  }

  dataFilter = {
    id_group : this._actRoute.snapshot.params["id"],
    search: ''
  }

  displayedColumns: string[] = [ 
    'name_employee', 
    'division',
    'user',    
    'created', 
    'action'
  ];
  groupData = [];
  dataDetail: any;

  constructor(
    private _edocServ : EdocsService,
    private _actRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _route : Router
  ) { }

  ngOnInit(): void {
    this.getDetail();
    this.getDataEmployee();
    this.getData();
  }

  async getDetail()
  {
    let data = await {
      id : this.id_group
    }
    await this._edocServ.getDetailGroups(data).then(x => {
      this.dataDetail = x;
    })
    await console.log(this.dataDetail)
  }

  async getDataEmployee(){
     this.datasend.added = await this.id_group;
    await this._edocServ.getEmployee(this.datasend).then( x => {
      this.employeeData = this.employeeData.concat(Array.from(x['data']));
      this.employeeData = global.uniq(this.employeeData, (i) => i.employee_id)
    })
    await console.log(this.employeeData)
    this.loadingfirst =  await false;
  }

  async getData(){
    await this._edocServ.getTransactionEmployee(this.dataFilter).then( x => {
      this.groupData = this.groupData.concat(Array.from(x['data']));
      this.groupData = global.uniq(this.groupData, (i) => i.id)
    })
    await console.log(this.groupData)
    this.loadingfirst =  await false;
  }

  search()
  {
    this.groupData = [];
    this.getData();
  }

  reset()
  {
    this.dataFilter.search = '';
    this.groupData = [];
    this.getData();
  }

  async onScrollToEnd(e) {
    this.datasend.pages = this.datasend.pages + 1; 
    await this._edocServ.getEmployee(this.datasend).then( x => {
      this.employeeData = this.employeeData.concat(x['data']);
      console.log(this.employeeData);
    });
    
  }

  searching(e)
  { 
    console.log(this.datasend)
    this.employeeData = [];
    this.getDataEmployee();
  }

  AddMember(id){
    let data = {
      id_user : id,
      id_group : this.id_group
    }
    this._edocServ.addUserToGroup(data).then(x => {
      this.load = true;
      let message = {
          text: "Data Succesfully Updated",
          action: "Done",
      };
      setTimeout(() => {
          this.openSnackBar(message);
          this.employeeData = [];
          this.getDataEmployee();
          this.groupData = [];
          this.getData();
          this.load = false;
      }, 2000);
    })
  }

  deleteMember(id)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._edocServ.removeUserInGroup(id).then(x => {
        })
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
      setTimeout(()=>{
        this.groupData=[];
        this.loadingfirst =  true;        
        this.getData()
      },1000)
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }



}
