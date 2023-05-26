import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialog,
} from "@angular/material/dialog";
import { LevelService } from "app/main/hris/level/level.service";
import { DepartementService } from "app/main/hris/departement/departement.service";
import { SubdivService } from "app/main/hris/subdiv/subdiv.service";
import { DivisionService } from "app/main/hris/division/division.service";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import * as global from "app/main/global";
import { PositionService } from "app/main/hris/position/position.service";
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
    selector: "app-status-information",
    templateUrl: "./status-information.component.html",
    styleUrls: ["./status-information.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class StatusInformationComponent implements OnInit {
    level = [];
    departement = [];
    subdiv = [];
    division = [];
    position = [];
    statusp = [
        {
            id: 0,
            status_karyawan: "Honorer",
        },
        {
            id: 1,
            status_karyawan: "Kontrak",
        },
        {
            id: 2,
            status_karyawan: "Tetap",
        },
    ];



    sendingDet = {
        st: null,
        position: null,
        division: null,
        level: null,
        subdiv: null,
        dept: null,
        from: null,
        to: null,
        employee_id: null,
        desc: null,
        statusp: null,
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<StatusInformationComponent>,
        private _levelServ: LevelService,
        private _deptServ: DepartementService,
        private _subDivServ: SubdivService,
        private _divServ: DivisionService,
        private _employeServ: EmployeeService,
        private _posServ: PositionService
    ) {
        if (data) {
            setTimeout(() => {
                if (data.status !== "add") {
                    this.setData(data);
                    this.sendingDet.employee_id = data.employee_id;
                    this.sendingDet.st = data.status;
                } else {
                    this.sendingDet.employee_id = data.employee_id;
                    this.sendingDet.st = data.status;
                }
            }, 1000);
        }
    }

    ngOnInit(): void {
        this.getDataLevel();
        this.getDataDept();
        this.getSubDiv();
        this.getDataDiv();
        this.getDataPosition();
    }

    setData(v) {
        this._employeServ
            .getDataDetailHistoryEmployee(v.status)
            .then((x: any) => {
                this.sendingDet = {
                    st: v.status,
                    position: x.id_position,
                    division: x.id_div,
                    subdiv: x.id_subdiv,
                    level: x.id_level,
                    dept: x.id_dept,
                    statusp: x.status_karyawan.toString(),
                    from: _moment(x.from),
                    to: _moment(x.to),
                    employee_id: x.id_employee,
                    desc: x.desc,
                };
                console.log(x);
            });
    }

    // getDataPosition() {
    //     this._posServ.getPositionTreeData().then((e) => {
    //         this.position = this.position.concat(e["data"]);
    //     });
    // }

    getDataPosition() {
        this._posServ
            .getPositionTreeData()
            .then((x) => (this.position = this.position.concat(x)));
    }

    getDataLevel() {
        this._levelServ
            .getLevelData()
            .then((x) => (this.level = this.level.concat(x)));
    }

    getDataDept() {
        console.log(this.departement);
        this._deptServ
            .getDataDepartement(null)
            .then((x) => (this.departement = this.departement.concat(x)));
    }

    getSubDiv() {
        this._subDivServ
            .getDataSubDiv(null)
            .then((x) => (this.subdiv = this.subdiv.concat(x)));
    }

    getDataDiv() {
        this._divServ
            .getDataDivision(null)
            .then((x) => (this.division = this.division.concat(x)));
    }

    async savingdata() {
        if (
            this.sendingDet.dept &&
            this.sendingDet.division &&
            this.sendingDet.employee_id &&
            this.sendingDet.from &&
            this.sendingDet.position &&
            this.sendingDet.subdiv
        ) {
            this.sendingDet.from = await _moment(this.sendingDet.from).format(
                "YYYY-MM-DD"
            );
            this.sendingDet.to = this.sendingDet.to
                ? await _moment(this.sendingDet.to).format("YYYY-MM-DD")
                : null;
            await global.swalyousure("Will Sending the data").then((x) => {
                if (x.isConfirmed) {
                    this._employeServ
                        .setDataDetailEmployeement(this.sendingDet)
                        .then((x) =>
                            global.swalsuccess("success", "Success Adding Data")
                        )
                        .then(() => this.dialogRef.close())
                        .catch((e) => global.swalerror("Error at database"));
                }
            });
        } else {
            await global.swalerror("ada data yang belum terisi");
        }
    }

    closeModal() {
        this.dialogRef.close();
    }
}
