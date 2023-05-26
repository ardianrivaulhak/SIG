import { Component, OnInit, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { ModalPhotoComponent } from "../../../modal/modal-photo/modal-photo.component";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  Form,
} from "@angular/forms";
import { ContractService } from "../../../services/contract/contract.service";
import {url} from 'app/main/url';
@Component({
  selector: 'app-parameter-part-modal',
  templateUrl: './parameter-part-modal.component.html',
  styleUrls: ['./parameter-part-modal.component.scss']
})
export class ParameterPartModalComponent implements OnInit {

    urlnow = url;
  SampleForm: FormGroup;
    tgl_input: string;
    tgl_selesai: string;
    jumlahFoto= 0;
    sampaiFoto= 1;
    statussample: string;
    displayedColumns: string[] = ["name_id", "lab", "status", "action"];
    hasiltotalpaketuji = [];
    perkalian: number;
    totalcalculated: number;
    idphoto;
    dataFormatHasil = [
        {id: 1,"hasil": "Simplo"},{id: 2,"hasil": "Duplo"},{id: 3,"hasil": "Triplo"} 
    ];
    loading = false;
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
    chooseFormatHasil: any;
    hidePaketPKM = true;
    hideParameteruji = true;
    paketParameter = [];
    dataPaketDanSatuan = {
        paketparameter: [],
        paketPKM: [],
        satuanparameter: []
    }
    dataPaketuji = [];
        dataPaketPKM = [];
        dataParameter = [];
        dataselectParameter = {
            page: 1,
            search: null,
        };
        dataselectPaketPKM = {
            page: 1,
            search: null,
        };
        contract_no: any;
        no_sample: any;
        dataselectPaketParameter = {
            page: 1,
            search: null,
        };
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
    idContrack:any;
    dataSample = [];
    samplename: string;
    dataSampleFoto = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ParameterPartModalComponent>,
        private fb: FormBuilder, 
        private dialog: MatDialog,
        private _kontrakServ: ContractService,
    ) { 
      if (data) {
        console.log(data);
        console.log(data.sample.sample[0]);
        this.idContrack = data.idContrack;
        this.dataSample = this.dataSample.concat(data.sample.sample[0]);
        this.samplename = data.samplename;
        // this.setDataEdit(data.sample.sample[0]);   
        // this.dataSampleFoto = this.dataSampleFoto.concat(data.sample.sample[0].parameter[0].foto);
        // console.log(this.dataSampleFoto);
      }
      this.dialogRef.backdropClick().subscribe((v) => { 
        this.toggleParameter();
      });
    }

    uniq(data, key) {
      return [...new Map(data.map((x) => [key(x), x])).values()];
    }


    addfoto(){ 
        let x =  this.SampleForm.get("foto") as FormArray;
        console.log(x.length); 
        for (let i = 0; i < 1; i++) {
            (this.SampleForm.get("foto") as FormArray).push(
                this.fb.group({
                    id: x.length + i,
                    photo: null,
                })
            );
        }
        // this.SampleForm.controls.tgl_input.setValue(this.tgl_input);
        // this.SampleForm.controls.tgl_selesai.setValue(this.tgl_selesai);
        console.log(this.SampleForm.controls.foto.value);
    }


    ngOnInit(): void {
        this.SampleForm = this.parameterform();
        let x =  this.SampleForm.get("foto") as FormArray;
        // console.log(x.length); 
        for (let i = 0; i < 1; i++) {
            (this.SampleForm.get("foto") as FormArray).push(
                this.fb.group({
                    id: x.length + i,
                    photo: null,
                })
            );
        }
    }

    toggleParameter() { 

      if(this.SampleForm.value.tgl_selesai === null ||
        this.SampleForm.value.tgl_input === null)
      {
        Swal.fire({
            title: 'Data Belum Lengkap',
            text: 'Lengkapi !',
            icon: 'warning', 
            confirmButtonText: 'Ok'
        }) 
      }else{

                    var year = this.SampleForm.value.tgl_selesai._i.year;
                    var month = this.SampleForm.value.tgl_selesai._i.month + 1;
                    var date = this.SampleForm.value.tgl_selesai._i.date;  
                    var tangalSelesai = `${year}-${month}-${date}`
                    console.log(tangalSelesai);  
                 
                    var year = this.SampleForm.value.tgl_input._i.year;
                    var month = this.SampleForm.value.tgl_input._i.month + 1;
                    var date = this.SampleForm.value.tgl_input._i.date;  
                    var tangalInput = `${year}-${month}-${date}`
                    console.log(tangalInput); 

                this.SampleForm.controls.tgl_input.setValue(
                    tangalInput
                ); 
                this.SampleForm.controls.tgl_selesai.setValue(
                    tangalSelesai
                ); 

        let parameterSatuan = [];
        parameterSatuan = this.paketParameter.filter(
            (v) => v.status == "PKT1"
        );
        parameterSatuan.forEach((k) => { 
            this.dataPaketDanSatuan.paketparameter = this.dataPaketDanSatuan.paketparameter.concat({
                id_paketuji: k.id,
                status: "PAKET PARAMETER"
            }); 
        });


        let paketPKM = [];
        paketPKM = this.paketParameter.filter(
            (v) => v.status == "PAKET PKM"
        );
        paketPKM.forEach((z) => {
            z.detail_specific.forEach((k) => {
            this.dataPaketDanSatuan.paketPKM = this.dataPaketDanSatuan.paketPKM.concat({
                id_sub_specific_package: k.id_mstr_sub_specific_package,
                status: "PAKET PKM"
            });
            });
        });

        let satuanparameter = [];
        satuanparameter = this.paketParameter.filter(
            (v) => v.status == "NON PAKET"
        );
        satuanparameter.forEach((k) => { 
            this.dataPaketDanSatuan.satuanparameter = this.dataPaketDanSatuan.satuanparameter.concat({
                id_parameteruji: k.id,
                formathasil: k.format_hasil,
                id_standart: k.id_standart,
                id_lod: k.id_lod,
                id_unit: k.id_unit,
                id_metode: k.id_metode,
                id_lab: k.id_lab
            }); 
        });


        this.SampleForm.value.parameter = [];
        this.SampleForm.value.parameter = this.SampleForm.value.parameter.concat(this.dataPaketDanSatuan); 

        console.log(this.SampleForm.value);
        console.log(this.paketParameter);

        return this.dialogRef.close({
            b: "close",
            data: this.paketParameter,
            c: this.SampleForm.value,
        });
      }  
      
    }

    OnScrollEnd(e) {
        this.loading = true;
        if (e === "paketparameter") {
          this.dataselectPaketParameter.page = this.dataselectPaketParameter.page + 1;
          this.getdataPaketuji();
        } 
        if (e === "paketPKM") {
            this.dataselectPaketPKM.page = this.dataselectPaketPKM.page + 1;
            this.getdataPaketPKM();
        }
        if (e === "parameteruji") {
            this.dataselectParameter.page = this.dataselectParameter.page + 1;
            this.getDataParameter();
        }  
        setTimeout(() => {
            this.loading = false;
        }, 200);
      }

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

    parameterform(){ 
        return this.fb.group({ 
            valuePaket: [null],
            statuspengujian: [null],
            tgl_input: [null],
            tgl_selesai: [null],
            FormatHasil: [null],
            paketparameter: [null], 
            hasiltotalpaketuji: [null],
            paketPKM: [null],
            totalpembayaran: [null], 
            parameteruji: [null],
            foto: this.fb.array([]),
            parameter: this.fb.array([]),
        }); 
    }

    get addphoto() {
        return this.SampleForm.get("foto") as FormArray;
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
            // console.log(result) 
            let data = {
                idsample: this.dataSample[0].idsample,
                id: v.value.id,
                photo: result.a
            }
            console.log(data);
            this._kontrakServ.savePhoto(data).then((x) => {
                console.log(x); 
            }); 
            s[v.value.id].photo = result.a;
        });
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
            this.SampleForm.controls.foto.value[this.idphoto].photo = myReader.result;

            console.log(this.dataSample);
            let data = {
                idsample: this.dataSample[0].idsample,
                id: this.idphoto,
                photo: myReader.result
            }
            console.log(data);
            this._kontrakServ.savePhoto(data).then((x) => {
                console.log(x); 
            }); 
            console.log(this.SampleForm.controls.foto.value);
        }
        myReader.readAsDataURL(file);
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





    async getValPaketuji(v) {
        if(this.SampleForm.value.statuspengujian === null){
            Swal.fire({
                title: 'Data Belum Lengkap',
                text: 'Lengkapi Status Pengujian !',
                icon: 'warning', 
                confirmButtonText: 'Ok'
            });
        } else { 
            console.log(v);
            this.hasiltotalpaketuji = this.hasiltotalpaketuji.concat(v.price);
            console.log(this.hasiltotalpaketuji);
            this.hidePaket = false;
            this.hideParameteruji = true;
            await this._kontrakServ.getDataPaketParameter(v.id).then((paket) => {
                console.log(paket);
                let a = [];
                a = a.concat(paket); 
                console.log(a);
                a.forEach((f) => {
                    f.paketparameter.forEach((k) => {
                        this.paketParameter = this.paketParameter.concat({
                            id: k.id_parameter_uji,
                            name_id: k.parameteruji[0].name_id,
                            name_en: k.parameteruji[0].name_en, 
                            format_hasil: "-",
                            lod: k.lod.nama_lod,
                            standart: k.standart.nama_standart,
                            unit: k.unit.nama_unit,  
                            status: f.kode_paketuji,
                            metode: k.metode.metode,
                            hargaParameter: f.price,
                            id_lod: k.id_lod,
                            id_standart: k.id_standart,
                            id_unit: k.id_unit,
                            id_metode: k.id_metode,
                            id_lab: k.id, 
                        });
                    });
                });
            });
            await console.log(this.paketParameter);
            await this.calculatePrice();
        } 
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
            console.log(v);
            await this._kontrakServ.getDataPaketPKMChoose(v.mstr_specific_package_id).then((x) => {
                console.log(x);
                let a = [];
                a = a.concat(x);
                a.forEach((f) => { 
                    f.subspecific.forEach((z) => { 
                         
                            this.paketParameter = this.paketParameter.concat({
                                id: z.mstr_specific_package_id, 
                                name_id: z.subpackage_name,
                                name_en: "-",
                                format_hasil: "-",
                                lod: "",
                                standart: "",
                                unit: "",
                                status: "PAKET PKM", 
                                metode: "",
                                hargaParameter: z.price,
                                id_lod: null,
                                id_standart: z.id_standart,
                                id_unit: z.id_unit,
                                id_metode: z.id_metode,
                                id_lab: z.id_lab, 
                                detail_specific : z.detail_specific
                            }); 
                         
                    });
                });
            });
            await console.log(this.paketParameter);
            await this.calculatePrice();
        } 
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
            console.log(v);
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
                id_lab: v.mstr_laboratories_laboratory_id,
                hargaParameter: this.chooseFormatHasil === "Triplo" ? v.parameterprice[0].price * 2 : v.parameterprice[0].price,
            });
            await this.calculatePrice();
        }
        
    }








    async calculatePrice() {
        let b = await this.paketParameter
            .filter((b) => b.status.toLowerCase().indexOf("pkt") > -1)
            .map((g) => g.hargaParameter);
        console.log(b);
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
            await console.log(this.hasiltotalpaketuji);
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

    closeSelect(v) {
        this.clearSelect(v);
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


    async getValPengujian(ev) {
        console.log(ev.id);
        this.perkalian = ev.id;
    }


    deleteRow(r) {
        console.log(r);
        console.log(r);
        this.paketParameter = this.paketParameter.filter((x) => r.id !== x.id);
        this.paketParameter = this.paketParameter.filter(
            (f) => f.status.toLowerCase().indexOf(r.status.toLowerCase) < 1
        );
        this.totalcalculated = this.totalcalculated - r.hargaParameter;
        console.log({a:r.hargaParameter, b:this.totalcalculated}) 
    }


    async setDataEdit(v){
        await console.log(v); 
        let link = v.parameter[0].foto.length;
        let parameter = v.parameter[0];

        this.SampleForm = this.parameterform();
        this.totalcalculated = await parameter.totalpembayaran;
        for (let i = 0; i < 4; i++) {
            await (this.SampleForm.get("foto") as FormArray).push(
                this.fb.group({
                    id: v.parameter.length > 0 ? parameter.foto[i].id : i,
                    photo:
                        v.parameter.length > 0 ? parameter.foto[i].photo : null,
                })
            );
        } 
    }
}
