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
    selector: "app-employeement-level",
    templateUrl: "./employeement-level.component.html",
    styleUrls: ["./employeement-level.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class EmployeementLevelComponent implements OnInit {
    level = [];

    sendingDet = {
        st: null,
        level: null,
        from: null,
        to: null,
        employee_id: null,
        desc: null,
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<EmployeementLevelComponent>,
        private _levelServ: LevelService,
        private _employeServ: EmployeeService
    ) {
        if (data) {
            this.sendingDet.employee_id = data.emp.employee_id;
            this.sendingDet.st = data.id;
            if (data.id !== "new") {
                this.setData(data);
            }
        }
    }

    ngOnInit(): void {
        this.getDataLevel();
    }

    getDataLevel() {
        this._levelServ
            .getLevelData()
            .then((x) => (this.level = this.level.concat(x)));
    }

    setData(v) {
        this._employeServ.getDataStatusEmployeementLevel(this.sendingDet.st).then((x: any) => {
            this.sendingDet = {
                level: x.id_level,
                from: x.from,
                to: x.to,
                employee_id: x.employee_id,
                desc: x.desc,
                st: x.id,
            };
        });
    }

    async savingdata() {
        if (
            this.sendingDet.desc &&
            this.sendingDet.employee_id &&
            this.sendingDet.level
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
                        .setDataLevelEmployeement(this.sendingDet)
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
