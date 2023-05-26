import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from "xlsx";
import { ComplainService } from "../complain.service";
import { ActionComplaintComponent } from "./modals/action-complaint/action-complaint.component";
import * as globals from "app/main/global"
import { CustomerService } from "../../master/customers/customer.service";

@Component({
  selector: 'app-nontechnical',
  templateUrl: './nontechnical.component.html',
  styleUrls: ['./nontechnical.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class NontechnicalComponent implements OnInit {

  loadingfirst = true;
  displayedColumns: string[] = [ 'date_complain', 'marketing', 'complain' , 'message', 'repair', 'status','action'];
  nonteknisData = [];
  total: number;
  from: number;
  to: number;
  pages = 1;
  data = {
    id : ''
  };
  searchFilter = false;
  datasent = {
    pages : 1,
    marketing : null,
    principle : null,
    category : null,
    status : null
  }

  datasentCategory = {
    pages : 1,
    search : null,
    typeContract: null
  }

  dataFilter = {
    pages : 1,
    type : "paginate",
    marketing : '',
    status: '',
    customer_name: '',
    lhu: '',
    category: '',
  }

  contractcategory = [];
  statusPengujian = [];

  cobaData = null;
  cancelSearch = false;
  resultForm : FormGroup;

  status_cert = [ 
    {
      "title" : "ROA",
      "id" : 1
    }, 
    {
      "title" : "ROA Approve",
      "id" : 2
    }, 
    {
      "title" : "Draft",
      "id" : 3
    }, 
  ]

  datasentCustomer = {
    pages: 1,
    search: null,
  };
  dataCustomer = [];
  totalCust: number;
  fromCust: number;
  toCust: number;
  pagesCust = 1;

  constructor(
    private _masterServ : ComplainService,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _msterCust: CustomerService,

  ) { }

  ngOnInit(): void {
    this.getData();
    this.getDataCustomer();
  }

  async getData(){
    await this._masterServ.getDataNontechnical(this.dataFilter).then(x => {
      this.nonteknisData = this.nonteknisData.concat(Array.from(x['data']));
      this.nonteknisData = globals.uniq(this.nonteknisData, (it) => it.id);
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
    })
    .then(() => this.resultForm = this.createLabForm());
    this.loadingfirst =  await false;
    
    console.log(this.nonteknisData)
  }


  createLabForm(): FormGroup {       
    return this._formBuild.group({
      marketing:[''],
      category:[''],
      customer:[''],
      lhu:[''],
      status:['']
    })
  }

  selectData(data)
  {
    console.log(data);
    const dialogRef = this._matDialog.open(ActionComplaintComponent, {
      panelClass: 'complain-action-dialog',
      height: '600px',
      width: '800px',
      data: data
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
      if(result.param == true ){        
        this.nonteknisData = [];
        this.getData()
      }
       
    });
  }

  getDataCustomer() {
    console.log(this.datasentCustomer);
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
            console.log(this.dataCustomer);
            this.totalCust = x["total"];
            this.fromCust = x["from"] - 1;
            this.toCust = x["to"];
        });
    console.log(this.dataCustomer);
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


}
