import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerhandleService } from "app/main/analystpro/services/customerhandle/customerhandle.service";
import { CustomershandleModalComponent } from "app/main/analystpro/modal/customershandle-modal/customershandle-modal.component";
import { ContractcategoryService } from "app/main/analystpro/services/contractcategory/contractcategory.service";
import {
    MatBottomSheet,
    MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { ContractDetComponent } from "app/main/analystpro/contract/contract-det/contract-det.component";
import { MatDialog } from "@angular/material/dialog";
import { SamplingModalComponent } from "app/main/analystpro/modal/sampling-modal/sampling-modal.component";
import { ModalParameterComponent } from "app/main/analystpro/contract/modal-parameter/modal-parameter.component";
import { AkgModalComponent } from "app/main/analystpro/modal/akg-modal/akg-modal.component";
import { AddressCustomerComponent } from "app/main/analystpro/modal/address-customer/address-customer.component";
import * as global from "app/main/global";
import { ModalPhotoParameterComponent } from "app/main/analystpro/contract/modal-photo-parameter/modal-photo-parameter.component";
import { LoginService } from "app/main/login/login.service";
import { MessagingService } from "app/messaging.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ModalPhotoComponent } from "app/main/analystpro/modal/modal-photo/modal-photo.component";
import { PenawaranService } from "../penawaran.service";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    FormArray,
    Form,
} from "@angular/forms";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import { MatTable } from "@angular/material/table";
import * as _moment from "moment";
import { ModalVocComponent } from "app/main/analystpro/contract/modal-voc/modal-voc.component";
import { ModalAttachmentSeeComponent } from "app/main/analystpro/contract/modal-attachment-see/modal-attachment-see.component";
import { EmployeeService } from "app/main/hris/employee/employee.service";

