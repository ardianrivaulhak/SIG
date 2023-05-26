import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    Optional,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as global from "app/main/global";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";
import { Inject } from "@angular/core";
import { MouService } from "app/main/analystpro/master/mou/mou.service";
import * as _moment from "moment";
import { CustomerhandleService } from "app/main/analystpro/services/customerhandle/customerhandle.service";

// @ts-ignore
@Component({
    selector: "app-add-customer-npwp",
    templateUrl: "./add-customer-npwp.component.html",
    styleUrls: ["./add-customer-npwp.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class AddCustomerNpwp implements OnInit {
    valuenpwpktp;
    numbernpwpktp;
    namanpwp;
    alamatnpwp;
    idcust;

    constructor(
        public dialogRef: MatDialogRef<AddCustomerNpwp>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public custhandServ: CustomerhandleService
    ) {
        if (data) {
            this.custhandServ.getDataDetail(data);

            this.idcust = data;
            console.log(this.idcust);
        }
    }

    ngOnInit(): void {}

    close() {
        this.dialogRef.close();
    }

    save() {
        try {
            if (
                this.alamatnpwp.length > 4 &&
                this.namanpwp.length > 2 &&
                this.numbernpwpktp.length > 14
            ) {
                let data = {
                    valuenpwpktp: this.valuenpwpktp.toUpperCase(),
                    numbernpwpktp: this.numbernpwpktp,
                    namanpwp: this.namanpwp,
                    alamatnpwp: this.alamatnpwp,
                    idcust: this.idcust,
                };
                this.custhandServ.sendNpwp(data).then((e) => {
                    this.dialogRef.close(e);
                });
            } else {
                global.swalerror("Harap isi form pengisian dengan benar");
            }
        } catch (error) {
            console.log(error);
        }
    }
}
