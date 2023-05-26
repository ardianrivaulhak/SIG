import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { EdocsService } from "../../../edocs.service";
import *  as global from "app/main/global";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accessdocument',
  templateUrl: './accessdocument.component.html',
  styleUrls: ['./accessdocument.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AccessdocumentComponent implements OnInit {

  id = this._actRoute.snapshot.params["id"];
  load = false;
  loadingfirst = true;
  employeeData = [];
  datasend = {
    search : '',
    id_document : 0,
    pages : 1
  }

  dataFilter = {
    search: '',
    id: ''
  }

  displayedColumns: string[] = [ 
    'name_employee', 
    'division',
    'user',    
    'created', 
    'action'
  ];
  AccessData = [];
  dataDetail: any;
  buttonSelected = 'employee';
  groupData = [];
  total: number;
  from: number;
  to: number;
  pages = 1;
  datasent = {
    namegroup : ''
  }

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
    this.getAllGroup();
  }

  async getDetail()
  {
    let data = await {
      id : this.id
    }
    await this._edocServ.getDetailGroups(data).then(x => {
      this.dataDetail = x;
    })
    await console.log(this.dataDetail)
  }

  async getDataEmployee(){
    this.employeeData = await [];
     this.datasend.id_document = await this.id;
    await this._edocServ.getAllEmployeeInAccess(this.datasend).then( x => {
      this.employeeData = this.employeeData.concat(Array.from(x['data']));
      this.employeeData = global.uniq(this.employeeData, (i) => i.employee_id)
    })
    await console.log(this.employeeData)
    this.loadingfirst =  await false;
  }

  async getData(){
    this.dataFilter.id = this.id;
    await this._edocServ.AccessDocument(this.dataFilter).then( x => {
        this.AccessData = this.AccessData.concat(Array.from(x['data']))
        this.AccessData = global.uniq(this.AccessData, (i) => i.id)
    })
    await console.log(this.AccessData)
    this.loadingfirst =  await false;
  }

  search()
  {
    this.AccessData = [];
    this.getData();
  }

  reset()
  {
    this.dataFilter.search = '';
    this.AccessData = [];
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
      id_document : this.id
    }
    this._edocServ.addUserToAccessDocument(data).then(x => {
      this.load = true;
      let message = {
          text: "Data Succesfully Updated",
          action: "Done",
      };
      setTimeout(() => {
          this.openSnackBar(message);
          this.employeeData = [];
          this.getDataEmployee();
          this.AccessData = [];
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
        this._edocServ.deleteUserToAccessDocument(id).then(x => {
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
        this.AccessData=[];
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

  async setButton(ev)
  {
    this.buttonSelected = await ev;

  }

  async getAllGroup()
  {
    await this._edocServ
      .getGroups(this.datasent)
      .then((x) => {
        this.groupData = this.groupData.concat(
          Array.from(x["data"])
        );
        this.total = x["total"];
        this.pages = x["current_page"];
        this.from = x["from"];
        this.to = x["to"];
      }) 
      .then(
          () =>
              (this.groupData = global.uniq(
                  this.groupData,
                  (it) => it.id
              ))
      )
    await console.log(this.groupData)
  }

  AddByGroup(id){
    let data = {
      id_document : this.id,
      id_group: id
    }
    this._edocServ.addUserByGroup(data).then(x => {
      this.load = true;
      let message = {
          text: "Data Succesfully Updated",
          action: "Done",
      };
      setTimeout(() => {
          this.openSnackBar(message);
          this.employeeData = [];
          this.getDataEmployee();
          this.AccessData = [];
          this.getData();
          this.load = false;
      }, 2000);
    })
  }


}
