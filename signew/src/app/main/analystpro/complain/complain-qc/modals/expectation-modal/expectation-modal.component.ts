import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
    selector: "app-expectation-modal",
    templateUrl: "./expectation-modal.component.html",
    styleUrls: ["./expectation-modal.component.scss"],
})
export class ExpectationModalComponent implements OnInit {
    dataexpectation;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ExpectationModalComponent>
    ) {
        if (data) {
            this.dataexpectation = data;
        }
    }

    ngOnInit(): void {}
}
