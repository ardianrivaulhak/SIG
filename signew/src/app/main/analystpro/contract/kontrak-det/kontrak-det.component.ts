import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ContractService } from "../../services/contract/contract.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerhandleService } from "../../services/customerhandle/customerhandle.service";
import { CustomershandleModalComponent } from "../../modal/customershandle-modal/customershandle-modal.component";
import { ContractcategoryService } from "../../services/contractcategory/contractcategory.service";
import {
    MatBottomSheet,
    MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { ContractDetComponent } from "../contract-det/contract-det.component";
import { MatDialog } from "@angular/material/dialog";
import { SamplingModalComponent } from "../../modal/sampling-modal/sampling-modal.component";
import { ModalParameterComponent } from "../modal-parameter/modal-parameter.component";
import { AkgModalComponent } from "../../modal/akg-modal/akg-modal.component";
import { AddressCustomerComponent } from "../../modal/address-customer/address-customer.component";
import * as global from "app/main/global";
import { ModalPhotoParameterComponent } from "../modal-photo-parameter/modal-photo-parameter.component";
import { LoginService } from "app/main/login/login.service";
import { MessagingService } from "app/messaging.service";
import { NgxSpinnerService } from "ngx-spinner";
import { PenawaranService } from "app/main/analystpro/penawaran/penawaran.service";
import { ModalPhotoComponent } from "../../modal/modal-photo/modal-photo.component";
import { ModalNpwpKtpComponent } from "../modal-npwp-ktp/modal-npwp-ktp.component";
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
import { ModalVocComponent } from "../modal-voc/modal-voc.component";
import { ModalAttachmentSeeComponent } from "../modal-attachment-see/modal-attachment-see.component";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
@Component({
    selector: "app-kontrak-det",
    templateUrl: "./kontrak-det.component.html",
    styleUrls: ["./kontrak-det.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class KontrakDetComponent implements OnInit {
    @ViewChild("table") MatTable: MatTable<any>;
    setAddParameter = true;
    //data static
    datasentpenawaran = {
        pages: 1,
        search: null,
        idcust: null,
    };
    showsurabaya = false;
    datapenawaran = [];

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
    idContrack;
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
        this.setSampleFormValue(),
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

    diskonboleh = true;

    constructor(
        private _kontrakServ: ContractService,
        private _custHandleServ: CustomerhandleService,
        private _contractCatServ: ContractcategoryService,
        private _formBuilder: FormBuilder,
        private _route: Router,
        private _custService: CustomerService,
        private _actRoute: ActivatedRoute,
        private dialog: MatDialog,
        private pdfServ: PdfService,
        private _matbottomsheet: MatBottomSheet,
        private spinner: NgxSpinnerService,
        private _messagingServ: MessagingService,
        private _employeeServ: EmployeeService,
        private _loginServ: LoginService,
        private _penawaranServ: PenawaranService
    ) {
        this.idContrack = this._actRoute.snapshot.params["id"];
    }

    ngOnInit(): void {
        this.spinner.show();
        this.checkme();
        this.getDataContractCategory();
        this.getDatacustomerhandle();
        this.getDataEmployee();

        this.contractForm = this.createForm();
        setTimeout(() => {
            if (this.idContrack === "add") {
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
                this.setDataEdit();
                this.test = false;
            }
            this.spinner.hide();
        }, 2000);
    }

    checkme() {
        this._loginServ
            .checking_me()
            .then((x) => (this.mine = this.mine.concat(x)));
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

    setPpn(ev) {
        this.contractForm.controls.ppn.setValue(
            ev ? this.contractForm.controls.ppn.value : 0
        );
        this.perhitungan("noppn");
    }

    setSampleFormValueDit(v) {
        return this._formBuilder.group({
            samplename: [v.sample_name],
            parameter: this._formBuilder.group({
                batchno: [v.batch_number],
                valuesstatuspengujian: new FormControl(),
                certificate_info: [v.certificate_info],
                discount_nonpacket: new FormControl(),
                discount_paket: new FormControl(),
                factory_address: [v.alamat_pabrik],
                factoryname: [v.nama_pabrik],
                formathasil: new FormControl(),
                jeniskemasan: [v.jenis_kemasan],
                ket_lain: [v.keterangan_lain],
                kodesample: [v.kode_sample],
                lotno: [v.lot_number],
                no_notifikasi: [v.no_notifikasi],
                no_pengajuan: [v.no_pengajuan],
                no_principalCode: [v.no_principalcode],
                no_registrasi: [v.no_registrasi],
                nonpaketparameter: this.nonpaketparameter,
                paketPKM: this.paketPkm,
                paketPkm: new FormControl(),
                paketparameter: this.paketparameter,
                paketparametername: new FormControl(),
                parameteruji: new FormControl(),
                price: new FormControl(),
                statuspengujian: [v.id_statuspengujian],
                subcatalogue: [v.id_subcatalogue],
                tgl_input: [
                    v.tgl_input
                        ? v.tgl_input.split(" ")[0]
                        : _moment(new Date()).format("YYYY-MM-DD"),
                ],
                tgl_kadaluarsa: [v.tgl_kadaluarsa],
                tgl_produksi: [v.tgl_kadaluarsa],
                tgl_selesai: [
                    v.tgl_selesai ? v.tgl_selesai.split(" ")[0] : null,
                ],
                totalpricesample: [v.price],
                trademark: [v.nama_dagang],
                tujuanpengujian: [v.id_tujuanpengujian],
            }),
        });
    }

    setDataEdit() {
        this._kontrakServ
            .getDataDetailKontrak(this.idContrack)
            .then((x) => {
                this.setFormEdit(x);
                return x;
            })
            .then((x) => {
                this.sampleForm.controls = [];
                for (let i = 0; i < x["transactionsample"].length; i++) {
                    this.sampleForm.push(
                        this.setSampleFormValueDit(x["transactionsample"][i])
                    );
                    this.sampleForm
                        .at(i)
                        ["controls"].parameter.setControl(
                            "nonpaketparameter",
                            this._formBuilder.array(
                                x["transactionsample"][
                                    i
                                ].transactionparameter.filter(
                                    (y) => y.status_string == "NON PAKET"
                                ) || []
                            )
                        );
                    this.sampleForm
                        .at(i)
                        ["controls"].parameter.setControl(
                            "paketparameter",
                            this._formBuilder.array(
                                x["transactionsample"][
                                    i
                                ].transactionparameter.filter(
                                    (y) => y.status_string == "PAKET"
                                ) || []
                            )
                        );
                    this.sampleForm
                        .at(i)
                        ["controls"].parameter.setControl(
                            "paketPKM",
                            this._formBuilder.array(
                                x["transactionsample"][
                                    i
                                ].transactionparameter.filter(
                                    (y) => y.position
                                ) || []
                            )
                        );
                }
            })
            .then(() => console.log(this.sampleForm))
            .then(() => (this.test = true));
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
        this.dataalamat.id_customer = await x.customers_handle.id_customer;
        await this.getDataCustomerAddress();
        let discount_convert =
            (await (x.payment_condition.discount_lepas /
                (x.payment_condition.biaya_pengujian + x.akg_trans.length > 0
                    ? x.akg_trans.total
                    : 0 + x.sampling_trans.length > 0
                    ? x.sampling_trans.total
                    : 0))) * 100;
        let subtotal =
            (await x.payment_condition.biaya_pengujian) +
            (x.akg_trans.length > 0 ? x.akg_trans.total : 0) +
            (x.sampling_trans.length > 0 ? x.sampling_trans.total : 0) +
            x.payment_condition.ppn -
            x.payment_condition.discount_lepas;

        await this.contractForm.patchValue({
            contract_category: x["contract_category"]["id"],
            no_penawaran: x["no_penawaran"],
            no_po: x["no_po"],
            typeContract: x["contract_type"],
            customerhandle: x["customers_handle"]["idch"],
            alamatcustomer: x.id_alamat_customer,
            desc_internal:
                x["description"].length > 0 ? x["description"][0]["desc"] : "-",
            desc: x.desc ? x.desc : "-",
            jumlahsample: x["transactionsample"].length,
            totalpembayaran: x.payment_condition.biaya_pengujian,
            biayasample:
                x.sampling_trans.length > 0 ? x.sampling_trans.total : 0,
            biayaakg: x.akg_trans.length > 0 ? x.akg_trans.total : 0,
            discount:
                x.payment_condition.discount_lepas > 0 ? discount_convert : 0,
            hasilDiscount: x.payment_condition.discount_lepas,
            ppn: x.payment_condition.ppn,
            subtotal: subtotal,

            uangmuka: x.payment_condition.downpayment,
            sisapembayaran: subtotal - x.payment_condition.downpayment,
        });
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
            (await this.mouDiskon.length) > 0
                ? (this.diskonboleh = true)
                : (this.diskonboleh = false);
        }, 1000);
    }

    createForm(): FormGroup {
        return this._formBuilder.group({
            contract_category: new FormControl(null),
            no_penawaran: new FormControl(null),
            no_po: new FormControl(null),
            valuenpwpktp: new FormControl(null),
            numbernpwpktp: new FormControl(null),
            pnwrn: new FormControl(null),
            typeContract: new FormControl(null),
            customerhandle: new FormControl(null),
            alamatcustomer: new FormControl(null),
            desc_internal: new FormControl(null),
            memo_finance: new FormControl(null),
            desc: new FormControl(null),
            foto: this.fotoForm,
            penawaran: new FormControl(),
            jumlahsample: new FormControl(1),
            sample: this.sampleForm,
            clienthandling: new FormControl(null),
            dataakg: this.dataakgpick,
            datasampling: this.datasamplingpick,
            totalpembayaran: new FormControl({
                value: null,
                disabled: this.mouspecial,
            }),
            formppn: true,
            biayasample: new FormControl({
                value: 0,
                disabled: true,
            }),
            biayaakg: new FormControl({
                value: 0,
                disabled: true,
            }),
            contracttypegovernment: new FormControl(),
            discount: new FormControl(0),
            hasilDiscount: new FormControl(0),
            ppn: new FormControl({
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
            sisapembayaran: new FormControl({
                value: 0,
                disabled: true,
            }),
        });
    }

    backback() {
        this._route.navigateByUrl("analystpro/contract");
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

    async setPenawaranLink() {
        this._route.navigateByUrl("analystpro/penawaran-det/add");
    }

    async perhitungan(v?) {
        let form = await this.contractForm.controls;
        let disc = (await form.hasilDiscount.value)
            ? form.hasilDiscount.value
            : 0;

        let b =
            (await form.totalpembayaran.value) -
            disc +
            form.biayaakg.value +
            form.biayasample.value;
        if (form.formppn.value) {
            await form.ppn.setValue((11 / 100) * b);
        }
        let a = (await b) + form.ppn.value;
        await form.subtotal.setValue(a);
        let subtotal = (await form.subtotal.value) ? form.subtotal.value : 0;
        let uangmuka = (await form.uangmuka.value) ? form.uangmuka.value : 0;
        form.totaltanpappn.setValue(b);
        let sisapembayaran = (await subtotal) - uangmuka;
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

    savedata() {
        if (
            this.contractForm.controls.contract_category.value &&
            this.contractForm.controls.typeContract.value &&
            this.contractForm.controls.customerhandle.value &&
            this.contractForm.controls.alamatcustomer.value &&
            this.sampleForm.controls.filter((x) => !x.value.samplename).length <
                1
        ) {
            this.contractForm.controls.typeContract.enable();
            let stringtosure =
                this.contractForm.controls.valuenpwpktp.value &&
                this.contractForm.controls.numbernpwpktp.value
                    ? ""
                    : "KTP / NPWP tidak terisi kontrak ini akan auto hold";
            global.swalyousure(stringtosure).then((res) => {
                if (res.isConfirmed) {
                    this.spinner.show();
                    this.contractForm.controls.totalpembayaran.enable();
                    this.contractForm.controls.discount.enable();
                    this.contractForm.controls.hasilDiscount.enable();
                    this.contractForm.controls.biayasample.enable();
                    this.contractForm.controls.biayaakg.enable();
                    this.contractForm.controls.ppn.enable();
                    this.contractForm.controls.uangmuka.enable();
                    this.contractForm.controls.subtotal.enable();
                    this.contractForm.controls.sisapembayaran.enable();

                    if (this.idContrack == "add") {
                        this.spinner.show();
                        setTimeout(() => {
                            this._kontrakServ
                                .saveData(this.contractForm.value)
                                .then((g) => {
                                    this.spinner.hide();
                                    if (g["success"]) {
                                        this.contractno =
                                            g["contract-no"].contract_no;
                                        global.swalsuccess(
                                            "Saving Success",
                                            `${g["contract-no"].contract_no}`
                                        );
                                        this.sampleforphoto = g["sample"];
                                        this.printContrack(
                                            g["sample"][0].id_contract
                                        );
                                    } else {
                                        global.swalerror(
                                            "Gagal Simpan Data, Harap Hubungi IT"
                                        );
                                    }
                                });
                        }, 3000);
                    } else {
                        this._kontrakServ
                            .updateData(
                                this.idContrack,
                                this.contractForm.value
                            )
                            .then((g) => {
                                if (g["success"]) {
                                    this.contractno =
                                        g["contract-no"].contract_no;
                                    global.swalsuccess(
                                        "Saving Success",
                                        `${g["contract-no"].contract_no}`
                                    );
                                    this.sampleforphoto = g["sample"];
                                    this.printContrack(
                                        g["sample"][0].id_contract
                                    );
                                } else {
                                    global.swalerror(
                                        "Gagal Simpan Data, Harap Hubungi IT"
                                    );
                                }
                            });
                    }
                } else {
                    console.log("yihopiiiiiiii");
                }
            });
        } else {
            global.swalwarning("Data Belum Lengkap", `Mohon Lengkapi Data !`);
        }
    }

    printContrack(id) {
        this.openModalPhoto(id);
        // this._kontrakServ
        //     .getDataDetailKontrak(id)
        //     .then((x: any) => {
        //         this._messagingServ.sendMessage({
        //             notification: {
        //                 title: `${x.contract_no} - ${x.contract_category.title}`,
        //                 body: `${x.contract_condition[0].user.employee_name} added New Contract at with ${x.transactionsample.length > 1 ? x.transactionsample.length + ' Samples' : x.transactionsample.length + ' Sample' } at ${x.contract_condition[0].inserted_at}`,
        //             },
        //             to: 'topics/analystpro'
        //         },'analystpro').then(x => console.log(x));
        //     })
        //     .then(() => this.spinner.hide())
        //     .then(() => this.openModalPhoto());
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

    copythis(e, i) {
        this.copydata = [];
        this.copydata = this.copydata.concat(e.value);
    }

    async pastethis(e, i) {
        await this.sampleForm
            .at(i)
            ["controls"].samplename.setValue(this.copydata[0].samplename);
        await this.setFormSample(this.copydata[0].parameter, i);
        let totaldiscount = this.sampleForm.controls
            .map((d) => d.value["parameter"].discountsample)
            .reduce((z, x) => z + x);
        await this.contractForm.controls.hasilDiscount.setValue(totaldiscount);
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
            await this.contractForm.controls.hasilDiscount.setValue(
                totaldiscount
            );
            await this.setHasilDiscount(2);
        }
        this.MatTable.renderRows();
        this.copydata = [];
    }

    deleteRow(i) {
        global.swalyousure("it will delete sample").then((x) => {
            if (x.isConfirmed) {
                this.contractForm.controls.jumlahsample.setValue(
                    this.sampleForm.controls.length - 1
                );
                this.sampleForm.removeAt(i);
                this.MatTable.renderRows();
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
                    status: this.idContrack == "add" ? "tambah" : "edit",
                    st: "kontrak",
                },
            });
            await dialogRef.afterClosed().subscribe(async (result) => {
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
            console.log(this.contractForm.controls.datasampling.value);
            this.perhitungan();
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
        let form = this.contractForm.value;
        let sample = this.sampleForm.value;

        let pricenonpaket = await [];
        let pricepaketparameter = await [];
        let pricepaketpkm = await [];

        let nonpaket = await sample.map((x) => x.parameter);
        await nonpaket.forEach((b) => {
            if (b.nonpaketparameter.length > 0) {
                b.nonpaketparameter.forEach((z) => {
                    pricenonpaket = pricenonpaket.concat(
                        z.price * b.valuesstatuspengujian
                    );
                });
            }
            if (b.paketparameter.length > 0) {
                b.paketparameter.forEach((bb) => {
                    if (bb.discount > 0) {
                        pricepaketparameter = pricepaketparameter.concat(
                            bb.price * b.valuesstatuspengujian
                        );
                    }
                });
            }
            if (b.paketPKM.length > 0) {
                let sub = [];

                b.paketPKM.forEach((zz) => {
                    if (zz.discount > 0) {
                        sub = sub.concat(zz.subpackage.map((v) => v.price));
                    }
                });

                pricepaketpkm = pricepaketpkm.concat(sub);
            }
        });
        let valuegabungpaketpkm =
            (await pricepaketpkm.length) > 0
                ? pricepaketpkm.reduce((i, o) => i + o)
                : 0;
        let valuegabungnonpaketparameter =
            (await pricenonpaket.length) > 0
                ? pricenonpaket.reduce((i, o) => i + o)
                : 0;
        let valuegabungpaketparameter =
            (await pricepaketparameter.length) > 0
                ? pricepaketparameter.reduce((i, o) => i + o)
                : 0;

        let discval = (await form.discount) / 100;
        let taruhharga =
            (await discval) *
            (valuegabungnonpaketparameter +
                valuegabungpaketparameter +
                valuegabungpaketpkm);
        await this.contractForm.patchValue({
            hasilDiscount: taruhharga,
        });

        this.perhitungan();
    }

    setDiscount(value) {
        this.perhitungan();
    }

    setsisapembayaran(value) {
        this.perhitungan();
    }

    //ng select

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
                this.datasentpenawaran.search = ev.term.toLowerCase();
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
                this.showsurabaya =
                    (await this.contractForm.controls.typeContract.value) == 4
                        ? true
                        : false;
                break;
            case "customer":
                this.datacustomerhandle = await [];
                this.dataalamat.id_customer = await ev.id_customer;
                this.datasentpenawaran.idcust = await ev.id_customer;
                this.custname = await ev.customer_name;
                await this._custHandleServ.getDataDetail(ev.idch).then((x) => {
                    this.datacustomerhandle = this.datacustomerhandle.concat(x);
                });
                this.alamatcustomer = await [];
                this.datapenawaran = await [];
                await this.contractForm.controls.valuenpwpktp.setValue(null);
                await this.contractForm.controls.numbernpwpktp.setValue(null);
                await this.getcustomerdetailvalue(ev.id_customer);
                await this.getMou(ev);
                await this.getDataPenawaran();

                break;
            case "alamat":
                await console.log("alamat");
                break;
            case "penawaran":
                this._penawaranServ
                    .setPenawaran(ev.id)
                    .then((x) => this.setDataEditPenawaran(x[0]));
                break;
        }
    }

    async tambahnpwpktp() {
        const dialogRef = await this.dialog.open(ModalNpwpKtpComponent, {
            height: "auto",
            width: "600px",
            data: this.contractForm.controls.customerhandle.value,
        });
        await dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                await this.contractForm.controls.valuenpwpktp.setValue(
                    result.info.toLowerCase()
                );
                await this.contractForm.controls.numbernpwpktp.setValue(
                    result.npwp_number
                );
                await this.getcustomerdetailvalue(this.dataalamat.id_customer);
            }
        });
    }

    getcustomerdetailvalue(v) {
        this._custService.getDataCustomerDetail(v).then((f: any) => {
            if (f.customer_npwp.length > 0) {
                this.contractForm.controls.valuenpwpktp.setValue(
                    f.customer_npwp[0].info.toLowerCase()
                );
                this.contractForm.controls.numbernpwpktp.setValue(
                    f.customer_npwp[0].npwp_number
                );
            }
        });
    }

    setSampleFormValueDitPenawaran(v) {
        return this._formBuilder.group({
            samplename: [v.samplename],
            hargakenadiskon: [v.hargakenadiskon],
            parameter: this._formBuilder.group({
                batchno: new FormControl(),
                certificate_info: new FormControl(),
                discount_nonpacket: new FormControl(),
                discount_paket: new FormControl(),
                factory_address: new FormControl(),
                factoryname: new FormControl(),
                formathasil: new FormControl(),
                jeniskemasan: new FormControl(),
                ket_lain: new FormControl(),
                kodesample: new FormControl(),
                lotno: new FormControl(),
                no_notifikasi: new FormControl(),
                subcatalogue: new FormControl(),
                no_pengajuan: new FormControl(),
                no_principalCode: new FormControl(),
                no_registrasi: new FormControl(),
                trademark: new FormControl(),
                tgl_selesai: new FormControl(),
                tgl_input: _moment(new Date()).format("YYYY-MM-DD"),
                valuesstatuspengujian: new FormControl(),
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

    setDataEditPenawaran(v) {
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
        this.setFormEditPenawaran(v);
        this.sampleForm.controls = [];
        for (let i = 0; i < v["sample"].length; i++) {
            this.sampleForm.push(
                this.setSampleFormValueDitPenawaran(v["sample"][i])
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
        // .then(() => console.log(this.contractForm.value))
        // .then(() => ());
    }

    async setFormEditPenawaran(x) {
        this.dataalamat.id_customer = await x.customer_handle.id_customer;
        // await this.getDataCustomerAddress();

        await this.contractForm.patchValue({
            contract_category: x["contract_category"],
            customerhandle: x.customer_handle.idch,
            clienthandling: x["clienthandling"],
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
}
