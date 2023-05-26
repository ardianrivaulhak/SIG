import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../../certificate.service';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-sample-data',
  templateUrl: './sample-data.component.html',
  styleUrls: ['./sample-data.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SampleDataComponent implements OnInit {

  access = [];
  datacontract = [];
  displayedColumns: string[] = [
    'no_sample', 
    'sample_name', 
    'status_pengujian',
    'status_lab',
    'tgl_selesai',
    'total_parameter'
  ];

  sampledata = [];
  total: number;
  from: number;
  to: number;

  dataFilter = {
    id_contract: this.data.id_contract,
    pages : 1,
    type : "paginate",
    marketing : '',
    sample_name: '',
    sample_number: '',
  }

  load = false;

  constructor(
    public dialogRef: MatDialogRef<SampleDataComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certService: CertificateService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    this.getContractDetail();
    this.getData();
  }

  getContractDetail(){
    this._certService.getContractDetail(this.data.id_contract)
    .then(x => this.datacontract = this.datacontract.concat(x))
    .then(() => console.log(this.datacontract));
  }

  getData()
  {
    this._certService.getSampleResultOfAnalysis(this.dataFilter).then(x => {
      this.sampledata = this.sampledata.concat(Array.from(x['data']));
      this.sampledata = this.uniq(this.sampledata, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }  
    })
    .then(x => console.log(this.sampledata));
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  paginated(f){
    this.sampledata = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getData();
  }

  sortData(sort: Sort) {
    const data = this.sampledata.slice();
    if ( !sort.active || sort.direction === '') {
      this.sampledata = data;
      return;
    }
    this.sampledata = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'category_code': return this.compare(a.category_code, b.category_code, isAsc);
        case 'contract_no': return this.compare(a.contract_no, b.contract_no, isAsc);
        case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'tanggal_terima': return this.compare(a.tanggal_terima, b.tanggal_terima, isAsc);
        case 'tanggal_selesai': return this.compare(a.tanggal_selesai, b.tanggal_selesai, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
