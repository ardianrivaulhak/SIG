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
export class CertificateService {

  certificateUrl = `analystpro/certificate`;

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  getFormat(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/master/format?page='+data.pages,{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getContract(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/admin-certificate?page='+data.pages,{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getContractTrack(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/track?page='+data.pages,{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  
  changeTeam(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/track/change-team',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }



  // mengambil data kontrak
  getContractData(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate?page='+data.pages,{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  sampleCertInformationByContract(id){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.get(urlApi+'analystpro/certificate-export-sample-info?id_contract='+id, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getContractDetail(id){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.get(urlApi + this.certificateUrl + '/' +  id, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getSampleLabinContract(id, data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/' +  id + '/sample-lab?page='+data.pages,{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getTransactionSample(id){
    console.log(id)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.get(urlApi + this.certificateUrl + '/sample/' +  id , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getSearchCustomer(id, data){
    console.log([id, data])
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/sample/' +  id + '/search-customer', {data},  httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  makeLHU(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi + this.certificateUrl + '/sample/makelhu',data,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("Success Updated");
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  test()
  {
    console.log('test')
  }

  getLhuInContract(id, data)
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
        this.http.post(urlApi + this.certificateUrl + '/' +  id + '/lhu?page=' + data.pages,{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getLhuInContractwithParameters(id, data)
  {
    console.log(id)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/' +  id + '/lhu-with-parameter',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getLhuInContractwithOneParameters(id, data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/' +  id + '/lhu-with-parameter-one',{data : { 
          id : id,
          data : data
        }},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  creatNumberTitle(data)
  {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/sample/cert/getnumber',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  creatNumberRevision(data)
  {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/sample/cert/getnumberrev',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  revisionData(data)
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
        this.http.post(urlApi+'analystpro/certificate/revision-data', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getDetailCertificate(id){
    console.log(id)
  }

  duplicateCertificate(data)
  {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/sample/cert/duplicate',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  duplicateCertificateRev(data)
  {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/sample/cert/duplicate/revision',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  approveRoaData(data){
  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi + this.certificateUrl + '/sample/cert/approve-staff',{data : data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("Success Updated");
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  deleteResultOfAnalisys(id)
  {
   
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.delete(urlApi + this.certificateUrl + '/sample/cert/delete/' + id ,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  deleteBulkResultOfAnalisys(data)
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
        this.http.post(urlApi + this.certificateUrl + '/sample/cert/delete/bulkDelete', {data : data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getParameter(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/sample/parameter?page=' + data.pages ,{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  updateCertificateData(id, data){
  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/sample/cert/updatecertificate',{data, id},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  updateDataBulk(data, update){
  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/roa/sample/lhu',{data : data, update : update},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataResultofAnalysis(data)
  {
   
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/roa',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDetailResultofAnalysis(data)
  {
   
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/roa/'+ data.id_contract +'/contract',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  parameterUpdate(data, deleted){
   
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi + this.certificateUrl + '/parameter/update',{data : data['parameters'], deleted},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("Success Updated");
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  parameterListing(data){
   console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi + this.certificateUrl + '/parameter/listing/updated',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("Success Updated");
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  approveRoManager(data){
    
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi + this.certificateUrl + '/sample/cert/approve-manager',data,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("Success Updated");
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getArchiveData(data)
  {  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/archive',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getArchiveDetail(data)
  {  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/archive/' + data.id_contract + '?page=' + data.pages ,{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  uploadAkg(id, data, file){
  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/uploadakg',{id, data, file},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  uploadAttachmentRev(data, id){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/upload-file?id=' + id, data, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  attachmentDataRevision(data)
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
        this.http.post(urlApi+'analystpro/certificate/attachmentrevision', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  historyRevision(data)
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
        this.http.post(urlApi+'analystpro/certificate/revision-data', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  attachmentDataRevisionRemove(data)
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
        this.http.post(urlApi+'analystpro/certificate/attachmentrevision/remove', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }
  
  // =========================================================================================== // 
  // ================================== Result Of Analysis ===================================== //
  // =========================================================================================== // 

  getResultOfAnalysis(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/result-sample?page='+data.pages,{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getSelectTeam(data){
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };
        this.http.get(urlApi + 'analystpro/certificate/get/team', httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
      })
  }

  addSelectTeam(data, form) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi + 'analystpro/certificate/select-team', {data : data, form : form}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getSampleResultOfAnalysis(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/result-sample/sample?page='+data.pages,{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  

  getDetailAdmin(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/admin-certificate/' + data['id_contract'] + '?page=' + data['pages'], {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getDetailDataContract(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.get(urlApi+'analystpro/admin-certificate/contract/' + data , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  sendDraft(data, idcontract)
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
        this.http.post(urlApi+'analystpro/certificate/draft', {data, idcontract}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  sendRelease(data)
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
        this.http.post(urlApi+'analystpro/certificate/release', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

   sendReleaseWithOutEmail(data)
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
        this.http.post(urlApi+'analystpro/certificate/release-with-out-email', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  sendReleaseWithOutEmailinCertificate(data)
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
        this.http.post(urlApi+'analystpro/certificate/release-with-out-email/in-certificate', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }


  resendEmail(data)
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
        this.http.post(urlApi+'analystpro/certificate/resendemail', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  getDetailSample(id_sample){
    console.log(id_sample)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.get(urlApi + this.certificateUrl + '/samplelab/' +  id_sample , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getParameterinSample(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.get(urlApi + this.certificateUrl + '/sample/' +  data.id_sample + '/parameter?page=' + data.pages, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  akgData(data)
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
        this.http.post(urlApi+'analystpro/certificate/dataakg', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  deleteAkgData(data)
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
        this.http.post(urlApi+'analystpro/certificate/deleteakg', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  sendEmailAkg(data)
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
        this.http.post(urlApi+'analystpro/certificate/sendEmailAkg', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  informationPrint(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.get(urlApi+'analystpro/admin-certificate/get-info/' + data, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  addInformationPrint(data, id){
    console.log(id)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/admin-certificate/get-info/'+ id +'/post',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {4
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
    })
  }

  emailUpdate(id, data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + 'analystpro/admin-certificate/' +  id + '/email',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  changeCondition(data, form){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + 'analystpro/certificate/archive/' +  data.idcontract + '/change-condition',{data, form}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  changeConditionDraft(data, form){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + 'analystpro/certificate/archive/' +  data.idcontract + '/change-condition/draft',{data, form}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  addParameter(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + 'analystpro/certificate/sample/parameter/add',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  addParameterInOtherLhu(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + 'analystpro/certificate/lhu/cert/getparameterinotherlhu',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  copyDataParameter(data, id){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + 'analystpro/certificate/sample/parameter/copy/data',{data, id}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  contactPerson(data){
    console.log(data)
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

  getAllParameter(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/certificate/'+ data.idcontract +'/parameter/all', {data} , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  updateAllParameter(id, data, selectParameter) {
    console.log(id)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi+'analystpro/certificate/'+ id.idcontract +'/parameter/update', {id, data, selectParameter} , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getParameterinLab(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/getparameter/inlab/' + data,{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getParameterHasBeenDelete(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/getparameter/hasbeen/detele/' + data, {data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  activedCertificate(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/lhu/cert/active',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  detailLhu(data)
  {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/sample/lhu/' + data ,{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  // getContractFollow(data) {
  //   return new Promise((resolve, reject) => {
  //     this.storage.getItem('token').subscribe(val => {
  //     let httpOptions = {
  //       headers: new HttpHeaders({
  //         'Content-Type':  'application/json',
  //         'Authorization': 'Bearer '+val
  //       })
  //     };
  //     this.http.post(urlApi+'analystpro/certificate/follow?page='+data.pages,{data}, httpOptions).pipe(
  //       map(res => res)).subscribe(data => {
  //         resolve(data);
  //       }, (err) => {
  //         reject(err);
  //       })
  //     })
  //   })
  // }

  // approveFollowData(data) {
  //   return new Promise((resolve, reject) => {
  //     this.storage.getItem('token').subscribe(val => {
  //     let httpOptions = {
  //       headers: new HttpHeaders({
  //         'Content-Type':  'application/json',
  //         'Authorization': 'Bearer '+val
  //       })
  //     };
  //     this.http.post(urlApi + this.certificateUrl + '/follow/approve',{data}, httpOptions).pipe(
  //       map(res => res)).subscribe(data => {
  //         resolve(data);
  //       }, (err) => {
  //         reject(err);
  //       })
  //     })
  //   })
  // }

  getFollowData(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi + this.certificateUrl + '/follow/data/data?page=' + data.pages,{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }


  approveFollowData(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi + this.certificateUrl + '/follow/aprrove-data',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getTeam(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi + this.certificateUrl + '/get-team-certificate',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  detailSample(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.get(urlApi + this.certificateUrl + '/sample/' + data.id_transaction , httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getLHUcontract(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi + this.certificateUrl + '/get-all-lhu',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  updateSertifikatParameter(id, data){
  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/parameter/update/lhu/bulk',{data, id},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  deleteBulkParameter(data, id){
  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/data/parameter/delete-bulk/lhu/deleted',{data, id},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  addParameterCert(data, id){
  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/data/add/parameter/lhu/newparameter',{data, id},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getParameterCert(data, id){
  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/data/get/parameter/lhu',{data, id},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  saveListingParameter(data, id){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/data/add/listing-parameter/lhu',{data, id},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  copyDataParameterinLhu(data, id){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/data/parameter/copy-data',{data, id},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  deleteDataParameterinLhu(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/data/parameter/delete-data',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  
  getDataDraft(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/get-draft/data-draft?page=' + data.pages ,{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  removeDataDraft(data){
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.post(urlApi + this.certificateUrl + '/get-draft/remove-data-draft',{data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log(data)
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataCertificatinContract(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/get-data-lhu/get-lhu/incontract',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  reportKpi(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/admin-certificate/getdata/reportcertificate/download',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getAkg(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/get-akg',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getContractList(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/get-contract?page=' + data.pages ,{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  listLHUbyContract(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/list-lhu/by-contract?page=' + data.pages ,{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  listParameterinCertificate(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/list-parameter/by-certificate',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  submitAkg(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/akg/parameter/submit-akg',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  approveAkg(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/akg/parameter/approve-akg-staff',{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getAkgFormat() {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.get(urlApi+'analystpro/certificate/akg/fomat/selected', httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }


  getApproveAkg(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/akg/list-approval',{data : data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  approveListAkg(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/akg/list-approval/approve',{data : data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  showAkgData(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/certificate/akg/show-data',{data : data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }



  
}
