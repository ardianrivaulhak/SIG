import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import { Router } from '@angular/router';
import * as global from 'app/main/global';
import { VoucherService } from './voucher.service';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DetailComponent } from './detail/detail.component';
@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VoucherComponent implements OnInit {

  breakpoint;
  access = [];
  datasent = {
    search: null
  }

  datavoucher = [];

  constructor(
    private _router: Router,
    private _menuServ: MenuService,
    private _voucherService: VoucherService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.checkauthentication();
    this.getData();
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;
  }


  onResize(ev){
    this.breakpoint = (ev.target.innerWidth <= 400) ? 1 : 3;
  }

  checkauthentication(){
    this._menuServ.checkauthentication(this._router.url).then((x:any) => {
      if(!x.status){
        global.swalerror('You dont an access to this page !').then(res => {
          if(res.isConfirmed || res.isDismissed) {
            this._router.navigateByUrl('apps');
          }
        });
      } else {
        this.access = this.access.concat(x.access);
      }
    });
  }

  onSearchChange(ev){
    this.resetData()
  }
  
  addoredit(v){
    let dialogCust = this._matDialog.open(DetailComponent, {
      height: "auto",
      width: "500px",
      data: {
          data: v,
      },
  });
  dialogCust.afterClosed().subscribe(async (result) => this.resetData()); 
  }

  setStatus(v){
    if(this.access[0].approve > 0){
      this._voucherService.setStatus(v.active, v.id).then(x => this.resetData());
    } else {
      global.swalerror('You Dont Authority to do this, Sorry');
    }
  }

  delete(id){
    global.swalyousure("Are you sure wanna delete this voucher ? ").then(o => {
      if(o.isConfirmed){
        this._voucherService.deleteVocher(id)
        .then(x => global.swalsuccess('Success','Delete Success'))
        .then(() => this.resetData())
        .catch(e => global.swalerror('Error Deleting Data'));
      } else {
        global.swalsuccess('Success','Data tidak jadi di delete');
      }
    })
  }

  resetData(){
    this.datavoucher = [];
    this.getData();
  }

  getData(){
    this._voucherService.getDataVoucher(this.datasent.search)
    .then(x => this.datavoucher = this.datavoucher.concat(x));
  }

}
