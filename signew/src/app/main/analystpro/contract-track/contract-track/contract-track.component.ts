import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ContractTrackService } from '../contract-track.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FuseConfigService } from '@fuse/services/config.service';
import * as global from 'app/main/global';

@Component({
  selector: 'app-contract-track',
  templateUrl: './contract-track.component.html',
  styleUrls: ['./contract-track.component.scss'],
  encapsulation: ViewEncapsulation.None,


})
export class ContractTrackComponent implements OnInit {

  idContract;


  constructor( 
    private _pdfServ: PdfService,
    private _actRoute: ActivatedRoute,
    private _contractTrackServ: ContractTrackService,
    private spinner: NgxSpinnerService,
    private _fuseConfigService: FuseConfigService,
    
  ) {
    this.idContract = this._actRoute.snapshot.params["id"];
    this._fuseConfigService.config = {
      layout: {
          navbar   : {
              hidden: true
          },
          toolbar  : {
              hidden: true
          },
          footer   : {
              hidden: true
          },
          sidepanel: {
              hidden: true
          }
      }
    };
   }

  ngOnInit(): void {
    this._contractTrackServ.getDetailTracking(this.idContract).then((x : any) => {
        if(x.contract_no) {
          this._pdfServ.generatePdf(x,'download')
          .then(o => {
            setTimeout(() => {
              global.swalsuccess('Okay','Contract Found !');
            },2000);
          })
          .then(i => {
            setTimeout(() => {
             window.location.replace('https://siglaboratory.com');
            },1000);
          });
        } else {
          global.swalerror('Contract Not Found, Sorry ! Please Contact Customer Service');
        }
    })
  }
}
