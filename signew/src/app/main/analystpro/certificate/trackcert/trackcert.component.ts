import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CertificateService } from '../certificate.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ContractcategoryService } from '../../services/contractcategory/contractcategory.service';
import { StatuspengujianService } from '../../services/statuspengujian/statuspengujian.service';
import { ModalResultComponent } from "../manager/certificate/modals/modal-result/modal-result.component";
import { SelectTeamComponent } from "../manager/certificate/modals/select-team/select-team.component";
import { SelectOtherTeamComponent } from "./select-other-team/select-other-team.component";
import { ListLhuComponent } from "./list-lhu/list-lhu.component";
import { LoginService } from 'app/main/login/login.service';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import { CustomerService } from "../../master/customers/customer.service";
@Component({
  selector: 'app-trackcert',
  templateUrl: './trackcert.component.html',
  styleUrls: ['./trackcert.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class TrackcertComponent implements OnInit {

  loadingfirst = true;
  displayedColumns: string[] = [ 'contract_no', 'category_code', 'customer_name' ,'progress', 'desc','team', 'action'];
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
    marketing : '',
    lhu : '',
    lhu_date : '',
    customer_name : '',
    team : '',
    hold : '', 
    pages : 1,
    type:"paginate"
  }

  DataStatus = [
    {
        "id": 1,
        "name": "Create"
  
    },
    {
      "id": 2,
      "name": "RoA"

    },
    {
      "id": 3,
      "name": "Draft"

    }
  ];

  dataHold = [
    {
      "id" : 'Y',
      "hold": "hold"
    },
    {
      "id" : 'N',
      "hold": "unhold"
    }
  ];
  contractcategory = [];
  statusPengujian = [];
  allComplete: boolean = false;
  parameterData = [];
  cobaData = null;
  access = []; 
  notshowing = true;
  mine = [];
  datasentCustomer = {
    pages: 1,
    search: null,
  };
  dataCustomer = [];
  groupdata = [];

  total_cust: number;
  from_cust: number;
  to_cust: number;
  pages_cust = 1;

  constructor(
    private _masterServ: CertificateService,
    private _matDialog: MatDialog,
    private _kontrakategori: ContractcategoryService,
    private _statuspengujian: StatuspengujianService,
    private _loginServ: LoginService,
    private _router: Router,
    private _msterCust: CustomerService,
  ) { }

  ngOnInit(): void {
    this.getMe();
    this.getData();
    this.getDataCustomer();
    this.getGroup();
  }
  
  async getGroup(){
    await this._masterServ.getSelectTeam(this.datasent).then(x => {
      this.groupdata = this.groupdata.concat(x);
      console.log(this.groupdata)
    })
  }

  async getData(){
    await this._masterServ.getContractTrack(this.dataFilter).then(async x => {
      this.certData = this.certData.concat(Array.from(x['data']));
      this.certData = this.uniq(this.certData, (it) => it.id_kontrakuji);
      this.total = await x['total'];
      this.from = await x['from'] - 1;
      this.to = await x['to']
    })
    .then(x => console.log(this.total));
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
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

  selectTeam(id, id_contract) : void 
  {
    let dialogCust = this._matDialog.open(SelectOtherTeamComponent, {
      panelClass: 'selectother-team-dialog',
      width : '500px',
      data: { id : id,
              id_contract : id_contract 
            },
      disableClose: true
    });

    dialogCust.afterClosed().subscribe((result) => {
      if(result.ev == false){
        this.loadingfirst = true;
        this.certData=[];
        this.checkList = [];
        this.getData();
      }
    });
  }
  
 listLhuinContract(id_contract): void 
 {
    let dialogCust = this._matDialog.open(ListLhuComponent, {
      panelClass: 'list-lhu-dialog',
      width : '500px',
      data: { id_contract : id_contract },
      disableClose: true
    });

    dialogCust.afterClosed().subscribe((result) => {
      if(result.ev == false){
        this.loadingfirst = true;
        this.certData=[];
        this.checkList = [];
        this.getData();
      }
    });
 }

  getMe(){
    this._loginServ.checking_me().then(x => {
      console.log(x[0])
      if(x[0].id_bagian == 1 && x[0].id_level < 19){
        this.notshowing = false;
      }else{
        if(x[0].user_id == 1){          
          this.notshowing = false;
        }else{
          this.notshowing = true;
        }
      }

      this.mine = this.mine.concat(x[0]);
      console.log(this.notshowing)
    });
  }

  async getDataCustomer() {
    console.log(this.datasentCustomer);
    await this._msterCust
        .getDataCustomers(this.datasentCustomer)
        .then((x) => {
            this.dataCustomer = this.dataCustomer.concat(
                Array.from(x["data"])
            );
            this.dataCustomer = this.uniq(
                this.dataCustomer,
                (it) => it.id_customer
            );
            this.total_cust = x["total"];
            this.from_cust = x["from"] - 1;
            this.to_cust = x["to"];
        });
        await console.log(this.dataCustomer);
  }

  async search()
  {
    this.certData = await [];
    await this.getData();
  }

  async cancelSearch()
  {
    this.dataFilter.marketing = await '';
    this.dataFilter.lhu = await '';
    this.dataFilter.lhu_date = await '';
    this.dataFilter.customer_name = await '';
    this.dataFilter.team = await '';
    this.dataFilter.hold = await '';
    this.certData = await [];
    await this.getData();


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
