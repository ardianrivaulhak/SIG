import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CertificateService } from '../../../certificate.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ContractcategoryService } from '../../../../services/contractcategory/contractcategory.service';
import { StatuspengujianService } from '../../../../services/statuspengujian/statuspengujian.service';
import { ModalResultComponent } from "../modals/modal-result/modal-result.component";
import { SelectTeamComponent } from "../modals/select-team/select-team.component";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
import { GroupService } from "app/main/analystpro/master/group/group.service";
import * as globals from "app/main/global";
import { ActivatedRoute, Router } from '@angular/router';
import { ReportkpiComponent } from "../modals/reportkpi/reportkpi.component";
import * as XLSX from "xlsx";



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {
  load = false;
  loadingfirst = true;
  displayedColumns: string[] = [ 'contract_no', 'hold', 'customer_name' ,'progress', 'desc','team'];
  certData = [];
  total: number;
  from: number;
  to: number;
  pages = 1;
  data = {
    id : ''
  };
  checkList = [];
  searchFilter = false;
  datasent = {
    pages : 1,
    marketing : null,
  }

  dataFilter = {
    contract: null,
    hold : null,
    customer: null,
    status: null,
    team: null,    
    pages : 1,
    type : "paginate",
  }

  DataStatus = [
    {
      "id": 2,
      "name": "RoA"

    },
    {
      "id": 3,
      "name": "Draft"

    }
  ];

  holds = [
    {
      "id" : "Y",
      "name" : "hold"
    },
    {
      "id": "N",
      "name" : "unhold"
    } 
  ]
  contractcategory = [];
  statusPengujian = [];
  allComplete: boolean = false;
  parameterData = [];
  cobaData = null;
  cancelSearch = false;
  datasentCustomer = {
    pages: 1,
    search: null,
  };
  dataCustomer = [];
  groupdata = [];
  filterData: any;
  dataExcel = [];

  constructor(
    private _masterServ: CertificateService,
    private _matDialog: MatDialog,
    private _kontrakategori: ContractcategoryService,
    private _statuspengujian: StatuspengujianService,
    private _msterCust: CustomerService,
    private _groupService : GroupService,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getDataContractCategory();
    this.getDataStatusPengujian();
    this.getDataCustomer();
    this.getGroup();
  }

  async getData(){
    await this._masterServ.getContract(this.dataFilter).then(async x => {
      this.certData = await this.certData.concat(Array.from(x['data']));
      this.certData = await globals.uniq(this.certData, (it) => it.id_kontrakuji);
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
        case 'contract_no': return this.compare(a.contract_no, b.contract_no, isAsc);
        case 'category_code': return this.compare(a.category_code, b.category_code, isAsc);
        case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'desc': return this.compare(a.desc, b.desc, isAsc);
        case 'team': return this.compare(a.team, b.team, isAsc);
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

  
  async getGroup(){
    await this._masterServ.getSelectTeam(this.datasent).then(x => {
      this.groupdata = this.groupdata.concat(x);
    })
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

  

  async getDataContractCategory(){
    await this._kontrakategori.getDataContractCategory(this.datasent).then(x => {
      this.contractcategory = this.contractcategory.concat(x['data']);
    })
  }

  async getDataStatusPengujian(){
    await this._statuspengujian.getDataStatusPengujian(this.datasent).then(x => {
      this.statusPengujian = this.statusPengujian.concat(x['data']);
    })
  }

  async searchData()
  {
    console.log(this.dataFilter)
    this.certData = await [];
    this.loadingfirst = await true;
    await this.getData();

  }

  async resetData()
  {
    this.dataFilter.contract = null
    this.dataFilter.hold = null
    this.dataFilter.customer = null
    this.dataFilter.status = null
    this.dataFilter.team = null
    this.dataFilter.pages = 1
    this.certData = await [];
    this.loadingfirst = await true;
    await this.getData();
  }

  goDetails(id)
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/analystpro/admin-certificate/${id}`])
    );    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  } 

  goToAutoDraft()
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/analystpro/auto-sending`])
    );
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

  reportDialog() {
    let dialogCust = this._matDialog.open(ReportkpiComponent, {
      height: "auto",
      width: "600px",
      panelClass: 'report-control-dialog',

  });

  dialogCust.afterClosed().subscribe(async (result) => {
      if(result.init == false)
      {
        await console.log(result);
        this.filterData = result.data;
        await this.downloadExcel();
      }      
    });
  }

  async downloadExcel() {
    this.load = await true;
    this.dataExcel = await [];
    await this._masterServ.reportKpi(this.filterData).then((x) => {
        let b = [];
        b = b.concat(x);
        console.log(b)
        b.forEach((s) => {
            this.dataExcel = this.dataExcel.concat({
              sample_no : s.transaction_sample.no_sample,
              sample_name : s.transaction_sample.sample_name,
              contract_no : s.transaction_sample.kontrakuji.contract_no,
              date_at : s.date_at,
              cl_number : s.cl_number,
              lhu_number : s.lhu_number,
              group_name : s.condition_check_last == null ? '-' :  s.condition_check_last.team.group_name,
              tgl_mulai : s.tgl_mulai,
              tgl_selesai : s.tgl_selesai,
              tgl_estimasi_lab : s.tgl_estimasi_lab,
              inserted_at : s.condition_check_last == null ? '-' : s.condition_check_last.inserted_at,
              status :  s.condition_check_last == null ? '-' : s.condition_check_last.status == 4 ? "Uji Ulang" : s.condition_check_last.status == 3 ? "Revisi" : "Normal"

            });
        });
        const fileName = 'report certificate' + Date.now() + '.xlsx';
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'data');

       XLSX.writeFile(wb, fileName);
    })
    console.log(this.dataExcel )
    this.load = await false;

  }


}
