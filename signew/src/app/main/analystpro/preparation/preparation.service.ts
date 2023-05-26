import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { urlApi } from 'app/main/url';

@Injectable({
  providedIn: 'root'
})
export class PreparationService {

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  getDataPreparation(data) {    
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi + `analystpro/preparation?page=${data.pages}`, {data : data} ,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("berhasil connect");
          }, (err) => {
            reject(err);
            console.log("Gagal connect");
          })
      })
    })
  }

   // get data contract 
  getContractData(data) 
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/preparation?page='+data.pages, {data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getDetailContract(id_contract) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'analystpro/preparation/' + id_contract, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  // APi untuk data sample
  getDataDetailPreparation(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+`analystpro/sampletransaction?page=${data.pages}`,{data: data},httpOptions).pipe(
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


  // Api parameter
  getDataDetailPreparationParameter(data) {
console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/parametertransaction?page=' + data.page,{data: data.sampleid},httpOptions).pipe(
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


  // Api parameter
  getDataDetailPreparationSample(data) {

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

  getDataLabFull() {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'master/lab',httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  saveDataBobot(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/bobotsampleadd',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log({data: data});
          }, (err) => {
            reject(err);
            console.log("gagal");
          })
      })
    })
  }

  updateDataBobot(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/bobotsampledit',{data:data},httpOptions).pipe(
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

  approvPreparation(data){
  return new Promise((resolve, reject) => {
    this.storage.getItem('token').subscribe(val => {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+val
      })
    };
      this.http.post(urlApi+'analystpro/accepted-preparation',{data: data},httpOptions).pipe(
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
        this.http.post(urlApi+'analystpro/approve-sample',{data: data},httpOptions).pipe(
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

  approveSampleToLab(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/approve-sample-to-lab',{data: data},httpOptions).pipe(
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

  // bachtiar edited

  getDataBobot(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/preparation/getbobot?page=' + data.page ,{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("berhasil tarik data");
          }, (err) => {
            reject(err);
            console.log("gagal");
          })
      })
    })
  }
  
  addBobotinSample(id_sample, data) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/preparation/postbobot',{data : {id_sample, data}},httpOptions).pipe(
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

  deleteBobotinSample(data) {

    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/preparation/deletebobot',{data},httpOptions).pipe(
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

  getDataDescription(data)
  {
    console.log(DataView)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ 'analystpro/memo-preparation/get/data-desc',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  updateDescriptionContract(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ 'analystpro/memo-preparation/update/data-desc/post', {data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  
  updateBulkDescriptionContract(data, idsample)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ 'analystpro/memo-preparation/update/data-desc/bulk-post', { data : data, idsample : idsample },httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getDataHistory(data) {    
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      let searchfor = data.search 
      ? `analystpro/history-preparation?page=${data.pages}&search=${data.search.toUpperCase()}` 
      : `analystpro/history-preparation?page=${data.pages}`;
      
        this.http.post(urlApi+searchfor,{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("berhasil connect");
          }, (err) => {
            reject(err);
            console.log("Gagal connect");
          })
      })
    })
  }

  toControl(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/history-preparation/to-control',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log({data: data});
          }, (err) => {
            reject(err);
            console.log("gagal");
          })
      })
    })
  }

  downloadExcel(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/history-preparation/download/excel',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log({data: data});
          }, (err) => {
            reject(err);
            console.log("gagal");
          })
      })
    })
  }
  // end edited

  getDataPhotoSample(data)
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
        this.http.post(urlApi + 'analystpro/kendali/sample/photo' ,{data : data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })

  }

}
