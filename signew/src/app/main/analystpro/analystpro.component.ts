import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { analystpro_nav } from './navigation';
import { FuseNavigation } from '@fuse/types';
import { MenuService } from './services/menu/menu.service';
import { LoginService } from '../login/login.service';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { Router, Routes } from '@angular/router';
import { MessagingService } from '../../messaging.service';

@Component({
  selector: 'app-analystpro',
  templateUrl: './analystpro.component.html',
  styleUrls: ['./analystpro.component.scss']
})
export class AnalystproComponent implements OnInit {
  
  message;
  navigation: any;
  analystpronav : FuseNavigation[] = [];
  mine = [];

  constructor(
    private _fuseNavigationService: FuseNavigationService,
    private _menuServ: MenuService,
    private _loginServ: LoginService,
    private messagingService: MessagingService
  ) {
   }

  ngOnInit(): void {
    this.analystpronav = [];
    this.notificationApp()
    this.getMe();
  }

  buildNavItems(routes: Routes) {
    return (routes)
      .filter(route => route.data)
      .map(({ path = '', data }) => ({
        path: path,
        label: data.label,
        icon: data.icon
      }));
  }

  async notificationApp(){
    await this.messagingService.requestPermission('analystpro')
    await this.messagingService.receiveMessage()
    this.message = await this.messagingService.currentMessage
  }

  getMe(){
    this._loginServ.checking_me().then(x => {
      this.mine = this.mine.concat(x);
    
    }).then(()=>this.getMenu());
  }


  async getMenu() {
    let d = [];
    await this._menuServ.getData('analystpro').then(async (x: any) => {
      this.analystpronav = this.analystpronav.concat(x[0]);
    })
    await console.log(this.analystpronav);
    this.navigation = await this.analystpronav;
    this.navigation = await this.uniq(this.navigation, it => it.id);
    this.navigation[0].children = await this.uniq(this.navigation[0].children, it => it.id);
    await this._fuseNavigationService.register(`analystpro_${this.mine[0].employee_id}`, this.navigation);
    await this._fuseNavigationService.setCurrentNavigation(`analystpro_${this.mine[0].employee_id}`);
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
}
}
