import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    FormArray,
    Form,
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { url, urlApi } from "app/main/url";
import { ModalAttachmentSeeComponent } from "../modal-attachment-see/modal-attachment-see.component";
import { ModalPhotoComponent } from "../../modal/modal-photo/modal-photo.component";
import { MouService } from "app/main/analystpro/master/mou/mou.service";
import * as global from "app/main/global";
import { PenawaranService } from "app/main/analystpro/penawaran/penawaran.service";
import * as _moment from 'moment';
@Component({
    selector: "app-modal-attachment-contract",
    templateUrl: "./modal-attachment-contract.component.html",
    styleUrls: ["./modal-attachment-contract.component.scss"],
})
export class ModalAttachmentContractComponent implements OnInit {
    datacontract = [];
    datamou = [];

    fileUpload = this._fb.group({
        file: "",
        fileName: "",
        type: "",
    });
    idContract;
    loadingupload = false;
    status;
    contract_no;
    idheadermou;
    nocustmou;
    datapenawaran = [];
    datepenawaran;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ModalAttachmentContractComponent>,
        private _contractServ: ContractService,
        private dialog: MatDialog,
        private _mouServ: MouService,
        private _fb: FormBuilder,
        private _cd: ChangeDetectorRef,
        private _spinner: NgxSpinnerService,
        private _penawaranServ: PenawaranService
    ) {
        if (data) {
            console.log(data);
            if (data.status == "mou") {

                this.idheadermou = data.value.id_cust_mou_header;
                this.status = data.status;
                this.nocustmou = data.value.no_cust_mou;
                this.getDataMouAttachment(data.value.id_cust_mou_header);
            } else if (data.status == 'penawaran') {
                this.idContract = data.value.id;
                this.status = "penawaran";
                this.contract_no = data.value.no_penawaran;
                this.datepenawaran = data.value.created_at;
                this.getPenawaranDetail(data.value.id);
            } else {
                this.idContract = data.value.contract_id ? data.value.contract_id : data.value.id_kontrakuji;
                this.status = data.status;
                this.contract_no = data.value.kontrakujifinder ? data.value.kontrakujifinder.contract_no : data.value.contract_no;
                this.getContractDetail(data.value.contract_id ? data.value.contract_id : data.value.id_kontrakuji);
            }
        }
    }

    ngOnInit(): void { }

    async getPenawaranDetail(data) {
        this.loadingupload = await true;
        await this._penawaranServ
            .getDataAttachment(data)
            .then((x) => (this.datapenawaran = this.datapenawaran.concat(x)));
        this.loadingupload = await false;
    }

    async getContractDetail(data) {
        this.loadingupload = await true;
        await this._contractServ
            .getDataAttachmentContract(data)
            .then((x) => (this.datacontract = this.datacontract.concat(x)));
        this.loadingupload = await false;
    }

    async uploadGambar(event) {
        if (this.status == "mou") {
            if (event.target.files.length > 0) {
                const file = await event.target.files[0];
                await this.fileUpload.patchValue({
                    file: file,
                    fileName: file.name,
                    type: "file",
                });
                await this.sendDataMou();
            }
        } else if (this.status == 'kontrak') {
            if (event.target.files.length > 0) {
                const file = await event.target.files[0];
                await this.fileUpload.patchValue({
                    file: file,
                    fileName: file.name,
                    type: "file",
                });
                await this.sendData();
            }
        } else {
            if (event.target.files.length > 0) {
                const file = await event.target.files[0];
                await this.fileUpload.patchValue({
                    file: file,
                    fileName: file.name,
                    type: "file",
                });
                await this.sendDataPenawaran();
            }
        }
    }

    openmodalphoto() {
        const dialogRef = this.dialog.open(ModalPhotoComponent, {});
        dialogRef.afterClosed().subscribe((result) => { });
    }

    sendData() {
        const formData = new FormData();
        formData.append("file", this.fileUpload.controls.file.value);
        this._contractServ
            .sendFileAttachment(formData, this.idContract)
            .then((x) => {
                this.datacontract = [];
                this.getContractDetail(this.idContract);
            });
    }

    sendDataPenawaran() {
        const formData = new FormData();
        formData.append("file", this.fileUpload.controls.file.value);
        this._penawaranServ
            .sendFileAttachment(formData, this.idContract)
            .then((x) => {
                this.datamou = [];
                this.getPenawaranDetail(this.idContract);
            });
    }

    sendDataMou() {
        const formData = new FormData();
        formData.append("file", this.fileUpload.controls.file.value);
        this._mouServ
            .sendFileAttachment(formData, this.idheadermou)
            .then((x) => {
                this.datamou = [];
                this.getDataMouAttachment(this.idheadermou);
            });
    }

    sendDataJson() { }

    async getDataMouAttachment(v) {
        await this._mouServ
            .getDataAttachment(v)
            .then((x) => (this.datamou = this.datamou.concat(x)));
        this.loadingupload = await false;
    }

    setPhoto(val) {
        return `${url}${this.contract_no}/attachment/${val.filename}`;
    }

    opendetailphoto(v) {

        let setmou =
            this.status == "mou" ? `mou/${this.nocustmou}` : this.contract_no;
        let urla = `${url}${setmou}/attachment/${v.filename}`;
        window.open(urla, "_blank");
    }

    opendetailpenawaran(v) {
        console.log(v);
        let yearforpenawaran = _moment(this.datepenawaran).format('YYYY');
        let monthforpenawaran = _moment(this.datepenawaran).format('MMMM');
        let setpenawaran =
            `penawaran/${yearforpenawaran}/${monthforpenawaran}/${this.contract_no}`;
        let urla = `${url}${setpenawaran}/attachment/${v.attachment}`;
        window.open(urla, "_blank");
    }

    async seeMore(v) {
        const dialogRef = await this.dialog.open(ModalAttachmentSeeComponent, {
            height: "auto",
            width: "auto",
            data: `${url}${this.contract_no}/attachment/${v.filename}`,
        });

        await dialogRef.afterClosed().subscribe(async (result) => { });
    }

    async Download(v) {
        this._contractServ.downloadFile(v.id).then((x) => console.log(x));
    }

    webcam() {
        const dialogRef = this.dialog.open(ModalPhotoComponent, {});
        dialogRef.afterClosed().subscribe((result) => {
            this._contractServ
                .sendImageAttachment({
                    id_contract: this.idContract,
                    contract_no: this.contract_no,
                    photo: result.c[0],
                })
                .then((x) => {
                    this.datacontract = [];
                    this.getContractDetail(this.idContract);
                });
        });
    }

    delete(v) {
        global.swalyousure("Delete").then((x) => {
            if (x.isConfirmed) {
                if (this.status == "mou") {
                    this._mouServ
                        .deleteAttachment(v.id)
                        .then((x) =>
                            global.swalsuccess("success", "delete success")
                        )
                        .then(() => {
                            this.datamou = [];
                            this.getDataMouAttachment(this.idheadermou);
                        })
                        .catch((e) => global.swalerror("Error At Database"));
                } else {
                    this._contractServ
                        .deleteAttachment(v.id_contract_attachment)
                        .then((x) =>
                            global.swalsuccess("success", "delete success")
                        )
                        .then(() => {
                            this.datacontract = [];
                            this.getContractDetail(this.idContract);
                        })
                        .catch((e) => global.swalerror("Error At Database"));
                }
            }
        });
    }
}