@Component({
    selector: "app-penawaran-det",
    templateUrl: "./penawaran-det.component.html",
    styleUrls: ["./penawaran-det.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class PenawaranDetComponent implements OnInit {
    @ViewChild("table") MatTable: MatTable<any>;
    setAddParameter = true;
    no_penawaran;
    datasentpenawaran = {
        pages: 1,
        search: null,
        idsales: null,
    };

    //data static
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
    //end data static
    idphoto;
    btnTotalpembayaran = true;
    idPenawaran;
    contractSet = [
        {
            id: 1,
            value: "Government",
        },
        {
            id: 2,
            value: "Non Government",
        },
    ];
    custname;
    mouStatusPengujian = [];
    mouDiskon = [];
    statusPhoto;
    dataSave;
    test = false;
    displayedColumns: string[] = ["no", "samplename", "action"];
    nonpaketparameter: FormArray = this._formBuilder.array([]);
    paketPkm: FormArray = this._formBuilder.array([]);
    paketparameter: FormArray = this._formBuilder.array([]);
    parameterForm: FormArray = this._formBuilder.array([]);
    dataakgpick: FormArray = this._formBuilder.array([]);
    datasamplingpick: FormArray = this._formBuilder.array([]);
    sampleForm: FormArray = this._formBuilder.array([
        // this.setSampleFormValue(),
    ]);
    fotoForm: FormArray = this._formBuilder.array([
        this._formBuilder.group({
            id: new FormControl(0),
            photo: new FormControl(null),
            type: new FormControl(),
            name: new FormControl(),
        }),
    ]);
    mouspecial = true;
    contractForm: FormGroup;
    datacustomerhandle = [];
    copydata = [];
    samplingdata = [];
    akgdata = [];
    //ngselect

    contract_category = [];
    customerhandle = [];
    mine = [];
    alamatcustomer = [];
    dataalamat = {
        pages: 1,
        search: null,
        id_customer: null,
    };
    datasendContractCategory = {
        pages: 1,
        search: null,
    };
    datasendCustomerHandle = {
        pages: 1,
        search: null,
    };
    sampleforphoto = [];
    contractno;
    dataemployee = [];

    datasend = {
        pages: 1,
        search: null,
        level: null,
        division: 6,
        employeestatus: null,
    };

    //end ngselect
    vouchertype = [];

    format = {
        metode: false,
        lod: false,
        loq: false,
        satuan: false,
        ppn: true,
        pph: false,
        dp: false,
    };

    datapenawaran = [];

    constructor(
        private _kontrakServ: ContractService,
        private _custHandleServ: CustomerhandleService,
        private _contractCatServ: ContractcategoryService,
        private _formBuilder: FormBuilder,
        private _route: Router,
        private _actRoute: ActivatedRoute,
        private dialog: MatDialog,
        private _matbottomsheet: MatBottomSheet,
        private spinner: NgxSpinnerService,
        private _employeeServ: EmployeeService,
        private _loginServ: LoginService,
        private _penawaranServ: PenawaranService,
        private pdfServ: PdfService
    ) {
        this.idPenawaran = this._actRoute.snapshot.params["id"];
    }

    ngOnInit(): void {
        this.spinner.show();
        this.checkme();
        this.getDataContractCategory();
        this.getDatacustomerhandle();
        this.getDataEmployee();
        this.contractForm = this.createForm();
        setTimeout(() => {
            if (this.idPenawaran === "add") {
                // this.setDataAdd();
                this.contractForm.controls.typeContract.setValue(
                    this.mine.length > 0
                        ? this.mine[0].id_bagian == 13
                            ? 4
                            : null
                        : null
                );
                // this.contractForm.controls.typeContract.disable();
                this.test = true;
            } else {
                this.setDataEditIdPenawaran(this.idPenawaran);
                this.test = false;
            }
        }, 2000);
        setTimeout(() => {
            this.spinner.hide();
        }, 3000);
    }

    getDataPenawaran() {
        this._penawaranServ
            .getDataPenawaranContract(this.datasentpenawaran)
            .then((x: any) => {
                x.data.forEach((p) => {
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

    async checkme() {
        await this._loginServ.checking_me().then((x) => {
            this.mine = this.mine.concat(x);
            this.datasentpenawaran.idsales = x[0].employee_id;
        });
        await this.getDataPenawaran();
    }

    showOptions(ev) {
        console.log(this.format.pph);
        this.perhitungan();
    }

    getDataEmployee() {
        this._employeeServ
            .getDataSales(this.datasend)
            .then((e: any) => {
                this.dataemployee = this.dataemployee.concat(e);
            })
            .then(() => {
                this.dataemployee = global.uniq(
                    this.dataemployee,
                    (it) => it.user_id
                );
            });
    }

    addfoto() {
        this.fotoForm.push(
            this._formBuilder.group({
                id: this.fotoForm.length + 1,
                photo: null,
                type: "",
                name: "",
            })
        );
    }

    setDataAdd() {
        console.log("add");
    }

    setSampleFormValueDit(v) {
        return this._formBuilder.group({
            samplename: [v.samplename],
            hargakenadiskon: [v.hargakenadiskon],
            parameter: this._formBuilder.group({
                valuesstatuspengujian:
                    this.mouStatusPengujian.length > 0
                        ? this.mouStatusPengujian.filter(
                              (r) =>
                                  r.id_status_pengujian ==
                                  v.parameter.statuspengujian
                          )[0].values
                        : v.parameter.statuspengujian,
                discountsample: [
                    v.parameter.discountsample ? v.parameter.discountsample : 0,
                ],
                nonpaketparameter: v.parameter.nonpaketparameter,
                paketPKM: v.parameter.paketPkm,
                paketparameter: v.parameter.paketparameter,
                price: v.price,
                statuspengujian: [v.parameter.statuspengujian],
                tujuanpengujian: [v.parameter.tujuanpengujian],
            }),
        });
    }

    setDataEditIdPenawaran(d) {
        this._penawaranServ.setPenawaran(d).then((z: any) => {
            let v = z[0];
            this.no_penawaran = v.no_penawaran;
            this.customerhandle = this.customerhandle.concat({
                customer_name: v.customer_handle.customers.customer_name,
                email: v.customer_handle.email,
                fax: v.customer_handle.fax,
                id_cp: v.customer_handle.id_cp,
                id_customer: v.customer_handle.id_customer,
                idch: v.customer_handle.idch,
                kode_customer: v.customer_handle.customers.kode_customer,
                name: v.customer_handle.contact_person.name,
                phonenumber: v.customer_handle.phone,
                telpnumber: v.customer_handle.telp,
            });
            this.setFormEdit(v);
            this.sampleForm.controls = [];
            for (let i = 0; i < v["sample"].length; i++) {
                this.sampleForm.push(
                    this.setSampleFormValueDit(v["sample"][i])
                );
                this.sampleForm
                    .at(i)
                    ["controls"].parameter.setControl(
                        "nonpaketparameter",
                        this._formBuilder.array(
                            v["sample"][i].parameter.nonpaketparameter || []
                        )
                    );
                this.sampleForm
                    .at(i)
                    ["controls"].parameter.setControl(
                        "paketparameter",
                        this._formBuilder.array(
                            v["sample"][i].parameter.paketparameter || []
                        )
                    );
                this.sampleForm
                    .at(i)
                    ["controls"].parameter.setControl(
                        "paketPKM",
                        this._formBuilder.array(
                            v["sample"][i].parameter.paketPKM || []
                        )
                    );
            }

            if (v.sampling_trans.length > 0) {
                let datasam = [];
                v.sampling_trans.forEach((avx) => {
                    datasam = datasam.concat({
                        desc: avx.desc,
                        id_sampling: avx.id_mstr_transaction_sampling,
                        jumlah: avx.jumlah,
                        price: avx.samplingmaster.price,
                        total: avx.total,
                        employee: avx.pic,
                        kondisi: avx.kondisi,
                        lokasi: avx.lokasi,
                        metode: avx.metode,
                        sampling_name: avx.samplingmaster.sampling_name,
                    });
                });

                this.contractForm.setControl(
                    "datasampling",
                    this._formBuilder.array(datasam || [])
                );
                this.contractForm.controls.biayasample.setValue(
                    datasam.map((acc) => acc.total).reduce((u, b) => u + b)
                );
            }
            this.setAddParameter = false;
        });

        // .then(() => console.log(this.contractForm.value))
        // .then(() => ());
    }

    async setDataEdit(v) {
        this.no_penawaran = await v.no_penawaran;
        this.customerhandle = await this.customerhandle.concat({
            customer_name: v.customer_handle.customers.customer_name,
            email: v.customer_handle.email,
            fax: v.customer_handle.fax,
            id_cp: v.customer_handle.id_cp,
            id_customer: v.customer_handle.id_customer,
            idch: v.customer_handle.idch,
            kode_customer: v.customer_handle.customers.kode_customer,
            name: v.customer_handle.contact_person.name,
            phonenumber: v.customer_handle.phone,
            telpnumber: v.customer_handle.telp,
        });
        await this.setFormEdit(v);
        this.sampleForm.controls = await [];
        for (let i = 0; i < v["sample"].length; i++) {
            await this.sampleForm.push(
                this.setSampleFormValueDit(v["sample"][i])
            );
            await this.sampleForm
                .at(i)
                ["controls"].parameter.setControl(
                    "nonpaketparameter",
                    this._formBuilder.array(
                        v["sample"][i].parameter.nonpaketparameter || []
                    )
                );
            await this.sampleForm
                .at(i)
                ["controls"].parameter.setControl(
                    "paketparameter",
                    this._formBuilder.array(
                        v["sample"][i].parameter.paketparameter || []
                    )
                );
            await this.sampleForm
                .at(i)
                ["controls"].parameter.setControl(
                    "paketPKM",
                    this._formBuilder.array(
                        v["sample"][i].parameter.paketPKM || []
                    )
                );
        }

        if (v.sampling_trans.length > 0) {
            let datasam = await [];
            await v.sampling_trans.forEach((avx) => {
                datasam = datasam.concat({
                    desc: avx.desc,
                    id_sampling: avx.id_mstr_transaction_sampling,
                    jumlah: avx.jumlah,
                    price: avx.samplingmaster.price,
                    total: avx.total,
                    employee: avx.pic,
                    kondisi: avx.kondisi,
                    lokasi: avx.lokasi,
                    metode: avx.metode,
                    sampling_name: avx.samplingmaster.sampling_name,
                });
            });

            await this.contractForm.setControl(
                "datasampling",
                this._formBuilder.array(datasam || [])
            );
            await this.contractForm.controls.biayasample.setValue(
                datasam.map((acc) => acc.total).reduce((u, b) => u + b)
            );
        }
        this.setAddParameter = await false;

        // .then(() => console.log(this.contractForm.value))
        // .then(() => ());
    }

    async gotoModalVoc() {
        const dialogRef = await this.dialog.open(ModalVocComponent, {
            height: "auto",
            width: "500px",
            panelClass: "parameter-modal",
            data: {
                idvoc: this.contractForm.controls.voucher.value,
            },
        });

        await dialogRef.afterClosed().subscribe(async (result) => {
            this.vouchertype = await [];
            this.vouchertype = await this.vouchertype.concat(result.value);
            await this.contractForm.controls.id_voucher.setValue(
                result.value[0].id
            );
            await this.perhitungan();
        });
    }

    remove(v) {
        this.vouchertype = [];
        this.perhitungan();
    }

    async setFormEdit(x) {
        this.dataalamat.id_customer = await x.customer_handle.id_customer;
        // await this.getDataCustomerAddress();

        await this.contractForm.patchValue({
            contract_category: x["contract_category"],
            customerhandle: x.customer_handle.idch,
            clienthandling: x["clienthandling"],
            desc_internal: x["internal_notes"],
            jumlahsample: x["jumlahsample"],
            totalpembayaran: x.payment.totalpembayaran,
            biayasample:
                x.sampling_trans.length > 0
                    ? x.sampling_trans
                          .map((o) => o.total)
                          .reduce((u, c) => u + c)
                    : 0,
            discount: x.payment.discountconv > 0 ? x.payment.discountconv : 0,
            hasilDiscount: x.payment.hargadiscount,
            ppn: x.payment.ppn,
            uangmuka: x.payment.dp,
            sisapembayaran:
                (x.payment.totalpembayaran -
                    x.payment.hargadiscount +
                    x.sampling_trans.length >
                0
                    ? x.sampling_trans.total
                    : 0) +
                x.payment.ppn -
                x.payment.dp,
        });
        await this.perhitungan();
    }

    async getMou(ev) {
        this.mouStatusPengujian = await [];
        this.mouDiskon = await [];
        this.mouspecial = await true;

        await this._kontrakServ
            .getDataMou(this.dataalamat.id_customer)
            .then((p: any) => {
                if (p.status) {
                    if (p["message"] === "Data Mou Found") {
                        global.swalsuccess(`${p["message"]}`, "success");
                        this.mouStatusPengujian = p["data"][0]["detail"].filter(
                            (x) => x.condition == 1
                        );

                        this.mouDiskon = p["data"][0]["detail"].filter(
                            (x) => x.condition == 2
                        );

                        if (this.mouDiskon.length > 0) {
                            this.contractForm.controls.discount.setValue(
                                this.mouDiskon[0].discount
                            );
                            this.setHasilDiscount(2);
                        }

                        this.mouspecial =
                            p["data"][0]["detail"].filter(
                                (x) => x.condition == 3
                            ).length > 0
                                ? false
                                : true;
                        this.perhitungan();
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
                            global.swalmou(html).then((x) => console.log(x));
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
                            global.swalmou(html).then((x) => console.log(x));
                        }
                    } else {
                        global.swalwarning(p["message"], "");
                    }
                } else {
                    return;
                }
            });
        await setTimeout(async () => {
            this.setAddParameter = await false;
            await this.getDataCustomerAddress();
            await this.openbottomsheet(ev);
        }, 1000);
    }

    createForm(): FormGroup {
        return this._formBuilder.group({
            contract_category: new FormControl(null),
            no_penawaran: new FormControl(null),
            no_po: new FormControl(null),
            typeContract: new FormControl(null),
            customerhandle: new FormControl(null),
            alamatcustomer: new FormControl(null),
            desc_internal: new FormControl(
                `* Dilampirkan surat penawaran ini saat pengiriman sampel pengujian*\n\n** Untuk estimasi lama pengujian adalah 8 - 10 hari untuk regular ( dihitung berdasarkan hari kerja )**\n\nSampel yang dibutuhkan minimal 300gr atau ml per samplenya`
            ),
            desc: new FormControl(null),
            foto: this.fotoForm,
            jumlahsample: new FormControl(0),
            sample: this.sampleForm,
            clienthandling: new FormControl(null),
            dataakg: this.dataakgpick,
            datasampling: this.datasamplingpick,
            totalpembayaran: new FormControl({
                value: null,
                disabled: this.mouspecial,
            }),
            biayasample: new FormControl({
                value: 0,
                disabled: true,
            }),
            biayaakg: new FormControl({
                value: 0,
                disabled: true,
            }),
            contracttypegovernment: new FormControl(),
            discount: new FormControl({
                value: 0,
                disabled:
                    this.mouDiskon.length > 0 ||
                    this.mouStatusPengujian.length > 0
                        ? true
                        : false,
            }),
            hasilDiscount: new FormControl({
                value: 0,
                disabled:
                    this.mouDiskon.length > 0 ||
                    this.mouStatusPengujian.length > 0
                        ? true
                        : false,
            }),
            ppn: new FormControl({
                value: 0,
                disabled: true,
            }),
            pph: new FormControl({
                value: 0,
                disabled: true,
            }),
            totaltanpappn: new FormControl({
                value: 0,
                disabled: true,
            }),
            subtotal: new FormControl({
                value: 0,
                disabled: true,
            }),
            uangmuka: new FormControl({
                value: 0,
                disabled: true,
            }),
            voucher: new FormControl(0),
            id_voucher: new FormControl(),
            lampiran: new FormControl(),
            sisapembayaran: new FormControl({
                value: 0,
                disabled: true,
            }),
        });
    }

    backback() {
        this._route.navigateByUrl("analystpro/penawaran");
    }

    async openModalPhoto(v) {
        console.log(this.sampleforphoto);
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

    async perhitungan() {
        let form = await this.contractForm.controls;
        let disc = (await form.hasilDiscount.value)
            ? form.hasilDiscount.value
            : 0;
        let b =
            (await form.totalpembayaran.value) -
            disc +
            (form.biayaakg.value ? form.biayaakg.value : 0) +
            (form.biayasample.value ? form.biayasample.value : 0);

        await form.ppn.setValue(this.format.ppn ? (11 / 100) * b : 0);
        let a = (await b) + form.ppn.value;
        await form.pph.setValue(this.format.pph ? b * (2 / 100) : 0);
        await form.subtotal.setValue(a - form.pph.value);

        let subtotal = (await form.subtotal.value) ? form.subtotal.value : 0;
        let uangmuka = (await form.uangmuka.value) ? form.uangmuka.value : 0;
        form.totaltanpappn.setValue(b);

        let sisapembayaran = parseInt((subtotal - uangmuka).toFixed());
        let voucherset = await 0;
        if (this.vouchertype.length > 0) {
            voucherset =
                (await this.vouchertype[0].status) == 1
                    ? this.vouchertype[0].price
                    : (this.vouchertype[0].discount / 100) * sisapembayaran;
        } else {
            voucherset = 0;
        }

        await form.voucher.setValue(voucherset);

        await form.sisapembayaran.setValue(sisapembayaran - voucherset);
    }

    enableForm() {
        this.contractForm.controls.totalpembayaran.enable();
        this.contractForm.controls.biayasample.enable();
        this.contractForm.controls.biayaakg.enable();
        this.contractForm.controls.ppn.enable();
        this.contractForm.controls.uangmuka.enable();
        this.contractForm.controls.subtotal.enable();
        this.contractForm.controls.sisapembayaran.enable();
        this.contractForm.controls.discount.enable();
        this.contractForm.controls.hasilDiscount.enable();
    }

    savedata(v) {
        switch (v) {
            case "add":
                if (
                    this.contractForm.controls.contract_category.value &&
                    this.contractForm.controls.customerhandle.value &&
                    this.sampleForm.controls.filter((x) => !x.value.samplename)
                        .length < 1 &&
                    this.contractForm.controls.clienthandling.value
                ) {
                    global.swalyousure("Are you sure?").then((res) => {
                        if (res.isConfirmed) {
                            this.enableForm();
                            this.addingPenawaran();
                        }
                    });
                } else {
                    global.swalwarning(
                        "Data Belum Lengkap",
                        `Mohon Lengkapi Data !`
                    );
                }
                break;
            case "preview":
                if (
                    this.contractForm.controls.contract_category.value &&
                    this.contractForm.controls.customerhandle.value &&
                    this.sampleForm.controls.filter((x) => !x.value.samplename)
                        .length < 1 &&
                    this.contractForm.controls.clienthandling.value
                ) {
                    this.enableForm();
                    this._penawaranServ.previewPenawaran(
                        this.contractForm.value,
                        this.format
                    );
                } else {
                    global.swalwarning(
                        "Data Belum Lengkap",
                        `Mohon Lengkapi Data !`
                    );
                }

                break;
        }
    }

    addingPenawaran() {
        setTimeout(() => {
            this._penawaranServ
                .PenawaranAdd({
                    data: this.contractForm.value,
                    format: this.format,
                    st: this.idPenawaran,
                })
                .then(async (g) => {
                    await this.spinner.hide();
                    if (g["status"]) {
                        await global.swalsuccess(
                            "Saving Success",
                            `${g["nopenawaran"]}`
                        );
                        await this._route.navigateByUrl("analystpro/penawaran");
                    } else {
                        await global.swalerror(
                            "Gagal Simpan Data, Harap Hubungi IT"
                        );
                    }
                });
        }, 3000);
    }

    async sisapembayaranhitung() {
        let form = this.contractForm.controls;
        let a =
            (await form.subtotal.value) - form.pph.value - form.uangmuka.value;
        form.sisapembayaran.setValue(a);
    }

    setSampleFormValue() {
        return this._formBuilder.group({
            samplename: new FormControl(),
            desc: new FormControl(),
            hargakenadiskon: new FormControl(),
            parameter: this._formBuilder.group({
                batchno: new FormControl(),
                valuesstatuspengujian: new FormControl(),
                certificate_info: new FormControl(),
                discount_nonpacket: new FormControl(),
                discount_paket: new FormControl(),
                discountsample: new FormControl(),
                factory_address: new FormControl(),
                factoryname: new FormControl(),
                formathasil: new FormControl(),
                jeniskemasan: new FormControl(),
                ket_lain: new FormControl(),
                kodesample: new FormControl(),
                lotno: new FormControl(),
                no_notifikasi: new FormControl(),
                no_pengajuan: new FormControl(),
                no_principalCode: new FormControl(),
                no_registrasi: new FormControl(),
                nonpaketparameter: this.nonpaketparameter,
                paketPKM: this.paketPkm,
                paketPkm: new FormControl(),
                paketparameter: this.paketparameter,
                paketparametername: new FormControl(),
                parameteruji: new FormControl(),
                price: new FormControl(),
                statuspengujian: new FormControl(),
                subcatalogue: new FormControl(),
                tgl_input: new FormControl(),
                tgl_kadaluarsa: new FormControl(),
                tgl_produksi: new FormControl(),
                tgl_selesai: new FormControl(),
                totalpricesample: new FormControl(),
                trademark: new FormControl(),
                tujuanpengujian: new FormControl(),
                status: new FormControl("new"),
            }),
        });
    }

    tambah() {
        // console.log(this.contractForm);
        this.contractForm.controls.jumlahsample.setValue(
            this.sampleForm.controls.length + 1
        );
        this.sampleForm.push(this.setSampleFormValue());
        this.MatTable.renderRows();
    }

    kurang() {
        this.contractForm.controls.jumlahsample.setValue(
            this.sampleForm.controls.length - 1
        );
        this.sampleForm.removeAt(this.sampleForm.controls.length - 1);
        this.MatTable.renderRows();
    }

    async copythis(e, i) {
        this.copydata = await [];
        this.copydata = await this.copydata.concat(e.value);
    }

    async pastethis(e, i) {
        await this.sampleForm
            .at(i)
            ["controls"].samplename.setValue(this.copydata[0].samplename);
        await this.sampleForm
            .at(i)
            ["controls"].hargakenadiskon.setValue(
                this.copydata[0].hargakenadiskon
            );
        await this.setFormSample(this.copydata[0].parameter, i);
        let totaldiscount = this.sampleForm.controls
            .map((d) => d.value["parameter"].discountsample)
            .reduce((z, x) => z + x);
        if (totaldiscount > 0) {
            await this.contractForm.controls.hasilDiscount.setValue(
                totaldiscount
            );
        }
        await this.setHasilDiscount(2);

        this.MatTable.renderRows();
    }

    async pasteall() {
        for (let i = 0; i < this.sampleForm.value.length; i++) {
            await this.sampleForm
                .at(i)
                ["controls"].samplename.setValue(this.copydata[0].samplename);
            await this.setFormSample(this.copydata[0].parameter, i);
            let totaldiscount = await this.sampleForm.controls
                .map((d) => d.value["parameter"].discountsample)
                .reduce((z, x) => z + x);
            await this.sampleForm
                .at(i)
                ["controls"].hargakenadiskon.setValue(
                    this.copydata[0].hargakenadiskon
                );
            if (totaldiscount > 0) {
                await this.contractForm.controls.hasilDiscount.setValue(
                    totaldiscount
                );
            }
            await this.contractForm.controls.hasilDiscount.setValue(
                totaldiscount
            );
            await this.setHasilDiscount(2);
        }
        this.MatTable.renderRows();
    }

    deleteRow(i) {
        global.swalyousure("it will delete sample").then((x) => {
            if (x.isConfirmed) {
                this.contractForm.controls.jumlahsample.setValue(
                    this.sampleForm.controls.length - 1
                );
                this.sampleForm.removeAt(i);
                this.MatTable.renderRows();
                this.contractForm.controls.totalpembayaran.setValue(
                    this.sampleForm.controls
                        .map((a) => a.value.parameter.price)
                        .reduce((k, l) => k + l)
                );
                this.perhitungan();
            }
        });
    }

    async openModalParameter(e, i) {
        if (this.contractForm.controls.customerhandle.value) {
            const dialogRef = await this.dialog.open(ModalParameterComponent, {
                height: "auto",
                width: "1080px",
                panelClass: "parameter-modal",
                disableClose: true,
                data: {
                    sampleForm: this.sampleForm.controls[i].value,
                    mouData:
                        this.mouStatusPengujian.length > 0
                            ? this.mouStatusPengujian
                            : [],
                    status: this.idPenawaran == "add" ? "tambah" : "edit",
                    st: "penawaran",
                },
            });
            await dialogRef.afterClosed().subscribe(async (result) => {
                await this.sampleForm
                    .at(i)
                    ["controls"].hargakenadiskon.setValue(result.d);
                await this.setFormSample(result.c, i);
                let totaldiscount = await this.sampleForm.controls
                    .map((d) => d.value["parameter"].discountsample)
                    .reduce((z, x) => z + x);
                if (totaldiscount > 0) {
                    await this.contractForm.controls.hasilDiscount.setValue(
                        totaldiscount
                    );
                    await this.perhitungan();
                } else {
                    this.setHasilDiscount(2);
                }
            });
        } else {
            global.swalerror("Harap isi customer terlebih dahulu");
        }
    }

    async gotosampling() {
        await console.log(this.contractForm.controls.datasampling.value);
        let dialogCust = await this.dialog.open(SamplingModalComponent, {
            height: "auto",
            width: "800px",
            data:
                this.contractForm.controls.biayasample.value > 0
                    ? this.contractForm.controls.datasampling.value
                    : null,
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.contractForm.controls.biayasample.setValue(result.b);
            if (result.a.length > 0) {
                let data = [];
                result.a.forEach((v) => {
                    data = data.concat({
                        desc: v.desc,
                        id_sampling: v.id_sampling,
                        jumlah: v.jumlah,
                        price: v.price,
                        sampling_name: v.sampling_name,
                        total: v.total,
                        employee: result.c.employee,
                        kondisi: result.c.kondisi,
                        lokasi: result.c.lokasi,
                        metode: result.c.metode,
                    });
                });
                this.contractForm.setControl(
                    "datasampling",
                    this._formBuilder.array(data || [])
                );
                this.perhitungan();
            } else {
                this.perhitungan();
            }
        });
    }

    async gotoakg() {
        let dialogCust = await this.dialog.open(AkgModalComponent, {
            height: "auto",
            width: "800px",
            data:
                this.contractForm.controls.biayaakg.value > 0
                    ? this.contractForm.controls.dataakg.value
                    : null,
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.contractForm.setControl(
                "dataakg",
                this._formBuilder.array(result.a || [])
            );
            this.contractForm.controls.biayaakg.setValue(result.b);
            this.perhitungan();
        });
    }

    async setFormSample(val, i) {
        if (val.samplename) {
            await this.sampleForm
                .at(i)
                ["controls"].samplename.setValue(val.samplename);
        }
        await this.sampleForm
            .at(i)
            ["controls"].parameter.setControl(
                "nonpaketparameter",
                this._formBuilder.array(val.nonpaketparameter || [])
            );
        await this.sampleForm
            .at(i)
            ["controls"].parameter.setControl(
                "paketparameter",
                this._formBuilder.array(val.paketparameter || [])
            );
        await this.sampleForm
            .at(i)
            ["controls"].parameter.setControl(
                "paketPKM",
                this._formBuilder.array(val.paketPKM || [])
            );
        await this.sampleForm.at(i)["controls"].parameter.patchValue({
            batchno: val.batchno,
            valuesstatuspengujian: val.valuesstatuspengujian,
            certificate_info: val.certificate_info,
            discount_nonpacket: val.discount_nonpacket,
            discount_paket: val.discount_paket,
            discountsample: val.discountsample,
            factory_address: val.factory_address,
            factoryname: val.factoryname,
            formathasil: val.formathasil,
            jeniskemasan: val.jeniskemasan,
            ket_lain: val.ket_lain,
            kodesample: val.kodesample,
            lotno: val.lotno,
            no_notifikasi: val.no_notifikasi,
            no_pengajuan: val.no_pengajuan,
            no_principalCode: val.no_principalCode,
            no_registrasi: val.no_registrasi,
            paketPkm: val.paketPkm,
            paketparametername: val.paketparametername,
            parameteruji: val.parameteruji,
            price: val.price,
            statuspengujian: val.statuspengujian,
            subcatalogue: val.subcatalogue,
            tgl_input: val.tgl_input,
            tgl_kadaluarsa: val.tgl_kadaluarsa,
            tgl_produksi: val.tgl_produksi,
            tgl_selesai: val.tgl_selesai,
            totalpricesample: val.totalpricesample,
            trademark: val.trademark,
            tujuanpengujian: val.tujuanpengujian,
        });
        let g = await this.sampleForm.controls
            .map((x) => x.value["parameter"].price)
            .reduce((a, b) => a + b);

        // console.log(totaldiscount);
        await this.contractForm.controls.totalpembayaran.setValue(g);
        await this.setHasilDiscount(2);
    }

    changeval(ev) {
        this.contractForm.controls.jumlahsample.disable();
        for (
            let i = 0;
            i < this.contractForm.controls.jumlahsample.value;
            i++
        ) {
            this.sampleForm.push(this.setSampleFormValue());
        }
        this.MatTable.renderRows();
    }

    _uploadGambar($event, id): void {
        const dialogRef = this.dialog.open(ModalPhotoComponent, {});
        dialogRef.afterClosed().subscribe((result) => {
            if (result.c.length > 0) {
                this.fotoForm.at(id)["controls"].photo.setValue(result.c[0]);
                this.fotoForm.at(id)["controls"].type.setValue("webcam");
                this.fotoForm
                    .at(id)
                    ["controls"].name.setValue("attachment_" + id);
            }
        });
    }

    openfoto(v) {
        let dialogCust = this.dialog.open(ModalAttachmentSeeComponent, {
            height: "auto",
            width: "500px",
            data: v,
        });
        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    readThis(inputValue: any, index): void {
        var file: File = inputValue.files[0];

        var myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            this.fotoForm.at(index)["controls"].photo.setValue(myReader.result);
            this.fotoForm.at(index)["controls"].type.setValue("file");
            this.fotoForm.at(index)["controls"].name.setValue(file.name);
        };
        myReader.readAsDataURL(file);
    }

    uploadFile($event, id) {
        console.log($event.target.files[0]);
        this.readThis($event.target, id);
    }

    openbottomsheet(ev) {
        this._matbottomsheet.open(ContractDetComponent, {
            data: this.datacustomerhandle,
        });
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

    async modaladdresscustomer() {
        let dialogCust = await this.dialog.open(AddressCustomerComponent, {
            height: "auto",
            width: "600px",
            data: {
                id_customer: this.dataalamat.id_customer,
                cust_name: this.custname,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.alamatcustomer = [];
            this.getDataCustomerAddress();
        });
    }

    async setHasilDiscount(value) {
        let yangbolehkenadisc = this.sampleForm.value
            .map((a) =>
                a.hargakenadiskon
            )
            .reduce((a, b) => a + b);

        this.contractForm.controls.hasilDiscount.setValue(
            (this.contractForm.value.discount / 100) * yangbolehkenadisc
        );

        this.perhitungan();
    }

    setDiscount(value) {
        this.perhitungan();
    }

    setsisapembayaran(value) {
        this.perhitungan();
    }

    onScrollToEnd(e) {
        switch (e) {
            case "customer":
                this.datasendCustomerHandle.pages =
                    this.datasendCustomerHandle.pages + 1;
                this.getDatacustomerhandle();
                break;
            case "employee":
                this.datasend.pages = this.datasend.pages + 1;
                this.getDataEmployee();
                break;
            case "penawaran":
                this.datasentpenawaran.pages = this.datasentpenawaran.pages + 1;
                this.getDataPenawaran();
                break;
        }
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
            case "penawaran":
                this.datasentpenawaran.pages = 1;
                this.datasentpenawaran.search = ev.term;
                this.datapenawaran = [];
                this.getDataPenawaran();
                break;
        }
    }

    reset() {
        this.customerhandle = [];
        this.getDatacustomerhandle();
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

    async getValue(ev, status) {
        switch (status) {
            case "contractcategory":
                await console.log("contract category");
                break;
            case "typecontract":
                await console.log("type contract");
                break;
            case "customer":
                this.datacustomerhandle = await [];
                this.dataalamat.id_customer = await ev.id_customer;
                this.custname = await ev.customer_name;
                await this._custHandleServ.getDataDetail(ev.idch).then((x) => {
                    this.datacustomerhandle = this.datacustomerhandle.concat(x);
                });
                this.alamatcustomer = await [];
                this.setAddParameter = await false;
                await this.getMou(ev);
                break;
            case "alamat":
                await console.log("alamat");
                break;
            case "penawaran":
                console.log(ev);
                this._penawaranServ
                    .setPenawaran(ev.id)
                    .then((x) => this.setDataEdit(x[0]));
                break;
        }
    }
}
