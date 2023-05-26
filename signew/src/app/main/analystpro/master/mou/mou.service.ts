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
export class MouService {
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

                this.http
                    .post(urlApi + `analystpro/customer-mou?page=${
                      data.pages
                  }`, {data}, httpOptions)
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

    sendFileAttachment(formdata, id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .post(
                        urlApi + "analystpro/send-attachment-mou/" + id,
                        formdata,
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

    deleteAttachment(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(
                        urlApi +
                            "analystpro/delete-attachment-mou?attachment_id=" +
                            data,
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

    getDataAttachment(v) {
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
                        urlApi +
                            "analystpro/mou-attachment?id_cust_mou_header=" +
                            v,
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                            console.log("berhasil connect");
                        },
                        (err) => {
                            reject(err);
                            console.log("Gagal connect");
                        }
                    );
            });
        });
    }

    getEmploye(data) {
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
                        urlApi + "hris/employee?page=" + data.pages,
                        { data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                            console.log("berhasil connect");
                        },
                        (err) => {
                            reject(err);
                            console.log("Gagal connect");
                        }
                    );
            });
        });
    }

    addDataMou(data) {
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
                        urlApi + "analystpro/customer-mou-add",
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

    deleteMou(id) {
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
                        urlApi + "analystpro/customer-mou/" + id,
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

    updateMou(id, data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .patch(
                        urlApi + "analystpro/customer-mou/" + id,
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
                        urlApi +
                            "analystpro/customer-mou-detail?id_customer=" +
                            id,
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

    approvedMou(id, st) {
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
                        urlApi +
                            "analystpro/approve-mou?id_cust_mou_header=" +
                            id +
                            "&app=" +
                            st,
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

    updateDataMou(id, data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .patch(
                        urlApi + "analystpro/customer-mou/" + id,
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
