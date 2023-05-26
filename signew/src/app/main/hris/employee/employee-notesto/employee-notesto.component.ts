import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import * as global from "app/main/global";

@Component({
    selector: "app-employee-notesto",
    templateUrl: "./employee-notesto.component.html",
    styleUrls: ["./employee-notesto.component.scss"],
})
export class EmployeeNotestoComponent implements OnInit {
    datasent = {
        idnotes: null,
        desc: null,
        employee_id: null,
        category: null,
    };

    datacategory = [
        {
            id: 1,
            value: "Cuti",
        },
        {
            id: 2,
            value: "History",
        },
        {
            id: 3,
            value: "Mutasi / Promosi",
        },
        {
            id: 4,
            value: "Status Karyawan",
        },
        {
            id: 5,
            value: "Data Pribadi",
        },
        {
            id: 6,
            value: "History Pendidikan",
        },
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<EmployeeNotestoComponent>,
        private _EmployeeServ: EmployeeService
    ) {
        if (data) {
            this.datasent.employee_id = data.employee_id;
            this.datasent.idnotes = data.status;
            if (data.status !== "add") {
                this.getDtaDetailNotes(data.status);
            }
        }
    }

    ngOnInit(): void {}

    getDtaDetailNotes(v) {
        this._EmployeeServ.showEmployeeNotes(v).then((x: any) => {
            this.datasent.category = x.category;
            this.datasent.desc = x.desc;
            this.datasent.idnotes = v;
            this.datasent.employee_id = x.id_employee;
        });
    }

    saving() {
        global.swalyousure("it cant be revert !").then((z) => {
            if (z.isConfirmed) {
                let url =
                    this.datasent.idnotes !== "add"
                        ? this._EmployeeServ.editDataNotes(this.datasent)
                        : this._EmployeeServ.addNotesEmployee(this.datasent);
                url.then((x) => {
                    global.swalsuccess("success", "Saving Success");
                }).then(() => this.close());
            }
        });
    }

    close() {
        this.dialogRef.close();
    }
}
