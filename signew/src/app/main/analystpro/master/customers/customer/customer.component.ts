import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CustomerService } from "../customer.service";
import { fuseAnimations } from "@fuse/animations";
import { Sort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import * as global from "app/main/global";
import * as XLSX from "xlsx";
import { ModalInfoComponent } from "../modal-info/modal-info.component";
@Component({
    selector: "app-customer",
    templateUrl: "./customer.component.html",
    styleUrls: ["./customer.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CustomerComponent implements OnInit {
    customersData = [];
    displayedColumns: string[] = [
        "kode_customer",
        "customer_name",
        "termin",
        "city",
        "identity",
        "action",
    ];
    total: number;
    from: number;
    to: number;
    pages = 1;
    pageSize;
    datasent = {
        pages: 1,
        search: null,
    };
    loading = false;
    access = [];

    constructor(
        private _customersServ: CustomerService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _menuServ: MenuService
    ) {}

    ngOnInit(): void {
        this.getData();
        this.checkauthentication();
    }

    async exportExcel() {
        this.loading = await true;
        await this._customersServ.getDataAllCustomer().then(async (x: any) => {
            let a: any = await [];
            await x.forEach((b, c) => {
                console.log(b);
                a = a.concat({
                    no: c + 1,
                    kode_customer: b.kode_customer,
                    customer_name: b.customer_name,
                    termin: b.termin ? b.termin : "-",
                    city: b.city ? b.city.city_name : "-",
                    npwp: b.customer_npwp.length > 0 ? "Avaliable" : "Not Set",
                });
            });
            const filename = await `Master_Customer.xlsx`;
            const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(a);
            const wb: XLSX.WorkBook = await XLSX.utils.book_new();
            await XLSX.utils.book_append_sheet(wb, ws, `Data`);
            await XLSX.writeFile(wb, filename);
        });
        this.loading = await false;
    }

    checkauthentication() {
        this._menuServ.checkauthentication(this._router.url).then((x) => {
            if (!x.status) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "You dont have an access to this page !",
                }).then((res) => {
                    if (res.isConfirmed || res.isDismissed) {
                        this._router.navigateByUrl("apps");
                    }
                });
            } else {
                this.access = this.access.concat(x.access);
            }
        });
    }

    getInfo(id) {
        let dialogCust = this._matDialog.open(ModalInfoComponent, {
            height: "auto",
            width: "500px",
            data: {
                data: id,
            },
        });
        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    getData() {
        this._customersServ
            .getDataCustomers(this.datasent)
            .then((x) => {
                this.customersData = this.customersData.concat(
                    Array.from(x["data"])
                );
                this.total = x["total"];
                this.pages = x["current_page"];
                this.from = x["from"];
                this.to = x["to"];
                this.pageSize = x["per_page"];
            })
            .then(
                () =>
                    (this.customersData = global.uniq(
                        this.customersData,
                        (it) => it.id_customer
                    ))
            );
    }

    paginated(f) {
        this.customersData = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getData();
    }

    onSearchChange(ev) {
        this.customersData = [];
        this.datasent.search = ev;
        this.getData();
    }

    sortData(sort: Sort) {
        const data = this.customersData.slice();
        if (!sort.active || sort.direction === "") {
            this.customersData = data;
            return;
        }
        this.customersData = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "kode_customer":
                    return this.compare(
                        a.kode_customer,
                        b.kode_customer,
                        isAsc
                    );
                case "customer_name":
                    return this.compare(
                        a.customer_name,
                        b.customer_name,
                        isAsc
                    );
                case "npwp":
                    return this.compare(a.npwp, b.npwp, isAsc);
                case "description":
                    return this.compare(a.description, b.description, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    deleteData(v) {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this Data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        })
            .then((result) => {
                if (result.value) {
                    this._customersServ
                        .deleteDataCustomers(v)
                        .then((x: any) => {
                            if (x.success) {
                                global.swalsuccess("success", x.message);
                            } else {
                                global.swalerror(x.message);
                            }
                        })
                        .then((f) => this.setDelete(f));
                }
            })
            .catch((e) => global.swalerror("Error at Database"));
    }

    async setDelete(v) {
        this.datasent.pages = await 1;
        this.datasent.search = await null;
        this.customersData = await [];
        await this.getData();
    }
}
