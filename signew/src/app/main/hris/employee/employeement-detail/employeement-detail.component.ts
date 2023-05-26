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
import { PositionService } from 'app/main/hris/position/position.service';
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
    selector: "app-employeement-detail",
    templateUrl: "./employeement-detail.component.html",
    styleUrls: ["./employeement-detail.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class EmployeementDetailComponent implements OnInit {
    level = [];
    departement = [];
    subdiv = [];
    division = [];
    position = [];

    sendingDet = {
        position: null,
        division: null,
        subdiv: null,
        dept: null,
        from: null,
        to: null,
        employee_id: null,
        id_empl_det: null,
        desc: null
    };
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<EmployeementDetailComponent>,
        private _levelServ: LevelService,
        private _deptServ: DepartementService,
        private _subDivServ: SubdivService,
        private _divServ: DivisionService,
        private _employeServ: EmployeeService,
        private _posServ: PositionService
    ) {
        if (data) {
            this.sendingDet.employee_id = data.emp.employee_id;
            this.sendingDet.id_empl_det = data.id;
            if (data.id !== "new") {
                this.setData(data);
            }
        }
    }

    ngOnInit(): void {
        this.getDataLevel();
        this.getDataDept();
        this.getSubDiv();
        this.getDataDiv();
        this.getDataPosition();
    }

    getDataPosition(){
        this._posServ.getPositionData().then(e => {
            this.position = this.position.concat(e['data']);
        })
    }

    getDataLevel() {console.log(this.level)
        this._levelServ
            .getLevelData()
            .then((x) => (this.level = this.level.concat(x)));
    }

    setData(v) {
        this._employeServ.getDataDetailHistoryEmployee(this.sendingDet.id_empl_det).then((x: any) => {
            this.sendingDet =  {
                position: x.id_position ,
                division: x.id_div,
                subdiv: x.id_subdiv,
                dept: x.id_dept,
                from: x.from,
                to: x.to,
                employee_id: x.employee_id,
                id_empl_det: x.id,
                desc: x.desc
            };console.log(x)
        });
    }


    getDataDept() {
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
            this.sendingDet.to = await _moment(this.sendingDet.to).format(
                "YYYY-MM-DD"
            );
            await global.swalyousure("Will Sending the data").then((x) => {
                if (x.isConfirmed) {
                    this._employeServ
                        .setDataDetailEmployeement(this.sendingDet)
                        .then((x) =>
                            global.swalsuccess("success", "Success Adding Data")
                        )
                        .catch((e) => global.swalerror("Error at database"));
                }
            });
            await this.closeModal();
        } else {
           await global.swalerror("ada data yang belum terisi");
        }
    }

    closeModal() {
        this.dialogRef.close();
    }
}
