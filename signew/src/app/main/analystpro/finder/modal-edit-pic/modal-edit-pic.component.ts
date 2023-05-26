import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import * as global from "app/main/global";

@Component({
    selector: "app-modal-edit-pic",
    templateUrl: "./modal-edit-pic.component.html",
    styleUrls: ["./modal-edit-pic.component.scss"],
})
export class ModalEditPicComponent implements OnInit {
    datasales = [];
    loading = false;
    contract_id;
    clienthandling;

    disabled = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalEditPicComponent>,
        private _kontrakServ: ContractService,
        private _employeeServ: EmployeeService
    ) {
        if (data) {
            this.contract_id = data.contract_id;
            this.clienthandling = data.sales_id;
        }
    }

    ngOnInit(): void {
        this.getDataSales();
        setTimeout(() => {
            this.disabled = false;
        }, 2000);
    }

    getDataSales() {
        this._employeeServ
            .getData({ division: 6, pages: 1 })
            .then((e) => (this.datasales = this.datasales.concat(e["data"])));
    }

    async save() {
        global.swalyousure("Sending data cant be undo").then((e) => {
            if (e.isConfirmed) {
                if (this.clienthandling) {
                    this.loading = true;
                    this._kontrakServ
                        .editPIC({
                            contract_id: this.contract_id,
                            employee_id: this.clienthandling,
                        })
                        .then((e) =>
                            global
                                .swalsuccess("success", "Success Update Sales")
                                .then((e) => this.dialogRef.close())
                        );
                } else {
                    global.swalerror("Harap Isi Form terlebih dahulu");
                }
            }
        });
    }

    close() {
        this.dialogRef.close();
    }
}
