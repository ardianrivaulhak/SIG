import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { EdocsService } from "../edocs.service";
import *  as global from "app/main/global";
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DocumentsComponent implements OnInit {

  displayedColumns: string[] = [ 
    'document', 
    'document_number',    
    'user', 
    'action'
  ];

  loadingfirst = true;
  total: number;
  from: number;
  to: number;
  pages = 1;

  datasent = {
    category : this._actRoute.snapshot.params["category"],
    document_name : '',
    document_number : ''
  }

  documentData = [];
  titles = '';
  cate = null;
  constructor(
    private _edocServ : EdocsService,
    private _actRoute: ActivatedRoute,
    private _route : Router
  ) {
    this._actRoute.queryParams.subscribe(val => { 
      console.log(val) 
    });
    this._actRoute.params.subscribe(routeParams => {
      // this.loadUserDetail(routeParams.id);
      this.cate = routeParams;
      console.log(routeParams.category)
      this.title(routeParams.category);
      this.getData(routeParams.category);
    }); 
   }

  ngOnInit(): void {
    // this.title(cate);
    // this.getData(cate);
   
  }

  title(category)
  {
    console.log(category)
    this.titles = category.replace(/-/g," ");
    console.log(this.titles)
  }

  async getData(category)
  {
    console.log(category)
     this.documentData = await [];
    this.datasent.category = await category;
    await this._edocServ
            .getDocuments(this.datasent)
            .then((x) => {
              this.documentData = this.documentData.concat(
                Array.from(x["data"])
              );
              this.total = x["total"];
              this.pages = x["current_page"]; 
              this.from = x["from"];
              this.to = x["to"];
            }) 
             .then(
                () =>
                    (this.documentData = global.uniq(
                        this.documentData,
                        (it) => it.id
                    ))
            )
       this.loadingfirst = await false;
      await console.log(this.documentData)
  }

  async search()
  {    
    this.documentData = await [];
    await this.getData(this.cate.category);    
    this.loadingfirst = await false;
  }

  async reset()
  {
    await this.loadingfirst
    this.datasent.document_name = await '';
    this.datasent.document_number = await '';
    this.documentData = await [];
    await this.getData(this.cate.category);
  }

  async gotoDetails(category, id)
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/edoc/documents/${category}/${id}`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

}
