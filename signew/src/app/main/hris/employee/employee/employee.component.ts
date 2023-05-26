import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { EmployeeService } from "../employee.service";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ReplaySubject, Subject } from "rxjs";
import { Router } from "@angular/router";
import {
    Employee_status,
    dataEmployeeStatus,
    Level,
    Bagian,
} from "../data-select";
import * as myurl from "app/main/url";
import { MatDialog } from "@angular/material/dialog";
import { EmployeeDetComponent } from "../employee-det/employee-det.component";
import * as global from "app/main/global";
import { url } from "app/main/url";
import { ViewEmployeeComponent } from "app/main/hris/employee/view-employee/view-employee.component";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import { LocalStorage } from "@ngx-pwa/local-storage";
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { EmployeeProfileComponent } from "../employee-profile/employee-profile.component";
import { FromToAttendaceComponent } from "app/main/hris/attendance/from-to-attendace/from-to-attendace.component";
import * as XLSX from "xlsx";
import { MessagingService } from "app/messaging.service";

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
    selector: "app-employee",
    templateUrl: "./employee.component.html",
    styleUrls: ["./employee.component.scss"],
    animations: fuseAnimations,
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
export class EmployeeComponent implements OnInit, AfterViewInit, OnDestroy {
    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    urlnow = myurl.url;
    throttle = 300;
    scrollDistance = 1;
    scrollUpDistance = 2;
    loading = false;

    breakpoint: number;
    datasend = {
        pages: 1,
        search: null,
        level: null,
        division: null,
        employeestatus: null,
        company: null,
        status_active: 1,
    };
    employee = [];
    page: number;
    datamentah = [];
    displayedColumns: string[] = [
        "no",
        "employee_name",
        "age",
        "departement",
        "division",
        "status",
        "action",
    ];
    employeestatus: Employee_status[] = dataEmployeeStatus;
    level: Level[] = [
        {
            id_level: "0",
            level_name: "Not Set",
        },
    ];
    bagian: Bagian[] = [
        {
            id_div: "0",
            division_name: "Not Set",
        },
    ];

    total: number;
    pages;
    to;
    from;
    pageSize;
    company_id;
    company_name;

