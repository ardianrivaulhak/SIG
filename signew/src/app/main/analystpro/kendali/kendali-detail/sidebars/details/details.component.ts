import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { KendaliService } from '../../../kendali.service';
// import { MatTableDataSource } from "@angular/material/table";
import { MetodeService } from "../../../../master/metode/metode.service";
import { LodService } from "../../../../master/lod/lod.service";
import { UnitService } from "../../../../master/unit/unit.service";
import { LabService } from "../../../../master/lab/lab.service";
import { MatDialog } from '@angular/material/dialog';
import { ModalDetailsComponent } from "../../sidebars/modal-details/modal-details.component";
import { ModalParameterlistComponent } from '../../modal-parameterlist/modal-parameterlist.component';


export interface datakendaliElement {
  no: number;
  nosample: string;
  samplename: string;
  jeniskemasan: string;
}

@Component({
  selector: 'kendali-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})


export class DetailsComponent implements OnInit {

  @Input() Message: any;
  displayedColumns: string[] = ['select', 'parameter', 'lab', 'lod', 'unit', 'metode'];
  
  kendaliArr : [];

  loading = false;
  datamethod = {
    pages: 1,
    search: null
  };
  methoddata = [];
  methodid : any;

  datalod = {
    pages: 1,
    search: null
  };
  loddata = [];

  dataunit = {
    pages: 1,
    search: null
  };
  unitdata = [];

  datalab = {
    pages: 1,
    search: null
  };
  labdata = [];
  
  constructor(
    private _kendaliServ:KendaliService,
    private _metodeServ:MetodeService,
    private _lodServ:LodService,
    private _unitServ:UnitService,
    private _labServ:LabService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.getDataMethod()
    this.getDataLod()
    this.getDataUnit()
    this.getDataLab()
  }

  receiveMessage($event) {
    this.Message = $event
    this.kendaliArr = this.Message[23].value
  }

  getValue(event, index) {
    console.log(this.methoddata)
  }

  async getDataMethod(){
    await this._metodeServ.getDataMetode(this.datamethod)
    .then(x => {
      //console.log(x['data']);
      this.methoddata = this.methoddata.concat(x['data'])
    })
    .then(()=> {
      this.methoddata = this.methoddata.filter((item,pos) => {
        return this.methoddata.indexOf(item) == pos
      })
    })
  }

  async getDataLod(){
    await this._lodServ.getDataLod(this.datalod)
    .then(x => {
      //console.log(x['data']);
      this.loddata = this.loddata.concat(x['data'])
    })
    .then(()=> {
      this.loddata = this.loddata.filter((item,pos) => {
        return this.loddata.indexOf(item) == pos
      })
    })
  }

  async getDataUnit(){
    await this._unitServ.getDataUnit(this.dataunit)
    .then(x => {
      //console.log(x['data']);
      this.unitdata = this.unitdata.concat(x['data'])
    })
    .then(()=> {
      this.unitdata = this.unitdata.filter((item,pos) => {
        return this.unitdata.indexOf(item) == pos
      })
    })
  }

  async getDataLab(){
    await this._labServ.getDataLab(this.datalab)
    .then(x => {
      //console.log(x['data']);
      this.labdata = this.labdata.concat(x['data'])
    })
    .then(()=> {
      this.labdata = this.labdata.filter((item,pos) => {
        return this.labdata.indexOf(item) == pos
      })
    })
  }

  // onScrollToEnd(e) {
  //   this.loading = true;
  //   if(e === 'method'){
  //     this.datamethod.pages = this.datamethod.pages + 1;
  //     this.getDataCust();
  //     console.log('hala');
  //   } 
  //   setTimeout(() => {
  //     this.loading = false;
  //   }, 200)
  // }

  // onSearch(ev,identifier) {
  //   if(identifier === 'method'){
  //     this.datamethod.search = ev.term;
  //     this.datamethod.pages = 1;
  //     this.methoddata = [];
  //     this.getDataCust();
  //   }
  // }

  openDialog() : void {
    const dialogRef = this._matDialog.open(ModalDetailsComponent, {
      panelClass: 'kendali-detail-dialog',
      //data: { data: this.sampledata[id] }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
     
    });
  }

}
