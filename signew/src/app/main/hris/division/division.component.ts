import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { DivisionService } from "./division.service";
import { fuseAnimations } from "@fuse/animations";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import { MatDialog } from "@angular/material/dialog";
import { ModalDivisionComponent } from "./modal-division/modal-division.component";
import * as global from "app/main/global";
import { LocalStorage } from "@ngx-pwa/local-storage";
import { MessagingService } from "app/messaging.service";
import { MatSort, Sort, MatSortModule } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
@Component({
    selector: "app-division",
    templateUrl: "./division.component.html",
    styleUrls: ["./division.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class DivisionComponent implements OnInit {
    search: String;
    company_id;
    datamentah = [];
    datadiv = [];
    datadept = [];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild("table") MatTable: MatTable<any>;
    displayedColumns: string[] = ["no", "division_name",'dept_name',"action"];
    constructor(
        private _divServ: DivisionService,
        private _router: Router,
        private _menuServ: MenuService,
        private _matDialog: MatDialog,
        private _localStorage: LocalStorage,
        private messageServ: MessagingService,
    ) {
        this.messageServ.getDataCompany().subscribe((m) => {
            this.company_id = m.id;
            this.datadiv = [];
            this.datamentah = [];
            this.getData();
        });
    }

    ngOnInit(): void {
        // this.getData();
    }

    async sortData(s: Sort) {
        this.datadiv = await this.datadiv.sort((a, b) => {
            const isAsc = s.direction === "asc";
            switch (s.active) {
                case "division_name":
                    return global.compare(a.division_name, b.division_name, isAsc);
                    break;
                case "dept_name":
                    return global.compare(a.dept.dept_name, b.dept.dept_name, isAsc);
                    break;
            }
        });
        this.datamentah = await this.datadiv;
        await this.MatTable.renderRows();

    }

    getData() {
        this._divServ
            .getDataDivision(this.company_id)
            .then((x) => (this.datadiv = this.datadiv.concat(x)))
            .then(
                () => (this.datamentah = this.datamentah.concat(this.datadiv))
            )
            .then(() => {
                this.datadiv = global.uniq(this.datadiv, (it) => it.id_div);
                this.datamentah = global.uniq(
                    this.datamentah,
                    (it) => it.id_div
                );
            });
    }

    onSearchChange(ev) {
        this.datadiv = [];
        this.getData();
    }

    async addnew(v?) {
        let dialogCust = await this._matDialog.open(ModalDivisionComponent, {
            height: "auto",
            width: "800px",
            data: {
                idstatus: v ? v.id_div : null,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.resetData();
        });
    }

    deleteaction(v) {
        global.swalyousure("You Cant Rescue The Data").then((x) => {
            if (x.isConfirmed) {
                this._divServ
                    .deleteDivision(v.id_div)
                    .then((h) => {
                        global.swalsuccess(
                            "success",
                            "Success Deleting Division"
                        );
                    })
                    .then(() => this.resetData())
                    .catch((e) => global.swalerror("Error Deleting Division"));
            }
        });
    }

    resetData() {
        this.datadiv = [];
        this.search = null;
        this.getData();
    }
}
