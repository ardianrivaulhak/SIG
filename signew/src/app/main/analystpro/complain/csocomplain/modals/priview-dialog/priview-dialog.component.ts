import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { KeuanganService } from "app/main/analystpro/keuangan/keuangan.service";
import { ComplainService } from "../../../complain.service";
import Swal from 'sweetalert2';
import * as globals from "app/main/global";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-priview-dialog',
  templateUrl: './priview-dialog.component.html',
  styleUrls: ['./priview-dialog.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PriviewDialogComponent implements OnInit {

  load = false;
  dataComplain: any;
  dataParameterComplain = [];
  filterComplain = {
    pages: 1,
    type: "paginate",
    id_complain : '',
    search: null,
  };  
  dataLhu = []
  form_data = {
    idContract : null,
    idLhu : null,
    idSample : null,
    subject : null,
    message: null,
    type: null,
    typeAdd : 1
  }

  typeStat = [ 
    {
      "title" : "Certificate",
      "value" : 1,
    }, 
    {
      "title" : "Result",
      "value" : 2,
    }, 
  ];

  displayedColumns: string[] = [
    "parameter",
    "lab",
    "result",
    "unit",
    "complain",
    "expectation",
    "action"
  ];
  total: number;
  from: number;
  to: number;
  pages = 1;
  current_page : number;
  pageEvent: PageEvent;

  

  complainlist = [
    {
        id: 1,
        val: "Hasil Ketinggian",
    },
    {
        id: 2,
        val: "Hasil Kerendahan",
    },
    {
        id: 3,
        val: "Tidak Sesuai Spec",
    },
  ];


  parameterarray = [];
  parameterEdit = {
    id_lhu : '',
    id_complain : '',
    lab : '',
    beforeresult : '',
    unit : '',
    parameter : '',
    complain : '',
    expectation : ''
  };

  filterParameterInLhu = {
    id_transaction: '',
    parameter_id : '',
    parameter_en : ''
  }

  totalParameter: number;
  fromParameter: number;
  toParameter: number;
  pagesParameter = 1;
  current_pageParameter : number;
  pageEventParameter: PageEvent;

  activeBtn = false;
  constructor(
    public dialogRef: MatDialogRef<PriviewDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _kontrakServ: ContractService,
    private _keuServ : KeuanganService,
    private _compServ : ComplainService
  ) { }

  ngOnInit(): void {
    this.getDataComplain();
    this.getDataParameterComplain();
    this.getDataParameterCertificate();
  }

  async getDataComplain() {
    this.filterComplain.id_complain = await this.data.data.complain_tech[0].id;
    await this._compServ
        .showComplain(this.filterComplain)
        .then((x) => {
            this.dataComplain = x;
        });

        await console.log(this.dataComplain)
  }

  async getDataParameterComplain() {
    this.filterComplain.id_complain = await this.data.data.complain_tech[0].id;
    await this._compServ
        .showDetailComplain(this.filterComplain)
        .then((x) => {
            this.dataParameterComplain = this.dataParameterComplain.concat(x);
            this.dataParameterComplain = globals.uniq(this.dataParameterComplain,(it) => it.id );
            this.total = x["total"];
            this.from = x["from"] - 1;
            this.to = x["to"];
        });
  }

  paginated(f) {
    console.log(f);
    this.dataParameterComplain = [];
    this.filterComplain.pages = f.pageIndex + 1;
    this.getDataParameterComplain();
  }

  cancelData(data)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._compServ.cancelStatus(data).then(x => {
        })
        Swal.fire(
          'change status!',
          'Your imaginary file has been cancel.',
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
        this.closeModal(false)
        this.load = false;
      },1000)
    })
  }

  backData(data)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, back data',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._compServ.backStatus(data).then(x => {
        })
        Swal.fire(
          'change status!',
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
        this.closeModal(false)
        this.load = false;
      },1000)
    })
  }

  closeModal(a) {
    return this.dialogRef.close({
        a
    });
  }
  
  editPage()
  {
    this.activeBtn == true ? this.activeBtn = false :  this.activeBtn = true
  }


  async getDataParameterCertificate() {
    console.log(this.data.data)
    this.filterParameterInLhu.id_transaction = await this.data.data.id_cert;
    await this._compServ
        .parameterInLhu(this.filterParameterInLhu)
        .then((x) => {
            this.parameterarray = this.parameterarray.concat(Array.from(x["data"]));
            this.parameterarray = globals.uniq(this.parameterarray,(it) => it.id );
            this.totalParameter = x["total"];
            this.fromParameter = x["from"] - 1;
            this.toParameter = x["to"];
        });
  }

  async getDataParmater(ev)
  {
    await console.log(ev)
    this.parameterEdit.lab = await ev.lab;
    this.parameterEdit.beforeresult = await ev.hasiluji;
    this.parameterEdit.unit =  await ev.unit;
    this.parameterEdit.parameter = await ev.id;
    this.parameterEdit.id_lhu = await this.dataComplain.complain.id_cert;
    this.parameterEdit.id_complain = await this.dataComplain.id_complain;
  }

  saveForm() {
    if (this.parameterEdit.complain == null || this.parameterEdit.expectation == null) {
        Swal.fire({
            title: "Incomplete Data",
            text: "Please complete the blank data!",
            icon: "warning",
            confirmButtonText: "Ok",
        });
    } else {
        this._compServ.addParameterInComplain(this.parameterEdit).then((y) => {
            this.load = true;
            let message = {
                text: "Data Succesfully Updated",
                action: "Done",
            };
            setTimeout(async () =>  {
                await this.openSnackBar(message);
                this.dataParameterComplain = await [];
                await this.getDataParameterComplain();
                this.load = await false;
                await this.resetForm();
            }, 1000);
        });
    }
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
        duration: 2000,
    });
  }

  async resetForm()
  {
      this.parameterarray = await [];
      await this.getDataParameterCertificate();
      this.parameterEdit.id_lhu = await ''
      this.parameterEdit.id_complain = await ''
      this.parameterEdit.lab = await ''
      this.parameterEdit.beforeresult = await ''
      this.parameterEdit.unit = await ''
      this.parameterEdit.parameter = await ''
      this.parameterEdit.complain = await ''
      this.parameterEdit.expectation = await ''
  }

  async removeParameterinComplain(id)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove data',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._compServ.deleteParameterInComplain(id).then(x => {
        })
        Swal.fire(
          'change status!',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
      setTimeout( async ()=>{
        let message = {
          text: "Data Succesfully Updated",
          action: "Done",
      };
        await this.openSnackBar(message);
        this.dataParameterComplain = await [];
        await this.getDataParameterComplain();
        this.load = await false;
      },1000)
    })
  }

}
