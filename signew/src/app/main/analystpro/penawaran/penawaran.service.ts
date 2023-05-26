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
import { CustomerhandleService } from "app/main/analystpro/services/customerhandle/customerhandle.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
@Injectable({
    providedIn: "root",
})
export class PenawaranService {
    constructor(
        public http: HttpClient,
        public storage: LocalStorage,
        public custServ: CustomerhandleService,
        public pdfServ: PdfService,
        public mouServ: ContractService
    ) {}

    async previewPenawaran(v, d) {
        v.format = await d;
        await this.custServ.getDataDetail(v.customerhandle).then((x) => {
            v.custhandle = x[0];
            this.mouServ.getDataMou(x[0].id_customer).then((o: any) => {
                if (o.status) {
                    if(o.message !== 'Data Mou Expired / Not active'){
                      v.custhandle.mou = o.data[0];
                    }
                }
            });
        });

        await console.log(v);
        await this.pdfServ
            .generatePdfPenawaranPreview(v)
            .then((x) => console.log(x));
    }

    getDataPenawaran(data) {
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
                        urlApi + `analystpro/penawaran?page=${data.pages}`,
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

    getDataAttachment(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = data.search
                    ? `&search=${data.search.toLowerCase()}`
                    : "";
                this.http
                    .get(
                        urlApi +
                            `analystpro/penawaran-attachment?id_tp=${data}`,
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
                        urlApi + "analystpro/send-attachment-penawaran/" + id,
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

    getDataPenawaranContract(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = data.search
                    ? `&search=${data.search.toLowerCase()}`
                    : "";
                let b = data.idsales ? `&sales=${data.idsales}` : "";
                this.http
                    .get(
                        urlApi +
                            `analystpro/penawaran-contract?page=${data.pages}${a}${b}`,
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

    getDataPenawaranCustomer(data) {
        return new Promise((resolve, reject) => {
            this.storage.getItem("token").subscribe((val) => {
                let httpOptions = {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + val,
                    }),
                };
                let a = data.search
                    ? `&search=${data.search.toLowerCase()}`
                    : "";
                let b = data.idcust ? `&id_customer=${data.idcust}` : "";
                this.http
                    .get(
                        urlApi +
                            `analystpro/penawaran-customer?page=${data.pages}${a}${b}`,
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

    PenawaranAdd(data) {
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
                        urlApi + `analystpro/penawaran-add`,
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

    penawaranApprove(data, bval) {
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
                            `analystpro/penawaran-approve?id=${data}&status=${bval}`,
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

    getDataPenawaranShow(id) {
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
                        urlApi + `analystpro/penawaran-detail/${id}`,
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

    getExcelPenawaranbySales(data) {
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
                            `analystpro/penawaran-excel-export?month=${data}`,
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

    setPenawaran2(id) {
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
                        urlApi + `analystpro/penawaran-set-contract/${id}`,
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
    setPenawaran(id) {
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
                        urlApi + `analystpro/penawaran-set-contract/${id}`,
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
