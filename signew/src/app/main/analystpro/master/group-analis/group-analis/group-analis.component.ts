import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {  MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import { GroupAnalisService } from '../group-analis.service';
import { MatDialog } from '@angular/material/dialog';
import { AddgroupComponent } from '../modals/addgroup/addgroup.component';
import { EditGroupComponent } from '../modals/edit-group/edit-group.component';

@Component({
  selector: 'app-group-analis',
  templateUrl: './group-analis.component.html',
  styleUrls: ['./group-analis.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class GroupAnalisComponent implements OnInit {

  groupData = [];
  displayedColumns: string[] = ['team_name', 'pic', 'description','action' ];
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
    private _masterServ: GroupAnalisService,
    private _router: Router,
    private _menuServ: MenuService,
    private _matDialog: MatDialog,
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
    this._masterServ.getDataGroup(this.datasent).then(x => {
      this.groupData = this.groupData.concat(Array.from(x['data']));
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }
    }).then(() => console.log(this.groupData))
  }

  sortData(sort: Sort) {
    const data = this.groupData.slice();
    if ( !sort.active || sort.direction === '') {
      this.groupData = data;
      return;
    }
    this.groupData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'team_name': return this.compare(a.team_name, b.team_name, isAsc);
        case 'user_id': return this.compare(a.user_id, b.user_id, isAsc);
        case 'description': return this.compare(a.description, b.description, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


  paginated(f){
    this.groupData = [];
    this.datasent.pages = f.pageIndex + 1;
    this.getData();
  }

  onSearchChange(ev){
    this.groupData = [];    
    this.datasent.search = ev;
    console.log(this.datasent)
    this.getData();
  }

  addModals()
  {
    const dialogRef = this._matDialog.open(AddgroupComponent, {
      panelClass: 'add-group-dialog',
      height: '600px',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log('dialog close')
    });
  }

  editModals(id)
  {
    console.log(id)
    const dialogRef = this._matDialog.open(EditGroupComponent, {
      panelClass: 'edit-group-dialog',
      height: '600px',
      width: '100%',
      data: {data : id}
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log('dialog close')
    });
  }

}
