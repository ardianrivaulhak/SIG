import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SplashComponent implements OnInit {

  message: string = 'Preparing ...';

  constructor(

    private _fuseConfigService: FuseConfigService,
    private _storage: LocalStorage,
    private _loginServ: LoginService,
    public routee: Router,
    
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
    console.log(this.routee.url);
   this.checkingme();
  }

  checkingme(){
    this._storage.getItem('token').subscribe(y =>{
      this.message = 'Please Wait Authenticating ..'
      this._loginServ.checking_me().then( x => {
        // console.log(x);
        setTimeout(()=>{
          this.message = x[0]['employee_name'] ? `Hai ${x[0]['employee_name']}, This only take a few Minutes ..` : `Authentication Failed, You Have to Login Again ..`
        },3000);
      }).then(()=>{
        console.log('wait');
        setTimeout(() => {
        console.log('udah 3 detik');
        this.routee.navigateByUrl('apps')
        },3000);
      }).catch(err => {
          this.message = 'Authentication Failed, You Have to Login Again ..';
          setTimeout(()=>{
            this.routee.navigateByUrl('login');
          },3000);
      });
    })
  }

}
