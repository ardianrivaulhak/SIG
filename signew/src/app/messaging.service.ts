import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireFunctions } from '@angular/fire/functions';
import {  Observable, Subject, BehaviorSubject } from 'rxjs'
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { url, urlApi } from 'app/main/url';
import { LocalStorage } from '@ngx-pwa/local-storage';

export class CompanyData{
  text: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private subject = new Subject<any>();
  private _company = new BehaviorSubject<CompanyData>({
      text: 'PT.Saraswanti Indo Genetech',
      id: 1
  })

  private _company$ = this._company.asObservable();

  getDataCompany(): Observable<CompanyData>{
    return this._company$;
  }

  setDataCompany(latestValue: CompanyData){
      return this._company.next(latestValue);
  }

  sendMessaged(message: any) {
    this.subject.next({ text: message.text, id: message.id });
  }

  clearMessaged() {
    this.subject.next();
  }

  getMessaged(): Observable<any> {
    return this.subject.asObservable();
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'key=AAAAleqVHrg:APA91bEQu5xkdz_4n7msiY4KcL5cQuEoivl2c2TRS-MO2e21IWpRmab_CTj4ITVV0pbbHeU08gJ2sX6Y4RwpjPgtFr6Dxb2Mm3Wt2GdbKRWZsHK4wfacZCZyUL5T9SvMPqddJtCxEJda'
    })
  };

  currentMessage = new BehaviorSubject(null);
  
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    public http: HttpClient,
    private storage: LocalStorage,
    private _func: AngularFireFunctions
  ) {
    this.angularFireMessaging.messages.subscribe(
      (_messaging) => {
        console.log(_messaging);
      }
    )
   }
   

   requestPermission(appname) {
      this.angularFireMessaging.requestToken.subscribe(
        (token) => {
          this.subscribeTokenToTopic(token, appname).then(g => console.log(g));
        },
        (err) => {
          console.error('Unable to get permission to notify.', err);
        }
      );
    }

    subscribeTokenToTopic(token, appname){
      return new Promise((resolve, reject) => {
        this.http.post('https://iid.googleapis.com/iid/v1/'+token+'/rel/topics/'+appname, {}, {headers: new HttpHeaders({
          'Authorization': 'key=AAAAleqVHrg:APA91bEQu5xkdz_4n7msiY4KcL5cQuEoivl2c2TRS-MO2e21IWpRmab_CTj4ITVV0pbbHeU08gJ2sX6Y4RwpjPgtFr6Dxb2Mm3Wt2GdbKRWZsHK4wfacZCZyUL5T9SvMPqddJtCxEJda'
        })}).pipe(map(x => {
          return x;
        })).subscribe(f => {
          resolve(f);
        }, err => reject(err));
      })
    }


    sendMessage(d,v){
      return new Promise((resolve, reject) => {
        let urla = `https://fcm.googleapis.com/fcm/send`;
          this.http.post(urla,{
            notification: {
              title: d.notification ? d.notification.title : d.title,
              body: d.notification ? d.notification.body : d.body
          },
          to: "/topics/"+v
          },{headers: new HttpHeaders({
            'Authorization': 'key=AAAAleqVHrg:APA91bEQu5xkdz_4n7msiY4KcL5cQuEoivl2c2TRS-MO2e21IWpRmab_CTj4ITVV0pbbHeU08gJ2sX6Y4RwpjPgtFr6Dxb2Mm3Wt2GdbKRWZsHK4wfacZCZyUL5T9SvMPqddJtCxEJda'})}).pipe(
            map(res => res)).subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err);
            })
      })
    }


    getData(){
      return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };
          this.http.get(urlApi+'analystpro/get-message-contract',httpOptions).pipe(
            map(res => res)).subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
    }
    
    receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
    (payload) => {
    console.log("new message received. ", payload);
    this.currentMessage.next(payload);
    })
    this.angularFireMessaging.messages
    }
}
