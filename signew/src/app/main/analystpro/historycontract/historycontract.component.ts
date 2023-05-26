import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { url } from "app/main/url";
import { Router } from "@angular/router";

import { ContractcategoryService } from "app/main/analystpro/services/contractcategory/contractcategory.service";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";

export const MY_FORMATS = {
    parse: {
        dateInput: "LL",
    },
    display: {
        dateInput: "DD/MM/YYYY",
        monthYearLabel: "YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "YYYY",
    },
};
@Component({
    selector: "app-historycontract",
    templateUrl: "./historycontract.component.html",
    styleUrls: ["./historycontract.component.scss"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class HistorycontractComponent implements OnInit {
    gethistory = [];
    urlphoto = url;
    contractcategory = [];
    datasentuser = {
        pages: 1,
        search: null,
    };
    datauser = [
        {
            user_id: 0,
            employee_name: "All",
        },
    ];
    dataFilter = {
        category: null,
        search: null,
        tgl: null,
        pages: 1,
        user: 0,
    };
    loadMore = false;

    constructor(
        private _contractServ: ContractService,
        private _contractCategoryServ: ContractcategoryService,
        private _spinner: NgxSpinnerService,
        private _router: Router,
    ) {}

    ngOnInit(): void {
        this._spinner.show();
        this.getData();
        this.getDataContractCategory();
        this.getDataUserCreated();
        this._spinner.hide();
    }

    async getData() {
        // await this._spinner.show();
        this.loadMore = await true;
        await this._contractServ
            .getHistoryContract(this.dataFilter)
            .then((x) => {
                this.gethistory = this.gethistory.concat(x["data"]);
            });
        this.loadMore = await false;
        // await this._spinner.hide();
    }

    onScroll(e) {
        this.dataFilter.pages = this.dataFilter.pages + 1;
        this.getData();
    }

    getDataContractCategory() {
        this._contractCategoryServ
            .getDataContractCategory({ search: null, pages: 1 })
            .then(
                (x) =>
                    (this.contractcategory = this.contractcategory.concat(
                        x["data"]
                    ))
            );
    }

    getValue(ev) {
        this.reset();
        this.getData();
    }

    reset() {
        this.gethistory = [];
        this.dataFilter.pages = 1;
    }

    reseting(e){
      console.log(e);
    }

    getDataUserCreated() {
        this._contractServ
            .getDataCreated(this.datasentuser)
            .then((x) => (this.datauser = this.datauser.concat(x["data"])));
    }

    async tglEstimasiLabChange() {
        this.dataFilter.tgl = (await this.dataFilter.tgl)
            ? _moment(this.dataFilter.tgl).format("YYYY-MM-DD")
            : null;
        await console.log(this.dataFilter.tgl);
        await this.reset();
        await this.getData();
    }

    searching() {
        this.reset();
        this.getData();
    }

    seeDetails(v) {
      const url = this._router.serializeUrl(
          this._router.createUrlTree([`/analystpro/view-contract/${v}`])
      );

      let baseUrl = window.location.href.replace(this._router.url, '');
      window.open(baseUrl + url, '_blank');
  }
}
