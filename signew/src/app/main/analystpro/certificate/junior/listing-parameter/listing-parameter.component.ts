import { Component, OnInit, Optional, Inject, ViewEncapsulation, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../certificate.service';
import { CertmodalsComponent } from "../modals/certmodals/certmodals.component";
import { MatDialog } from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { MatTable } from "@angular/material/table";
import { ParameterujiService } from "../../../master/parameteruji/parameteruji.service";
import { DynamicModelParamComponent } from "../modals/dynamic-model-param/dynamic-model-param.component";
@Component({
  selector: 'app-listing-parameter',
  templateUrl: './listing-parameter.component.html',
  styleUrls: ['./listing-parameter.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ListingParameterComponent implements OnInit {


  listDataParameter = [];
  detailCertificate = [];
  dataFilter = {
    id_transaction : null,
    parameter_id : null,
    parameter_en : null,
    pages : 1
  }
  id_lhu : number;
  total: number;
  from: number;
  to: number;
  loadingfirst = true;
  load = false;



  constructor(
    private _certServ: CertificateService,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _parameterServ: ParameterujiService,
    private cdRef: ChangeDetectorRef,
    private _actRoute: ActivatedRoute,
    private _route: Router,
  ) { 
    this.id_lhu = this._actRoute.snapshot.params['id_lhu'];
    this.dataFilter.id_transaction = this.id_lhu
  }

  ngOnInit(): void {
    this.detailSCertificate();
    this.getParameter();
  }

  
  async detailSCertificate(){
    await this._certServ.detailSample(this.dataFilter).then( async x => {
      this.detailCertificate = this.detailCertificate.concat(x);
    })
    console.log(this.detailCertificate)
  }

  async getParameter(){
    console.log(this.dataFilter)
     await this._certServ.getParameter(this.dataFilter).then( async x => {
       let b = [];
       b = await b.concat(Array.from(x['data']));
       console.log(b)
 
       await b.forEach(x => {
         this.listDataParameter = this.listDataParameter.concat({
           id : x.id,
           id_parameteruji : x.id_parameteruji,
           parameteruji_id : x.parameteruji_id,
           parameteruji_en : x.parameteruji_en,
           unit : x.unit,
           hasiluji : x.hasiluji,
           simplo : x.simplo,
           duplo : x.duplo,
           triplo : x.triplo,
           metode : x.metode,
           lod : x.lod,
           standart: x.standart,
           n : x.n,
           c: x.c,
           m: x.m,
           mm : x.mm,
           desc : x.desc,
           completed : false
         })
       })
     })
     this.listDataParameter = this.uniq(this.listDataParameter, (it) => it.id);
      this.loadingfirst = await false;
     await console.log(this.listDataParameter)
   }

   uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listDataParameter, event.previousIndex, event.currentIndex);
    console.log(this.listDataParameter)
  }

  saveForm()
  {
    console.log(this.id_lhu, this.listDataParameter)
    this._certServ.parameterListing( this.listDataParameter)
    .then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.load = false;    
        this.listDataParameter = [];
        this.getParameter();
      },1000)
    })
  }

  goToParameter (id)
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/analystpro/certificate/lhu/${id}/parameters`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

  async clearSearch()
  {
    this.loadingfirst = await true;
    this.listDataParameter = await [];
    await this.getParameter();
    this.loadingfirst = await false
  }



}