    constructor(
        private _sanitizer: DomSanitizer,
        private _iconRegistry: MatIconRegistry,
        private _fuseNavigationService: FuseNavigationService,
        private _hriserv: EmployeeService,
        private _router: Router,
        private _matDialog: MatDialog,
        private _localStorage: LocalStorage,
        private messageServ: MessagingService
    ) {
        this._iconRegistry.addSvgIcon(
            "phone",
            this._sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/custom/phone.svg"
            )
        );
        this._iconRegistry.addSvgIcon(
            "mail",
            this._sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/custom/mail.svg"
            )
        );
        this._iconRegistry.addSvgIcon(
            "contact",
            this._sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/custom/contact.svg"
            )
        );
        this._iconRegistry.addSvgIcon(
            "edit",
            this._sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/custom/edit.svg"
            )
        );
        this._iconRegistry.addSvgIcon(
            "trash",
            this._sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/custom/trash.svg"
            )
        );
        this._iconRegistry.addSvgIcon(
            "gender-man",
            this._sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/custom/gender-man.svg"
            )
        );
        this._iconRegistry.addSvgIcon(
            "gender-woman",
            this._sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/custom/gender-woman.svg"
            )
        );
        this._iconRegistry.addSvgIcon(
            "none",
            this._sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/custom/less.svg"
            )
        );
        this.messageServ.getDataCompany().subscribe((o) => {
            this.company_id = o.id;
            this.company_name = o.text;
            this.employee = [];
            this.datamentah = [];
            this.getDataEmployee();
        });
    }

    onScroll() {
        this.datasend.pages = this.datasend.pages + 1;
        this.getDataEmployee();
    }

    setPhoto(v) {
        return v.photo == null
            ? `${url}assets/img/user/user-profiles.png`
            : `${url}assets/img/user/${v.photo}`;
    }

    ngOnInit() {
        // this.messageServ.getMessaged().subscribe((message) => {
        //     if (message) {
        //         this.company_id = message.id;
        //         this.employee = [];
        //         this.datamentah = [];
        //         this.getDataEmployee();
        //     } else {
        //         // clear messages when empty message received
        //         this.company_id = null;
        //         this.getDataEmployee();
        //     }
        // });
        // if(!t){
        //     this.getDataEmployee();
        // }
        this.getLevelData();
        this.getBagianData();
        this.loading = true;

        if (window.innerWidth <= 920) {
            this.breakpoint = 1;
        } else if (window.innerWidth <= 400) {
            this.breakpoint = 1;
        } else {
            this.breakpoint = 2;
        }
    }

    // getdatacompany(){
    //     this._localStorage.getItem('company').subscribe(v => {
    //         this.company_id = v;
    //         this.datasend.company = v;
    //     })
    // }

    paginated(f) {
        this.employee = [];
        this.datasend.pages = f.pageIndex + 1;
        this.getDataEmployee();
    }

    detail(val) {
        this._router.navigateByUrl("hris/employee/" + val);
    }

    ngAfterViewInit() {
        // this.setInitialValue();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    onResize(event) {
        if (event.target.innerWidth <= 920) {
            this.breakpoint = 1;
        } else if (event.target.innerWidth <= 400) {
            this.breakpoint = 1;
        } else {
            this.breakpoint = 2;
        }
    }

    async lihat(v) {
        let dialogCust = await this._matDialog.open(EmployeeProfileComponent, {
            height: "950px",
            width: "2000px",
            data: v.employee_id,
        });
        await dialogCust.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    async dataexport(v) {
        this._hriserv
            .exportDataEmployee({
                type: v,
                from: null,
                to: null,
                company_id: this.company_id,
            })
            .then((x) => this.setData(v, x, null));
    }

    async setData(v, d, r) {
        switch (v) {
            case "stkaryawan":
                let data = await [];
                for (let i = 0; i < d.length; i++) {
                    let a = await _moment([
                        _moment(
                            d[i].tgl_masuk ? d[i].tgl_masuk : v.from
                        ).format("YYYY"),
                        _moment(
                            d[i].tgl_masuk ? d[i].tgl_masuk : v.from
                        ).format("MM"),
                        _moment(
                            d[i].tgl_masuk ? d[i].tgl_masuk : v.from
                        ).format("DD"),
                    ]);
                    let b = await _moment([
                        _moment(d[i].tgl_masuk ? new Date() : v.to).format(
                            "YYYY"
                        ),
                        _moment(d[i].tgl_masuk ? new Date() : v.to).format(
                            "MM"
                        ),
                        _moment(d[i].tgl_masuk ? new Date() : v.to).format(
                            "DD"
                        ),
                    ]);

                    let years = await b.diff(a, "years");
                    await a.add(years, "years");
                    let months = await b.diff(a, "months");
                    await a.add(months, "months");
                    let days = await b.diff(a, "days");

                    data = await data.concat({
                        employee_id_number: d[i].nik,
                        employee_name: d[i].employee_name,
                        departement: d[i].dept?.dept_name,
                        division: d[i].bagian?.division_name,
                        subdivision: d[i].subagian?.name,
                        position: d[i].position?.position_name,
                        level: d[i].level?.level_name,
                        date_entry: d[i].tgl_masuk
                            ? this.changingdate(d[i].tgl_masuk)
                            : "-",
                        years_of_service: d[i].tgl_masuk
                            ? (years > 0 ? years + " Tahun " : "") +
                              (months > 0 ? months + " Bulan " : "") +
                              (days > 0 ? days + " Hari" : "")
                            : "-",
                        employee_status:
                            d[i].id_employee_status == 1
                                ? "Tetap"
                                : d[i].id_employee_status == 2
                                ? "Kontrak"
                                : "Honorer",
                    });
                }
                const filename = await `Employee_status.xlsx`;

                const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(data);
                const wb: XLSX.WorkBook = await XLSX.utils.book_new();

                await XLSX.utils.book_append_sheet(wb, ws, `Data`);
                await XLSX.writeFile(wb, filename);
                break;

            case "prbadikaryawan":
                let datapribadi = await [];
                for (let i = 0; i < d.length; i++) {
                    let z = await _moment([
                        _moment(d[i].tgl_lahir).format("YYYY"),
                        _moment(d[i].tgl_lahir).format("MM"),
                        _moment(d[i].tgl_lahir).format("DD"),
                    ]);
                    let x = await _moment([
                        _moment(new Date()).format("YYYY"),
                        _moment(new Date()).format("MM"),
                        _moment(new Date()).format("DD"),
                    ]);

                    let yearsLahir = await x.diff(z, "years");
                    await z.add(yearsLahir, "years");
                    let monthsLahir = await x.diff(z, "months");
                    await z.add(monthsLahir, "months");
                    let daysLahir = await x.diff(z, "days");

                    datapribadi = await datapribadi.concat({
                        employee_id_number: d[i].nik,
                        employee_name: d[i].employee_name,
                        gender: d[i].gender,
                        place_of_birth: d[i].city?.city_name,
                        date_of_birth: this.changingdate(d[i].tgl_lahir),
                        age: d[i].tgl_masuk
                            ? (yearsLahir > 0 ? yearsLahir + " Tahun " : "") +
                              (monthsLahir > 0 ? monthsLahir + " Bulan " : "") +
                              (daysLahir > 0 ? daysLahir + " Hari" : "")
                            : "-",
                        education: d[i].pendidikan ? d[i].pendidikan : "-",
                        major: d[i].jurusan ? d[i].jurusan : "-",
                        religion: d[i].religion,
                        tax_status: d[i].status_pajak,
                        home_phone: d[i].telp ? "+62 " + d[i].telp : "-",
                        phone: d[i].phone ? "+62 " + d[i].phone : "-",
                        phone2: d[i].phone2 ? "+62 " + d[i].phone2 : "-",
                        address: d[i].alamat ? d[i].alamat : "-",
                    });
                }
                const filenamePribadi = await `Employee_personal_data.xlsx`;

                const wsl: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(
                    datapribadi
                );
                const wbl: XLSX.WorkBook = await XLSX.utils.book_new();

                await XLSX.utils.book_append_sheet(wbl, wsl, `Data`);
                await XLSX.writeFile(wbl, filenamePribadi);

                break;
            case "administrasikaryawan":
                let dataadmin = await [];
                for (let i = 0; i < d.length; i++) {
                    dataadmin = dataadmin.concat({
                        employee_id_number: d[i].nik,
                        employee_name: d[i].employee_name,
                        ktp: d[i].ktp,
                        npwp: d[i].npwp,
                        mandiri: d[i].mandiri,
                        cimb: d[i].cimb,
                        jamsostek: d[i].jamsostek,
                        bpjs: d[i].bpjs,
                    });
                }
                const filenameAdmin = await `Employee_personal_data.xlsx`;

                const wsld: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(
                    dataadmin
                );
                const wbld: XLSX.WorkBook = await XLSX.utils.book_new();

                await XLSX.utils.book_append_sheet(wbld, wsld, `Data`);
                await XLSX.writeFile(wbld, filenameAdmin);
                break;
            case "all":
                this.setFormAllData(d);

                break;
        }
    }
    async setFormAllData(v) {
        let datapertama = await [];
        let datakedua = await [];
        let dataketiga = await [];

        let data1 = await v[0].data.data1;
        let data2 = await v[0].data.data2;

        for (let i = 0; i < data1.length; i++) {
            let a = await _moment([
                _moment(
                    data1[i].tgl_masuk ? data1[i].tgl_masuk : v.from
                ).format("YYYY"),
                _moment(
                    data1[i].tgl_masuk ? data1[i].tgl_masuk : v.from
                ).format("MM"),
                _moment(
                    data1[i].tgl_masuk ? data1[i].tgl_masuk : v.from
                ).format("DD"),
            ]);
            let b = await _moment([
                _moment(data1[i].tgl_masuk ? new Date() : v.to).format("YYYY"),
                _moment(data1[i].tgl_masuk ? new Date() : v.to).format("MM"),
                _moment(data1[i].tgl_masuk ? new Date() : v.to).format("DD"),
            ]);

            let z = await _moment([
                _moment(data1[i].tgl_lahir).format("YYYY"),
                _moment(data1[i].tgl_lahir).format("MM"),
                _moment(data1[i].tgl_lahir).format("DD"),
            ]);
            let x = await _moment([
                _moment(new Date()).format("YYYY"),
                _moment(new Date()).format("MM"),
                _moment(new Date()).format("DD"),
            ]);

            let years = await b.diff(a, "years");
            await a.add(years, "years");
            let months = await b.diff(a, "months");
            await a.add(months, "months");
            let days = await b.diff(a, "days");

            let yearsLahir = await x.diff(z, "years");
            await z.add(yearsLahir, "years");
            let monthsLahir = await x.diff(z, "months");
            await z.add(monthsLahir, "months");
            let daysLahir = await x.diff(z, "days");

            datakedua = await datakedua.concat({
                employee_id_number: data1[i].nik,
                employee_name: data1[i].employee_name,
                gender: data1[i].gender,
                place_of_birth: data1[i].city?.city_name,
                date_of_birth: this.changingdate(data1[i].tgl_lahir),
                age: data1[i].tgl_masuk
                    ? (yearsLahir > 0 ? yearsLahir + " Tahun " : "") +
                      (monthsLahir > 0 ? monthsLahir + " Bulan " : "") +
                      (daysLahir > 0 ? daysLahir + " Hari" : "")
                    : "-",
                education: data1[i].pendidikan ? data1[i].pendidikan : "-",
                major: data1[i].jurusan ? data1[i].jurusan : "-",
                religion: data1[i].religion,
                tax_status: data1[i].status_pajak,
                home_phone: data1[i].telp ? "+62 " + data1[i].telp : "-",
                phone: data1[i].phone ? "+62 " + data1[i].phone : "-",
                phone2: data1[i].phone2 ? "+62 " + data1[i].phone2 : "-",
                address: data1[i].alamat ? data1[i].alamat : "-",
            });

            datapertama = await datapertama.concat({
                employee_id_number: data1[i].nik,
                employee_name: data1[i].employee_name,
                departement: data1[i].dept?.dept_name,
                division: data1[i].bagian?.division_name,
                subdivision: data1[i].subagian?.name,
                years_of_service: data1[i].tgl_masuk
                    ? (years > 0 ? years + " Tahun " : "") +
                      (months > 0 ? months + " Bulan " : "") +
                      (days > 0 ? days + " Hari" : "")
                    : "-",
                employee_status:
                    data1[i].id_employee_status == 1
                        ? "Tetap"
                        : data1[i].id_employee_status == 2
                        ? "Kontrak"
                        : "Honorer",
            });
        }

        for (let ii = 0; ii < data2.length; ii++) {
            dataketiga = dataketiga.concat({
                employee_id_number: data2[ii].nik,
                employee_name: data2[ii].employee_name,
                ktp: data2[ii].ktp,
                npwp: data2[ii].npwp,
                mandiri: data2[ii].mandiri,
                cimb: data2[ii].cimb,
                jamsostek: data2[ii].jamsostek,
                bpjs: data2[ii].bpjs,
            });
        }

        const filenameAll = await `All_data_employee.xlsx`;

        const wsld1: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(
            datapertama
        );
        const wsld2: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(datakedua);
        const wsld3: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(
            dataketiga
        );
        const wbld: XLSX.WorkBook = await XLSX.utils.book_new();

        await XLSX.utils.book_append_sheet(wbld, wsld1, `status_karyawan`);

        await XLSX.utils.book_append_sheet(wbld, wsld2, `pribadi_karyawan`);
        await XLSX.utils.book_append_sheet(
            wbld,
            wsld3,
            `administrasi_karyawan`
        );
        await XLSX.writeFile(wbld, filenameAll);
    }

    changingdate(v) {
        return _moment(v).format("DD/MM/YYYY");
    }

    getbagian(ev) {
        this.datasend.pages = 1;
        this.employee = [];
        this.loading = true;
        this.datasend.division = ev ? ev.id_div : null;
        setTimeout(() => {
            this.getDataEmployee();
        }, 1000);
    }

    onToggle(v, ev) {
        this._hriserv
            .changeStatus({
                employee_id: v.employee_id,
                status: ev.checked ? 1 : 0,
            })
            .then(async (x) => {
                await global.swalsuccess("success", "Changing Status Success");
                this.employee = await [];
                this.loading = await true;
                await this.getDataEmployee();
            })
            .catch((e) =>
                global.swalerror(
                    "Error At Backend ! Contact IT For More Support"
                )
            );
    }

    getValLevel(ev) {
        this.datasend.pages = 1;
        this.employee = [];
        this.loading = true;
        this.datasend.level = ev;
        setTimeout(() => {
            this.getDataEmployee();
        }, 1000);
    }

    getValStatus(ev) {
        this.datasend.pages = 1;
        this.employee = [];
        this.loading = true;
        this.datasend.employeestatus = ev;
        setTimeout(() => {
            this.getDataEmployee();
        }, 1000);
    }

    async addnew(row?) {
        let dialogCust = await this._matDialog.open(EmployeeDetComponent, {
            height: "90vh",
            width: "800px",
            data: {
                idstatus: row ? row.employee_id : null,
            },
        });
        await dialogCust.afterClosed().subscribe((result) => {
            this.resetData();
        });
    }

    async resetData() {
        this.employee = await [];
        this.datasend = await {
            pages: 1,
            search: null,
            level: null,
            division: null,
            employeestatus: null,
            company: this.company_id,
            status_active: 1,
        };
        await this.getDataEmployee();
    }

    deleteaction(row) {
        global.swalyousure("Deleting data will not be rescue").then((x) => {
            if (x.isConfirmed) {
                this._hriserv
                    .deleteEmployee(row.employee_id)
                    .then((x) => {
                        global.swalsuccess("Success", "Delete Success");
                    })
                    .catch((e) => global.swalerror("Error Deleting Data"));
            }
        });
    }

    getDataEmployee() {
        this._hriserv
            .getData(this.datasend, this.company_id)
            .then((res) => {
                this.loading = false;
                this.employee = this.employee.concat(res["data"]);
                this.total = res["total"];
                this.pages = res["current_page"];
                this.from = res["from"];
                this.to = res["to"];
                this.pageSize = res["per_page"];
            })
            .then(
                () =>
                    (this.employee = this.uniq(
                        this.employee,
                        (it) => it.user_id
                    ))
            );
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    onSearchChange(ev) {
        this.employee = [];
        this.datasend.pages = 1;
        this.datasend.search = ev;
        this.loading = true;
        setTimeout(() => {
            this.getDataEmployee();
        }, 2000);
    }

    getLevelData() {
        this._hriserv.getDataLevel().then((v) => {
            let a = [];
            a = a.concat(v);
            this.level = this.level.concat(a);
        });
    }

    getBagianData() {
        this._hriserv.getDataBagian().then((x) => {
            let y = [];
            y = y.concat(x);
            this.bagian = this.bagian.concat(y);
        });
    }
}
