import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    Input,
    Inject,
    Output,
} from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  MomentDateModule,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { MouService } from "../mou.service";
import * as global from "app/main/global";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";

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
    selector: "app-mou-det",
    templateUrl: "./mou-det.component.html",
    styleUrls: ["./mou-det.component.scss"],
    encapsulation: ViewEncapsulation.None,
    providers: [
      {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE],
      },
      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MouDetComponent implements OnInit {

    datasent = {
        pages: 1,
        search: null,
    };
    
    idcustheader;

    datasave = {
        idcust: null,
        idsales: null,
        from: null,
        to: null,
        salesforcast: 0,
        detailmou: [
            {
                status: 'Normal',
                values: null,
                disc: null,
                id: null
            },
            {
                status: 'Urgent',
                values: null,
                disc: null,
                id: null
            },
            {
                status: 'Very Urgent',
                values: null,
                disc: null,
                id: null
            },
            {
                status: 'Custom 2 Hari',
                values: null,
                disc: null,
                id: null
            },
            {
                status: 'Custom 1 Hari',
                values: null,
                disc: null,
                id: null
            }
        ]
    }
    loading = false;
    datacust = [];
    dataemployee = [];
    datasend = {
        pages: 1,
        search: null,
        level: null,
        status: null,
        division: null,
        employeestatus: null,
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<MouDetComponent>,
        private _custServ: CustomerService,
        private _employeeServ: EmployeeService,
        private _mouServ: MouService
    ) {
     if(data){
         console.log(data);
         this.datacust = this.datacust.concat(data.customer);
         this.dataemployee = this.dataemployee.concat(data.employee);
         this.datasave.idcust = data.id_customer;
         this.datasave.from = data.start_date;
         this.datasave.to = data.end_date;
         this.datasave.idsales = data.employee.employee_id;
         this.datasave.salesforcast = data.salesforecast;
         this.idcustheader = data.id_cust_mou_header;
         data.detail.forEach((x,i) => {
             this.datasave.detailmou[i].disc = x.discount;
             this.datasave.detailmou[i].values = x.value;
             this.datasave.detailmou[i].id = x.id;
         })
     }
    }

    ngOnInit(): void{
         this.getDataCustomer();
        this.getDataEmployee();
    }

    async getDataEmployee() {
        this._employeeServ
            .getData(this.datasend)
            .then(
                (x) => (this.dataemployee = this.dataemployee.concat(x["data"]))
            )
            .then(() => {
                this.dataemployee = global.uniq(
                    this.dataemployee,
                    (it) => it.employee_id
                );
            });
    }

    async getDataCustomer() {
        await this._custServ.getDataCustomers(this.datasent).then((x) => {
            this.datacust = this.datacust.concat(x["data"]);
        });
        this.datacust = await global.uniq(
            this.datacust,
            (it) => it.id_customer
        );
    }

    async onSearchi(ev, val) {
        switch (val) {
            case "customer":
                this.datacust = await [];
                this.datasent.search = await ev.term;
                this.datasent.pages = await 1;
                await this.getDataCustomer();
                break;
            case "pic":
                this.datacust = await [];
                this.datasend.search = await ev.term;
                this.datasend.pages = await 1;
                await this.getDataEmployee();
                break;
        }
    }

    async resetAll(val) {
        switch(val){
          case 'customer':
            this.datasent.pages = 1;
            this.datasent.search = null;
            this.datacust = [];
            this.getDataCustomer();
            break;
          case 'pic':
            this.datasend.pages = 1;
            this.datasend.search = null;
            this.dataemployee = [];
            this.getDataEmployee();
            break;
        }
      }
        
  
      async onScrollToEnd(i, ev) {
          switch (ev) {
              case "pic":
                  this.datasend.pages = this.datasend.pages + 1;
                  this.getDataEmployee();
                  break;
              case "customer":
                  this.datasent.pages = this.datasent.pages + 1;
                  this.getDataCustomer();
                  break;
          }
      }
  
      getVal(ev, st) {
          console.log(ev);
      }

      async savingdata() {
        this.loading = await true;
        let a = await this.datasave.from ? _moment(this.datasave.from).format('YYYY-MM-DD') : null;
        let v = await this.datasave.to ? _moment(this.datasave.to).format('YYYY-MM-DD') : null;

        this.datasave.from = await a;
        this.datasave.to = await v;

        if(this.datasave.from && this.datasave.to && this.datasave.idsales && this.datasave.idcust){
            let disc = await this.datasave.detailmou.filter(x => x.disc);
            let values = await this.datasave.detailmou.filter(x => x.values);
            if(disc.length > 4 && values.length > 4){
                if(this.idcustheader){
                    await this._mouServ.updateDataMou(this.idcustheader, this.datasave)
                    .then((x: any) => {
                        this.loading = false;
                        if(x.success){
                            global.swalsuccess('success',x.message);
                        } else {
                            global.swalerror(x.message);
                        }
                    }).catch(e => global.swalerror('Error at Database'));
                    await this._dialogRef.close();
                } else {
                    await this._mouServ.addDataMou(this.datasave).then((x: any) => {
                        this.loading = false;
                        if(x.status){
                            global.swalsuccess('success',x.message);
                        } else {
                            global.swalerror(x.message);
                        }
                    }).catch(e => global.swalerror('Error at Database'));
                    await this._dialogRef.close();
                }
            } else {
                await global.swalerror('Please Fill Form Correctly');
                this.loading = await false;
            }
        } else {
            await global.swalerror('Please Fill Form Correctly');
            this.loading = await false;
        }
    }
    cancel(){
        this._dialogRef.close();
    }
}
