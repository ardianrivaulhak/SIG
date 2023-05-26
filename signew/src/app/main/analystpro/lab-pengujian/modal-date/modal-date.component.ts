import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
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
import * as global from "app/main/global";
import { ComplainService } from 'app/main/analystpro/complain/complain.service';
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
import { LabPengujianService } from '../lab-pengujian.service';
@Component({
  selector: 'app-modal-date',
  templateUrl: './modal-date.component.html',
  styleUrls: ['./modal-date.component.scss'],
  providers: [
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class ModalDateComponent implements OnInit {
  
  date;
  status;
  waktu;
  date2;
  kontrakuji;
  datacontract = [];
  
  datasentContract = {
    pages: 1,
    search: null,
    id_lab: null
  };

  constructor( 
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<ModalDateComponent>,
    private _labPengujianServ: LabPengujianService,
    private _complainServ: ComplainService
  ) {
    if(data){
      this.status = data.status;
      if(data.status === 'kontrakuji'){
        this.datasentContract.id_lab = data.idlab
        this.getDataContract();
      } else if (data.status === 'complain'){
        this.datasentContract.id_lab = data.idlab,
        this.getDataComplain();
      }
    }
   }

  ngOnInit(): void {
  }

  getDataComplain(){
    this._complainServ.getDatanoComplain(this.datasentContract.id_lab).then(x =>console.log(x));
  }

  changetanggal(v){
    var year = v._i.year;
    var month = v._i.month + 1;
    var date = v._i.date;  
    return `${year}-${month}-${date}`
  }

  onScrollToEndSelect(e) {
    this.datasentContract.pages = this.datasentContract.pages + 1;
    this.getDataContract();
  }

  onsearchselect(ev, stat) {
    this.datasentContract.pages = 1;
    this.datasentContract.search = ev.term;
  }

  getDataContract(){
    this._labPengujianServ.getDataContractLab(this.datasentContract).then(x => this.datacontract = this.datacontract.concat(x['data']));
  }

  save(){
    if(this.status === 'spk'){
      return this._dialogRef.close({
        date2: this.date2 ? _moment(this.date2).format('YYYY-MM-DD') : null,
        date: this.date ? _moment(this.date).format('YYYY-MM-DD') : null,
        status: this.status
      });
    } else if(this.status === 'formathasil'){
      return this._dialogRef.close({
        date2: this.date2 ? _moment(this.date2).format('YYYY-MM-DD') : null,
        date: this.date ? _moment(this.date).format('YYYY-MM-DD') : null,
        status: this.status
      });
    } else {
      return this._dialogRef.close({
        contract: this.kontrakuji,
        status: this.status
      });
    }
    
  }

}
