import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from "@angular/core";
import { ContractService } from "../../../services/contract/contract.service"; 
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerhandleService } from "../../../services/customerhandle/customerhandle.service";
import { ContractcategoryService } from "../../../services/contractcategory/contractcategory.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from '@fuse/animations';
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
import { ParameterPartModalComponent } from "../parameter-part-modal/parameter-part-modal.component";
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
    tgl_input: string;
    tgl_selesai: string;
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
  selector: 'app-parameter-part',
  templateUrl: './parameter-part.component.html',
  styleUrls: ['./parameter-part.component.scss'],
  animations   : fuseAnimations
})
export class ParameterPartComponent implements OnInit {
 
    pageindex: number;
        displayedColumns: string[] = ["no", "nosample", "samplename", "action"];
        @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

        @Input()
        dataParam = [];
    
        @Output()
    datasample2 = [
        {
            no: 1,
            nosample: "",
            samplename: "",
            tgl_input: "",
            tgl_selesai: "",
            parameter: [],
        },
    ]; 
    load = false;
    dataSource = new MatTableDataSource<datasampleElement>(this.datasample2);
    idContrack: any;
    copyvalue;
    pasteallbutton = true;
    pastevalue = true;
    category_code: number;
    totalpembayaran: number;
    dataIdSample = [];
    hideForm = true;
    idContrak: any;


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
            this._kontrakServ.dataIdsample.subscribe(async x => { 
                this.dataIdSample = x;
                console.log(this.dataIdSample);
                this.idContrak = x.data[0].idkontrakuji;
                console.log(this.idContrak); 
                if (this.dataIdSample.length === 0 ){
                    this.hideForm = false;
                    Swal.fire({
                        title: 'NotFound Data Contract',
                        text: 'Please Create Data Contract!',
                        icon: 'warning', 
                        confirmButtonText: 'Ok'
                    });
                } else {
                    this.datasample2 = [];
                    this.datasample2 = this.datasample2.concat(x["data"]); 
                    this.dataSource = new MatTableDataSource<datasampleElement>(
                        this.datasample2
                    );
                    this.dataSource.paginator = this.paginator; 
                    
                }
            }); 
    }  

    async copythis(e) {
        await console.log(e);
        this.copyvalue = await "";
        this.pasteallbutton = await false;
        this.copyvalue = await e;
        await console.log(this.copyvalue);
        this.pastevalue = await false;
    }

    setNumber(v){
        let date = new Date();
        let conso = `${date.getFullYear().toString().substr(-2)}${date.getMonth()}-${date.getHours()}${date.getMinutes()}${date.getMilliseconds()}-${this.category_code}-${this.leftPad(v, 3)}`;
        return conso;
    }

    leftPad(number, targetLength) {
        var output = number + "";
        while (output.length < targetLength) {
            output = "0" + output;
        }
        return output;
    }

    async pastethis(i) {
        await console.log(i);
        await console.log(this.copyvalue);
        let numberarray = await i + (this.pageindex === undefined ? 0 : this.pageindex * 5);
        this.datasample2[numberarray].no = await numberarray + 1;
        this.datasample2[numberarray].nosample = await this.setNumber(numberarray);
        this.datasample2[numberarray].samplename = await this.copyvalue.samplename;
        await this.datasample2[numberarray].parameter.push(this.copyvalue.parameter[0]);
        await console.log(this.datasample2);

        let b = await this.datasample2
            .map((x) => x.parameter[0].totalpembayaran)
            .reduce((c, a) => c + a);
        this.totalpembayaran = await b;
        await console.log(this.totalpembayaran);
    }

    pasteall() {
        let i = this.datasample2.length;
        for (let u = 0; u < i; u++) {
            this.datasample2[u].no = u+1;
            this.datasample2[u].nosample = this.setNumber(u+1); 
            this.datasample2[u].samplename = this.copyvalue.samplename;
            this.datasample2[u].parameter = this.copyvalue.parameter;
        }
        this.dataSource.data = this.datasample2;
        this.dataSource.paginator = this.paginator;
        let b = this.datasample2
            .map((x) => x.parameter[0].totalpembayaran)
            .reduce((c, a) => c + a);
        this.totalpembayaran = b; 
        console.log(this.datasample2);
        
    }

    paginated(ev) {
        this.pageindex = ev.pageIndex;
        if (ev.pageIndex > 0) {
            console.log(ev.pageIndex * 5);
        }
    }

    tambah() {
        console.log(this.datasample2);
        console.log(this.category_code);
        this.datasample2.push({
            no:
                this.datasample2.length > 0
                    ? this.datasample2[this.datasample2.length - 1].no + 1
                    : 1,
            nosample: this.setNumber(this.datasample2.length + 1),
            samplename: "",
            tgl_input: "",
            tgl_selesai: "",
            parameter: [],
        });
        this.dataSource = new MatTableDataSource<datasampleElement>(
            this.datasample2
        );
        this.dataSource.paginator = this.paginator;
    }

    kurang() {
        this.datasample2.splice(-1, 1);
        this.dataSource = new MatTableDataSource<datasampleElement>(
            this.datasample2
        );
        this.dataSource.paginator = this.paginator;
    }

    changeval(e) {
        let x = e.target.value;
        for (let i = 0; i < x; i++) {
            this.datasample2.push({
                no: this.datasample2[i].no + 1,
                nosample: "",
                samplename: "",
                tgl_input: "",
                tgl_selesai: "",
                parameter: [],
            });
            this.dataSource = new MatTableDataSource<datasampleElement>(
                this.datasample2
            );
            this.dataSource.paginator = this.paginator;
        }
    }

    async deleteRow(i){
        let a = (this.pageindex * 5) + i;
        await console.log({
            i: this.datasample2[a],
            k: this.pageindex
        });
        await this.datasample2.splice(a,1);
        this.dataSource.data = await this.datasample2;
    }

    getValueSample(event, index) {
        this.datasample2[index].samplename = event.target.value;
        this.dataSource = new MatTableDataSource<datasampleElement>(
            this.datasample2
        );
        this.dataSource.paginator = this.paginator;
    }





    async openModalParameter(v, i) {
        console.log(v);  

                const dialogRef = await this.dialog.open(ParameterPartModalComponent, {
                  height: "auto",
                  width: "1080px",
                  panelClass:'parameter-modal',
                  data: {   
                      idContrack: this.idContrack, 
                    //   contract_no: this.ContractForm.controls.contract_no,
                      no_sample: v.nosample,
                      sample: this.datasample2[i],
                      samplename: v.samplename,
                    //   tgl_input: this.ContractForm.controls.tgl_input.value,
                    //   tgl_selesai: this.ContractForm.controls.tgl_selesai.value,
                  },
                });
                await dialogRef.afterClosed().subscribe(async (result) => {
                  await console.log(result);
                  this.datasample2[i].parameter = [];
                  await this.datasample2[i].parameter.push(result.c);
                  console.log(this.datasample2); 
                });  
    }


    saveForm(){
        if (
            this.datasample2[0].parameter.length === 0 
        ){
                Swal.fire({
                    title: 'Data Belum Lengkap',
                    text: 'Mohon Lengkapi Data !',
                    icon: 'warning', 
                    confirmButtonText: 'Ok'
                })
        }else { 

            let data = [];
            this.datasample2.forEach((k) => {
                data = data.concat({
                    idsample: k['sample'][0].idsample,
                    totalprice: k['parameter'][0].totalpembayaran,
                    id_statuspengujian: k['parameter'][0].statuspengujian,
                    tgl_input: k['parameter'][0].tgl_input,
                    tgl_selesai: k['parameter'][0].tgl_selesai,
                    parameter: k['parameter'][0].parameter
                });
            }); 
            console.log(data); 

            let kirim = {
                sample: data
            }
            console.log(kirim);

            Swal.fire({
                title: 'Are you sure?',
                text: 'You will Save this Data!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Save!',
                cancelButtonText: 'No, Cancel It'
              }).then((result) => {
                if (result.value) {
                    this._kontrakServ.saveDataParameter(kirim).then((g) => {
                    console.log(g);
                    let sendToPrice = {
                        idkontrakuji: this.idContrak,
                        // sample: data,
                        massage: g
                    }
                    console.log(sendToPrice);
                    this._kontrakServ.newIdParameter(sendToPrice); 
                    this._kontrakServ.newDataParameter(this.datasample2); 
                    this.load = true;
                    let message = {
                      text: 'Data Succesfully Saved',
                      action: 'Done'
                    }
                    setTimeout(()=>{
                      this.openSnackBar(message);
                    //   this._route.navigateByUrl('analystpro/parameteruji');
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
              }) 
        }        
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
          duration: 2000,
        });
    }
 

}
