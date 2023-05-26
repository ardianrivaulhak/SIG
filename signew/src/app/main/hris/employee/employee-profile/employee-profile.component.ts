import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { EmployeeService } from "../employee.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";
import { AdministrativeInformationComponent } from "../add-employee/administrative-information/administrative-information.component";
import { StatusInformationComponent } from "../add-employee/status-information/status-information.component";
import { EditEmployeeComponent } from "../edit-employee/edit-employee.component";
import { StatusActiveComponent } from "../employee-profile/status-active/status-active.component";
import { DescDialogComponent } from "../employee-profile/desc-dialog/desc-dialog.component";
import { PositionService } from "../../position/position.service";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    FormArray,
    Form,
} from "@angular/forms";
import * as global from "app/main/global";
import {
    Employee_status,
    dataEmployeeStatus,
    Level,
    Bagian,
} from "../data-select";
import { DepartementService } from "app/main/hris/departement/departement.service";
import { EducationInformationComponent } from "../add-employee/education-information/education-information.component";
import { AddEmployeeComponent } from "../add-employee/add-employee.component";
import { EmployeeNotestoComponent } from "app/main/hris/employee/employee-notesto/employee-notesto.component";
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
import { url } from "app/main/url";
import { EmployeeComponent } from "../employee/employee.component";
import { ActivatedRoute, Router } from "@angular/router";

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
    selector: "app-employee-profile",
    templateUrl: "./employee-profile.component.html",
    styleUrls: ["./employee-profile.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class EmployeeProfileComponent implements OnInit {
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
    [x: string]: any;
    datahistory = [];
    dataeducation = [];
    dataadministration = [];
    displayedColumns: string[] = [
        "no",
        "status",
        "dept",
        "div",
        "subdiv",
        "position",
        "level",
        "from",
        "to",
        "desc",
        "action",
    ];
    columnEducation: string[] = [
        "no",
        "education",
        "instansi",
        "jurusan",
        "tahun_masuk",
        "tahun_keluar",
        "desc",
        "action",
    ];
    columnAdministration: string[] = ["no", "type", "value", "desc", "action"];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<EmployeeProfileComponent>,
        private _matDialog: MatDialog,
        private _employeeServ: EmployeeService,
        private _route: Router,
        private _actRoute: ActivatedRoute,
        private _posServ: PositionService
    ) {
        this.idemployee = this._actRoute.snapshot.params["id"];
    }

    ngOnInit(): void {
        this.getdatadetailemployee(this.idemployee);
        this.getDataHistoryEmployee(this.idemployee);
        this.getDataEducationHistory(this.idemployee);
        this.getDataAdministrationHistory(this.idemployee);
    }

    getdatadetailemployee(v) {
        this._employeeServ.getDataDetail(v).then((x) => {
            this.dataemployee = this.dataemployee.concat(x);
        });
    }

    setPhoto(v) {
        return v.photo == null
            ? `${url}assets/img/user/user-profiles.png`
            : `${url}assets/img/user/${v.photo}`;
    }

    _changeStatusPendidikan(v) {
        if (v == 0) {
            return "SD";
        } else if (v == 1) {
            return "SMP";
        } else if (v == 2) {
            return "SMA";
        } else if (v == 3) {
            return "D1";
        } else if (v == 4) {
            return "D2";
        } else if (v == 5) {
            return "D3";
        } else if (v == 6) {
            return "S1";
        } else if (v == 7) {
            return "S2";
        } else if (v == 8) {
            return "S3";
        }
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

    getAge(v) {
        let a = _moment([
            _moment(v.tgl_lahir ? v.tgl_lahir : v.from).format("YYYY"),
            _moment(v.tgl_lahir ? v.tgl_lahir : v.from).format("MM"),
            _moment(v.tgl_lahir ? v.tgl_lahir : v.from).format("DD"),
        ]);
        let b = _moment([
            _moment(v.tgl_lahir ? new Date() : v.to).format("YYYY"),
            _moment(v.tgl_lahir ? new Date() : v.to).format("MM"),
            _moment(v.tgl_lahir ? new Date() : v.to).format("DD"),
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
        return v == "0000-00-00" ? "now" : _moment(v).format("DD-MMMM-YYYY");
    }

    acthist(v, st) {
        switch (st) {
            case "edit":
                this.addstatusinfo(v);
                break;
            case "delete":
                global.swalyousure("cant be revert !").then((x) => {
                    if (x.isConfirmed) {
                        this._employeeServ
                            .deleteDataDetailEmployeement(v)
                            .then((x) => {
                                global.swalsuccess(
                                    "Success",
                                    "Deleting Success"
                                );
                                this.reloaddata(
                                    this.dataemployee[0].employee_id,
                                    "history"
                                );
                            })
                            .catch((e) =>
                                global.swalerror("Error at database")
                            );
                    }
                });
                break;
        }
    }

    actedu(v, st) {
        switch (st) {
            case "edit":
                this.addstatuseducation(v);
                break;
            case "delete":
                global.swalyousure("cant be revert !").then((x) => {
                    if (x.isConfirmed) {
                        this._employeeServ
                            .deleteEducationHistory(v)
                            .then((x) => {
                                global.swalsuccess(
                                    "Success",
                                    "Deleting Success"
                                );
                                this.reloaddata(
                                    this.dataemployee[0].employee_id,
                                    "education"
                                );
                            })
                            .catch((e) =>
                                global.swalerror("Error at database")
                            );
                    }
                });
                break;
        }
    }

    actadmin(v, st) {
        switch (st) {
            case "edit":
                this.addadmininfo(v);
                break;
            case "delete":
                global.swalyousure("cant be revert !").then((x) => {
                    if (x.isConfirmed) {
                        this._employeeServ
                            .deleteAdministrationHistory(v)
                            .then((x) => {
                                global.swalsuccess(
                                    "Success",
                                    "Deleting Success"
                                );
                                this.reloaddata(
                                    this.dataemployee[0].employee_id,
                                    "admin"
                                );
                            })
                            .catch((e) =>
                                global.swalerror("Error at database")
                            );
                    }
                });
                break;
        }
    }

    async addadmininfo(v) {
        let dialogCust = await this._matDialog.open(
            AdministrativeInformationComponent,
            {
                height: "auto",
                width: "600px",
                data: {
                    employee_id: this.dataemployee[0].employee_id,
                    status: v,
                },
            }
        );
        await dialogCust.afterClosed().subscribe((result) => {
            this.reloaddata(this.dataemployee[0].employee_id, "admin");
        });
    }

    async addstatusinfo(v) {
        let dialogCust = await this._matDialog.open(
            StatusInformationComponent,
            {
                height: "auto",
                width: "auto",
                data: {
                    employee_id: this.dataemployee[0].employee_id,
                    status: v,
                },
            }
        );
        await dialogCust.afterClosed().subscribe((result) => {
            this.reloaddata(this.dataemployee[0].employee_id, "history");
        });
    }

    deletedatanotes(v) {
        global.swalyousure("wont revert").then((x) => {
            if (x.isConfirmed) {
                this._employeeServ
                    .removeEmployeeNotes(v)
                    .then((x) =>
                        global.swalsuccess("success", "Delete Success")
                    )
                    .then(() => {
                        this.reloaddata(
                            this.dataemployee[0].employee_id,
                            "history"
                        );
                    });
            }
        });
    }

    async addstatuseducation(v) {
        let dialogCust = await this._matDialog.open(
            EducationInformationComponent,
            {
                height: "auto",
                width: "auto",
                data: {
                    employee_id: this.dataemployee[0].employee_id,
                    status: v,
                },
            }
        );
        await dialogCust.afterClosed().subscribe((result) => {
            this.reloaddata(this.dataemployee[0].employee_id, "education");
        });
    }

    async editpersonal(v) {
        let dialogCust = await this._matDialog.open(EditEmployeeComponent, {
            height: "auto",
            width: "600px",
            data: {
                employee_id: this.dataemployee[0].employee_id,
                status: v,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.reloaddata(this.dataemployee[0].employee_id, "profile");
        });
    }

    async addnotes(v) {
        let dialogCust = await this._matDialog.open(EmployeeNotestoComponent, {
            height: "auto",
            width: "400px",
            data: {
                employee_id: this.dataemployee[0].employee_id,
                status: v,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.reloaddata(this.dataemployee[0].employee_id, "profile");
        });
    }

    async editactive(v) {
        let dialogCust = await this._matDialog.open(StatusActiveComponent, {
            height: "auto",
            width: "400px",
            data: {
                employee_id: this.dataemployee[0].employee_id,
                status: v,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.reloaddata(this.dataemployee[0].employee_id, "profile");
        });
    }

    descData(data) {
        const dialogRef = this._matDialog.open(DescDialogComponent, {
            panelClass: "status-desc-dialog",
            width: "500px",
            data: data,
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("dialog close");
        });
    }

    reloaddata(v, st) {
        switch (st) {
            case "profile":
                this.dataemployee = [];
                this.getdatadetailemployee(v);
                break;
            case "history":
                this.datahistory = [];
                this.getDataHistoryEmployee(v);
                break;
            case "education":
                this.dataeducation = [];
                this.getDataEducationHistory(v);
                break;
            case "admin":
                this.dataadministration = [];
                this.getDataAdministrationHistory(v);
                break;
        }
    }

    getDataHistoryEmployee(v) {
        this._employeeServ
            .getHistoryDataStatus(v)
            .then((x) => (this.datahistory = this.datahistory.concat(x)));
    }

    getDataEducationHistory(v) {
        this._employeeServ
            .getDataEducationHistory(v)
            .then((x) => (this.dataeducation = this.dataeducation.concat(x)));
    }

    getDataAdministrationHistory(v) {
        this._employeeServ
            .getDataAdministrationHistory(v)
            .then(
                (x) =>
                    (this.dataadministration =
                        this.dataadministration.concat(x))
            );
    }

    enableEverything() {
        this.status = "edit";
        this.setEnabled();
    }

    async setData(id) {
        this.employeeForm = await this.createForm();
        await this._employeeServ.getDataDetail(id).then((c: any) => {});
    }

    // getDataPosition() {
    //     this._employeeServ
    //         .getDataPosition()
    //         .then((x) => (this.position = this.position.concat(x["data"])));
    // }

    getDataPosition() {
        this._employeeServ
            .getPositionTreeData()
            .then((x) => (this.position = this.position.concat(x)));
    }

    getLevelData() {
        this._employeeServ.getDataLevel().then((v) => {
            let a = [];
            a = a.concat(v);
            this.level = this.level.concat(a);
        });
    }

    getDepartementData() {
        this.deptServ
            .getDataDepartement(this.search)
            .then((x) => (this.datadept = this.datadept.concat(x)));
    }

    getSubDiv() {
        this._employeeServ
            .getSubDiv()
            .then((x) => (this.subdiv = this.subdiv.concat(x)));
    }

    getBagianData() {
        this._employeeServ.getDataBagian().then((x) => {
            let y = [];
            y = y.concat(x);
            this.bagian = this.bagian.concat(y);
        });
    }

    getDataCity() {
        this._employeeServ
            .getDataCity()
            .then((h) => (this.city = this.city.concat(h)));
    }

    changeDate(v) {
        return v || v === "0000-00-00"
            ? _moment(v).format("DD MMMM YYYY")
            : "Now";
    }
}
function v(v: any) {
    throw new Error("Function not implemented.");
}
