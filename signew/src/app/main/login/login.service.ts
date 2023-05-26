import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { url, urlApi } from '../url';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  redirect(val){
    return new Promise((resolve, reject) =>{
      let ememe = new FormData();
      let email = val.email.split('@');
      let mailing = email[0]+'%40'+email[1];
      ememe.append('email',val.email);
      ememe.append('password',val.password);
      let d = `email=${mailing}&password=${val.password}`;
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded'
        })
      };

      this.http.post(url+'auth/login',d,httpOptions).pipe(map(res=>res)).subscribe(data =>{
          resolve(data);
        }, (err)=>{
          reject(err);
        })
    })
  }

  changePassword(v){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'change-password',{data: v},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  checking_me() {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(url+'me',httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  refresh(){
    return new Promise((resolve, reject)=>{
      this.storage.getItem('token').subscribe(value => {
        let headers = new HttpHeaders;
        headers.append('Content-Type','application/json');
        headers.append('Authorization', 'Bearer '+value);

        this.http.post(url+'auth/refresh',{e:'e'}).pipe(
          map(res=>res)).subscribe(data =>{
            resolve(data);
          }, (err)=>{
            reject(err);
          })
      })
    })
  }
}
