import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CertificateService } from '../../../../certificate.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
import { GroupService } from "app/main/analystpro/master/group/group.service";
import * as globals from "app/main/global";
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';

@Component({
  selector: 'app-autosend',
  templateUrl: './autosend.component.html',
  styleUrls: ['./autosend.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class AutosendComponent implements OnInit {
  dateNow = _moment().format("YYYY-MM-DD");
  loadingfirst = true;
  displayedColumns: string[] = [ 'checkbox', 'contract_number', 'lhu_number',  'customer_name', 'status' , 'desc','team'];
  certData = [];
  total: number;
  from: number;
  to: number;
  pages = 1;
  data = {
    id : ''
  };
  dataFilter = {
    contract : '',
    customer : '',
    status : '',
    date:  _moment().format("YYYY-MM-DD"),
    pages : 1
  }
  status = [
    {
      "id" : 0,
      "name" : "ready"
    },
    {
      "id": 1,
      "name" : "success"
    },
    {
      "id": 2,
      "name" : "cancel"
    },
    {
      "id": 3,
      "name" : "unsuccess"
    } 
  ]

  datasentCustomer = {
    pages: 1,
    search: null,
  };
  dataCustomer = [];
  groupdata = [];
  datasent = {
    pages : 1,
    marketing : null,
  }

  allComplete: boolean = false;
  checkList = [];
  constructor(
    private _masterServ: CertificateService,
    private _matDialog: MatDialog,
    private _msterCust: CustomerService,
    private _groupService : GroupService,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getDataCustomer();
  }

  async getData(){
    
    await this._masterServ.getDataDraft(this.dataFilter).then(async x => {
      this.certData = await this.certData.concat(Array.from(x['data']));
      this.certData = await globals.uniq(this.certData, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
        console.log(this.total)
      }  

    })
  }

  paginated(f){
    this.certData = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getData();
  }

  sortData(sort: Sort) {
    const data = this.certData.slice();
    if ( !sort.active || sort.direction === '') {
      this.certData = data;
      return;
    }
    this.certData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'contract_number': return this.compare(a.contract.contract_no, b.contract.contract_no, isAsc);
        case 'lhu_number': return this.compare(a.certificate.lhu_number, b.certificate.lhu_number, isAsc);
        case 'customer_name': return this.compare(a.contract.customer_handle.customers.customer_name, b.contract.customer_handle.customers.customer_name, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getDataCustomer() {
    this._msterCust
        .getDataCustomers(this.datasentCustomer)
        .then((x) => {
            this.dataCustomer = this.dataCustomer.concat(
                Array.from(x["data"])
            );
            this.dataCustomer = globals.uniq(
                this.dataCustomer,
                (it) => it.id_customer
            );
        }); 
  }

  onsearchselect(ev, val){
    if (val === "customer") {
      this.dataCustomer = [];
      this.datasentCustomer.search = ev.term;
      this.datasentCustomer.pages = 1;
      this.getDataCustomer();
    }
  }

  onScrollToEnd(e) {
    if (e === "customer") {
        this.datasentCustomer.pages = this.datasentCustomer.pages + 1;
        this._msterCust
            .getDataCustomers(this.datasentCustomer)
            .then((x) => {
                this.dataCustomer = this.dataCustomer.concat(x["data"]);
                console.log(this.dataCustomer);
            });
    }
  }

  async getGroup(){
    await this._masterServ.getSelectTeam(this.datasent).then(x => {
      this.groupdata = this.groupdata.concat(x);
    })
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.certData == null) {
      return;
    }
    if(completed == true)
    {
      this.certData.forEach(t => t.completed = completed);
      this.certData.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true,
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.certData.forEach(t => t.completed = completed);
      this.checkList = [];
    }
   
  }

  updateAllComplete() {
    this.allComplete = this.certData != null && this.certData.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.certData == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.certData.filter(t => t.completed).length > 0 && !this.allComplete;      
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
          checked : true,
        });
      }
    } else {
      let z = this.checkList.filter(x => x.id == id);
      z[0].checked = ev;
    }
    console.log(this.checkList)
  }

  removeBulk()
  {
    console.log(this.checkList)
   let u = [];
   this.checkList.forEach(x => {
     if(x.checked){
       u = u.concat({
         id: x.id
       })
     }
   })
   console.log(u)
   Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this Data!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Approve it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.value) {
      this._masterServ.removeDataDraft(u).then(x => {
      })
      Swal.fire(
        'Draft Canceled',
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
      this.certData=[];
      this.loadingfirst =  true;
      this.getData();
    },1000)
  })
  }

  async cancelAction(){
    this.checkList = await [];
    this.certData = await [];
    await this.getData();
  }

  async search()
  {
    console.log(this.dataFilter)
    this.certData = await [];
    await this.getData();
  }

  async cancelSearch()
  {
    this.dataFilter.contract =  await '';
    this.dataFilter.customer = await '';
    this.dataFilter.status = await '';
    this.dataFilter.date = await  _moment().format("YYYY-MM-DD");
    this.certData = await [];
    await this.getData();
  }

}
