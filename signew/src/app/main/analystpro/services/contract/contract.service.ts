import { Injectable } from "@angular/core";
import { LocalStorage } from "@ngx-pwa/local-storage";
import { map, catchError, tap } from "rxjs/operators";
import { Observable, of, throwError, Subject, observable } from "rxjs";
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from "@angular/common/http";
import { url, urlApi } from "app/main/url";
import { BehaviorSubject } from "rxjs";
import * as global from "app/main/global";

@Injectable({
    providedIn: "root",
})
export class ContractService {
    // sharedMessage = this.data.asObservable();
    public datadata = [];
    public datadatapeview = [];

    public getIdcontract = [];
    public getcontract = [];
    public getIdsample = [];
    public getsample = [];
    public getIdparameter = [];
    public getparameter = [];

    public data = new BehaviorSubject<any>([]);
    public datapeview = new BehaviorSubject<any>([]);

    public dataIdcontract = new BehaviorSubject<any>([]);
    public datacontract = new BehaviorSubject<any>([]);
    public dataIdsample = new BehaviorSubject<any>([]);
    public datasample = new BehaviorSubject<any>([]);
    public dataIdparameter = new BehaviorSubject<any>([]);
    public dataparameter = new BehaviorSubject<any>([]);

    private _client: any = "";

    // public subject = new Subject<any>();
    constructor(public http: HttpClient, public storage: LocalStorage) {
        // this.data = new BehaviorSubject(this.datadata);
    }

    newDataIdContract(data) {
        this.dataIdcontract = new BehaviorSubject(this.getIdcontract);
        this.dataIdcontract.next(data);
    }


    

    newDataContract(data) {
        this.datacontract = new BehaviorSubject(this.getcontract);
        this.datacontract.next(data);
    }

