import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { LevelService } from "./level.service";
import { fuseAnimations } from "@fuse/animations";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import { MatDialog } from "@angular/material/dialog";
import { ModalLevelComponent } from "./modal-level/modal-level.component";
import * as global from "app/main/global";
import { LocalStorage } from "@ngx-pwa/local-storage";
import { MessagingService } from "app/messaging.service";
import { MatSort, Sort, MatSortModule } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
@Component({
    selector: "app-level",
    templateUrl: "./level.component.html",
    styleUrls: ["./level.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class LevelComponent implements OnInit {
    datalevel = [];
    datamentah = [];
    company_id;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild("table") MatTable: MatTable<any>;
    // datasend = {
    //   pages: 1,
    //   search: null
    // };
    search;
    displayedColumns: string[] = ["no", "level_name", "action"];

    constructor(
        private _masterServ: LevelService,
        private _router: Router,
        private _menuServ: MenuService,
        private _matDialog: MatDialog,
        private _localStorage: LocalStorage,
        private messageServ: MessagingService
    ) {
        this.messageServ.getDataCompany().subscribe((m) => {
                this.company_id = m.id;
                this.datalevel = [];
                this.datamentah = [];
                this.getDataLevel();
        });
       
    }

    ngOnInit(): void {
        // this.getDataLevel();
    }


    async sortData(s: Sort) {
        this.datalevel = await this.datalevel.sort((a, b) => {
            const isAsc = s.direction === "asc";
            switch (s.active) {
                case "level_name":
                    return global.compare(a.level_name, b.level_name, isAsc);
                    break;
            }
        });
        this.datamentah = await this.datalevel;
        await this.MatTable.renderRows();

    }

    onSearchChange(ev) {
        if (ev.length > 0) {
            this.datalevel = this.datamentah.filter(
                (x) => x.level_name.toLowerCase().indexOf(ev.toLowerCase()) > -1
            );
        } else {
            this.datalevel = this.datamentah;
        }
    }

    getDataLevel() {
        this._masterServ
            .getLevelData(this.company_id)
            .then((x) => (this.datalevel = this.datalevel.concat(x)))
            .then(
                () => (this.datamentah = this.datamentah.concat(this.datalevel))
            );
    }

    async addnew(id?) {
        let dialogCust = await this._matDialog.open(ModalLevelComponent, {
            height: "auto",
            width: "800px",
            data: {
                idstatus: id ? id.id_level : null,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.resetData();
        });
    }

    deleteaction(id) {
        global
            .swalyousure("Data cant be rescue, if you do this !")
            .then((x) => {
                if (x.isConfirmed) {
                    this._masterServ
                        .deleteDataLevel(id.id_level)
                        .then((x) => {
                            global.swalsuccess(
                                "Success",
                                "Success Deleting Data"
                            );
                        })
                        .then(() => this.resetData())
                        .catch((e) => global.swalerror("Error Deleting Data"));
                }
            });
    }

    resetData() {
        this.datalevel = [];
        this.datamentah = [];
        this.getDataLevel();
    }
}
