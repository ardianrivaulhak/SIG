import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { EmployeeService } from "../employee.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";
import { AdministrativeInformationComponent } from "../add-employee/administrative-information/administrative-information.component";
import { StatusInformationComponent } from "../add-employee/status-information/status-information.component";
import { SisterCompanyService } from "app/main/hris/sister-company/sister-company.service";
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
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { url } from "app/main/url";
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
    selector: "app-edit-employee",
    templateUrl: "./edit-employee.component.html",
    styleUrls: ["./edit-employee.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class EditEmployeeComponent implements OnInit {
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

    employeeForm: FormGroup;
    status;
    employeestatus: Employee_status[] = dataEmployeeStatus;
    employee_id;
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
    subdiv = [];
    city = [];
    search;
    position = [];
    datadept = [];
    timetable: FormArray = this._fb.array([]);
    FormTimetable: FormGroup = this._fb.group({
        timetablefor: this.timetable,
    });
    time_table = [];

    sisterCompany = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _employeeServ: EmployeeService,
        private dialogRef: MatDialogRef<EditEmployeeComponent>,
        private _fb: FormBuilder,
        private deptServ: DepartementService,
        private _matDialog: MatDialog,
        private _sisterCompany: SisterCompanyService
    ) {
        if (data) {
            this.status = data.idstatus ? data.idstatus : "add";
            this.getDataDetail(data.employee_id);
        }
    }

    ngOnInit(): void {
        this.employeeForm = this.createForm();
        this.getDataCity();
        this.getBagianData();
        this.getLevelData();
        this.getSubDiv();
        this.getDepartementData();
        this.getDataPosition();
        this.getDataSisterCompany();
    }

    changeDate(v) {
        return v ? _moment(v).format("DD/MM/YYYY") : "Now";
    }

    getDataDetail(v) {
        this._employeeServ.getDataDetail(v).then((x) => {
            this.setDataForm(x);
        });
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
                                    this.employeeForm.controls.employee_id
                                        .value,
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
                                    this.employeeForm.controls.employee_id
                                        .value,
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
                                    this.employeeForm.controls.employee_id
                                        .value,
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
                    employee_id: this.employeeForm.controls.employee_id.value,
                    status: v,
                },
            }
        );
        await dialogCust.afterClosed().subscribe((result) => {
            this.reloaddata(
                this.employeeForm.controls.employee_id.value,
                "admin"
            );
        });
    }

    async addstatusinfo(v) {
        let dialogCust = await this._matDialog.open(
            StatusInformationComponent,
            {
                height: "auto",
                width: "auto",
                data: {
                    employee_id: this.employeeForm.controls.employee_id.value,
                    status: v,
                },
            }
        );
        await dialogCust.afterClosed().subscribe((result) => {
            this.reloaddata(
                this.employeeForm.controls.employee_id.value,
                "history"
            );
        });
    }

    orgValueChange(v) {
        this.employeeForm.controls.tgl_lahir.setValue(
            _moment(
                v.split("/")[2] + "-" + v.split("/")[1] + "-" + v.split("/")[0]
            ).format("YYYY-MM-DD")
        );
    }

    orgValueChange2(v) {
        this.employeeForm.controls.tgl_masuk.setValue(
            _moment(
                v.split("/")[2] + "-" + v.split("/")[1] + "-" + v.split("/")[0]
            ).format("YYYY-MM-DD")
        );
    }



    async addstatuseducation(v) {
        let dialogCust = await this._matDialog.open(
            EducationInformationComponent,
            {
                height: "auto",
                width: "auto",
                data: {
                    employee_id: this.employeeForm.controls.employee_id.value,
                    status: v,
                },
            }
        );
        await dialogCust.afterClosed().subscribe((result) => {
            this.reloaddata(
                this.employeeForm.controls.employee_id.value,
                "education"
            );
        });
    }

    reloaddata(v, st) {
        switch (st) {
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

    getDataSisterCompany() {
        this._sisterCompany
            .getSisterCompanyData()
            .then(
                (x: any) => (this.sisterCompany = this.sisterCompany.concat(x))
            );
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

    createForm() {
        return this._fb.group({
            employee_id: new FormControl(),
            nik: new FormControl({
                value: "",
                disabled: false,
            }),
            employee_name: new FormControl({
                value: "",
                disabled: false,
            }),
            company_name: new FormControl({
                value: "",
                disabled: false,
            }),
            photo: new FormControl({
                value: "",
                disabled: false,
            }),
            email: new FormControl({
                value: "",
                disabled: false,
            }),
            phone: new FormControl({
                value: "",
                disabled: false,
            }),
            tempatlahir: new FormControl({
                value: "",
                disabled: false,
            }),
            tgl_lahir: new FormControl({
                value: "",
                disabled: false,
            }),
            alamat: new FormControl({
                value: "",
                disabled: false,
            }),
            gender: new FormControl({
                value: "",
                disabled: false,
            }),
            religion: new FormControl({
                value: "",
                disabled: false,
            }),
            pendidikan: new FormControl({
                value: "",
                disabled: false,
            }),
            jurusan: new FormControl({
                value: "",
                disabled: false,
            }),
            martial_status: new FormControl({
                value: "",
                disabled: false,
            }),
            status_karyawan: new FormControl({
                value: "",
                disabled: false,
            }),
            tgl_masuk: new FormControl({
                value: "",
                disabled: false,
            }),
            telp: new FormControl({
                value: "",
                disabled: false,
            }),
            phone2: new FormControl({
                value: "",
                disabled: false,
            }),
            status_pajak: new FormControl({
                value: "",
                disabled: false,
            }),
        });
    }

    async setDataForm(v) {
        let y = (await v.data) ? v.data : v;
        let z = (await v.email) ? v.email : v;
        console.log(y);
        await this.employeeForm.patchValue({
            nik: y.nik,
            employee_id: y.employee_id,
            employee_name: y.employee_name,
            company_name: v.id_company,
            photo: v.photo ? `${url}assets/img/user/${v.photo}` : null,
            email: v.user.email,
            phone: y.phone,
            tempatlahir: y.tempat_lahir.toString(),
            tgl_lahir: y.tgl_lahir 
                ? _moment(y.tgl_lahir).format("YYYY-MM-DD")
                : null,
            alamat: y.alamat,
            gender: y.gender,
            religion: y.religion,
            pendidikan: y.pendidikan ? y.pendidikan.toString() : null,
            jurusan: y.jurusan,
            martial_status: y.martial_status,
            status_karyawan: y.id_employee_status.toString(),
            tgl_masuk: y.tgl_masuk
                ? _moment(y.tgl_masuk).format("YYYY-MM-DD")
                : null,
            telp: y.telp,
            phone2: y.phone2,
            status_pajak: y.status_pajak !== null ? y.status_pajak.toString() : null,
        });
        // await this.setDisabled();
        await console.log(this.employeeForm.value);
    }

    uploadGambar(inputValue: any): void {
        var file: File = inputValue.target.files[0];

        var pattern = /image-*/;
        if (!file.type.match(pattern)) {
            alert("Upload Only Image");
            return;
        }
        var myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            this.employeeForm.controls.photo.setValue(myReader.result);
        };
        myReader.readAsDataURL(file);
    }

    setEnabled() {
        this.employeeForm.controls.employee_name.enable();
        this.employeeForm.controls.email.enable();
        this.employeeForm.controls.company_name.enable();
        this.employeeForm.controls.phone.enable();
        this.employeeForm.controls.tempatlahir.enable();
        this.employeeForm.controls.tgl_lahir.enable();
        this.employeeForm.controls.alamat.enable();
        this.employeeForm.controls.gender.enable();
        this.employeeForm.controls.religion.enable();
        this.employeeForm.controls.pendidikan.enable();
        this.employeeForm.controls.jurusan.enable();
        this.employeeForm.controls.martial_status.enable();
        this.employeeForm.controls.status_karyawan.enable();
        this.employeeForm.controls.tgl_masuk.enable();
        this.employeeForm.controls.telp.enable();
        this.employeeForm.controls.phone2.enable();
        this.employeeForm.controls.status_pajak.enable();
    }

    setDisabled() {
        this.employeeForm.controls.nik.disable();
        this.employeeForm.controls.employee_name.disable();
        this.employeeForm.controls.email.disable();
        this.employeeForm.controls.company_name.enable();
        this.employeeForm.controls.phone.disable();
        this.employeeForm.controls.tempatlahir.disable();
        this.employeeForm.controls.tgl_lahir.disable();
        this.employeeForm.controls.alamat.disable();
        this.employeeForm.controls.gender.disable();
        this.employeeForm.controls.religion.disable();
        this.employeeForm.controls.pendidikan.disable();
        this.employeeForm.controls.jurusan.disable();
        this.employeeForm.controls.martial_status.disable();
        this.employeeForm.controls.status_karyawan.disable();
        this.employeeForm.controls.tgl_masuk.disable();
        this.employeeForm.controls.telp.disable();
        this.employeeForm.controls.phone2.disable();
        this.employeeForm.controls.status_pajak.disable();
    }

    enableEverything() {
        this.status = "edit";
        this.setEnabled();
    }

    async setData(id) {
        this.employeeForm = await this.createForm();
        await this._employeeServ.getDataDetail(id).then((c: any) => {});
    }

    getDataPosition() {
        this._employeeServ
            .getDataPosition()
            .then((x) => (this.position = this.position.concat(x["data"])));
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

    serviceAct() {
        if (
            this.employeeForm.controls.employee_name.value &&
            this.employeeForm.controls.email.value &&
            this.employeeForm.controls.phone.value &&
            this.employeeForm.controls.tempatlahir.value &&
            this.employeeForm.controls.tgl_lahir.value &&
            this.employeeForm.controls.alamat.value &&
            this.employeeForm.controls.gender.value &&
            this.employeeForm.controls.religion.value &&
            this.employeeForm.controls.status_pajak.value &&
            this.employeeForm.controls.martial_status.value
        ) {
            this._employeeServ
                .storeEmployee(this.employeeForm.value)
                .then(async (x: any) => {
                    await global.swalsuccess("Success", x.message);
                    await this.employeeForm["controls"].employee_id.setValue(
                        x.data.employee_id
                    );

                    this.status = await "edit";

                    await this.close();
                });
        } else {
            global.swalerror(
                "Harap Isi Semua Field, Gunakan '-' Untuk Mengisi tidak ada"
            );
        }
    }

    close() {
        this.dialogRef.close();
    }
}
