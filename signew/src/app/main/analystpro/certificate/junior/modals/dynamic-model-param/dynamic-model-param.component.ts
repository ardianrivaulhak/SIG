import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../certificate.service';
import { DataSource } from '@angular/cdk/table';
import { dataGender } from 'app/main/hris/employee/data-select';
import { AddresslistDialogComponent } from '../addresslist-dialog/addresslist-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../../../../master/customers/customer.service';
import { TujuanpengujianService } from '../../../../services/tujuanpengujian/tujuanpengujian.service';
import * as _moment from 'moment';
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { ParameterujiService } from "../../../../master/parameteruji/parameteruji.service";


@Component({
  selector: 'app-dynamic-model-param',
  templateUrl: './dynamic-model-param.component.html',
  styleUrls: ['./dynamic-model-param.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DynamicModelParamComponent implements OnInit {
  loadingfirst = false;
  total: number;
  from: number;
  to: number;
  titles = ''

  parameters = [];
  sendParam = {
    pages : 1,
    search : null
  }
  access_dialog : number
  lhudata = [];
  sendLhu = {
    contract : null,
    lhu : '',
    pages : 1
  }

  id_parameter : number;
  id_lhu : number;
  load = false;

  constructor(
    public dialogRef: MatDialogRef<DynamicModelParamComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certServ: CertificateService,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _matDialog: MatDialog,
    private _tujuanServ: TujuanpengujianService,
    private _custService: CustomerService,
    private _employee: EmployeeService,
    private _parameterServ: ParameterujiService,

  ) {
   
   }

  ngOnInit(): void {
      
     this.title();
     console.log(this.data)
  }

  title()
  {
    if(this.data.data == 'addParam'){
      this.titles = 'Add New Parameter';
      this.access_dialog = 1
      this.getParameters();
    }
    if(this.data.data == 'getParamLhu'){
      this.titles = 'Get Parameter Other LHU';
      this.access_dialog = 2
      this.getParameterinOtherLhu();
    }    
    console.log(this.access_dialog)
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }


  async  getParameters() {
    await this._parameterServ.getDataParameterUji(this.sendParam).then(x => {
       this.parameters = this.parameters.concat(Array.from(x['data']));
      this.parameters = this.uniq(this.parameters, (it) => it.id); 
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
    })
    this.loadingfirst =  await false;
  }

  async getParameterinOtherLhu()
  {
    this.sendLhu.contract = await this.data.id_kontrak
    await this._certServ.getLHUcontract(this.sendLhu).then(x => {
      this.lhudata = this.lhudata.concat(x);
   })
   this.loadingfirst =  await false;
  }


  searchParameters(ev)
  {
      this.sendParam.search = null
      console.log(ev)
      this.sendParam.search = ev.term;
      this.sendParam.pages = 1;
      this.getParameters();
  }

  searchLHU(ev)
  {
      this.lhudata = []
      this.sendLhu.lhu = null
      console.log(ev)
      this.sendLhu.lhu = ev.term;
      this.sendLhu.pages = 1;
      this.getParameterinOtherLhu();
      console.log(this.sendLhu)
  }

  onScrollToEnd(e) {
    if (e === "parameters") {
      this.sendParam.pages = this.sendParam.pages + 1; 
      this._parameterServ.getDataParameterUji(this.sendParam).then(x => {
        this.parameters = this.parameters.concat(x['data']);
        console.log(this.parameters);
      });
    }

  }

  reset(e){ 
    if (e === "parameters") { 
      this.sendParam.search = null; 
      this.loadingfirst = true;
      this.parameters = [];
      this.getParameters();
    } else if (e === "lhu_number"){  
      this.sendLhu.lhu = null;
      this.loadingfirst = true;
      this.lhudata = [];
      this.getParameterinOtherLhu();
    } 
  }

  saveForm()
  {
    if(this.access_dialog == 1)
    {
      this._certServ.addParameterCert(this.id_parameter, this.data.id_lhu)
      .then(y => {
      this.load = true;
      let message = {
          text: 'Data Succesfully Updated',
          action: 'Done'
      }
      setTimeout(()=>{  
          //this.openSnackBar(message);
          this.closeDialog(true);
          this.load = false;
      },1000)
      })
    }

    if(this.access_dialog == 2){
      this._certServ.getParameterCert(this.id_lhu, this.data.id_lhu)
      .then(y => {
      this.load = true;
      let message = {
          text: 'Data Succesfully Updated',
          action: 'Done'
      }
      setTimeout(()=>{  
          //this.openSnackBar(message);
          this.closeDialog(true);
          this.load = false;
      },1000)
      })
    }
  } 

  closeDialog(bolean){
    return this.dialogRef.close({
          bolean
    });
}



}
