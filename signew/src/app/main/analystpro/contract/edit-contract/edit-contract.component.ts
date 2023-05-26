import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ContractService } from "../../services/contract/contract.service";
import { MatDialog } from "@angular/material/dialog";
import { ContactPersonService } from "app/main/analystpro/master/contact-person/contact-person.service";
import { PdfService } from "../../services/pdf/pdf.service";
import { LoginService } from "app/main/login/login.service";
import { CustomerhandleService } from "../../services/customerhandle/customerhandle.service";
import * as global from "app/main/global";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomershandleModalComponent } from "../../modal/customershandle-modal/customershandle-modal.component";
import { ContractcategoryService } from "../../services/contractcategory/contractcategory.service";
import { ModalDetailEditContractComponent } from "./modal-detail-edit-contract/modal-detail-edit-contract.component";
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Form,
} from "@angular/forms";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as _moment from "moment";
import Swal from "sweetalert2";
import { PenawaranService } from "app/main/analystpro/penawaran/penawaran.service";

export const MY_FORMATS = {
    parse: {
        dateInput: "LL",
    },
    display: {
        dateInput: "DD/MM/YYYY",
        monthYearLabel: "YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "YYYY",
    },
};
@Component({
    selector: "app-edit-contract",
    templateUrl: "./edit-contract.component.html",
    styleUrls: ["./edit-contract.component.scss"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class EditContractComponent implements OnInit {
    idContract;
    contractForm: FormGroup;
    sampleForm: FormArray = this._formBuilder.array([]);

    customerhandle = [];
    mouspecial;
    dataalamat = {
        pages: 1,
        search: null,
        id_customer: null,
    };
    alamatcustomer = [];
    contract_category = [];
    datasendContractCategory = {
        pages: 1,
        search: null,
    };
    copydata = [];
    datasentCP = {
        pages: 1,
        search: null,
    };
    datacp = [];
    dataemployee = [];
    statuspengujianarray = [
        {
            id: 1,
            status: "Normal",
            values: 1,
            discount: 0,
        },
        {
            id: 2,
            status: "Urgent",
            values: 2,
            discount: 0,
        },
        {
            id: 3,
            status: "Very Urgent",
            values: 3,
            discount: 0,
        },
        {
            id: 4,
            status: "Custom 2 Hari",
            values: 4,
            discount: 0,
        },
        {
            id: 5,
            status: "Custom 1 Hari",
            value: 5,
            disc: 0,
        },
    ];
    typeContract = [
        {
            id: 1,
            type: "Bogor",
        },
        {
            id: 2,
            type: "Jakarta",
        },
        {
            id: 3,
            type: "Package",
        },
        {
            id: 4,
            type: "Surabaya",
        },
        {
            id: 5,
            type: "Semarang",
        },
        {
            id: 6,
            type: "Yogyakarta",
        },
    ];

    paketparameter = [];
    nonpaket = [];
    paketpkm = [];

    pricewithoutpkm: number;
    datasendCustomerHandle = {
        pages: 1,
        search: null,
    };

    datasentpenawaran = {
        pages: 1,
        search: null,
        idcust: null
    };
    datapenawaran = [];
    datacustomerhandle = [];
    mouStatusPengujian = [];
    mouDiskon = [];
    deletedSample = [];

    constructor(
        private _kontrakServ: ContractService,
        private _route: Router,
        private _formBuilder: FormBuilder,
        private _actRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private dialog: MatDialog,
        private _pdfServ: PdfService,
        private _employeeServ: EmployeeService,
        private _spinner: NgxSpinnerService,
        private _loginServ: LoginService,
        private _custHandleServ: CustomerhandleService,
        private spinner: NgxSpinnerService,
        private _contractCatServ: ContractcategoryService,
        private _contactPerson: ContactPersonService,
        private _penawaranServ: PenawaranService
    ) {
        this.idContract = this._actRoute.snapshot.params["id"];
    }

    ngOnInit(): void {
        this.spinner.show();
        this.getDataContractCategory();
        this.getDatacustomerhandle();
        this.getDataEmployee();
        this.getDataCp();
        this.contractForm = this.createForm();
        setTimeout(() => {
            this.setDataEdit();
        }, 1000);
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

    getDataEmployee() {
        this._employeeServ
            .getData({ division: 6, pages: 1 })
            .then(
                (x) => (this.dataemployee = this.dataemployee.concat(x["data"]))
            );
    }

    async getDataCp() {
        this._contactPerson
            .getDataContactPersons(this.datasentCP)
            .then((x) => (this.datacp = this.datacp.concat(x["data"])));
    }

    onScrollToEnd(e) {
        switch (e) {
            case "cp":
                this.datasentCP.pages = this.datasentCP.pages + 1;
                this.getDataCp();
                break;

            case "customer":
                this.datasendCustomerHandle.pages =
                    this.datasendCustomerHandle.pages + 1;
                this.getDatacustomerhandle();
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

    onSearchi(ev, status) {
        switch (status) {
            case "cp":
                this.datasentCP.search = ev.term;
                this.datasentCP.pages = 1;
                this.datacp = [];
                this.getDataCp();
                break;

            case "customer":
                this.datasendCustomerHandle.search = ev.term;
                this.datasendCustomerHandle.pages = 1;
                this.customerhandle = [];
                this.getDatacustomerhandle();
                break;
        }
    }

    reset(status) {
        switch (status) {
            case "cp":
                this.datacp = [];
                this.datasentCP = {
                    search: null,
                    pages: 1,
                };
                this.getDataCp();
                break;
            case "customer":
                this.customerhandle = [];
                this.getDatacustomerhandle();
                break;
        }
    }

    async getValue(ev, status) {
        await this.contractForm.patchValue({
            disc_set: 0,
            discount_lepas: 0,
        });
        switch (status) {
            case "customer":
                this.contractForm.patchValue({
                    email: ev.email,
                    phone: ev.phonenumber,
                    telp: ev.telpnumber,
                });
                this.datacustomerhandle = await [];
                this.dataalamat.id_customer = await ev.id_customer;
                await this._custHandleServ.getDataDetail(ev.idch).then((x) => {
                    this.datacustomerhandle = this.datacustomerhandle.concat(x);
                });
                this.datasentpenawaran.idcust = await ev.id_customer;
                await this.getDataPenawaran();
                await this.getDataCustomerAddress();
                await this.getMou(ev.id_customer);
                break;
        }
    }

    async recalculateSample() {
        let sample = await this.sampleForm.controls;
        let normal = await sample.filter((x) => x.value.statuspengujian == 1);
        let urgent = await sample.filter((x) => x.value.statuspengujian == 2);
        let veryurgent = await sample.filter(
            (x) => x.value.statuspengujian == 3
        );
        let custom2hr = await sample.filter(
            (x) => x.value.statuspengujian == 4
        );
        let custom1hr = await sample.filter(
            (x) => x.value.statuspengujian == 5
        );

        if (normal.length > 0) {
            let normalsample = await [];
            normalsample = await normalsample.concat(
                sample
                    .filter((v) => v.value.statuspengujian == 1)
                    .map((g) => g.value)
            );

            await normalsample.forEach((m, i) => {
                this.setPricing(m, 0);
            });
        }

        if (urgent.length > 0) {
            let urgentsample = await [];
            urgentsample = urgentsample.concat(
                sample
                    .filter((v) => v.value.statuspengujian == 2)
                    .map((g) => g.value)
            );

            await urgentsample.forEach((m, i) => {
                this.setPricing(m, 1);
            });
        }

        if (veryurgent.length > 0) {
            let veryurgentsample = await [];
            veryurgentsample = veryurgentsample.concat(
                sample
                    .filter((v) => v.value.statuspengujian == 3)
                    .map((g) => g.value)
            );

            await veryurgentsample.forEach((m, i) => {
                this.setPricing(m, 2);
            });
        }

        if (custom2hr.length > 0) {
            let cust2hrsample = await [];
            cust2hrsample = cust2hrsample.concat(
                sample
                    .filter((v) => v.value.statuspengujian == 4)
                    .map((g) => g.value)
            );

            await cust2hrsample.forEach((m, i) => {
                this.setPricing(m, 3);
            });
        }

        if (custom1hr.length > 0) {
            let custom1hrsample = await [];
            custom1hrsample = custom1hrsample.concat(
                sample
                    .filter((v) => v.value.statuspengujian == 5)
                    .map((g) => g.value)
            );

            await custom1hrsample.forEach((m, i) => {
                this.setPricing(m, 4);
            });
        }
    }

    async setPricing(m, st) {
        await this._kontrakServ.getOriginalValue(m).then(async (x: any) => {
            let j = await this.sampleForm.controls.findIndex(
                (g) => g.value.no_sample === m.no_sample
            );
            let z =
                this.mouStatusPengujian.length > 0
                    ? this.mouStatusPengujian
                    : this.statuspengujianarray;
            await console.log(z[st]);
            await console.log(x.kumpulinpaketparameterprice);
            // non paket 1.550.000
            // paket 935.000
            // paket pkm 1.600.000
            await this.sampleForm.at(j).patchValue({
                sample_price:
                    (x.kumpulinonpaket +
                        x.kumpulinpaketparameterprice +
                        x.kumpulinpaketpkmprice) *
                    z[st].values,
                discount: z[st].discount
                    ? (x.kumpulinonpaket +
                          x.bolehdiscpaketparameter +
                          x.bolehdiscpaketpkm) *
                      (z[st].discount / 100)
                    : 0,
            });
            await this.perhitungan();
        });
    }

    async getMou(v) {
        this.mouStatusPengujian = await [];
        this.mouDiskon = await [];
        this.mouspecial = await true;

        await this._kontrakServ.getDataMou(v).then((p: any) => {
            if (p.status) {
                if (p["message"] === "Data Mou Found") {
                    this.mouStatusPengujian = p["data"][0]["detail"].filter(
                        (x) => x.condition == 1
                    );

                    this.mouDiskon = p["data"][0]["detail"].filter(
                        (x) => x.condition == 2
                    );

                    if (this.mouDiskon.length > 0) {
                        this.contractForm.controls.disc_set.setValue(
                            this.mouDiskon[0].discount
                        );
                        this.setDisc();
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
                        global.swalmou(html).then((x) => console.log(x));
                    }

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
                        global
                            .swalmou(html)
                            .then((x) => this.recalculateSample());
                    }

                    // this.mouspecial =
                    //     p["data"][0]["detail"].filter((x) => x.condition == 3)
                    //         .length > 0
                    //         ? false
                    //         : true;
                    // this.perhitungan();
                } else {
                    global.swalwarning(
                        p["message"],
                        `At ${p["data"][0].end_date}`
                    );
                    this.contractForm.controls.disc_set.setValue(0);
                    this.recalculateSample();
                }
            } else {
                this.contractForm.controls.disc_set.setValue(0);
                this.recalculateSample();
            }
        });
    }

    async modalcustomerhandle() {
        let dialogCust = await this.dialog.open(CustomershandleModalComponent, {
            height: "auto",
            width: "1300px",
            disableClose: true,
        });
        await dialogCust.afterClosed().subscribe(async (result) => {
            this.customerhandle = await [];
            this.datasendCustomerHandle.pages = await 1;
            this.datasendCustomerHandle.search = await null;
            await this.getDatacustomerhandle();
            await global.swalsuccess("Success Saving Customers", "success");
        });
    }

    async setDataEdit() {
        await this._kontrakServ
            .getDataDetailKontrak(this.idContract)
            .then(async (x: any) => {
                var pricekenadiskonsample = [];

                await x.transactionsample.forEach((g) => {
                    let paketparameter = [];
                    let nonpaket = [];
                    let paketpkm = [];

                    paketparameter = g.transactionparameter.filter(
                        (g) => g.status_string == "PAKET"
                    );
                    nonpaket = g.transactionparameter.filter(
                        (c) => c.status_string == "NON PAKET"
                    );

                    paketpkm = g.transactionparameter.filter(
                        (p) => p.status_string == "PAKET PKM"
                    );

                    this.addFormSample(g);

                    g.nonpaket = nonpaket;
                    g.paketparameter = paketparameter;
                    g.paketpkm = paketpkm;

                    this._kontrakServ.getOriginalValue(g).then((f: any) => {
                        let totalboleh =
                            (f.kumpulinonpaket +
                                f.bolehdiscpaketparameter +
                                f.bolehdiscpaketpkm) *
                            1;
                        pricekenadiskonsample =
                            pricekenadiskonsample.concat(totalboleh);
                    });
                });

                this.customerhandle = await this.customerhandle.concat({
                    customer_name: x.customers_handle.customers.customer_name,
                    kode_customer: x.customers_handle.customers.kode_customer,
                    name: x.customers_handle.contact_person.name,
                    fax: x.customers_handle.fax,
                    telp: x.customers_handle.telp,
                    idch: x.customers_handle.idch,
                    email: x.customers_handle.email,
                });
                this.datasentpenawaran.idcust = await x.customers_handle.id_customer;
                await this.getDataPenawaran();
                let totalbiayapengujian = await this.sampleForm.controls
                    .map((x) => x.value.sample_price)
                    .reduce((a, b) => a + b);
                let biayasampling =
                    (await x.sampling_trans.length) > 0
                        ? x.sampling_trans
                              .map((y) => y.total)
                              .reduce((a, b) => a + b)
                        : 0;
                let biayakg =
                    (await x.akg_trans.length) > 0
                        ? x.akg_trans
                              .map((y) => y.total)
                              .reduce((a, b) => a + b)
                        : 0;
                let subtotal =
                    (await (totalbiayapengujian -
                        x.payment_condition.discount_lepas)) +
                    biayasampling +
                    biayakg;
                this.dataalamat.id_customer = await x.customers_handle
                    .id_customer;
                await this.getDataCustomerAddress();
                await this._contactPerson
                    .getDataContactPersonsDetail(x.customers_handle.id_cp)
                    .then((xx) => (this.datacp = this.datacp.concat(xx)));
                await this.contractForm.patchValue({
                    email: x.customers_handle.email,
                    phone: x.customers_handle.phone,
                    telp: x.customers_handle.telp,
                    contract_no: x.contract_no,
                    contract_category: x.id_contract_category.toString(),
                    no_penawaran: x.no_penawaran,
                    penawaran: x.id_penawaran,
                    no_po: x.no_po,
                    typeContract: x.contract_type,
                    customer_name: x.customers_handle.customers.customer_name,
                    contact_person: x.customers_handle.id_cp,
                    customerhandle: x.id_customers_handle,
                    alamatcustomer: x.id_alamat_customer.toString(),
                    desc_internal:
                        x.description.length > 0 ? x.description[0].desc : "",
                    desc: x.desc ? x.desc : "",
                    totalbiayapengujian: totalbiayapengujian,
                    discount_lepas: x.payment_condition.discount_lepas,
                    downpayment: x.payment_condition.downpayment,
                    clienthandling: x.status,
                    disc_set: (
                        (x.payment_condition.discount_lepas /
                            pricekenadiskonsample.reduce((a, b) => a + b)) *
                        100
                    ).toFixed(),
                    voucher: x.payment_condition.voucher
                        ? x.payment_condition.voucher
                        : null,
                    biaya_sampling: biayasampling,
                    biaya_akg: biayakg,
                    subtotal: subtotal,
                    ppn: parseInt(x.payment_condition.ppn.toFixed()),
                });
            });
        await this.spinner.hide();
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

    async setDisc() {
        let totalsample = await [];
        await this.sampleForm.controls.forEach((x, i) => {
            this._kontrakServ.getOriginalValue(x.value).then((h: any) => {
                let z =
                    this.mouStatusPengujian.length > 0
                        ? this.mouStatusPengujian
                        : this.statuspengujianarray;

                totalsample = totalsample.concat({
                    totalhargasample:
                        (h.kumpulinonpaket +
                            h.bolehdiscpaketparameter +
                            h.bolehdiscpaketpkm) *
                        z.filter((f) => f.id == x.value.statuspengujian)[0]
                            .values,
                });

                this.sampleForm.at(i).patchValue({
                    sample_price:
                        (h.kumpulinonpaket +
                            h.kumpulinpaketparameterprice +
                            h.kumpulinpaketpkmprice) *
                        z.filter((f) => f.id == x.value.statuspengujian)[0]
                            .values,
                    discount: z.filter(
                        (f) => f.id == x.value.statuspengujian
                    )[0].discount
                        ? (h.kumpulinonpaket +
                              h.bolehdiscpaketparameter +
                              h.bolehdiscpaketpkm) *
                          z.filter((f) => f.id == x.value.statuspengujian)[0]
                              .values *
                          (z.filter((f) => f.id == x.value.statuspengujian)[0]
                              .discount /
                              100)
                        : 0,
                });
            });
        });
        let v =
            (await totalsample.length) > 0
                ? totalsample
                      .map((b) => b.totalhargasample)
                      .reduce((a, b) => a + b)
                : 0;
        let getpricediscount =
            ((await this.contractForm.value.disc_set) / 100) * v;

        await this.contractForm.controls.discount_lepas.setValue(
            getpricediscount
        );

        await this.perhitungan();
    }

    setDays(v) {
        return _moment(v).format("YYYY-MM-DD");
    }

    addFormSample(v) {
        const sample = this._formBuilder.group({
            no_sample: v.no_sample,
            sample_name: v.sample_name,
            kode_sample: v.kode_sample,
            tujuanpengujian: v.id_tujuanpengujian,
            statuspengujian: v.id_statuspengujian,
            sub_catalogue: v.id_subcatalogue,
            tgl_input: _moment(v.tgl_input).format("YYYY-MM-DD"),
            tgl_kadaluarsa: v.tgl_kadaluarsa
                ? _moment(v.tgl_kadaluarsa).format("YYYY-MM-DD")
                : null,
            tgl_produksi: v.tgl_produksi
                ? _moment(v.tgl_produksi).format("YYYY-MM-DD")
                : null,
            tgl_selesai: _moment(v.tgl_selesai).format("YYYY-MM-DD"),
            nama_pabrik: v.nama_pabrik,
            alamat_pabrik: v.alamat_pabrik,
            nama_dagang: v.nama_dagang,
            lot_number: v.lot_number,
            jenis_kemasan: v.jenis_kemasan,
            batch_number: v.batch_number,
            no_notifikasi: v.no_notifikasi,
            no_pengajuan: v.no_pengajuan,
            no_registrasi: v.no_registrasi,
            no_principalcode: v.no_principalcode,
            certificate_info: v.certificate_info,
            keterangan_lain: v.keterangan_lain,
            sample_price: v.price,
            discount: v.discount,
            paketparameter: this._formBuilder.array(
                v.transactionparameter.filter((v) => v.status_string == "PAKET")
            ),
            nonpaket: this._formBuilder.array(
                v.transactionparameter.filter(
                    (v) => v.status_string == "NON PAKET"
                )
            ),
            paketpkm: this._formBuilder.array(
                v.transactionparameter.filter(
                    (v) => v.status_string == "PAKET PKM"
                )
            ),
        });
        this.sampleForm.push(sample);
    }

    openSnackBar(array, index, message: string, action: string) {
        let a = this._snackBar.open(message, action, { duration: 3000 });

        a.onAction().subscribe(() => {
            console.log(array);
            this.deletedSample = this.deletedSample.filter(
                (k) => k.value.no_sample !== array.value.no_sample
            );
            this.sampleForm.controls.splice(index, 0, array);
            this.perhitungan();
        });

        a.afterDismissed().subscribe(() => {
            // if (row.value.id) {
            //     let data = [];
            //     data.push(row.value);
            //     this._kontrakServ
            //         .deleteParameter(data)
            //         .then((c) => console.log(c));
            // }
        });
    }

    async deletesample(v) {
        global.swalyousure("Deleting Sample").then(async (x) => {
            if (x.isConfirmed) {
                await this.deletedSample.push(this.sampleForm.controls[v]);
                this.deletedSample = await global.uniq(
                    this.deletedSample,
                    (it) => it.value.no_sample
                );
                await this.openSnackBar(
                    this.sampleForm.controls[v],
                    v,
                    "Sample Deleted",
                    "Undo"
                );
                await this.sampleForm.removeAt(v);
                await this.setDisc();
            } else {
                global.swalsuccess("Saved", "Your data is save");
            }
        });
    }

    createForm(): FormGroup {
        return this._formBuilder.group({
            contract_no: new FormControl(),
            contract_category: new FormControl({
                value: null,
                disabled: true,
            }),
            no_penawaran: new FormControl(null),
            penawaran: new FormControl(null),
            no_po: new FormControl(null),
            typeContract: new FormControl(null),
            customer_name: new FormControl({
                value: null,
                disabled: true,
            }),
            email: new FormControl(),
            phone: new FormControl(),
            telp: new FormControl(),
            contact_person: new FormControl(),
            customerhandle: new FormControl(null),
            alamatcustomer: new FormControl(null),
            desc_internal: new FormControl(null),
            desc: new FormControl(null),
            sampleFormArray: this.sampleForm,
            totalbiayapengujian: new FormControl(),
            disc_set: new FormControl(),
            discount_lepas: new FormControl(),
            downpayment: new FormControl(),
            voucher: new FormControl(),
            clienthandling: new FormControl(),
            biaya_sampling: new FormControl(),
            biaya_akg: new FormControl(),
            subtotal: new FormControl(),
            ppn: new FormControl(),
        });
    }

    async seedetail(b) {
        const dialogRef = await this.dialog.open(
            ModalDetailEditContractComponent,
            {
                height: "600px",
                width: "1080px",
                data: {
                    sample: this.sampleForm.at(b).value,
                },
            }
        );

        await dialogRef.afterClosed().subscribe(async (v) => {
            await this.sampleForm.at(b).patchValue({
                kode_sample: v.kode_sample,
                tujuanpengujian: v.tujuanpengujian.toString(),
                statuspengujian: v.statuspengujian.toString(),
                sub_catalogue: v.sub_catalogue,
                tgl_input: _moment(v.tgl_input).format("YYYY-MM-DD"),
                tgl_kadaluarsa: v.tgl_kadaluarsa
                    ? _moment(v.tgl_kadaluarsa).format("YYYY-MM-DD")
                    : null,
                tgl_produksi: v.tgl_produksi
                    ? _moment(v.tgl_produksi).format("YYYY-MM-DD")
                    : null,
                tgl_selesai: _moment(v.tgl_selesai).format("YYYY-MM-DD"),
                nama_pabrik: v.nama_pabrik,
                alamat_pabrik: v.alamat_pabrik,
                nama_dagang: v.nama_dagang,
                lot_number: v.lot_number,
                jenis_kemasan: v.jenis_kemasan,
                batch_number: v.batch_number,
                no_notifikasi: v.no_notifikasi,
                no_pengajuan: v.no_pengajuan,
                no_registrasi: v.no_registrasi,
                no_principalcode: v.no_principalcode,
                certificate_info: v.certificate_info.toString(),
                keterangan_lain: v.keterangan_lain,
                sample_price: v.sample_price,
            });
            await this.contractForm.controls.totalbiayapengujian.setValue(
                this.sampleForm.controls
                    .map((b) => b.value.sample_price)
                    .reduce((v, b) => v + b)
            );
            await this.perhitungan();
        });
    }

    async perhitungan() {
        let totalbiayapengujian =
            (await this.sampleForm.controls.length) > 0
                ? this.sampleForm.controls
                      .map((x) => x.value.sample_price)
                      .reduce((a, b) => a + b)
                : 0;

        await this.contractForm.controls.totalbiayapengujian.setValue(
            totalbiayapengujian
        );

        let subtot =
            (await this.contractForm.value.totalbiayapengujian) -
            this.contractForm.value.discount_lepas +
            this.contractForm.value.biaya_sampling +
            this.contractForm.value.biaya_akg;

        await this.contractForm.patchValue({
            voucher: this.contractForm.value.voucher
                ? this.contractForm.value.voucher
                : null,
            subtotal: subtot,
            ppn: parseInt((subtot * 0.11).toFixed()),
        });
    }

    setDiscountLepas() {
        this.perhitungan();
    }

    copy(i) {
        this.copydata = this.copydata.concat(this.sampleForm.at(i).value);
    }

    paste(v) {
        if (v !== "all") {
            this.pasteValue(v);
        } else {
            for (let i = 0; i < this.sampleForm.length; i++) {
                this.pasteValue(i);
            }
        }
    }

    setDate(v) {
        let date = new Date(v);
        return `${date.getFullYear()}-${global.addzero(
            date.getMonth()
        )}-${global.addzero(date.getDate() + 1)}`;
    }

    pasteValue(v) {
        this.sampleForm.at(v).patchValue({
            kode_sample: this.copydata[0].kode_sample,
            tujuanpengujian: this.copydata[0].tujuanpengujian.toString(),
            sub_catalogue: this.copydata[0].sub_catalogue,
            tgl_input: _moment(this.copydata[0].tgl_input).format("YYYY-MM-DD"),
            tgl_kadaluarsa: this.copydata[0].tgl_kadaluarsa
                ? _moment(this.copydata[0].tgl_kadaluarsa).format("YYYY-MM-DD")
                : null,
            tgl_produksi: this.copydata[0].tgl_produksi
                ? _moment(this.copydata[0].tgl_produksi).format("YYYY-MM-DD")
                : null,
            tgl_selesai: _moment(this.copydata[0].tgl_selesai).format(
                "YYYY-MM-DD"
            ),
            nama_pabrik: this.copydata[0].nama_pabrik,
            alamat_pabrik: this.copydata[0].alamat_pabrik,
            nama_dagang: this.copydata[0].nama_dagang,
            lot_number: this.copydata[0].lot_number,
            jenis_kemasan: this.copydata[0].jenis_kemasan,
            batch_number: this.copydata[0].batch_number,
            no_notifikasi: this.copydata[0].no_notifikasi,
            no_pengajuan: this.copydata[0].no_pengajuan,
            no_registrasi: this.copydata[0].no_registrasi,
            no_principalcode: this.copydata[0].no_principalcode,
            certificate_info: this.copydata[0].certificate_info.toString(),
            keterangan_lain: this.copydata[0].keterangan_lain,
        });
    }

    async getDataCustomerAddress(v?) {
        await this._kontrakServ
            .getDataAddressCustomer(this.dataalamat)
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

    cancel() {
        this._route.navigateByUrl("analystpro/contract");
    }

    saveData() {
        global.swalyousure("Are you Sure ?").then((x) => {
            if (x.isConfirmed) {
                Swal.fire({
                    title: "Berikan Alasan untuk Edit Kontrakuji",
                    input: "text",
                    inputAttributes: {
                        autocapitalize: "off",
                    },
                    showCancelButton: true,
                    confirmButtonText: "Send",
                    showLoaderOnConfirm: true,
                    preConfirm: (desc) => {
                        return this._kontrakServ
                            .sendDescEditContract({
                                id_kontrakuji: this.idContract,
                                desc: desc,
                                status: "edit",
                            })
                            .then((x: any) => x)
                            .catch((error) => {
                                Swal.showValidationMessage(
                                    `Request failed: ${error}`
                                );
                            });
                    },
                    allowOutsideClick: () => !Swal.isLoading(),
                }).then((result) => {
                    if (result.isConfirmed) {
                        this._kontrakServ
                            .editData(
                                this.contractForm.value,
                                this.idContract,
                                this.deletedSample.map((x) => x.value)
                            )
                            .then(async (x) => {
                                await this._spinner.hide();
                                await global.swalsuccess(
                                    "success",
                                    "Data Saved !!"
                                );
                            })
                            .then(() =>
                                this._route.navigateByUrl("analystpro/contract")
                            )
                            .catch(async (e) => {
                                await this._spinner.hide();
                                await global.swalerror("Error in Database");
                            });
                    }
                });
            }
        });
    }
}
