import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { PenawaranService } from "../penawaran.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";

@Component({
    selector: "app-modal-history",
    templateUrl: "./modal-history.component.html",
    styleUrls: ["./modal-history.component.scss"],
})
export class ModalHistoryComponent implements OnInit {
    displayedColumns: string[] = ["no", "no_penawaran", "harga", "inserted_at", "action"];
    dataSource = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<ModalHistoryComponent>,
        private _router: Router,
        private pdfServ: PdfService,
        private _penawaranServ: PenawaranService
    ) {
        if (data) {
            this.dataSource = this.dataSource.concat(data);
        }
    }

    ngOnInit(): void {}

    async viewPenawaran(v, st) {
        const url = this._router.serializeUrl(
            this._router.createUrlTree([
                `/analystpro/${
                    st == "edit" ? "penawaran-det" : "view-penawaran"
                }/${v.id}`,
            ])
        );

        let baseUrl = window.location.href.replace(this._router.url, "");
        window.open(baseUrl + url, "_blank");
    }

    pdfPenawaran(v, t, s) {
        this._penawaranServ
            .getDataPenawaranShow(v.id)
            .then((e) =>
                t == "id"
                    ? this.pdfServ
                          .generatePdfPenawaranID(e, s)
                          .then((e) => console.log(e))
                    : this.pdfServ
                          .generatePdfPenawaranEN(e, s)
                          .then((e) => console.log(e))
            );
    }
}
