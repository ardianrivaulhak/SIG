import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../certificate.service';
import { ParameterCertificatemodalsComponent } from "../parametermodals/parametermodals.component";
import { MatDialog } from '@angular/material/dialog';
import { SubcatalogueService } from "../../../../master/subcatalogue/subcatalogue.service";
import { BrowserModule } from '@angular/platform-browser';
import { TujuanpengujianService } from '../../../../services/tujuanpengujian/tujuanpengujian.service';
import { AddresslistDialogComponent } from '../addresslist-dialog/addresslist-dialog.component';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-detailsamplelab',
  templateUrl: './detailsamplelab.component.html',
  styleUrls: ['./detailsamplelab.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DetailsamplelabComponent implements OnInit {

  loadingfirst = true;
  datasample = []; 
  dataparameter = [];
  displayedColumns: string[] = ['parameter_id', 'parameter_en','hasiluji','simplo', 'duplo','triplo', 'standart', 'lod','unit', 'metode'];
  total: number;
  from: number;
  to: number;
  pages = 1;
  datasentparameter = {
    pages : 1,
    id_sample : this.data.idsample,
    status : null,
    type : "paginate"
  }
  tabData = false;

  constructor(
    public dialogRef: MatDialogRef<DetailsamplelabComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certServ: CertificateService,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _subcatalogue: SubcatalogueService,
    private _tujuanServ: TujuanpengujianService
  ) { }

  ngOnInit(): void {  
    this.getDataSample();
    this.getDataParameter();
  }

  getDataSample(){
    console.log(this.data.idsample)
    this._certServ.getDetailSample(this.data.idsample)
    .then(x => this.datasample = this.datasample.concat(x))
    .then(() => console.log(this.datasample));
  }

  clickTab(param){
    this.tabData = param;
    console.log(param)
  }

  async getDataParameter(){
    console.log(this.data.idsample)
    await this._certServ.getParameterinSample(this.datasentparameter)
    .then(x => {this.dataparameter = this.dataparameter.concat(Array.from(x['data']))
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }  
    })
    .then(() => console.log(this.dataparameter));
    this.loadingfirst = await false;
  }

  sortData(sort: Sort) {
    const data = this.dataparameter.slice();
    if ( !sort.active || sort.direction === '') {
      this.dataparameter = data;
      return;
    }
    this.dataparameter = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'lhu': return this.compare(a.lhu, b.lhu, isAsc);
        case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'no_sample': return this.compare(a.no_sample, b.no_sample, isAsc);
        case 'sample_name': return this.compare(a.sample_name, b.sample_name, isAsc);
        case 'jenis_kemasan': return this.compare(a.jenis_kemasan, b.jenis_kemasan, isAsc);
        case 'batch_number': return this.compare(a.batch_number, b.batch_number, isAsc);
        case 'lot_number': return this.compare(a.lot_number, b.lot_number, isAsc);
        case 'tanggal_terima': return this.compare(a.tanggal_terima, b.tanggal_terima, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  paginated(f){
    this.dataparameter = [];
    this.datasentparameter.pages = f.pageIndex + 1;
    this.getDataParameter();
  }

  closeDialog(v) {
    return this.dialogRef.close({
        v
    });
}


}
