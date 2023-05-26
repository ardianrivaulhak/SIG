import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { fuseAnimations } from '@fuse/animations';
import { LoginService } from './login.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class LoginComponent implements OnInit {
  status = 'password';
  icon = 'visibility_off';
  loginForm: FormGroup;
  @ViewChild('filter', {static: true})
    filter: ElementRef;
  
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _fusesplash: FuseSplashScreenService,
    private _loginServ: LoginService,
    private _storage: LocalStorage,
    public _route: Router
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

  ngOnInit() : void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }


    async testfor(){
      this.status = await this.status === 'text' ? 'password' : 'text';
      this.icon = await this.icon === 'visibility' ? 'visibility_off' : 'visibility';
      console.log({a: this.status,b: this.icon});
    }

    loginServ(){
        console.log(this.loginForm);
        this._loginServ.redirect(this.loginForm.value)
        .then(x => this._storage.setItem('token',x['token'])
        .subscribe(() => {}))
        .then(()=> this._route.navigateByUrl('apps'))
        .catch(e => Swal.fire({
          title: 'Login Error',
          text: e.error.error,
          icon: 'warning', 
          confirmButtonText: 'Ok'
      }));
    }
}
