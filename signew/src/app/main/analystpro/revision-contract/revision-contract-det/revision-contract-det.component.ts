import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ContractService } from "../../services/contract/contract.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerhandleService } from "../../services/customerhandle/customerhandle.service";
import { CustomershandleModalComponent } from "../../modal/customershandle-modal/customershandle-modal.component";
import { ContractcategoryService } from "../../services/contractcategory/contractcategory.service";
import { MatDialog } from "@angular/material/dialog";
import { ModalParameterRevisionComponent } from "../modal-parameter-revision/modal-parameter-revision.component";
import { AkgModalComponent } from "../../modal/akg-modal/akg-modal.component";
import { AddressCustomerComponent } from "../../modal/address-customer/address-customer.component";
import * as global from "app/main/global";
import { ModalPhotoParameterComponent } from "../../contract/modal-photo-parameter/modal-photo-parameter.component";
import * as myurl from "app/main/url";
import { NgxSpinnerService } from "ngx-spinner";
import { MessagingService } from "app/messaging.service";
import { ModalVocComponent } from "../../contract/modal-voc/modal-voc.component";
import * as datacontract from "../data";
import { ContractDetComponent } from "app/main/analystpro/contract/contract-det/contract-det.component";
import { SpinnerModalsComponent } from "app/main/global/spinner-modals/spinner-modals.component";
import { SamplingModalComponent } from "../../modal/sampling-modal/sampling-modal.component";
import { PenawaranService } from "app/main/analystpro/penawaran/penawaran.service";
import {
    MatBottomSheet,
    MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { LocalStorage } from "@ngx-pwa/local-storage";

@Component({
    selector: "app-revision-contract-det",
    templateUrl: "./revision-contract-det.component.html",
    styleUrls: ["./revision-contract-det.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class RevisionContractDetComponent implements OnInit {
    typeContract = datacontract.typeContract;
    contractSet = datacontract.contractSet;
    formContract = datacontract.formContract;

    contract_category = [];
    customerhandle = [];
    alamatcustomer = [];

    datasendCustomerHandle = {
        pages: 1,
        search: null,
    };

    datasendContractCategory = {
        pages: 1,
        search: null,
    };

    statuspengujianmultiple;

    mouStatusPengujian = [];
    mouDiskon = [];
    mouspecial = false;
    statuspengujiandata = datacontract.statuspengujian;
    hargakenadiskon;
    parametercontract = [];
    numbersample = 0;
    setAddParameter = true;
    dataemployee = [];

    datasend = {
        pages: 1,
        search: null,
        level: null,
        division: 6,
        employeestatus: null,
    };
    datapenawaran = [];
    datasentpenawaran = {
        pages: 1,
        search: null,
        idcust: null,
    };
    copydata = [];

    constructor(
        private _kontrakServ: ContractService,
        private _custHandleServ: CustomerhandleService,
        private _contractCatServ: ContractcategoryService,
        private _route: Router,
        private _actRoute: ActivatedRoute,
        private dialog: MatDialog,
        private spinner: NgxSpinnerService,
        private _messaginServ: MessagingService,
        private _matbottomsheet: MatBottomSheet,
        private _spinnerServ: NgxSpinnerService,
        private _employeeServ: EmployeeService,
        private _penawaranServ: PenawaranService,
        private _localStorage: LocalStorage
    ) {
        this.formContract.contract_id = this._actRoute.snapshot.params["id"];
    }

    ngOnInit(): void {
        this.getDatacustomerhandle();
        this.getDataContractCategory();
        this.getDataDetail();
        this.getDataEmployee();
        this._spinnerServ.show();
    }

    async getDatacustomerhandle() {
        await this._custHandleServ
            .getData(this.datasendCustomerHandle)
            .then(
                (x) =>
                    (this.customerhandle = this.customerhandle.concat(
                        x["data"]
                    ))
            )
            .then(
                () =>
                    (this.customerhandle = global.uniq(
                        this.customerhandle,
                        (it) => it.idch
                    ))
            );
    }

    getDataEmployee() {
        this._employeeServ
            .getData(this.datasend)
            .then((e: any) => {
                this.dataemployee = this.dataemployee.concat(e.data);
            })
            .then(() => {
                this.dataemployee = global.uniq(
                    this.dataemployee,
                    (it) => it.user_id
                );
            });
    }

    async ambilhargakenadiskon(v) {
        let nonpaketkenadisc = await [];
        let paketparameterkenadisc = await [];
        let paketpkmkenadisc = await [];

        await v.forEach((e) => {
            let stval = this.statuspengujiandata.filter(
                (z) => z.id === e.id_statuspengujian
            )[0].value;

            nonpaketkenadisc = nonpaketkenadisc.concat(
                e.getonlyprice
                    .filter((r) => r.status == 2)
                    .map((m) => m.price * stval)
            );

            paketparameterkenadisc = paketparameterkenadisc.concat(
                global
                    .uniq(
                        e.getonlyprice.filter(
                            (r) => r.status == 1 && r.disc > 0
                        ),
                        (i) => i.idfor
                    )
                    .map((m: any) => m.price * stval)
            );

            paketpkmkenadisc = paketpkmkenadisc.concat(
                global
                    .uniq(
                        e.getonlyprice.filter(
                            (r) => r.status == 4 && r.disc > 0
                        ),
                        (i) => i.info_id
                    )
                    .map((m: any) => m.price * stval)
            );
        });

        let totalnonpaket =
            (await nonpaketkenadisc.length) > 0
                ? nonpaketkenadisc.reduce((a, b) => a + b)
                : 0;
        let totalnpaketparameterkenadisconpaket =
            (await paketparameterkenadisc.length) > 0
                ? paketparameterkenadisc.reduce((a, b) => a + b)
                : 0;
        let totalpaketpkmkenadisc =
            (await paketpkmkenadisc.length) > 0
                ? paketpkmkenadisc.reduce((a, b) => a + b)
                : 0;

        this.hargakenadiskon =
            (await totalnonpaket) +
            totalnpaketparameterkenadisconpaket +
            totalpaketpkmkenadisc;

        this.formContract.totalhargakontrak = await this.formContract.sample
            .map((z) => z.price)
            .reduce((a, b) => a + b);

        this.formContract.discount_price = await this.formContract.sample
            .map((z) => z.disc)
            .reduce((a, b) => a + b);

        await this.recalculateprice();
    }

    async getDataDetail() {
        this.parametercontract = await [];
        await this._kontrakServ
            .getSampleDataLight(this.formContract.contract_id)
            .then(async (x: any) => {
                this.statuspengujianmultiple = await x.id_statuspengujian;
                this.parametercontract = await this.parametercontract.concat(x);

                await this.formContractGet(x[0]);

                this.formContract.dataakg =
                    await this.formContract.dataakg.concat(
                        x[0].kontrakujifull.akg_trans
                    );
                this.formContract.datasampling =
                    await this.formContract.datasampling.concat(
                        x[0].kontrakujifull.sampling_trans
                    );

                this.numbersample = await x.length;
                this.formContract.sample =
                    await this.formContract.sample.concat(
                        x.map((y) => ({
                            id: y.id,
                            no_sample: y.no_sample,
                            nama_sample: y.sample_name,
                            status: "edit",
                            price: y.price,
                            price_original:
                                y.price /
                                this.statuspengujiandata.filter(
                                    (f) => f.id === y.id_statuspengujian
                                )[0].value,
                            statuspengujian: y.id_statuspengujian,
                            disc: y.discount,
                            mentahanparam: {
                                nonpaket: y.getonlyprice.filter(
                                    (e) => e.status == 2
                                ),
                                paketparameter: global.uniq(
                                    y.getonlyprice.filter((x) => x.status == 1),
                                    (it) => it.idfor
                                ),
                                paketpkm: global.uniq(
                                    y.getonlyprice.filter((x) => x.status == 4),
                                    (it) => it.info_id
                                ),
                            },
                        }))
                    );
                this.formContract.biayaakg =
                    (await x[0].kontrakujifull.akg_trans.length) > 0
                        ? x[0].kontrakujifull.akg_trans
                              .map((p) => p.total)
                              .reduce((y, u) => y + u)
                        : 0;
                this.formContract.biayasample =
                    (await x[0].kontrakujifull.sampling_trans.length) > 0
                        ? x[0].kontrakujifull.sampling_trans
                              .map((p) => p.total)
                              .reduce((y, u) => y + u)
                        : 0;

                await this.ambilhargakenadiskon(x);

                this.formContract.discount_conv = (
                    (await (this.formContract.discount_price /
                        (this.hargakenadiskon +
                            this.formContract.biayasample))) * 100
                ).toFixed();
            });
        await this._spinnerServ.hide();
    }

    onScrollToEnd(c) {
        switch (c) {
            case "customer":
                this.datasendCustomerHandle.pages =
                    this.datasendCustomerHandle.pages + 1;
                this.getDatacustomerhandle();
                break;
            case "employee":
                this.datasend.pages = this.datasend.pages + 1;
                this.getDataEmployee();
                break;
        }
    }

    async recalculateprice() {
        this.formContract.totaltanpappn = await parseInt(
            (
                this.formContract.totalhargakontrak -
                this.formContract.discount_price +
                this.formContract.biayasample +
                this.formContract.biayaakg
            ).toFixed()
        );
        this.formContract.ppn =
            (await parseInt(this.formContract.totaltanpappn.toFixed())) * 0.11;
        this.formContract.subtotal = await parseInt(
            (this.formContract.totaltanpappn + this.formContract.ppn).toFixed()
        );
        this.formContract.sisapembayaran = await parseInt(
            (this.formContract.subtotal - this.formContract.uangmuka).toFixed()
        );
    }

    async setHasilDiscount() {
        this.formContract.discount_price =
            (await (this.formContract.discount_conv / 100)) *
            this.hargakenadiskon;
        await this.recalculateprice();
    }

    async markstatuspengujianMou() {
        this.formContract.sample = await this.formContract.sample.map((m) => {
            console.log(m);
            if (m.statuspengujian === 1) {
                return {
                    ...m,
                    price: m.price,
                    disc:
                        (this.mouStatusPengujian.filter(
                            (r) => r.id_status_pengujian == 1
                        )[0].discount /
                            100) *
                        this.checkhargaparameterpersample(m),
                };
            } else if (m.statuspengujian == 2) {
                return {
                    ...m,
                    price:
                        (m.price / m.statuspengujian) *
                        this.mouStatusPengujian.filter(
                            (f) => f.id_status_pengujian == 2
                        )[0].values,
                    disc: 0,
                };
            } else if (m.statuspengujian == 3) {
                return {
                    ...m,
                    price:
                        (m.price / m.statuspengujian) *
                        this.mouStatusPengujian.filter(
                            (f) => f.id_status_pengujian == 3
                        )[0].values,
                    disc: 0,
                };
            } else if (m.statuspengujian == 4) {
                return {
                    ...m,
                    price: m.price,
                    disc:
                        (this.mouStatusPengujian.filter(
                            (r) => r.id_status_pengujian == 4
                        )[0].discount /
                            100) *
                        this.checkhargaparameterpersample(m),
                };
            } else {
                return {
                    ...m,
                    price: m.price,
                    disc:
                        (this.mouStatusPengujian.filter(
                            (r) => r.id_status_pengujian == 5
                        )[0].discount /
                            100) *
                        this.checkhargaparameterpersample(m),
                };
            }
        });
        this.formContract.totalhargakontrak =
            (await this.formContract.sample.length) > 0
                ? this.formContract.sample
                      .map((p) => p.price)
                      .reduce((e, z) => e + z)
                : 0;
        this.formContract.discount_price =
            (await this.formContract.sample.length) > 0
                ? this.formContract.sample
                      .map((i) => i.disc)
                      .reduce((a, i) => a + i)
                : 0;
    }

    async loader(v) {
        let dialogCust = await this.dialog.open(SpinnerModalsComponent, {
            height: "auto",
            width: "200px",
            data: v,
            disableClose: true,
        });
        await dialogCust.afterClosed().subscribe(async (result) => {});
    }

    async details(index) {
        if (this.formContract.sample[index].nama_sample) {
            let dialogCust = await this.dialog.open(
                ModalParameterRevisionComponent,
                {
                    height: "auto",
                    width: "1080px",
                    data: {
                        idsample: this.formContract.sample[index].id,
                        mou: this.mouStatusPengujian,
                        sample_name:
                            this.formContract.sample[index].id !== "add"
                                ? null
                                : this.formContract.sample[index].nama_sample,
                        detail: this.formContract.sample[index].detsample
                            ? this.formContract.sample[index].detsample
                            : null,
                        index: index,
                    },
                }
            );
            await dialogCust.afterClosed().subscribe(async (result) => {
                await this.setValue(index, result);
                await this.recalculatedisc(this.formContract);
                await this.recalculateprice();
            });
        } else {
            await global.swalerror("Harap isi Nama Sample Terlebih Dahulu");
        }
    }

    async saving() {
        await global
            .swalyousure("contract will go to cs again")
            .then(async (e) => {
                // console.log(this.formContract);
                if (e.isConfirmed) {
                    if (
                        this.formContract.alamatcustomer &&
                        this.formContract.contractcategory &&
                        this.formContract.idch &&
                        this.formContract.alasan &&
                        this.formContract.sample_source
                    ) {
                        await this.spinner.show();

                        await this._kontrakServ
                            .revisiSave(
                                this.formContract.contract_id,
                                this.formContract
                            )
                            .then((x) => {
                                if (x["success"]) {
                                    this.spinner.hide();
                                    global.swalsuccess(
                                        "Saving Success",
                                        `${x["contract_no"]}`
                                    );
                                    this._route.navigateByUrl(
                                        "/analystpro/contract"
                                    );
                                } else {
                                    global.swalerror(
                                        "Gagal Simpan Data, Harap Hubungi IT"
                                    );
                                }
                            })
                            .catch((t) =>
                                global
                                    .swalerror(
                                        "Error when saving data, please contact it"
                                    )
                                    .then((e) => {
                                        if (e.isConfirmed) {
                                            this.spinner.hide();
                                        }
                                        setTimeout(() => {
                                            this.spinner.hide();
                                        }, 3000);
                                    })
                            );
                    } else {
                        let innerHtml =
                            await `Ada Form yang tidak terisi&nbsp;: <br><br>`;
                        await global
                            .checknullImportant(
                                this.formContract,
                                datacontract.importantFormContractRev
                            )
                            .forEach((ac) => {
                                innerHtml += `<span style="font-weight: bold">${ac}</span><br>`;
                            });
                        await global.swalerrorinnerHtml(innerHtml);
                    }
                }
            });
    }

    async openModalPhoto(v) {
        await this.spinner.hide();
        const dialogRef = await this.dialog.open(ModalPhotoParameterComponent, {
            height: "auto",
            width: "800px",
            disableClose: true,
            panelClass: "parameter-modal",
            data: v,
        });

        await dialogRef.afterClosed().subscribe(async (result) => {
            this._route.navigateByUrl("analystpro/contract");
        });
    }

    cancel() {
        this._route.navigateByUrl("analystpro/contract");
    }

    async setValue(i, v) {
        this.formContract.sample[i].statuspengujian = await v.statuspengujian;
        this.formContract.sample[i].detsample = await v;
        this.formContract.sample[i].price = await v.price_sample;
        this.formContract.sample[i].price_original = await v.price_original;
        this.formContract.sample[i].disc = await v.discount_sample;
        this.formContract.totalhargakontrak =
            (await this.formContract.sample.length) > 0
                ? this.formContract.sample
                      .map((p) => p.price)
                      .reduce((e, z) => e + z)
                : 0;
        this.formContract.discount_price =
            (await this.formContract.sample.length) > 0
                ? this.formContract.sample
                      .map((i) => i.disc)
                      .reduce((a, i) => a + i)
                : 0;
    }

    checkhargaparameterpersample(v) {
        if (v.detsample) {
            let pktprm = v.detsample.paketparameter.filter(
                (r) => r.discount > 0
            );
            let pktpkm = v.detsample.paketpkm.filter((t) => t.disc > 0);

            let ttlnn =
                v.detsample.nonpaket.length > 0
                    ? v.detsample.nonpaket
                          .map((t) => t.price)
                          .reduce((b, c) => b + c)
                    : 0;
            let ttlpktprm =
                pktprm.length > 0
                    ? pktprm.map((a) => a.price).reduce((b, c) => b + c)
                    : 0;
            let ttlpktpkm =
                pktpkm.length > 0
                    ? pktpkm
                          .map((f) =>
                              f.subpackage.length > 0
                                  ? f.subpackage
                                        .map((p) => p.price)
                                        .reduce((u, n) => u + n)
                                  : 0
                          )
                          .reduce((e, v) => e + v)
                    : 0;
            return ttlnn + ttlpktprm + ttlpktpkm;
        } else {
            let paketprmdisc = v.mentahanparam.paketparameter.filter(
                (e) => e.disc > 0
            );
            let pkmdisc = v.mentahanparam.paketpkm.filter((e) => e.disc > 0);

            let totalnp =
                v.mentahanparam.nonpaket.length > 0
                    ? v.mentahanparam.nonpaket
                          .map((e) => e.price)
                          .reduce((a, b) => a + b)
                    : 0;
            let totalpaket =
                paketprmdisc.length > 0
                    ? paketprmdisc.map((z) => z.price).reduce((m, n) => m + n)
                    : 0;
            let totalpkm =
                pkmdisc.length > 0
                    ? pkmdisc.map((j) => j.price).reduce((y, u) => y + u)
                    : 0;

            return totalnp + totalpaket + totalpkm;
        }
    }

    checksample(v) {
        let nonpaketkenadisc = [];
        let paketparameterkenadisc = [];
        let paketpkmkenadisc = [];
        v.sample.forEach((c) => {
            let stval = c.statuspengujian
                ? this.statuspengujiandata.filter(
                      (z) => z.id === c.statuspengujian
                  )[0].value
                : 1;

            nonpaketkenadisc = nonpaketkenadisc.concat(
                c.detsample
                    ? c.detsample.nonpaket.map((a) => a.price)
                    : c.mentahanparam
                    ? c.mentahanparam.nonpaket.map((x) => x.price * stval)
                    : 0
            );

            paketparameterkenadisc = paketparameterkenadisc.concat(
                c.detsample
                    ? c.detsample.paketparameter
                          .filter((r) => r.discount > 0)
                          .map((a) => a.price)
                    : c.mentahanparam
                    ? c.mentahanparam.paketparameter
                          .filter((e) => e.disc > 0)
                          .map((m) => parseInt(m.price) * stval)
                    : 0
            );

            paketpkmkenadisc = paketpkmkenadisc.concat(
                c.detsample
                    ? c.detsample.paketpkm
                          .filter((r) => r.disc > 0)
                          .map((p) =>
                              p.subpackage
                                  .map((cc) => cc.price)
                                  .reduce((i, o) => i + o)
                          )
                    : c.metahanparam
                    ? c.mentahanparam.paketpkm
                          .filter((r) => r.disc > 0)
                          .map((p) => p.price * c.statuspengujian)
                    : 0
            );
        });

        let totalnonpaket =
            nonpaketkenadisc.length > 0
                ? nonpaketkenadisc.reduce((a, b) => a + b)
                : 0;
        let totalnpaketparameterkenadisconpaket =
            paketparameterkenadisc.length > 0
                ? paketparameterkenadisc.reduce((a, b) => a + b)
                : 0;
        let totalpaketpkmkenadisc =
            paketpkmkenadisc.length > 0
                ? paketpkmkenadisc.reduce((a, b) => a + b)
                : 0;

        console.log({
            totalnonpaket: totalnonpaket,
            totalnpaketparameterkenadisconpaket:
                totalnpaketparameterkenadisconpaket,
            totalpaketpkmkenadisc: totalpaketpkmkenadisc,
        });

        return {
            totalnonpaket,
            totalnpaketparameterkenadisconpaket,
            totalpaketpkmkenadisc,
        };
    }

    async recalculatedisc(v) {
        this.hargakenadiskon =
            (await (await this.checksample(v)).totalnonpaket) +
            (await this.checksample(v).totalnpaketparameterkenadisconpaket) +
            (await this.checksample(v).totalpaketpkmkenadisc);
        if (this.mouStatusPengujian.length < 1) {
            this.formContract.discount_price =
                (await (this.formContract.discount_conv / 100)) *
                this.hargakenadiskon;
        }
    }

    async getMou(ev) {
        this.mouStatusPengujian = await [];
        this.mouDiskon = await [];
        this.mouspecial = await true;

        await this._kontrakServ.getDataMou(ev).then((p: any) => {
            if (p.status) {
                if (p["message"] === "Data Mou Found") {
                    global.swalsuccess(`${p["message"]}`, "success");
                    this.mouStatusPengujian = p["data"][0]["detail"].filter(
                        (x) => x.condition == 1
                    );

                    this.mouDiskon = p["data"][0]["detail"].filter(
                        (x) => x.condition == 2
                    );

                    this.mouspecial =
                        p["data"][0]["detail"].filter((x) => x.condition == 3)
                            .length > 0
                            ? false
                            : true;
                    this.recalculateprice();
                    if (this.mouStatusPengujian.length > 0) {
                        let html = `
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th align="center" style="border: 1px solid black;">No</th>
                                        <th align="center" style="border: 1px solid black;">Description</th>
                                        <th align="center" style="border: 1px solid black;">Value</th>
                                        <th align="center" style="border: 1px solid black;">Discount</th>
                                    </tr>
                                </thead>
                                <tbody>
                        `;
                        for (
                            let i = 0;
                            i < this.mouStatusPengujian.length;
                            i++
                        ) {
                            html += `
                                <tr>
                                    <td style="border: 1px solid black;">${
                                        i + 1
                                    }</td>`;
                            if (
                                this.mouStatusPengujian[i]
                                    .id_status_pengujian == 1
                            ) {
                                html += `<td style="border: 1px solid black;">Normal</td>`;
                            } else if (
                                this.mouStatusPengujian[i]
                                    .id_status_pengujian == 2
                            ) {
                                html += `<td style="border: 1px solid black;">Urgent</td>`;
                            } else if (
                                this.mouStatusPengujian[i]
                                    .id_status_pengujian == 3
                            ) {
                                html += `<td style="border: 1px solid black;">Very Urgent</td>`;
                            } else if (
                                this.mouStatusPengujian[i]
                                    .id_status_pengujian == 4
                            ) {
                                html += `<td style="border: 1px solid black;">Custom 2 Hari</td>`;
                            } else {
                                html += `<td style="border: 1px solid black;">Custom 1 Hari</td>`;
                            }
                            html += `<td style="border: 1px solid black;">${this.mouStatusPengujian[i].values} x</td>
                                    <td style="border: 1px solid black;">${this.mouStatusPengujian[i].discount} %</td>
                                </tr>`;
                        }
                        html += `</tbody></table>`;
                        global.swalmou(html).then(async (x) => {
                            await this.mouStatusPengujian.forEach((a) => {
                                this.statuspengujiandata.filter(
                                    (e) => e.id === a.id_status_pengujian
                                )[0].value = a.values;
                                this.statuspengujiandata.filter(
                                    (e) => e.id === a.id_status_pengujian
                                )[0].disc = a.discount;
                            });
                            await this.markstatuspengujianMou();
                            await this.recalculateprice();
                        });
                    } else if (this.mouDiskon.length > 0) {
                        let html = `
                                <table style="width: 100%; border-collapse: collapse;">
                                    <thead>
                                        <tr>
                                            <th align="center" style="border: 1px solid black;">No</th>
                                            <th align="center" style="border: 1px solid black;">Description</th>
                                            <th align="center" style="border: 1px solid black;">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                            `;
                        for (let i = 0; i < this.mouDiskon.length; i++) {
                            html += `
                                    <tr>
                                        <td style="border: 1px solid black;">${
                                            i + 1
                                        }</td>
                                        <td style="border: 1px solid black;">${
                                            this.mouDiskon[i].desc
                                        }</td>
                                        <td style="border: 1px solid black;">${
                                            this.mouDiskon[i].discount
                                        } %</td>
                                    </tr>`;
                        }
                        html += `</tbody></table>`;
                        global.swalmou(html).then((x) => {
                            if (this.mouDiskon.length > 0) {
                                this.formContract.discount_conv =
                                    p["data"][0]["detail"][0].discount;
                                this.setHasilDiscount();
                            }
                            this.resetValueOriginal();
                        });
                    }
                } else {
                    global.swalwarning(p["message"], "");
                    this.resetValueOriginal();
                }
            } else {
                this.resetValueOriginal();
            }
        });
        await setTimeout(async () => {
            await this.getDataCustomerAddress(ev);
            await this.openbottomsheet();
            this.setAddParameter = await false;
        }, 1000);
    }

    async gotosampling() {
        let dialogCust = await this.dialog.open(SamplingModalComponent, {
            height: "auto",
            width: "800px",
            data: {
                contract_id: this.formContract.contract_id,
                data:
                    this.formContract.datasampling.length > 0
                        ? this.formContract.datasampling
                        : null,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.formContract.datasampling = [];
            this.formContract.datasampling =
                this.formContract.datasampling.concat(result.a);
            this.formContract.biayasample = result.b;
            this.recalculateprice();
        });
    }

    async gotoakg() {
        let dialogCust = await this.dialog.open(AkgModalComponent, {
            height: "auto",
            width: "800px",
            data: {
                contract_id: this.formContract.contract_id,
                data:
                    this.formContract.dataakg.length > 0
                        ? this.formContract.dataakg
                        : null,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.formContract.dataakg = [];
            this.formContract.dataakg = this.formContract.dataakg.concat(
                result.a
            );
            this.formContract.biayaakg = result.b;
            this.recalculateprice();
        });
    }

    async resetValueOriginal() {
        await console.log(this.formContract);
        await this.resetstatuspengujian();
        this.formContract.sample = await this.formContract.sample.map((m) => ({
            ...m,
            price:
                m.price_original *
                this.statuspengujiandata.filter(
                    (d) => d.id == m.statuspengujian
                )[0].value,
        }));
        this.formContract.totalhargakontrak =
            (await this.formContract.sample.length) > 0
                ? this.formContract.sample
                      .map((p) => p.price)
                      .reduce((a, b) => a + b)
                : 0;
    }

    resetstatuspengujian() {
        this.statuspengujiandata = [
            {
                id: 1,
                status: "Normal",
                value: 1,
                disc: 0,
            },
            {
                id: 2,
                status: "Urgent",
                value: 2,
                disc: 0,
            },
            {
                id: 3,
                status: "Very Urgent",
                value: 3,
                disc: 0,
            },
            {
                id: 4,
                status: "Custom 2 Hari",
                value: 4,
                disc: 0,
            },
            {
                id: 5,
                status: "Custom 1 Hari",
                value: 5,
                disc: 0,
            },
        ];
    }

    openbottomsheet() {
        let d = this.customerhandle.filter(
            (j) => j.idch === this.formContract.idch
        );
        this._matbottomsheet.open(ContractDetComponent, {
            data: d,
        });
    }

    async delete(index) {
        this.numbersample = (await this.numbersample) - 1;
        if (this.formContract.sample[index].id !== "add") {
            this.formContract.sampleremove =
                await this.formContract.sampleremove.concat(
                    this.formContract.sample.filter((x, i) => i == index)
                );
        }
        this.formContract.sample = await this.formContract.sample.filter(
            (x, i) => i !== index
        );

        await this.recalculatedisc(this.formContract);

        this.formContract.totalhargakontrak = await this.formContract.sample
            .map((ap) => ap.price)
            .reduce((i, o) => i + o);
        this.formContract.discount_price = await this.formContract.sample
            .map((ap) => ap.disc)
            .reduce((i, o) => i + o);
        await this.recalculateprice();
    }

    copy(i) {
        this.copydata = [];
        this.copydata = this.copydata.concat(this.formContract.sample[i]);
    }

    async paste(i) {
        if (i !== "all") {
            await this.pastevalue(i);
            await this.recalculated();
        } else {
            for (let u = 0; u < this.formContract.sample.length; u++) {
                await this.pastevalue(u);
            }

            this.recalculated();
        }
    }

    async pastevalue(i) {
        let v = await this.copydata[0];

        this.formContract.sample.filter((r, z) => z == i)[0].price =
            await v.price;
        this.formContract.sample.filter((r, z) => z == i)[0].price_original =
            await v.price_original;
        this.formContract.sample.filter((r, z) => z == i)[0].disc =
            await v.disc;
        this.formContract.sample.filter((r, z) => z == i)[0].statuspengujian =
            await v.statuspengujian;
        this.formContract.sample.filter((r, z) => z == i)[0].mentahanparam =
            await v.mentahanparam;

        (await v.detsample)
            ? (this.formContract.sample.filter((r, z) => z == i)[0].detsample =
                  v.detsample)
            : null;
    }

    async recalculated() {
        this.formContract.totalhargakontrak = await this.formContract.sample
            .map((ap) => ap.price)
            .reduce((a, b) => a + b);
        this.formContract.discount_price = await this.formContract.sample
            .map((z) => z.disc)
            .reduce((a, b) => a + b);

        await this.recalculateprice();
    }

    async setsisapembayaran() {
        await this.recalculateprice();
    }

    async setDiscount() {
        await this.recalculateprice();
    }

    async formContractGet(v) {
        this.customerhandle = await this.customerhandle.concat({
            id_cp: v.kontrakujifull.customers_handle.id_cp,
            id_customer: v.kontrakujifull.customers_handle.id_customer,
            customer_name:
                v.kontrakujifull.customers_handle.customers.customer_name,
            name: v.kontrakujifull.customers_handle.contact_person.name,
            email: v.kontrakujifull.customers_handle.email,
            idch: v.kontrakujifull.customers_handle.idch,
            kode_customer:
                v.kontrakujifull.customers_handle.customers.kode_customer,
        });

        this.datasentpenawaran.idcust = await v.kontrakujifull.customers_handle.id_customer;
        await this.getDataPenawaran();
        
        this.customerhandle = await global.uniq(
            this.customerhandle,
            (it) => it.idch
        );

        await this.getDataCustomerAddress(
            v.kontrakujifull.customers_handle.id_customer
        );

        this.formContract = await {
            contract_id: this.formContract.contract_id,
            contractcategory: v.kontrakujifull.id_contract_category,
            no_penawaran: v.kontrakujifull.no_penawaran,
            penawaran: v.kontrakujifull.id_penawaran,
            no_po: v.kontrakujifull.no_po,
            sample_source: v.kontrakujifull.contract_type,
            idch: v.kontrakujifull.id_customers_handle,
            alamatcustomer: v.kontrakujifull.id_alamat_customer,
            internal_desc:
                v.kontrakujifull.description_cs.length > 0
                    ? v.kontrakujifull.description_cs[0].desc
                    : null,
            sample: [],
            biayasample: 0,
            clienthandling: v.kontrakujifull.status,
            biayaakg: 0,
            sampleremove: [],
            totalhargakontrak: 0,
            discount_conv: 0,
            discount_price: v.kontrakujifull.payment_condition.discount_lepas,
            subtotal: 0,
            ppn: 0,
            totaltanpappn: 0,
            uangmuka: v.kontrakujifull.payment_condition.downpayment,
            sisapembayaran: 0,
            voucher: null,
            alasan: null,
            datasampling: [],
            dataakg: [],
            external_desc: v.kontrakujifull.desc,
        };
        await this.getMou(v.kontrakujifull.customers_handle.id_customer);
    }

    async getDataContractCategory() {
        await this._contractCatServ
            .getDataContractCategory(this.datasendContractCategory)
            .then(
                (c) =>
                    (this.contract_category = this.contract_category.concat(
                        c["data"]
                    ))
            );
    }

    async tambah() {
        this.numbersample = (await this.numbersample) + 1;
        await this.recalculateprice();
        await this.sampleadd();
    }

    sampleadd() {
        this.formContract.sample = this.formContract.sample.concat({
            id: "add",
            no_sample: "New",
            nama_sample: null,
            status: "new",
            price: 0,
            price_original: 0,
            disc: 0,
            statuspengujian: 0,
        });
    }

    async sampleremove() {
        this.numbersample = (await this.numbersample) - 1;
        await this.formContract.sample.pop();
        await this.recalculateprice();
    }

    async getValue(ev, status) {
        switch (status) {
            case "customer":
                if (ev) {
                    this.alamatcustomer = await [];
                    this.datasentpenawaran.idcust = await ev.id_customer;
                    await this.getDataCustomerAddress(ev.id_customer);
                    await this.getMou(ev.id_customer);
                    await this.getDataPenawaran();
                }
                break;
            case "penawaran":
                this.datasentpenawaran.pages = this.datasentpenawaran.pages + 1;
                this.getDataPenawaran();
                break;
        }
    }

    getDataPenawaran() {
        this._penawaranServ
            .getDataPenawaranCustomer(this.datasentpenawaran)
            .then((x: any) => {
                x.forEach((p) => {
                    this.datapenawaran = this.datapenawaran.concat({
                        id: p.id,
                        employee: p.sales_name.employee_name,
                        no_penawaran: p.no_penawaran,
                    });
                });
            })
            .then(
                () =>
                    (this.datapenawaran = global.uniq(
                        this.datapenawaran,
                        (it) => it.id
                    ))
            );
    }

    async modalcustomerhandle() {
        let dialogCust = await this.dialog.open(CustomershandleModalComponent, {
            height: "auto",
            width: "1300px",
            disableClose: true,
        });
        await dialogCust.afterClosed().subscribe(async (result) => {
            this.customerhandle = [];
            this.datasendCustomerHandle.pages = 1;
            this.datasendCustomerHandle.search = null;
            this.getDatacustomerhandle();
        });
    }

    async getDataCustomerAddress(v) {
        await this._kontrakServ
            .getDataAddressCustomer({ pages: 1, search: null, id_customer: v })
            .then(
                (o) =>
                    (this.alamatcustomer = this.alamatcustomer.concat(
                        o["data"]
                    ))
            )
            .then(
                () =>
                    (this.alamatcustomer = global.uniq(
                        this.alamatcustomer,
                        (i) => i.id_address
                    ))
            );
    }

    onSearchi(ev, status) {
        switch (status) {
            case "customer":
                this.datasendCustomerHandle.search = ev.term;
                this.datasendCustomerHandle.pages = 1;
                this.customerhandle = [];
                this.getDatacustomerhandle();
                break;
            case "employee":
                this.datasend.pages = 1;
                this.datasend.search = ev.term;
                this.dataemployee = [];
                this.getDataEmployee();
                break;
        }
    }
}
