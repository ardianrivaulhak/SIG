import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from '@fuse/animations';
import { EdocsService } from "../edocs.service";
import * as  url from "app/main/url";
import { replace } from 'lodash';
import * as _moment from "moment";

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PdfViewerComponent implements OnInit {

  src = '';
  uri = `${url.url}/edoc/`
  constructor(
    private _edocServ : EdocsService,
    private _actRoute: ActivatedRoute,
    private _route : Router,
  ) { }
    documentData : any;
    datasend = {
      type : this._actRoute.snapshot.params["type"],
      id : this._actRoute.snapshot.params["id"]
    }

  ngOnInit(): void {
      this.getData();
      console.log(url.url)
  }

  async getData()
  {
    await this._edocServ
            .attachmentDetail(this.datasend)
            .then((x) => {
              this.documentData = x 
            }) 
    await console.log(this.documentData)
    await this.getDocument();
  }

 async  getDocument()
  {
    let  docs = await (this.documentData.documents.master_document.document_name.replace(/ /g, "")).toLowerCase();
    let y = await _moment(this.documentData.created_at).format('YYYY');
    let m = await _moment(this.documentData.created_at).format('MM');;
    let title = await this.documentData.documents.title.replace(/ /g, "%20");
    let curl = null;

    switch(this.documentData.type) {
      case 1:
        curl = `${docs}/${y}/${m}/${title}/document/${this.documentData.filename + `.` + this.documentData.ext}`;
        break;
      case 2:
        curl = `${docs}/${y}/${m}/${title}/amandement/${this.documentData.filename + `.` + this.documentData.ext}`;
        break;
      case 3:
        curl = `${docs}/${y}/${m}/${title}/flowchart/${this.documentData.filename + `.` + this.documentData.ext}`;
        break;
      case 4:
        curl = `${docs}/${y}/${m}/${title}/formulir/${this.documentData.filename + `.` + this.documentData.ext}`;
        break;
      case 5:
        curl = `${docs}/${y}/${m}/${title}/changehistory/${this.documentData.filename + `.` + this.documentData.ext}`;
        break;
      default:
        curl = `${docs}/${y}/${m}/${title}/document/${this.documentData.filename + `.` + this.documentData.ext}`;
    }

    // this.src = await this.uri + curl;
    this.src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
    await this.saveViewedPage();
  }

  saveViewedPage()
  {
    this._edocServ.viewedDocuments(this.documentData).then( (x) => {

    })
  }

}
