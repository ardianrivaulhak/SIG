import { Component, OnInit, Inject } from "@angular/core";
import Swal from 'sweetalert2';
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { TujuanpengujianService } from "../../services/tujuanpengujian/tujuanpengujian.service";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    FormArray,
    Form,
} from "@angular/forms";
import { ModalPhotoComponent } from "../modal-photo/modal-photo.component";
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { ContractService } from "../../services/contract/contract.service";
import { LodService } from "../../master/lod/lod.service";
import { StandartService } from "../../master/standart/standart.service";
import { MetodeService } from "../../master/metode/metode.service";
import { UnitService } from "../../master/unit/unit.service";

export interface Datasample {
    id: string;
    sample_name: string;
    jenis_kemasan: string;
}

@Component({
    selector: "app-parameter-modal",
    templateUrl: "./parameter-modal.component.html",
    styleUrls: ["./parameter-modal.component.scss"],
})
export class ParameterModalComponent implements OnInit {
    datasample: Datasample[] = [];
    tujuanpengujian = [];
    statussample: string;
    statuspengujian = [
        {
            id: 1,
            status: "Normal",
        },
        {
            id: 2,
            status: "Urgent",
        },
        {
            id: 3,
            status: "Very Urgent",
        },
        {
            id: 4,
            status: "Custom 2 Hari",
        },
        {
            id: 5,
            status: "Custom 1 Hari",
        },
    ];
    hidePaket = true;
    hidePaketPKM = true;
    hideParameteruji = true;
    idphoto;
    dataphoto = [
        {
            id: 1,
            photo: null,
        },
        {
            id: 2,
            photo: null,
        },
        {
            id: 3,
            photo: null,
        },
        {
            id: 4,
            photo: null,
        },
    ];
    dataPaketuji = [];
    dataPaketPKM = [];
    dataParameter = [];
    chooseFormatHasil: any;
    dataFormatHasil = [
        {id: 1,"hasil": "Simplo"},{id: 2,"hasil": "Duplo"},{id: 3,"hasil": "Triplo"} 
    ];
    SampleForm: FormGroup;
    tgl_input: string;
    tgl_selesai: string;
    jumlahFoto= 0;
    sampaiFoto= 1;
    dataSelect = [
        {
            name: "PAKET",
        },
        {
            name: "NON PAKET",
        },
        {
            name: "PAKET PKM",
        },
    ];

    // lod
    datalod = [];
    datasendlod = {
        pages: 1,
        search: null,
    };

    //standart
    datastandart = [];
    datasendstandart = {
        pages: 1,
        search: null,
    };
    
    //metode
    datametode = [];
    datasendmetode = {
        pages: 1,
        search: null,
    };

    //unit
    dataunit = [];
    datasendunit = {
        pages: 1,
        search: null,
    };
    importPhoto = [];
    displayedColumns: string[] = ["name_id", "lab", "status", "action"];

    dataselectPaketPKM = {
        page: 1,
        search: null,
    };

    dataselectPaketParameter = {
        page: 1,
        search: null,
    };

    dataselectParameter = {
        page: 1,
        search: null,
    };

    totalcalculated: number;

    getValuePaket: string;

