import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from "@angular/core";
import { ContractService } from "../../../services/contract/contract.service"; 
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerhandleService } from "../../../services/customerhandle/customerhandle.service";
import { ContractcategoryService } from "../../../services/contractcategory/contractcategory.service";
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    FormArray,
    Form,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ParameterModalComponent } from "../../../modal/parameter-modal/parameter-modal.component";
import { CustomershandleModalComponent } from "../../../modal/customershandle-modal/customershandle-modal.component";
import { SamplingModalComponent } from "../../../modal/sampling-modal/sampling-modal.component";
import { AkgModalComponent } from "../../../modal/akg-modal/akg-modal.component";
import { AddressCustomerComponent } from "../../../modal/address-customer/address-customer.component";
import { TaxAddressCustomerComponent } from "../../../modal/tax-address-customer/tax-address-customer.component";
import Swal from 'sweetalert2';
export const MY_FORMATS = {
    parse: {
        dateInput: 'LLLL'
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LLLL',
        monthYearA11yLabel: 'YYYY'
    }
};

export interface datasampleElement {
    no: number;
    nosample: string;
    samplename: string;
    parameter: Param[];
}

export interface Param {
    foto: Foto[];
    jeniskemasan: string;
    paketparameter: number;
    parameterdata: Paramdata[];
    parameteruji: string;
    tgl_kadaluarsa: string;
    tgl_produksi: string;
    tujuanpengujian: number;
    totalpembayaran: number;
}

export interface Foto {
    id: string;
    photo: string;
}

export interface Paramdata {
    id: string;
    hargaParameter: number;
    lab_name: string;
    lod: string;
    name_en: string;
    name_id: string;
    status: string;
}

@Component({
  selector: 'app-pricing-part',
  templateUrl: './pricing-part.component.html',
  styleUrls: ['./pricing-part.component.scss'],
  animations   : fuseAnimations
})
export class PricingPartComponent implements OnInit {
  totalpembayaran: number;
  totalbiayapengujian: number;
  biayasample = 0;
  biayaakg = 0;
  subtotal = 0;
  pph = 0;
    ppn = 0;
    load = false;
    discount = 0;
    hasilDiscount = 0;
    uangmuka = 0;
  sisapembayaran: number;
  samplingdata = [];
  akgdata = [];
  dataIdParameter = [];
  dataParameter = [];
  hideForm = true; 
  idContrack: any;
  idkontrakuji: any;

  constructor(
    private _kontrakServ: ContractService,
        private _custHandleServ: CustomerhandleService,
        private _contractCatServ: ContractcategoryService,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _route: Router, 
        private _actRoute: ActivatedRoute,
        private dialog: MatDialog
  ) { 
    this.idContrack = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this._kontrakServ.dataIdparameter.subscribe(async x => { 
        this.dataIdParameter = x;
        console.log(this.dataIdParameter);
        this.idkontrakuji = x.idkontrakuji;
        console.log(this.idkontrakuji);
        if (this.dataIdParameter.length === 0 ){
            this.hideForm = false;
            Swal.fire({
                title: 'NotFound Data Contract',
                text: 'Please Create Data Contract!',
                icon: 'warning', 
                confirmButtonText: 'Ok'
            });
        }else{
            this.dataParameter = [];
            this.dataParameter = this.dataParameter.concat(x);
            console.log(this.dataParameter);
            this.totalpembayaran = this.dataParameter[0].massage.total_harga;
        }       
    });
  }

  async perhitungan(){
    let a =
    await this.totalpembayaran +
    await this.biayasample +
    await this.biayaakg +
    await this.ppn -
    await this.hasilDiscount;

    let b =
    await this.totalpembayaran +
    await this.biayasample + 
    await this.biayaakg -
    await this.hasilDiscount;

    this.subtotal = await a;
    this.ppn = 
    await 10 / await 100 * await b;

    this.sisapembayaran = (this.subtotal > 0 ? this.subtotal : 0) - (this.pph > 0 ? this.pph : 0) - (this.uangmuka > 0 ? this.uangmuka : 0);
  }

  async gotosampling() {
    let dialogCust = await this.dialog.open(SamplingModalComponent, {
        height: "auto",
        width: "800px",
        data: this.biayasample > 0 ? this.samplingdata : null,
    });
    await dialogCust.afterClosed().subscribe((result) => {
        console.log(result);
        this.biayasample = result.b;
        this.samplingdata = this.samplingdata.concat(result.a);
        this.perhitungan();
    });
  }

  async gotoakg() {
    let dialogCust = await this.dialog.open(AkgModalComponent, {
        height: "auto",
        width: "800px",
        data: this.biayaakg > 0 ? this.akgdata : null,
    });
    await dialogCust.afterClosed().subscribe((result) => {
        console.log(result);
        this.akgdata = this.akgdata.concat(result.a);
        this.biayaakg = result.b;
        this.perhitungan();
    });
  }



  mychange(ev, value) {
    if (value === "discount") {
        this.discount = ev;
        let a = this.discount / 100 * this.totalpembayaran;
        this.hasilDiscount = a;
        
    } else if (value === "biaya") {
        this.biayasample = ev;
        this.perhitungan();
    } else if (value === "ppn") {
        this.ppn = ev;
        this.perhitungan();
    } else if (value === "pph") {
        this.pph = ev;
        this.perhitungan();
    } else if (value === "uangmuka") {
        this.uangmuka = ev;
        this.perhitungan();
    } else if (value === "akg") {
        this.biayaakg = ev;
        this.perhitungan();
    }
        // this.perhitungan();
  }



  saveForm(){
    if (
        this.biayasample === 0 ||
        this.biayaakg === 0 ||
        this.discount === 0 ||
        this.hasilDiscount === 0 ||
        this.ppn === 0 ||
        this.subtotal === 0 ||
        // this.pph === 0 ||
        this.uangmuka === 0 
    ){
            Swal.fire({
                title: 'Data Belum Lengkap',
                text: 'Mohon Lengkapi Data !',
                icon: 'warning', 
                confirmButtonText: 'Ok'
            })
    }else {

        let price = {
            idkontrakuji: this.idkontrakuji,
            biayaakg: this.akgdata,
            biayasample: this.samplingdata,
            discountlepas: this.discount,
            ppn: this.ppn,
            subtotal: this.subtotal,
            pph: this.pph,
            uangmuka: this.uangmuka   
        }  
        console.log(price);

        Swal.fire({
            title: 'Are you sure?',
            text: 'You will Save this Data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save!',
            cancelButtonText: 'No, Cancel It'
          }).then((result) => {
            if (result.value) {
              this._kontrakServ.saveDataPrice(price).then((g) => { 
                console.log(g);

                //menyimpan data di service
                this._kontrakServ.newData(g);  
                this.load = true;
                let message = {
                  text: 'Data Succesfully Save',
                  action: 'Done'
                }
                setTimeout(()=>{
                  this.openSnackBar(message);
                  this._route.navigateByUrl('analystpro/contract-preview');
                  this.load = false;
                },2000)
              });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
              )
            }
        }); 
    }
  }



  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }
}
