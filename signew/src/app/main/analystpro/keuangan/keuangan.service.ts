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
export class KeuanganService {
  public datadata = []; 
  public datadatapeview = []; 
  public data = new BehaviorSubject<any>([]);  
  
  public datapeview = new BehaviorSubject<any>([]); 

  private _client: any = "";
  

  constructor(
    public http: HttpClient,
    public storage: LocalStorage,
  ) { }

  getData(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.post(urlApi+'analystpro/view-kontrak-finance?page='+data.pages,{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }
  

  getDataDetail(data){
    let dataId = {
      idcontract : data
    }
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/view-kontrak-finance-detail', {data: dataId}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  checkContract(data){
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/view-kontrak-finance-detail/check-contract', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  checkSplit(data){
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.post(urlApi+'analystpro/view-kontrak-finance-detail/checksplit', { data : data }, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataDetailInvoice(id){ 
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'analystpro/view-detail-edit-invoice?idinvoice=' + id, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }



  getDataExportExcel(id){ 
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(urlApi+'analystpro/excel-export?tgljatuhtempo=' + id, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  getDataKontrak(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      let u = data.search ? `&search=${data.search}` : '';
        this.http.get(`${urlApi}analystpro/contract-list?page=${data.pages}${u}`, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  setDownPayment(d){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
        this.http.get(`${urlApi}analystpro/downpayment-contract?id_contract=${d.id_contract}&downpayment=${d.downpayment}`, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  getDataAddressCustomer(data){
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      // let url = data.search ? urlApi+'analystpro/getCustomersAddress?page='+data.pages+'&customer_id='+data.id_customer+'&search='+data.search: urlApi+'analystpro/getCustomersAddress?page='+data.pages;
      let url = data.search ? urlApi+'analystpro/getCustomersAddress?page='+data.pages+'&customer_id='+data.id_customer+'&search='+data.search: urlApi+'analystpro/getCustomersAddress?page='+data.pages+'&customer_id='+data.id_customer;
        this.http.get(url, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  saveData(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      console.log(data);
      
        this.http.post(urlApi+'analystpro/add-invoice',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  saveDataWithDiscount(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      console.log(data);
      
        this.http.post(urlApi+'analystpro/add-invoice/with-discount',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  updateData(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      console.log(data);
      
        this.http.post(urlApi+'analystpro/edit-invoice',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  updateDataWithDiscount(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      console.log(data);
      
        this.http.post(urlApi+'analystpro/edit-invoice/withdisc',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  getDataContractCategory(data) {
    
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      let searchfor = data.search ? `master/contract-category?page=${data.pages}&search=${data.search.toUpperCase()}` : `master/contract-category?page=${data.pages}`;
        this.http.get(urlApi+searchfor,httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  selectFilterData(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      console.log(data);
      
        this.http.post(urlApi+'analystpro/selecting-index-invoice',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  getDataContactPersons(data) {    
    return new Promise((resolve, reject) => {
    this.storage.getItem('token').subscribe(val => {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+val
      })
    };
    let searchfor = data.search ? `master/contactpersons?page=${data.pages}&search=${data.search.toUpperCase()}` : `master/contactpersons?page=${data.pages}`;
      this.http.get(urlApi+searchfor,httpOptions).pipe(
        map(res => res)).subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        })
      })
    })
  } 


  getDataTaxAddress(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };

        let urln = 'analystpro/customertaxaddress';
        let a = data.search 
        ? `${urlApi}${urln}?page=${data.pages}&search=${data.search.toUpperCase()}` 
        : `${urlApi}${urln}?page=${data.pages}` ;
        this.http.get(a, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }  

  getDataApprove(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.post(urlApi+'analystpro/invoice-approve?page='+data.pages,{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  approveInvoice(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.post(urlApi+'analystpro/invoice-approve/approve-data',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  cancelInvoice(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.post(urlApi+'analystpro/invoice-approve/cancel-data',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  HoldContract(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.post(urlApi+'analystpro/invoice-approve/hold-contract',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  HoldContractByInvoice(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.post(urlApi+'analystpro/invoice-approve/hold-contract/by-invoice',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  HoldContractByContract(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.post(urlApi+'analystpro/invoice-approve/hold-contract/by-contract',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }


  numberWithCommas(x) {
    let commasInserted = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (commasInserted)
    // return ("$"+commasInserted)
}

// get detail new
    invoiceDetails(data) {
        console.log(data)
        return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
            headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
            })
        };
        
            this.http.get(urlApi+'analystpro/invoice/detail/' + data, httpOptions).pipe(
            map(res => res)).subscribe(data => {
                resolve(data);
            }, (err) => {
                reject(err);
            })
        })
        })
    }

    getDataInvoiceDetail(data) {
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };
          
            this.http.get(urlApi+'analystpro/invoice/data/'+ data, httpOptions).pipe(
              map(res => res)).subscribe(data => {
                resolve(data);
              }, (err) => {
                reject(err);
              })
          })
        })
      }

      getContract(data){
        let dataId = {
          idcontract : data
        }
        console.log(dataId);
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };
            this.http.post(urlApi+'analystpro/view-kontrak-finance-detail/detail-finance', {data: dataId}, httpOptions).pipe(
              map(res => res)).subscribe(data => {
                console.log(data);
                resolve(data);
              }, (err) => {
                reject(err);
              })
          })
        })
      }

      getDataSampleInvoice(data) {
          console.log(data)
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };
          
            this.http.get(urlApi+'analystpro/invoice/sample-detail/'+ data, httpOptions).pipe(
              map(res => res)).subscribe(data => {
                resolve(data);
              }, (err) => {
                reject(err);
              })
          })
        })
      }

      getSelectedCustomer(data) {
      console.log(data)
      return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };
        
          this.http.post(urlApi+'analystpro/invoice/selected-customer', {data}, httpOptions).pipe(
            map(res => res)).subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
    }

    getSelectedContact(data) {
        console.log(data)
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };
          
            this.http.post(urlApi+'analystpro/invoice/selected-contact', {data}, httpOptions).pipe(
              map(res => res)).subscribe(data => {
                resolve(data);
              }, (err) => {
                reject(err);
              })
          })
        })
      }

      getSelectedDataAddressCustomer(data){
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };
          this.http.post(urlApi+'analystpro/invoice/selected-address', {data}, httpOptions).pipe(
            map(res => res)).subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
      }

      editInvoice(data){
        console.log(data)
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };
          this.http.post(urlApi+'analystpro/invoice/' + data.id, {data}, httpOptions).pipe(
            map(res => res)).subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
      }

      getDataUser(){   
        return new Promise((resolve, reject) => {
            this.storage.getItem('token').subscribe(val => {
            let httpOptions = {
              headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': 'Bearer '+val
              })
            };
              this.http.get(urlApi+'analystpro/finance/user-finance',httpOptions).pipe(
                map(res => res)).subscribe(data => {
                  resolve(data);
                }, (err) => {
                  reject(err);
                })
            })
          })
      }

      savePayment(data) {
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };
          console.log(data);
          
            this.http.post(urlApi+'analystpro/payment-add',{data: data}, httpOptions).pipe(
              map(res => res)).subscribe(data => {
                console.log(data);
                resolve(data);
              }, (err) => {
                reject(err);
              })
          })
        })
      }

      getPayment(idcontract) {
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };          
            this.http.get(urlApi+'analystpro/payment/' + idcontract , httpOptions).pipe(
              map(res => res)).subscribe(data => {
                console.log(data);
                resolve(data);
              }, (err) => {
                reject(err);
              })
          })
        })
      }

      getBankAccount() {
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };          
            this.http.get(urlApi+'analystpro/bank-account', httpOptions).pipe(
              map(res => res)).subscribe(data => {
                console.log(data);
                resolve(data);
              }, (err) => {
                reject(err);
              })
          })
        })
      }

      getAccountBank() {
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };          
            this.http.get(urlApi+'analystpro/account-bank', httpOptions).pipe(
              map(res => res)).subscribe(data => {
                console.log(data);
                resolve(data);
              }, (err) => {
                reject(err);
              })
          })
        })
      }

      editHold(data) {
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };
          console.log(data);
          
            this.http.post(urlApi+'analystpro/hold-contract',{data: data}, httpOptions).pipe(
              map(res => res)).subscribe(data => {
                console.log(data);
                resolve(data);
              }, (err) => {
                reject(err);
              })
          })
        })
      }


      getDataContractFinance(data) {
        return new Promise((resolve, reject) => {
          this.storage.getItem('token').subscribe(val => {
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer '+val
            })
          };
          
            this.http.post(urlApi+'analystpro/finance/get-sample?page='+data.pages,{data}, httpOptions).pipe(
              map(res => res)).subscribe(data => {
                resolve(data);
              }, (err) => {
                reject(err);
              })
          })
        })
      }

    printedInvoice(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };      
        this.http.post(urlApi+'analystpro/invoice/printed/popow',{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  checkCustomer(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      console.log(data);
      
        this.http.post(urlApi+'analystpro/invoice/check-customer/customers',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  checkCP(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      console.log(data);
      
        this.http.post(urlApi+'analystpro/invoice/check-cp/cp',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  checkAddress(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      console.log(data);
      
        this.http.post(urlApi+'analystpro/invoice/check-address/address',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  deleteInvoice(id)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };
        console.log(id);
        
          this.http.post(urlApi+'analystpro/invoice/delete/invoice',{id: id}, httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  updateNewData(data)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };
        console.log(data);        
          this.http.post(urlApi+'analystpro/invoice/update/invoice',{data: data}, httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  memoFInance(data)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };
        console.log(data);        
          this.http.post(urlApi+'analystpro/invoice/get/desc',{data: data}, httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  postMemoFInance(data, value)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };
        console.log(data);        
          this.http.post(urlApi+'analystpro/invoice/post/description',{data: {data, value}}, httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  ContractStatus(data)
  {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.post(urlApi+'analystpro/finance/finder-contract?page='+data.pages,{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  deleteHistoryPayment(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      console.log(data);
      
        this.http.post(urlApi+'analystpro/payment/delete-payment',{data: data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  calculationAgain(data)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };
        console.log(data);        
          this.http.post(urlApi+'analystpro/invoice/update/calculation',{data: data}, httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  deleteInvoiceWithComment(data)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };        
          this.http.post(urlApi+'analystpro/invoice/delete/invoice/with-comment', { data : data } , httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  getInvoiceByContract(data)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };        
          this.http.post(urlApi+'analystpro/invoice/data/get-invoice/contract', { data : data } , httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  postActived(data)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };        
          this.http.post(urlApi+'analystpro/invoice/actived-invoice/updatedata', { data : data } , httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  getDataPerforma(data)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };        
          this.http.post(urlApi+'analystpro/finance/performa/invoice/get-data', { data : data } , httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  approveRev(data)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };        
          this.http.post(urlApi+'analystpro/finance/approve/revision/data', { data : data } , httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  userTopGlobals(data)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };        
          this.http.post(urlApi+'analystpro/invoice/get-user/top-globals', { data : data } , httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  getPriceInvoiceDay(data)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };        
          this.http.post(urlApi+'analystpro/invoice/get-price/total-invoice-day', { data : data } , httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  getTotalInvoiceDay(data)
  {
    return new Promise((resolve, reject) => {
        this.storage.getItem('token').subscribe(val => {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+val
          })
        };        
          this.http.post(urlApi+'analystpro/invoice/get-data/summary-invoice-day', { data : data } , httpOptions).pipe(
            map(res => res)).subscribe(data => {
              console.log(data);
              resolve(data);
            }, (err) => {
              reject(err);
            })
        })
      })
  }

  getDataSpecial(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.post(urlApi+'analystpro/view-invoice-special?page='+data.pages,{data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }

  approveDataSpecial(data) {
    return new Promise((resolve, reject) => {
      this.storage.getItem('token').subscribe(val => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+val
        })
      };
      
        this.http.post(urlApi+'analystpro/view-invoice-special/approve-invoice', {data}, httpOptions).pipe(
          map(res => res)).subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err);
          })
      })
    })
  }
    
    

}
