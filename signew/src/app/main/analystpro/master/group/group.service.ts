import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { urlApi } from 'app/main/url';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { reject } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  certificateUrl = `master/group`;

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }


  getDataGroup(data) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        let searchfor = data.search ? `master/group?page=${data.pages}&search=${data.search.toUpperCase()}` : `master/group?page=${data.pages}`;
        this.http.get(urlApi + searchfor, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

}
