import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { urlApi } from 'app/main/url';

@Injectable({
  providedIn: 'root'
})
export class ContactPersonService {

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) 
  { }


  getDataAllContactPerson(){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'master/contactpersons/all',httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
      })
  }

  
  getDataContactPersons(data) {    
    return new Promise((resolve, reject) => {
    this.storage.getItem('token').subscribe(val => {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+val
      })
    };
    let searchfor = data.search ? `master/contactpersons?page=${data.pages}&search=${data.search.toUpperCase()}` : `master/contactpersons?page=${data.pages}`;
      this.http.get(urlApi+searchfor,httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  } 

  getDataContactPersonsFull() {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'master/contactpersons?all="all"',httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataContactPersonsDetail(id) {
    let a = id == 'add' ? '' : id 
    console.log(a)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'master/contactpersons/'+a,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  updateDataContactPersons(id,data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.put(urlApi+'master/contactpersons/'+id,{data: data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  addDataContactPersons(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
      this.http.post(urlApi+'master/contactpersons/add',{data: data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }
  
  deleteDataContactPersons(id) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.delete(urlApi+'master/contactpersons/'+id,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("Delete Berhasil");
          }, (err) => {
            reject(err);
            console.log("Delete Gagal");
          })
      })
    })
  }

  contactSelect(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'master/contactpersons/selected', {data : data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }
  
  
}