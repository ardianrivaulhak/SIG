import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { urlApi } from 'app/main/url';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PaketparameterService {

  public datadata = []; 
  urln_pktuji = 'master/paketuji';
  urln_pktparam = 'master/paketparameter';

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

  
   setSpecialPrice(d){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.get(urlApi+'master/setspecialprice?idpaketuji='+d,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            // console.log("Berhasil Connect");
          }, (err) => {
            reject(err);
          })
      })
    })
   }

  getDataPaketuji(data) {
    
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      let searchfor = data.search 
      ? `${this.urln_pktuji}?page=${data.pages}&search=${data.search.toUpperCase()}` 
      : `${this.urln_pktuji}?page=${data.pages}`;
        this.http.get(urlApi+searchfor,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            // console.log("Berhasil Connect");
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  getDataPaketparameter(data) {
    
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      let searchfor = data.search ? `master/paketparameter?page=${data.pages}&search=${data.search.toUpperCase()}` : `master/paketparameter?page=${data.pages}`;
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
        this.http.post(urlApi+'master/parameteruji?page='+data.pages,{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("succses");
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataDetailPaketparameter(id) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi + this.urln_pktparam + '/' + id,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }



  updateDataPaketparameter(id,data) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.put(urlApi + this.urln_pktparam +'/' + id,{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  } 

  addDataPaketparameter(data) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+ this.urln_pktparam + '/add',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);  

          }, (err) => {
            reject(err);
          })
      })
    })
  }

  deleteDataPaketparameter(id) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.delete(urlApi + this.urln_pktparam + '/' + id,httpOptions).pipe(
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
        this.http.get(urlApi+`master/accept-paketparameter?id_paketuji=${id}&status=${status}`,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("Berhasil");
          }, (err) => {
            reject(err);
          })
      })
    })
  }
}
