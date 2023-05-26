import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { urlApi, url } from 'app/main/url';

@Injectable({
  providedIn: 'root'
})
export class MenuServices {

  urlstatic = `${urlApi}master/menu-master`;
  urldivision = `${urlApi}hris/division`;
  urlsubDivision = `${urlApi}master/subagian`;
  urlMenuRegister = `${urlApi}master/menu-register`;

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  getData(data) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        let searchfor = data.search ? 
        `${this.urlstatic}?page=${data.pages}&user=${data.user_id}&q=${data.search.toUpperCase()}` : 
        `${this.urlstatic}?page=${data.pages}&user=${data.user_id}`;
        this.http.get(searchfor, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataDivision(data) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        let searchfor = data.search ? 
        `${this.urldivision}?page=${data.pages}&q=${data.search.toUpperCase()}` : 
        `${this.urldivision}?page=${data.pages}`;
        this.http.get(searchfor, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataSubDiv(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        let searchfor = data.search ? 
        `${this.urlsubDivision}?page=${data.pages}&q=${data.search.toUpperCase()}` : 
        `${this.urlsubDivision}?page=${data.pages}`;
        this.http.get(searchfor, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  getDataMenuRegister(q?){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        
        this.http.get(this.urlMenuRegister, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  update(id,data) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.put(urlApi + 'master/menu-update/' + id, { data: data }, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  tesdata(){
    return new Promise((resolve, reject) => {
    this.http.get(url+'view-kontrak/110106').pipe(
      map(res => res)).subscribe(data => {
        resolve(data);
      }, (err) => {
        reject(err);
      })
    });
  }

  addData(data) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        
        this.http.post(urlApi + 'master/menu-add', { data: data }, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  delete(id) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.delete(urlApi + 'master/menu-delete/' + id, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }
}
