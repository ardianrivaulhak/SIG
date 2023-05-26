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
  selector: 'app-parameter-edit',
  templateUrl: './parameter-edit.component.html',
  styleUrls: ['./parameter-edit.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ParameterEditComponent implements OnInit {
  displayedColumns: string[] = [
    'number',
    'action',
    'desc',
    'parameteruji_id', 
    'parameteruji_en',
    'hasiluji',
    'actual_result',
    'unit',
    'simplo',
    'duplo',
    'triplo',
    'metode',
    'lod',
    'standart',
    'n',
    'c',
    'm',
    'mm',
    'star'
    ];
  id_lhu : any;
  dataFilter = {
    id_transaction : null,
    parameter_id : null,
    parameter_en : null,
    pages : 1
  }
  listDataParameter = [];
  detailCertificate = []
  total: number;
  from: number;
  to: number;

  formdata = {
    parameter_id: null,
    parameter_en: null
  }
  allComplete: boolean = false;
  copydata = []
  checkList = []
  idcert :any
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
      console.log(b);
      await b.forEach(x => {
        this.listDataParameter = this.listDataParameter.concat({
          id : x.id,
          id_parameteruji : x.id_parameteruji,
          parameteruji_id : x.parameteruji_id,
          parameteruji_en : x.parameteruji_en,
          unit : x.unit,
          hasiluji : x.hasiluji,
          actual_result : x.actual_result,
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
          lab : x.lab,
          format_hasil : x.format_hasil,
          status: x.status,
          info_id : x.info_id,
          position : x.position + this.listDataParameter.length + 1,
          completed : false
        })
      })
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to'];
      }  
    })
    this.listDataParameter = this.uniq(this.listDataParameter, (it) => it.id);
    await console.log(this.listDataParameter)
  }

  async searchButton()
  {
    this.listDataParameter = await [];
    await this.getParameter();
  }

  async clearSearch()
  {
    this.listDataParameter = [];
    this.dataFilter.parameter_id = await null 
    this.dataFilter.parameter_en = await null
    await this.getParameter();
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.listDataParameter == null) {
      return;
    }
    if(completed == true)
    {
      this.listDataParameter.forEach(t => t.completed = completed);
      this.listDataParameter.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.idcert = this.listDataParameter[0].id_transaction_sample
      this.checkList = this.uniq(this.checkList, (it) => it.id);
    }else{
      this.listDataParameter.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }

  updateAllComplete() {
    this.allComplete = this.listDataParameter != null && this.listDataParameter.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.listDataParameter == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.listDataParameter.filter(t => t.completed).length > 0 && !this.allComplete;      
  }

  checkBox(ev, id){
    let z = this.checkList.filter(o => o.id == id);
   
    if(ev){
      if(z.length > 0){
        z[0].checked = ev
      } else {
        this.checkList = this.checkList.concat({
          id: id,
          checked : true
        });
      }
    } else {
      let z = this.checkList.filter(x => x.id == id);
      z[0].checked = ev;
    }
    this.idcert = this.checkList[0].id_transaction_sample;
  }

  deleteParameterBulk()
  {
    let u = [];
        this.checkList.forEach((x) => {
            if (x.checked) {
                u = u.concat({
                    id: x.id,
                });
            }
        });
    console.log(u)
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._certServ.deleteBulkParameter(u, this.checkList[0].id_transaction_sample).then(x => {
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
        this.listDataParameter=[];
        this.checkList = [];
        this.loadingfirst =  true;
        this.getParameter();
        this.load = false;
      },1000)
    })
  }


  saveForm()
  {
    console.log(this.id_lhu, this.listDataParameter)
    this._certServ.updateSertifikatParameter(this.id_lhu, this.listDataParameter)
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

  copyParameter(data, ev){
    this.copydata = [{data : data, ev : ev}];
    console.log(this.copydata)
  }

  CopyDataParameters(ev, v)
  {
    console.log(ev)
    this._certServ.copyDataParameterinLhu( ev, this.id_lhu)
    .then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Copied',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.load = false;    
        this.listDataParameter = [];
        this.getParameter();
      },1000)
    })
  }

  deleteDataParameter(id)
  {
    
    this._certServ.deleteDataParameterinLhu( id)
    .then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Copied',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.load = false;    
        this.listDataParameter = [];
        this.getParameter();
      },1000)
    })
  }


  cancelCopyParameter()
  {
    this.copydata = [];
  }

  parameterDynamic(data)
  {
      console.log(data)
      const dialogRef = this._matDialog.open(DynamicModelParamComponent, {
      panelClass: 'certificate-dynamic-dialog',
      data: { 
              data : data, 
              id_lhu : this.id_lhu,
              id_kontrak : this.detailCertificate[0].transaction_sample.id_contract
            },
      disableClose: true 
      });

      dialogRef.afterClosed().subscribe( result => {
          console.log(result)
          if(result.bolean == true){
            this.listDataParameter = []
            this.getParameter();
            this.loadingfirst =  true;
          }
      });
  }

  getParameterinSample()
  {
    console.log(this.dataFilter.id_transaction)
    let id = this.dataFilter.id_transaction;
    Swal.fire({
        title: 'Are you sure?',
        text: 'you will get parameter in sample lab',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Lets Go!',
        cancelButtonText: 'No, Maybe later'
      }).then((result) => {
        if (result.value) {
          this._certServ.getParameterHasBeenDelete(id).then(x => {
          })
          Swal.fire(
            'Success!',
            'Parameter Restore',
            'success'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
        let message = {
            text: 'Data Succesfully Updated',
            action: 'Done'
        }
        setTimeout(()=>{
            this.loadingfirst =  true;
            this.load = false;
            this.listDataParameter = []
            this.getParameter()
        },1000)
      })
  }

  getParameterinLab()
  {
    console.log(this.dataFilter.id_transaction)
    let id = this.dataFilter.id_transaction;
    Swal.fire({
        title: 'Are you sure?',
        text: 'you will get parameter in sample lab',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Lets Go!',
        cancelButtonText: 'No, Maybe later'
      }).then((result) => {
        if (result.value) {
          this._certServ.getParameterinLab(id).then(x => {
          })
          Swal.fire(
            'Success!',
            'Parameter Restore',
            'success'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
        let message = {
            text: 'Data Succesfully Updated',
            action: 'Done'
        }
        setTimeout(()=>{
            this.loadingfirst =  true;
            this.load = false;
            this.listDataParameter = []
            this.getParameter()
        },1000)
      })
  }

  goToListing (id)
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/analystpro/certificate/lhu/${id}/listing-parameters`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }



}
