import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { urlApi } from 'app/main/url';

@Injectable({
  providedIn: 'root'
})
export class SampleUjiService {

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  getDataSampleUji(data) {  
  return new Promise((resolve, reject) => {
    this.storage.getItem('token').subscribe(val => {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+val
      })
    };
    this.http.post(urlApi + `analystpro/sample-check?page=${data.pages}`, {data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
    })
  })
}

getDataSampleUjiDetail(data) {    
    console.log(data)
  return new Promise((resolve, reject) => {
    this.storage.getItem('token').subscribe(val => {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+val
      })
    };
    this.http.get(urlApi + `analystpro/sample-check/${data}` ,
     httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
    })
  })
}

getDataSampleUjiCheck(data) {  
  return new Promise((resolve, reject) => {
    this.storage.getItem('token').subscribe(val => {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+val
      })
    };
    this.http.post(urlApi + `analystpro/sample-check/check?`, {data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
    })
  })
}


  changeStatusSample(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/sample-status',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("berhasil Update");
          }, (err) => {
            reject(err);
            console.log("gagal");
          })
      })
    })
  }

  approveSample(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/sampletest/approve',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("berhasil Update");
          }, (err) => {
            reject(err);
            console.log("gagal");
          })
      })
    })
  }

  approveOneSample(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/sampletest/approve/one',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("berhasil Update");
          }, (err) => {
            reject(err);
            console.log("gagal");
          })
      })
    })
  }

  getSampleDetail(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/sampleDetail',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("berhasil");
          }, (err) => {
            reject(err);
            console.log("gagal");
          })
      })
    })
  }

  getDatSampleUji(data) {    
  console.log(data)
  return new Promise((resolve, reject) => {
    this.storage.getItem('token').subscribe(val => {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+val
      })
    };
    this.http.post(urlApi + `analystpro/sampleDetail/check?page=${data.pages}`  , {data : data},  httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
    })
  })
}

}
