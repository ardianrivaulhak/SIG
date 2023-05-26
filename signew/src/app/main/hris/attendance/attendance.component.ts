import {
    AfterViewInit,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { AttendanceService } from "./attendance.service";
import { Router } from "@angular/router";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { MatDialog } from "@angular/material/dialog";
import { StatusModalComponent } from "./status-modal/status-modal.component";
import { SetStatusMoreComponent } from "./set-status-more/set-status-more.component";
import { DescModalComponent } from "./desc-modal/desc-modal.component";
import { ModalDateComponent } from "./modal-date/modal-date.component";
import { ModalRulesComponent } from "./modal-rules/modal-rules.component";
import { ModalTimetableforComponent } from "./modal-timetablefor/modal-timetablefor.component";
import { FromToAttendaceComponent } from "./from-to-attendace/from-to-attendace.component";
import { DayoffModalsComponent } from "../attendance/dayoff-modals/dayoff-modals.component";
import { datastatusfinal } from "./data";
import { EmployeeService } from "../employee/employee.service";
import * as global from "app/main/global";
import { MatPaginator } from "@angular/material/paginator";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MatDatepickerInputEvent,
    MatCalendarCellCssClasses,
} from "@angular/material/datepicker";
import * as XLSX from "xlsx";
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { Console } from "console";

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
    selector: "app-attendance",
    templateUrl: "./attendance.component.html",
    styleUrls: ["./attendance.component.scss"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class AttendanceComponent implements  OnInit {
    tampilan = "employee";
    date = new Date();
    tableshow = ["no", "nama", "masuk", "pulang", "status", "keterangan"];
    columnMode = ColumnMode.force;
    total: number;
    from: number;
    to: number;
    datasent = {
        pages: 1,
        date: this.setSendDate(new Date()),
    };
    dataAbsenKaryawan = [];
    dataAbsenKaryawanMentah = [];
    dataAbsen = [];
    datamentah = [];
    division = [];
    dataKaryawan = [];
    dateAbsenEmployeeto;
    dateAbsenEmployeeFrom;
    datasend = {
        pages: 1,
        search: null,
    };
    employee_id;
    basedatastatusfinal = datastatusfinal;

    constructor(
        private _attendanceServ: AttendanceService,
        private _router: Router,
        private _dialog: MatDialog,
        private _statusModal: StatusModalComponent,
        private _descModal: DescModalComponent,
        private _employeeServ: EmployeeService
    ) {}

    ngOnInit(): void {
        this.getData();
        this.getDiv();
        this.getDataEmployee();
    }

    getDataEmployee() {
        this._employeeServ
            .getDataEmployee(this.datasend)
            .then(
                (x) => (this.dataKaryawan = this.dataKaryawan.concat(x["data"]))
            )
            .then(() => {
                this.dataKaryawan = global.uniq(
                    this.dataKaryawan,
                    (it) => it.employee_id
                );
            });
    }

    onSearchi(ev, st) {
        switch (st) {
            case "employee":
                this.dataKaryawan = [];
                this.datasend.pages = 1;
                this.datasend.search = ev.term.toUpperCase();
                this.getDataEmployee();
                if (this.tampilan == "day") {
                    this.dataAbsen = [];
                    this.datamentah = [];
                    this.getData();
                } else {
                    this.dataAbsenKaryawan = [];
                    this.dataAbsenKaryawanMentah = [];
                    this.getDataAbsenByEmployee();
                }
                break;
        }
    }

    // paginated(f) {
    //     this.employee = [];
    //     this.datasend.pages = f.pageIndex + 1;
    //     this.getDataEmployee();
    // }

    getDiv() {
        this._attendanceServ
            .getDivision()
            .then((x) => (this.division = this.division.concat(x)));
    }

    bydaterecap() {
        let dialogCust = this._dialog.open(ModalDateComponent, {
            height: "auto",
            width: "500px",
        });

        dialogCust.afterClosed().subscribe(async (result) => {
            let data = await {
                month: result.month,
                year: result.year,
            };
            await this.getRekapData(data);
        });
    }

    async recapKpi() {
        let dialogCust = this._dialog.open(FromToAttendaceComponent, {
            height: "auto",
            width: "500px",
        });

        dialogCust.afterClosed().subscribe(async (result) => {
            this.getRekapKpi(result);
        });
    }

    async getRekapKpi(v) {
        var dataabsen = await [];
        var datarekap = await [];
        var employee_name = await this.datamentah.map((x) => ({
            employee_name: x.employee_name,
            id_employee: x.employee_id,
        }));
        await this._attendanceServ
            .getRekapData({ from: v.from, to: v.to }, "kpi")
            .then((v: any) => (dataabsen = dataabsen.concat(v)));
        // console.log(employee_name);

        await employee_name.forEach((x) => {
            let scoreval = dataabsen
                .filter((j) => j.id_employee == x.id_employee)
                .map((h) =>
                    this.basedatastatusfinal
                        .filter(
                            (k) =>
                                k.status_in == h.id_status &&
                                k.status_out == h.id_status_plg
                        )
                        .map((b) => b.value)[0] == undefined
                        ? 0
                        : this.basedatastatusfinal
                              .filter(
                                  (k) =>
                                      k.status_in == h.id_status &&
                                      k.status_out == h.id_status_plg
                              )
                              .map((b) => b.value)[0]
                );

            datarekap = datarekap.concat({
                employee: x.employee_name,
                score_value:
                    scoreval.length > 0 ? scoreval.reduce((z, y) => z + y) : 0,
                nilai_kpi_absensi:
                    100 -
                    (scoreval.length > 0
                        ? scoreval.reduce((z, y) => z + y)
                        : 0),
            });
        });

        const fileName = await `Rekap KPI ${this.setSendDate(new Date())}.xlsx`;

        const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(datarekap);
        const wb: XLSX.WorkBook = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, `Data`);

        await XLSX.writeFile(wb, fileName);
    }

    getcolor(v) {
        if (v.status_attendance?.id == 10) {
            return "red-status";
        } else if (v.status_attendance?.id !== 12) {
            if (v.status_attendance?.id == 8) {
                return "blue-status";
            } else {
                return "warning-status";
            }
        } else {
            return "green-status";
        }
    }

    getcolorPulang(v) {
        if (v.status_attendance_plg?.id == 9) {
            return "red-status";
        } else if (v.status_attendance_plg?.id !== 12) {
            if (v.status_attendance_plg?.id == 8) {
                return "blue-status";
            } else {
                return "warning-status";
            }
        } else {
            return "green-status";
        }
    }

    setDayoff() {
        let dialogCust = this._dialog.open(DayoffModalsComponent, {
            height: "auto",
            width: "800px",
        });

        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    async getRekapData(data) {
        var dataabsen = await [];
        var employee_name = await this.datamentah.map((x) => ({
            employee_name: x.employee_name,
            id_employee: x.employee_id,
        }));
        await this._attendanceServ.getRekapData(data, "monthly").then((v) => {
            dataabsen = dataabsen.concat(v);
        });

        await dataabsen.forEach((b) => {
            var checkindex = employee_name.findIndex(
                (t) => b.id_employee == t.id_employee
            );
            if (employee_name[checkindex] !== undefined) {
                for (let i = 0; i < 31; i++) {
                    employee_name[checkindex][
                        data.year +
                            "-" +
                            data.month +
                            "-" +
                            global.addzero(i + 1)
                    ] =
                        dataabsen
                            .filter(
                                (x) =>
                                    x.id_employee == b.id_employee &&
                                    x.id_date == i + 1
                            )
                            .map((z) => z.status).length > 0
                            ? dataabsen
                                  .filter(
                                      (x) =>
                                          x.id_employee == b.id_employee &&
                                          x.id_date == i + 1
                                  )
                                  .map((z) => {
                                      return this.basedatastatusfinal
                                          .filter(
                                              (k) =>
                                                  k.status_in == z.id_status &&
                                                  k.status_out ==
                                                      z.id_status_plg
                                          )
                                          .map((g) => g.status_final)[0] ==
                                          undefined
                                          ? "-"
                                          : this.basedatastatusfinal
                                                .filter(
                                                    (k) =>
                                                        k.status_in ==
                                                            z.id_status &&
                                                        k.status_out ==
                                                            z.id_status_plg
                                                )
                                                .map((g) => g.status_final)[0];
                                  })[0]
                            : "-";
                }
            }
        });

        const fileName = await `Data For Attendance ${this.setSendDate(
            new Date()
        )}.xlsx`;

        const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(
            employee_name
        );
        const wb: XLSX.WorkBook = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, `Data`);

        await XLSX.writeFile(wb, fileName);
    }

    timetable() {
        let dialogCust = this._dialog.open(ModalRulesComponent, {
            height: "auto",
            width: "800px",
        });

        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    setstatus() {
        let a: any =
            this.dataAbsenKaryawan.filter((e) => e.checked).length > 0
                ? SetStatusMoreComponent
                : DescModalComponent;
        let dialogCust = this._dialog.open(a, {
            height: "500px",
            width: "800px",
            data:
                this.dataAbsenKaryawan.filter((e) => e.checked).length > 0
                    ? {
                          data: this.dataAbsenKaryawan.filter((e) => e.checked),
                          employee_id: this.employee_id,
                      }
                    : {
                          employee: this.datamentah.map((x) => ({
                              employee_name: x.employee_name,
                              id_employee: x.employee_id,
                          })),
                      },
        });

        dialogCust.afterClosed().subscribe(async (result) => {
            console.log(result);
        });
    }

    settimetable() {
        let dialogCust = this._dialog.open(ModalTimetableforComponent, {
            height: "auto",
            width: "500px",
        });

        dialogCust.afterClosed().subscribe(async (result) => {});
    }

    getData() {
        this._attendanceServ
            .getDataAttendance(this.datasent)
            .then((x) => {
                this.dataAbsen = this.dataAbsen.concat(x);
                this.datamentah = this.datamentah.concat(x);
            })
            .then(() => {
                this.dataAbsen = global.uniq(
                    this.dataAbsen,
                    (it) => it.employee_id
                );
                this.datamentah = global.uniq(
                    this.datamentah,
                    (it) => it.employee_id
                );
            });
    }

    async exportExcel() {
        let dataexcel = [];
        this.datamentah.forEach((p) => {
            dataexcel = dataexcel.concat({
                id_employee: p.employee_id,
                name: p.employee_name,
                email: p.user ? p.user.email : "-",
                divisi: p.bagian.division_name,
                absen_masuk: p.attendance ? p.attendance.absen_masuk : "-",
                absen_pulang: p.attendance ? p.attendance.absen_pulang : "-",
                status: p.attendance ? p.attendance.status : "-",
                desc: p.attendance ? p.attendance.desc : "-",
            });
        });
        const fileName = await `Data For Attendance ${this.setSendDate(
            new Date()
        )}.xlsx`;

        const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(dataexcel);
        const wb: XLSX.WorkBook = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, `Data`);

        await XLSX.writeFile(wb, fileName);
    }

    setSendDate(v) {
        let ddate = new Date(v);
        return `${ddate.getFullYear()}-${this.addZero(
            ddate.getMonth() + 1
        )}-${this.addZero(ddate.getDate())}`;
    }
    importExcel() {
        console.log("as");
    }
    addZero(i) {
        return i < 10 ? `0${i}` : i;
    }

    ModalStatus(v) {
        let t = {};
        if (v.id_rules) {
            t = {
                attendance: {
                    id: v.id,
                    id_status: v.id_status,
                    id_status_plg: v.id_status_plg,
                    description: v.desc,
                },
                employee_id: v.id_employee,
            };
        }
        let dialogCust = this._dialog.open(StatusModalComponent, {
            height: "auto",
            width: "500px",
            data: {
                id_attendance: v.id_rules ? t : v,
                dateinput: _moment(v.tgl).format("YYYY-MM-DD"),
                employee_name: v.employee.employee_name,
            },
        });

        dialogCust.afterClosed().subscribe(async (result) => {
            if (result) {
                console.log(result);
                if (this.tampilan == "day") {
                    this.dataAbsen = [];
                    this.datamentah = [];
                    this.getData();
                } else {
                    this.dataAbsenKaryawanMentah = [];
                    this.dataAbsenKaryawan = [];
                    this.getDataAbsenByEmployee();
                }
            } else {
                return;
            }
        });
    }

    selectDiv(ev) {
        if (ev.value > 0) {
            this.dataAbsen = this.datamentah.filter(
                (x) => x.id_bagian == ev.value
            );
        } else {
            this.dataAbsen = this.datamentah;
        }
    }

    selectStatus(ev) {
        if (ev.value === "done") {
            this.dataAbsen = this.datamentah.filter((x) => x.attendance);
        } else if (ev.value === "notyet") {
            this.dataAbsen = this.datamentah.filter((x) => !x.attendance);
        } else {
            this.dataAbsen = this.datamentah;
        }
    }

    onSearchChange(ev) {
        if (this.tampilan == "day") {
            if (ev) {
                this.dataAbsen = this.datamentah.filter(
                    (x) => x.employee_id == ev.employee_id
                );
            } else {
                this.dataAbsen = this.datamentah;
            }
        } else {
            this.getDataAbsenByEmployee();
        }
    }

    changeView(ev) {
        this.tampilan = ev;
        this.employee_id = null;
    }

    async getDataAbsenByEmployee() {
        await this._attendanceServ
            .getDataAbsenByEmployee(this.employee_id)
            .then((x) => {
                this.dataAbsenKaryawan = this.dataAbsenKaryawan.concat(x);
                this.dataAbsenKaryawan = this.dataAbsenKaryawan.map((c) => ({
                    ...c,
                    checked: false,
                    convert:
                        this.basedatastatusfinal.filter(
                            (e) =>
                                e.status_in === c.status_attendance.id &&
                                e.status_out === c.status_attendance_plg?.id
                        ).length > 0
                            ? this.basedatastatusfinal.filter(
                                  (e) =>
                                      e.status_in === c.status_attendance.id &&
                                      e.status_out ===
                                          c.status_attendance_plg?.id
                              )[0].status_final
                            : "-",
                }));
                this.dataAbsenKaryawanMentah =
                    this.dataAbsenKaryawanMentah.concat(x);
                this.dataAbsenKaryawanMentah = this.dataAbsenKaryawanMentah.map(
                    (c) => ({
                        ...c,
                        checked: false,
                        convert:
                            this.basedatastatusfinal.filter(
                                (e) =>
                                    e.status_in === c.status_attendance.id &&
                                    e.status_out === c.status_attendance_plg?.id
                            ).length > 0
                                ? this.basedatastatusfinal.filter(
                                      (e) =>
                                          e.status_in ===
                                              c.status_attendance.id &&
                                          e.status_out ===
                                              c.status_attendance_plg?.id
                                  )[0].status_final
                                : "-",
                    })
                );
            });
    }

    unselect() {
        this.dataAbsen = this.datamentah;
        this.datasend.pages = 1;
        this.datasend.search = null;
        this.dataKaryawan = [];
        this.getDataEmployee();
    }

    checkAll(ev, i) {
        if (i !== "all") {
            this.dataAbsenKaryawan[i].checked = ev;
        } else {
            this.dataAbsenKaryawan = this.dataAbsenKaryawan.map((a) => ({
                ...a,
                checked: ev,
            }));
        }
    }

    OnDateChange(ev) {
        this.datasent = {
            pages: 1,
            date: this.setSendDate(this.date),
        };
        this.dataAbsen = [];
        this.getData();
    }

    OnDateChangeAbsenEmployee() {
        let dateTo = _moment(this.dateAbsenEmployeeto).format();
        let dateForm = _moment(this.dateAbsenEmployeeFrom).format();
        this.dataAbsenKaryawan = this.dataAbsenKaryawanMentah.filter(
            (x) =>
                _moment(x.tgl).format() >= dateForm &&
                _moment(x.tgl).format() <= dateTo
        );
    }

    ModalDesc(v) {
        let dialogCust = this._dialog.open(DescModalComponent, {
            height: "auto",
            width: "500px",
            data: {
                id_attendance: v,
                dateinput: this.date,
            },
        });

        dialogCust.afterClosed().subscribe(async (result) => {});
    }
}
