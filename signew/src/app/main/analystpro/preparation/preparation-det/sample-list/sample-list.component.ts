import { Component, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PreparationService } from '../../preparation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  styleUrls: ['./sample-list.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SampleListComponent implements OnInit {
  
  sampledata = [];
  dataSample = {
    idcontract: ''
  };
  displayedColumns: any[] = ['sample_name', 'no_sample', 'tgl_input', 'tgl_selesai' ,'price' ,'action'];
  idcontract: any;
  total: number;
  from: number;
  to: number;
  pages = 1;
  datasent = {
    pages : 1,
    search : null
  }

  message: any ;
  @Output() messageEvent = new EventEmitter<string>();

  constructor(
    private _masterServ: PreparationService,
    private _actRoute: ActivatedRoute,
    public router: Router,
  ) { 
    this.idcontract = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getDataSample();
  }

  getDataSample(){
    this.dataSample.idcontract = this.idcontract;
    // console.log(this.dataSample);

    this._masterServ.getDataDetailPreparation(this.dataSample).then(x => {
      this.sampledata = this.sampledata.concat(Array.from(x['data']));
      console.log(this.sampledata);
    })
  }

  showParameter(v){
    this.router.navigate(['analystpro/preparation', {data: v}]);
    console.log(v);
  }

  sendMessage(v) {
    this.messageEvent.emit(this.message);   
  }

}
