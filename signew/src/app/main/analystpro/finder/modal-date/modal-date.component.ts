import { Component, OnInit } from "@angular/core";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MatDatepickerInputEvent,
    MatCalendarCellCssClasses,
} from "@angular/material/datepicker";
import * as XLSX from "xlsx";
import {
    MomentDateModule,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";
import * as global from "app/main/global";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
export const MY_FORMATS = {
    parse: {
        dateInput: "LL",
    },
    display: {
        dateInput: "DD/MM/YYYY",
        monthYearLabel: "YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "YYYY",
    },
};

@Component({
    selector: "app-modal-date",
    templateUrl: "./modal-date.component.html",
    styleUrls: ["./modal-date.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class ModalDateComponentFinder implements OnInit {
    from;
    to;
    loadingprev = false;
    constructor(private _contractServ: ContractService) {}

    ngOnInit(): void {}

    setDate() {
        this.loadingprev = true;
        if (this.from && this.to) {
            this._contractServ
                .getDataExcelSales(
                    _moment(this.from).format("YYYY-MM-DD"),
                    _moment(this.to).format("YYYY-MM-DD")
                )
                .then(async (x) => {
                    
                    let data = await [];
                    let dataexcel = await [];
                    data = await data.concat(x);
                    await data.forEach((o, i) => {

                        let biayapeng =  o.totalpembayaransample;
                        let sampling = o.totalakg ? parseInt(o.totalakg) : 0;
                        let akg = o.totalsampling ? parseInt(o.totalsampling) : 0;
                        let subtotal = (biayapeng  - o.discount_lepas) + akg + sampling;

                        dataexcel = dataexcel.concat({
                            no: i + 1,
                            customer_name: o.customer_name ? o.customer_name : '-',
                            contact_person: o.cp ? o.cp : '-',
                            employee: o.employee_name,
                            contract_no: o.contract_no,
                            tgl_input: o.tgl_input ? o.tgl_input.split(' ')[0] : '-',
                            tgl_selesai: o.tgl_selesai ? o.tgl_selesai.split(' ')[0] : '-',
                            desc: o.desc ? o.desc : "-",
                            no_po: o.no_po,
                            no_penawaran: o.no_penawaran,
                            biaya_pengujian: o.totalpembayaransample,
                            discount_lepas: o.discount_lepas,
                            subtotal: o.subtotal,
                            status: o.status == 1 ? 'Approved' : 'Pending',
                            pic_sales: o.pic_sales ? o.pic_sales : '-'
                        });
                    });
                    const filename = await `Data From ${_moment(
                        this.from
                    ).format("DD/MM/YYYY")} To ${_moment(this.to).format(
                        "DD/MM/YYYY"
                    )}.xlsx`;
                    const ws: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(
                        dataexcel
                    );
                    const wb: XLSX.WorkBook = await XLSX.utils.book_new();
                    await XLSX.utils.book_append_sheet(wb, ws, `Data`);
                    await XLSX.writeFile(wb, filename);
                })
                .then(() => this.loadingprev = false);
        }
    }
}
