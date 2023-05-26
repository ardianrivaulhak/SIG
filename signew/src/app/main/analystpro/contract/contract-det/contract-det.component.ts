import {
    Component,
    OnInit,
    Inject,
    ChangeDetectorRef,
    Input,
    Output,
    EventEmitter,
} from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import Swal from "sweetalert2";
import { CustomerhandleService } from "../../services/customerhandle/customerhandle.service";

@Component({
    selector: "app-contract-det",
    templateUrl: "./contract-det.component.html",
    styleUrls: ["./contract-det.component.scss"],
})
export class ContractDetComponent implements OnInit {
    datacustomerhandle = [];
    disableditcustomerhandle = true;
    telponcustomerhandle;
    phonecustomerhandle;
    emailcustomerhandle;
    toldeditcustomerhandle = false;
    idch;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _custHandleServ: CustomerhandleService,
        private _bottomsheetref: MatBottomSheetRef
    ) {
        console.log(data);
        this.datacustomerhandle = this.datacustomerhandle.concat(data);
        if(data.length > 0){
            this.telponcustomerhandle = data[0].telpnumber ? data[0].telpnumber : 'NOT SET';
            this.phonecustomerhandle = data[0].phonenumber ? data[0].phonenumber : 'NOT SET';
            this.emailcustomerhandle = data[0].email ? data[0].email : 'NOT SET';
        }
    }

    ngOnInit(): void {}

    editcustomerhandle() {
        this.toldeditcustomerhandle = true;
        this.disableditcustomerhandle = false;
    }

    canceleditcustomerhandle() {
        this.toldeditcustomerhandle = false;
        this.disableditcustomerhandle = true;
    }

    closesession(){
        this._bottomsheetref.dismiss()
    }

    saveditcustomerhandle() {
        let data = {
            telp: this.telponcustomerhandle,
            phone: this.phonecustomerhandle,
            email: this.emailcustomerhandle,
        };
        Swal.fire({
            title: "Are you sure?",
            text: "You will Save this Data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Save!",
            cancelButtonText: "No, Cancel It",
        }).then((result) => {
            if (result.value) {
                this._custHandleServ
                    .updateDataCustomerHandle(this.datacustomerhandle[0].idch, data)
                    .then((x) => {
                        if (x["success"]) {
                            setTimeout(() => {
                                this.toldeditcustomerhandle = false;
                                this.disableditcustomerhandle = true;
                                this.datacustomerhandle = [];
                                this.getdatacustomerhandledetail();
                                Swal.fire({
                                    title: "Success Saving Customer handle",
                                    icon: "success",
                                    confirmButtonText: "Ok",
                                });
                                this._bottomsheetref.dismiss();
                            }, 1000);
                        } else {
                            Swal.fire({
                                title: "Data GAGAL di Update",
                                text: "Harap Hubungi Pihak IT",
                                icon: "warning",
                                confirmButtonText: "Ok",
                            });
                        }
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "Your File is Not Updated :)", "error");
            }
        });
    }

    async getdatacustomerhandledetail() {
        await this._custHandleServ
            .getDataDetail(this.idch)
            .then((x) => {
                this.datacustomerhandle = this.datacustomerhandle.concat(x);
            })
            .then(() => {
                this.telponcustomerhandle = this.datacustomerhandle[0].telp
                    ? this.datacustomerhandle[0].telp
                    : "NOT SET";
                this.phonecustomerhandle = this.datacustomerhandle[0].phone
                    ? this.datacustomerhandle[0].phone
                    : "NOT SET";
                this.emailcustomerhandle = this.datacustomerhandle[0].email
                    ? this.datacustomerhandle[0].email
                    : "NOT SET";
            });
    }
}
