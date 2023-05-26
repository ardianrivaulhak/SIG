import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PaketujiService } from '../paketuji.service';
import { fuseAnimations } from '@fuse/animations';
import { Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';

@Component({
  selector: 'app-paketuji',
  templateUrl: './paketuji.component.html',
  styleUrls: ['./paketuji.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PaketujiComponent implements OnInit {

  paketujiData = [];
  displayedColumns: string[] = [
    'kode_paketuji', 
    'nama_paketuji', 
    'price_is',  
    'description', 
    'discount', 
    'action'
  ];
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
    private _router: Router,
private _menuServ: MenuService,
    private _paketujiServ: PaketujiService
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
    this._paketujiServ.getDataPaketuji(this.datasent).then(x => {
      // console.log(x);
      this.paketujiData = this.paketujiData.concat(Array.from(x['data']));
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
    })
  }

  deletePaket(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._paketujiServ.deleteDataPaketUji(id).then(x => {
        })
        this.setDelete(id);
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
    this.paketujiData = await [];
    await this.getData();
  }

  paginated(f){
    this.paketujiData = [];
    this.datasent.pages = f.pageIndex + 1;
    this.getData();
  }

  onSearchChange(ev){
    this.paketujiData = [];
    this.datasent.search = ev;
    this.getData();
  }

  sortData(sort: Sort) {
    const data = this.paketujiData.slice();
    if ( !sort.active || sort.direction === '') {
      this.paketujiData = data;
      return;
    }
    this.paketujiData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'kode_paketuji': return this.compare(a.kode_paketuji, b.kode_paketuji, isAsc);
        case 'nama_paketuji': return this.compare(a.nama_paketuji, b.nama_paketuji, isAsc);
        case 'price_is': return this.compare(a.price_is, b.price_is, isAsc);
        // case 'price_id': return this.compare(a.price_id, b.price_id, isAsc);
        // case 'price_it': return this.compare(a.price_it, b.price_it, isAsc);
        // case 'price_ie': return this.compare(a.price_ie, b.price_ie, isAsc);
        case 'description': return this.compare(a.description, b.description, isAsc);
        case 'discount': return this.compare(a.discount, b.discount, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
