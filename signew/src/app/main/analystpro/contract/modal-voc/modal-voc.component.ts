import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { VoucherService } from 'app/main/analystpro/master/voucher/voucher.service';

@Component({
  selector: 'app-modal-voc',
  templateUrl: './modal-voc.component.html',
  styleUrls: ['./modal-voc.component.scss']
})
export class ModalVocComponent implements OnInit {
  
  search;
  datavoucher = [];
  displayedColumn = ['no','voucher_name','pricediscount'];
  voucherpick = [];

  voucherStill;

  constructor(
        private dialogRef: MatDialogRef<ModalVocComponent>,
        private _vocServ: VoucherService,
        @Inject(MAT_DIALOG_DATA) private data: any,
  ) { 
    if(data){
      console.log(data);
    }
    this.dialogRef.backdropClick().subscribe(v => {
      this.dialogRef.close({
        value: null
      });
    })
  }

  ngOnInit(): void {
    this.getDataVoucher();
  }

  getDataVoucher(){
    this._vocServ.getDataVoucher(this.search).then((x: any) => {
      this.datavoucher = this.datavoucher.concat(x.filter(g => g.active == 'Y'))
    })
  }

  satuin(){
    this.dialogRef.close({
      value: this.datavoucher.filter(h => h.id == this.voucherStill)
    });
  }

}
