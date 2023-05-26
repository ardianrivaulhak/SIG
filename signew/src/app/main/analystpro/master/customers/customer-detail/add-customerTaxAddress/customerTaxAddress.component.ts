import {
    Component,
    OnInit,
    Inject,
    ViewChild,
    ElementRef,
    ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import { CustomertaxaddressService } from "app/main/analystpro/master/customertaxaddress/customertaxaddress.service";
import * as global from "app/main/global";
import Swal from "sweetalert2";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
@Component({
    selector: "app-customerTaxAddress",
    templateUrl: "./customerTaxAddress.component.html",
    styleUrls: ["./customerTaxAddress.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CustomerTaxAddress implements OnInit {
    addCustomerTaxAddress: FormGroup;
    idCustomerAddress: number;
    customer_id: number;
    address: string = "";
    desc: string = "";
    load = false;
    detaildata = [];

    @ViewChild("myDiv", { static: false }) myDiv: ElementRef;
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<CustomerTaxAddress>,
        private _route: Router,
        private _actRoute: ActivatedRoute,
        private _matDialog: MatDialog,
        private _taxAddress: CustomertaxaddressService,
        private _formBuild: FormBuilder,
        private _snackBar: MatSnackBar,
        private _custServ: CustomerService
    ) {
        if (data) {
            this.idCustomerAddress = data;
        }
    }

    ngOnInit(): void {
        console.log(this.idCustomerAddress);
        this.getCustomerDetail();
    }

    async getCustomerDetail() {
        await this._custServ
            .getDataCustomerDetail(this.idCustomerAddress)
            .then((x) => {
                this.detaildata = this.detaildata.concat(x);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    saveNewCustomerTaxAddress() {
        const data = {
            alamat: this.address,
            desc: this.desc,
            customer_id: this.idCustomerAddress,
        };

        this._taxAddress
            .addData(data)
            .then((result) => {
                let message = {
                    text: "Data Successfully Saved",
                    action: "Done",
                };
                this.dialogRef.close(); // menutup dialog setelah data berhasil ditambahkan
                this.openSnackBar(message);

                // Memperbarui data dan tampilan setelah berhasil menambahkan data
                this.getCustomerDetail().then(() => {
                    this._route.navigateByUrl(
                        `analystpro/customers/detail/${this.idCustomerAddress}`
                    );
                });
                console.log(this.getCustomerDetail(), "INI DETAIL");
                console.log(result);
            })
            .catch((error) => {
                let message = {
                    text: "Error Occurred While Saving Data",
                    action: "Close",
                };
                this.openSnackBar(message);
                console.log(error);
            });
    }

    close() {
        let message = {
            text: "Wait 2 Second",
            action: "Done",
        };
        setTimeout(() => {
            this.openSnackBar(message);
            this.dialogRef.close(); // menutup dialog setelah data berhasil ditambahkan
            this._route.navigateByUrl(
                `analystpro/customers/detail/${this.idCustomerAddress}`
            );
            this.load = false;
        }, 2000);
    }

    createCustomerForm(): FormGroup {
        return this._formBuild.group({
            address: [null, Validators.required],
            desc: [null],
            customer_id: [null, Validators.required],
        });
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }
}
