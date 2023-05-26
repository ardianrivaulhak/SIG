import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
// import { hris } from 'app/main/pages/hris/navigation';
// import { marketing } from 'app/main/pages/marketing/navigation';
// import { navigation } from 'app/navigation/navigation';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import * as myurl from 'app/main/url';
@Component({
  selector: 'appsig',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AppsComponent implements OnInit {

  me = [];
  navigation: any;
  urlnow = myurl.url;
  
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _router: Router,
    private _loginserv: LoginService,
    private _iconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
    private _fuseNavigationService: FuseNavigationService,
    private _localStorage: LocalStorage
  ) { 
    this.config();
  }

  ngOnInit(): void {
    this.check();
    this._localStorage.getItem('menu_apps').subscribe(val => console.log(val))
  }

  async check(){
    await this._loginserv.checking_me()
    .then(x => this.me = this.me.concat(x))
    .catch(e => this._router.navigateByUrl('login'));    
  }

  gotodashboard(){
    this._router.navigateByUrl('hris/dashboard');
  }

  gotoMarketing(){    
    this._router.navigateByUrl('marketing/dashboard');
  }

  config(){
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
    this._iconRegistry.addSvgIcon('worker', this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/custom/worker.svg'));
    this._iconRegistry.addSvgIcon('none', this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/custom/less.svg'));
    this._iconRegistry.addSvgIcon('lab', this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/custom/lab.svg'));
    this._iconRegistry.addSvgIcon('transaction', this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/custom/transaction.svg'));
    this._iconRegistry.addSvgIcon('agree', this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/custom/agreement.svg'));
  }

  async goto(v){
    switch(v){
      case 'hris': 
          if(this.me[0].id_bagian == 3 || this.me[0].id_bagian == 4){
            this._router.navigateByUrl('hris');
          } else {
            console.log('hahaha');
          }
      break;
      case 'analystpro':
          this._router.navigateByUrl(v);
      break;
      case 'products':
        this._router.navigateByUrl('products');
      break;
      case 'edoc':
        this._router.navigateByUrl('edoc');
      break;
    }
  }

}
