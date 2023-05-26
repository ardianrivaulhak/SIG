import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { SubcatalogueService } from "../subcatalogue.service";
import { fuseAnimations } from "@fuse/animations";
import { MatSort, Sort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import * as XLSX from "xlsx";
import * as global from "app/main/global";

@Component({
    selector: "app-subcatalogue",
    templateUrl: "./subcatalogue.component.html",
    styleUrls: ["./subcatalogue.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class SubcatalogueComponent implements OnInit {
    subcatalogueData = [];
    displayedColumns: string[] = [
        "sub_catalogue_code",
        "catalogue_name",
        "sub_catalogue_name",
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
        private _masterServ: SubcatalogueService
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
        this._masterServ.getDataSubcatalogue(this.datasent).then((x) => {
            this.subcatalogueData = this.subcatalogueData.concat(
                Array.from(x["data"])
            );
            this.total = x["total"];
            this.pages = x["current_page"];
            this.from = x["from"];
            this.to = x["to"];
            this.pageSize = x["per_page"];
        });
    }

    async exportExcel() {
        this.loading = await true;
        await this._masterServ
            .getDataSubcatalogue({ pages: 1, search: null, status: "all" })
            .then(async (x: any) => {
                let a = await [];
                await x.forEach((b, c) => {
                    a = a.concat({
                        no: c + 1,
                        catalogue: b.catalogue.catalogue_name,
                        kode_matriks: b.sub_catalogue_code,
                        matriks: b.sub_catalogue_name,
                    });
                });
                const filename = await `Master_Subcatalogue.xlsx`;
                const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(a);
                const wb: XLSX.WorkBook = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, `Data`);
                await XLSX.writeFile(wb, filename);
            });
        this.loading = await false;
    }

    paginated(f) {
        this.subcatalogueData = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getData();
    }

    onSearchChange(ev) {
        this.subcatalogueData = [];
        this.datasent.search = ev;
        this.getData();
    }

    sortData(sort: Sort) {
        const data = this.subcatalogueData.slice();
        if (!sort.active || sort.direction === "") {
            this.subcatalogueData = data;
            return;
        }
        this.subcatalogueData = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "sub_catalogue_code":
                    return this.compare(
                        a.sub_catalogue_code,
                        b.sub_catalogue_code,
                        isAsc
                    );
                case "catalogue_name":
                    return this.compare(
                        a.catalogue_name,
                        b.catalogue_name,
                        isAsc
                    );
                case "sub_catalogue_name":
                    return this.compare(
                        a.sub_catalogue_name,
                        b.sub_catalogue_name,
                        isAsc
                    );
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
                    this._masterServ
                        .deleteDataSubcatalogue(v)
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
        this.subcatalogueData = await [];
        await this.getData();
    }
}
