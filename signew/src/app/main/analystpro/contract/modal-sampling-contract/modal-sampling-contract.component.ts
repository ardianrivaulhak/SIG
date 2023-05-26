import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { SamplingService } from "../../master/sampling/sampling.service";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatTable } from "@angular/material/table";
import * as global from "app/main/global";
import { EmployeeService } from "app/main/hris/employee/employee.service";
@Component({
    selector: "app-modal-sampling-contract",
    templateUrl: "./modal-sampling-contract.component.html",
    styleUrls: ["./modal-sampling-contract.component.scss"],
})
export class ModalSamplingContractComponent implements OnInit {
    @ViewChild("table") MatTable: MatTable<any>;
    employeeModel;
    metodeModel;
    kondisiModel;
    lokasiModel;
    employee = [];
    datasendEmployee = {
        pages: 1,
        search: null,
        level: null,
        division: null,
        employeestatus: null,
    };
    datasampling = [];
    selectdatasample;
    datasend = {
        page: 1,
        search: null,
    };
    jumlah: number;
    displayedColumns: string[] = [
        "no",
        "samplingname",
        "price",
        "jumlah",
        "total",
        "select",
    ];
    samplingchoose = [];
    samplingcombine = [];
    valuechoose = [];
    samplingtotal: number = 0;
    idContract;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private employeeServ: EmployeeService,
        private _samplingServ: SamplingService,
        private _dialogRef: MatDialogRef<ModalSamplingContractComponent>
    ) {
        if (data) {
            this.idContract = data;
            this.setData(data);
        }
        this._dialogRef.backdropClick().subscribe((v) => {
            this.closeModal();
        });
    }

    ngOnInit(): void {
        this.getSampling();
        this.getDataEmployee();
    }

    resetfield() {
        this.datasendEmployee = {
            pages: 1,
            search: null,
            level: null,
            division: null,
            employeestatus: null,
        };
    }

    async onSearchi(ev, status) {
        await this.resetfield();
        this.datasendEmployee.search = await ev.term.toUpperCase();
        this.employee = await [];
        await this.getDataEmployee();
    }

    reset() {
        console.log("as");
    }

    onScrollToEnd(e) {
        this.datasendEmployee.pages = this.datasendEmployee.pages + 1;
        this.datasendEmployee.search = null;
        this.getDataEmployee();
    }

    getValue(ev, st) {
        console.log(st);
    }

    async getDataEmployee() {
        await this.employeeServ.getData(this.datasendEmployee).then((x) => {
            x["data"].forEach((u) => {
                this.employee = this.employee.concat({
                    employee_id: u.employee_id,
                    employee_name: u.employee_name,
                });
            });
        });
        this.employee = global.uniq(this.employee, (it) => it.employee_id);
    }

    async getSampling() {
        await this._samplingServ.getData(this.datasend).then((x) => {
            this.datasampling = this.datasampling.concat(x["data"]);
        });
    }

    getValDataSampling(ev) {
        this.samplingchoose = [];
        this.samplingchoose = this.samplingchoose.concat(ev);
    }

    async setData(d) {
        await this._samplingServ.getDataDetailContract(d).then((x: any) => {
            x.forEach((e) => {
                this.samplingcombine = this.samplingcombine.concat({
                    id: e.samplingmaster ? e.samplingmaster.id : e.id,
                    sampling_name: e.samplingmaster
                        ? e.samplingmaster.sampling_name
                        : e.sampling_name,
                    price: e.samplingmaster ? e.samplingmaster.price : e.price,
                    desc: e.samplingmaster ? e.samplingmaster.desc : e.desc,
                    jumlah: e.jumlah,
                    total: e.total,
                });
            });
            this.metodeModel = x[0].metode;
            this.lokasiModel = x[0].location;
            this.employeeModel = x[0].pic;
            this.kondisiModel = x[0].kondisi_lingkungan;
            this.MatTable.renderRows();
        });
        this.samplingtotal =
            (await this.samplingcombine.length) > 0
                ? this.samplingcombine
                      .map((t) => t.total)
                      .reduce((a, b) => a + b)
                : 0;
    }

    async satuin() {
        await this.samplingchoose.forEach((x, i) => {
            this.samplingcombine = this.samplingcombine.concat({
                id: x.id,
                sampling_name: x.sampling_name,
                price: x.price,
                desc: x.desc,
                jumlah: this.jumlah,
                total: parseInt(x.price) * this.jumlah,
            });
        });

        this.samplingcombine = await this.uniq(
            this.samplingcombine,
            (it) => it.id
        );

        this.samplingtotal = await this.samplingcombine
            .map((t) => t.total)
            .reduce((a, b) => a + b);
    }

    deleterow(v) {
        this.samplingcombine.splice(v, 1);
        this.MatTable.renderRows();
    }

    closeModal() {
        return this._dialogRef.close({
            a: this.samplingcombine,
            b: this.samplingcombine.map((x) => x.total).reduce((a, c) => a + c),
        });
    }

    async saveData() {
        let j = await [];
        if (this.samplingcombine.length > 0) {
            await this.samplingcombine.forEach((b) => {
                j = j.concat({
                    id: b.id,
                    sampling_name: b.sampling_name,
                    price: b.price,
                    desc: b.desc,
                    jumlah: b.jumlah,
                    total: b.total,
                    metode: this.metodeModel,
                    kondisi: this.kondisiModel,
                    lokasi: this.lokasiModel,
                    employee: this.employeeModel,
                });
            });
        } else {
            j = [];
        }
        await global
            .swalyousure("Are you Sure")
            .then((d) => {
                if (d.isConfirmed) {
                    this._samplingServ
                        .saveData(j, this.idContract)
                        .then((x: any) => {
                            global.swalsuccess("success", x.message);
                        })
                        .catch((e) => global.swalerror("error at database"));
                }
            })
            .then(() => this._dialogRef.close());
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }
}
