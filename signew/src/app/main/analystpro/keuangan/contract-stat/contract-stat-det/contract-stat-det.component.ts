import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { KeuanganService } from '../../keuangan.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import * as XLSX from 'xlsx';
import { CustomerService } from "../../../master/customers/customer.service";
import * as _moment from 'moment';
import { InvoiceFormService } from "../../invoice/pdf/invoice.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractcategoryService } from 'app/main/analystpro/master/contractcategory/contractcategory.service';
import { ContractService } from "../../../services/contract/contract.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import * as globals from "app/main/global";
const terbilang = require('angka-menjadi-terbilang')
import { ModalAttachmentContractComponent } from "app/main/analystpro/contract/modal-attachment-contract/modal-attachment-contract.component";

@Component({
  selector: 'app-contract-stat-det',
  templateUrl: './contract-stat-det.component.html',
  styleUrls: ['./contract-stat-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ContractStatDetComponent implements OnInit {

  id_contract : any;
  contractData = [];
  loadingprev = false;
  displayedSampleColumns: string[] = [
  'no', 
  'sample_numb', 
  'sample_name'
  ];
  sampledata = [];
  invoicedata = [];

  constructor(
    private _menuServ: MenuService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private PdfServ: PdfService,
    private _kontrakServ: ContractService,
    private _route: Router,
    private _pdfServ: PdfService,
    private _keuServ : KeuanganService
  ) {
   this.id_contract = this._actRoute.snapshot.params['id'];
   }

  ngOnInit(): void {
    this.getContractData();
    this.getInvoice();
  }

  getContractData(){
    this._keuServ.getContract(this.id_contract)
    .then(x => this.contractData = this.contractData.concat(x))
    .then(() => this. sampledata = this.contractData[0].transactionsample)
    .then(() => this.payments())
  }

  getInvoice()
  {
    this._keuServ.getInvoiceByContract(this.id_contract)
    .then(x => this.invoicedata = this.invoicedata.concat(x))
    .then(c => console.log(this.invoicedata))
  }

  async openAttachMent(v, st) {
    const dialogRef = await this._matDialog.open(
        ModalAttachmentContractComponent,
        {
            height: "auto",
            width: "500px",
            data: {
                value: v,
                status: st,
            },
        }
    );
    await dialogRef.afterClosed().subscribe(async (x) => {});
  }

  openContract(v) {
    this.loadingprev = true;
    this._kontrakServ
        .getDataDetailKontrak(v)
        .then((x) => {
            this._pdfServ.generatePdf(x, "open");
        })
        .then(() => (this.loadingprev = false));
  }

  totalSample = null;
  downPayment = null
  ppn = null
  akg = null
  sampling = null;
  subTotal = null;
  discount = null;
  remainingPay = null;
  terbilang = null;

  async payments()
  {
     console.log(this.contractData)
     this.totalSample = await this.contractData[0].payment_condition.biaya_pengujian;    
     this.discount = await  this.contractData[0].payment_condition.discount_lepas == null ? this.contractData[0].transactionsample.map((x) => x.discount).reduce((a, b) => a + b) : this.contractData[0].payment_condition.discount_lepas;
     this.sampling = await  this.contractData[0].sampling_trans.length < 1 ? 0 :  this.contractData[0].sampling_trans.map((x) => x.sample).reduce((a, b) => a + b);
     this.akg = await  this.contractData[0].akg_trans.length < 1 ? 0 :  this.contractData[0].akg_trans.map((x) => x.akg).reduce((a, b) => a + b);
     this.subTotal = await this.totalSample + this.sampling + this.akg - this.discount;     
     this.ppn = await  this.contractData[0].payment_condition.ppn;
     this.downPayment = await  this.contractData[0].payment_condition.downpayment;
     this.remainingPay = await this.subTotal +  this.ppn - this.downPayment;
     this.terbilang = await  terbilang(this.remainingPay);
     
  }

}
