import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { SubdivService } from "./subdiv.service";
import { fuseAnimations } from "@fuse/animations";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import { MatDialog } from "@angular/material/dialog";
import { ModalSubdivComponent } from "./modal-subdiv/modal-subdiv.component";
import * as global from "app/main/global";
import { LocalStorage } from "@ngx-pwa/local-storage";
import { MessagingService } from "app/messaging.service";
import { MatSort, Sort, MatSortModule } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
@Component({
    selector: "app-subdiv",
    templateUrl: "./subdiv.component.html",
    styleUrls: ["./subdiv.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class SubdivComponent implements OnInit {
    datamentah = [];
    company_id;
    search: String;
    datasubdiv = [];
    displayedColumns: string[] = [
        "no",
        "subdivision_name",
        "division_name",
        "action",
    ];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild("table") MatTable: MatTable<any>;

    constructor(
        private _subdivServ: SubdivService,
        private _router: Router,
        private _menuServ: MenuService,
        private _matDialog: MatDialog,
        private _localStorage: LocalStorage,
        private messageServ: MessagingService
    ) {
        this.messageServ.getDataCompany().subscribe((m) => {
            this.company_id = m.id;
            this.datasubdiv = [];
            this.datamentah = [];
            this.getData();
        });
    }

    ngOnInit(): void {
        // this.getData();
    }

    async sortData(s: Sort) {
        this.datasubdiv = await this.datasubdiv.sort((a, b) => {
            const isAsc = s.direction === "asc";
            switch (s.active) {
                case "subdivision_name":
                    return global.compare(a.name, b.name, isAsc);
                    break;
                case "division_name":
                    return global.compare(
                        a.division.division_name,
                        b.division.division_name,
                        isAsc
                    );
                    break;
            }
        });
        this.datamentah = await this.datasubdiv;
        await this.MatTable.renderRows();
    }

    getData() {
        this._subdivServ
            .getDataSubDiv(this.company_id)
            .then((x) => (this.datasubdiv = this.datasubdiv.concat(x)))
            .then(
                (x) =>
                    (this.datamentah = this.datamentah.concat(this.datasubdiv))
            );
    }

    onSearchChange(ev) {
        this.datasubdiv = [];
        this.getData();
    }

    async addnew(v?) {
        console.log(v);
        let dialogCust = await this._matDialog.open(ModalSubdivComponent, {
            height: "auto",
            width: "800px",
            data: {
                idstatus: v ? v.id_subagian : null,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.resetData();
        });
    }

    deleteaction(v) {
        global.swalyousure("You Cant Rescue The Data").then((x) => {
            if (x.isConfirmed) {
                this._subdivServ
                    .deleteSubDivision(v.id_subagian)
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
        this.datasubdiv = [];
        this.search = null;
        this.getData();
    }
}
