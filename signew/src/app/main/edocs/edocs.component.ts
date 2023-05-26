import { Component, OnInit } from '@angular/core';
import { edocs  } from "./navigation";
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { LoginService } from 'app/main/login/login.service';
import * as global from 'app/main/global';
import { Router } from "@angular/router";

@Component({
  selector: 'app-edocs',
  templateUrl: './edocs.component.html',
  styleUrls: ['./edocs.component.scss']
})
export class EdocsComponent implements OnInit {
  navigation: any;
  constructor(
    private _fuseNavigationService: FuseNavigationService,
    private _loginServ: LoginService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.navigation = edocs;
    this._fuseNavigationService.register('edocs', this.navigation);
    this._fuseNavigationService.setCurrentNavigation('edocs');
  }

}
