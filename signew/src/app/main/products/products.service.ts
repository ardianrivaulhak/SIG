

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
export class ProductsService {

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  contactPerson(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.get(urlApi+'analystpro/contact-persons/cert?id=' + data.id , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getAddressListData(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.get(urlApi+'analystpro/master/getaddress/cert?id=' + data.id , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getListProducts(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/getmedia-rtu?page=' + data.pages , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getListProductsDioxine(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/getdioxine-udara?page=' + data.pages , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }
  
  contractAddMediartu(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/add-contract/media-rtu' , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  contractListMediartu(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/contract/mediartu?page' + data.pages , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  contractDetailMediartu(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/contract/mediartu/details', { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getProductMediaRTU(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/contract/mediartu/get-products', { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getProductDioxin(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/contract/mediartu/get-products', { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  contractListDioxineUdara(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/contract/dioxinudara?page' + data.pages , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDetailContract(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/edit-contract' , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getValProduct(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/get-value/product/contract/media-rtu' , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  sendAttachmentFile(formdata,id) {
    console.log(formdata)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
           
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/attachment-data/' + id, formdata,  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  approveMediaRtu(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/contract/mediartu/approve/toLab', { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  deleteMediaRtu(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/contract/mediartu/delete-data', { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  contractEditMediartu(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/edit-contract/media-rtu' , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  sendImageAttachment(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+ 'analystpro/products/attachment-data/bloob/data-photo',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
   }

   getListPhotoProduct(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + 'analystpro/products/attachment-data/get-photo/data', {data:data},  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  downloadFile(v){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'responseType': 'blob' as 'json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+ 'analystpro/products/download-attachment/?id_attachment='+v, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
   }

  //  downloadFiles(v){
  //   return new Promise((resolve, reject) => {
  //     this.storage.getItem('token').subscribe(val => {
  //     let httpOptions = {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer '+val
  //       })
  //     };
  //       this.http.get(urlApi+ 'analystpro/products/download-attachment/?id_attachment='+v, httpOptions).pipe(
  //         map(res => res)).subscribe(data => {
  //           resolve(data);
  //         }, (err) => {
  //           reject(err);
  //         })
  //     })
  //   })
  //  }

   deleteFileAttachment(id) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/attachment/delete-data' , {id : id },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  approveData(id) {
    console.log(id)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/lab/approval/approv/media' , {id : id },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getSampleSend(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/contract/media-rtu/detail/product' , {data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  createContactPerson(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/products/mediartu/add/add-new-contact' , { data : data },  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

 

}
