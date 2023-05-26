import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import * as global from "app/main/global";
import { SisterCompanyService } from "app/main/hris/sister-company/sister-company.service";
import { DetailsComponent } from "./modal/details/details.component";
import { LocalStorage } from "@ngx-pwa/local-storage";
import { MessagingService } from 'app/messaging.service';
import { MatSort, Sort, MatSortModule } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
@Component({
    selector: "app-sister-company",
    templateUrl: "./sister-company.component.html",
    styleUrls: ["./sister-company.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class SisterCompanyComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild("table") MatTable: MatTable<any>;
    displayedColumns: string[] = ["no", "company_name", "desc", "action"];
    datasistercompany = [];
    datamentah = [];
    search;
    company_id;

    constructor(
        private _sistServ: SisterCompanyService,
        private _router: Router,
        private _matDialog: MatDialog,
        private _localStorage: LocalStorage,
        private messageServ: MessagingService
    ) {}

    ngOnInit(): void {
        this.messageServ.getMessaged().subscribe(message => {
            if (message) {
              this.company_id = message.id;
              this.datasistercompany = [];
              this.datamentah = [];
              this.getdatasistercompany();
            } else {
              // clear messages when empty message received
              this.company_id = null;
            }
          });
        this.getdatasistercompany();
    }

    async sortData(s: Sort) {
        this.datasistercompany = await this.datasistercompany.sort((a, b) => {
            const isAsc = s.direction === "asc";
            switch (s.active) {
                case "company_name":
                    return global.compare(a.company_name, b.company_name, isAsc);
                    break;
            }
        });
        this.datamentah = await this.datasistercompany;
        await this.MatTable.renderRows();

    }

    onSearchChange(ev) {
        if (ev.length > 0) {
            this.datasistercompany = this.datamentah.filter(
                (x) =>
                    x.company_name.toLowerCase().indexOf(ev.toLowerCase()) > -1
            );
        } else {
            this.datasistercompany = this.datamentah;
        }
    }

    getdatasistercompany() {
            this._sistServ
                .getSisterCompanyData(this.company_id)
                .then(
                    (x) =>
                        (this.datasistercompany =
                            this.datasistercompany.concat(x))
                )
                .then(
                    () =>
                        (this.datamentah = this.datamentah.concat(
                            this.datasistercompany
                        ))
                );
    }

    async addnew(data?) {
        let dialogCust = await this._matDialog.open(DetailsComponent, {
            height: "auto",
            width: "800px",
            data: {
                idstatus: data ? data.id : null,
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
                    this._sistServ
                        .deleteDataSisterCompany(id.id)
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
        this.datasistercompany = [];
        this.datamentah = [];
        this.getdatasistercompany();
    }
}
