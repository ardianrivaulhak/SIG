import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
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
import { LabPengujianService } from '../lab-pengujian.service';
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
    selector: "app-modal-information",
    templateUrl: "./modal-information.component.html",
    styleUrls: ["./modal-information.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class ModalInformationComponent implements OnInit {

    dataInformation = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<ModalInformationComponent>,
        private _labTransactionServ: LabPengujianService
    ) {
        if (data) {
            console.log(data)
            this.getDataInfo(data);
        }
    }

    ngOnInit(): void {}


    getDataInfo(v){
        let valas = 0;
        if(v.infotransaction.id_transaction_parameter){
            valas = v.infotransaction.id_transaction_parameter;
        } else if(v.infotransaction.id_transaction_parameter?.value){
            valas = v.infotransaction.id_transaction.value;
        } else {
            valas = v.infotransaction.id;
        }

        this._labTransactionServ.getInfoData(valas).then((x: any) => {
            console.log(x);
        if(x.labcome){
                this.dataInformation = this.dataInformation.concat({
                    status: 0,
                    inserted_at: x.labcome.inserted_at,
                    user: x.labcome.employee_name
                })
        } 
        if(x.labprocess) {
                this.dataInformation = this.dataInformation.concat({
                    status: 1,
                    inserted_at: x.labprocess.inserted_at,
                    user: x.labprocess.employee_name
                })
        } 
        
        if(x.labdone) {
            this.dataInformation = this.dataInformation.concat({
                status: 2,
                inserted_at: x.labdone.inserted_at,
                user:x.labdone.employee_name,
            })
        } 
    })
    }
}
