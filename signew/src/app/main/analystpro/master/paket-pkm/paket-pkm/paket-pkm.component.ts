import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PaketPkmService } from '../paket-pkm.service';
import { fuseAnimations } from '@fuse/animations';
import { Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import { MatDialog } from "@angular/material/dialog"; 
import { ModalPaketPkmComponent } from "../modal-paket-pkm/modal-paket-pkm.component";
import * as global from 'app/main/global';

@Component({
  selector: 'app-paket-pkm',
  templateUrl: './paket-pkm.component.html',
  styleUrls: ['./paket-pkm.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PaketPkmComponent implements OnInit {
  load = false;
  paketpkmData = [];
  displayedColumns: string[] = [
    'package_code',
    'package_name',
    'totalharga',
    'discount',
    'status',
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
  textsearch;
  access = [];
  pageSize;	
  loading = false;
  constructor( 
    private _menuServ: MenuService,
    private _snackBar: MatSnackBar,
    private _paketpkmServ: PaketPkmService,
    private _router: Router,
    private _dialogRef: MatDialog
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

  async getData(){
    await this._paketpkmServ.getDatapaketpkm(this.datasent).then(async x => {
      // console.log(x);
      this.paketpkmData = await this.paketpkmData.concat(Array.from(x['data']));
      this.total = x["total"];
      this.pages = x["current_page"];
      this.from = x["from"];
      this.to = x["to"];
      this.pageSize = x["per_page"];
    }).then(() => this.paketpkmData = global.uniq(this.paketpkmData, it => it.mstr_specific_package_id));
    await console.log(this.paketpkmData);
  }

  // gotodetail(value){
  //   console.log(value);
  // }

  paginated(f){
    this.paketpkmData = [];
    this.datasent.pages = f.pageIndex + 1;
    this.getData();
  }

  onSearchChange(ev){
    this.paketpkmData = [];
    this.datasent.search = ev;
    this.getData();
  }

  sortData(sort: Sort) {
    const data = this.paketpkmData.slice();
    if ( !sort.active || sort.direction === '') {
      this.paketpkmData = data;
      return;
    }
    this.paketpkmData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id_paketuji': return this.compare(a.nama_paketuji, b.nama_paketuji, isAsc);
        case 'kode_paketuji': return this.compare(a.kode_paketuji, b.kode_paketuji, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


  deletePaket(v){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._paketpkmServ.deleteDatapaketpkm(v).then((x: any) => {
          if(x.success){
            global.swalsuccess('success',x.message);
          } else {
            global.swalerror(x.message);
          }
        })
        .then(f => this.setDelete(f))
      }
    })
    .catch(e => global.swalerror("Error at Database"))   
    
  }

  async setDelete(v){
    this.datasent.pages = await 1;
    this.datasent.search = await null;
    this.textsearch = await null;
    this.paketpkmData = await [];
    await this.getData();
  }


  async gotodetail(v){
    const dialogRef = this._dialogRef.open(ModalPaketPkmComponent, {
      height: "400px",
      width: "800px", 
      data: {   
        value: v
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => console.log(result));
  }

  gotoedit(v){
    this._router.navigateByUrl('analystpro/paket-special/'+ v);
  }

  approvedPaket(id){
    let status = 1;
    this._paketpkmServ.approvedPrice(id, status).then(x => { 
      this.paketpkmData = [];
      this.getData(); 
      this.load = true;
        let message = {
          text: 'Approved Succesfully',
          action: 'Done'
        }
      setTimeout(()=>{     
         
        this.openSnackBar(message);
        this.load = false;
      },1000)
    }); 
  }

  unApprovedPaket(id){
    let status = 0;
    this._paketpkmServ.approvedPrice(id, status).then(x => { 
      this.paketpkmData = [];
      this.getData(); 
      this.load = true;
        let message = {
          text: 'Approved Succesfully',
          action: 'Done'
        }
      setTimeout(()=>{     
         
        this.openSnackBar(message);
        this.load = false;
      },1000)
    }); 
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  } 


  copyPaket(id){
    this._paketpkmServ.copyPaketId(id); 
    this._router.navigateByUrl('analystpro/paket-pkm/add');
  }

}
