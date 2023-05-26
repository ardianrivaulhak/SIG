import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { LabService } from "../lab.service";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import * as global from "app/main/global";
import * as XLSX from "xlsx";

@Component({
    selector: "app-lab",
    templateUrl: "./lab.component.html",
    styleUrls: ["./lab.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class LabComponent implements OnInit {
    datalab = [];
    displayedColumns: string[] = ["kode_lab", "nama_lab", "ket_lab", "action"];
    total: number;
    from: number;
    to: number;
    pages = 1;
    datasent = {
        pages: 1,
        search: null,
    };
    loadinglab = false;
    access = [];

    constructor(
        private _masterServ: LabService,
        private _router: Router,
        private _menuServ: MenuService
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
        this._masterServ.getDataLab(this.datasent).then((x) => {
            this.datalab = this.datalab.concat(Array.from(x["data"]));
            this.total = x["total"];
            this.from = x["from"] - 1;
            this.to = x["to"];
        });
    }

    paginated(f) {
        this.datalab = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getData();
    }

    onSearchChange(ev) {
        this.datalab = [];
        this.datasent.search = ev;
        this.getData();
    }

    sortData(sort: Sort) {
        const data = this.datalab.slice();
        if (!sort.active || sort.direction === "") {
            this.datalab = data;
            return;
        }
        this.datalab = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "kode_lab":
                    return this.compare(a.kode_lab, b.kode_lab, isAsc);
                case "nama_lab":
                    return this.compare(a.nama_lab, b.nama_lab, isAsc);
                case "ket_lab":
                    return this.compare(a.ket_lab, b.ket_lab, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    async exportExcel() {
        this.loadinglab = await true;
        const filename = await `Master_Lab.xlsx`;
        const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(this.datalab);
        const wb: XLSX.WorkBook = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, `Data`);
        await XLSX.writeFile(wb, filename);
        this.loadinglab = await false;
    }

    deleteLab(v) {
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
                        .deleteData(v)
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
        this.datalab = await [];
        await this.getData();
    }
}
