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
  selector: 'app-finder-detail-information',
  templateUrl: './finder-detail-information.component.html',
  styleUrls: ['./finder-detail-information.component.scss'],
  providers: [
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
],
})
export class FinderDetailInformationComponent implements OnInit {

  loading = true;
  dataInfo = [];
  certInfo = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<FinderDetailInformationComponent>,
    private _contractServ: ContractService,
    private _matDialog: MatDialog,
  ) { 
    if (data) {
      this.getConditionContract(data.infotransaction);
      console.log(data);
  }
  }

  async getConditionContract(val){
    await this._contractServ.getDataCondition(val).then(x => {
      this.dataInfo = this.dataInfo.concat(x);
    }).then(() => console.log(this.dataInfo));

    await this._contractServ.getDataConditionCert(val).then(x => {
        this.certInfo = this.certInfo.concat(x);
      }).then(() => console.log(this.certInfo));

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    },2000);
  }

  

}
