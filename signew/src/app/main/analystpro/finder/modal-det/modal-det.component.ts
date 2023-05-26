import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
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
import { ContractService } from 'app/main/analystpro/services/contract/contract.service';
import * as global from 'app/main/global';
import { FinderDetComponent } from '../finder-det/finder-det.component';
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
  selector: 'app-modal-det',
  templateUrl: './modal-det.component.html',
  styleUrls: ['./modal-det.component.scss'],
  providers: [
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
],
})
export class ModalDetComponent implements OnInit {
  
  loading = true;
  kontrakstatus_cs;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<ModalDetComponent>,
    private _contractServ: ContractService,
    private _matDialog: MatDialog,

  ) { 
    if (data) {
      this.getConditionContract(data.infotransaction);
      console.log(data);
  }
  }

  ngOnInit(): void {
    setTimeout(() => (this.loading = false), 2000);
  }

  getConditionContract(val){
    this._contractServ.getDataCondition(val).then(x => {
      this.kontrakstatus_cs = x
    }).then(() => console.log(this.kontrakstatus_cs)).then(() => this.loading = false);
  }
  setDate(v){
    let u = new Date(v);
    return `${global.addzero(u.getDate())}-${global.addzero(u.getMonth())}-${u.getFullYear()} ${global.addzero(u.getHours())}:${global.addzero(u.getMinutes())}:${global.addzero(u.getSeconds())}`;
  }

  searchverydetail(v){
    let dialogCust = this._matDialog.open(FinderDetComponent, {
      height: "auto",
      width: "800px",
      data: {
          infotransaction: v
      },
  });
  
  dialogCust.afterClosed().subscribe(async (result) => {});
  }
}
