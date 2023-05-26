import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { KeuanganService } from "../../keuangan.service";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import * as XLSX from "xlsx";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerService } from "../../../master/customers/customer.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as _moment from "moment";
import { InvoiceFormService } from "../pdf/invoice.service";
import { ContractService } from "../../../services/contract/contract.service";
import * as global from "app/main/global";
import { MatTable } from "@angular/material/table";
import { CurrencyPipe } from "@angular/common";
const terbilang = require("angka-menjadi-terbilang");
import { DatePipe } from "@angular/common";
import  * as globals from "app/main/global";

@Component({
    selector: "app-addinvoice",
    templateUrl: "./addinvoice.component.html",
    styleUrls: ["./addinvoice.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class AddinvoiceComponent implements OnInit {
    @ViewChild("table") MatTable: MatTable<any>;
    @ViewChild("tablePrice") MatTablePrice: MatTable<any>;
    load = false;
    dataStatus = [
        {
            id: 1,
            name: "Invoice",
        },
        {
            id: 3,
            name: "Sampling Fee",
        },
        {
            id: 4,
            name: "Special Invoice",
        },
    ];

    ppnData = [
        {
            name: "10%",
            value: 0.10,
        },
        {
            name: "11%",
            value: 0.11,
        },
    ]

    selectFormat = 1;
    selectPPN = 0.11
    selectStatus: any;
    selectDate: any;
    selectDueDate: any;
    dataFilterContract = {
        pages: 1,
        type: "paginate",
        category: null,
        month: null,
        customers: null,
        contact_person: null,
        date: null,
        search: null,
    };
    datacontract = [];
    total: number;
    from: number;
    to: number;
    noKontrak = [];

    datasentCustomer = {
        pages: 1,
        search: null,
    };
    datasentCP = {
        pages: 1,
        search: null,
    };
    datasentTaxAddres = {
        pages: 1,
        search: null,
    };
    customersData = [];
    cpData = [];
    idCP: any;

    dataTaxAddres = [];
    idAlamatPajak: any;

    // hideViewContract = false;
    // idkeuangan: any;

    datasampleSemua = [];
    datasample2 = [];
    dataSource = [];

    dataKeuangan = [];
    dataMou = [];

    invoiceForm: FormGroup;
    dataalamat = {
        pages: 1,
        search: null,
        id_customer: null,
    };
    alamatcustomer = [];
    idCustomerAddres: any;
    tgl_faktur = null;
    tgl_jatuh_tempo = null;
    tgl_berita_acara = null;

    taxAddress = [];
    allsampleData = [];
    displayedColumns: string[] = [
        "no",
        "nosample",
        "samplename",
        "statuspengujian",
        "price",
        "discount",
        "total",
        "action",
    ];

    priceTotalSample: number = null;
    priceAkg: number = null;
    allDataAkg = [];

    discountLepas: any;
    remainingpayment: any;

    priceSampling: number = null;
    allSampling = [];
    pricePPN: number = null;
    discountTotal: number = null;
    priceSubTotal: number = null;
    priceDP: number = null;
    priceTotal: number = null;
    mouStatusPengujian = [];
    mouDiskon = [];
    mouspecial = true;
    allData = false;
    rekeningCheck = false;
    splitCheck = false;
    editSampling: number = null;
    editIng: number = null;
    editDP: number = null;
    terbilangan: string = null;

    selectCust = "";
    selectContact = "";
    selectAddress = "";

    selectCustName = "";
    selectContactName = "";
    selectAddressName = "";
    selectTelpName = "";
    selectFaxName = "";
    selectKontrakName = "";
    selectPOName = "";

    chooseDate: any;

    desc_cs: any;
    termins: any;

    data: any;

    checkdataContract = [];

    conditionStatus: any;

    custNamee: any;
    nameee: any;
    addresss: any;

    checkMark = "";
    discountsample = ''
    
    totDiscount: number;
    notif_dic= false;
    sisa: number;
    splitInvoice : any;
    disableBUtton = true;
    loadingDisable = false;

    marketingSelected:any;
    checkAddressFaktur : string
    checkInvoiceSplit: any;

    openNotif = false;
    
    constructor(
        private _masterServ: KeuanganService,
        private _customersServ: CustomerService,
        private _formBuild: FormBuilder,
        private _snackBar: MatSnackBar,
        private _route: Router,
        private invoicePdf: InvoiceFormService,
        private _kontrakServ: ContractService,
    ) {}

    ngOnInit(): void {
        this.getDataContract();
        this.getData();
    }

    
    async getDataContract() {
        await this._masterServ
            .getDataKontrak(this.dataFilterContract)
            .then((x) => {
                this.datacontract = this.datacontract.concat(Array.from(x['data']));
                this.datacontract = globals.uniq(this.datacontract, (it) => it.id_kontrakuji);             
        });
    }

    async getValKontrak(ev) {
        console.log(ev[0])
        this.marketingSelected = await ev[0]
        this.datasampleSemua = await [];
        this.dataKeuangan = await [];
        await this.getData();
    }
   
    async createInvoiceNumber() {  
        let a = await '' 
        if(this.checkdataContract[0] > 0){
            await this.getLetter(this.checkdataContract[0]).then(x => {
                a = x
            })
        }
        let word = await this.marketingSelected.contract_no;
        let invoiceNumber = await word.replace("MARK", "INV");
        await this.invoiceForm.controls.no_invoice.setValue(invoiceNumber+a);
    }
    
    async getLetter(num){
        await console.log(num)
        let letter = await String.fromCharCode(num + 64);
        return await letter;
    }

    async getData() {
        console.log(this.noKontrak)
        await this._masterServ.getDataDetail(this.noKontrak).then((x) => {
            this.dataKeuangan = this.dataKeuangan.concat(x);
        });
        this.invoiceForm = await this.createLabForm();

        if (this.dataKeuangan.length !== 0) {

            await this.MatTable.renderRows();            
            await this.checkContract();
            await this.checkSplit();
            await this.createInvoiceNumber();
            await this.clickAllData(this.allData);
            await this.getMou();

            this.termins =
                (await this.dataKeuangan[0].customers_handle.customers
                    .termin) == "Cash"
                    ? 0
                    : this.dataKeuangan[0].customers_handle.customers.termin;
            await this.invoiceForm.controls.termin.setValue(this.termins);
            

            await this.invoiceForm.controls.no_po.setValue(
                this.dataKeuangan[0].no_po == null ||
                    this.dataKeuangan[0].no_po == ""
                    ? "-"
                    : this.dataKeuangan[0].no_po
            );

            await  this.sampleInContract();
            await this.priceData();
            this.splitInvoice = await false;
            await console.log(this.datasampleSemua);
        }
    }

    async sampleInContract() {
        // sample data in contract
        await this.dataKeuangan.forEach((c) => {
            // looping akg
            c.akg_trans.length > 0
                ? c.akg_trans.forEach((p) => {
                      this.allDataAkg = this.allDataAkg.concat({
                          akg: p.total,
                      });
                  })
                : (this.allDataAkg = [{ akg: 0 }]);

            //looping sampling
            c.sampling_trans.length > 0
                ? c.sampling_trans.forEach((p) => {
                      this.allSampling = this.allSampling.concat({
                          sample: p.total,
                      });
                  }) 
                : (this.allSampling = [{ sample: 0 }]);

            //check diskon lepas
            console.log(c)
            this.discountLepas = c.payment_condition.discount_lepas;
            let per =(this.discountLepas/c.payment_condition.biaya_pengujian)*100;
            let a = this.discountLepas / c.transactionsample.length ;
                        
            if (this.discountLepas < 1) {
                console.log(this.discountLepas)
                //looping sample without diskon lepas
                c.transactionsample.forEach((x, i) => {
                    console.log(x);
                    this.datasampleSemua = this.datasampleSemua.concat({
                        idsample: x.id,
                        nosample: x.no_sample,
                        samplename: x.sample_name,
                        statuspengujian: x.statuspengujian.name,
                        price: x.price,
                        tgl_selesai: x.tgl_selesai,
                        discount: x.discount,
                        total: x.price - x.discount
                    });
                });
            } else {
                //looping sample with diskon lepas
                console.log(typeof(per))
                c.transactionsample.forEach((x, i) => {
                    console.log(x);
                    this.datasampleSemua = this.datasampleSemua.concat({
                        idsample: x.id,
                        nosample: x.no_sample,
                        samplename: x.sample_name,
                        statuspengujian: x.statuspengujian.name,
                        price: x.price,
                        tgl_selesai: x.tgl_selesai,
                        discount: x.price * per/100,
                        // total:  x.price - a
                        total : Math.round(x.price - (x.price * per/100))
                    });
                });
            }
        });
    }

    async getValCustomer(ev) {
        await console.log(ev);
        this.dataalamat.id_customer = await ev.id_customer;
        console.log(this.dataalamat.id_customer);
        await this.getDataCustomerAddress();

        console.log(ev.warning)
        if(ev.warning == 1)
        {
            await Swal.fire({
                title: "INFO PENTING!",
                text: "MOHON PILIH ALAMAT YANG SESUAI PADA FAKTUR",
                icon: "warning",
                confirmButtonText: "Ok",
              });
        }
    }
  
    async changeRadio(ev) {
        ev.value == 1 ? this.splitInvoice = true : this.splitInvoice = false
        await ev.value == 1 ? this.disableBUtton = await false : ev.value == 0 ? this.disableBUtton = await true : this.disableBUtton = await true    
    }

    getDataCustomer() {
        this._customersServ
            .getDataCustomers(this.datasentCustomer)
            .then((x) => {
                this.customersData = this.customersData.concat(
                    Array.from(x["data"])
                );
                this.customersData = globals.uniq(
                    this.customersData,
                    (it) => it.id_customer
                );
        });
    }

    async getDataCustomerAddress() {
        this.alamatcustomer = await [];
        await this._masterServ
            .getDataAddressCustomer(this.dataalamat)
            .then(
                (o) =>
                    (this.alamatcustomer = this.alamatcustomer.concat(
                        o["data"]
                    ))
            );
    }

    async getValAddress(ev) {
        await console.log(ev);
        this.idCustomerAddres = ev.id_address;
    }

    getDataCP() {
        this._masterServ.getDataContactPersons(this.datasentCP).then((x) => {
            this.cpData = this.cpData.concat(x["data"]);
            console.log(this.cpData);
        });
    }

    async getValCP(ev) {
        await console.log(ev);
        this.idCP = ev.id_cp;
    }

    onsearchselect(ev, val) {
        if (val === "kontrak") {
            this.datacontract = [];
            this.dataFilterContract.search = ev.term;
            this.dataFilterContract.pages = 1;
            this.getDataContract();
        }
        if (val === "customer") {
            this.customersData = [];
            this.datasentCustomer.search = ev.term;
            this.datasentCustomer.pages = 1;
            this.getDataCustomer();
        }
        if (val === "cp") {
            this.cpData = [];
            this.datasentCP.search = ev.term;
            this.datasentCP.pages = 1;
            this.getDataCP();
        }
        if (val === "address") {
            this.alamatcustomer = [];
            this.dataalamat.search = ev.term;
            this.dataalamat.pages = 1;
            this.getDataCustomerAddress();
        }
    }

    // onChangeToggle(ev) {
    //     this.splitCheck = ev.checked;
    //     console.log(this.splitCheck);
    // }

    onScrollToEnd(e) {
        if (e === "customer") {
            this.datasentCustomer.pages = this.datasentCustomer.pages + 1;
            this._customersServ
                .getDataCustomers(this.datasentCustomer)
                .then((x) => {
                    this.customersData = this.customersData.concat(x["data"]);
            });
        }
        if (e === "CP") {
            this.datasentCP.pages = this.datasentCP.pages + 1;
            this.getDataCP();
        }
        // if (e === "taxAddress") {
        //     this.datasentTaxAddres.pages = this.datasentTaxAddres.pages + 1;
        //     this.getDataTaxAddres();
        // }
        if (e === "no_kontrak") {
            this.dataFilterContract.pages = this.dataFilterContract.pages + 1;
            this.getDataContract();
        }
    }

    // getDataTaxAddres() {
    //     this._masterServ.getDataTaxAddress(this.datasentTaxAddres).then((x) => {
    //         this.dataTaxAddres = this.dataTaxAddres.concat(
    //             Array.from(x["data"])
    //         );
    //         console.log(this.dataTaxAddres);
    //         if (!this.total) {
    //             this.total = x["total"];
    //             this.from = x["from"] - 1;
    //             this.to = x["to"];
    //         }
    //     });
    // }

    // async getValTaxAddress(ev) {
    //     await console.log(ev);
    //     this.idAlamatPajak = ev.id_taxaddress;
    // }

    // sampleDibagi(sample) {
    //     this.datasampleSemua = this.datasampleSemua.concat({
    //         id_contract: sample.id_contract,
    //         idsample: sample.id,
    //         nosample: sample.no_sample,
    //         samplename: sample.sample_name,
    //         statuspengujian: sample.statuspengujian.name,
    //         price: sample.price,
    //         tgl_selesai: sample.tgl_selesai,
    //         discount: sample.discount,
    //         total: sample.price - sample.discount,
    //         status_pkm: sample.statuspkm,
    //     });
    //     if (!this.total) {
    //         this.total = sample["total"];
    //         this.from = sample["from"] - 1;
    //         this.to = sample["to"];
    //     }
    //     // let nonpaket = [];
    //     // let paketparameter = [];
    //     // let paketPKM = [];

    //     // datas.forEach((sample) => {
    //     //     console.log(sample.transactionbasicparameter);
    //     //     sample.transactionbasicparameter.filter((filt) => {

    //     //         if (filt.status == 1) {
    //     //             nonpaket = nonpaket.concat(filt)
    //     //             nonpaket = this.uniq(nonpaket, (it) => it.id_sample);
    //     //         }

    //     //         if(filt.status == 2){
    //     //           paketparameter = paketparameter.concat(filt)
    //     //           paketparameter = this.uniq(paketparameter, (it) => it.id_sample);
    //     //         }

    //     //         if(filt.status == 4){
    //     //           paketPKM = paketPKM.concat(filt)
    //     //           paketPKM = this.uniq(paketPKM, (it) => it.id_sample);
    //     //         }

    //     //     });

    //     //     console.log(nonpaket)
    //     //     console.log(paketparameter)
    //     //     console.log(paketPKM)

    //     //let param_nonpaket = sample.transactionparameter.filter((o) => console.log(o))
    //     // let paramPaket = sample.transactionparameter.filter((o) => {
    //     //   console.log(o)
    //     //   o.status_string == "PAKET"
    //     // })
    //     // let param_pkm = sample.filter((o) => o.transactionparameterstatus_string == "PAKET PKM")

    //     // sample.transactionparameter.forEach(m => {
    //     // console.log(m) F.1774 375500

    //     //   });
    //     //   this.datasampleSemua = this.datasampleSemua.concat({
    //     //     id_contract : sample.id_contract,
    //     //     idsample: sample.id,
    //     //     nosample: sample.no_sample,
    //     //     samplename: sample.sample_name,
    //     //     statuspengujian: sample.statuspengujian.name,
    //     //     price: sample.price,
    //     //     tgl_selesai: sample.tgl_selesai,
    //     //     discount : sample.discount ,
    //     //     total : sample.price - sample.discount ,
    //     //     status_pkm : sample.statuspkm
    //     // });
    //     // if(!this.total){
    //     //   this.total = sample['total'];
    //     //   this.from = sample['from'] - 1;
    //     //   this.to = sample['to']
    //     // }
    //     // });
    // }

    // inputSampling(ev) {
    //     this.priceSampling = ev;
    //     console.log(this.priceSampling);
    //     this.priceData();
    // }

    // inputIng(ev) {
    //     this.priceAkg = ev;
    //     console.log(this.priceAkg);
    //     this.priceData();
    // }

    // inputDP(ev) {
    //     this.priceDP = ev;
    //     console.log(this.priceDP);
    //     this.priceData();
    // }

    async priceData() {
        await this.nullPrice();
        await this.getPrice();
    }

    async getPrice() {
        this.priceTotalSample = await this.datasampleSemua
            .map((x) => x.price)
            .reduce((a, b) => a + b);
        let dt = this.dataKeuangan
            .map((x) => x.payment_condition.discount_lepas)
            .reduce((a, b) => a + b);
        
        if(this.checkdataContract[0] < 1){
            dt < 1
            ? (this.discountTotal = await this.datasampleSemua
                  .map((x) => x.discount)
                  .reduce((a, b) => a + b))
             : 
            // (this.discountTotal = await this.dataKeuangan
            //       .map((x) => x.payment_condition.discount_lepas)
            //       .reduce((a, b) => a + b));
            (this.discountTotal = await this.datasampleSemua
                .map((x) => x.discount)
                .reduce((a, b) => a + b))

        }else{
            this.discountTotal = this.checkInvoiceSplit;
        }
      

        await this.invoiceForm.controls.discounttotal.setValue(this.discountTotal);
        this.priceAkg =
            (await this.splitCheck) == false
                ? this.allDataAkg.map((x) => x.akg).reduce((a, b) => a + b)
                : this.editSampling;
        this.priceSampling =
            (await this.splitCheck) == false
                ? this.allSampling.map((z) => z.sample).reduce((a, b) => a + b)
                : this.editIng;
        this.priceSubTotal =
            (await (this.priceTotalSample +
                this.priceSampling +
                this.priceAkg +
                this.pricePPN)) - this.discountTotal;
        this.pricePPN = ((await this.priceSubTotal) * 11) / 100;
        this.priceDP =
            (await this.splitCheck) == false
                ? (await this.dataKeuangan[0].payment_data.length) > 0
                    ? this.dataKeuangan[0].payment_data
                          .map((x) => x.payment)
                          .reduce((a, b) => a + b)
                    : this.dataKeuangan[0].payment_condition.downpayment
                : this.editDP;
        this.discountLepas = await this.dataKeuangan[0].payment_condition
            .discount_lepas;
        this.priceTotal =
            (await (this.priceTotalSample - this.discountTotal)) +
            this.priceAkg +
            this.priceSampling +
            this.pricePPN;
        this.remainingpayment = Math.round((await this.priceTotal) - this.priceDP);
        console.log(this.remainingpayment)
        this.terbilangan = await terbilang(this.remainingpayment);
        
    }

    nullPrice() {
        this.priceTotalSample = null;
        this.priceAkg = null;
        this.priceSampling = null;
        this.pricePPN = null;
        this.discountTotal = null;
        this.priceSubTotal = null;
        this.priceDP = null;
        this.priceTotal = null;
    }


    async checkContract() {
        await this._masterServ.checkContract(this.noKontrak).then((x) => {
            this.checkdataContract = this.checkdataContract.concat(x);
        });
        if(this.checkdataContract[0] > 0){
            this.openNotif = true;
        }
        if(this.dataKeuangan[0].customers_handle.customers.warning)
        {
            await Swal.fire({
                title: "<strong>INFO PENTING!</strong>",
                text: "Mohon Pilih Alamat Yang Sesuai Pada Faktur",
                icon: "warning",
                confirmButtonText: "Ok",
              });
        }
    }


    async checkSplit() {
        if(this.checkdataContract[0] > 0){
            await this._masterServ.checkSplit(this.noKontrak[0]).then((x) => {
                console.log(x)
                this.checkInvoiceSplit = x;
            });
            if(this.checkInvoiceSplit < 1 ){
                await Swal.fire({
                    title: "<strong>DISCOUNT IS OVER!</strong>",
                    text: "please check again",
                    icon: "warning",
                    confirmButtonText: "Ok",
                  });
            }
        }
       
    }

    async getDateInvoice(ev) {
        let temp = await ev.value;
        let a = await new Date(ev.value)
        await this.invoiceForm.controls.tgl_faktur.setValue(a);
        let cek = await this.dataMou.length < 1 ? this.invoiceForm.get('termin').value : await this.invoiceForm.get('termin').value;
        let tes = await parseInt(cek)
        await temp.setDate(temp.getDate() + tes);
        let b = await new Date(temp)
        await this.invoiceForm.controls.tgl_jatuh_tempo.setValue(b);
    }

    async getMou() {
        this.mouStatusPengujian = await [];
        this.mouDiskon = await [];
        this.mouspecial = await true;
        await this._kontrakServ
            .getDataMou(
                this.dataKeuangan[0].customers_handle.customers.id_customer
            )
            .then((p) => {
                if (
                    p["status"] !== false &&
                    p["message"] === "Data Mou Found"
                ) {
                    this.dataMou = this.dataMou.concat(Array.from(p["data"]));

                    let a = this.dataMou[0].termin
                    this.invoiceForm.controls.termin.setValue(a);

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
                } else if (
                    p["message"].message === "Data Mou Expired" &&
                    p["status"] == false
                ) {
                    global.swalwarning(
                        p["message"].message,
                        `At ${p["data"][0].end_date}`
                    );
                } else {
                    this.invoiceForm.controls.termin.setValue(
                        this.dataKeuangan[0].customers_handle.customers
                            .termin == "Cash"
                            ? 0
                            : this.dataKeuangan[0].customers_handle.customers
                                  .termin
                    );
                }
            })
            console.log(this.invoiceForm.controls.termin)
    }

    createLabForm(): FormGroup {
        return this._formBuild.group({
            id_cust: [this.selectCust],
            cust_penghubung: [this.selectContact],
            cust_addres: [this.selectAddress],
            other_ref: [""],
            no_invoice: [""],
            no_faktur: [""],
            no_po: [""],
            tgl_faktur: [""],
            termin: [""],
            no_rekening: [""],
            tgl_jatuh_tempo: [""],
            tgl_berita_acara: [""],
            samplingfee: [""],
            ingfees: [""],
            downpayment: [""],
            desc_cs: [""],
            desc_invoice: [""],
            discounttotal: [""],
            format: this.selectFormat,
        });
    }


    async discount(ev)
    {
        this.totDiscount = await Math.round((this.datasampleSemua)
        .map((x) => x.discount)
        .reduce((a, b) => a + b))
        await this.totDiscount > await this.discountTotal ? this.notif_dic = await true : this.notif_dic =  await false
        await console.log(this.notif_dic)
        this.sisa = await Math.round(this.discountTotal - this.totDiscount) 
    }

    async saveForm() {
        this.loadingDisable = await true;
        if(this.notif_dic == true){
            await Swal.fire({
                title: "Discount error",
                text: "there is a problem with the discount!",
                icon: "warning",
                confirmButtonText: "Ok",
            });            
            this.loadingDisable = await false;
        }else{
            // let sample = await [];
            // await this.datasampleSemua.forEach((x) => {
            //     sample = sample.concat(x);
            // });
            // console.log(this.datasampleSemua)
            // console.log(sample)
            if (this.invoiceForm.value.tgl_faktur === "") {
                await Swal.fire({
                    title: "Incomplete Data",
                    text: "Please complete the blank data!",
                    icon: "warning",
                    confirmButtonText: "Ok",
                });
                this.loadingDisable = await false;
            } else {
                this.data = await {
                    no_invoice: this.invoiceForm.value.no_invoice,
                    no_po: this.invoiceForm.value.no_po,
                    no_faktur: this.invoiceForm.value.no_faktur,
                    tgl_faktur: _moment(this.invoiceForm.value.tgl_faktur).format('YYYY-MM-DD'),
                    tgl_jatuh_tempo: this.invoiceForm.value.tgl_jatuh_tempo == "" ? "" :  _moment(this.invoiceForm.value.tgl_jatuh_tempo).format('YYYY-MM-DD'),
                    tgl_berita_acara:
                    this.invoiceForm.value.tgl_berita_acara == "" ? "" : _moment(this.invoiceForm.value.tgl_berita_acara).format('YYYY-MM-DD'),
                    other_ref: this.invoiceForm.value.other_ref,
                    termin:this.invoiceForm.value.termin == null? null : this.invoiceForm.value.termin,
                    id_kontrakuji: this.noKontrak,
                    idsample: this.datasampleSemua,
                    id_cust: this.invoiceForm.value.id_cust,
                    cust_penghubung: this.invoiceForm.value.cust_penghubung,
                    cust_addres: this.invoiceForm.value.cust_addres,
                    rek: this.rekeningCheck == true ? "Y" : "N",
                    split: this.splitInvoice ,
                    totalcostsample: this.priceTotal,
                    samplingfee:  this.priceSampling,
                    ingfees: this.priceAkg,
                    discount: this.discountTotal,
                    priceSubTotal: this.priceSubTotal,
                    ppn: this.priceSubTotal*this.selectPPN,
                    downpayment:  this.priceDP,
                    remainingpayment: this.priceSubTotal + (this.priceSubTotal* this.selectPPN) - this.priceDP,
                    format: this.selectFormat,
                };
                if(this.totDiscount == undefined){
                    if(this.data.remainingpayment < 0)
                    {
                        await Swal.fire({
                            title: "Check Again!",
                            text: "check your nominal again",
                            icon: "warning",
                            confirmButtonText: "Ok",
                        });
                        this.loadingDisable = await false;
                    }else{
                        await this._masterServ.saveData(this.data).then((x) => {
                            this.load = true;
                            let message = {
                                text: "Data Succesfully Updated",
                                action: "Done",
                            };
                            setTimeout(() => {
                                this.openSnackBar(message);
                                this._route.navigateByUrl("analystpro/finance-invoice");
                                this.load = false;
                                this.loadingDisable = false;
                            }, 2000);
                        });
                    }
                    
                }else{
                    if(this.data.remainingpayment < 0)
                    {
                        await Swal.fire({
                            title: "Check Again!",
                            text: "check your nominal again",
                            icon: "warning",
                            confirmButtonText: "Ok",
                        });
                        this.loadingDisable = await false;
                    }else{
                        await this._masterServ.saveDataWithDiscount(this.data).then((x) => {
                            this.load = true;
                            let message = {
                                text: "Data Succesfully Updated",
                                action: "Done",
                            };
                            setTimeout(() => {
                                this.openSnackBar(message);
                                this._route.navigateByUrl("analystpro/finance-invoice");
                                this.load = false;
                                this.loadingDisable = false;
                            }, 2000);
                        });
                    }                   
                }                 
            }
        }
       

        
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }

    async deleteRow(i) {
        console.log(i);
        await console.log({
            i: this.datasampleSemua[i],
        });
        await this.datasampleSemua.splice(i, 1);
        this.MatTable.renderRows();
        this.priceData();
    }

    // disableForm() {
    //     console.log(this.invoiceForm);
    // }

    async enableForm() {
        await this.invoiceForm.get("no_rekening").enable();
    }

    async openInvoice() {
        this.data = {};
        console.log(
            _moment(new Date(this.invoiceForm.value.tgl_faktur)).format(
                "YYYY-MM-DD"
            )
        );
        console.log(this.invoiceForm);

        this.custNamee = await null;
        this.nameee = await null;
        this.addresss = await null;

        await this._masterServ
            .checkCustomer(this.invoiceForm.value.id_cust)
            .then((x: any) => {
                this.custNamee = x.customer_name;
            });
        await this._masterServ
            .checkCP(this.invoiceForm.value.cust_penghubung)
            .then((x: any) => {
                this.nameee = x.name;
            });
        await this._masterServ
            .checkAddress(this.invoiceForm.value.cust_addres)
            .then((x: any) => {
                this.addresss = x.address;
            });

        this.data = await {
            no_invoice: this.invoiceForm.value.no_invoice,
            customer: this.custNamee,
            cust_penghubung: this.nameee,
            cust_addres: this.addresss,
            telp: this.selectTelpName,
            fax: this.selectFaxName,
            kontrak: this.selectKontrakName,
            no_po: this.selectPOName,
            no_faktur: this.invoiceForm.value.no_faktur,
            tgl_faktur: _moment(
                new Date(this.invoiceForm.value.tgl_faktur)
            ).format("YYYY-MM-DD"),
            tgl_jatuh_tempo:
                this.invoiceForm.value.tgl_jatuh_tempo == ""
                    ? "-"
                    : _moment(
                          new Date(this.invoiceForm.value.tgl_jatuh_tempo)
                      ).format("YYYY-MM-DD"),
            tgl_berita_acara:
                this.invoiceForm.value.tgl_berita_acara == ""
                    ? ""
                    : _moment(
                          new Date(this.invoiceForm.value.tgl_berita_acara)
                      ).format("YYYY-MM-DD"),
            other_ref: this.invoiceForm.value.other_ref,
            //termin: this.invoiceForm.value.termin == null ? '-' : this.invoiceForm.value.termin,
            termin: this.termins,
            id_kontrakuji: this.noKontrak,
            samples: this.datasampleSemua,
            no_rekening: this.invoiceForm.value.cust_addres,
            rek: this.rekeningCheck == true ? "Y" : "N",
            split: this.splitCheck == true ? "Y" : "N",
            totalcostsample: this.priceTotal,
            samplingfee:
                this.splitCheck == true
                    ? this.editSampling
                    : this.priceSampling,
            ingfees: this.splitCheck == true ? this.editIng : this.priceAkg,
            ppn: this.pricePPN,
            discount: this.discountTotal,
            priceSubTotal: this.priceSubTotal,
            downpayment: this.splitCheck == true ? this.editDP : this.priceDP,
            remainingpayment: this.remainingpayment,
            terbilang: this.terbilangan,
            conditionInvoice: this.conditionStatus,
            printed: 0,
        };
        await console.log(this.data);
        await this.invoicePdf.generatePdf(this.data);
        console.log(this.data);
    }

    async openInvoiceTTD() {
        this.custNamee = await null;
        this.nameee = await null;
        this.addresss = await null;

        await this._masterServ
            .checkCustomer(this.invoiceForm.value.id_cust)
            .then((x: any) => {
                this.custNamee = x.customer_name;
            });
        await this._masterServ
            .checkCP(this.invoiceForm.value.cust_penghubung)
            .then((x: any) => {
                this.nameee = x.name;
            });
        await this._masterServ
            .checkAddress(this.invoiceForm.value.cust_addres)
            .then((x: any) => {
                this.addresss = x.address;
            });

        console.log(this.datasampleSemua);
        let data = await {
            no_invoice: this.invoiceForm.value.no_invoice,
            customer: this.custNamee,
            cust_penghubung: this.nameee,
            cust_addres: this.addresss,
            telp: this.selectTelpName,
            fax: this.selectFaxName,
            kontrak: this.selectKontrakName,
            no_po: this.selectPOName,
            no_faktur: this.invoiceForm.value.no_faktur,
            tgl_faktur: _moment(
                new Date(this.invoiceForm.value.tgl_faktur)
            ).format("YYYY-MM-DD"),
            tgl_jatuh_tempo:
                this.invoiceForm.value.tgl_jatuh_tempo == ""
                    ? ""
                    : _moment(
                          new Date(this.invoiceForm.value.tgl_jatuh_tempo)
                      ).format("YYYY-MM-DD"),
            tgl_berita_acara:
                this.invoiceForm.value.tgl_berita_acara == ""
                    ? ""
                    : _moment(
                          new Date(this.invoiceForm.value.tgl_berita_acara)
                      ).format("YYYY-MM-DD"),
            other_ref: this.invoiceForm.value.other_ref,
            //termin: this.invoiceForm.value.termin == null ? '-' : this.invoiceForm.value.termin,
            termin: this.termins,
            id_kontrakuji: this.noKontrak,
            samples: this.datasampleSemua,
            no_rekening: this.invoiceForm.value.cust_addres,
            rek: this.rekeningCheck == true ? "Y" : "N",
            split: this.splitCheck == true ? "Y" : "N",
            totalcostsample: this.priceTotal,
            samplingfee:
                this.splitCheck == true
                    ? this.editSampling
                    : this.priceSampling,
            ingfees: this.splitCheck == true ? this.editIng : this.priceAkg,
            ppn: this.pricePPN,
            discount: this.discountTotal,
            priceSubTotal: this.priceSubTotal,
            downpayment: this.splitCheck == true ? this.editDP : this.priceDP,
            remainingpayment: this.remainingpayment,
            terbilang: this.terbilangan,
            conditionInvoice: this.conditionStatus,
            printed: 2,
        };
        await console.log(data);
        this.invoicePdf.generatePdf(data);
    }

    async clickAllData(param) {        
        // this.allData = param;

        if (param == true) {
                this.customersData = await [];
                this.cpData = await [];
                this.alamatcustomer = await [];
                this.getDataCustomer();
                this.getDataCP();
        } else {
            console.log("false all data");
            this.customersData = await [];
            this.cpData = await [];
            this.alamatcustomer = await [];
            console.log(this.dataKeuangan);
            await this.dataKeuangan.forEach((x, i) => {
                this.conditionStatus = this.dataKeuangan[0].invoice_condition;

                // for select into customer
                let a = {
                    id_customer:
                        this.dataKeuangan[i].customers_handle.customers
                            .id_customer,
                    customer_name:
                        this.dataKeuangan[i].customers_handle.customers
                            .customer_name,
                };
                this.selectCust =
                    this.dataKeuangan[0].customers_handle.customers.id_customer;
                this.selectCustName =
                    this.dataKeuangan[0].customers_handle.customers.customer_name;

                // for select into contact persons
                let c = {
                    id_cp: this.dataKeuangan[i].customers_handle.contact_person
                        .id_cp,
                    name: this.dataKeuangan[i].customers_handle.contact_person
                        .name,
                };
                this.selectContact =
                    this.dataKeuangan[0].customers_handle.id_cp;
                this.selectContactName =
                    this.dataKeuangan[0].customers_handle.contact_person.name;

                // for select into address
                let m = {
                    id_address: this.dataKeuangan[i].cust_address.id_address,
                    address: this.dataKeuangan[i].cust_address.address,
                };
                this.selectAddress =
                    this.dataKeuangan[0].cust_address.id_address;
                this.selectAddressName =
                    this.dataKeuangan[0].cust_address.address;

                this.customersData.push(a);
                this.cpData.push(c);
                this.alamatcustomer.push(m);

                this.selectTelpName =
                    this.dataKeuangan[0].customers_handle.telp;
                this.selectFaxName = this.dataKeuangan[0].customers_handle.fax;
                this.selectKontrakName = this.dataKeuangan[0].contract_no;
                this.selectPOName = this.dataKeuangan[0].no_po;
            });
        }
    }

    // checkRek(check: boolean) {
    //     this.rekeningCheck = check;
    //     this.rekeningCheck == true ? this.enableForm() : this.disableForm();
    // }

    // async checkSplit(checkSplit: boolean) {
    //     console.log(checkSplit);
    //     this.splitCheck = await checkSplit;
    //     await this.invoiceForm.controls.samplingfee.setValue(
    //         this.priceSampling
    //     );
    //     await this.invoiceForm.controls.ingfees.setValue(this.priceAkg);
    //     await this.invoiceForm.controls.downpayment.setValue(this.priceDP);
    //     console.log([this.priceSampling, this.priceAkg, this.priceDP]);
    // }

    downloadExcel() {
        console.log(this.datasampleSemua);
        const fileName = "report " + this.noKontrak + ".xlsx";
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
            this.datasampleSemua
        );
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "data");

        XLSX.writeFile(wb, fileName);
    }

    async inputDiscount(ev, i){
        console.log(this.discountTotal)
        this.priceTotalSample = await this.priceTotalSample
        await  this.splitInvoice == true ?  this.priceAkg = this.invoiceForm.value.samplingfee :  this.priceAkg = this.priceAkg
        await  this.splitInvoice == true ? this.priceSampling = this.invoiceForm.value.ingfees :  this.priceSampling = this.priceSampling
        await  this.splitInvoice == true ? this.discountTotal = this.invoiceForm.value.discounttotal : this.discountTotal = this.discountTotal
        this.priceSubTotal =  await (this.priceTotalSample - this.discountTotal) + this.priceSampling + this.priceAkg ;    
        this.pricePPN = await this.priceSubTotal * 11/100;
        this.priceDP =  await  this.splitInvoice == true ?  this.priceDP = this.invoiceForm.value.downpayment :  this.priceDP = this.priceDP;
        console.log([this.priceTotalSample, this.priceSampling, this.priceAkg , this.pricePPN, this.discountTotal, this.priceDP ])
        this.remainingpayment = await ((this.priceTotalSample - this.discountTotal) + this.priceSampling + this.priceAkg + this.pricePPN ) - this.priceDP;
        this.terbilangan = await terbilang(this.remainingpayment)
      }
}
