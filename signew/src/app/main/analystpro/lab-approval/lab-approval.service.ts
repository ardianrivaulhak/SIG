import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError, Subject, observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { url, urlApi } from 'app/main/url';
import { BehaviorSubject } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class LabApprovalService {


  // sharedMessage = this.data.asObservable();
  public datadata = []; 
  public datadatapeview = []; 
  public data = new BehaviorSubject<any>([]);  
  
  public datapeview = new BehaviorSubject<any>([]); 

  private _client: any = "";
  

  // public subject = new Subject<any>();
  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) {
    // this.data = new BehaviorSubject(this.datadata);
   }

  sendSampleCertificate(data){
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/send-sample-certificate',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getData(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        let search = data.search ? data.search : 0;
        let costumers = data.customers ? data.customers : 0;
        let date = data.date ? data.date : 0;
        let category = data.category ? data.category : 0;
        this.http.get(urlApi+'analystpro/lab-approve?page='+data.pages+'&search='+search+'&category='+category+'&customers='+costumers+'&date='+date, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataParameterInfo(data,id_lab?) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        let idlab = id_lab ? '&idlab='+id_lab : '';
        this.http.get(urlApi+'analystpro/get-parameter-info?from='+data.from+'&to='+data.to+idlab, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataSampleAccepted(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };

        this.http.get(urlApi+'analystpro/get-sample-accepted?from='+data.from+'&to='+data.to, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  saveKesimpulan(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/save-kesimpulan',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  approveContrac(data) { 
    
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/manager-approve',{data: data},httpOptions).pipe(
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

}
