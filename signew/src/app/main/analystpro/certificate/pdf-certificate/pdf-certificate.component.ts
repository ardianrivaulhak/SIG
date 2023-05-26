import { Component, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../certificate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';

// ID Cert
import { FormatAverageService } from "../pdf/certificate_id/format-average.service";
import { FormatDuploService  } from "../pdf/certificate_id/format-duplo.service";
import { FormatTriploService } from "../pdf/certificate_id/format-triplo.service";
import { FormatOtkService  } from "../pdf/certificate_id/format-otk.service";
import { FormatSNIService } from "../pdf/certificate_id/format-sni.serivce";
import { FormatOtkDuploService  } from "../pdf/certificate_id/format-otkduplo.service";
import { FormatOtkTriploService  } from "../pdf/certificate_id/format-otktriplo.service";
import { FormatStandartService  } from "../pdf/certificate_id/format-standart.service";
import { FormatNormalManualService } from "../pdf/certificate_id/format-normal-manual.service";
import { FormatPerka13Service } from "../pdf/certificate_id/format-perka13.service"
import { FormatPerka8Service } from "../pdf/certificate_id/format-perka8.service"
import { formatMikroTepungTeriguService } from "../pdf/certificate_id/format-mikrobiologi-tepung-terigu.service";
import { FormatMikroSNIService } from "../pdf/certificate_id/format-mikro-sni.service";
import { FormatJarumSuntikService } from "../pdf/certificate_id/format-jarum-suntik.service";
import { FormatTekananDifferentialService } from "../pdf/certificate_id/format-tekanan-differential.service";

// EN Cert
import { FormatAverageEnService } from "../pdf/certificate_en/format-average-en.service";
import { FormatDuploEnService } from "../pdf/certificate_en/format-duplo-en.service";
import { FormatTriploEnService } from "../pdf/certificate_en/format-triplo-en.service";
import { FormatStandartEnService } from "../pdf/certificate_en/format-standart-en.service";
import { FormatSNIEnService } from "../pdf/certificate_en/format-sni-en.service";
import { FormatOtkEnService } from "../pdf/certificate_en/format-otk-en.service";
import { FormatOtkDuploEnService } from "../pdf/certificate_en/format-otkduplo-en.service";
import { FormatOtkTriploEnService } from "../pdf/certificate_en/format-otktriplo-en.service";
import { FormatNormalManualEnService } from "../pdf/certificate_en/format-normal-manual-en.service";
import { FormatPerka13EnService } from "../pdf/certificate_en/format-perka13-en.service"
import { FormatPerka8EnService } from "../pdf/certificate_en/format-perka8-en.service"
import { formatMikroTepungTeriguEnService } from "../pdf/certificate_en/format-format-mikrobiologi-tepung-terigu-en.service"
import { FormatMikroSNIEnService  } from "../pdf/certificate_en/format-mikro-sni-en.service";
import { FormatJarumSuntikenService  } from "../pdf/certificate_en/format-jarum-suntiken.service";
import { FormatTekananDifferentialEnService } from "../pdf/certificate_en/format-tekanan-differential-en.service";

import { FuseConfigService } from '@fuse/services/config.service';


import { LoginService } from "app/main/login/login.service";
import { url }from "app/main/url";

@Component({
  selector: 'app-pdf-certificate',
  templateUrl: './pdf-certificate.component.html',
  styleUrls: ['./pdf-certificate.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})


export class PdfCertificateComponent implements OnInit {

    id_lhu = this._actRoute.snapshot.params['id_lhu'];
    lang= this._actRoute.snapshot.params['lang'];
    manual = url;
    dataFilter = {
        id_transaction : this.id_lhu ,
        pages : 1
    }
    parameterData = []
    certificateData : any;
    load = true;
    mine = [];
    notshowing = true;
    notactive = false;
    identity : any;


  constructor(
    private route: ActivatedRoute,
    private _actRoute: ActivatedRoute,
    private _certServ: CertificateService,
    private _logServ: LoginService,

       // id cert
    private _formatAverage: FormatAverageService,
    private _formatDuplo: FormatDuploService,
    private _formatTriplo: FormatTriploService,
    private _formatOtk: FormatOtkService,
    private _formatStandart: FormatStandartService,
    private _formatSNI: FormatSNIService,
    private _formatOtkDuplo: FormatOtkDuploService,
    private _formatOtkTriplo: FormatOtkTriploService,
    private _formatNormalManual: FormatNormalManualService,
    private _formatPerka13 : FormatPerka13Service,
    private _formatPerka8 : FormatPerka8Service,
    private _formatMikroTepungTerigu : formatMikroTepungTeriguService,
    private _formatMikroSNI : FormatMikroSNIService,
    private _formatJarumSuntik : FormatJarumSuntikService,
    private _formatTekananDifferential : FormatTekananDifferentialService,

    //en cert
    private _formatAverageEn: FormatAverageEnService,
    private _formatDuploEn: FormatDuploEnService,
    private _formatTriploEn: FormatTriploEnService,
    private _formatStandartEn: FormatStandartEnService,
    private _formatSNIEn: FormatSNIEnService,
    private _formatOtkEn: FormatOtkEnService,
    private _formatOtkDuploEn: FormatOtkDuploEnService,
    private _formatOtkTriploEn: FormatOtkTriploEnService,
    private _formatNormalManualEn: FormatNormalManualEnService,
    private _formatPerka13En : FormatPerka13EnService,
    private _formatPerka8En : FormatPerka8EnService,
    private _formatMikroTepungTeriguEn : formatMikroTepungTeriguEnService,
    private _formatMikroSNIEn : FormatMikroSNIEnService,
    private _formatJarumSuntiken : FormatJarumSuntikenService,
    private _formatTekananDifferentialen : FormatTekananDifferentialEnService,

    private _loginServ: LoginService,
    private _fuseConfigService: FuseConfigService,
  ) {

    this._fuseConfigService.config = {
        layout: {
            navbar   : {
                hidden: true
            },
            toolbar  : {
                hidden: true
            },
            footer   : {
                hidden: true
            },
            sidepanel: {
                hidden: true
            }
        }
      };
   }

  ngOnInit(): void {
    this.getMe();
  }

//   Notification.requestPermission().then(function(result) {
//     console.log(result);
//   });

  async getMe(){
    this.load = true;
    await this._logServ.checking_me().then(async x =>
         this.mine = await this.mine.concat(x)
         ).catch( z => this.mine = []);
    this.identity = await this.mine;
    await this.checkingData()
  }  

  async checkingData()
  {
    
    await console.log(this.identity)
    await this._certServ.detailLhu(this.id_lhu)
    .then(x => this.certificateData = x)
    await console.log(this.certificateData)

    if(this.identity.length > 0){
        if(this.certificateData.transaction_sample.kontrakuji.hold == 'N'){
            if(this.certificateData.active == 'Y'){                
                this.notshowing = false;
                this.load = false;
                this.checklang();
            }else{
               if(this.identity[0].id_bagian == 1  ){
                    this.notshowing = false;
                    this.load = false;
                    this.checklang();
                }else{
                    this.notshowing = true;
                    this.notactive = true;
                }
            }
        }else{
            this.checkData();
        }
    }else{
        if(this.certificateData.transaction_sample.kontrakuji.hold == 'N'){
            if(this.certificateData.active == 'Y'){
                 if(this.certificateData.condition_cert[this.certificateData.condition_cert.length - 1].status == 1  || 
                    this.certificateData.condition_cert[this.certificateData.condition_cert.length - 1].status == 2){
                        this.notshowing = true;
                        this.notactive = true;
                }else{
                    this.notshowing = false;
                    this.load = false;
                    this.checklang();
                }               
            }else{
                this.notshowing = true;
                this.notactive = true;
            }
        }else{
            this.notshowing = true;
            this.load = false;
        }
    }    
  }

  async checkData()
  {
    if(this.identity.length > 0){
        if(this.identity[0].id_bagian == 1 || this.identity[0].id_bagian == 2){   
            this.notshowing = false; 
            this.checklang();    
          }else{
            if(this.identity[0].user_id == 1){          
              this.notshowing = false;
              this.load = false;
              this.checklang();
            }else{
              this.notshowing = true;
              this.load = false;
            }
          }
    }else{
        this.checklang();
        this.notshowing = false;
        this.load = false;
    }
    console.log( this.notshowing)
    console.log( this.load)
  }

  async checklang()
  {
    console.log(this.lang)
    if(this.lang == 'id'){
        await this.indonesiaCertificate();
    }
    if(this.lang == 'en'){
        await this.englishCertificate();
    }
  }

  async indonesiaCertificate(){
        let format = this.certificateData.format.id;
        await console.log(this.identity)
        await console.log(this.certificateData)
        await setTimeout(() => {
            this.load = false;
        },2000);
        
        switch (format) { 
            case 2:
                await this._formatDuplo.generatePdf(this.certificateData, this.identity);
                break;

            case 3:
                await this._formatTriplo.generatePdf(this.certificateData, this.identity);
                break;

            case 4:
                await this._formatStandart.generatePdf(this.certificateData, this.identity);
                break;

            case 5:
                await this._formatSNI.generatePdf(this.certificateData, this.identity);
                break;

            case 6:
                await this._formatPerka8.generatePdf(this.certificateData, this.identity);
                break;

            case 7:
                await this._formatPerka13.generatePdf(this.certificateData, this.identity);
                break;

            case 8:
                await this._formatOtk.generatePdf(this.certificateData, this.identity);
                break;

            case 9:
                await this._formatOtkDuplo.generatePdf(this.certificateData, this.identity);
                break;

            case 10:
                await this._formatOtkTriplo.generatePdf(this.certificateData, this.identity);
                break;
            
            case 11:
                await console.log(url + 'manual/n/' + this.certificateData.id)
                window.location.href = await url + 'manual/n/' + this.certificateData.id;
                break;

            case 12:
                await console.log(url + 'manual/o/' + this.certificateData.id)
                window.location.href = await url + 'manual/o/' + this.certificateData.id;
                break;

            case 13:
                await this._formatMikroTepungTerigu.generatePdf(this.certificateData, this.identity);
                break;

            case 14:
                await this._formatMikroSNI.generatePdf(this.certificateData, this.identity);
                break;

            case 15:
                await this._formatJarumSuntik.generatePdf(this.certificateData, this.identity);
                break;

            case 20:
                await this._formatTekananDifferential.generatePdf(this.certificateData, this.identity);
                break;

            default:
                await this._formatAverage.generatePdf(this.certificateData, this.identity);
                break;   
        }
  }


  async englishCertificate(){
    let format = this.certificateData.format.id;
    
    await setTimeout(() => {
        this.load = false;
    },2000);
    
     switch (format) { 
        case 2:
            await this._formatDuploEn.generatePdf(this.certificateData, this.identity);
            break;

        case 3:
            await this._formatTriploEn.generatePdf(this.certificateData, this.identity);
            break;

        case 4:
            await this._formatStandartEn.generatePdf(this.certificateData, this.identity);
            break;

        case 5:
            await this._formatSNIEn.generatePdf(this.certificateData, this.identity);
            break;

        case 6:
            await this._formatPerka8En.generatePdf(this.certificateData, this.identity);
            break;

        case 7:
            await this._formatPerka13En.generatePdf(this.certificateData, this.identity);
            break;

        case 8:
            await this._formatOtkEn.generatePdf(this.certificateData, this.identity);
            break;

        case 9:
            await this._formatOtkDuploEn.generatePdf(this.certificateData, this.identity);
            break;
            
        case 10:
            await this._formatOtkTriploEn.generatePdf(this.certificateData, this.identity);
            break;

        case 11:
            await this._formatNormalManualEn.generatePdf(this.certificateData, this.identity);
            break;

        case 12:
            await this._formatNormalManualEn.generatePdf(this.certificateData, this.identity);
            break;

        case 13:
            await this._formatMikroTepungTeriguEn.generatePdf(this.certificateData, this.identity);
            break;

        case 14:
            await this._formatMikroSNIEn.generatePdf(this.certificateData, this.identity);
            break;

        case 15:
            await this._formatJarumSuntiken.generatePdf(this.certificateData, this.identity);
            break;

            
        case 20:
            await this._formatTekananDifferentialen.generatePdf(this.certificateData, this.identity);
            break;


        default:
            await this._formatAverageEn.generatePdf(this.certificateData, this.identity);
            break;
    }
  }

}
