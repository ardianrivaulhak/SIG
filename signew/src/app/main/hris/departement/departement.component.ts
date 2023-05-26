import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { DepartementService } from "./departement.service";
import { fuseAnimations } from "@fuse/animations";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import { MatDialog } from "@angular/material/dialog";
import { ModalDepartemenComponent } from "./modal-departemen/modal-departemen.component";
import * as global from "app/main/global";
import { LocalStorage } from "@ngx-pwa/local-storage";
import { MessagingService } from "app/messaging.service";
import { MatSort, Sort, MatSortModule } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
@Component({
    selector: "app-departement",
    templateUrl: "./departement.component.html",
    styleUrls: ["./departement.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class DepartementComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild("table") MatTable: MatTable<any>;
    datasistercompany = [];
    datamentah = [];
    company_id;
    search: String;
    datadept = [];
    displayedColumns: string[] = ["no", "dept_code", "dept_name", "action"];
    constructor(
        private _deptServ: DepartementService,
        private _router: Router,
        private _menuServ: MenuService,
        private _matDialog: MatDialog,
        private _localStorage: LocalStorage,
        private messageServ: MessagingService
    ) {
        this.messageServ.getDataCompany().subscribe((m) => {
            this.company_id = m.id;
            this.datadept = [];
            this.datamentah = [];
            this.getData();
        });
    }

    ngOnInit(): void {}

    async sortData(s: Sort) {
        this.datadept = await this.datadept.sort((a, b) => {
            const isAsc = s.direction === "asc";
            switch (s.active) {
                case "dept_code":
                    return global.compare(a.dept_code, b.dept_code, isAsc);
                    break;
                case "dept_name":
                    return global.compare(a.dept_name, b.dept_name, isAsc);
                    break;
            }
        });
        this.datamentah = await this.datadept;
        await this.MatTable.renderRows();

    }

    getData() {
        this._deptServ
            .getDataDepartement(this.company_id)
            .then((x) => (this.datadept = this.datadept.concat(x)))
            .then(
                () => (this.datamentah = this.datamentah.concat(this.datadept))
            );
    }

    onSearchChange(ev) {
        this.datadept = [];
        this.getData();
    }

    async addnew(v?) {
        console.log(v);
        let dialogCust = await this._matDialog.open(ModalDepartemenComponent, {
            height: "auto",
            width: "800px",
            data: {
                idstatus: v ? v.id : null,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.resetData();
        });
    }

    deleteaction(v) {
        global.swalyousure("You Cant Rescue The Data").then((x) => {
            if (x.isConfirmed) {
                this._deptServ
                    .deleteDepartement(v.id)
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
        this.datadept = [];
        this.datamentah = [];
        this.search = null;
        this.getData();
    }
}
