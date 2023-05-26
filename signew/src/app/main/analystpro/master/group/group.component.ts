import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GroupService } from '../group/group.service';
import { fuseAnimations } from '@fuse/animations';
import {  MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class GroupComponent implements OnInit {

  datasent = {
    pages : 1,
    search : null
  }
  displayedColumns: string[] = ['no', 'groupname', 'pic','action' ];
  total: number;
  from: number;
  to: number;
  pages = 1;
  groupData = [];
  pageSize;
  access = [];
  
  constructor
  ( private _masterServ: GroupService,
    private _router: Router,
    private _menuServ: MenuService
    ) { }

  ngOnInit(): void {
    this.getData();
    this.checkauthentication();
  }

  getData(){
    this._masterServ.getDataGroup(this.datasent).then(x => {
      this.groupData = this.groupData.concat(Array.from(x['data']));
      this.total = x["total"];
      this.pages = x["current_page"];
      this.from = x["from"];
      this.to = x["to"];
      this.pageSize = x["per_page"];
    })
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

  paginated(f){
    this.groupData = [];
    this.datasent.pages = f.pageIndex + 1;
    this.getData();
  }

}
