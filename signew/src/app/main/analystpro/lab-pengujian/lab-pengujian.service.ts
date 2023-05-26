import { Injectable, EventEmitter } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { urlApi } from 'app/main/url';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as _moment from "moment";
import { labForm } from './lab-pengujian/data.model';
import { MatDialog } from '@angular/material/dialog';
import { LabDoneComponent } from 'app/main/analystpro/lab-pengujian/lab-done/lab-done.component';

@Injectable({
  providedIn: 'root'
})
export class LabPengujianService {

  httpOption;
  private messageSource = new BehaviorSubject<number>(0);
  currentMessage = this.messageSource.asObservable();
  public onChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    public storage: LocalStorage,
    private _dialog: MatDialog
  ) { 
    this.getToken();
  }

  changeLab(idlab: number) {
    this.currentMessage = of(idlab);
    this.onChange.emit(idlab);
  }

  getLoading(){
    return this._dialog.open(LabDoneComponent, {
      height: 'auto',
      width: "200px",
      disableClose: true
    });
  }

  getToken(){
    this.storage.getItem('token').subscribe(val => {
      this.httpOption = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
    });
  }

  getDataExcelSPK(to,from,idlab){
    return new Promise((resolve, reject) => {
      this.http.get(urlApi+'analystpro/excel-spk?idlab='+idlab+'&from='+from+'&to='+to,this.httpOption).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
  }


  getTotalParameter(idlab, ev){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
         headers: new HttpHeaders({
           'Content-Type':  'application/json',
           'Authorization': 'Bearer '+val
         })
       };
      this.http.get(urlApi+'analystpro/lab-data-count?lab='+idlab+'&approve='+ev,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getInfoData(v){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
         headers: new HttpHeaders({
           'Content-Type':  'application/json',
           'Authorization': 'Bearer '+val
         })
       };
      this.http.get(urlApi+'analystpro/get-info-parameter?id_transaction_parameter='+v,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataComplain(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
         headers: new HttpHeaders({
           'Content-Type':  'application/json',
           'Authorization': 'Bearer '+val
         })
       };
      this.http.post(urlApi+'analystpro/complain/get-data-parameter-complain',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  savingDataComplain(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
         headers: new HttpHeaders({
           'Content-Type':  'application/json',
           'Authorization': 'Bearer '+val
         })
       };
      this.http.post(urlApi+'analystpro/complain/sending-data-complain',{data: data},httpOptions).pipe(
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
      this.http.post(urlApi+'analystpro/indexingfor?page=' + data.pages , {data},httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataOnlyComplain(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
         headers: new HttpHeaders({
           'Content-Type':  'application/json',
           'Authorization': 'Bearer '+val
         })
       };
      this.http.get(urlApi+'analystpro/complain/get-data-prep-approve?idtechdet=' + data,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  // getDataForm(data){
  //   return this.getData(data).pipe(map((apiResponse: any) => 
  //     this.fb.group({
  //       data: this.fb.array(apiResponse.data.map(t => this.generateArrayData(t)))
  //     })
  //   ))
  // }

  generateArrayData(apiResponse: any){
    const t = this.fb.group({
      checked: [apiResponse.checked],
      id: [apiResponse.id],
      id_parameteruji: [apiResponse.id_parameteruji],
      id_kontrakuji: [apiResponse.transaction_sample.id_contract],
      contract_no: [apiResponse.transaction_sample.kontrakuji.contract_no],
      id_contract_category: [apiResponse.transaction_sample.kontrakuji.id_contract_category],
      title: [apiResponse.transaction_sample.kontrakuji.contract_category.title],
      group_name: [apiResponse.parameteruji_one.analystgroup.group_name],
      simplo: [apiResponse.simplo],
      duplo: [apiResponse.duplo],
      triplo: [apiResponse.triplo],
      hasiluji: [apiResponse.hasiluji],
      id_standart: [apiResponse.id_standart],
      id_lod: [apiResponse.id_lod],
      nama_lod: [apiResponse.lod.nama_lod],
      kode_lod: [apiResponse.lod.kode_lod],
      id_lab: [apiResponse.id_lab],
      nama_lab: [apiResponse.lab.nama_lab],
      id_unit: [apiResponse.id_unit],
      nama_unit: [apiResponse.unit.nama_unit],
      kode_unit: [apiResponse.unit.kode_unit],
      id_metode: [apiResponse.id_metode],
      metode: [apiResponse.metode.metode],
      kode_metode: [apiResponse.metode.kode_metode],
      name_en: [apiResponse.parameteruji_one.name_en],
      name_id: [apiResponse.parameteruji_one.name_id],
      format_hasil: [apiResponse.format_hasil],
      id_sample: [apiResponse.id_sample],
      disc_parameter: 0,
      status: [apiResponse.status],
      position: [apiResponse.position],
      sub_catalogue_name: [apiResponse.transaction_sample.subcatalogue.sub_catalogue_name],
      no_sample: [apiResponse.transaction_sample.no_sample],
      parametertype_name: [apiResponse.parameteruji_one.parametertype.name],
      sample_name: [apiResponse.transaction_sample.sample_name],
      tgl_estimasi_lab: [apiResponse.transaction_sample.tgl_estimasi_lab],
      id_statuspengujian: [apiResponse.transaction_sample.id_statuspengujian],
      tgl_input: [apiResponse.transaction_sample.tgl_input],
      tgl_selesai: [apiResponse.transaction_sample.tgl_selesai],
      id_subcatalogue: [apiResponse.transaction_sample.id_subcatalogue],
      statuspengujian: [apiResponse.transaction_sample.statuspengujian.name],
      price: [apiResponse.transaction_sample.price],
      info: [apiResponse.info],
      n: [apiResponse.n],
      m: [apiResponse.m],
      c: [apiResponse.c],
      mm: [apiResponse.mm]
    })
    return t;
  }

  getDataApproval(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.get(urlApi+'analystpro/lab-view?id_contract='+data,this.httpOption).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getSelectContract(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/selected-index-contract?page='+data.pages , {data: data},this.httpOption).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getSelectSample(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/selected-index-sample?page='+data.pages , {data: data},this.httpOption).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getSelectParameteruji(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      this.http.post(urlApi+'analystpro/selected-index-parameteruji?page='+data.pages , {data: data},this.httpOption).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  sendExcuse(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/save-excuse',{data: data},httpOptions).pipe(
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

  addDataLabApproval(data) { 
    
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/save-hasil-approval',{data: data},httpOptions).pipe(
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

  approveContractManager(data) { 
    
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

  addDataLab(data) { 
    
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/save-hasil',{data: data},httpOptions).pipe(
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

  sendDescription(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/desc-add',{data: data},httpOptions).pipe(
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

  statusChange(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/accept-lab',{data: data},httpOptions).pipe(
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

  getDataChat(id){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'analystpro/description-sample?idsample=' + id,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataPhoto(id){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'analystpro/sample-photo?idsample=' + id,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataMemo(id){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'analystpro/description-sample?memo&idsample=' + id,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataSelect(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
        console.log(data);
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };

        this.http.post( urlApi+'analystpro/selected-index?page='+data.pages,{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  rubahtanggalnormal(date){
    let tanggal = date.split('/')[0];
    let bulan = date.split('/')[1];
    let tahun = date.split('/')[2];
    return `${tahun}-${bulan}-${tanggal}`;
}

  dateClass(shareDate : any) {
    return (date: _moment.Moment): MatCalendarCellCssClasses => {
      const reservedArray = shareDate;
      let day = '';
      for (const element of reservedArray) {
        let tanggal = new Date(this.rubahtanggalnormal(element.estimasi_lab));
        if (date.toDate().getFullYear() === tanggal.getFullYear() && date.toDate().getMonth() === tanggal.getMonth() &&
          date.toDate().getDate() === tanggal.getDate()) {
          day = 'example-custom-date-class';
          return day;
        } else {
          return;
        }
      }
      return day;
    }
  }

  getDataExcel(idlab, date, date2){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      }; 
        this.http.get(urlApi+'analystpro/excel-format-hasil?idlab=' + idlab + '&from=' + date+'&to='+date2,httpOptions).pipe( 
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataExcelFromContract(idlab, idcontract){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      }; 
        this.http.get(urlApi+'analystpro/excel-format-hasil-by-contract?idlab=' + idlab + '&idcontract='+idcontract,httpOptions).pipe( 
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  getDataImportExcel(){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'analystpro/export-data',httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  importExcel(data, st){
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/import-data',{data:data, status: st.toLocaleString()},httpOptions).pipe(
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

  getDataContractLab(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      let search = data.search ? '&search='+data.search : '';
        this.http.get(urlApi+'analystpro/get-contract-param?page='+data.pages+'&idlab='+data.id_lab + search,httpOptions).pipe(
          map(res => res)).subscribe(data => { 
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  } 


  approveDataGetSample(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/get-sample-approve',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => { 
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  approveDataLabProccess(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/lab-process-approve',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => { 
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  unapproveDataLabDone(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/lab-done-unapprove',{data: data},httpOptions).pipe(
          map(res => res)).subscribe(data => { 
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getInfoParameter(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'analystpro/lab-info?idparameter='+data,httpOptions).pipe(
          map(res => res)).subscribe(data => { 
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  getMemoLab(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'analystpro/memo-lab?id_contract='+data,httpOptions).pipe(
          map(res => res)).subscribe(data => { 
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

}
