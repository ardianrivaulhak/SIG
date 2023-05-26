import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CatalogueService } from '../catalogue.service';
import { fuseAnimations } from '@fuse/animations';
import {  MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import * as global from "app/main/global";
@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})


export class CatalogueComponent implements OnInit {

  catalogueData = [];
  displayedColumns: string[] = ['catalogue_code', 'catalogue_name', 'description','action' ];
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
  
  constructor(
    private _masterServ: CatalogueService,
    private _router: Router,
    private _menuServ: MenuService
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
    this._masterServ.getDataCatalogue(this.datasent).then(x => {
      this.catalogueData = this.catalogueData.concat(Array.from(x['data']));
        this.total = x["total"];
        this.pages = x["current_page"];
        this.from = x["from"];
        this.to = x["to"];
        this.pageSize = x["per_page"];
    })
  }

  paginated(f){
    this.catalogueData = [];
    this.datasent.pages = f.pageIndex + 1;
    this.getData();
  }

  onSearchChange(ev){
    this.catalogueData = [];
    this.datasent.search = ev;
    this.getData();
  }

  sortData(sort: Sort) {
    const data = this.catalogueData.slice();
    if ( !sort.active || sort.direction === '') {
      this.catalogueData = data;
      return;
    }
    this.catalogueData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'catalogue_code': return this.compare(a.catalogue_code, b.catalogue_code, isAsc);
        case 'catalogue_name': return this.compare(a.catalogue_name, b.catalogue_name, isAsc);
        case 'description': return this.compare(a.description, b.description, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  deleteData(v){
    console.log(v);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._masterServ.deleteDataCatalogue(v).then((x:any) => {
          if (x.success) {
            global.swalsuccess("success", x.message);
        } else {
            global.swalerror(x.message);
        }
        this.setDelete(v);
    });
}
});
  }
  
  
  async setDelete(v){
    this.datasent.pages = await 1;
    this.datasent.search = await null;
    this.catalogueData = await [];
    await this.getData();
  }

}
