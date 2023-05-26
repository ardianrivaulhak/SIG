import { Injectable } from "@angular/core";
import { LocalStorage } from "@ngx-pwa/local-storage";
import { map, catchError, tap } from "rxjs/operators";
import { Observable, of, throwError } from "rxjs";
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from "@angular/common/http";
import { urlApi } from "app/main/url";

@Injectable({
    providedIn: "root",
})
export class CustomerService {
    constructor(public http: HttpClient, public storage: LocalStorage) {}

    getDataCustomers(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .post(
                        urlApi + `master/customers-get?page=${data.pages}`,
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    getDataCustomerDetail(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(urlApi + `master/customers/${data}`, httpOptions)
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    getCountries(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let search = data.search
                    ? `&search=${data.search.toLowerCase()}`
                    : "";
                this.http
                    .get(
                        urlApi + "master/countries?page=" + data.page + search,
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    getDataAllCustomer() {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(
                        urlApi + "master/customers/get-all-cust/all",
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    getInfoCustomers(id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(urlApi + "master/info-cust?id_cust=" + id, httpOptions)
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    getDataCustomersFull() {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(urlApi + 'master/customers?all="all"', httpOptions)
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    sendDataInfoCust(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .post(
                        urlApi + "master/info-customer-add",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }
    getDataCustomersDetail(id) {
        let a = id == "add" ? "" : id;
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(urlApi + "master/customers/" + a, httpOptions)
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    getDataAddressFor(datasend) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let searchfor = datasend.search
                    ? `analystpro/customeraddress?page=${
                          datasend.pages
                      }&search=${datasend.search.toUpperCase()}`
                    : `analystpro/customeraddress?page=${datasend.pages}`;
                this.http
                    .get(urlApi + searchfor, httpOptions)
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    updateDataCustomers(id, data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .put(
                        urlApi + "master/customers/" + id,
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    addDataCustomers(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };

                this.http
                    .post(
                        urlApi + "master/customers/add",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    deleteDataCustomers(id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .delete(urlApi + "master/customers/" + id, httpOptions)
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    // provinces() {
    //   return new Promise((resolve, reject) => {
    //     this.storage.getItem('token').subscribe(val => {
    //     let httpOptions = {
    //       headers: new HttpHeaders({
    //         'Content-Type':  'application/json',
    //         'Authorization': 'Bearer '+val
    //       })
    //     };
    //       this.http.post(urlApi+'master/provinces/', httpOptions).pipe(
    //         map(res => res)).subscribe(data => {
    //           resolve(data);
    //         }, (err) => {
    //           reject(err);
    //         })
    //     })
    //   })
    // }

    // provinces() {
    //   return new Promise((resolve, reject) => {
    //     this.storage.getItem('token').subscribe(val => {
    //     let httpOptions = {
    //       headers: new HttpHeaders({
    //         'Content-Type':  'application/json',
    //         'Authorization': 'Bearer '+val
    //       })
    //     };
    //     this.http.post(urlApi+'master/provinces/',httpOptions).pipe(
    //       map(res => res)).subscribe(data => {
    //         resolve(data);
    //       }, (err) => {
    //         reject(err);
    //       })
    //     })
    //   })
    // }
    provinces(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .post(
                        urlApi + "master/provinces",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            console.log(data);
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    regencies(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .post(
                        urlApi + "master/regencies",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    customerSelect(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .post(
                        urlApi + "master/customers/selected",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }
}
