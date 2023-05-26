import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UnitService } from "../unit.service";
import { fuseAnimations } from "@fuse/animations";
import { MatSort, Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import * as global from "app/main/global";
import * as XLSX from "xlsx";
@Component({
    selector: "app-unit",
    templateUrl: "./unit.component.html",
    styleUrls: ["./unit.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UnitComponent implements OnInit {
    unitData = [];
    displayedColumns: string[] = [
        "kode_unit",
        "nama_unit",
        "description",
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
    loading = false;

    constructor(
        private _router: Router,
        private _menuServ: MenuService,
        private _unitServ: UnitService
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

    async exportExcel() {
        this.loading = await true;
        await this._unitServ
            .getDataUnit({ pages: 1, search: null, status: "all" })
            .then(async (x: any) => {
                let a = await [];
                await x.forEach((b, c) => {
                    a = a.concat({
                        no: b.id,
                        kode_unit: b.kode_unit,
                        nama_unit: b.nama_unit,
                        description: b.description
                    });
                });
                const filename = await `Master_Satuan.xlsx`;
                const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(a);
                const wb: XLSX.WorkBook = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, `Data`);
                await XLSX.writeFile(wb, filename);
            });
        this.loading = await false;
    }

    getData() {
        this._unitServ.getDataUnit(this.datasent).then((x) => {
            this.unitData = this.unitData.concat(Array.from(x["data"]));
            this.total = x["total"];
            this.pages = x["current_page"];
            this.from = x["from"];
            this.to = x["to"];
            this.pageSize = x["per_page"];
        });
    }

    paginated(f) {
        this.unitData = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getData();
    }

    deleteData(v) {
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
                    this._unitServ
                        .deleteDataUnit(v)
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
        this.unitData = await [];
        await this.getData();
    }

    onSearchChange(ev) {
        this.unitData = [];
        this.datasent.search = ev;
        this.getData();
    }

    sortData(sort: Sort) {
        const data = this.unitData.slice();
        if (!sort.active || sort.direction === "") {
            this.unitData = data;
            return;
        }
        this.unitData = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "kode_unit":
                    return this.compare(a.kode_unit, b.kode_unit, isAsc);
                case "nama_unit":
                    return this.compare(a.nama_unit, b.nama_unit, isAsc);
                case "description":
                    return this.compare(a.description, b.description, isAsc);
                case "active":
                    return this.compare(a.active, b.active, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
