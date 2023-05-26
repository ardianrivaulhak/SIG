import { Component, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CertificateService } from "app/main/analystpro/certificate/certificate.service";

import { LoginService } from "app/main/login/login.service";
import { url }from "app/main/url";

import { FormatAkgBpomService } from "../../../../pdf/akg/format_akg_bpom.service";


@Component({
  selector: 'app-processopen',
  templateUrl: './processopen.component.html',
  styleUrls: ['./processopen.component.scss']
})
export class ProcessopenComponent implements OnInit {

  id = this._actRoute.snapshot.params['id'];
  load = true;
  mine = [];
  notshowing = true;
  notactive = false;
  identity : any;
  akgData: any;

  constructor(
    private route: ActivatedRoute,
    private _actRoute: ActivatedRoute,
    private _logServ: LoginService,
    private _loginServ: LoginService,
    private _fuseConfigService: FuseConfigService,
    private _certServ : CertificateService,

    private _formatAkgBpom: FormatAkgBpomService,
  ) { 
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
    this.getMe();
    console.log(this.id)
  }

  async getMe(){
    this.load = true;
    await this._logServ.checking_me().then(async x =>
         this.mine = await this.mine.concat(x)
         ).catch( z => this.mine = []);
    this.identity = await this.mine;
    await this.checkingData()
  }  

  async checkingData()
  {
    let a = {
      id : this.id
    };

    await console.log(this.identity)
    await this._certServ.showAkgData(a).then( x => {
        this.akgData = x;
    })
    await console.log(this.akgData)
    this.load = await false; 
    await this.generateFormat();

  }

  async generateFormat()
  {
    switch (this.akgData.format) { 
      case 16:
          await this._formatAkgBpom.generatePdf(this.akgData, this.identity);
          break;

      default:
          await this._formatAkgBpom.generatePdf(this.akgData, this.identity);
          break;
    }
  }

}
