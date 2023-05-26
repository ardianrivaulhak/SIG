
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
export class EdocsService {

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  masterDocument(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'edoc/master-document', {data} , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  masterDocumentInheritance(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/master-document/inheritance', {data} , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  masterEmployee(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'hris/employee', {data : data} , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  attachmentDocument(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/send-attactment/', data, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  viewDocument(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/attactment/' + data.id, data , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  addNewDocuments(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/documents/store/', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getDocuments(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/documents/get-data', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getDetailDocuments(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/documents/get-data/details', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  updateDetailDocument(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/documents/get-data/details/update-data', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  listAmandementDocument(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/documents/list-amandement', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  setActiveDocument(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/documents/all-list/set-active', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  updateAttachment(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/documents/all-list/update-list', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  attachmentDetail(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/documents/attachment/detail', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  viewedDocuments(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/documents/all-list/viewed-document', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getViewedDocuments(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/documents/all-list/viewed-document/get-view', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getGroups(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/groups', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getDetailGroups(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/groups/detail', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getEmployee(datasend)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/groups/get-employee', { datasend } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getTransactionEmployee(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/groups/detail/get-employee', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  addUserToGroup(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/groups/add-user', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  removeUserInGroup(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/groups/remove-user', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  addNewGroup(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/groups/add-new', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  AccessDocument(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/access/get-employee-access', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  removeFile(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/attachment-delete', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getAllEmployeeInAccess(datasend)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/access/get-employee-all', { datasend } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  addUserToAccessDocument(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/access/add-new-user', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  deleteUserToAccessDocument(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/access/delete-user', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  addUserByGroup(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/access/group/add-user-by-group', { data } , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  // attachmentAddDocument(data, identity){
  //   console.log(data)
  //   return new Promise((resolve, reject) => {
  //     this.storage.getItem('token').subscribe(val => {
  //       let httpOptions = {
  //         headers: new HttpHeaders({
  //           'Authorization': 'Bearer ' + val
  //         })
  //       };
  //       this.http.post(urlApi+'edoc/send-attactment/new-add', {data, identity}, httpOptions).pipe(
  //         map(res => res)).subscribe(data => {
  //           resolve(data);
  //         }, (err) => {
  //           reject(err);
  //         })
  //       })
  //   })
  // }

  attachmentAddDocument(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/send-attactment/new-add', data, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  addNewOtherDocument(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/other-documents/add-new-doc', {data : data} , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  deleteOtherDocument(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'edoc/other-documents/delete-document', {data : data} , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }


                                                        

}
