import { Component, OnInit, Inject } from "@angular/core";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import * as global from "app/main/global";
@Component({
    selector: "app-modal-set-contract",
    templateUrl: "./modal-set-contract.component.html",
    styleUrls: ["./modal-set-contract.component.scss"],
})
export class ModalSetContractComponent implements OnInit {
    datasent = {
        pages: 1,
        search: null,
        status: null,
        category: null,
        month: null,
        customers: null,
        user_created: null,
    };
    contractPick = [];
    datacontract = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<ModalSetContractComponent>,
        private _contractServ: ContractService
    ) {}

    ngOnInit(): void {
        this.getDataContract();
    }

    getDataContract() {
        this._contractServ
            .getData(this.datasent)
            .then(
                (x) => (this.datacontract = this.datacontract.concat(x["data"]))
            )
            .then(
                () =>
                    (this.datacontract = global.uniq(
                        this.datacontract,
                        (it) => it.id_kontrakuji
                    ))
            )
            .then( ()=> console.log(this.datasent))
    }

    onScrollToEnd(e) {
        console.log(e)
        if(e == 'contract'){
            this.datasent.pages = this.datasent.pages + 1; 
            this.getDataContract();
        }
    }

    onSearchContract(ev) {
        console.log(ev)
        this.datasent.search = ev.term;
        this.datasent.pages = 1;
        this.datacontract = [];
        this.getDataContract();
    }

    clearSelect(ev) {
        this.datasent.pages = 1; 
        this.datasent.search = null;
        this.datacontract = [];
        this.getDataContract();
    }

    save(){
        console.log(this.contractPick)
        this._dialogRef.close(this.contractPick);
    }

    close(){
      this._dialogRef.close();
    }
}
