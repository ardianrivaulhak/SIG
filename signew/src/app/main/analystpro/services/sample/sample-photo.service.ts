import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { urlApi, url } from 'app/main/url';

@Injectable({
  providedIn: 'root'
})
export class SamplePhotoService {

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  getData(idsample) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        let a = urlApi +'analystpro/sample-photo?idsample='+idsample;
        this.http.get(a, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }
}


