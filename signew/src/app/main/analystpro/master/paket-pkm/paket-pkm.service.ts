import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { urlApi } from 'app/main/url';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaketPkmService {

  public datadata = []; 
  urln_pktuji = 'master/paketuji';
  url_paketpkm = 'master/specific-package';
  url_paketpkmsub = 'master/subspecific-package';

  public data = new BehaviorSubject<any>([]); 
  public datapeview = new BehaviorSubject<any>([]); 

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  copyPaketId(data){
    this.data = new BehaviorSubject(this.datadata);
    this.data.next(data);
    console.log(this.data);
  } 

  getDatapaketpkm(data) { 
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      let searchfor = data.search ? `master/specific-package?page=${data.pages}&search=${data.search.toUpperCase()}` : `master/specific-package?page=${data.pages}`;
        this.http.get(urlApi+searchfor,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("succses");
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  deleteDatapaketpkm(id) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.delete(urlApi + this.url_paketpkm + '/' + id,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  approvedPrice(id, status) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+`master/accept-specific-package?id_specific_package=${id}&status=${status}`,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("Berhasil");
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataDetailpaketpkm(id) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi + this.url_paketpkm + '/' + id,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataDetailpaketpkmBySub(id) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi + this.url_paketpkmsub,{id},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataParameterUji(data) { 
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      let searchfor = data.search ? `master/parameteruji?page=${data.pages}&search=${data.search.toUpperCase()}` : `master/parameteruji?page=${data.pages}`;
        this.http.get(urlApi+searchfor,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("succses");
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  addDatapaketpkm(data) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+ this.url_paketpkm + '/add',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("Berhasil Tersimpan");
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  updateDatapaketpkm(id,data) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.put(urlApi + this.url_paketpkm +'/' + id,{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("berhasil di Update");
          }, (err) => {
            reject(err);
          })
      })
    })
  }

}
