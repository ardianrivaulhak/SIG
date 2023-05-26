import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { PaketparameterService } from "../paketparameter.service";
import { fuseAnimations } from "@fuse/animations";
import { Sort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import * as global from "app/main/global";
import { ModalDetailsComponent } from "../modal-details/modal-details.component";
import { MatDialog } from "@angular/material/dialog";
import { ModalDetailsPaketparameterComponent } from "../modal-details-paketparameter/modal-details-paketparameter.component";

@Component({
    selector: "app-paketparameter",
    templateUrl: "./paketparameter.component.html",
    styleUrls: ["./paketparameter.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class PaketparameterComponent implements OnInit {
    load = false;
    paketparameterData = [];
    displayedColumns: string[] = [
        "kode_paketuji",
        "id_paketuji",
        "price",
        "discount",
        "status",
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
    constructor(
        private _menuServ: MenuService,
        private _snackBar: MatSnackBar,
        private _paketparameterServ: PaketparameterService,
        private _router: Router,
        private dialog: MatDialog
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
                console.log(this.access);
            }
        });
    }

    setspecial(v) {
        global
            .swalyousure(
                "memilih ini berarti jika urgent harga nya akan 1.5x dan jika very urgent harga nya akan 2x"
            )
            .then((x) => {
                if (x.isConfirmed) {
                    this._paketparameterServ.setSpecialPrice(v).then((x) => {
                        global.swalsuccess(
                            "success",
                            "Success adding Special Package Price"
                        );
                    });
                }
            });
    }

    async getData() {
        await this._paketparameterServ
            .getDataPaketparameter(this.datasent)
            .then(async (x) => {
                // console.log(x);
                this.paketparameterData = await this.paketparameterData.concat(
                    Array.from(x["data"])
                );
                this.total = x["total"];
                this.pages = x["current_page"];
                this.from = x["from"];
                this.to = x["to"];
                this.pageSize = x["per_page"];
            });
        this.paketparameterData = await this.uniq(
            this.paketparameterData,
            (it) => it.id
        );
        await console.log(this.paketparameterData);
    }

    paginated(f) {
        this.paketparameterData = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getData();
    }

    onSearchChange(ev) {
        this.paketparameterData = [];
        this.datasent.search = ev;
        this.datasent.pages = 1;
        this.getData();
    }

    sortData(sort: Sort) {
        const data = this.paketparameterData.slice();
        if (!sort.active || sort.direction === "") {
            this.paketparameterData = data;
            return;
        }
        this.paketparameterData = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "id_paketuji":
                    return this.compare(
                        a.nama_paketuji,
                        b.nama_paketuji,
                        isAsc
                    );
                case "kode_paketuji":
                    return this.compare(
                        a.kode_paketuji,
                        b.kode_paketuji,
                        isAsc
                    );
                case "price":
                    return this.compare(a.price, b.price, isAsc);
                case "status":
                    return this.compare(a.status, b.status, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    async viewDetails(v) {
        const dialogRef = await this.dialog.open(
            ModalDetailsPaketparameterComponent,
            {
                height: "500px",
                width: "700px",
                data: v,
            }
        );
        await dialogRef.afterClosed().subscribe(async (v) => {});
    }

    deletePaket(v) {
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
                    this._paketparameterServ
                        .deleteDataPaketparameter(v)
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

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    async setDelete(v) {
        this.datasent.pages = await 1;
        this.datasent.search = await null;
        this.paketparameterData = await [];
        await this.getData();
    }

    async gotodetail(v) {
        this._router.navigateByUrl("analystpro/paket-parameter/" + v);
    }

    approvedPaket(id) {
        console.log(id);
        let status = 1;
        this._paketparameterServ.approvedPrice(id, status).then((x) => {
            this.paketparameterData = [];
            this.getData();
            this.load = true;
            let message = {
                text: "Approved Succesfully",
                action: "Done",
            };
            setTimeout(() => {
                this.openSnackBar(message);
                this.load = false;
            }, 1000);
        });
    }

    unApprovedPaket(id) {
        let status = 0;
        this._paketparameterServ.approvedPrice(id, status).then((x) => {
            this.paketparameterData = [];
            this.getData();
            this.load = true;
            let message = {
                text: "Approved Succesfully",
                action: "Done",
            };
            setTimeout(() => {
                this.openSnackBar(message);
                this.load = false;
            }, 1000);
        });
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }

    copyPaket(id) {
        console.log(id);
        this._paketparameterServ.copyPaketId(id);
        this._router.navigateByUrl("analystpro/paket-parameter/add");
    }
}
// /analystpro/paket-parameter/'+paketparameterData.id_paket
