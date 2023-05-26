import {
    Component,
    OnInit,
    Optional,
    Inject,
    ViewEncapsulation,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ComplainService } from "../../../complain.service";
import * as global from "app/main/global";
import * as _moment from "moment";

@Component({
    selector: "app-informationmodalsqc",
    templateUrl: "./informationmodalsqc.component.html",
    styleUrls: ["./informationmodalsqc.component.scss"],
})
export class InformationmodalsqcComponent implements OnInit {
    setdata = [];
    datacs = [];
    datalab = [];
    dataprep = [];
    dataqc = [];

    constructor(
        public dialogRef: MatDialogRef<InformationmodalsqcComponent>,
        private _complainServ: ComplainService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (data) {
            console.log(data);
            this.getDataInfo(data);
        }
    }

    ngOnInit(): void {}

    getDataInfo(data) {
        this._complainServ
            .getDataInformation(data.id)
            .then((v: any) => {
                this.datacs = this.datacs.concat(
                    v.filter((e) => e.position == 1)
                );
                this.dataprep = this.dataprep.concat(
                    v.filter((r) => r.position == 4).
                    map(a => ({...a, f: _moment(a.inserted_at).format("x"), prep: data.status_prep}))
                );
                this.datalab = this.datalab.concat(
                    v.filter((l) => l.position == 3).
                    map(a => ({...a, f: _moment(a.inserted_at).format("x"), memo: data.memo}))
                );
                this.dataqc = this.dataqc.concat(
                    v
                        .filter((t) => t.position == 2)
                        .map((a) => ({
                            ...a,
                            f: _moment(a.inserted_at).format("x"),
                        }))
                );
            })
            .then(() => {
                this.dataqc = this.dataqc.sort((a: any, b: any) => b.f - a.f);
                this.dataprep = this.dataprep.sort((a: any, b: any) => b.f - a.f);
                this.datalab = this.datalab.sort((a: any, b: any) => b.f - a.f);
            });
    }
}
