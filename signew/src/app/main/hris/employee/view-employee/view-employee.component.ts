import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialog,
} from "@angular/material/dialog";
import { EmployeeDetComponent } from "../employee-det/employee-det.component";
import { EmployeementStatusComponent } from "../employeement-status/employeement-status.component";
import { EmployeementDetailComponent } from "../employeement-detail/employeement-detail.component";
import { EmployeeService } from "../employee.service";
import * as global from "app/main/global";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { EmployeementLevelComponent } from "../employeement-level/employeement-level.component";
import { url } from "app/main/url";
import { fuseAnimations } from '@fuse/animations';
export const MY_FORMATS = {
    parse: {
        dateInput: "LL",
    },
    display: {
        dateInput: "DD/MM/YYYY",
        monthYearLabel: "YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "YYYY",
    },
};

@Component({
    selector: "app-view-employee",
    templateUrl: "./view-employee.component.html",
    styleUrls: ["./view-employee.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ViewEmployeeComponent implements OnInit {
    dataemployee = [];
    detailEmployeement = [];
    detailevel = [];
    detailstatus = [];
    desclevel = [];
    descposition = [];
    descstatus = [];
    otherdesc = [];
    desccuti = [];
    idemployee;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ViewEmployeeComponent>,
        private _matDialog: MatDialog,
        private _employeeServ: EmployeeService
    ) {
        if (data) {
            this.idemployee = data;
            this.getdatadetailemployee(data);
        }
    }

    ngOnInit(): void {

        // console.log(navigator.userAgent)
    }

    getdatadetailemployee(v) {console.log(v)
        this._employeeServ.getDataDetail(v).then((x) => {
            this.dataemployee = this.dataemployee.concat(x);
            if (x[0].historydiv.length > 0) {
                this.detailEmployeement = this.detailEmployeement.concat(
                    x[0].historydiv
                );
            }
            if (x[0].historylevel.length > 0) {
                this.detailevel = this.detailevel.concat(x[0].historylevel);
            }
            if (x[0].historystatus.length > 0) {
                this.detailstatus = this.detailstatus.concat(
                    x[0].historystatus
                );
            }
        });
    }

    testa() {
        window.open(`https://wa.me/+62${this.dataemployee[0].phone}`, "_blank");
    }

    async addnew(row?) {
        console.log(row);
        let dialogCust = await this._matDialog.open(EmployeeDetComponent, {
            height: "90vh",
            width: "800px",
            data: {
                idstatus: row ? row.employee_id : null,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.resetdata();
        });
    }

    async resetdata() {
        this.dataemployee = await [];
        this.detailEmployeement = await [];
        this.detailevel = await [];
        this.detailstatus = await [];
        await this.getdatadetailemployee(this.idemployee);
    }

    async addmoreemployementdet(z?) {
        let dialogCust = await this._matDialog.open(
            EmployeementDetailComponent,
            {
                height: "auto",
                width: "600px",
                data: {
                    emp: z ? z : this.dataemployee[0],
                    id: z ? z.id : "new",
                },
            }
        );
        await dialogCust.afterClosed().subscribe((result) => {
            this.resetdata();
        });
    }

    async deleteemployementdet(v) {
        await global.swalyousure("Will Delete this data").then((e) => {
            if (e.isConfirmed) {
                this._employeeServ
                    .deleteDataDetailEmployeement(v.id)
                    .then((x) => global.swalsuccess("success", x["message"]))
                    .then(() => {
                        this.resetdata();
                    })
                    .catch((a) => global.swalerror("error at database"));
            }
        });
    }

    async addmoreemployementlevel(x?) {
        let dialogCust = await this._matDialog.open(
            EmployeementLevelComponent,
            {
                height: "auto",
                width: "600px",
                data: {
                    emp: x ? x : this.dataemployee[0],
                    id: x ? x.id : "new",
                },
            }
        );
        await dialogCust.afterClosed().subscribe((result) => {
            this.resetdata();
        });
    }

    async deleteemployementlevel(j) {
        await global.swalyousure("Will Delete this data").then((e) => {
            if (e.isConfirmed) {
                this._employeeServ
                    .deleteDataLevelEmployeement(j.id)
                    .then((x) => global.swalsuccess("success", x["message"]))
                    .then(() => {
                        this.resetdata();
                    })
                    .catch((a) => global.swalerror("error at database"));
            }
        });
    }

    async addmoreemployementstatus(y?) {
        let dialogCust = await this._matDialog.open(
            EmployeementStatusComponent,
            {
                height: "auto",
                width: "600px",
                data: {
                    emp: y ? y : this.dataemployee[0],
                    id: y ? y.id : "new",
                },
            }
        );
        await dialogCust.afterClosed().subscribe((result) => {
            this.resetdata();
        });
    }

    async deleteemployementstatus(k) {
        await global.swalyousure("Will Delete this data").then((e) => {
            if (e.isConfirmed) {
                this._employeeServ
                    .deleteDataStatusEmployeement(k.id)
                    .then((x) => global.swalsuccess("success", x["message"]))
                    .then(() => {
                        this.resetdata();
                    })
                    .catch((a) => global.swalerror("error at database"));
            }
        });
    }

    setPhoto(v) {
        return v.photo == null
            ? `${url}assets/img/user/user-profiles.png`
            : `${url}assets/img/user/${v.photo}`;
    }

    getDifference(v) {
        let a = _moment([
            _moment(v.tgl_masuk ? v.tgl_masuk : v.from).format("YYYY"),
            _moment(v.tgl_masuk ? v.tgl_masuk : v.from).format("MM"),
            _moment(v.tgl_masuk ? v.tgl_masuk : v.from).format("DD"),
        ]);
        let b = _moment([
            _moment(v.tgl_masuk ? new Date() : v.to).format("YYYY"),
            _moment(v.tgl_masuk ? new Date() : v.to).format("MM"),
            _moment(v.tgl_masuk ? new Date() : v.to).format("DD"),
        ]);
        let years = b.diff(a, "years");
        a.add(years, "years");
        let months = b.diff(a, "months");
        a.add(months, "months");
        let days = b.diff(a, "days");
        return (
            (years > 0 ? years + " Tahun " : "") +
            (months > 0 ? months + " Bulan " : "") +
            (days > 0 ? days + " Hari" : "")
        );
    }

    changingdate(v) {
        return v == "0000-00-00" ? "now" : _moment(v).format("DD/MM/YYYY");
    }
}
