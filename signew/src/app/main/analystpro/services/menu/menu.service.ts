import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { urlApi, url } from 'app/main/url';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import { LoginService } from 'app/main/login/login.service';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  widgets: any[];

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
    private _loginServ: LoginService
  ) { }

  getData(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        let a = url +'menuget?menu='+data.toLowerCase();
        this.http.get(a, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  checkauthentication(url){
    return this._loginServ.checking_me().then(x => {
      let getmenu = x[0]['user']['menuget']
        .map(xx => xx.menuchild)
        .filter(none => none);
      let b = url.split("/")[2];
      let c = x[0]['user']['menuget'].filter(f => f.menu_id !== 9 && f.menuchild);
      let authcheck = getmenu.filter(check => {
        if(check.url){
          return check.url.split("/")[2] === b;
        }
      });
      let data = {
        access: authcheck.length < 1 ? null : c.filter(f => f.menuchild.url.split("/")[2] === b),
        status: authcheck.length < 1 ? false : true
      }
      return data;
    })
  }


  checkauthenticationServ = (url) => {
    return this._loginServ.checking_me().then(x => {
      let getmenu = x[0]['user']['menuget']
        .map(xx => xx.menuchild)
        .filter(none => none);
      let b = url.split("/")[2];
      let c = x[0]['user']['menuget'].filter(f => f.menu_id !== 9 && f.menuchild);
      let authcheck = getmenu.filter(check => {
        if(check.url){
          return check.url.split("/")[2] === b;
        }
      });
      let data = {
        access: authcheck.length < 1 ? null : c.filter(f => f.menuchild.url.split("/")[2] === b),
        status: authcheck.length < 1 ? false : true
      }
      return data;
    })
  }
}
