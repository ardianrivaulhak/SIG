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
export class FinanceService {

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  getListInvoiceProducts(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/finance?page=' + data.pages , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDetailInvoiceProduct(data)
  {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/finance/detail' , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  submitDataInvoice(data, id)
  {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/finance/detail/save-data/' + id , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  approveWaiting(data)
  {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/finance/approved/waiting', { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  printedInvoice(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };      
        this.http.post(urlApi+'analystpro/products/finance/detail/prints',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  approveFinanceIndex(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };      
        this.http.post(urlApi+'analystpro/products/approve-finance/index',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  approvedInvoice(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };      
        this.http.post(urlApi+'analystpro/products/approve-finance/approved',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  submitPayment(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };      
        this.http.post(urlApi+'analystpro/products/finance/payment/submit',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

}
