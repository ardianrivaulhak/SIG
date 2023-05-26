import {
    Component,
    OnInit,
    Optional,
    Inject,
    ViewEncapsulation,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CustomerhandleService } from "app/main/analystpro/services/customerhandle/customerhandle.service";
import * as global from 'app/main/global';
@Component({
    selector: "app-modal-npwp-ktp",
    templateUrl: "./modal-npwp-ktp.component.html",
    styleUrls: ["./modal-npwp-ktp.component.scss"],
})
export class ModalNpwpKtpComponent implements OnInit {
    valuenpwpktp;
    numbernpwpktp;
    namanpwp;
    alamatnpwp;
    idcust;

    constructor(
        public dialogRef: MatDialogRef<ModalNpwpKtpComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public custhandServ: CustomerhandleService
    ) {
        if (data) {
            this.custhandServ
                .getDataDetail(data)
                .then((x: any) => (this.idcust = x[0].id_customer));
        }
    }

    ngOnInit(): void {}

    close() {
        this.dialogRef.close();
    }

    save() {
        if(this.alamatnpwp.length > 4 && this.namanpwp.length > 2 && this.numbernpwpktp.length > 14){
            let data = {
                valuenpwpktp: this.valuenpwpktp.toUpperCase(),
                numbernpwpktp: this.numbernpwpktp,
                namanpwp: this.namanpwp,
                alamatnpwp: this.alamatnpwp,
                idcust: this.idcust,
            };
            this.custhandServ.sendNpwp(data).then(e => {
              this.dialogRef.close(e)
            });
        } else {
            global.swalerror('Harap isi form pengisian dengan benar')
        }
    }
}
