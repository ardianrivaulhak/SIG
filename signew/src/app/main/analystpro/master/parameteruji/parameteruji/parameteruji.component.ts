import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ParameterujiService } from "../parameteruji.service";
import { fuseAnimations } from "@fuse/animations";
import { MatSort, Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import { LabService } from "app/main/analystpro/master/lab/lab.service";
import * as XLSX from "xlsx";
import * as global from "app/main/global";
@Component({
    selector: "app-parameteruji",
    templateUrl: "./parameteruji.component.html",
    styleUrls: ["./parameteruji.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ParameterujiComponent implements OnInit {
    loading = false;
    parameterujiData = [];
    displayedColumns: string[] = [
        "name_id",
        "lab",
        "parameter_type",
        "price",
        "action",
    ];
    total: number;
    from: number;
    to: number;
    pages = 1;
    datasent = {
        pages: 1,
        search: null,
        idlab: null,
        sort_id: null,
        sort_status: null,
    };
    access = [];
    pageSize;
    masterlab = [];
    constructor(
        private _router: Router,
        private _menuServ: MenuService,
        private _masterServ: ParameterujiService,
        private _labServ: LabService
    ) {}

    ngOnInit(): void {
        this.getData();
        this.checkauthentication();
        this.getDataLab();
    }

    checkauthentication() {
        this._menuServ.checkauthentication(this._router.url).then(async (x) => {
            if (!x.status) {
                await global.swalerror("You dont an access to this page !");
                await this._router.navigateByUrl("apps");
            } else {
                this.access = await this.access.concat(x.access);
            }
        });
    }

    getData() {
        this._masterServ.getDataParameterUji(this.datasent).then((x) => {
            this.parameterujiData = this.parameterujiData.concat(
                Array.from(x["data"])
            );
            this.total = x["total"];
            this.pages = x["current_page"];
            this.from = x["from"];
            this.to = x["to"];
            this.pageSize = x["per_page"];
        });
    }

    getDataLab() {
        this._labServ
            .getDataLabFull()
            .then((x) => (this.masterlab = this.masterlab.concat(x)));
    }

    paginated(f) {
        this.parameterujiData = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getData();
    }

    onSearchChange(ev) {
        this.parameterujiData = [];
        this.resetVariable();
        this.datasent.search = ev;
        this.getData();
    }

    async exportExcel() {
        this.loading = await true;
        await this._masterServ
            .getDataParameterUji({
                pages: 1,
                search: null,
                idlab: this.datasent.idlab,
                status: "all",
            })
            .then(async (x: any) => {
                let acd = await [];
                await x.forEach((b, o) => {
                    acd = acd.concat({
                        no: o + 1,
                        name_id: b.name_id,
                        parametertype: b.parametertype.name,
                        lab: b.lab.nama_lab,
                    });
                });
                const filename = await `Master_Parameteruji.xlsx`;
                const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(acd);
                const wb: XLSX.WorkBook = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, `Data`);
                await XLSX.writeFile(wb, filename);
            });
        this.loading = await false;
    }

    resetVariable() {
        this.datasent = {
            pages: 1,
            search: null,
            idlab: null,
            sort_id: null,
            sort_status: null,
        };
    }

    setLab(ev) {
        this.parameterujiData = [];
        this.resetVariable();
        this.datasent.idlab = ev;
        this.getData();
    }

    sortData(sort: Sort) {
        this.resetVariable();
        if (sort.direction != "") {
            this.datasent.sort_id = sort.active;
            this.datasent.sort_status = sort.direction;
            this.parameterujiData = [];
            this.getData();
        } else {
            this.getData();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    async deleteParameteruji(v) {
        await global
            .swalyousure("Will Delete data permanently")
            .then((x: any) => {
                if (x.isConfirmed) {
                    this._masterServ
                        .deleteDataParameterUji(v)
                        .then(async (y: any) => {
                            if (y.value) {
                                await global.swalsuccess(
                                    "Deleted !",
                                    y.message
                                );
                                await this.setDelete(v);
                            } else {
                                await global.swalerror(y.message);
                            }
                        });
                }
            });
    }

    async setDelete(v) {
        this.datasent.pages = await 1;
        this.datasent.search = await null;
        this.parameterujiData = await [];
        await this.getData();
    }
}
