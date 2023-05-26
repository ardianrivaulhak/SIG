import { Component, OnInit } from "@angular/core";
import { MenuServices } from "../menu.service";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { ContractService } from 'app/main/analystpro/services/contract/contract.service';
import { PdfService } from 'app/main/analystpro/services/pdf/pdf.service';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ModalComponentComponent } from "../modal-component/modal-component.component";
import Swal from "sweetalert2";
import { LoginService } from 'app/main/login/login.service';
import { Router } from '@angular/router';
import {MenuService} from 'app/main/analystpro/services/menu/menu.service';
@Component({
    selector: "app-menu",
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
    displayedColumns: string[] = [
        "nik",
        "menu_name",
        "create",
        "approve",
        "update",
        "delete",
        "action",
    ];
    divisiondata = [];
    mastermenu = [];
    employee_data = [];
    datasubdiv = [];
    data_app = [
        {
            id: 1,
            appname: "HRIS",
        },
        {
            id: 2,
            appname: "Analystpro",
        },
    ];
    datasendmenu = {
        pages: 1,
        search: null,
        user_id: null,
    };

    datasenddiv = {
        pages: 1,
        search: null,
    };

    datasendemployee = {
        pages: 1,
        search: null,
        id_div: null,
        status: 1
    };

    datasendsubdiv = {
        pages: 1,
        search: null,
    };

    iddiv;
    access = [];
    total: number;
    from: number;
    to: number;
    loading: boolean = true;
    pageSize: number;
    constructor(
        public menuServ: MenuServices,
        public employeeServ: EmployeeService,
        public dialog: MatDialog,
        public pdfServ: PdfService,
        public contractServ: ContractService,
        private loginServ: LoginService,
        private _router: Router,
        private _menuServ: MenuService
    ) {}

    ngOnInit(): void {
        this.getData();
        this.getDataDiv();
        this.checkme();
    }

    checkauthentication(){
        this._menuServ.checkauthentication(this._router.url).then(x => {
          if(!x.status){
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'You dont an access to this page !',
            }).then(res => {
              if(res.isConfirmed || res.isDismissed) {
                this._router.navigateByUrl('apps');
              }
            });
          } else {
            this.access = this.access.concat(x.access);
          }
        });
      }
    
    checkme(){
        this.loginServ.checking_me().then(x => {
            this.iddiv = x[0].id_bagian;
            this.datasendemployee.id_div = this.iddiv;
            this.getDataEmployee();
        })
    }

    async getValChange(c, v) {
        if (v === "employee") {
            this.datasendmenu.user_id = await c.user_id;
            this.loading = await false;
            await this.cleardatamaster();
        } else {
            await console.log(c);
        }
    }


    check() {
        return this.datasendmenu.user_id === null ? true : false;
    }

    reset(val) {
        this.cleardatamaster();
        this.loading = true;
        this.datasendmenu.user_id = null;
    }

    async onSearch(ev) {
        this.datasendemployee = await {
            pages: 1,
            search: ev.term.toUpperCase(),
            id_div: this.iddiv,
            status: 1
        };
        this.employee_data = await [];
        await this.getDataEmployee();
    }

    paginated(f) {
        this.mastermenu = [];
        this.datasendmenu.pages = f.pageIndex + 1;
        this.getData();
    }

    onScrollToEnd(d) {
        this.datasendemployee = {
            pages: this.datasendemployee.pages + 1,
            search: null,
            id_div: this.iddiv,
            status: 1
        };
        this.getDataEmployee();
    }

    setAll(v, i, c) {
        let x = {
            v: v,
            id: i.id,
            c: c,
            status: "update",
            a: {},
        };
        x.a[c] = v ? 1 : 0;
        this.swalFire(x);
    }

    swalFire(v) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                if (v.status == "update") {
                    this.menuServ.update(v.id, v.a).then((x) => {
                        this.cleardatamaster();
                        this.swalFireScess(x);
                    });
                } else if (v.status == "delete") {
                    this.menuServ.delete(v.id).then((x) => {
                        this.cleardatamaster();
                        this.swalFireScess(x);
                    });
                }
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire("Cancelled", "Your Data file is safe :)", "error");
            }
        });
    }

    cleardatamaster() {
        this.mastermenu = [];
        this.getData();
    }

    delete(v) {
        let x = {
            id: v.id,
            status: "delete",
        };
        this.swalFire(x);
    }

    swalFireScess(x) {
        return Swal.fire(
            x["status"] ? "Success" : "Fail",
            x["message"],
            x["status"] ? "success" : "error"
        );
    }

    getData() {
        this.menuServ.getData(this.datasendmenu).then((x:any) => {
                x.forEach((el) => {
                    this.mastermenu = this.mastermenu.concat({
                        id: el.id,
                        nik: el.nik,
                        division_name: el.division_name,
                        subagian: el.subagian,
                        create: el.create === 1 ? true : false,
                        update: el.update === 1 ? true : false,
                        approve: el.approve === 1 ? true : false,
                        delete: el.delete === 1 ? true : false,
                        title:
                            el.id_parent === 9
                                ? `Master ${el.title}`
                                : el.title,
                        menu_name: el.menu_name,
                        id_menu_parent: el.id_menu_parent,
                    });
                });
        });
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ModalComponentComponent, {
            width: "450px",
            data: this.datasendmenu.user_id,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result){
                this.datasendmenu.user_id = result;
                this.cleardatamaster();    
            }
        });
    }

    uniq(data,key) {
      return [
        ...new Map(
          data.map(x => [key(x),x])
        ).values()
      ]
    }

    getDataDiv() {
        this.menuServ
            .getDataDivision(this.datasenddiv)
            .then(
                (x) => (this.divisiondata = this.divisiondata.concat(x["data"]))
            );
    }

    getDataEmployee() {
        this.employeeServ
            .getData(this.datasendemployee)
            .then(
                (x) =>
                    (this.employee_data = this.employee_data.concat(x["data"]))
            ).then(() => this.employee_data = this.uniq(this.employee_data, it => it.employee_id));
    }

    getDataSubBagian() {
        this.menuServ
            .getDataSubDiv(this.datasendsubdiv)
            .then((x) => (this.datasubdiv = this.datasubdiv.concat(x["data"])));
    }
}
