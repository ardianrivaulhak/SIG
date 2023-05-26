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
    selector: "app-history",
    templateUrl: "./history.component.html",
    styleUrls: ["./history.component.scss"],
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
export class HistoryComponent implements OnInit {
    datasend = {
        pages: 1,
        search: null,
        level: null,
        division: null,
        employeestatus: null,
        company: null,
        status_active: 0,
    };
    displayedColumns: string[] = [
        "no",
        "employee_name",
        "age",
        "departement",
        "division",
        "status",
        "action",
    ];
    employee = [];
    company_id;
    company_name;
    loading = true;
    total;
    pages;
    from;
    to;
    pageSize;
    bagian = [];

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
        this.messageServ.getDataCompany().subscribe((o) => {
            this.company_id = o.id;
            this.company_name = o.text;
            this.employee = [];
            this.getDataEmployee();
        });
    }

    ngOnInit(): void {
        this.getBagianData();
        this.getDataEmployee();
    }

    setPhoto(v) {
        return v.photo == null
            ? `${url}assets/img/user/user-profiles.png`
            : `${url}assets/img/user/${v.photo}`;
    }

    changingdate(v) {
        return _moment(v).format("DD/MM/YYYY");
    }

    detail(val) {
        this._router.navigateByUrl("hris/employee/" + val);
    }
    getBagianData() {
        this._hriserv.getDataBagian().then((x) => {
            let y = [];
            y = y.concat(x);
            this.bagian = this.bagian.concat(y);
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
                    (this.employee = global.uniq(
                        this.employee,
                        (it) => it.user_id
                    ))
            );
    }
}
