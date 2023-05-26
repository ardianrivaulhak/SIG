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
export class UsercustomersService {

  certificateUrl = `analystpro/connect`;

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  getDataUser(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/connect/user-data?page='+data.pages,{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  addDatauser(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/connect/user-data/add',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  updateDatauser(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/connect/user-data/update',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  deleteDatauser(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/connect/user-data/delete',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }
}
