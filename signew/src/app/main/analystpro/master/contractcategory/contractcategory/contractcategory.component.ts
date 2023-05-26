import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ContractcategoryService } from '../contractcategory.service';
import { fuseAnimations } from '@fuse/animations';
import {  MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';

@Component({
  selector: 'app-contractcategory',
  templateUrl: './contractcategory.component.html',
  styleUrls: ['./contractcategory.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ContractcategoryComponent implements OnInit {

  contractCategoryData = [];
  displayedColumns: string[] = ['title', 'category_code' ];
  total: number;
  from: number;
  to: number;
  pages = 1;
  datasent = {
    pages : 1,
    search : null
  }
  access = [];
  

  constructor(
    private _contractcategoryServ: ContractcategoryService,
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
    this._contractcategoryServ.getDataContractCategory(this.datasent).then(x => {
      this.contractCategoryData = this.contractCategoryData.concat(Array.from(x['data']));
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }
    })
  }

  paginated(f){
    this.contractCategoryData = [];
    this.datasent.pages = f.pageIndex + 1;
    this.getData();
  }

  onSearchChange(ev){
    this.contractCategoryData = [];
    this.datasent.search = ev;
    this.getData();
  }

  sortData(sort: Sort) {
    const data = this.contractCategoryData.slice();
    if ( !sort.active || sort.direction === '') {
      this.contractCategoryData = data;
      return;
    }
    this.contractCategoryData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title': return this.compare(a.title, b.title, isAsc);
        case 'category_code': return this.compare(a.category_code, b.category_code, isAsc);
        case 'cover_code': return this.compare(a.cover_code, b.cover_code, isAsc);
        case 'lhu_code': return this.compare(a.lhu_code, b.lhu_code, isAsc);
        case 'sample_code': return this.compare(a.sample_code, b.sample_code, isAsc);
        case 'description': return this.compare(a.description, b.description, isAsc);
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
        this._contractcategoryServ.deleteDataContractCategory(v).then(x => {
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
    this.contractCategoryData = await [];
    await this.getData();
  }

}
