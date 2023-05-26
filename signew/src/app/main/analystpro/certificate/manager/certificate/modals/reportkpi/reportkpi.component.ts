import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import * as _moment from 'moment';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-reportkpi',
  templateUrl: './reportkpi.component.html',
  styleUrls: ['./reportkpi.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class ReportkpiComponent implements OnInit {

  dateExcel = null;
 dateData = {
  month : '',
  year : ''
 }

  loadingprev = false;
  load = false;
  dataBulan = [
    {
      'name' : 'January',
      'value' : 1
    }, 
    {
      'name' : 'February',
      'value' : 2
    },
    {
      'name' : 'March',
      'value' : 3
    },
    {
      'name' : 'April',
      'value' : 4
    },
    {
      'name' : 'May',
      'value' : 5
    },
    {
      'name' : 'June',
      'value' : 6
    },
    {
      'name' : 'July',
      'value' : 7
    },
    {
      'name' : 'August',
      'value' : 8
    },
    {
      'name' : 'September',
      'value' : 9
    },
    {
      'name' : 'October',
      'value' : 10
    },
    {
      'name' : 'November',
      'value' : 11
    },
    {
      'name' : 'December',
      'value' : 12
    }
  ];

  dataTahun = [
    {
      'name' : 2021,
    },
    {
      'name' : 2022,
    },
    {
      'name' : 2023,
    }
  ]


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<ReportkpiComponent>
  ) { }

  ngOnInit(): void {
  }

  exportexcelFaktur()
  {       
      console.log(this.dateData);
      return this._dialogRef.close({
        init: false,
        data: this.dateData
      });

  } 

  closeDialog(v) {
    return this._dialogRef.close({
        v
    });
  }

}
