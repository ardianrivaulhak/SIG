import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../../certificate.service';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { MatSort, Sort } from '@angular/material/sort'
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
@Component({
  selector: 'app-akgmodals',
  templateUrl: './akgmodals.component.html',
  styleUrls: ['./akgmodals.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AkgmodalsComponent implements OnInit {
  id_contract: any;
  loadingfirst = true;
  load = false;
  dataContract = [];
  dataFilter = {
    idcontract: '',
    pages : 1,
    status : null,
    type : "paginate"
  } 
  dataAkg = [];
  displayedColumns: string[] = [
    'lhu', 
    'bj', 
    'energi', 
    'takaran',  
    'format',
    'status',
    'inserted_at', 
    'user', 
    'action'
  ];
  total: number;
  from: number;
  to: number;
  pages = 1;

  jumlahakg : number;
  nominalakg : number;
  sisaAkg: number;

  akgData = [];

  loading = false;
  
  constructor(
    private _certServ: CertificateService,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _actRoute: ActivatedRoute,
    private _kontrakServ: ContractService,
    private PdfServ: PdfService,
    private _route: Router
  ) { 
    this.id_contract = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getContractDetail();
    this.getCertificate();
  }

  async getContractDetail(){
    await this._certServ.getContractDetail(this.id_contract)
       .then(x => this.dataContract = this.dataContract.concat(x))
    console.log(this.dataContract)
  }

  openPdf(v,val) {
    console.log(v)
        this._kontrakServ.getDataDetailKontrak(v).then((x) => {
          console.log(x)
            this.PdfServ.generatePdf(x,val);
        });
  }

  async getCertificate(){
    this.dataFilter.idcontract = await this.id_contract;
    await this._certServ.getAkg(this.dataFilter).then(async x => {
      this.akgData = this.akgData.concat(Array.from(x['data']))
      console.log(x)
    });
    setTimeout(() => {
      this.loadingfirst = false;
  }, 2000);
  }

  async approveAkg(id)
  {
    await this._certServ.approveAkg(id).then((x) => {
      this.loading = true;
      let message = {
          text: "Data Succesfully Updated",
          action: "Done",
      };
      setTimeout(() => {
          this.loading = false;
          this.akgData = [];
          this.getCertificate();
      }, 2000);
    });
  }

  goToAkg(id) {
    const url = this._route.serializeUrl(this._route.createUrlTree([`/akg/pdf-akg/` + id ]));      
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }


}
