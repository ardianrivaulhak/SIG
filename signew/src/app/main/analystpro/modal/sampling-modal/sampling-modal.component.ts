import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SamplingService } from '../../master/sampling/sampling.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from "@angular/material/table";
import { EmployeeService } from 'app/main/hris/employee/employee.service';
import * as global from 'app/main/global';

@Component({
  selector: 'app-sampling-modal',
  templateUrl: './sampling-modal.component.html',
  styleUrls: ['./sampling-modal.component.scss']
})
export class SamplingModalComponent implements OnInit {
  @ViewChild("table") MatTable: MatTable<any>;

  datasampling = [];
  selectdatasample;
  datasend = {
    page: 1,
    search: null
  }
  jumlah: number;
  displayedColumns: string[] = ['no', 'samplingname', 'price', 'jumlah' ,'total', 'select' ];
  samplingchoose = [];
  samplingcombine = [];
  valuechoose = [];
  samplingtotal: number = 0;
  
  employeeModel;
  metodeModel;
  kondisiModel;
  lokasiModel;

  employee = [];
  datasendEmployee = {
    pages: 1,
    search: null,
    level: null,
    division: null,
    employeestatus: null
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _samplingServ: SamplingService,
    private employeeServ: EmployeeService,
    private _dialogRef: MatDialogRef<SamplingModalComponent>
  ) {
    if(data){
      this.setData(data);
    }
    this._dialogRef.backdropClick().subscribe(v => {
      this.closeModal()
    });
   }

  ngOnInit(): void {
      this.getSampling();
      this.getDataEmployee();
  }

  async getSampling(){
    await this._samplingServ.getData(this.datasend).then(x => {
      this.datasampling = this.datasampling.concat(x['data']);
    })
  }

  getValDataSampling(ev){
    this.samplingchoose = [];
    this.samplingchoose = this.samplingchoose.concat(ev);
  }

  setData(d){
    if(d.contract_id){
      this._samplingServ.getDataDetailContract(d.contract_id).then((z: any) => {
        z.forEach(c => {
          this.samplingcombine = this.samplingcombine.concat({
            id: c.samplingmaster.id,
            sampling_name: c.samplingmaster.sampling_name,
            price: c.samplingmaster.price,
            desc: c.samplingmaster.desc,
            jumlah: c.jumlah,
            total: c.total
          })
        })
        this.samplingtotal = this.samplingcombine.map(t => t.total).reduce((a,b) => a+b);
      })
    } else {
      console.log(d)
      d.forEach((x) => {
        this.samplingcombine = this.samplingcombine.concat({
          id: x.samplingmaster ? x.samplingmaster.id : x.id,
          sampling_name: x.samplingmaster ? x.samplingmaster.sampling_name : x.sampling_name,
          price: x.samplingmaster ? x.samplingmaster.price : x.price,
          desc: x.samplingmaster ? x.samplingmaster.desc : x.desc,
          jumlah: x.jumlah,
          total: x.total
        })
      })
      this.samplingtotal = this.samplingcombine.length > 0 ? this.samplingcombine.map(t => t.total).reduce((a,b) => a+b) : 0;
    }
  }


  resetfield(){
    this.datasendEmployee = {
      pages: 1,
      search: null,
      level: null,
      division: null,
      employeestatus: null
    };
  
  }

  async onSearchi(ev, status) {
    await this.resetfield();
     this.datasendEmployee.search = await ev.term.toUpperCase();
     this.employee = await [];
    await this.getDataEmployee();
}

reset() {
  console.log('as');
}

onScrollToEnd(e) {
  this.datasendEmployee.pages = this.datasendEmployee.pages + 1;
  this.datasendEmployee.search = null;
  this.getDataEmployee();
}

getValue(ev, st){
  console.log(st);
}


  async satuin(){
       
    await this.samplingchoose.forEach((x,i) => {
      this.samplingcombine = this.samplingcombine.concat({
        id_sampling: x.id,
        sampling_name: x.sampling_name,
        price: x.price,
        desc: x.desc,
        jumlah: this.jumlah,
        total: parseInt(x.price) * this.jumlah
      })
    }) 
 
   this.samplingtotal = this.samplingcombine.length > 0 ? this.samplingcombine.map(t => t.total).reduce((a,b) => a+b) : 0;
  }

  deleterow(v){
    this.samplingcombine.splice(v,1);
    this.MatTable.renderRows();
    this.samplingtotal = this.samplingcombine.length > 0 ? this.samplingcombine.map(t => t.total).reduce((a,b) => a+b) : 0;
  }

  async getDataEmployee(){
    await this.employeeServ.getData(this.datasendEmployee).then(x => {
      x['data'].forEach(u => {
        this.employee = this.employee.concat({
          employee_id: u.employee_id,
          employee_name: u.employee_name
        })
      })
    });
    this.employee = global.uniq(this.employee, it => it.employee_id);
  }

  closeModal(){
    return this._dialogRef.close({
      a: this.samplingcombine,
      b: this.samplingcombine.length > 0 ? this.samplingcombine.map(x => x.total).reduce((a,c) => a+c) : 0,
      c: {
        metode: this.metodeModel,
        lokasi: this.lokasiModel,
        employee: this.employeeModel,
        kondisi: this.kondisiModel
      }
    });
  }

}
