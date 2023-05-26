import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AttendanceService } from "../attendance.service";
import { DayoffModalsComponent } from "../dayoff-modals/dayoff-modals.component";
import { FromToAttendaceComponent } from "../from-to-attendace/from-to-attendace.component";
import { AttendanceComponent } from "app/main/hris/attendance/attendance.component";

@Component({
  selector: 'app-report-attendance',
  templateUrl: './report-attendance.component.html',
  styleUrls: ['./report-attendance.component.scss']
})

export class ReportAttendanceComponent implements OnInit {

  bulan = [
    {
      id: "01",
      bulan: 'Januari'
    },
    {
      id: "02",
      bulan: 'Februari'
    },
    {
      id: "03",
      bulan: 'Maret'
    },
    {
      id: "04",
      bulan: 'April'
    },
    {
      id: "05",
      bulan: 'Mei'
    },
    {
      id: "06",
      bulan: 'Juni'
    },
    {
      id: "07",
      bulan: 'July'
    },
    {
      id: "08",
      bulan: 'Agustus'
    },
    {
      id: "09",
      bulan: 'September'
    },
    {
      id: "10",
      bulan: 'Oktober'
    },
    {
      id: "11",
      bulan: 'November'
    },
    {
      id: "12",
      bulan: 'Desember'
    }
  ];

  yearSelect;
  monthSelect;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ReportAttendanceComponent>,
  ) { }

  ngOnInit(): void {
  }

  saveData(){
    let da = {
      month: this.monthSelect,
      year: this.yearSelect
    }
    this.dialogRef.close(da);
  }

  close(){
    this.dialogRef.close();
  }

}
