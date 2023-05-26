import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AttendanceService } from '../attendance.service';
import * as _moment from "moment";

@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.scss'],
})
export class StatusModalComponent implements OnInit {

  status;
  startdate;
  status_plg;
  enddate;
  id_attendance;
  dataupdate = [];
  button = 'Save';
  description;
  dateinput;
  statusattendance = [];
  employeename;
  dateinputshow;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<StatusModalComponent>,
    private attendanceServ: AttendanceService
  ) { 
    if(data.id_attendance){
      this.dateinput = data.dateinput;
      this.setData(data);
      this.dialogRef.backdropClick().subscribe(() => {
        this.dialogRef.close();
      })
    }
    
  }

  ngOnInit(): void {
    this.getDataStatusAttendance();
  }

  exitModal(v?){
    return this.dialogRef.close(v);
  }

  getDataStatusAttendance(){
    this.attendanceServ.getStatusAbsen().then(h => this.statusattendance = this.statusattendance.concat(h['data']))
  }

  async setData(data?){
    if(data.id_attendance){
      this.employeename = await this.data.employee_name;
    this.dataupdate = await this.dataupdate.concat(data.id_attendance);
    this.dateinputshow = await _moment(this.dateinput).format('DD/MM/YYYY');
    this.status = await data.id_attendance.attendance ? data.id_attendance.attendance.id_status.toString() : null;
    this.status_plg = await data.id_attendance.attendance?.id_status_plg ? data.id_attendance.attendance.id_status_plg.toString() : null;
    this.description = await data.id_attendance.attendance ? data.id_attendance.attendance.description : null;
    }
  }

  savedata(){
    this.button = 'Please Wait';
    let dataupdatefor = {
      idattendance: this.dataupdate[0].attendance ? this.dataupdate[0].attendance.id : null,
      id_employee: this.dataupdate[0].employee_id, 
      status: this.status, 
      status_plg: this.status_plg,
      start: _moment(this.dateinput).format('YYYY-MM-DD'),
      desc: this.description ? this.description : null
    }
    this.attendanceServ.updateDataAttendance(dataupdatefor).then(x => {
      this.exitModal('save');
    })
  }

  setSendDate(v) {
    let ddate = new Date(v);
    return `${ddate.getFullYear()}-${this.addZero(
      ddate.getMonth() + 1
    )}-${this.addZero(ddate.getDate())}`;
  }

  addZero(i) {
    return i < 10 ? `0${i}` : i;
  }

}
