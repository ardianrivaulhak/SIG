import { Component, OnInit } from '@angular/core';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { products } from "./navigation";
import { LoginService } from 'app/main/login/login.service';
import * as global from 'app/main/global';
import { Router } from "@angular/router";


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  navigation: any;
  constructor(
    private _fuseNavigationService: FuseNavigationService,
    private _loginServ: LoginService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.navigation = products;
    this._fuseNavigationService.register('product', this.navigation);
    this._fuseNavigationService.setCurrentNavigation('product');
  }

}
