import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { Observable, of, Subject, from } from "rxjs";
import { DashboardService } from "../services/dashboard/dashboard.service";
import { ContractcategoryService } from "app/main/analystpro/master/contractcategory/contractcategory.service";
import { LoginService } from "app/main/login/login.service";
import { LabService } from "app/main/analystpro/master/lab/lab.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as XLSX from "xlsx";
import * as global from "app/main/global";
@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
    bulan = [
        {
            id: "01",
            bulan: "Januari",
        },
        {
            id: "02",
            bulan: "Februari",
        },
        {
            id: "03",
            bulan: "Maret",
        },
        {
            id: "04",
            bulan: "April",
        },
        {
            id: "05",
            bulan: "Mei",
        },
        {
            id: "06",
            bulan: "Juni",
        },
        {
            id: "07",
            bulan: "July",
        },
        {
            id: "08",
            bulan: "Agustus",
        },
        {
            id: "09",
            bulan: "September",
        },
        {
            id: "10",
            bulan: "Oktober",
        },
        {
            id: "11",
            bulan: "November",
        },
        {
            id: "12",
            bulan: "Desember",
        },
    ];
    dashboard;
    idlab;

    data = [];
    colorScheme = {
        domain: [
            "#5AA454",
            "#E44D25",
            "#CFC0BB",
            "#7aa3e5",
            "#a8385d",
            "#aae3f5",
        ],
    };
    view: any[] = [1000, 400];
    viewcustomerdata: any[] = [700, 300];
    viewsalestype: any[] = [600, 300];
    viewlab: any[] = [1000, 400];
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showLabels = true;
    showXAxisLabelContract = false;
    xAxisLabelContract = "Contracts";
    showYAxisLabelContract = true;

    xAxisLabelSaletype = "Contracts";
    showYAxisLabelSaletype = true;
    showXAxisLabelSaletype = true;

    xAxisLabelCustomer = "Customers";
    showYAxisLabelCustomer = true;
    yAxisLabel = "Total";
    datasummary = [];
    datafix = [];
    datachart = [];
    datacustomer = [];
    saletype = [];
    isDoughnut = false;
    mine = [];
    monthSelect = global.addzero(new Date().getMonth() + 1).toString();
    yearSelect = new Date().getFullYear();
    // lab
    datasent = {
        all: "all",
        pages: 1,
    };
    datacombinelab = [];
    datalab = [];
    datasample = [];
    dataparameter = [];
    samplepercategory = false;
    totalsample = [];
    totalsamplepercategory = [];
    summarytransactionperstatuspengujian = [];
    totalparameterinlab = 0;
    totalparamperstatuspengujian = [];
    totalparametertype = [];
    notshowing = true;
    loadingbutton = false;

    // end lab
    constructor(
        private _dashboardServ: DashboardService,
        private _contractServ: ContractcategoryService,
        private _loginServ: LoginService,
        private _labServ: LabService,
        private _actRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._actRoute.data.subscribe((v) => {
            this.dashboard = v.for;
            this.idlab = v.idlab ? v.idlab : null;
        });

        this.getMe();

        // switch (this.dashboard){
        //   case 'marketing' :
        //     if(this.notshowing){
        //       this.getDataContractCategory();
        //       this.getDataCustomerAmount();
        //       this.getDataSaleType();
        //     } else {
        //       return;
        //     }
        //   break;
        //   case 'lab':
        //     this.getDatalab();
        //     this.getDataTotalSample();
        //     this.getDataTotalParameter();
        //     this.getDataTotalSamplePerCategory();
        //     this.getDataTotalParameterperStatusPengujian();
        //     this.getDataTotalParametertype();
        //   break;
        // }
    }

    getMe() {
        this._loginServ.checking_me().then((x) => {
            if (x[0].id_bagian == 6) {
                if (x[0].id_level > 13) {
                    this.notshowing = true;
                } else {
                    this.notshowing = false;
                    this.getDataContractCategory();
                    this.getDataCustomerAmount();
                    this.getDataSaleType();
                }
            } else if (x[0].id_bagian == 11) {
                if (x[0].id_level > 13) {
                    this.notshowing = true;
                } else {
                    this.notshowing = false;
                    this.getDataContractCategory();
                    this.getDataCustomerAmount();
                    this.getDataSaleType();
                }
            } else {
                this.notshowing = true;
            }
            this.mine = this.mine.concat(x[0]);
        });
    }

    getDatalab() {
        this._labServ
            .getDataDetailLab(this.idlab)
            .then((x) => (this.datalab = this.datalab.concat(x)));
    }

    getDataContractSummary() {
        this._dashboardServ
            .getDataContractSummary({
                month: this.monthSelect,
                year: this.yearSelect,
            })
            .then(async (x) => {
                this.datasummary = await this.datasummary.concat(x);
                this.datafix = this.data
                    .map((t1) => ({
                        ...t1,
                        ...this.datasummary.find((t2) => t2.title === t1.title),
                    }))
                    .map((tx) => ({
                        title: tx.title,
                        realtotal: tx.summary ? parseInt(tx.summary) : 0,
                        total_contract_type: tx.total_contract
                            ? parseInt(tx.total_contract)
                            : 0,
                    }));
            })
            .then(() => {
                this.datafix.forEach((g) => {
                    this.datachart = this.datachart.concat({
                        name: g.title,
                        value: g.realtotal,
                    });
                });
            })
            .then(() => (this.datachart = global.uniq(this.datachart, it => it.name)))
            .then(() => (this.loadingbutton = false));
    }

    async setTimeDashboard() {
        this.loadingbutton = await true;
        this.datachart = await [];
        this.datasummary = await [];
        this.datafix = await [];
        this.saletype = await [];
        this.datacustomer = await [];
        await this.getDataCustomerAmount();
        await this.getDataSaleType();
        await this.getDataContractSummary();
    }

    getDataTotalSample() {
        this._dashboardServ.getDataTotalSample(this.idlab).then((value) => {
            this.totalsample = this.totalsample.concat(value);
        });
    }

    getDataTotalParameterperStatusPengujian() {
        this._dashboardServ
            .getSummarybyStatuspengujian(this.idlab)
            .then((value) => {
                this.totalparamperstatuspengujian =
                    this.totalparamperstatuspengujian.concat(value);
            });
    }
    getDataTotalSamplePerCategory() {
        this._dashboardServ
            .getDataTotalSamplePerCategory(this.idlab)
            .then((value) => {
                this.totalsamplepercategory =
                    this.totalsamplepercategory.concat(value);
            });
    }

    getDataSumaryByStatuspengujian() {
        this._dashboardServ
            .getSummarybyStatuspengujian(this.idlab)
            .then((value) => {
                this.summarytransactionperstatuspengujian =
                    this.summarytransactionperstatuspengujian.concat(value);
            });
    }

    getDataTotalParametertype() {
        this._dashboardServ
            .getDataTotalParamatertype(this.idlab)
            .then((value) => {
                this.totalparametertype = this.totalparametertype.concat(value);
            });
    }

    getDataTotalParameter() {
        this._dashboardServ
            .getDataTotalParameter(this.idlab)
            .then((value) => {
                let arr = [];
                arr = arr.concat(value);
                arr.forEach((x) => {
                    this.dataparameter = this.dataparameter.concat({
                        name: x.name_id,
                        value: x.total,
                    });
                });
            })
            .then(() => {
                let u = this.dataparameter
                    .map((x) => x.value)
                    .reduce((a, b) => a + b);
                this.totalparameterinlab = u;
            });
    }

    async downloadashboard() {
        const fileName = await `Dashboard_Sales.xlsx`;
        const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(
            this.datachart
        );
        const wb: XLSX.WorkBook = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, `Data`);
        await XLSX.writeFile(wb, fileName);
    }

    async downloadashboarddetails() {
        const fileName = await `Dashboard_Sales_Category.xlsx`;
        const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(this.datafix);
        const wb: XLSX.WorkBook = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, `Data`);
        await XLSX.writeFile(wb, fileName);
    }

    onSelect(data): void {
        console.log("Item clicked", JSON.parse(JSON.stringify(data)));
    }

    // onActivate(data): void {
    //   console.log('Activate', JSON.parse(JSON.stringify(data)));
    // }

    // onDeactivate(data): void {
    //   console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    // }

    getDataContractCategory() {
        this._contractServ
            .getDataContractCategory({ pages: 1, search: null })
            .then((x) => (this.data = this.data.concat(x["data"])))
            .then(() => this.getDataContractSummary());
    }

    getDataCustomerAmount() {
        this._dashboardServ
            .getDataCustomerAmount({
                month: this.monthSelect,
                year: this.yearSelect,
            })
            .then((x) => {
                let z = [];
                z = z.concat(x);
                for (let i = 0; i < 5; i++) {
                    this.datacustomer = this.datacustomer.concat({
                        name: z[i].customer_name,
                        value: z[i].jumlah,
                    });
                }
            });
    }

    getDataSaleType() {
        this._dashboardServ
            .getDataSaleType({ month: this.monthSelect, year: this.yearSelect })
            .then((x) => {
                let z = [];
                z = z.concat(x);
                z.forEach((y) => {
                    this.saletype = this.saletype.concat(
                        {
                            name: "Bogor",
                            value: parseInt(y.Bogor),
                        },
                        {
                            name: "Jakarta",
                            value: parseInt(y.Jakarta),
                        },
                        {
                            name: "Package",
                            value: parseInt(y.Package),
                        },
                        {
                            name: "Surabaya",
                            value: parseInt(y.Surabaya),
                        },
                        {
                            name: "Semarang",
                            value: parseInt(y.Semarang),
                        },
                        {
                            name: "Yogyakarta",
                            value: parseInt(y.Yogyakarta),
                        }
                    );
                });
            });
    }

    getDataCustomerBehaviour() {
        this._dashboardServ.getDataCustomerBehaviour().then((x) => {
            let z = [];
            z = z.concat(x);
            z.forEach((f) => {
                this.datacustomer = this.datacustomer.concat({
                    name: f.customer_name,
                    series: [
                        {
                            name: "Food & Beverage",
                            value: f.R,
                        },
                        {
                            name: "Pharmaceuticals",
                            value: f.F,
                        },
                        {
                            name: "Government",
                            value: f.P,
                        },
                        {
                            name: "Traditional Medicine & Suplement",
                            value: f.OTS,
                        },
                        {
                            name: "Beauty Products",
                            value: f.K,
                        },
                        {
                            name: "Media RTU",
                            value: f.LM,
                        },
                        {
                            name: "K3L Products",
                            value: f.KL,
                        },
                        {
                            name: "ALKES & PKRT",
                            value: f.AP,
                        },
                        {
                            name: "Feed, Pesticides & PSAT",
                            value: f.E,
                        },
                        {
                            name: "Others",
                            value: f.L,
                        },
                    ],
                });
            });
        });
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }
}
