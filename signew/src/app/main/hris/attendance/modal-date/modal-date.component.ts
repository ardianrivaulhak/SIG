import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-date',
  templateUrl: './modal-date.component.html',
  styleUrls: ['./modal-date.component.scss']
})
export class ModalDateComponent implements OnInit {

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
    private dialogRef: MatDialogRef<ModalDateComponent>,
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
