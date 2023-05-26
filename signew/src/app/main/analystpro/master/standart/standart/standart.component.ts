import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StandartService } from '../standart.service';
import { fuseAnimations } from '@fuse/animations';
import {  MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import * as XLSX from "xlsx";
import * as global from 'app/main/global';


@Component({
  selector: 'app-standart',
  templateUrl: './standart.component.html',
  styleUrls: ['./standart.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class StandartComponent implements OnInit {

  standartData = [];
  displayedColumns: string[] = ['kode_standart', 'nama_standart', 'ket_standart','action' ];
  total: number;
  from: number;
  to: number;
  pages = 1;
  datasent = {
    pages : 1,
    search : null
  }
  access = [];	
  pageSize;
  loading = false;

  constructor(
    private _router: Router,
private _menuServ: MenuService,
    private _masterServ: StandartService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.checkauthentication();
  }

  checkauthentication(){
    this._menuServ.checkauthentication(this._router.url).then(x => {
      if(!x.status){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You dont an access to this page !',
        }).then(res => {
          if(res.isConfirmed || res.isDismissed) {
            this._router.navigateByUrl('apps');
          }
        });
      } else {
        this.access = this.access.concat(x.access);
      }
    });
  }

  getData(){
    this._masterServ.getDataStandart(this.datasent).then(x => {
      this.standartData = this.standartData.concat(Array.from(x['data']));
      this.total = x["total"];
      this.pages = x["current_page"];
      this.from = x["from"];
      this.to = x["to"];
      this.pageSize = x["per_page"];
    })
  }

  async exportExcel() {
    this.loading = await true;
    await this._masterServ
        .getDataStandart({ pages: 1, search: null, status: "all" })
        .then(async (x: any) => {
            const filename = await `Master_Standart.xlsx`;
            const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(x);
            const wb: XLSX.WorkBook = await XLSX.utils.book_new();
            await XLSX.utils.book_append_sheet(wb, ws, `Data`);
            await XLSX.writeFile(wb, filename);
        });
    this.loading = await false;
}

  paginated(f){
    this.standartData = [];
    this.datasent.pages = f.pageIndex + 1;
    this.getData();
  }

  onSearchChange(ev){
    this.standartData = [];
    this.datasent.search = ev;
    this.getData();
  }

  sortData(sort: Sort) {
    const data = this.standartData.slice();
    if ( !sort.active || sort.direction === '') {
      this.standartData = data;
      return;
    }
    this.standartData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'kode_standart': return this.compare(a.kode_standart, b.kode_standart, isAsc);
        case 'nama_standart': return this.compare(a.nama_standart, b.nama_standart, isAsc);
        case 'ket_standart': return this.compare(a.ket_standart, b.ket_standart, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  deleteData(v){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._masterServ.deleteDataStandart(v).then((x:any) => {
        
                            if (x.success) {
                                global.swalsuccess("success", x.message);
                            } else {
                                global.swalerror(x.message);
                            }
                        })
                        .then((f) => this.setDelete(f));
                }
            })
            .catch((e) => global.swalerror("Error at Database"));
    
  }

  async setDelete(v){
    this.datasent.pages = await 1;
    this.datasent.search = await null;
    this.standartData = await [];
    await this.getData();
  }

}
