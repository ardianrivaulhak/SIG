import { Component, OnInit, Optional, Inject, ViewEncapsulation, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from "@fuse/animations";
import { MatSort, Sort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as XLSX from "xlsx";
import { ComplainService } from "../../complain.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerService } from "../../../master/customers/customer.service";
import { PageEvent } from "@angular/material/paginator";
import * as globals from "app/main/global";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class ModalsComponent implements OnInit {
  load = false;
  loadingfirst = true;
  displayedColumns: string[] = [
      "parameter",
      "hasil",
      "lod",
      "unit",
      "metode",
      "simplo",
      "duplo",
      "triplo",
      "memo",      
      "confirmation"
  ];

  displayedBeforeColumns: string[] = [
    "parameter",
    "hasil",
    "lod",
    "unit",
    "metode",
    "simplo",
    "duplo",
    "triplo",
    "memo",
];
  complainData = [];
  complainDataBefore = [];
  total: number;
  from: number;
  to: number;
  pages = 1;
  totalbefore: number;
  frombefore: number;
  tobefore: number;
  pagesbefore = 1;
  current_page : number;
  dataFilter = {
    id: 0,
    id_tech : 0,
    pages: 1,
    type: "",
    marketing: "",
    status: "",
    customer_name: null,
    lhu: 0,
    category: "",
    id_status_cust : "",
     parameter : []
  };


  constructor(
    public dialogRef: MatDialogRef<ModalsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data_complain: any,
    private _masterServ: ComplainService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {    
    this.getDataAfterRestest();
    this.getDataBeforeRetest();
    console.log(this.data_complain)
  }

  async getDataAfterRestest() {
    this.dataFilter.id_tech = await this.data_complain.id_technical;
    this.dataFilter.id = await this.data_complain.id;
    this.dataFilter.id_status_cust = await this.data_complain.statuscust;

    await this._masterServ
        .detailComplaints(this.dataFilter)
        .then((x) => {
            this.complainData = this.complainData.concat(x);
            this.complainData = globals.uniq(this.complainData, (it) => it.id);
        })
    this.loadingfirst = await false;
    await console.log(this.complainData)
  }

  async getDataBeforeRetest() {

    let a = this.data_complain.technical_detail.map(x => x.id_parameter_lhu);
    this.dataFilter.parameter = this.dataFilter.parameter.concat(a)
    this.dataFilter.lhu = await this.data_complain.technical.complain.id_cert;
    await this._masterServ.detailBeforeComplaints(this.dataFilter)
    .then((x) => {
          this.complainDataBefore = this.complainDataBefore.concat(x);
          this.complainDataBefore = globals.uniq(this.complainDataBefore, (it) => it.id);
    })  
    this.loadingfirst = await false;
    await console.log(this.complainDataBefore);
  }

  
  closeDialog(v) {
      return this.dialogRef.close({
        v
      });
  }

  async ApproveData()
  {
    this._masterServ
        .updateData(this.dataFilter)
        .then((y) => {
            this.load = true;
            let message = {
                text: "Data Succesfully Updated",
                action: "Done",
            };
            setTimeout(() => {
                this.openSnackBar(message);
                this.closeDialog(false);
                this.load = false;
            }, 1000);
        });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
        duration: 2000,
    });
}

}
