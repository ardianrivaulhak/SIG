import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ParametertypeService } from "../parametertype.service";
import { fuseAnimations } from "@fuse/animations";
import { MatSort, Sort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import * as global from "app/main/global";
import * as XLSX from "xlsx";

@Component({
    selector: "app-parametertype",
    templateUrl: "./parametertype.component.html",
    styleUrls: ["./parametertype.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class ParametertypeComponent implements OnInit {
    parametertypeData = [];
    displayedColumns: string[] = ["name", "description", "action"];
    total: number;
    from: number;
    to: number;
    pages = 1;
    datasent = {
        pages: 1,
        search: null,
    };
    access = [];

    loading = false;
    constructor(
        private _router: Router,
        private _menuServ: MenuService,
        private _parametertypeServ: ParametertypeService
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
        this._parametertypeServ
            .getDataParameterType(this.datasent)
            .then((x) => {
                this.parametertypeData = this.parametertypeData.concat(
                    Array.from(x["data"])
                );
                if (!this.total) {
                    this.total = x["total"];
                    this.from = x["from"] - 1;
                    this.to = x["to"];
                }
            });
    }

    paginated(f) {
        this.parametertypeData = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getData();
    }

    onSearchChange(ev) {
        this.parametertypeData = [];
        this.datasent.search = ev;
        this.getData();
    }

    sortData(sort: Sort) {
        const data = this.parametertypeData.slice();
        if (!sort.active || sort.direction === "") {
            this.parametertypeData = data;
            return;
        }
        this.parametertypeData = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "name":
                    return this.compare(a.name, b.name, isAsc);
                case "description":
                    return this.compare(a.description, b.description, isAsc);
                case "active":
                    return this.compare(a.active, b.active, isAsc);
                default:
                    return 0;
            }
        });
    }

    async exportExcel() {
        this.loading = await true;
        await this._parametertypeServ
            .getDataParameterType({ pages: 1, search: null, all: "all" })
            .then(async (x: any) => {
                const filename = await `Master_Parametertype.xlsx`;
                const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(x);
                const wb: XLSX.WorkBook = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, `Data`);
                await XLSX.writeFile(wb, filename);
            });
        this.loading = await false;
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
                    this._parametertypeServ
                        .deleteDataParameterType(v)
                        .then(async (x: any) => {
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
        this.parametertypeData = await [];
        await this.getData();
    }
}
