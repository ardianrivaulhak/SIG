import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as global from "app/main/global";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatIconModule } from "@angular/material/icon";
import * as _moment from "moment";
import { ModalPositionComponent } from "app/main/hris/position/position/modal-position/modal-position.component";
import { PositionService } from "app/main/hris/position/position.service";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { LocalStorage } from "@ngx-pwa/local-storage";
import { MessagingService } from "app/messaging.service";
import { MatSort, Sort, MatSortModule } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
@Component({
    selector: "app-position",
    templateUrl: "./position.component.html",
    styleUrls: ["./position.component.scss"],
})
export class PositionComponent implements OnInit {
    dataposition = [];
    datamentah = [];
    company_id;
    search;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild("table") MatTable: MatTable<any>;

    displayedColumns: string[] = [
        "no",
        "position_name",
        "head_position",
        // "division",
        "subdiv",
        // "head",
        "action",
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalPositionComponent>,
        private _formBuild: FormBuilder,
        private _position: PositionService,
        private _matDialog: MatDialog,
        private _localStorage: LocalStorage,
        private messageServ: MessagingService
    ) {
        this.messageServ.getDataCompany().subscribe((m) => {
            this.company_id = m.id;
            this.dataposition = [];
            this.datamentah = [];
            this.getPositionTree();
        });
    }

    ngOnInit(): void {
        // this.getPositionTree();
    }

    async sortData(s: Sort) {
        this.dataposition = await this.dataposition.sort((a, b) => {
            const isAsc = s.direction === "asc";
            switch (s.active) {
                case "position_name":
                    return global.compare(
                        a.position_name,
                        b.position_name,
                        isAsc
                    );
                    break;
                case "position_head":
                    return global.compare(
                        a.position_head ? a.position_head.position_name : null,
                        b.position_head ? b.position_head.position_name : null,
                        isAsc
                    );
                    break;
                    case "division_name":
                    return global.compare(
                        a.division ? a.division.division_name : null,
                        b.division ? b.division.division_name : null,
                        isAsc
                    );
                    break;
                    case "subdiv_name":
                    return global.compare(
                        a.subdiv ? a.subdiv.name : null,
                        b.subdiv ? b.subdiv.name : null,
                        isAsc
                    );
                    break;
            }
        });
        this.datamentah = await this.dataposition;
        await this.MatTable.renderRows();
    }

    onSearchChange(ev) {
        if (ev.length > 0) {
            this.dataposition = this.datamentah.filter(
                (x) =>
                    x.position_name.toLowerCase().indexOf(ev.toLowerCase()) > -1
            );
        } else {
            this.dataposition = this.datamentah;
        }
    }

    getPositionTree() {
        this._position
            .getPositionTreeData(this.company_id)
            .then((x) => (this.dataposition = this.dataposition.concat(x)))
            .then(
                () =>
                    (this.datamentah = this.datamentah.concat(
                        this.dataposition
                    ))
            );
    }

    async addnew(v?) {
        let dialogCust = await this._matDialog.open(ModalPositionComponent, {
            height: "auto",
            width: "800px",
            data: {
                idstatus: v ? v.id_position : null,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.resetData();
        });
    }

    // async addnew(id?){
    //     let dialogCust = await this._matDialog.open(ModalLevelComponent, {
    //       height: "auto",
    //       width: "800px",
    //       data: {
    //         idstatus: id ? id.id_level : null
    //       }
    //   });
    //   await dialogCust.afterClosed().subscribe((result) => {
    //     this.resetData();
    //   })
    //   }

    deleteaction(id) {
        global
            .swalyousure("Data cant be rescue, if you do this !")
            .then((x) => {
                if (x.isConfirmed) {
                    this._position
                        .deleteDataPositionTree(id.id_position)
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
        this.dataposition = [];
        this.getPositionTree();
    }
}
