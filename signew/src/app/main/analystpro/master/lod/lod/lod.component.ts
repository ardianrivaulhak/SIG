import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { LodService } from "../lod.service";
import { fuseAnimations } from "@fuse/animations";
import { Sort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import * as global from "app/main/global";
import * as XLSX from "xlsx";

@Component({
    selector: "app-lod",
    templateUrl: "./lod.component.html",
    styleUrls: ["./lod.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class LodComponent implements OnInit {
    lodData = [];
    displayedColumns: string[] = ["kode_lod", "nama_lod", "ket_lod", "action"];
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
        private _masterServ: LodService
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
        console.log(this.datasent);
        this._masterServ
            .getDataLod(this.datasent)
            .then((x: any) => {
                this.lodData = this.lodData.concat(x.data);
                this.total = x["total"];
                this.pages = x["current_page"];
                this.from = x["from"];
                this.to = x["to"];
                this.pageSize = x["per_page"];
            })
            .then(() => global.uniq(this.lodData, (it) => it.id));
    }

    paginated(f) {
        this.lodData = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getData();
    }

    onSearchChange(ev) {
        this.lodData = [];
        this.datasent.search = ev;
        this.getData();
    }

    sortData(sort: Sort) {
        const data = this.lodData.slice();
        if (!sort.active || sort.direction === "") {
            this.lodData = data;
            return;
        }
        this.lodData = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "kode_lod":
                    return this.compare(a.kode_lod, b.kode_lod, isAsc);
                case "nama_lod":
                    return this.compare(a.nama_lod, b.nama_lod, isAsc);
                case "ket_lod":
                    return this.compare(a.ket_lod, b.ket_lod, isAsc);
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

    async exportExcel() {
        this.loading = await true;
        await this._masterServ
            .getDataLod({ pages: 1, search: null, status: "all" })
            .then(async (x: any) => {
                const filename = await `Master_Lod.xlsx`;
                const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(x);
                const wb: XLSX.WorkBook = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, `Data`);
                await XLSX.writeFile(wb, filename);
            });
        this.loading = await false;
    }

    deleteLod(v) {
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
                    this._masterServ
                        .deleteDataLod(v)
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
        this.lodData = await [];
        await this.getData();
    }
}