    loading = false;
    samplename: string;
    paketParameter = [];
    hasiltotalpaketuji = [];
    Dataparameter = [];
    dataPaket = [];
    dataSatuan = [];
    dataPaketDanSatuan = {
        paketparameter: [],
        paketPKM: [],
        satuanparameter: []
      }
    perkalian: number;
    showedetail = true;
    name_id = "Please Wait";
    name_en = "Please Wait";
    parameterselect = [];
    catalogueData = [];
    subCatalogueData = [];
    dataSample = [];
    dataSampleFoto = [];
    datasub = {
        page: 1,
        id_catalogue: null,
        search: null,
    };
    catalogue;
    idContrack: any;
    contract_no: any;
    no_sample: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ParameterModalComponent>,
        private _tujuanServ: TujuanpengujianService,
        private fb: FormBuilder,
        private _kontrakServ: ContractService,
        private dialog: MatDialog,
        private _lodServ: LodService,
        private _standartServ: StandartService,
        private _metodeServ: MetodeService,
        private _unitServ: UnitService
    ) {
        if (data) {
            if (data.sample.parameter.length > 0) {
                // this.idContrack = data.idContrack;
                // this.contract_no = data.contract_no.value;
                // this.no_sample = data.no_sample;
                this.dataSample = this.dataSample.concat(data.sample);
                // this.dataSampleFoto = this.dataSampleFoto.concat(data.sample.parameter[0].foto);
                this.setDataEdit(data.sample);  
                // console.log(this.dataSampleFoto);

            }
            this.SampleForm = this.sampleform(); 

            console.log(this.SampleForm.controls.tujuanpengujian);
            this.idContrack = data.idContrack; 
            this.Dataparameter = this.Dataparameter.concat(data.sample);   
            console.log(this.idContrack);
            // this.tgl_input = data.tgl_input;
            // this.tgl_selesai = data.tgl_selesai;
            console.log(data);
        }
        this.samplename = data.samplename;

        this.dialogRef.backdropClick().subscribe((v) => {
            this.toggleParameter();
        });
    }

    // addfoto(){ 
    //     let x =  this.SampleForm.get("foto") as FormArray;
    //     console.log(x.length); 
    //     for (let i = 0; i < 1; i++) {
    //         (this.SampleForm.get("foto") as FormArray).push(
    //             this.fb.group({
    //                 id: x.length + i,
    //                 photo: null,
    //             })
    //         );
    //     }
    //     // this.SampleForm.controls.tgl_input.setValue(this.tgl_input);
    //     // this.SampleForm.controls.tgl_selesai.setValue(this.tgl_selesai);
    //     console.log(this.SampleForm.controls.foto.value);
    // }
 

    ngOnInit(): void {
        this.getDataTujuanPengujian();
        this.SampleForm = this.sampleform();

        let pengujian = 1;
        this.SampleForm.controls.tujuanpengujian.setValue(pengujian); 
        // let x =  this.SampleForm.get("foto") as FormArray;
        // // console.log(x.length); 
        // for (let i = 0; i < 1; i++) {
        //     (this.SampleForm.get("foto") as FormArray).push(
        //         this.fb.group({
        //             id: x.length + i,
        //             photo: null,
        //         })
        //     );
        // }
        // this.SampleForm.controls.tgl_input.setValue(this.tgl_input);
        // this.SampleForm.controls.tgl_selesai.setValue(this.tgl_selesai);
        this.getDataLod();
        this.getDataStandart();
        this.getDataMetode();
        this.getDataUnit();
        // this.getDataCatalogue();
        this.getDataSubCatalogue();
        // this.SampleForm.controls['subcatalogue'].disable();
    }

    async testingclick(ev) {
        this.showedetail = await false;
        this.name_id = await ev.name_id;
        this.name_en = await ev.name_en;
        this.parameterselect = [];
        this.parameterselect = await this.parameterselect.concat(ev);
        await console.log(this.parameterselect);
    }

    async getDataCatalogue() {
        await this._kontrakServ.getDataCatalogue().then((g) => {
            this.catalogueData = this.catalogueData.concat(g["data"]);
            this.catalogueData = this.catalogueData.filter(
                (v) => v.catalogue_name !== null && v.catalogue_code !== "KTLG8"
            );
            console.log(this.catalogueData);
        });
    }

    async getDataSubCatalogue() {
        await this._kontrakServ.getDataSubCatalogue(this.datasub).then((g) => {
            this.subCatalogueData = this.subCatalogueData.concat(g["data"]);
            console.log(this.subCatalogueData);
        });
    }

    getValCatalogue(ev) {
        this.datasub.id_catalogue = ev.id_catalogue;
        this.catalogue = ev.id_catalogue;
        this.SampleForm.controls['subcatalogue'].enable();
        this.getDataSubCatalogue();
    }


    toggleParameter() {
        console.log(this.SampleForm.value);  
        if (
            this.SampleForm.value.tujuanpengujian === null || 
            // this.SampleForm.value.catalogue === null ||
            // this.SampleForm.value.subcatalogue === null ||
            this.SampleForm.value.tgl_kadaluarsa === null ||
            this.SampleForm.value.tgl_produksi === null 
            // this.SampleForm.value.tgl_input === null ||
            // this.SampleForm.value.tgl_selesai === null ||
            // this.SampleForm.value.tgl_estimasi_lab === null ||
            // this.SampleForm.value.batchno === null ||
            // this.SampleForm.value.no_notifikasi === null ||
            // this.SampleForm.value.no_pengajuan === null ||
            // this.SampleForm.value.no_registrasi === null ||
            // this.SampleForm.value.no_principalCode === null || 
            // this.SampleForm.value.factoryname === null ||
            // this.SampleForm.value.trademark === null ||
            // this.SampleForm.value.lotno === null ||
            // this.SampleForm.value.jeniskemasan === null 

        ){

            Swal.fire({
                title: 'Data Belum Lengkap',
                text: 'Lengkapi !',
                icon: 'warning', 
                confirmButtonText: 'Ok'
            }) 

        } else {

            this.SampleForm.controls.totalpembayaran.setValue(
                this.totalcalculated ? this.totalcalculated : 0
            ); 
            this.SampleForm.controls.hasiltotalpaketuji.setValue(this.hasiltotalpaketuji); 

            if(this.dataSample.length === 0){ 
                
                    // var year = this.SampleForm.value.tgl_selesai._i.year;
                    // var month = this.SampleForm.value.tgl_selesai._i.month + 1;
                    // var date = this.SampleForm.value.tgl_selesai._i.date;  
                    // var tangalSelesai = `${year}-${month}-${date}`
                    // console.log(tangalSelesai);  
                 
                    // var year = this.SampleForm.value.tgl_input._i.year;
                    // var month = this.SampleForm.value.tgl_input._i.month + 1;
                    // var date = this.SampleForm.value.tgl_input._i.date;  
                    // var tangalInput = `${year}-${month}-${date}`
                    // console.log(tangalInput);  
                 
                    var year = this.SampleForm.value.tgl_kadaluarsa._i.year;
                    var month = this.SampleForm.value.tgl_kadaluarsa._i.month + 1;
                    var date = this.SampleForm.value.tgl_kadaluarsa._i.date;  
                    var tangalkadaluarsa = `${year}-${month}-${date}`
                    console.log(tangalkadaluarsa);   
                    
                    var year = this.SampleForm.value.tgl_produksi._i.year;
                    var month = this.SampleForm.value.tgl_produksi._i.month + 1;
                    var date = this.SampleForm.value.tgl_produksi._i.date;  
                    var tangalproduksi = `${year}-${month}-${date}`
                    console.log(tangalproduksi);   
                    
                    // var year = this.SampleForm.value.tgl_estimasi_lab._i.year;
                    // var month = this.SampleForm.value.tgl_estimasi_lab._i.month + 1;
                    // var date = this.SampleForm.value.tgl_estimasi_lab._i.date;  
                    // var tangalestimasi = `${year}-${month}-${date}`
                    // console.log(tangalestimasi);  

                // this.SampleForm.controls.tgl_input.setValue(
                //     tangalInput
                // );
                this.SampleForm.controls.tgl_kadaluarsa.setValue(
                    tangalkadaluarsa
                );
                this.SampleForm.controls.tgl_produksi.setValue(
                    tangalproduksi
                );  
                // this.SampleForm.controls.tgl_selesai.setValue(
                //     tangalSelesai
                // );
                // this.SampleForm.controls.tgl_estimasi_lab.setValue(
                //     tangalestimasi
                // );
            } else {
                console.log(this.dataSample);
                
                // if(this.SampleForm.value.tgl_selesai !== this.dataSample[0].parameter[0].tgl_selesai){
                //     var year = this.SampleForm.value.tgl_selesai._i.year;
                //     var month = this.SampleForm.value.tgl_selesai._i.month + 1;
                //     var date = this.SampleForm.value.tgl_selesai._i.date;  
                //     var tangalSelesai = `${year}-${month}-${date}`
                //     console.log(tangalSelesai);   
                // }
                
                // if(this.SampleForm.value.tgl_input !== this.dataSample[0].parameter[0].tgl_input){
                //     var year = this.SampleForm.value.tgl_input._i.year;
                //     var month = this.SampleForm.value.tgl_input._i.month + 1;
                //     var date = this.SampleForm.value.tgl_input._i.date;  
                //     var tangalInput = `${year}-${month}-${date}`
                //     console.log(tangalInput);   
                // }
                
                if(this.SampleForm.value.tgl_kadaluarsa !== this.dataSample[0].parameter[0].tgl_kadaluarsa){
                    var year = this.SampleForm.value.tgl_kadaluarsa._i.year;
                    var month = this.SampleForm.value.tgl_kadaluarsa._i.month + 1;
                    var date = this.SampleForm.value.tgl_kadaluarsa._i.date;  
                    var tangalkadaluarsa = `${year}-${month}-${date}`
                    console.log(tangalkadaluarsa);   
                }
                
                if(this.SampleForm.value.tgl_produksi !== this.dataSample[0].parameter[0].tgl_produksi){
                    var year = this.SampleForm.value.tgl_produksi._i.year;
                    var month = this.SampleForm.value.tgl_produksi._i.month + 1;
                    var date = this.SampleForm.value.tgl_produksi._i.date;  
                    var tangalproduksi = `${year}-${month}-${date}`
                    console.log(tangalproduksi);   
                }
                
                // if(this.SampleForm.value.tgl_estimasi_lab !== this.dataSample[0].parameter[0].tgl_estimasi_lab){
                //     var year = this.SampleForm.value.tgl_estimasi_lab._i.year;
                //     var month = this.SampleForm.value.tgl_estimasi_lab._i.month + 1;
                //     var date = this.SampleForm.value.tgl_estimasi_lab._i.date;  
                //     var tangalestimasi = `${year}-${month}-${date}`
                //     console.log(tangalestimasi);
                // }

                // this.SampleForm.controls.tgl_input.setValue( 
                //     this.SampleForm.value.tgl_input !== this.dataSample[0].parameter[0].tgl_input ? tangalInput : this.dataSample[0].parameter[0].tgl_input
                // );
                this.SampleForm.controls.tgl_kadaluarsa.setValue( 
                    this.SampleForm.value.tgl_kadaluarsa !== this.dataSample[0].parameter[0].tgl_kadaluarsa ? tangalkadaluarsa : this.dataSample[0].parameter[0].tgl_kadaluarsa
                );
                this.SampleForm.controls.tgl_produksi.setValue( 
                    this.SampleForm.value.tgl_produksi !== this.dataSample[0].parameter[0].tgl_produksi ? tangalproduksi : this.dataSample[0].parameter[0].tgl_produksi
                );  
                // this.SampleForm.controls.tgl_selesai.setValue(
                //     this.SampleForm.value.tgl_selesai !== this.dataSample[0].parameter[0].tgl_selesai ? tangalSelesai : this.dataSample[0].parameter[0].tgl_selesai
                // );
                // this.SampleForm.controls.tgl_estimasi_lab.setValue(
                //     this.SampleForm.value.tgl_estimasi_lab !== this.dataSample[0].parameter[0].tgl_estimasi_lab ? tangalestimasi : this.dataSample[0].parameter[0].tgl_estimasi_lab
                // );
            }

            this.paketParameter.forEach((k) => {
                (this.SampleForm.get("parameter") as FormArray).push(
                    this.fb.group({
                        id: k["id"],
                        name_id: k["name_id"],
                        name_en: k["name_en"],
                        format_hasil: k["format_hasil"],
                        lod: k["lod"],
                        status: k["status"],
                        hargaParameter: k["hargaParameter"],
                        id_lod: k["id_lod"],
                        id_standart: k["id_standart"],
                        id_unit: k["id_unit"],
                        id_metode: k["id_metode"],
                        id_lab: k["id_lab"],
                        idpaket: k["idpaket"] ? k["idpaket"] : null ,
                    })
                );
            });
            this.dataPaketDanSatuan.paketparameter = this.SampleForm.value.parameter.filter(
                (v) => v.status == "PKT1"
            );
            this.dataPaketDanSatuan.paketPKM = this.SampleForm.value.parameter.filter(
                (v) => v.status == "PAKET PKM"
            );
            this.dataPaketDanSatuan.satuanparameter = this.SampleForm.value.parameter.filter(
                (v) => v.status == "NON PAKET"
            );
            this.SampleForm.value.parameter = [];
            this.SampleForm.value.parameter = this.SampleForm.value.parameter.concat(this.dataPaketDanSatuan);
            
            
            // if(this.idContrack !== "add"){
            //     console.log("test Edit");
            //     let dataFoto : any;
            //     for (let i = 0; i < this.dataSampleFoto.length; i++) {
            //         let url = 'http://10.20.200.33:8000/' + this.contract_no + '/' + this.no_sample + '/' +  this.dataSampleFoto[i].photo;
                    
            //          this.imageurltobase64(url,(x)=>{ 
            //             dataFoto = x; 
            //             this.SampleForm.value.foto[i].photo = dataFoto; 
            //             // console.log(this.SampleForm.value.foto);
            //         });
            //     }
            //     console.log(this.dataSampleFoto);
            // }
            
            console.log(this.SampleForm.value);
            
            
            return this.dialogRef.close({
                b: "close",
                c: this.SampleForm.value,
            });

        }
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    async setDataEdit(v) {
        await console.log(v);
        await this.getDataTujuanPengujian();
        // let link = v.parameter[0].foto.length;
        let parameter = v.parameter[0];

        this.SampleForm = this.sampleform();
        // this.SampleForm.controls['subcatalogue'].enable();
        // this.datasub.id_catalogue = parameter.catalogue;
        // this.catalogue = parameter.catalogue;
        // this.getDataSubCatalogue();

        
        // this.hasiltotalpaketuji = await [];
        // this.hasiltotalpaketuji = await parameter.hasiltotalpaketuji;
        // console.log(this.hasiltotalpaketuji);
        // this.perkalian = await parameter.statuspengujian; 
        await this.SampleForm.controls.tujuanpengujian.setValue(
            parameter.tujuanpengujian
        );
        // await this.SampleForm.controls.statuspengujian.setValue(
        //     parameter.statuspengujian
        // );
        // await this.SampleForm.controls.catalogue.setValue(
        //     parameter.catalogue
        // );
        
        await this.SampleForm.controls.subcatalogue.setValue(
            parameter.subcatalogue
        );
        await this.SampleForm.controls.jeniskemasan.setValue(
            parameter.jeniskemasan
        );


        // await this.SampleForm.controls.tgl_input.setValue(parameter.tgl_input);
        await this.SampleForm.controls.tgl_kadaluarsa.setValue(
            parameter.tgl_kadaluarsa
        );
        await this.SampleForm.controls.tgl_produksi.setValue(
            parameter.tgl_produksi
        );  
        // await this.SampleForm.controls.tgl_selesai.setValue(
        //     parameter.tgl_selesai
        // );
        // await this.SampleForm.controls.tgl_estimasi_lab.setValue(
        //     parameter.tgl_estimasi_lab
        // );
        await this.SampleForm.controls.totalpembayaran.setValue(
            parameter.totalpembayaran
        ); 


        await this.SampleForm.controls.no_notifikasi.setValue(parameter.no_notifikasi);
        await this.SampleForm.controls.no_pengajuan.setValue(parameter.no_pengajuan);
        await this.SampleForm.controls.no_registrasi.setValue(parameter.no_registrasi);
        await this.SampleForm.controls.no_principalCode.setValue(parameter.no_principalCode); 
        await this.SampleForm.controls.batchno.setValue(parameter.batchno);
        await this.SampleForm.controls.factoryname.setValue(
            parameter.factoryname
        );
        await this.SampleForm.controls.trademark.setValue(parameter.trademark);
        await this.SampleForm.controls.lotno.setValue(parameter.lotno);
        await this.SampleForm.controls.jeniskemasan.setValue(
            parameter.jeniskemasan
        );
        // await this.SampleForm.controls.valuePaket.setValue(
        //     parameter.valuePaket
        // );  
         
        // await this.SampleForm.controls.parameteruji.setValue(
        //     parameter.parameteruji
        // );
        await console.log(this.SampleForm.value);

        this.totalcalculated = await parameter.totalpembayaran;
        this.paketParameter = await this.paketParameter.concat(parameter.parameter[0].paketparameter);
        this.paketParameter = await this.paketParameter.concat(parameter.parameter[0].paketPKM);
        this.paketParameter = await this.paketParameter.concat(parameter.parameter[0].satuanparameter);
        // for (let i = 0; i < 4; i++) {
        //     await (this.SampleForm.get("foto") as FormArray).push(
        //         this.fb.group({
        //             id: v.parameter.length > 0 ? parameter.foto[i].id : i,
        //             photo:
        //                 v.parameter.length > 0 ? parameter.foto[i].photo : null,
        //         })
        //     );
        // }  
    }

    imageurltobase64(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    getParameter() {
        let parameter = this.Dataparameter[0].parameter[0];
        for (let k = 0; k < parameter.parameter.length; k++) {
            return (this.SampleForm.get("parameter") as FormArray).push(
                this.fb.group({
                    id: parameter.parameter[k].id,
                    name_id: parameter.parameter[k].name_id,
                    name_en: parameter.parameter[k].name_en,
                    lab_name: parameter.parameter[k].lab_name,
                    lod: parameter.parameter[k].lod,
                    status: parameter.parameter[k].status,
                    hargaParameter: parameter.parameter[k].hargaParameter,
                })
            );
        }
    }

    getDataLod() {
        this._lodServ.getDataLod(this.datasendlod).then((x) => {
            this.datalod = this.datalod.concat(x["data"]);
        });
    }

    getDataStandart() {
        this._standartServ
            .getDataStandart(this.datasendstandart)
            .then(
                (x) => (this.datastandart = this.datastandart.concat(x["data"]))
            );
    }

    getDataMetode() {
        this._metodeServ
            .getDataMetode(this.datasendmetode)
            .then((x) => (this.datametode = this.datametode.concat(x["data"])));
    }

    getDataUnit() {
        this._unitServ
            .getDataUnit(this.datasendunit)
            .then((x) => (this.dataunit = this.dataunit.concat(x["data"])));
    }

    reset() {
        console.log("reset");
    }

    resetAll(ev) {
      if (ev === "subcatalogue") {
          this.datasub.search = null;
          this.datasub.page = 1;
          this.subCatalogueData = [];
          this.getDataSubCatalogue();
      }
  }

    onSearchi(ev, identifier) {
        if (identifier === "subcatalogue") {
            this.datasub.search = ev.term;
            this.datasub.page = 1;
            this.subCatalogueData = [];
            this.getDataSubCatalogue();
        }

        if (identifier === "lod") {
            this.datasendlod.search = ev.term;
            this.datasendlod.pages = 1;
            this.datalod = [];
            this.getDataLod();
        }

        if (identifier === "standart") {
            this.datasendstandart.search = ev.term;
            this.datasendstandart.pages = 1;
            this.datastandart = [];
            this.getDataStandart();
        }

        if (identifier === "metode") {
            this.datasendmetode.search = ev.term;
            this.datasendmetode.pages = 1;
            this.datametode = [];
            this.getDataMetode();
        }

        if (identifier === "unit") {
            this.datasendunit.search = ev.term;
            this.datasendunit.pages = 1;
            this.dataunit = [];
            this.getDataUnit();
        }
    }

    async getValSubCatalogue(ev){
      await this.SampleForm.controls.subcatalogue.setValue(
        ev.id_sub_catalogue
      )
    }

    onScrollToEnd(e) {
        this.loading = true;
        if (e === "lod") {
            this.datasendlod.pages = this.datasendlod.pages + 1;
            this.getDataLod();
        }

        if (e === "standart") {
            this.datasendstandart.pages = this.datasendstandart.pages + 1;
            this.getDataStandart();
        }

        if (e === "metode") {
            this.datasendmetode.pages = this.datasendmetode.pages + 1;
            this.getDataMetode();
        }

        if (e === "unit") {
            this.datasendunit.pages = this.datasendunit.pages + 1;
            this.getDataUnit();
        }

        if (e === "subcatalogue") {
            this.datasub.page = this.datasub.page + 1;
            this.getDataSubCatalogue();
        }
    }

    getValLod(ev, identifier) {
        this.parameterselect[0].lod = ev.id;
        console.log(this.parameterselect);
    }

    async getDataTujuanPengujian() {
        await this._tujuanServ
            .getDataTujuanPengujian({ pages: 1, search: null })
            .then(
                (x) =>
                    (this.tujuanpengujian = this.tujuanpengujian.concat(
                        x["data"]
                    ))
            );
    }

    sampleform() {
        return this.fb.group({
            produkpangan: [null],
            tujuanpengujian: [null],
            // statuspengujian: [null],
            // catalogue: [null],
            subcatalogue: [null],
            no_notifikasi: [null],
            no_pengajuan: [null],
            no_registrasi: [null],
            no_principalCode: [null],
            batchno: [null],
            lotno: [null],
            factoryname: [null],
            trademark: [null],
            jeniskemasan: [null],
            // tgl_input: [null],
            // tgl_selesai: [null],
            tgl_produksi: [null],
            tgl_kadaluarsa: [null],
            // tgl_estimasi_lab: [null],
            valuePaket: [null],
            paketparameter: [null],
            paketPKM: [null],
            hasiltotalpaketuji: [null],
            FormatHasil: [null],
            parameteruji: [null],
            totalpembayaran: [null],
            // foto: this.fb.array([]),
            parameter: this.fb.array([]),
        });
    }

    // get addphoto() {
    //     return this.SampleForm.get("foto") as FormArray;
    // }

    get parameter() {
        return this.SampleForm.get("parameter") as FormArray;
    }

    getDataSelect(ev) {
        this.dataPaketuji = [];
        this.dataParameter = [];
        this.statussample = ev.name;
        if (ev.name === "PAKET") {
            this.getdataPaketuji();
            this.hidePaket = false;
            this.hideParameteruji = true;
            this.hidePaketPKM = true;
        }
        else if (ev.name === "PAKET PKM") {
            this.getdataPaketPKM();
            this.hidePaket = true;
            this.hideParameteruji = true;
            this.hidePaketPKM = false;
        }
        else {
            this.getDataParameter();
            this.hidePaket = true;
            this.hideParameteruji = false;
            this.hidePaketPKM = true;
        } 
    }

    hapussemua() {
        this.paketParameter = [];
        this.SampleForm.get("parameteruji").setValue(null);
        this.SampleForm.get("paketparameter").setValue(null);
        this.SampleForm.get("valuePaket").setValue(null);
        // console.log(this.SampleForm.get('valuePaket').setValue(null));
    }

    // openmodalGambar(v){
    //     let s = this.addphoto.value;
    //     const dialogRef = this.dialog.open(ImageModalComponent, {
    //         data: v.value,
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //         s[v.value.id].photo = result.a;
    //     });
    // }

    // openmodalphoto(v, i) {
    //     let s = this.addphoto.value;
    //     const dialogRef = this.dialog.open(ModalPhotoComponent, { 
    //         data:{
    //                 contract_no: this.contract_no,
    //                 no_sample: this.no_sample,
    //                 foto: v.value,
    //             }
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //         s[v.value.id].photo = result.a;
    //     });
    // } 

    // uploadGambar($event, id) : void {
    //     this.readThis($event.target); 
    //     console.log(id);
    //     this.idphoto = id;
    // }

    // readThis(inputValue: any): void {
    //     var file:File = inputValue.files[0];

    //     var pattern = /image-*/;
    //     if (!file.type.match(pattern)) {
    //         alert('Upload Only Image');
    //         return;
    //     }
    //     var myReader:FileReader = new FileReader();
      
    //     myReader.onloadend = (e) => { 
    //         this.SampleForm.controls.foto.value[this.idphoto].photo = myReader.result;
    //         console.log(this.SampleForm.controls.foto.value);
    //     }
    //     myReader.readAsDataURL(file);
    //   }

    getdataPaketPKM() {
        this._kontrakServ
            .getDataPaketPKM(this.dataselectPaketPKM)
            .then((paketparameter) => {
                console.log(paketparameter["data"]);
                this.dataPaketPKM = this.dataPaketPKM.concat(paketparameter["data"]);
            });
    }  

    getdataPaketuji() {
        this._kontrakServ
            .getDataPaketUji(this.dataselectPaketParameter)
            .then((paketparameter) => {
                console.log(paketparameter["data"]);
                this.dataPaketuji = this.dataPaketuji.concat(
                    paketparameter["data"]
                );
            });
    }

    getDataParameter() {
        this._kontrakServ
            .getDataParameter(this.dataselectParameter)
            .then((parameteruji) => {
                console.log(parameteruji["data"]);
                this.dataParameter = this.dataParameter.concat(
                    parameteruji["data"]
                );
            });
    }

    test(r) {
        this.paketParameter = this.paketParameter.filter((x) => r.id !== x.id);
        this.paketParameter = this.paketParameter.filter(
            (f) => f.status.toLowerCase().indexOf(r.status.toLowerCase) < 1
        );
        this.totalcalculated = this.totalcalculated - r.hargaParameter;
        console.log({a:r.hargaParameter, b:this.totalcalculated}) 
    }

    onSearchPaketPKM(ev) {
        this.dataselectPaketPKM.search = ev.term;
        this.dataselectPaketPKM.page = 1;
        this.dataPaketPKM = [];
        this.getdataPaketPKM();
    }

    onSearchPaketParameter(ev) {
        this.dataselectPaketParameter.search = ev.term;
        this.dataselectPaketParameter.page = 1;
        this.dataPaketuji = [];
        this.getdataPaketuji();
    }

    onSearchParameter(ev) {
        this.dataselectParameter.search = ev.term;
        this.dataselectParameter.page = 1;
        this.dataParameter = [];
        this.getDataParameter();
    }

    clearSelect(v) {
        if (v === "paketparameter") {
            this.dataselectPaketParameter.search = null;
            this.dataselectPaketParameter.page = 1;
            this.dataPaketuji = [];
            this.getdataPaketuji();
        } 
        if (v === "paketPKM") {
            this.dataselectPaketPKM.search = null;
            this.dataselectPaketPKM.page = 1;
            this.dataPaketPKM = [];
            this.getdataPaketPKM();
        }
        if (v === "parameteruji") {
            this.dataselectParameter.search = null;
            this.dataselectParameter.page = 1;
            this.dataParameter = [];
            this.getDataParameter();
        }
    }

    closeSelect(v) {
        this.clearSelect(v);
    }

    OnScrollEnd(v) {
        this.fetchMore(v);
    }

    closeParameter() {
        this.dialogRef.close({});
    }

    private fetchMore(v) {
        this.loading = true;
        if (v === "paketparameter") {
            this.dataselectPaketParameter.page =
                this.dataselectPaketParameter.page + 1;
            this.getdataPaketuji();
        } 
        else if (v === "paketPKM") {
            this.dataselectPaketPKM.page = this.dataselectPaketPKM.page + 1;
            this.getdataPaketPKM();
        }
        else {
            this.dataselectParameter.page = this.dataselectParameter.page + 1;
            this.getDataParameter();
        }


        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loading = false;
        }, 200);
    }

    getValformatHasil(e){
        this.chooseFormatHasil = e.hasil;
        console.log({a:this.dataFormatHasil , b:e, c:this.chooseFormatHasil});
    }

    async getValParameter(v) {

        if(this.SampleForm.value.statuspengujian === null){
            Swal.fire({
                title: 'Data Belum Lengkap',
                text: 'Lengkapi Status Pengujian !',
                icon: 'warning', 
                confirmButtonText: 'Ok'
            }) 
        } else {
            this.hidePaket = true;
            this.hideParameteruji = false;
            this.paketParameter = await this.paketParameter.concat({
                id: v["id"],
                name_id: v["name_id"],
                name_en: v["name_en"],
                format_hasil: this.chooseFormatHasil,
                lod: "",
                standart: "",
                unit: "",
                metode: "",
                status: "NON PAKET",
                id_lod: null,
                id_standart: null,
                id_unit: null,
                id_metode: null,
                id_lab: null,
                hargaParameter: this.chooseFormatHasil === "Triplo" ? v["price"] * 2 : v["price"],
            });
            await this.calculatePrice();
        }
        
    }

    async getValPengujian(ev) {
        console.log(ev.id);
        this.perkalian = ev.id;
    }


    async getValPaketPKM(v) {

        if(this.SampleForm.value.statuspengujian === null){
            Swal.fire({
                title: 'Data Belum Lengkap',
                text: 'Lengkapi Status Pengujian !',
                icon: 'warning', 
                confirmButtonText: 'Ok'
            });
        } else {
            console.log(v.price_is);
            // this.hasiltotalpaketuji = this.hasiltotalpaketuji.concat(v.price_is);
            // console.log(this.hasiltotalpaketuji);
            this.hidePaketPKM = false;
            this.hidePaket = true;
            this.hideParameteruji = true;
            console.log(v.id);
            await this._kontrakServ.getDataPaketPKMChoose(v.id).then((x) => {
                console.log(x);
                let a = [];
                a = a.concat(x);
                a.forEach((k) => { 
                        this.paketParameter = this.paketParameter.concat({
                            id: k.id,
                            name_id: k.subpackage_name,
                            name_en: "-",
                            format_hasil: "-",
                            lod: "",
                            standart: "",
                            unit: "",
                            status: "PAKET PKM", 
                            metode: "",
                            hargaParameter: k.price,
                            id_lod: null,
                            id_standart: null,
                            id_unit: k.unit_id,
                            id_metode: k.metode_id,
                            id_lab: null, 
                        }); 
                });
            });
            await console.log(this.paketParameter);
            await this.calculatePrice();
        } 
    }


    async getValPaketuji(v) {
        if(this.SampleForm.value.statuspengujian === null){
            Swal.fire({
                title: 'Data Belum Lengkap',
                text: 'Lengkapi Status Pengujian !',
                icon: 'warning', 
                confirmButtonText: 'Ok'
            });
        } else { 
            // console.log(v.price_is);
            // this.hasiltotalpaketuji = this.hasiltotalpaketuji.concat(v.price_is);
            // console.log(this.hasiltotalpaketuji);
            this.hidePaket = false;
            this.hideParameteruji = true;
            await this._kontrakServ.getDataPaketParameter(v.id).then((paket) => {
                console.log(paket);
                let a = [];
                a = a.concat(paket);
                console.log(this.paketParameter);
                a.forEach((k) => {
                    this.paketParameter = this.paketParameter.concat({
                        id: k["parameteruji"].id,
                        name_id: k["parameteruji"]["name_id"],
                        name_en: k["parameteruji"]["name_en"],
                        format_hasil: "-",
                        lod: k["paketuji"]["lod"].nama_lod,
                        standart: k["paketuji"]["standart"].nama_standart,
                        unit: k["paketuji"]["unit"].nama_unit,
                        status: k["paketuji"].kode_paketuji,
                        idpaket: k["paketuji"].id ? k["paketuji"].id : null,
                        metode: k["paketuji"]["metode"].metode,
                        hargaParameter: k["paketuji"].price_is,
                        id_lod: k["paketuji"].id_lod,
                        id_standart: k["paketuji"].id_standart,
                        id_unit: k["paketuji"].id_unit,
                        id_metode: k["paketuji"].id_metode,
                        id_lab: k["lab"].id,


                    });
                });
            });
            await console.log(this.paketParameter);
            await this.calculatePrice();
        } 
    }

    async calculatePrice() {
        let b = await this.paketParameter
            .filter((b) => b.status.toLowerCase().indexOf("pkt") > -1)
            .map((g) => g.hargaParameter);
        let c = await this.paketParameter
            .filter((bg) => bg.status === "NON PAKET")
            .map((z) => z.hargaParameter);
        let p = await this.paketParameter
            .filter((bg) => bg.status === "PAKET PKM")
            .map((z) => z.hargaParameter);
        
        let u = 0;
        if (p.length > 0) {
            u = await p.reduce((p, a) => p + a);
        } else {
            u = await 0;
        }

        let d = 0;
        if (c.length > 0) {
            d = await c.reduce((c, a) => c + a);
        } else {
            d = await 0;
        }

        let x = 0;
        if(b.length > 0){
            x = await this.hasiltotalpaketuji.reduce((cc, aa) => cc + aa);
        } else {
            x = await 0;
        }
        console.log(x);
        // let  = ;
        let totalparameter = await x;
        let total = await (totalparameter + d + u) * this.perkalian;
        this.totalcalculated = await total;
        await this.SampleForm.controls.totalpembayaran.setValue(
            this.totalcalculated
        );
        await console.log({nilaipaket: b, nilainonpaket: c, nilaiPaketPKM: p, pengujian:this.perkalian, reducenonpaket:d });
    }
}
