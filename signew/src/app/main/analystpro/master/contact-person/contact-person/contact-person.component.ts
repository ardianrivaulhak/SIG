import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { Sort } from "@angular/material/sort";
import { ContactPersonService } from "../contact-person.service";
import Swal from "sweetalert2";
import { Router, ActivatedRoute } from "@angular/router";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import * as global from "app/main/global";
import * as XLSX from "xlsx";
@Component({
    selector: "app-contact-person",
    templateUrl: "./contact-person.component.html",
    styleUrls: ["./contact-person.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ContactPersonComponent implements OnInit {
    contactpersons = [];
    displayedColumns: string[] = [
        "name",
        "gender",
        "telpnumber",
        "phonenumber",
        "email",
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
    sortedData = this.contactpersons;
    access = [];
    pageSize;
    loading;
    idCust: any;
    constructor(
        private _contactPersonServ: ContactPersonService,
        private _router: Router,
        private _menuServ: MenuService,
        private _actRoute: ActivatedRoute
    ) {
        this.idCust = this._actRoute.snapshot.params["id"];
    }

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

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    async getData() {
        await this._contactPersonServ
            .getDataContactPersons(this.datasent)
            .then(async (x) => {
                this.contactpersons = await this.contactpersons.concat(
                    Array.from(x["data"])
                );
                this.total = x["total"];
                this.pages = x["current_page"];
                this.from = x["from"];
                this.to = x["to"];
                this.pageSize = x["per_page"];
            });
        this.contactpersons = await global.uniq(
            this.contactpersons,
            (it) => it.id_cp
        );
        await console.log(this.contactpersons);
    }

    async exportExcel() {
        this.loading = await true;
        await this._contactPersonServ
            .getDataAllContactPerson()
            .then(async (x: any) => {
                let a = await [];
                await x.forEach((b, c) => {
                    a = a.concat({
                        no: c + 1,
                        name: b.name,
                        gender: b.gender,
                        email: b.email,
                        fax: b.fax,
                        phone: b.phonenumber,
                        telpnumber: b.telpnumber,
                    });
                });
                const filename = await `Master_Contactperson.xlsx`;
                const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(a);
                const wb: XLSX.WorkBook = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, `Data`);
                await XLSX.writeFile(wb, filename);
            });
        this.loading = await false;
    }

    paginated(f) {
        this.contactpersons = [];
        this.datasent.pages = f.pageIndex + 1;
        this.getData();
    }

    onSearchChange(ev) {
        this.contactpersons = [];
        this.datasent.search = ev;
        this.getData();
    }

    sortData(sort: Sort) {
        const data = this.contactpersons.slice();
        if (!sort.active || sort.direction === "") {
            this.contactpersons = data;
            return;
        }
        this.contactpersons = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";
            switch (sort.active) {
                case "name":
                    return this.compare(a.name, b.name, isAsc);
                case "gender":
                    return this.compare(a.gender, b.gender, isAsc);
                case "telpnumber":
                    return this.compare(a.telpnumber, b.telpnumber, isAsc);
                case "phonenumber":
                    return this.compare(a.phonenumber, b.phonenumber, isAsc);
                case "email":
                    return this.compare(a.email, b.email, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    deleteData(id) {
        console.log(this.idCust);
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this Data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        }).then((result) => {
            if (result.value) {
                this._contactPersonServ
                    .deleteDataContactPersons(id)
                    .then((x: any) => {
                        if (x.success) {
                            global.swalsuccess("success", x.message);
                        } else {
                            global.swalerror(x.message);
                        }
                        this.setDelete(id);
                    });
            }
        });
    }

    async setDelete(v) {
        this.datasent.pages = await 1;
        this.datasent.search = await null;
        this.contactpersons = await [];
        await this.getData();
    }
}
