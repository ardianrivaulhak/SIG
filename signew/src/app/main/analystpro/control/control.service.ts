import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { url, urlApi } from 'app/main/url';
@Injectable({
  providedIn: 'root'
})
export class ControlService {

  controlUrl = `analystpro/kendali`;

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

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
      this.http.post(urlApi+'analystpro/kendali?page='+data.pages,{data}, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  // approve data bulk contract
  approveDataContract(data) 
  {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+this.controlUrl+'/approve-contract',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
            console.log("Success Updated");
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  // get detail contract
  getDetailDataContract(id)
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
        this.http.get(urlApi + this.controlUrl + '/' +  id, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  // get sample in contract by id contract
  getDataSampleInContract(data)
  {
     console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi + this.controlUrl + '/sample?page=' + data.pages ,data, httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  // get detail sample
  getDetailDataSample(id_sample)
  {
    console.log(id_sample)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.get(urlApi + this.controlUrl + '/sample/' + id_sample + '/data' , httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  // update estimate date lab (modals)
  updateEstimasiLab(idSample, data)
  {
    console.log({idSample, data})
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/'+idSample + '/data',{data: data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  
  // update bulk estimate date lab (modals)
  updateBulkEstimasiLab (sample, data)
  {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/data/bulk',{ data: data, sample : sample },httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }


  // paste estimate lab
  pasteOneDataEstimateLab(idSample, data)
  {
    console.log({idSample, data})
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/'+idSample + '/paste',{data: data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  // paste all estimate lab
  pasteAllDataEstimateLab(id_contract, data)
  {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/paste-all/' + id_contract,{data: data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  // approve sample
  approveSample(data)
  {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/approve',{data: data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  // get parameter in sample 
  getDataParameterInSample(data)
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
        this.http.post(urlApi + this.controlUrl + '/sample/parameter?page=' + data.pages ,{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })

  }

  // get parameter in sample 
  getDataParameterinContract(data)
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
        this.http.get(url + 'kendali/sample/parameter/contract/' + data, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }
  

  getDataDescription(idContract)
  {
    console.log(idContract)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.get(urlApi+ this.controlUrl + '/' + idContract + '/description',httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }
  

  // update description contract
  updateDescriptionContract(idContract, data)
  {
    console.log({idContract, data})
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl + '/' + idContract + '/description', {data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getDetailDataParameter(idParameter)
  {
    console.log(idParameter)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + val
          })
        };
        this.http.get(urlApi + this.controlUrl + '/sample/parameter/' +  idParameter, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  updateParameter(id_parameter, data)
  {
   
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/parameter/'+id_parameter+'/update',{data : data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  updateBulkParameter(checklist, data)
  {
  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/parameter/update/bulk-data',{checklist: checklist, data : data },httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  updateBulkParameterAllSample(checklist, data, id_contract)
  {
  
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/parameter/update/bulk-data/all-sample',{checklist: checklist, data : data, id_contract : id_contract },httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  pasteParameter(id_parameter, data)
  {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/parameter/'+id_parameter+'/paste',{data : data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  pasteAllParameter(idsample, data)
  {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/'+idsample+'/paste-all',{data : data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  pasteAllParameterInContract(data)
  {
    console.log(data.id_parameteruji)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/paste-all/contract/'+data.id_parameteruji,{data : data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  loopingDataCopy(data)
  {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl +'/sample/parameter/copy',{data : data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

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
        this.http.post(urlApi + this.controlUrl + '/sample/photo' ,{data : data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })

  }

  getDataExportExcel(date){ 
      console.log(date)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/kendali/excel-export/data-report', {date}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  savePhoto(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.post(urlApi+'analystpro/photo-save',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data); 
            // console.log("Berhasil");
          }, (err) => {
            reject(err);
            console.log("gagal");
          })
      })
    })
  }

  // update description contract
  backTrackContract(data)
  {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+ this.controlUrl + '/backtrack/contract', {data},httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  }

  getSelectEmployee(data){
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };
        this.http.post(urlApi+ this.controlUrl + '/sample/get-team', { data : data }, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
        })
      })
  }


  


}
