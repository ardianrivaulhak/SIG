import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { ComplainService } from '../../../complain.service';
import { fuseAnimations } from '@fuse/animations';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import Swal from 'sweetalert2';
import { CustomerService } from 'app/main/analystpro/master/customers/customer.service';
import * as globals from "app/main/global";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import * as XLSX from 'xlsx';
import { PageEvent } from "@angular/material/paginator";
import * as _moment from 'moment';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ExportDataComponent implements OnInit {

  loadingfirst = false;
  preparationData = [];

  dateExcelStart = null;
  dateExcelEnd = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<ExportDataComponent>
  ) { }

  ngOnInit(): void {
  }

  exportexcelFaktur()
    {   
  
        console.log(this.dateExcelStart);
        let dateStart =  _moment(this.dateExcelStart).format('YYYY-MM-DD');
        let dateEnd =  _moment(this.dateExcelEnd).format('YYYY-MM-DD');
  
        return this._dialogRef.close({
          b: "close",
          c: dateStart,
          d: dateEnd
        });
  
    } 

}
