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
  selector: 'app-finder-det',
  templateUrl: './finder-det.component.html',
  styleUrls: ['./finder-det.component.scss'],
  providers: [
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
],
})
export class FinderDetComponent implements OnInit {

  dataInformation = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<FinderDetComponent>,
    private _contractServ: ContractService,
    private _matDialog: MatDialog,
  ) {
    if (data) {
      this.getConditionContract(data.infotransaction);
  }
   }

  ngOnInit(): void {
  }

  getConditionContract(val){
    this._contractServ.getDataCondition(val).then(x => this.dataInformation = this.dataInformation.concat(x));
  }

  setDate(v){
    let u = new Date(v);
    return `${global.addzero(u.getDate())}/${global.addzero(u.getMonth())}/${u.getFullYear()} ${global.addzero(u.getHours())}:${global.addzero(u.getMinutes())}:${global.addzero(u.getSeconds())}`;
  }

}
