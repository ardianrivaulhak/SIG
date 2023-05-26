import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { urlApi } from 'app/main/url';

@Injectable({
  providedIn: 'root'
})
export class StatuspengujianService {

constructor(
    public http: HttpClient,
    public storage: LocalStorage,
    ) { }

getDataStatusPengujian(data) {
    
  return new Promise((resolve, reject) => {
    this.storage.getItem('token').subscribe(val => {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+val
      })
    };
    let searchfor = data.search ? `master/statuspengujian?page=${data.pages}&search=${data.search.toUpperCase()}` : `master/statuspengujian?page=${data.pages}`;
      this.http.get(urlApi+searchfor,httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
    })
  })
}

}