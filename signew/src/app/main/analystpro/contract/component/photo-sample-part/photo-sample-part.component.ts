import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from "@angular/core";
import { ContractService } from "../../../services/contract/contract.service"; 
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerhandleService } from "../../../services/customerhandle/customerhandle.service";
import { ContractcategoryService } from "../../../services/contractcategory/contractcategory.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table"; 
import { ModalPhotoComponent } from "../../../modal/modal-photo/modal-photo.component";
import { ImageModalComponent } from '../../../modal/image-modal/image-modal.component';
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
import {url} from 'app/main/url';
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
  selector: 'app-photo-sample-part',
  templateUrl: './photo-sample-part.component.html',
  styleUrls: ['./photo-sample-part.component.scss']
})
export class PhotoSamplePartComponent implements OnInit {

    urlnow = url;
    pageindex: number;
    displayedColumns: string[] = ["no", "phtSample", "samplename", "action"];
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
            photo: null,
        },
    ]; 
    dataSource = new MatTableDataSource<datasampleElement>(this.datasample2);
    idContrack: any;
    copyvalue;
    pasteallbutton = true;
    pastevalue = true;
    category_code: number;
    totalpembayaran: number;
    PhotoForm: FormGroup;
    contract_no: any;
    no_sample: any;
    idphoto;

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
        this.PhotoForm = this.photoPhotoForm();
        let x =  this.PhotoForm.get("foto") as FormArray;
        console.log(x.length); 
        for (let i = 0; i < 1; i++) {
            (this.PhotoForm.get("foto") as FormArray).push(
                this._formBuilder.group({
                    id: x.length + i,
                    photo: null,
                })
            );
        }
        console.log(this.PhotoForm.controls.foto);
    }

    addfoto(){ 
        let x =  this.PhotoForm.get("foto") as FormArray;
        console.log(x.length); 
        for (let i = 0; i < 1; i++) {
            (this.PhotoForm.get("foto") as FormArray).push(
                this._formBuilder.group({
                    id: x.length + i,
                    photo: null,
                })
            );
        } 
        console.log(this.PhotoForm.controls.foto.value);
    }

    uploadGambar($event, id) : void {
        this.readThis($event.target); 
        console.log($event);
        console.log(id);
        console.log(this.datasample2);
        this.idphoto = id;
    }

    readThis(inputValue: any): void {
        var file:File = inputValue.files[0];

        var pattern = /image-*/;
        if (!file.type.match(pattern)) {
            alert('Upload Only Image');
            return;
        }
        var myReader:FileReader = new FileReader();
      
        myReader.onloadend = (e) => { 
            this.PhotoForm.controls.foto.value[this.idphoto].photo = myReader.result;
            console.log(this.PhotoForm.controls.foto.value);
        }
        myReader.readAsDataURL(file);
      }

    openmodalphoto(v, i) {
        let s = this.addphoto.value;
        const dialogRef = this.dialog.open(ModalPhotoComponent, { 
            data:{
                    contract_no: this.contract_no,
                    no_sample: this.no_sample,
                    foto: v.value,
                }
        });
        dialogRef.afterClosed().subscribe((result) => {
            s[v.value.id].photo = result.a;
        });
        } 
    

    photoPhotoForm() {
        return this._formBuilder.group({ 
            foto: this._formBuilder.array([]), 
        });
    }

    get addphoto() {
        return this.PhotoForm.get("foto") as FormArray;
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
            parameter: [],
            photo: null,
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
                photo: null,
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

}
