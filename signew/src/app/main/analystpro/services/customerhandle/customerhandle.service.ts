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
export class CustomerhandleService {
    constructor(public http: HttpClient, public storage: LocalStorage) {}

    getData(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a =
                    urlApi + "analystpro/get-customerhandle?page=" + data.pages;
                this.http
                    .post(a, { data: data }, httpOptions)
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

    sendNpwp(data) {
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
                        urlApi + "master/send-npwp-cust",
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

    deleteNpwp(id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .delete(
                        urlApi + "master/npwp-cust-delete" + "/" + id,
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

    deleteHandle(id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .delete(
                        urlApi + "analystpro/customerhandle" + "/" + id,
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

    addData(data) {
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
                        urlApi + "analystpro/customerhandle",
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

    getDataDetail(id) {
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
                        urlApi + "analystpro/customerhandle/" + id,
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

    updateDataCustomerHandle(id, data) {
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
                        urlApi + "analystpro/customerhandle/" + id,
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
