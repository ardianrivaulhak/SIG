import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from "@angular/core";
import { ContractService } from "../../../services/contract/contract.service"; 
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerhandleService } from "../../../services/customerhandle/customerhandle.service";
import { ContractcategoryService } from "../../../services/contractcategory/contractcategory.service";
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
import { fuseAnimations } from '@fuse/animations';
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
  selector: 'app-sample-part',
  templateUrl: './sample-part.component.html',
  styleUrls: ['./sample-part.component.scss'],
  animations   : fuseAnimations
})
export class SamplePartComponent implements OnInit {
  
    pageindex: number;
        displayedColumns: string[] = ["no", "samplename", "action"];
        @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

        @Input()
        dataParam = [];
    
        @Output()
    datasample2 = [
        {
            no: 1,
            nosample: "",
            samplename: "",
            parameter: [],
        },
    ]; 
    dataSource = new MatTableDataSource<datasampleElement>(this.datasample2);
    idContrack: any;
    copyvalue;
    load = false;
    pasteallbutton = true;
    pastevalue = true;
    category_code: number;
    totalpembayaran: number;
    dataContract = [];
    dataSample = [];
    hideForm = true;
    idContrak: null;
    addForm = false;
    btnSave = true;
    btnUpdate = false;

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
        this._kontrakServ.dataIdcontract.subscribe(async x => { 
            this.dataContract = x; 
            console.log(this.dataContract);
            if (this.dataContract.length === 0 ){
                this.hideForm = false;
                Swal.fire({
                    title: 'NotFound Data Contract',
                    text: 'Please Create Data Contract!',
                    icon: 'warning', 
                    confirmButtonText: 'Ok'
                });
            } else {
                this.idContrak = x.contract_id;
                console.log(this.idContrak);  
                this.btnSave = true;
                this.btnUpdate = false;

                    this._kontrakServ.dataIdsample.subscribe(async x => {
                        this.dataSample = x;
                        console.log(this.dataSample);
                        if (this.dataSample.length !== 0 ){

                            let a = [];
                            let dataEdit = [];
                            a = a.concat(x["data"]);
                            a.forEach((k) => {
                                k.sample.forEach((x) => {
                                dataEdit = dataEdit.concat({
                                    idsample: x.idsample,
                                    nosample: x.nosample,
                                    samplename: x.samplename,
                                    parameter: x.parameter
                                });
                            });
                            });
                            this.btnSave = false;
                            this.btnUpdate = true;
                            this.datasample2 = [];
                            this.datasample2 = dataEdit;
                            console.log(this.datasample2); 
                            this.dataSource = new MatTableDataSource<datasampleElement>(
                                this.datasample2
                            );
                            this.dataSource.paginator = this.paginator;   
                        } 
                    });    
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
            nosample: "",
            samplename: "",
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
                parameter: [],
            });
            this.dataSource = new MatTableDataSource<datasampleElement>(
                this.datasample2
            );
            this.dataSource.paginator = this.paginator;
        }
    }

    async deleteRow(i){ 
        await this.datasample2.splice(i,1);
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

                const dialogRef = await this.dialog.open(ParameterModalComponent, {
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
                //   this.totalpembayaran = await this.datasample2
                //       .map((x) => x.parameter[0].totalpembayaran)
                //       .reduce((c, a) => c + a);
                //   let a =
                //       (await this.totalpembayaran) +
                //       this.biayasample +
                //       this.biayaakg +
                //       this.pph -
                //       this.ppn -
                //       this.uangmuka -
                //       this.discount;
                //   this.sisapembayaran = a;
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
            let data = {
                idkontrakuji : this.idContrak,
                // idkontrakuji : 110130,
                sample: this.datasample2
            }
            console.log(data); 

            Swal.fire({
                title: 'Are you sure?',
                text: 'You will Save this Data!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Save!',
                cancelButtonText: 'No, Cancel It'
              }).then((result) => {
                if (result.value) {
                    this._kontrakServ.saveDataSample(data).then((g) => {
                    console.log(g);
                    this._kontrakServ.newIdSample(g); 
                    this._kontrakServ.newDataSample(this.datasample2); 
                    this.load = true;
                    let message = {
                      text: 'Data Succesfully Updated',
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

    updateForm(){
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
            let data = {
                idkontrakuji : this.idContrak,
                // idkontrakuji : 110130,
                sample: this.datasample2
            }
            console.log(data); 

            Swal.fire({
                title: 'Are you sure?',
                text: 'You will Save this Data!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Save!',
                cancelButtonText: 'No, Cancel It'
              }).then((result) => {
                if (result.value) {
                    this._kontrakServ.updateDataSample(data).then((g) => {
                    console.log(g);
                    // this._kontrakServ.newIdSample(g); 
                    // this._kontrakServ.newDataSample(this.datasample2); 
                    this.load = true;
                    let message = {
                      text: 'Data Succesfully Updated',
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
