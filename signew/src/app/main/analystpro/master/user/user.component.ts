import { Component, OnInit } from "@angular/core";
import { UserService } from "./user.service";
import { MatDialog } from "@angular/material/dialog";
import { UserModalComponent } from "./user-modal/user-modal.component";
import * as global from "app/main/global";
@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
    user = [];
    displayedColumns: string[] = [
        "no",
        "employee",
        "user_email",
        "active",
        "action",
    ];
    datareal = [];
    loading = true;
    employee_data = [];

    constructor(
        private _userServ: UserService,
        private _dialogRef: MatDialog
    ) {}

    ngOnInit(): void {
        this.getDataUser();
    }

    async onSearchChange(ev) {
        if (ev.length > 3) {
            this.user = await this.datareal.filter(
                (x) =>
                    x.employee_name.toLowerCase().indexOf(ev.toLowerCase()) >
                        -1 ||
                    x.email?.toLowerCase().indexOf(ev.toLowerCase()) > -1
            );
        } else {
            this.user = await this.datareal;
        }
    }

    async getDataUser() {
        await this._userServ.getDataUser().then((x) => {
            this.user = this.user.concat(x);
            this.datareal = this.datareal.concat(x);
        });
        this.loading = await false;
    }

    gotoModal(status, row?) {
        let dialogCust = this._dialogRef.open(UserModalComponent, {
            height: "auto",
            width: "800px",
            data: {
                status: status,
                data: row ? row : null,
            },
        });

        dialogCust.afterClosed().subscribe(async (result) => {
            console.log(result);
        });
    }
}
