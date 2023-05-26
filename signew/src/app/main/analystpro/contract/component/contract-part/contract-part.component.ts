import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from "@angular/core";
import { ContractService } from "../../../services/contract/contract.service"; 
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerhandleService } from "../../../services/customerhandle/customerhandle.service";
import { ContractcategoryService } from "../../../services/contractcategory/contractcategory.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { fuseAnimations } from '@fuse/animations';
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
    attachment: attachment[];
    jeniskemasan: string;
    paketparameter: number;
    parameterdata: Paramdata[];
    parameteruji: string;
    tgl_kadaluarsa: string;
    tgl_produksi: string;
    tujuanpengujian: number;
    totalpembayaran: number;
}

export interface attachment {
    id: string;
    photo: string;
    typefile: string;
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
  selector: 'app-contract-part',
  templateUrl: './contract-part.component.html',
  styleUrls: ['./contract-part.component.scss'],
  animations   : fuseAnimations
})
export class ContractPartComponent implements OnInit {

    urlnow = url;
  ContractForm: FormGroup;
  myDate = new Date();
  datasend = {
    pages: 1,
    search: null,
  };
  idphoto;
  btnSave=true;
  btnUpdate=true;
  load = false;
  addressname: string;
  taxaddressname: string;
  bukaalamat = true;
  catalogue: string;
  subcatalogue: string;
  id_customer;
  contactpersoname: string;
  category_code: number;
  customername: string;
  catalogueData = [];
  subCatalogueData = [];
  dataLastKontrakuji: number;
  dataalamat = {
      pages: 1,
      search: null,
      id_customer: null,
  };

  datasub = {
      page: 1,
      id_catalogue: null,
      search: null,
  };
  datasample2 = [
    {
        no: 1,
        nosample: "",
        samplename: "",
        parameter: [],
    },
  ];
  typeContract = [
    {
        "id": "1",
        "type": "Visit"
    },
    {
        "id": "2",
        "type": "Paket"
    }
  ];

  arrayasal = [
    {
        id: 0,
        name: 'ido'
    },
    {
        id: 1,
        name: null
    },
    {
        id: 2,
        name: 'ido'
    }
]