    checkcondition(d){
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(
                        urlApi + "analystpro/check-condition-contract?id_contract=" + d,
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

    getParameterByContract(v) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(
                        urlApi + "analystpro/view-parameter?id_contract=" + v,
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

    samplePhotoContract(id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(
                        urlApi + "analystpro/get-sample-photo/" + id,
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

    editPIC(data){
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
                            "analystpro/edit-pic-contract?contract_id=" +
                            data.contract_id + '&sales_id='+data.employee_id,
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

    deleteParamContract(data, contract_id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .patch(
                        urlApi +
                            "analystpro/delete-parameter-contract/" +
                            contract_id,
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

    approved_user() {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(urlApi + "accepteduser", httpOptions)
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

    approveContract(v) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(urlApi + "analystpro/acceptedcontractdisc?idcontract="+v, httpOptions)
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

    getsampleOnly(id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(
                        urlApi + "analystpro/only-sample?idsample=" + id,
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

    getHistoryContract(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                console.log(data);
                let category = data.category
                    ? "&category=" + data.category
                    : "";
                let search = data.search ? "&search=" + data.search : "";
                let user = data.user > 0 ? "&user=" + data.user : "";
                let tgl = data.tgl ? "&tgl=" + data.tgl : "";
                this.http
                    .get(
                        urlApi +
                            "analystpro/get-history-contract?page=" +
                            data.pages +
                            category +
                            search +
                            user +
                            tgl,
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

    getnopo(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = data.search ? `&search=${data.search}` : "";
                this.http
                    .get(
                        urlApi + "analystpro/get-no-po?page=" + data.pages + a,
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

    sendDescEditContract(v) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .post(
                        urlApi + "analystpro/send-desc-contract",
                        { data: v },
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
    getnopenawaran(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                let k = data.search
                ? `&search=${data.search}`
                : "";
                this.http
                    .get(
                        urlApi +
                            "analystpro/get-no-penawaran?page=" +
                            data.pages + k
                            ,
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
                        urlApi + "analystpro/send-attachment/" + id,
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

    sendImageAttachment(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .post(
                        urlApi + "analystpro/send-attachment-blob",
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
                            "analystpro/delete-attachment?id_contract_attachment=" +
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

    hargaaneh(){
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
                            "analystpro/hargaanehpaket",
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

    downloadFile(v) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        responseType: "blob" as "json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(
                        urlApi +
                            "analystpro/download-attachment/?id_attachment=" +
                            v,
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

    getDataTanggalSelesai(v) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        responseType: "blob" as "json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(
                        urlApi +
                            "analystpro/get-tanggal-selesai?id_contract=" +
                            v,
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

    newIdSample(data) {
        this.dataIdsample = new BehaviorSubject(this.getIdsample);
        this.dataIdsample.next(data);
    }

    newDataSample(data) {
        this.datasample = new BehaviorSubject(this.getsample);
        this.datasample.next(data);
    }

    newIdParameter(data) {
        this.dataIdparameter = new BehaviorSubject(this.getIdparameter);
        this.dataIdparameter.next(data);
    }

    newDataParameter(data) {
        this.dataparameter = new BehaviorSubject(this.getparameter);
        this.dataparameter.next(data);
    }

    newData(data) {
        this.data = new BehaviorSubject(this.datadata);
        this.data.next(data);
    }

    newDataPreview(data) {
        this.datapeview = new BehaviorSubject(this.datadatapeview);
        this.datapeview.next(data);
    }

    acceptContract(v) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = `${urlApi}analystpro/accepting-contract`;
                this.http
                    .post(a,{data: v}, httpOptions)
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

    allowContractRev(v) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = `${urlApi}analystpro/allow-contract-rev`;
                this.http
                    .get(a + "?contract_id=" + v, httpOptions)
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

    checkSampleLab(v) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = `${urlApi}analystpro/check-contract-lab`;
                this.http
                    .get(a + "?contract_id=" + v, httpOptions)
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

    getContractAttachment(v) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = `${urlApi}analystpro/check-attachment?id_contract=`;
                this.http
                    .get(a + v, httpOptions)
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

    sendEmailCust(v) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = `${urlApi}analystpro/send-email-contract`;
                this.http
                    .post(a, { data: v }, httpOptions)
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

    getData(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                console.log(data.search);
                let search = data.search ? "&search=" + data.search : "";
                let excel = data.excel ? "&excel=1" : "";
                let pagingfor = data.pagefor ? "&pagefor=" + data.pagefor : "";
                this.http
                    .get(
                        urlApi +
                            "analystpro/kontrakuji?page=" +
                            data.pages +
                            excel +
                            "&status=" +
                            data.status +
                            "&category=" +
                            data.category +
                            "&month=" +
                            data.month +
                            "&no_penawaran=" +
                            data.no_penawaran +
                            "&customers=" +
                            data.customers +
                            "&tgl_selesai=" +
                            data.tgl_selesai +
                            "&no_po=" +
                            data.no_po +
                            `${
                                data.statuskontrak
                                    ? "&statuskontrak=" + data.statuskontrak
                                    : ""
                            }` +
                            "&user_created=" +
                            data.user_created +
                            pagingfor +
                            search,
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

    getDataContractLight_1(data) {
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
                        urlApi +
                            "analystpro/kontrakuji/light?page=" +
                            data.pages,
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

    getDataContractLight_2(data) {
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
                        urlApi +
                            "analystpro/kontrakuji/light-finder?page=" +
                            data.pages,
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

    getDataPrice(id_parameteruji) {
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
                            "analystpro/get-price?parameteruji_id=" +
                            id_parameteruji,
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

    saveData(data) {
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
                        urlApi + "analystpro/kontrakuji/add",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                            console.log({ data: data });
                            console.log("Berhasil");
                        },
                        (err) => {
                            reject(err);
                            console.log("gagal");
                        }
                    );
            });
        });
    }

    editData(data, id, deletedata) {
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
                        urlApi + "analystpro/kontrakuji-edit-data/" + id,
                        { data: data, deletedata: deletedata },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            reject(err);
                            console.log(err);
                        }
                    );
            });
        });
    }

    getDataCreated({ pages, search }) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let urlforusercreate = search
                    ? `${urlApi}analystpro/user-contract?page=${pages}&search=${search}`
                    : `${urlApi}analystpro/user-contract?page=${pages}`;
                this.http
                    .get(urlforusercreate, httpOptions)
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

    updateData(id, data) {
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
                        urlApi + "analystpro/kontrakuji/" + id,
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
                            console.log("gagal");
                        }
                    );
            });
        });
    }

    getTransactionSampling(v) {
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
                            "analystpro/transaction-sampling?idtransampling=" +
                            v,
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

    getTransactionAkg(v) {
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
                            "analystpro/transaction-akg?idtransactionakg=" +
                            v,
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

    getDataCondition(id) {
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
                        urlApi + "analystpro/condition-contract/" + id,
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

    getDataConditionCert(id) {
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
                            "analystpro/condition-contract/" +
                            id +
                            "/cert",
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

    getDataConditionDetail(data) {
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
                        urlApi + "analystpro/condition-contract-det",
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

    revisiSave(id, data) {
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
                        urlApi + "analystpro/revision-add/" + id,
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                            console.log({ data: data });
                            console.log("Berhasil");
                        },
                        (err) => {
                            reject(err);
                            console.log("gagal");
                        }
                    );
            });
        });
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    getDataDetailParameter(id) {
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
                        urlApi + "analystpro/sample-param?idsample=" + id,
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

    pdfContract(id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(urlApi + "view-kontrak/" + id, httpOptions)
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

    getDataMou(id) {
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
                        urlApi + "analystpro/get-cust-mou?idcust=" + id,
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

    getDataDetailKontrak(id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(url + "view-kontrak/" + id, httpOptions)
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

    getDataDetailKontrakEdit(id) {
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
                        urlApi + "analystpro/view-edit-kontrak/" + id,
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

    getDataAttachmentContract(id) {
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
                        urlApi + "analystpro/view-attachment/" + id,
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

    getDataAttachment(id) {
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
                        urlApi + "analystpro/get-attachment/" + id,
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

    getExcelParameter(id) {
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
                        urlApi + "analystpro/excel-parameter/" + id,
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

    deleteParameter(data) {
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
                        urlApi + "analystpro/delete-parameter",
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

    getInvoice(id) {
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
                            "analystpro/check-contract-invoice?idcontract=" +
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

    getChat(id) {
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
                            "analystpro/information-contract-desc?idcontract=" +
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

    sendChat(data) {
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
                        urlApi + "analystpro/send-contract-desc",
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

    getDataExcelSales(from, to) {
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
                            "analystpro/get-excel-sales?from=" +
                            from +
                            "&to=" +
                            to,
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

    getDataContractLight(data) {
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
                        `${urlApi}analystpro/light-contract?page=${data.page}${
                            data.search ? "&search=" + data.search : ""
                        }`,
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

    sendchat(id, chat) {
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
                            "analystpro/send-contract-desc?idcontract=" +
                            id +
                            "&sending=" +
                            chat,
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

    getSampleData(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(urlApi + "analystpro/get-sample/" + data, httpOptions)
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

    getParameterPerSample(id) {
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
                        urlApi + "analystpro/parameter-sample?idsample=" + id,
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

    getSampleDataLight(data) {
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
                        urlApi + "analystpro/get-sample-light/" + data,
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

    getRealDataContract(id) {
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
                        urlApi + "analystpro/kontrakuji-update/" + id,
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

    getDataContractDetail(id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(urlApi + "analystpro/kontrakuji/" + id, httpOptions)
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

    samplegetfromcontract(idcontract) {
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
                        urlApi + "analystpro/sample-get/" + idcontract,
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

    getDataAddressCustomer(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let url = data.search
                    ? urlApi +
                      "analystpro/getCustomersAddress?page=" +
                      data.pages +
                      "&customer_id=" +
                      data.id_customer +
                      "&search=" +
                      data.search
                    : urlApi +
                      "analystpro/getCustomersAddress?page=" +
                      data.pages +
                      "&customer_id=" +
                      data.id_customer;
                this.http
                    .get(url, httpOptions)
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

    getDataTaxAddress(id) {
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
                            "analystpro/getCustomersTaxAddress?customer_id=" +
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

    getDataContactPerson(id) {
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
                        urlApi + "analystpro/getDataContactPerson?id_cp=" + id,
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

    saveDataKontrak(data) {
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
                        urlApi + "analystpro/kontrakuji/add",
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

    getDataCatalogue() {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(urlApi + "master/catalogue", httpOptions)
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

    getDataSubCatalogue(data?) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = data.search
                    ? `${urlApi}master/subcatalogue?page=${data.page}&id_catalogue=${data.id_catalogue}&search=${data.search}`
                    : `${urlApi}master/subcatalogue?page=${data.page}&id_catalogue=${data.id_catalogue}`;
                this.http
                    .get(a, httpOptions)
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

    getDataPaketParameter(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(`${urlApi}master/paketparameter/${data}`, httpOptions)
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

    getDataPaketPKMChoose(id) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                this.http
                    .get(urlApi + "master/specific-package/" + id, httpOptions)
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

    getDataPaketPKM(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = data.search
                    ? `${urlApi}master/specific-package?page=${data.page}&search=${data.search}&active=${data.active}`
                    : `${urlApi}master/specific-package?page=${data.page}&active=${data.active}`;
                this.http
                    .get(a, httpOptions)
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

    getDataPaketPKMContract(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = data.search
                    ? `${urlApi}master/specific-package-contract?page=${data.page}&search=${data.search}`
                    : `${urlApi}master/specific-package-contract?page=${data.page}`;
                this.http
                    .get(a, httpOptions)
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

    getDataPaketUji(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = data.search
                    ? `${urlApi}master/paketparameter?page=${data.page}&search=${data.search}&active=1`
                    : `${urlApi}master/paketparameter?page=${data.page}`;
                this.http
                    .get(a, httpOptions)
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

    getDataPaketUjiContract(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = data.search
                    ? `${urlApi}master/paketparameter-contract?page=${data.page}&search=${data.search}`
                    : `${urlApi}master/paketparameter-contract?page=${data.page}`;
                this.http
                    .get(a, httpOptions)
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

    getDataParameter(data) {
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
                        urlApi + `master/parameteruji?page=${data.page}`,
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

    getDataParameterContract(data) {
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
                        urlApi +
                            `master/parameteruji-contract?page=${data.page}`,
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

    getOriginalValue(m) {
        return new Promise((resolve, reject) => {
            let nonpaketprice = [];
            let paketparameterprice = [];
            let paketpkmprice = [];

            if (m.nonpaket.length > 0) {
                nonpaketprice = nonpaketprice.concat(
                    m.nonpaket.map((x) => x.price)
                );
            }
            if (m.paketparameter.length > 0) {
                let azd: any = global.uniq(
                    m.paketparameter,
                    (it) => it.info_id
                );
                paketparameterprice = paketparameterprice.concat(
                    azd.map((x: any) => x.price)
                );
            }
            if (m.paketpkm.length > 0) {
                let az: any = global.uniq(m.paketpkm, (it) => it.info_id);
                paketpkmprice = paketpkmprice.concat(
                    az.map((x: any) => x.price)
                );
            }

            let kumpulinonpaket =
                nonpaketprice.length > 0
                    ? nonpaketprice.reduce((a, b) => a + b)
                    : 0;
            let kumpulinpaketparameterprice =
                paketparameterprice.length > 0
                    ? paketparameterprice.reduce((a, b) => a + b)
                    : 0;
            let kumpulinpaketpkmprice =
                paketpkmprice.length > 0
                    ? paketpkmprice.reduce((a, b) => a + b)
                    : 0;
            let bolehdiscpaketparameter =
                paketparameterprice.length > 0
                    ? global
                          .uniq(m.paketparameter, (it) => it.info_id)
                          .filter((h: any) => h.discount == 1)
                          .map((u: any) => u.price).length > 0
                        ? global
                              .uniq(m.paketparameter, (it) => it.info_id)
                              .filter((h: any) => h.discount == 1)
                              .map((u: any) => u.price)
                              .reduce((i, o) => i + o)
                        : 0
                    : 0;
            let bolehdiscpaketpkm =
                paketpkmprice.length > 0
                    ? global
                          .uniq(m.paketpkm, (it) => it.info_id)
                          .filter((h: any) => h.discount == 1)
                          .map((u: any) => u.price).length > 0
                        ? global
                              .uniq(m.paketpkm, (it) => it.info_id)
                              .filter((h: any) => h.discount == 1)
                              .map((u: any) => u.price)
                              .reduce((i, o) => i + o)
                        : 0
                    : 0;
            let data = {
                kumpulinonpaket: kumpulinonpaket,
                kumpulinpaketparameterprice: kumpulinpaketparameterprice,
                kumpulinpaketpkmprice: kumpulinpaketpkmprice,
                bolehdiscpaketparameter: bolehdiscpaketparameter,
                bolehdiscpaketpkm: bolehdiscpaketpkm,
            };
            resolve(data);
        });
    }

    testing_data(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = `${urlApi}analystpro/testing`;
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

    saveDataContract(data) {
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
                        urlApi + "analystpro/contract-save",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                            console.log({ data: data });
                            console.log("Berhasil");
                        },
                        (err) => {
                            reject(err);
                            console.log("gagal");
                        }
                    );
            });
        });
    }

    updateDataContract(id, data) {
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
                        urlApi + "analystpro/contract-update/" + id,
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

    saveDataSample(data) {
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
                        urlApi + "analystpro/sample-save",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                            console.log({ data: data });
                            console.log("Berhasil");
                        },
                        (err) => {
                            reject(err);
                            console.log("gagal");
                        }
                    );
            });
        });
    }

    updateDataSample(data) {
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
                        urlApi + "analystpro/sample-update",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                            console.log({ data: data });
                            console.log("Berhasil");
                        },
                        (err) => {
                            reject(err);
                            console.log("gagal");
                        }
                    );
            });
        });
    }

    saveDataParameter(data) {
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
                        urlApi + "analystpro/parameter-save",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                            console.log({ data: data });
                            console.log("Berhasil");
                        },
                        (err) => {
                            reject(err);
                            console.log("gagal");
                        }
                    );
            });
        });
    }

    savePhoto(data) {
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
                        urlApi + "analystpro/photo-save",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                            // console.log("Berhasil");
                        },
                        (err) => {
                            reject(err);
                        }
                    );
            });
        });
    }

    detailPhoto(id) {
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
                        urlApi + "analystpro/photo-detail?id_sample=" + id,
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

    deleteContract(v) {
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
                        urlApi +
                            "analystpro/kontrakuji/" +
                            v.id_kontrakuji +
                            "?desc=" +
                            v.desc,
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

    deletePhoto(id, name?) {
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
                            "analystpro/photo-delete?idphoto=" +
                            id +
                            "&photo=" +
                            name,
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

    saveDataPrice(data) {
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
                        urlApi + "analystpro/pricing-save",
                        { data: data },
                        httpOptions
                    )
                    .pipe(map((res) => res))
                    .subscribe(
                        (data) => {
                            resolve(data);
                            // console.log("Berhasil");
                        },
                        (err) => {
                            reject(err);
                            console.log("gagal");
                        }
                    );
            });
        });
    }
}
