import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { MatSort, Sort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as XLSX from "xlsx";
import { ComplainService } from "../complain.service";
import { DescDialogComponent } from "./modals/desc-dialog/desc-dialog.component";
import { AddDialogComponent } from "./modals/add-dialog/add-dialog.component";
import { SelectDialogComponent } from "./modals/select-dialog/select-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerService } from "../../master/customers/customer.service";
import { PageEvent } from "@angular/material/paginator";
import { PriviewDialogComponent } from "./modals/priview-dialog/priview-dialog.component";

@Component({
    selector: "app-csocomplain",
    templateUrl: "./csocomplain.component.html",
    styleUrls: ["./csocomplain.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})

export class CsocomplainComponent implements OnInit {
    load = false;
    loadingfirst = true;
    displayedColumns: string[] = [
        "contract_no",
        "customer",
        "lhu_number",
        "no_sample",
        "sample_name",
        "stats",
        "status",
        "action",
    ];

    complainData = [];
    total: number;
    from: number;
    to: number;
    pages = 1;
    current_page : number;

    data = {
        id: "",
    };
    searchFilter = false;
    datasent = {
        pages: 1,
        marketing: null,
        principle: null,
        category: null,
        status: null,
    };

    datasentCategory = {
        pages: 1,
        search: null,
        typeContract: null,
    };

    dataFilter = {
        pages: 1,
        type: "paginate",
        marketing: "",
        status: "",
        customer_name: null,
        lhu: "",
        category: "",
        typeAdd: "",
        day : "",
        month: "",
        year: "",
    };

    contractcategory = [];
    statusPengujian = [];

    cobaData = null;
    cancelSearch = false;
    resultForm: FormGroup;

    formData = {
        marketing : '',
        id_customer : null,
        lhu : '',
        type: '',
        status : ''
    }

    status = [
        {
            title: "New",
            id: 0,
        },
        {
            title: "Proccess",
            id: 1,
        },
        {
            title: "Done",
            id: 2,
        },
    ];

    datasentCustomer = {
        pages: 1,
        search: null,
    };
    customersData = [];

    typeStat = [
        {
            title: "sigconnect",
            id: 3,
        },
        {
            title: "email",
            id: 2,
        },
        {
            title: "add",
            id: 1,
        },
        {
            title: "all",
            id: '',
        },
    ];

    dataCustomer = [];
    pageEvent: PageEvent;
    totalCust: number;
    fromCust: number;
    toCust: number;
    pagesCust = 1;
    current_pageCust : number;

    months = [
        {
            month : 'January',
            id : '01'
        },
        {
            month : 'February',
            id : '02'
        },
        {
            month : 'March',
            id : '03'
        },
        {
            month : 'April',
            id : '04'
        },
        {
            month : 'May',
            id : '05'
        },
        {
            month : 'June',
            id : '06'
        },
        {
            month : 'July',
            id : '07'
        },
        {
            month : 'August',
            id : '08'
        },
        {
            month : 'September',
            id : '09'
        },
        {
            month : 'October',
            id : '10'
        },
        {
            month : 'November',
            id : '11'
        },
        {
            month : 'December',
            id : '12'
        },
    ]

    days = [
        {
            dd : '01'
        },
        {
            dd : '02'
        },
        {
            dd : '03'
        },
        {
            dd : '04'
        },
        {
            dd : '05'
        },
        {
            dd : '06'
        },
        {
            dd : '07'
        },
        {
            dd : '08'
        },
        {
            dd : '09'
        },
        {
            dd : '10'
        },
        {
            dd : '11'
        },
        {
            dd : '12'
        },
        {
            dd : '13'
        },
        {
            dd : '14'
        },
        {
            dd : '15'
        },
        {
            dd : '16'
        },
        {
            dd : '17'
        },
        {
            dd : '18'
        },
        {
            dd : '19'
        },
        {
            dd : '20'
        },
        {
            dd : '21'
        },
        {
            dd : '22'
        },
        {
            dd : '23'
        },
        {
            dd : '24'
        },
        {
            dd : '25'
        },
        {
            dd : '26'
        },
        {
            dd : '27'
        },
        {
            dd : '28'
        },
        {
            dd : '29'
        },
        {
            dd : '30'
        },
        {
            dd : '31'
        },
    ]

    years = [
        { 
            y : 2021
        },
        { 
            y : 2022
        },
        { 
            y : 2023
        },
        { 
            y : 2024
        },
        { 
            y : 2025
        },
    ]

    constructor(
        private _masterServ: ComplainService,
        private _formBuild: FormBuilder,
        private _matDialog: MatDialog,
        private _router: Router,
        private _msterCust: CustomerService,
    ) {}

    ngOnInit(): void {
        this.getData();
        this.getDataCustomer();
    }

    async getData() {
        console.log(this.dataFilter)
        await this._masterServ
            .getDataCso(this.dataFilter)
            .then((x) => {
                this.complainData = this.complainData.concat(
                    Array.from(x["data"])
                );
                this.complainData = this.uniq(this.complainData, (it) => it.id);
                this.total = x["total"];
                this.from = x["from"] - 1;
                this.to = x["to"];
            })
        this.loadingfirst = await false;
        console.log(this.complainData)
    }

    paginated(f) {
        console.log(f);
        this.complainData = [];
        this.dataFilter.pages = f.pageIndex + 1;
        this.getData();
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    descData(data) {
        const dialogRef = this._matDialog.open(DescDialogComponent, {
            panelClass: "complain-desc-dialog",
            width: "500px",
            data: data,
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("dialog close");
        });
    }

    addData() {
        const dialogRef = this._matDialog.open(AddDialogComponent, {
            panelClass: "complain-add-dialog",
            width: "600px",
            disableClose : true
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result.v == false) {
                this.complainData = [];
                this.getData();
            }
        });
    }

    selectData(data) {
        console.log(data)
        const dialogRef = this._matDialog.open(SelectDialogComponent, {
            panelClass: "complain-select-dialog",
            autoFocus: false,
            maxHeight: "800px",
            width: "100%",
            data: {
                data: data,
                status: "cs",
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result.a == false){
                this.complainData = [];
                this.getData();
            }
        });
    }

    gotoDetailContract(v) {
        const url = this._router.serializeUrl(
            this._router.createUrlTree([`/analystpro/view-contract/${v}`])
        );
        let baseUrl = window.location.href.replace(this._router.url, "");
        window.open(baseUrl + url, "_blank");
    }
    

    async searchButton(){
        // console.log(this.formData)
        // this.dataFilter.marketing = await this.formData.marketing
        // this.dataFilter.customer_name = await this.formData.id_customer
        // this.dataFilter.lhu =   await this.formData.lhu
        // this.dataFilter.type =  await  this.formData.type
        // this.dataFilter.status = await this.formData.status
        this.loadingfirst = await true;
        this.complainData = await [];
        await this.getData();
    }

    async cancelSearchMark()
    {
        this.dataFilter.marketing = await ''
        this.dataFilter.customer_name  = await ''
        this.dataFilter.lhu  = await ''
        this.dataFilter.type  = await 'paginate'
        this.dataFilter.status  = await ''
        this.dataFilter.typeAdd  = await ''
        this.dataFilter.day  = await ''
        this.dataFilter.month  = await ''
        this.dataFilter.year  = await ''

        this.complainData = await [];
        this.total = await null
        this.from = await null
        this.to = await null
        this.loadingfirst = await true;
        await this.getData();
    }

    getDataCustomer() {
        console.log(this.datasentCustomer);
        this._msterCust
            .getDataCustomers(this.datasentCustomer)
            .then((x) => {
                this.dataCustomer = this.dataCustomer.concat(
                    Array.from(x["data"])
                );
                this.dataCustomer = this.uniq(
                    this.dataCustomer,
                    (it) => it.id_customer
                );
                console.log(this.dataCustomer);
                this.totalCust = x["total"];
                this.fromCust = x["from"] - 1;
                this.toCust = x["to"];
            });
        console.log(this.dataCustomer);
    }

    onsearchselect(ev, val){
        if (val === "customer") {
          this.dataCustomer = [];
          this.datasentCustomer.search = ev.term;
          this.datasentCustomer.pages = 1;
          this.getDataCustomer();
        }
      }
    
    onScrollToEnd(e) {
        if (e === "customer") {
            this.datasentCustomer.pages = this.datasentCustomer.pages + 1;
            this._msterCust
                .getDataCustomers(this.datasentCustomer)
                .then((x) => {
                    this.dataCustomer = this.dataCustomer.concat(x["data"]);
                    console.log(this.dataCustomer);
                });
        }
    }
    
    deleteComplain(id)
    {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._masterServ.deleteComplain(id).then(x => {
        })
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
      setTimeout(()=>{
        this.complainData=[];
        this.loadingfirst =  true;
        this.getData();
        this.load = false;
      },1000)
    })
    }

    priviewDialog(data) {
        const dialogRef = this._matDialog.open(PriviewDialogComponent, {
            panelClass: "complain-view-dialog",
            autoFocus: false,
            maxHeight: "800px",
            width: "100%",
            data: {
                data: data,
                status: "cs",
            },
            disableClose : true
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result.a == false){
                this.complainData = [];
                this.getData();
            }
        });
    }

    downloadData = [];
    async downloadDataExcel()
    {
        this.downloadData = await [];

        await this._masterServ
        .csoDownloadData(this.dataFilter)
        .then((x) => {
            
            // this.downloadData = this.uniq(this.downloadData, (it) => it.id);
            let b = [];
            b = b.concat(x);
            console.log(b)
            b.forEach((a) => {
                this.downloadData = this.downloadData.concat({
                    tanggal_input : a.complain_tech.complain.created_at,
                    penerima : a.complain_tech.complain.user.employee_name,
                    no_kontrak : a.complain_tech.kontrak_uji.contract_no,
                    lhu : a.complain_tech.complain.transaction_certificate.lhu_number,
                    no_sample : a.complain_tech.complain.transaction_certificate.no_sample,
                    nama_perusahaan : a.complain_tech.kontrak_uji.customers_handle.customers.customer_name,
                    personil : a.complain_tech.kontrak_uji.customers_handle.contact_person.name,
                    email : a.complain_tech.kontrak_uji.customers_handle.email,
                    parameter: a.parameteruji == null ? '-' :  a.parameteruji.name_id,
                    komplain : a.complain_desc == 1 ? 'Hasil Ketinggian' : a.complain_desc == 2 ? 'Hasil Kerendahan' : 'Tidak Sesuai Spec',
                    expektasi : a.expectation,
                    hasil_awal : a.hasiluji,
                    satuan : a.unit.nama_unit,
                    status : a.complain_tech.complain.transaction_certificate.id_statuspengujian == 1 ? 'Normal' : a.complain_tech.complain.transaction_certificate.id_statuspengujian == 2 ? 'Urgent' : a.complain_tech.complain.transaction_certificate.id_statuspengujian == 3 ? 'Very Urgent' : a.complain_tech.complain.transaction_certificate.id_statuspengujian == 4 ? 'Custom 2' : 'Custom 1',
                    Estimasi : a.complain_tech.estimate_date
                });
            })
        })
        this.loadingfirst = await false;
        const fileName = await 'test.xlsx'; 

        const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(this.downloadData);
        const wb: XLSX.WorkBook = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, 'data');  
        await XLSX.writeFile(wb, fileName);
    }


}
