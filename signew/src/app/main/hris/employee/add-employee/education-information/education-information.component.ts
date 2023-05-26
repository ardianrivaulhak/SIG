import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialog,
} from "@angular/material/dialog";
import * as global from "app/main/global";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import { EmployeeService } from "app/main/hris/employee/employee.service";
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
        dateInput: "YYYY",
        monthYearLabel: "YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "YYYY",
    },
};

@Component({
    selector: "app-education-information",
    templateUrl: "./education-information.component.html",
    styleUrls: ["./education-information.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class EducationInformationComponent implements OnInit {
    sendingDet = {
        st: null,
        education: null,
        instansi: null,
        major: null,
        from: null,
        to: null,
        employee_id: null,
        desc: null,
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<EducationInformationComponent>,
        private _employeServ: EmployeeService
    ) {
      if(data){
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

    ngOnInit(): void {}

    setData(v) {
      this._employeServ
          .getDatEducationHistory(v.status)
          .then((x: any) => {
              this.sendingDet = {
                st: v.status,
                education: x.education_id.toString(),
                instansi: x.instansi,
                major: x.jurusan,
                from: x.tgl_masuk,
                to: x.tgl_keluar,
                employee_id: x.id_employee,
                desc: x.desc,
              };
          });
  }

  async savingdata() {
    if (
        this.sendingDet.education &&
        this.sendingDet.instansi &&
        this.sendingDet.major &&
        this.sendingDet.from &&
        this.sendingDet.to
    ) {
        await global.swalyousure("Will Sending the data").then((x) => {
            if (x.isConfirmed) {
                this._employeServ
                    .sendDataEducationHistory(this.sendingDet)
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
}
