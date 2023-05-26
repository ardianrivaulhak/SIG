import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { EdocsService } from "../edocs.service";
import *  as global from "app/main/global";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { AddGroupComponent } from "./add-group/add-group.component";
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class GroupsComponent implements OnInit {


  displayedColumns: string[] = [ 
    'groups', 
    'user',    
    'created', 
    'action'
  ];
  groupData = [];
  loadingfirst = true;
  total: number;
  from: number;
  to: number;
  pages = 1;
  datasent = {
    namegroup : ''
  }

  constructor(
    private _edocServ : EdocsService,
    private _actRoute: ActivatedRoute,
    private _route : Router,
    private _matDialog : MatDialog,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData()
  {
    await this._edocServ
            .getGroups(this.datasent)
            .then((x) => {
              this.groupData = this.groupData.concat(
                Array.from(x["data"])
              );
              this.total = x["total"];
              this.pages = x["current_page"];
              this.from = x["from"];
              this.to = x["to"];
            }) 
             .then(
                () =>
                    (this.groupData = global.uniq(
                        this.groupData,
                        (it) => it.id
                    ))
            )
      await console.log(this.groupData)
  }

  async search()
  {
    this.groupData = await [];
    await this.getData();
  }

  async reset()
  {
    this.datasent.namegroup = await '';
    this.groupData = await [];
    await this.getData()
  }

  async gotoDetails(id)
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/edoc/groups/${id}`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

  addMember() : void 
  {
    let dialogCust = this._matDialog.open(AddGroupComponent, {
      panelClass: 'update-document-dialog',
      // disableClose : true,
      width : '600px',
    });
    dialogCust.afterClosed().subscribe((result) => {
      console.log(result)
     if(result.ev == false){
      this.groupData= null; 
      this.getData();
     }
    });
  }

}
