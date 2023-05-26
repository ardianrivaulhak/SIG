import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { urlApi } from 'app/main/url';

@Injectable({
  providedIn: 'root'
})
export class GroupAnalisService {

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  getDataGroup(data) 
  {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + 'master/analyst-group',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDetailGroup(data){
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + 'master/analyst-group',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

}
