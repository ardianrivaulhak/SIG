import { Component, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../certificate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { every } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DetailsamplelabComponent } from "../modals/detailsamplelab/detailsamplelab.component";

@Component({
  selector: 'app-samplelab',
  templateUrl: './samplelab.component.html',
  styleUrls: ['./samplelab.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SamplelabComponent implements OnInit {

  loadingfirst = true;
  id_contract: any; 
  dataContract = [];
  dataSampleLab = [];
  displayedColumns: string[] = ['checkbox', 'no_sample', 'sample_name', 'status',  'cert_status','tgl_estimasi_lab', 'tgl_selesai','action'];
  total: number;
  from: number;
  to: number;
  pages = 1;
  data = {
    id : ''
  };
  datasent = {
    pages : 1,
    status : null,
    type : "paginate"
  }
  checkList = [];
  load = false;
  checkedata = [];
  btnCheck = false;

  allComplete: boolean = false;

  constructor(
    private _certServ: CertificateService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) {
    this.id_contract = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getContractDetail();
    this.getSampleLab();
  }

  getContractDetail(){
    this._certServ.getContractDetail(this.id_contract)
    .then(x => this.dataContract = this.dataContract.concat(x))
    .then(() => console.log(this.dataContract));
  }

  async getSampleLab(){
    console.log(this.datasent);
    await this._certServ.getSampleLabinContract(this.id_contract, this.datasent).then(async x => {
      this.dataSampleLab = this.dataSampleLab.concat(Array.from(x['data']));
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to'];
      }  
    })
    .then(x => console.log(this.dataSampleLab));
    
    this.loadingfirst =  await false;
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  paginated(f){
    this.dataSampleLab = [];
    this.datasent.pages = f.pageIndex + 1;
    this.getSampleLab();
  }


  sortData(sort: Sort) {
    const data = this.dataSampleLab.slice();
    if ( !sort.active || sort.direction === '') {
      this.dataSampleLab = data;
      return;
    }
    this.dataSampleLab = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
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

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.dataSampleLab == null) {
      return;
    }
    if(completed == true)
    {
      this.dataSampleLab.forEach(t => t.completed = completed);
      this.dataSampleLab.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.checkList = this.uniq(this.checkList, (it) => it.id);
    }else{
      this.dataSampleLab.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }


  updateAllComplete() {
    this.allComplete = this.dataSampleLab != null && this.dataSampleLab.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.dataSampleLab == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.dataSampleLab.filter(t => t.completed).length > 0 && !this.allComplete;
    
  }

  checkBox(ev,id){
    let z = this.checkList.filter(o => o.id == id);
    console.log(ev)
    if(ev){
      if(z.length > 0){
        z[0].checked = ev
      } else {
        this.checkList = this.checkList.concat({
          id: id,
          checked : true
        });
      }
    } else {
      let z = this.checkList.filter(x => x.id == id);
      z[0].checked = ev;
    }
    console.log(this.checkList)
  }


  makeLHU(){
  let u = [];
   this.checkList.forEach(x => {
     if(x.checked){
       u = u.concat({
         id: x.id
       })
     }
   })
 
   Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this Data!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Create it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.value) {
      this._certServ.makeLHU(u)
      Swal.fire(
        'lhu has been created!',
        'Your lhu has been created.',
        'success'
      )
        let message = {
          text: 'LHU successfully created',
          action: 'Done'
        }
        setTimeout(()=>{
        this.openSnackBar(message);
        this.loadingfirst = true;
        this._route.navigateByUrl('analystpro/certificate');
        this.load = false;
      },2000)
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'You canceled it:)',
        'error'
      )
    }
  })
  }

  cancelAction(){
    this.checkList = [];
    this.dataSampleLab = [];
    this.loadingfirst = true;
    this.getSampleLab();
    console.log(this.checkList)

  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  resultModals(idsample) : void 
  {
    let dialogCust = this._matDialog.open(DetailsamplelabComponent, {
      panelClass: 'result-datalab-dialog',
      height: '600px',
      width: '100%',
      data: { idsample: idsample },
      disableClose : true
    });
    dialogCust.afterClosed().subscribe((result) => {
      if(result.v == false)
      {
        this.loadingfirst =  true;
        this.dataSampleLab=[];
        this.getSampleLab();
      }
    });
  }



}
