import { Component, OnInit } from '@angular/core';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { hris } from './navigation';
import { LoginService } from 'app/main/login/login.service';
import * as global from 'app/main/global';
import { Router } from "@angular/router";

@Component({
  selector: 'app-hris',
  templateUrl: './hris.component.html',
  styleUrls: ['./hris.component.scss']
})
export class HrisComponent implements OnInit {

  navigation: any;

  constructor(
    private _fuseNavigationService: FuseNavigationService,
    private _loginServ: LoginService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.navigation = hris;
    this._fuseNavigationService.register('hris', this.navigation);
    this._fuseNavigationService.setCurrentNavigation('hris');
    this.getMe();
  }

  getMe(){
    this._loginServ.checking_me().then((x: any) => {
      if(x[0].id_bagian !== 3){
        global.swalerror("Sorry you're not supposed in this page").then(() => {
          this._router.navigateByUrl("apps");
        })
      }
    })
  }

}
