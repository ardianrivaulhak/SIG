import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlService } from '../../control.service';
import { KeuanganService } from "../../../keuangan/keuangan.service";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-backtrack',
    templateUrl: './backtrack.component.html',
    styleUrls: ['./backtrack.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class BacktrackComponent implements OnInit {


    descriptionData = [];
    backTrackForm: FormGroup;
    load = false;

    dataFilterContract = {
        pages: 1,
        type: "paginate",
        category: null,
        month: null,
        customers: null,
        contact_person: null,
        date: null,
        search: null
    }
    noKontrak = [];
    reasons = [];
    datacontract = [];
    total: number;
    from: number;
    to: number;
    idkeuangan: any;


    constructor(
        public dialogRef: MatDialogRef<BacktrackComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private _controlService: ControlService,
        private _actRoute: ActivatedRoute,
        private _formBuild: FormBuilder,
        private _snackBar: MatSnackBar,
        private _route: Router,
        private _keuServ: KeuanganService,
    ) { }

    ngOnInit(): void {
        this.getDataContract();
    }

    async getDataContract() {
        await this._keuServ.getDataKontrak(this.dataFilterContract).then(x => {
            this.datacontract = this.datacontract.concat(Array.from(x['data']));
            this.datacontract = this.uniq(this.datacontract, (it) => it.id_kontrakuji);
        });
    }

    async getValKontrak(ev) {
        await console.log(ev);
        this.idkeuangan = await this.noKontrak[0];
        await console.log(this.noKontrak);
        await this.getDataContract();
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    saveForm() {
        let a = {
            id_contract: this.noKontrak,
            reason: this.reasons
        }
        if (this.reasons.length == 0) {
            Swal.fire({
                title: 'Incomplete Data',
                text: 'reason cant be empty!',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
        } else {
            this._controlService.backTrackContract(a).then(y => {
                this.load = true;
                let message = {
                    text: 'Data Succesfully Updated',
                    action: 'Done'
                }
                setTimeout(() => {
                    this.openSnackBar(message);
                    this.closeModal(false);
                    this.load = false;
                }, 1000)
            })
        }

    }

    closeModal(ev) {
        return this.dialogRef.close({
            ev
        });
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }

    onScrollToEnd(e) {
        if (e === "no_kontrak") {
            this.dataFilterContract.pages = this.dataFilterContract.pages + 1;
            this.getDataContract();
        }

    }

    onsearchselect(ev, val) {
        if (val === "kontrak") {
            this.datacontract = [];
            this.dataFilterContract.search = ev.term;
            this.dataFilterContract.pages = 1;
            this.getDataContract();
        }
    }

}
