import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { KendaliService } from '../kendali.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ModalKendaliComponent } from 'app/main/analystpro/kendali/modal-kendali/modal-kendali.component';
import { ContractcategoryService } from '../../services/contractcategory/contractcategory.service';
import { StatuspengujianService } from '../../services/statuspengujian/statuspengujian.service';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';

@Component({
  selector: 'app-kendali',
  templateUrl: './kendali.component.html',
  styleUrls: ['./kendali.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})


export class KendaliComponent implements OnInit {

  kendaliData = [];
  displayedColumns: string[] = ['contract_no', 'category_code', 'customer_name' ,'status_pengujian' ,'tanggal_terima', 'tanggal_selesai', 'icon'];
  total: number;
  from: number;
  to: number;
  pages = 1;
  data = {
    id : ''
  };
  datasent = {
    pages : 1,
    marketing : null
  }
  contractcategory = [];
  statusPengujian = [];
  access = [];	


  
  

  constructor(
    private _masterServ: KendaliService,
    private _kontrakategori: ContractcategoryService,
    private _statuspengujian: StatuspengujianService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _menuServ: MenuService
  ) { }

  

  ngOnInit() {
    this.getData();
    this.getDataContractCategory();
    this.getDataStatusPengujian();
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
    this._masterServ.getData(this.datasent).then(x => {
      this.kendaliData = this.kendaliData.concat(Array.from(x['data']));
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }  
    })
    .then(x => console.log(this.kendaliData));
  }

  async getDataContractCategory(){
    await this._kontrakategori.getDataContractCategory(this.datasent).then(x => {
      this.contractcategory = this.contractcategory.concat(x['data']);
    })
  }

  async getDataStatusPengujian(){
    await this._statuspengujian.getDataStatusPengujian(this.datasent).then(x => {
      this.statusPengujian = this.statusPengujian.concat(x['data']);
    })
  }

  paginated(f){
    this.kendaliData = [];
    this.datasent.pages = f.pageIndex + 1;
    this.getData();
  }

  onSearchChange(ev){
    this.kendaliData = [];    
    this.datasent.marketing = ev;
    console.log(this.datasent)
    this.getData();
  }


  sortData(sort: Sort) {
    const data = this.kendaliData.slice();
    if ( !sort.active || sort.direction === '') {
      this.kendaliData = data;
      return;
    }
    this.kendaliData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'category_code': return this.compare(a.category_code, b.category_code, isAsc);
        case 'contract_no': return this.compare(a.contract_no, b.contract_no, isAsc);
        case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'status_pengujian': return this.compare(a.status_pengujian, b.status_pengujian, isAsc);
        case 'tanggal_terima': return this.compare(a.tanggal_terima, b.tanggal_terima, isAsc);
        case 'tanggal_selesai': return this.compare(a.tanggal_selesai, b.tanggal_selesai, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openDialog(id_kontrakuji) : void {
    const dialogRef = this._matDialog.open(ModalKendaliComponent, {
      panelClass: 'kendali-dialog',
      data: { data: this.kendaliData[id_kontrakuji] }
    });
   
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
     
    });
  
  }

  changeStatus(v){
    this.data.id = v;
    console.log(this.data);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#318fb5',
      cancelButtonColor: '#cd0a0a', 
    }).then((result) => {
      if (result.value) {
        this.kendaliData = [];
        this._masterServ.getData(this.data).then(x => {
        })
        this.getData();
        Swal.fire(
          'Approved!',
          'This marketing number is approved',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Cancel Agreeing',
          'error'
        )
      }
    })
  }

  


}
