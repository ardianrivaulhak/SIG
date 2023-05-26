import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { MatSort, Sort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as XLSX from "xlsx";
import { ComplainService } from "../complain.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerService } from "../../master/customers/customer.service";
import { PageEvent } from "@angular/material/paginator";
import { ModalsComponent } from "./modals/modals.component";
import { GroupService } from "app/main/analystpro/master/group/group.service";
import { CertificateService } from "app/main/analystpro/certificate/certificate.service";

@Component({
  selector: 'app-complaincert',
  templateUrl: './complaincert.component.html',
  styleUrls: ['./complaincert.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class ComplaincertComponent implements OnInit {

    loadingfirst = true;
    displayedColumns: string[] = [
        "no_complain",
        "lhu",
        "sample_name",
        "date",
        "marketing",
        "customer",
        "status",
        "team",
        "action",
    ];

    complainData = [];
    total: number;
    from: number;
    to: number;
    pages = 1;
    current_page : number;

    data = {
        id: "",
    };
    searchFilter = false;
    datasent = {
        pages: 1,
        marketing: null,
        principle: null,
        category: null,
        status: null,
    };

    datasentCategory = {
        pages: 1,
        search: null,
        typeContract: null,
    };

    dataFilter = {
        pages: 1,
        lhu: "",
        sample_name: '',
        id_customer: '',
        sample_number: "",
        status: "",
        team: '',
        type: "",
        marketing: "",
    };

    contractcategory = [];
    statusPengujian = [];

    cobaData = null;
    cancelSearch = false;
    resultForm: FormGroup;

    formData = {
        marketing : '',
        id_customer : null,
        lhu : '',
        type: '',
        status : ''
    }

    status = [
        {
            title: "New",
            id: 0,
        },
        {
            title: "Sent",
            id: 1,
        }
    ];

    datasentCustomer = {
        pages: 1,
        search: null,
    };
    customersData = [];

    typeStat = [
        {
            title: "sigconnect",
            id: 1,
        },
        {
            title: "email",
            id: 2,
        },
        {
            title: "add",
            id: 3,
        },
    ];

    groupdata = []

    dataCustomer = [];
    pageEvent: PageEvent;
    totalCust: number;
    fromCust: number;
    toCust: number;
    pagesCust = 1;
    current_pageCust : number;

  constructor(
    private _masterServ: ComplainService,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _router: Router,
    private _msterCust: CustomerService,
    private _certService: CertificateService,
  ) { } 

  ngOnInit(): void {
    this.getData();
    this.getDataCustomer();
    this.getGroup();
  }

  async getGroup(){
    await this._certService.getSelectTeam(this.datasent).then(x => {
      this.groupdata = this.groupdata.concat(x);
      console.log(this.groupdata)
    })
  }

  async getData() {
    await this._masterServ
        .getDataCertificate(this.dataFilter)
        .then((x) => {
            this.complainData = this.complainData.concat(
                Array.from(x["data"])
            );
            this.complainData = this.uniq(this.complainData, (it) => it.id);
            this.total = x["total"];
            this.from = x["from"] - 1;
            this.to = x["to"];
        })
    this.loadingfirst = await false;
    console.log(this.complainData)
}

paginated(f) {
    console.log(f);
    this.complainData = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getData();
}

uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
}



gotoDetailContract(v) {
    const url = this._router.serializeUrl(
        this._router.createUrlTree([`/analystpro/view-contract/${v}`])
    );
    let baseUrl = window.location.href.replace(this._router.url, "");
    window.open(baseUrl + url, "_blank");
}


async searchButton(){
    console.log(this.dataFilter)
    this.complainData = await [];
    await this.getData();
}

async cancelSearchMark()
{
    this.dataFilter.pages =  1,
    this.dataFilter.lhu = "",
    this.dataFilter.sample_name =  '',
    this.dataFilter.id_customer =  '',
    this.dataFilter.sample_number =  "",
    this.dataFilter.status =  "",
    this.dataFilter.team =  '',
    this.dataFilter.type = "",
    this.dataFilter.marketing = "",
    this.loadingfirst = await true;
    await this.getData();
}

getDataCustomer() {
    console.log(this.datasentCustomer);
    this._msterCust
        .getDataCustomers(this.datasentCustomer)
        .then((x) => {
            this.dataCustomer = this.dataCustomer.concat(
                Array.from(x["data"])
            );
            this.dataCustomer = this.uniq(
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

    parametersModals(data)
    {
      console.log(data)
      const dialogRef = this._matDialog.open(ModalsComponent, {
        panelClass: 'certificate-complain',
        width: '100%',
        data: data,
        disableClose : true
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result)
        if(result.v == false){
            this.complainData=[];
            this.loadingfirst =  true;
            this.getData();

        }
      });
    }

    goCertificate(id, ev) {
        const url = this._router.serializeUrl(
            ev == 'ID' ? this._router.createUrlTree([`/certificate/pdf-certificate/` + id  + `/id`]) : this._router.createUrlTree([`/certificate/pdf-certificate/` + id  + `/en`])
        );      
        let baseUrl = window.location.href.replace(this._router.url, '');
        window.open(baseUrl + url, '_blank');
      }

      gotoLhu(id)
      {
        const url = this._router.serializeUrl(
           this._router.createUrlTree([`/analystpro/certificate/` + id  + `/lhu`])
        );      
        let baseUrl = window.location.href.replace(this._router.url, '');
        window.open(baseUrl + url, '_blank');
      }


}
