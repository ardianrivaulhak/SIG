import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { CustomertaxaddressService } from "../customertaxaddress.service";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import * as global from "app/main/global";
@Component({
    selector: "app-customertaxaddress",
    templateUrl: "./customertaxaddress.component.html",
    styleUrls: ["./customertaxaddress.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class CustomertaxaddressComponent implements OnInit {
    dataaddress = [];
    displayedColumns: string[] = [
        "customer_code",
        "customer_name",
        "address",
        "action",
    ];
    total: number;
    from: number;
    to: number;
    pages = 1;
    datasent = {
        pages: 1,
        search: null,
    };
    access = [];
    pageSize;
    constructor(
        private _router: Router,
        private _menuServ: MenuService,
        private _customerTaxServ: CustomertaxaddressService
    ) {}

    ngOnInit(): void {
        this.getData();
        this.checkauthentication();
    }

    checkauthentication() {
        this._menuServ.checkauthentication(this._router.url).then((x) => {
            if (!x.status) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "You dont an access to this page !",
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

    getData() {
        this._customerTaxServ
            .getData(this.datasent)
            .then((x) => {
                this.dataaddress = this.dataaddress.concat(
                    Array.from(x["data"])
                );
                this.total = x["total"];
                this.pages = x["current_page"];
                this.from = x["from"];
                this.to = x["to"];
                this.pageSize = x["per_page"];
            })
            .then(() => {
                this.dataaddress = global.uniq(
                    this.dataaddress,
                    (it) => it.id_taxaddress
                );
            });
    }

    paginated(f) {
        this.dataaddress = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getData();
    }

    onSearchChange(ev) {
        this.dataaddress = [];
        this.datasent.search = ev;
        this.getData();
    }

    sortData(sort: Sort) {
        const data = this.dataaddress.slice();
        if (!sort.active || sort.direction === "") {
            this.dataaddress = data;
            return;
        }
        this.dataaddress = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "customer_code":
                    return this.compare(
                        a.customers.kode_customer,
                        b.customers.kode_customer,
                        isAsc
                    );
                case "customer_name":
                    return this.compare(
                        a.customers.customer_name,
                        b.customers.customer_name,
                        isAsc
                    );
                case "address":
                    return this.compare(a.address, b.address, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    deleteDataAddress(v) {
        console.log(v);
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
                    this._customerTaxServ
                        .deleteData(v)
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
        this.dataaddress = await [];
        await this.getData();
    }
}
