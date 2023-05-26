import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MetodeService } from '../metode.service';
import { fuseAnimations } from '@fuse/animations';
import { Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import * as global from "app/main/global";
import * as XLSX from "xlsx";
@Component({
  selector: 'app-metode',
  templateUrl: './metode.component.html',
  styleUrls: ['./metode.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MetodeComponent implements OnInit {

  metodeData = [];
  displayedColumns: string[] = ['kode_metode', 'metode', 'keterangan','action' ];
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
    private _metodeServ: MetodeService
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
    console.log(this.datasent)
    this._metodeServ.getDataMetode(this.datasent).then(x => {
      this.metodeData = this.metodeData.concat(Array.from(x['data']));
      this.total = x["total"];
      this.pages = x["current_page"];
      this.from = x["from"];
      this.to = x["to"];
      this.pageSize = x["per_page"];
    })
  }

  paginated(f){
    this.metodeData = [];
    this.datasent.pages = f.pageIndex + 1;
    this.getData();
  }

  onSearchChange(ev){
    this.metodeData = [];
    this.datasent.search = ev;
    this.getData();
  }

  async exportExcel() {
    this.loading = await true;
    await this._metodeServ
        .getDataMetode({ pages: 1, search: null, status: "all" })
        .then(async (x: any) => {
            const filename = await `Master_Metode.xlsx`;
            const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(x);
            const wb: XLSX.WorkBook = await XLSX.utils.book_new();
            await XLSX.utils.book_append_sheet(wb, ws, `Data`);
            await XLSX.writeFile(wb, filename);
        });
    this.loading = await false;
}

  sortData(sort: Sort) {
    const data = this.metodeData.slice();
    if ( !sort.active || sort.direction === '') {
      this.metodeData = data;
      return;
    }
    this.metodeData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'kode_metode': return this.compare(a.kode_metode, b.kode_metode, isAsc);
        case 'metode': return this.compare(a.metode, b.metode, isAsc);
        case 'keterangan': return this.compare(a.keterangan, b.keterangan, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  deleteMetode(v){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._metodeServ.deleteDataMetode(v).then(x => {
        })
        this.setDelete(v);
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
    
  }

  async setDelete(v){
    this.datasent.pages = await 1;
    this.datasent.search = await null;
    this.metodeData = await [];
    await this.getData();
  }

}