    dataContract = [];
  dataDetailEdit= [];
  alamataxaddress = [];
  customerhandle = [];
  alamatcustomer = [];
  contract_category = [];
  idcustomer = [];
  idContrack: any;
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
    this._kontrakServ.datacontract.subscribe(async x => { 
        this.dataContract = x; 
        if (this.dataContract.length === 0 ){  
            this.dataDetailEdit = [];
            this.btnSave = true;
            this.btnUpdate = false;
            this.ContractForm = this.contractForm();  
                this.getDatacustomerhandle();
                this.getDataContractCategory();
                this.getDataCatalogue(); 
                    let x =  this.ContractForm.get("attachment") as FormArray;
                    // console.log(x.length); 
                    for (let i = 0; i < 1; i++) {
                        (this.ContractForm.get("attachment") as FormArray).push(
                            this._formBuilder.group({
                                id: x.length + i,
                                photo: null,
                                typefile: "pdf"
                            })
                        );
                    } 
              
        } else {
            this.btnSave = await false;
            this.btnUpdate = await true;
            this.dataDetailEdit = await [];
            this.dataDetailEdit = await this.dataDetailEdit.concat(x);
            await console.log(this.dataDetailEdit);
            this.ContractForm = await this.contractForm(); 

            this.bukaalamat = await false;  
            this.dataalamat.id_customer = await this.dataDetailEdit[0].customerhandle;
            await this.getDataCustomerAddress(); 
            await this.getDataCustomerTaxAddress(this.dataDetailEdit[0].customerhandle); 

            await this.getDatacustomerhandle();
            await this.getDataContractCategory();
            await this.getDataCatalogue(); 
            await this._kontrakServ.dataIdcontract.subscribe(async xx => { 
                this.idContrack = xx.contract_id;
                console.log(this.idContrack); 
            });

            await this.ContractForm.controls.alamataxaddress.setValue(
                this.dataDetailEdit[0].alamataxaddress
            );
            await this.ContractForm.controls.alamatcustomer.setValue(
                this.dataDetailEdit[0].alamatcustomer
            );
            await this.ContractForm.controls.category_code.setValue(
                this.dataDetailEdit[0].category_code
            ); 
            await this.ContractForm.controls.contract_category.setValue(
                this.dataDetailEdit[0].contract_category
            ); 
            await this.ContractForm.controls.contract_no.setValue(
                this.dataDetailEdit[0].contract_no
            );
            await this.ContractForm.controls.customerhandle.setValue(
                this.dataDetailEdit[0].customerhandle
            ); 
            await this.ContractForm.controls.desc.setValue(
                this.dataDetailEdit[0].desc
            );
            // await this.ContractForm.controls.tgl_input.setValue(
            //     this.dataDetailEdit[0].tgl_input
            // );
            // await this.ContractForm.controls.tgl_selesai.setValue(
            //     this.dataDetailEdit[0].tgl_selesai
            // );
            await this.ContractForm.controls.typeContract.setValue(
                this.dataDetailEdit[0].typeContract
            ); 

            if(this.dataDetailEdit[0].attachment.length === 0){
                console.log("No Attachment");
            } else {
                for (let i = 0; i < 4; i++) {
                    (this.ContractForm.get("attachment") as FormArray).push(
                        this._formBuilder.group({
                            id: this.dataDetailEdit[0].attachment[i].id,
                            photo: this.dataDetailEdit[0].attachment[i].photo,
                        })
                    );
                }
            }
            await console.log(this.ContractForm.value);
        }
    });


    
  }


  contractForm() {
        var date =  this.myDate.getDate();
        var month =  this.myDate.getMonth() + 1;
        var year =  this.myDate.getFullYear();
        var tangal =   `${year}-${month}-${date}`;
        console.log(tangal);

        return this._formBuilder.group({
            idcustomer:  [{
                value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.idcustomer : '',
                disabled: this.idContrack == 'add' ? false : false
              }],
            customerhandle:  [{
                value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.customerhandle : '',
                disabled: this.idContrack == 'add' ? false : false
              },  [Validators.required]],
            contract_category: [{
                value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.contract_category : '',
                disabled: this.idContrack == 'add' ? false : false
              }],
            typeContract: [{
                value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.typeContract : '',
                disabled: this.idContrack == 'add' ? false : false
              }],
            contract_no: [{
                value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.contract_no : '',
                disabled: this.idContrack == 'add' ? false : false
              }],
            alamatcustomer: [{
                value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.alamatcustomer : '',
                disabled: this.idContrack == 'add' ? false : false
              }],
            alamataxaddress: [{
                value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.alamataxaddress : '',
                disabled: this.idContrack == 'add' ? false : false
              }],
            // tgl_input: [{
            //     value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.tgl_input : tangal,
            //     disabled: this.idContrack == 'add' ? false : false
            //   }],
            // tgl_selesai: [{
            //     value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.tgl_selesai : '',
            //     disabled: this.idContrack == 'add' ? false : false
            //   }],
            desc: [{
                value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.desc : '',
                disabled: this.idContrack == 'add' ? false : false
              }],
            desc_internal: [{
                value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.desc_internal : '',
                disabled: this.idContrack == 'add' ? false : false
              }],
            category_code: [{
                value:  this.idContrack == 'add' ? this.dataDetailEdit[0].contract.category_code : '',
                disabled: this.idContrack == 'add' ? false : false
              }],
            attachment: this._formBuilder.array([]), 
        });  
  }


  async getDataCustomerTaxAddress(id) {
    await this._kontrakServ
        .getDataTaxAddress(id)
        .then(
            (r) => (this.alamataxaddress = this.alamataxaddress.concat(r))
        );
  }

  async getDataContractCategory() {
      await this._contractCatServ
          .getDataContractCategory(this.datasend)
          .then(
              (c) =>
                  (this.contract_category = this.contract_category.concat(
                      c["data"]
                  ))
          );
  }

  async getDataCustomerAddress() {
      await this._kontrakServ
          .getDataAddressCustomer(this.dataalamat)
          .then(
              (o) =>
                  (
                      this.alamatcustomer = this.alamatcustomer.concat(o["data"]) 
                  )
          ); 
  }

  async getDataCatalogue() {
      await this._kontrakServ.getDataCatalogue().then((g) => {
          this.catalogueData = this.catalogueData.concat(g["data"]);
          this.catalogueData = this.catalogueData.filter(
              (v) => v.catalogue_name !== null && v.catalogue_code !== "KTLG8"
          );
      });
  }

  async getDataSubCatalogue() {
      await this._kontrakServ.getDataSubCatalogue(this.datasub).then((g) => {
          this.subCatalogueData = this.subCatalogueData.concat(g["data"]);
      });
  }

  async getDatacustomerhandle() {
      await this._custHandleServ.getData(this.datasend)
      .then((x) => this.customerhandle = this.customerhandle.concat(x['data']))
      .then(() => this.customerhandle = this.uniq(this.customerhandle, it => it.idch))
      .then(()=> console.log(this.customerhandle));
  }

  uniq(data,key) {
    return [
      ...new Map(
        data.map(x => [key(x),x])
      ).values()
    ]
  }

  async getDataKontrak() {
      await this._kontrakServ.getData(this.datasend).then((p) => {
          this.dataLastKontrakuji =
              p["data"][p["data"].length - 1].id_kontrakuji;
      });
  }





  
  async getValCategoryContract(ev) {
    let date = await new Date();
    let month = await this.numberToRoman(date.getMonth());
    let year = await date.getFullYear();
    let x = await this.leftPad(this.dataLastKontrakuji + 1, 6);
    this.category_code = await ev.category_code;
    let z = await `SIG.MARK.${ev.category_code}.${month}.${year}.${Math.floor(
        100000 + Math.random() * 900000
    )}`;
    document.getElementById("nokontrak").textContent = await z;
    // await this.ContractForm.controls['contract_no'].setValue(z);
    // await this.setValue();
    await console.log({a:this.category_code ,b:ev });
  }

  async getValTypeContact(ev) { 
      // await this.ContractForm.controls['typeContract'].setValue(ev.id);
      // await this.setValue();
      await console.log({a:this.category_code ,b:ev });
  }

  getVal(ev) {
      console.log(ev);
      this.customername = ev.customer_name;
      this.contactpersoname = ev.name;
      this.bukaalamat = false;
      this.alamatcustomer = [];
      this.alamataxaddress = [];
      this.id_customer = ev.id_customer;
      this.dataalamat.id_customer = ev.id_customer; 
      this.ContractForm.value.idcustomer = ev.id_customer; 
      this.getDataCustomerAddress();
      this.getDataCustomerTaxAddress(this.id_customer);  
  }

  reset() {
      this.bukaalamat = true;
      this.id_customer = null;
      this.customerhandle = [];
      this.getDatacustomerhandle();
  }

  getValCatalogue(ev) {
      this.datasub.id_catalogue = ev.id_catalogue;
      this.catalogue = ev.id_catalogue;
      this.getDataSubCatalogue();
  }

  getValSubCatalogue(ev) {
      console.log(ev);
      this.subcatalogue = ev.id_sub_catalogue;
  }

  getValAddress(ev) {
      this.addressname = ev.address; 
  }

  getValTaxaddress(ev) {
      this.taxaddressname = ev.address; 
  }


  numberToRoman(number) {
    let roman = "";

    const romanNumList = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XV: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
    };
    let a;

    for (let key in romanNumList) {
        a = Math.floor(number / romanNumList[key]);
        if (a >= 0) {
            for (let i = 0; i < a; i++) {
                roman += key;
            }
        }
        number = number % romanNumList[key];
    }

    return roman;
  }

  leftPad(number, targetLength) {
    var output = number + "";
    while (output.length < targetLength) {
        output = "0" + output;
    }
    return output;
  }




  async modalcustomerhandle() {
    let dialogCust = await this.dialog.open(CustomershandleModalComponent, {
        height: "auto",
        width: "600px",
    });
    await dialogCust.afterClosed().subscribe((result) => {
        this.customerhandle = [];
        this.datasend.pages = 1;
        this.datasend.search = null;
        this.getDatacustomerhandle();
    });
  }

  async modaladdresscustomer() {
    let dialogCust = await this.dialog.open(AddressCustomerComponent, {
        height: "auto",
        width: "600px",
        data: {
            id_customer: this.id_customer,
            cust_name: this.customername
        },
    });
    await dialogCust.afterClosed().subscribe((result) => {
        this.alamatcustomer = [];
        this.getDataCustomerAddress();
    });
  }

  async modalTaxaddressCust() {
    let dialogCust = await this.dialog.open(TaxAddressCustomerComponent, {
        height: "auto",
        width: "600px",
        data: {
            id_customer: this.id_customer,
            cust_name: this.customername
        },
    });
    await dialogCust.afterClosed().subscribe((result) => {
        this.alamataxaddress = [];
        this.getDataCustomerTaxAddress(result.id_cust);
    });
  }





  addfoto(){ 
    let x =  this.ContractForm.get("attachment") as FormArray;
    console.log(x.length); 
    for (let i = 0; i < 1; i++) {
        (this.ContractForm.get("attachment") as FormArray).push(
            this._formBuilder.group({
                id: x.length + i,
                photo: null,
                typefile: "pdf"
            })
        );
    } 
    console.log(this.ContractForm.controls.attachment.value);
  }

  uploadGambar($event, id) : void {
    this.readThis($event.target); 
    console.log(id);
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
        this.ContractForm.controls.attachment.value[this.idphoto].photo = myReader.result;
        console.log(this.ContractForm.controls.attachment.value);
    }
    myReader.readAsDataURL(file);
  } 



  saveForm(){
    console.log(this.ContractForm.value);

    
    if (
        this.ContractForm.value.customerhandle === "" ||
        this.ContractForm.value.contract_category === "" ||
        this.ContractForm.value.alamatcustomer === "" ||
        this.ContractForm.value.alamataxaddress === "" ||
        this.ContractForm.value.desc === "" 
    ){
            Swal.fire({
                title: 'Data Belum Lengkap',
                text: 'Mohon Lengkapi Data !',
                icon: 'warning', 
                confirmButtonText: 'Ok'
            })
    }else {
 

        // var year = this.ContractForm.value.tgl_selesai._i.year;
        // var month = this.ContractForm.value.tgl_selesai._i.month + 1;
        // var date = this.ContractForm.value.tgl_selesai._i.date;  
        // var tangalSelesai = `${year}-${month}-${date}`
        // console.log(tangalSelesai);  
 
        // this.ContractForm.controls['tgl_selesai'].setValue(tangalSelesai);
        
        let contract = {
            contract : this.ContractForm.value
        }  
        console.log(contract);  

        Swal.fire({
            title: 'Are you sure?',
            text: 'You will Save this Data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save!',
            cancelButtonText: 'No, Cancel It'
          }).then((result) => {
            if (result.value) {
                this._kontrakServ.saveDataContract(contract).then((g) => { 
                console.log(g);
                //menyimpan data di service
                this._kontrakServ.newDataIdContract(g); 
                this._kontrakServ.newDataContract(this.ContractForm.value); 
                this.load = true;
                let message = {
                  text: 'Data Succesfully Save',
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
    console.log(this.ContractForm.value);

    
    if (
        this.ContractForm.value.customerhandle === "" ||
        this.ContractForm.value.contract_category === "" ||
        this.ContractForm.value.alamatcustomer === "" ||
        this.ContractForm.value.alamataxaddress === "" ||
        this.ContractForm.value.desc === "" 
    ){
            Swal.fire({
                title: 'Data Belum Lengkap',
                text: 'Mohon Lengkapi Data !',
                icon: 'warning', 
                confirmButtonText: 'Ok'
            })
    }else {
 
        // if(this.ContractForm.value.tgl_selesai !== this.dataDetailEdit[0].tgl_selesai){ 
        //     var year = this.ContractForm.value.tgl_selesai._i.year;
        //     var month = this.ContractForm.value.tgl_selesai._i.month + 1;
        //     var date = this.ContractForm.value.tgl_selesai._i.date;  
        //     var tangalSelesai = `${year}-${month}-${date}`
        //     console.log(tangalSelesai);  
        // }
 
        // this.ContractForm.controls['tgl_selesai'].setValue(
        //     this.ContractForm.value.tgl_selesai !== this.dataDetailEdit[0].tgl_selesai ? tangalSelesai : this.dataDetailEdit[0].tgl_selesai
        // );
        
        let contract = {
            contract : this.ContractForm.value
        }  
        console.log(contract);  

        Swal.fire({
            title: 'Are you sure?',
            text: 'You will Save this Data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save!',
            cancelButtonText: 'No, Cancel It'
          }).then((result) => {
            if (result.value) {
                this._kontrakServ.updateDataContract(this.idContrack ,contract).then((g) => { 
                    console.log(g);
                    //menyimpan data di service
                    this._kontrakServ.newDataIdContract(g); 
                    this._kontrakServ.newDataContract(this.ContractForm.value); 
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
