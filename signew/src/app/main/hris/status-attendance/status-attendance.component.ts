import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StatusAttendanceService } from './status-attendance.service';
import { fuseAnimations } from '@fuse/animations';
 import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import { MatDialog } from "@angular/material/dialog";
import { ModalStatusAttendanceComponent } from './modal-status-attendance/modal-status-attendance.component';
import * as global from 'app/main/global';


@Component({
  selector: 'app-status-attendance',
  templateUrl: './status-attendance.component.html',
  styleUrls: ['./status-attendance.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class StatusAttendanceComponent implements OnInit {

  datastatus = [];
  search;
  displayedColumns: string[] = ['status_code', 'status_name','action' ];
  datamentah = [];

  constructor(
    private _masterServ: StatusAttendanceService,
    private _router: Router,
    private _menuServ: MenuService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getDataStatusAttendance();
  }

  onSearchChange(ev){
    if(ev.length > 0){
      this.datastatus = this.datamentah.filter(x => x.status_name.toLowerCase().indexOf(ev.toLowerCase()) > -1);
    } else {
      this.datastatus = this.datamentah;
    }
  }

  getDataStatusAttendance(){
    this._masterServ.getStatusAttendance().then(x => this.datastatus = this.datastatus.concat(x['data']))
    .then(() => this.datamentah = this.datamentah.concat(this.datastatus))
  }

  async addnew(id?){
    let dialogCust = await this._matDialog.open(ModalStatusAttendanceComponent, {
      height: "auto",
      width: "800px",
      data: {
        idstatus: id ? id.id : null 
      }
  });
  await dialogCust.afterClosed().subscribe((result) => {
    this.resetData();
  })
  }

  deleteaction(id){
    global.swalyousure('Data cant be rescue, if you do this !').then(x => {
      if(x.isConfirmed){
        this._masterServ.deleteDataStatusAttendance(id.id).then(x => {
          global.swalsuccess('Success','Success Deleting Data');
        })
        .then(() => this.resetData())
        .catch(e => global.swalerror('Error Deleting Data'))
      }
    })
  }


  resetData(){
    this.datamentah = [];
    this.datastatus = [];
    this.getDataStatusAttendance();
  }

}
