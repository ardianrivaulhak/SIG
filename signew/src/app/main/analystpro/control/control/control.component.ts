import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ControlService } from "../control.service";
import { fuseAnimations } from "@fuse/animations";
import { MatSort, Sort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalKendaliComponent } from "app/main/analystpro/kendali/modal-kendali/modal-kendali.component";
import { ContractcategoryService } from "../../services/contractcategory/contractcategory.service";
import { StatuspengujianService } from "../../services/statuspengujian/statuspengujian.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import * as XLSX from "xlsx";
import { ReportDateModalsComponent } from "../control-modals/report-date-modals/report-date-modals.component";
import { BacktrackComponent } from "../control-modals/backtrack/backtrack.component";
import { CustomerService } from 'app/main/analystpro/master/customers/customer.service';
import * as globals from "app/main/global";
import { PageEvent } from "@angular/material/paginator";
@Component({
    selector: "app-control",
    templateUrl: "./control.component.html",
    styleUrls: ["./control.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class ControlComponent implements OnInit {
    loadingfirst = true;
    //mat table
    displayedColumns: string[] = [
        "checkbox",
        "statusrev",
        "contract_no",
        "customer_name",
        "progress",
        "cust_service",
        "kendali",
        "desc",
        "icon",
    ];

    total: number;
    from: number;
    to: number;
    pages = 1;
    current_page : number;

    statrev = [
        {
            title: "New",
            value : 0
        },
        {
            title : "Revisi",
            value : 1
        }
    ]

    dataFilter = {
        marketing: null,
        memo: null,
        category: null,
        user_kendali: null,
        pages: 1,
        customer : null,
        sample_name : null,
        sample_number : null,
        status_rev : null,
        user : null
    };

    datasent = {
        pages: 1,
        search: null,
        typeContract: null,
    };

    datasentCustomer = {
        pages: 1,
        search: null,
        typeContract: null,
    };

    datasentEmployee = {
        pages: 1,
        search: null,
    }

    kendaliData = [];
    contractcategory = [];
    statusPengujian = [];
    checkList = [];
    load = false;
    checkedata = [];
    access = [];
    searchFilter = false;

    tglExcel: number;
    dataExcel = [];
    pageIndex: number;

    cancelSearch = false;
    customersData = [];

    totalCust: number;
    fromCust: number;
    toCust: number;
    pagesCust = 1;

    employee = [];
    pageEvent: PageEvent;

    
    constructor(
        private _menuServ: MenuService,
        private _masterServ: ControlService,
        private _kontrakategori: ContractcategoryService,
        private _statuspengujian: StatuspengujianService,
        private _matDialog: MatDialog,
        private _route: Router,
        private _snackBar: MatSnackBar,
        private _customersServ : CustomerService
    ) {}

    ngOnInit(): void {
        this.getData();
        this.getDataContractCategory();
        this.checkauthentication();
        this.getDataCustomer();
        this.getEmployeeSample();
    }

    checkauthentication() {
        this._menuServ.checkauthentication(this._route.url).then((x) => {
            if (!x.status) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "You dont an access to this page !",
                }).then((res) => {
                    if (res.isConfirmed || res.isDismissed) {
                        this._route.navigateByUrl("apps");
                    }
                });
            } else {
                this.access = this.access.concat(x.access);
            }
        });
    }

    getData() {
        this._masterServ
            .getContractData(this.dataFilter)
            .then((x: any) => {
                this.kendaliData = this.kendaliData.concat(x.data);
                this.kendaliData = globals.uniq(
                    this.kendaliData,
                    (it) => it.id_kontrakuji
                );
                this.total = x["total"];
                this.current_page = x["current_page"] - 1;
                this.from = x["from"];
                this.to = x["per_page"];
            })
            .then((x) =>
                setTimeout(() => {
                    this.loadingfirst = false;
                }, 500)
            );
    }
    
    paginated(f) {
        console.log(f);
        this.kendaliData = [];
        this.dataFilter.pages = f.pageIndex + 1;
        this.getData();
    }

    sortData(sort: Sort) {
        const data = this.kendaliData.slice();
        if (!sort.active || sort.direction === "") {
            this.kendaliData = data;
            return;
        }
        this.kendaliData = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "category_code":
                    return this.compare(
                        a.category_code,
                        b.category_code,
                        isAsc
                    );
                case "contract_no":
                    return this.compare(a.contract_no, b.contract_no, isAsc);
                case "customer_name":
                    return this.compare(
                        a.customer_name,
                        b.customer_name,
                        isAsc
                    );
                case "status_pengujian":
                    return this.compare(
                        a.status_pengujian,
                        b.status_pengujian,
                        isAsc
                    );
                case "desc":
                    return this.compare(a.desc, b.desc, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    async getDataContractCategory() {
        await this._kontrakategori
            .getDataContractCategory(this.datasent)
            .then((x) => {
                this.contractcategory = this.contractcategory.concat(x["data"]);
            });
    }

    async searchButton() {
        this.kendaliData = await [];
        this.loadingfirst = await true;
        await this.getData();
    }

    async cancelSearchMark() {
        this.dataFilter.marketing = await null;
        this.dataFilter.memo = await null;
        this.dataFilter.category = await null;
        this.dataFilter.user_kendali = await null;
        this.dataFilter.pages = await 1;
        this.dataFilter.customer = await null;
        this.dataFilter.sample_name = await null;
        this.dataFilter.sample_number = await null;
        this.dataFilter.status_rev = await null;
        this.dataFilter.user = await null;
        this.kendaliData = await [];
        this.loadingfirst = await true;
        await this.getData();
    }
      

    reset(e) {
        if (e === "marketing") {
            this.dataFilter.marketing = null;
            this.kendaliData = [];
            this.getData();
        } else if (e === "memo") {
            this.dataFilter.memo = null;
            this.kendaliData = [];
            this.getData();
        } else if (e === "customer") {
            this.dataFilter.customer = null;
            this.kendaliData = [];
            this.getData();
        } else if (e === "category") {
            this.dataFilter.category = null;
            this.kendaliData = [];
            this.getData();
        } else if (e === "user_kendali") {
            this.dataFilter.user_kendali = null;
            this.kendaliData = [];
            this.getData();
        } else if ( e === "status_rev") {
            this.dataFilter.status_rev = null;
            this.kendaliData = [];
            this.getData();
        }
    }

   

    async setAll(ev, id) {
        let z = this.checkList.filter((x) => x.id == id);
        if (ev) {
            if (z.length > 0) {
                z[0].checked = ev;
            } else {
                this.checkList = this.checkList.concat({
                    id: id,
                    checked: true,
                });
            }
        } else {
            let z = this.checkList.filter((x) => x.id == id);
            z[0].checked = ev;
        }
        console.log(this.checkList);
    }

    approveContract() {
        let u = [];
        this.checkList.forEach((x) => {
            if (x.checked) {
                u = u.concat({
                    id: x.id,
                });
            }
        });
        this._masterServ.approveDataContract(u).then((z) => {
            this.load = true;
            let message = {
                text: "Contract Succesfully Approve",
                action: "Done",
            };
            setTimeout(() => {
                this.openSnackBar(message);
                this.checkList = [];
                this.kendaliData = [];
                this.getData();
                this._route.navigateByUrl("analystpro/control");
                this.load = false;
            }, 2000);
        });
    }

    cancelApprove() {
        this.checkList.forEach((x) => {
            x.checked = false;
        });
        this.checkList = [];
        this.kendaliData = [];
        this.getData();
        console.log(this.checkList);
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }

    gotoModulExcel() {
        let dialogCust = this._matDialog.open(ReportDateModalsComponent, {
            height: "auto",
            width: "600px",
            panelClass: 'report-control-dialog',

        });

        dialogCust.afterClosed().subscribe(async (result) => {
            await console.log(result);
            this.tglExcel = await result.c;
            await this.downloadExcel();
        });
    }

    async downloadExcel() {
        this.dataExcel = [];
        await this._masterServ.getDataExportExcel(this.tglExcel).then((x) => {
            let b = [];
            b = b.concat(x);
            console.log(b[0].akg_trans.length);
            b.forEach((s) => {
                this.dataExcel = this.dataExcel.concat({
                    customer_name: s.customers_handle.customers.customer_name,
                    contract_no: s.contract_no,
                    cs: s.condition_contract.user.employee_name,
                    kendali:
                        s.condition_contract_control.length < 1
                            ? ""
                            : s.condition_contract_control[0].user
                                  .employee_name,
                    price: s.payment_condition.biaya_pengujian - s.payment_condition.discount_lepas,                    
                    akg:
                        s.akg_trans.length < 1
                            ? 0
                            : s.akg_trans
                                  .map((u) => u.total)
                                  .reduce((a, b) => a + b),
                    sampling:
                        s.sampling_trans.length < 1
                            ? 0
                            : s.sampling_trans
                                  .map((u) => u.total)
                                  .reduce((a, b) => a + b),
                });
            });
            console.log(this.dataExcel);
            const fileName = "report" + this.tglExcel + ".xlsx";
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataExcel);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "data");

            XLSX.writeFile(wb, fileName);
        });
    }

    backTrack() : void {
        let dialogCust = this._matDialog.open(BacktrackComponent, {
            height: "auto",
            width: "500px",
            panelClass: 'backtrack-control-dialog',
            disableClose: true,
            data: { teks : 1  } 
        });
        dialogCust.afterClosed().subscribe((result) => {
           if(result.ev == false){
            this.kendaliData=[];
            this.getData();
           }
          
        });
    }

    async getDataCustomer() {
        await this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
            this.customersData = this.customersData.concat(Array.from(x['data']));
            this.customersData = globals.uniq(this.customersData, (it) => it.id_customer);
            console.log(this.customersData);
            this.totalCust = x['total'];
            this.fromCust = x['from'] - 1;
            this.toCust = x['to'];
        });
        await console.log(this.customersData);
    } 
        

    onScrollToEnd(e) {
        if (e === "customer") {
            this.datasentCustomer.pages = this.datasentCustomer.pages + 1; 
            this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
            this.customersData = this.customersData.concat(x['data']);
            });
        }   
        
        if (e === "employee") {
            this.datasentEmployee.pages = this.datasentEmployee.pages + 1; 
            this._customersServ.getDataCustomers(this.datasentEmployee).then(x => {
            this.employee = this.employee.concat(x['data']);
            });
        }   
    }

    onsearchselect(ev, val) {
        if (val === "customer") {
            this.customersData = [];
            this.datasentCustomer.search = ev.term;
            this.datasentCustomer.pages = 1;
            this.getDataCustomer();
        }

        if (val === "employee") {
            this.employee = [];
            this.datasentEmployee.search = ev.term;
            this.datasentEmployee.pages = 1;
            this.getEmployeeSample();
        }
    }

    goDetail(id) {
        const url = this._route.serializeUrl(
            this._route.createUrlTree([`/analystpro/control/${id}`])
        );
        
        let baseUrl = window.location.href.replace(this._route.url, '');
        window.open(baseUrl + url, '_blank');
    }

    refreshPage()
    {
        this.loadingfirst = true;
        this.kendaliData = [];
        this.getData();

    }

    async getEmployeeSample(){
        await this._masterServ.getSelectEmployee(this.datasentEmployee).then(x => {
          this.employee = this.employee.concat(x);
          console.log(this.employee)
        })
      }

  
}
