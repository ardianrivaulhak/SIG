import { LembarhasilComponent } from "./../../lembarhasil/lembarhasil.component";
import {
    Component,
    OnInit,
    Optional,
    Inject,
    ViewEncapsulation,
    ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { CertificateService } from "../../../certificate.service";
import { ParameterCertificatemodalsComponent } from "../parametermodals/parametermodals.component";
import { MatDialog } from "@angular/material/dialog";
import { SubcatalogueService } from "../../../../master/subcatalogue/subcatalogue.service";
import { BrowserModule } from "@angular/platform-browser";
import { TujuanpengujianService } from "../../../../services/tujuanpengujian/tujuanpengujian.service";
import { AddresslistDialogComponent } from "../addresslist-dialog/addresslist-dialog.component";
import { CustomerService } from "../../../../master/customers/customer.service";
import * as _moment from "moment";
import { EmployeeService } from "app/main/hris/employee/employee.service";
// import * as ClassicEditor from 'assets/js/ckeditor/ckeditor.js';
import * as ClassicEditor from 'assets/js/ckeditor/ckeditor';
import { CKEditor5, ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular';

@Component({
    selector: "app-certmodals",
    templateUrl: "./certmodals.component.html",
    styleUrls: ["./certmodals.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class CertmodalsComponent implements OnInit {

    
    name = "ckeditor";
    public editorValue: string = '';
    dataSampleLab = [];
    sampleForm: FormGroup;
    id_transaction = this.data.idtransactionsample;
    load = false;
    subCalagoue = [];
    dataSentSubCatalogue = {
        pages: 1,
        search: null,
    };
    manualform = null;

    formatData = [];
    dataSentFormat = {
        pages: 1,
        search: null,
    };

    infocert = [
        { value: 1, viewValue: "Draft" },
        { value: 0, viewValue: "Rilis" },
    ];

    statusContract = [
        { value: 1, viewValue: "Normal" },
        { value: 2, viewValue: "Urgent" },
        { value: 3, viewValue: "Very Urgent" },
        { value: 4, viewValue: "Custom 2 Hari" },
        { value: 5, viewValue: "Custom 1 Hari" },
    ];
    selectedCustomer = [];

    tujuanPengujian = [];
    dataSentTujuan = {
        pages: 1,
        search: null,
    };
    datasentCust = {
        pages: 1,
        search: null,
    };
    datasentContact = {
        pages: 1,
        search: null,
        id: null,
    };
    datasentAddress = {
        pages: 1,
        search: null,
        id: null,
    };
    customerData = [];
    contactData = [];
    total: number;
    from: number;
    to: number;
    pages = 1;
    idcustomer: any;
    selectContact: "";
    addressData = [];
    userSamplingData = [];
    datasendEmployee = {
        pages: 1,
        search: null,
        level: null,
        division: null,
        employeestatus: null,
    };

    htmlContent = '';    
    ckeConfig: any;
    public Editor = ClassicEditor;

    public onReady( editor ) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
    }

    constructor(
        public dialogRef: MatDialogRef<CertmodalsComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private _certServ: CertificateService,
        private _formBuild: FormBuilder,
        private _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _subcatalogue: SubcatalogueService,
        private _tujuanServ: TujuanpengujianService,
        private _custService: CustomerService,
        private _employee: EmployeeService
    ) {
    }

    ngOnInit(): void {
        this.getFormat();
        this.getData();
    }
    
    async getData() {
        console.log(this.id_transaction);
        await this._certServ
            .getTransactionSample(this.id_transaction)
            .then((x) => (this.dataSampleLab = this.dataSampleLab.concat(x)))
            .then(
                () =>
                    (this.selectContact = this.dataSampleLab[0].contact_person)
            )
            .then(() => (this.sampleForm = this.createForm()))
            .then(() =>
              {  this.dataSampleLab[0].format.status == 1 ? this.manualform = true : this.manualform = false
            
                console.log(this.dataSampleLab[0].format)
            }
                
            );

        this.datasentContact = {
            pages: 1,
            search: null,
            id: this.dataSampleLab[0].customer_name,
        };

        this.datasentAddress = {
            pages: 1,
            search: null,
            id: this.dataSampleLab[0].customer_name,
        };

        await this._certServ
            .getSearchCustomer(
                this.id_transaction,
                this.dataSampleLab[0].customer_name
            )
            .then((x) => {
                this.selectedCustomer = this.selectedCustomer.concat(x);
                //this.selectedCustomer = this.uniq(this.selectedCustomer, (it) => it.id_customer);
                console.log(this.selectedCustomer[0].customer_name);
            });
        this.datasentCust.search = await this.selectedCustomer[0].customer_name;

        await this.getDataCustomers();
        await this.getDataContactPerson();
        await this.getCustomerAddress();
        await this.getUserSampling();
        await console.log(this.dataSampleLab);
    }

    async getDataCustomers() {
        console.log(this.datasentCust);

        await this._custService
            .getDataCustomers(this.datasentCust)
            .then((x) => {
                this.customerData = this.customerData.concat(
                    Array.from(x["data"])
                );
                this.customerData = this.uniq(
                    this.customerData,
                    (it) => it.id_customer
                );
                console.log(this.customerData);
                if (!this.total) {
                    this.total = x["total"];
                    this.from = x["from"] - 1;
                    this.to = x["to"];
                }
            });
    }

    async getUserSampling() {
        console.log(this.dataSampleLab[0].pic);
        await this._employee
            .getDataDetail(this.dataSampleLab[0].pic)
            .then((x) => {
                console.log(x);
                this.userSamplingData = this.userSamplingData.concat(x);
                this.userSamplingData = this.uniq(
                    this.userSamplingData,
                    (it) => it.employee_id
                );
                console.log(this.userSamplingData);
            });
    }

    async getValueUserSampling() {
        console.log(this.datasendEmployee);
        this.userSamplingData = await [];
        await this._employee.getData(this.datasendEmployee).then((x) => {
            this.userSamplingData = this.userSamplingData.concat(
                Array.from(x["data"])
            );
            this.userSamplingData = this.uniq(
                this.userSamplingData,
                (it) => it.employee_id
            );
            console.log(this.userSamplingData);
            this.total = x["total"];
            this.from = x["from"] - 1;
            this.to = x["to"];
        });
    }

    searchPIC(ev) {
        this.datasendEmployee.search = null;
        console.log(ev);
        this.datasendEmployee.search = ev.term;
        this.datasendEmployee.pages = 1;
        this.getValueUserSampling();
    }

    // getCustomerselected(){
    //     this._certServ.getSearchCustomer(this.id_transaction, this.dataSampleLab[0].customer_name).then(x => {
    //     this.selectedCustomer = x;
    //     //this.selectedCustomer = this.uniq(this.selectedCustomer, (it) => it.id_customer);
    //     console.log(this.selectedCustomer.customer_name);

    //     })
    // }

    searchCustomer(ev) {
        this.datasentCust.search = null;
        console.log(ev);
        this.datasentCust.search = ev.term;
        this.datasentCust.pages = 1;
        this.getDataCustomers();
    }

    async getValCustomer(ev) {
        await console.log(ev);
        this.idcustomer = await ev.id_customer;
        this.datasentContact = await {
            pages: 1,
            search: null,
            id: this.idcustomer,
        };
        this.datasentAddress = await {
            pages: 1,
            search: null,
            id: this.idcustomer,
        };
        await console.log(this.datasentContact);
        await console.log(this.datasentAddress);
        await this.getDataContactPerson();
        await this.getCustomerAddress();
    }

    async getValContact(ev) {
        await console.log(ev);
        this.idcustomer = await ev.id_customer;
        this.datasentContact = await {
            pages: 1,
            search: null,
            id: this.idcustomer,
        };
        await console.log(this.datasentContact);
        await this.getDataContactPerson();
    }

    async getValAddress(ev) {
        await console.log(ev);
        this.datasentAddress = await {
            pages: 1,
            search: null,
            id: this.idcustomer,
        };
        await console.log(this.datasentAddress);
        await this.getCustomerAddress();
    }

    async getDataContactPerson() {
        console.log(this.datasentContact);
        this.contactData = [];
        this._certServ.contactPerson(this.datasentContact).then(async (x) => {
            let b = [];
            b = await b.concat(Array.from(x["data"]));
            console.log(b);
            await b.forEach((x) => {
                if (x.contact_person != null) {
                    this.contactData = this.contactData.concat({
                        id_contact: x.id_cp,
                        contact_name: x.contact_person.name,
                    });
                }
            });
            console.log(this.contactData);
            this.contactData = this.uniq(
                this.contactData,
                (it) => it.id_contact
            );
            if (!this.total) {
                this.total = x["total"];
                this.from = x["from"] - 1;
                this.to = x["to"];
            }
        });
    }

    async getCustomerAddress() {
        console.log(this.datasentAddress);
        this.addressData = [];
        this._certServ
            .getAddressListData(this.datasentAddress)
            .then(async (x) => {
                let b = [];
                b = await b.concat(Array.from(x["data"]));
                console.log(b);
                await b.forEach((x) => {
                    this.addressData = this.addressData.concat({
                        id_address: x.id_address,
                        address: x.address,
                    });
                });
                console.log(this.addressData);
                this.addressData = this.uniq(
                    this.addressData,
                    (it) => it.id_address
                );
                if (!this.total) {
                    this.total = x["total"];
                    this.from = x["from"] - 1;
                    this.to = x["to"];
                }
            });
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    createForm(): FormGroup {
        var int_cust = parseInt(this.dataSampleLab[0].customer_name, 10);
        var int_contact = parseInt(this.selectContact, 10);
        var int_add = parseInt(this.dataSampleLab[0].customer_address, 10);

        return this._formBuild.group({
            format: [
                this.dataSampleLab[0].format.id,
                { validator: Validators.required },
            ],
            cl_number: this.dataSampleLab[0].cl_number,
            lhu_number: [
                this.dataSampleLab[0].lhu_number,
                { validator: Validators.required },
            ],
            customer_name: [int_cust, { validator: Validators.required }],
            customer_telp: [
                this.dataSampleLab[0].customer_telp,
                { validator: Validators.required },
            ],
            contact_person: [int_contact, { validator: Validators.required }],
            customer_address: [int_add, { validator: Validators.required }],
            sample_name: [
                this.dataSampleLab[0].sample_name,
                { validator: Validators.required },
            ],
            no_sample: [
                this.dataSampleLab[0].no_sample,
                { validator: Validators.required },
            ],
            kode_sample: [
                this.dataSampleLab[0].kode_sample,
                { validator: Validators.required },
            ],
            batch_number: [
                this.dataSampleLab[0].batch_number,
                { validator: Validators.required },
            ],
            tgl_input: [
                this.dataSampleLab[0].tgl_input,
                { validator: Validators.required },
            ],
            tgl_mulai: [
                this.dataSampleLab[0].tgl_mulai,
                { validator: Validators.required },
            ],
            tgl_selesai: [
                this.dataSampleLab[0].tgl_selesai,
                { validator: Validators.required },
            ],
            tgl_estimasi_lab: [
                this.dataSampleLab[0].tgl_estimasi_lab,
                { validator: Validators.required },
            ],
            nama_pabrik: [
                this.dataSampleLab[0].nama_pabrik,
                { validator: Validators.required },
            ],
            alamat_pabrik: [
                this.dataSampleLab[0].alamat_pabrik,
                { validator: Validators.required },
            ],
            nama_dagang: [
                this.dataSampleLab[0].nama_dagang,
                { validator: Validators.required },
            ],
            lot_number: [
                this.dataSampleLab[0].lot_number,
                { validator: Validators.required },
            ],
            jenis_kemasan: [
                this.dataSampleLab[0].jenis_kemasan,
                { validator: Validators.required },
            ],
            no_notifikasi: [
                this.dataSampleLab[0].no_notifikasi,
                { validator: Validators.required },
            ],
            no_pengajuan: [
                this.dataSampleLab[0].no_pengajuan,
                { validator: Validators.required },
            ],
            no_registrasi: [
                this.dataSampleLab[0].no_registrasi,
                { validator: Validators.required },
            ],
            no_principalcode: [
                this.dataSampleLab[0].no_principalcode,
                { validator: Validators.required },
            ],
            tgl_produksi: [
                this.dataSampleLab[0].tgl_produksi,
                { validator: Validators.required },
            ],
            tgl_kadaluarsa: [
                this.dataSampleLab[0].tgl_kadaluarsa,
                { validator: Validators.required },
            ],
            tgl_sampling: [
                this.dataSampleLab[0].tgl_sampling == "" ||
                this.dataSampleLab[0].tgl_sampling == null
                    ? null
                    : this.dataSampleLab[0].tgl_sampling,
                { validator: Validators.required },
            ],
            price: [
                this.dataSampleLab[0].price,
                { validator: Validators.required },
            ],
            id_tujuanpengujian: [
                this.dataSampleLab[0].id_tujuanpengujian,
                { validator: Validators.required },
            ],
            id_statuspengujian: [
                this.dataSampleLab[0].id_statuspengujian,
                { validator: Validators.required },
            ],
            id_subcatalogue: [
                this.dataSampleLab[0].id_subcatalogue,
                { validator: Validators.required },
            ],
            metode: [
                this.dataSampleLab[0].metode,
                { validator: Validators.required },
            ],
            location: [
                this.dataSampleLab[0].location,
                { validator: Validators.required },
            ],
            pic: [
                this.dataSampleLab[0].pic,
                { validator: Validators.required },
            ],
            kondisi_lingkungan: [
                this.dataSampleLab[0].kondisi_lingkungan,
                { validator: Validators.required },
            ],
            keterangan_lain: [
                this.dataSampleLab[0].keterangan_lain,
                { validator: Validators.required },
            ],
            print_info: [
                this.dataSampleLab[0].print_info,
                { validator: Validators.required },
            ],
            cert_info: [
                this.dataSampleLab[0].cert_info,
                { validator: Validators.required },
            ],
            datamanual: [
                this.dataSampleLab[0].manual == null
                    ? ''
                    : this.dataSampleLab[0].manual.datamanual,
                { validator: Validators.required },
            ],
            date_cert: [
                new Date(
                    this.dataSampleLab[0].date_at == null
                        ? new Date()
                        : this.dataSampleLab[0].date_at
                ).toISOString(),
                { validator: Validators.required },
            ],
        });
    }

    selectFormat(ev) {
        console.log(ev.status);
        if (ev.status == 1) {
            this.manualform = true;
        } else {
            this.manualform = false;
        }
    }

    getSubCatalogue() {
        this._subcatalogue
            .getDataSubcatalogue(this.dataSentSubCatalogue)
            .then((x) => {
                this.subCalagoue = this.subCalagoue.concat(x["data"]);
                console.log(this.subCalagoue);
            });
    }

    getFormat() {
        this._certServ.getFormat(this.dataSentFormat).then((x) => {
            this.formatData = this.formatData.concat(x["data"]);
            console.log(this.formatData);
        });
    }

    getTujuan() {
        this._tujuanServ
            .getDataTujuanPengujian(this.dataSentTujuan)
            .then((x) => {
                this.tujuanPengujian = this.tujuanPengujian.concat(x["data"]);
                console.log(this.tujuanPengujian);
            });
    }

    onScrollToEnd(e) {
        this.load = true;
        if (e === "customers") {
            this.datasentCust.pages = this.datasentCust.pages + 1;
            this.getDataCustomers();
        }
        if (e === "subcatalogue") {
            this.dataSentSubCatalogue.pages =
                this.dataSentSubCatalogue.pages + 1;
            this.getSubCatalogue();
        }
        if (e === "format") {
            this.dataSentFormat.pages = this.dataSentFormat.pages + 1;
            this.getFormat();
        }
        if (e === "tujuan") {
            this.dataSentTujuan.pages = this.dataSentTujuan.pages + 1;
            this.getFormat();
        }
        if (e === "pic") {
            this.datasendEmployee.pages = this.datasendEmployee.pages + 1;
            this.getValueUserSampling();
        }
        setTimeout(() => {
            this.load = false;
        }, 200);
    }

    saveForm() {
        console.log( this.sampleForm.value.datamanual)
        this._certServ
            .updateCertificateData(this.id_transaction, this.sampleForm.value)
            .then((y) => {
                this.load = true;
                let message = {
                    text: "Data Succesfully Updated",
                    action: "Done",
                };
                setTimeout(() => {
                    this.openSnackBar(message);
                    this.closeDialog(false);
                    this.load = false;
                }, 1000);
            });
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }

    closeDialog(v) {
        return this.dialogRef.close({
            v
        });
    }

    parameterModals(id) {
        const dialogRef = this._matDialog.open(
            ParameterCertificatemodalsComponent,
            {
                panelClass: "certificate-parameter-dialog",
                width: "100%",
                data: { idtransactionsample: id },
            }
        );

        this.closeDialog(true);

        dialogRef.afterClosed().subscribe((result) => {
            console.log("dialog close");
            id = result;
        });
    }

    addressDialog(id_transaction_sample) {
        const dialogRef = this._matDialog.open(AddresslistDialogComponent, {
            panelClass: "certificate-addresslist-dialog",
            height: "400px",
            width: "600px",
            data: { idtransactionsample: id_transaction_sample },
        });

        dialogRef.afterClosed().subscribe((result) => {
            id_transaction_sample = result;
        });
    }

    changeManual(e) {
        console.log(e);
    }
}
