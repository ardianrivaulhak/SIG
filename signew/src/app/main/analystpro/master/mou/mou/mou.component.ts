import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import { Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import { MouService } from "../mou.service";
import * as global from "app/main/global";
import Swal from "sweetalert2";

import { MatDialog } from "@angular/material/dialog";
import { MouModalsComponent } from "../mou-modals/mou-modals.component";
import { MouDetComponent } from "../mou-det/mou-det.component";
import { MouFormDiscountComponent } from "../mou-form-discount/mou-form-discount.component";
import * as _moment from "moment";
import { ModalAttachmentContractComponent } from "app/main/analystpro/contract/modal-attachment-contract/modal-attachment-contract.component";
@Component({
    selector: "app-mou",
    templateUrl: "./mou.component.html",
    styleUrls: ["./mou.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class MouComponent implements OnInit {
    access = [];
    total: number;
    from: number;
    to: number;
    per_page: number;
    pages = 1;
    datasent = {
        pages: 1,
        search: null,
        status: "all",
        id_cust: "all",
        expired: "all",
    };
    load = false;
    dataMou = [];
    displayedColumns: string[] = [
        "no",
        "action",
        "customer_name",
        "employee_name",
        "sales_forecast",
        "tgl_berlaku",
        "st_approved",
    ];

    constructor(
        private _masterServ: MouService,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private _menuServ: MenuService,
        private dialog: MatDialog
    ) {}

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

    ngOnInit(): void {
        this.getData();
        this.checkauthentication();
    }

    details(ev) {
        let dialogCust = this.dialog.open(MouModalsComponent, {
            height: "auto",
            width: "600px",
            data: {
                info: ev.detail,
                judul: ev.customer.customer_name,
            },
        });

        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    statusPengujian(v?) {
        let dialogCust = this.dialog.open(MouDetComponent, {
            height: "500px",
            width: "800px",
            data: v ? v : null,
        });

        dialogCust.afterClosed().subscribe(async (result) => this.reset());
    }

    addiscMou(v?) {
        let dialogCust = this.dialog.open(MouFormDiscountComponent, {
            height: "auto",
            width: "400px",
            data: v ? v : null,
        });

        dialogCust.afterClosed().subscribe(async (result) => this.reset());
    }

    update(ev) {
        let statuspengujian = ev.detail.filter(
            (f) => f.condition_name == "STATUS PENGUJIAN"
        );
        let discountlepas = ev.detail.filter(
            (f) => f.condition_name == "DISCOUNT"
        );
        if (discountlepas.length > 0) {
            this.addiscMou(ev);
        } else if (statuspengujian.length > 0) {
            this.statusPengujian(ev);
        }
    }

    delete(z) {
        global.swalyousure("No Turning Back").then((x) => {
            if (x.isConfirmed) {
                this._masterServ
                    .deleteMou(z.id_cust_mou_header)
                    .then((x) =>
                        global.swalsuccess("success", "deleted success")
                    )
                    .catch((c) => global.swalerror("error at database"));
            }
        });
    }

    changestatus(ev) {
        console.log(ev);
    }

    paginated(f) {
        console.log(f);
        this.dataMou = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getData();
    }

    getData() {
        this._masterServ
            .getData(this.datasent)
            .then((x) => {
                this.dataMou = this.dataMou.concat(x["data"]);
                this.total = x["total"];
                this.from = x["from"];
                this.to = x["to"];
                this.per_page = x["per_page"];
            })
            .then(
                () =>
                    (this.dataMou = this.uniq(
                        this.dataMou,
                        (it) => it.id_cust_mou_header
                    ))
            );
    }

    approve(v) {
        global
            .swalyousure("asd ?")
            .then((x) => {
                if (this.access[0].approve == 1) {
                    if (x.isConfirmed) {
                        this._masterServ
                            .approvedMou(v.id_cust_mou_header, 1)
                            .then((x) =>
                                global.swalsuccess("success", "saving data")
                            )
                            .catch((e) =>
                                global.swalerror("Error at database")
                            );
                    }
                } else {
                    global.swalerror(
                        "You dont have an authority to change data"
                    );
                }
            })
            .then(() => this.reset());
    }

    unapprove(v) {
        global
            .swalyousure("Sure ?")
            .then((x) => {
                if (x.isConfirmed) {
                    this._masterServ
                        .approvedMou(v.id_cust_mou_header, 0)
                        .then((x) =>
                            global.swalsuccess("success", "saving data")
                        )
                        .catch((e) => global.swalerror("Error at database"));
                }
            })
            .then(() => this.reset());
    }

    onSearchChange(ev) {
        this.dataMou = [];
        this.datasent.search = ev;
        this.getData();
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    sortData(sort: Sort) {
        const data = this.dataMou.slice();
        if (!sort.active || sort.direction === "") {
            this.dataMou = data;
            return;
        }
        this.dataMou = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "customer_name":
                    return this.compare(
                        a.customer.customer_name,
                        b.customer.customer_name,
                        isAsc
                    );
                case "employee_name":
                    return this.compare(
                        a.employee.employee_name,
                        b.employee.employee_name,
                        isAsc
                    );
                case "termin":
                    return this.compare(a.termin, b.termin, isAsc);
                case "sales_forecast":
                    return this.compare(
                        a.sales_forecast,
                        b.sales_forecast,
                        isAsc
                    );
                case "tgl_berlaku":
                    return this.compare(a.tgl_berlaku, b.tgl_berlaku, isAsc);
                case "tgl_selesai":
                    return this.compare(a.tgl_selesai, b.tgl_selesai, isAsc);
                case "st_approved":
                    return this.compare(a.status, b.status, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    attachment(v, st) {
        let dialogCust = this.dialog.open(ModalAttachmentContractComponent, {
            width: "800px",
            data: {
                value: v,
                status: st,
            },
        });

        dialogCust.afterClosed().subscribe(async (result) => {
            this.dataMou = [];
            this.getData();
        });
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }

    async reset() {
        this.datasent = await {
            pages: 1,
            search: null,
            status: "all",
            id_cust: "all",
            expired: "all",
        };
        this.dataMou = await [];
        await this.getData();
    }

    selection(ev, st) {
        this.dataMou = [];
        this.getData();
    }

    checkdatenow(v) {
        let now = parseInt(_moment(Date.now()).format("x"));
        let end = parseInt(_moment(v).format("x"));

        return now - end > 0 ? true : false;
    }
}
