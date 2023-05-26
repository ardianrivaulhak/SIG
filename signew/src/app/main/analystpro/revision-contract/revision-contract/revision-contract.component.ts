import { Component, OnInit } from "@angular/core";
import { ContractService } from "../../services/contract/contract.service";
import { MenuService } from "app/main/analystpro/services/menu/menu.service";
import { ContractcategoryService } from "../../services/contractcategory/contractcategory.service";
import { ContactPersonService } from "../../master/contact-person/contact-person.service";
import { CustomerService } from "../../master/customers/customer.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { times } from "lodash";
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
    selector: "app-revision-contract",
    templateUrl: "./revision-contract.component.html",
    styleUrls: ["./revision-contract.component.scss"],
})
export class RevisionContractComponent implements OnInit {
    customer = [];

    dataMount = [
        {
            id: 1,
            title: "January",
        },
        {
            id: 2,
            title: "February",
        },
        {
            id: 3,
            title: "March",
        },
        {
            id: 4,
            title: "April",
        },
        {
            id: 5,
            title: "May",
        },
        {
            id: 6,
            title: "June",
        },
        {
            id: 7,
            title: "July",
        },
        {
            id: 8,
            title: "August",
        },
        {
            id: 9,
            title: "September",
        },
        {
            id: 10,
            title: "October",
        },
        {
            id: 11,
            title: "November",
        },
        {
            id: 12,
            title: "December",
        },
    ];
    contractcategory = [];
    contactperson = [];
    contract = [];

    datasent = {
        pages: 1,
        search: null,
        typeContract: null,
    };
    datasentCustomer = {
        pages: 1,
        search: null,
        typeContract: null,
    };
    datasentCP = {
        pages: 1,
        search: null,
        typeContract: null,
    };

    status = [
      {
          id: 1,
          title: "Accepted",
          status: "accepted",
      },
      {
          id: 2,
          title: "Not Accepted",
          status: "not accepted",
      },
  ];

    dataFilter = {
        status: null,
        pages: 1,
        type: "revisi",
        category: null,
        month: null,
        customers: null,
        contact_person: null,
    };

    total: number;
    from: number;
    to: number;
    access = [];
    loading = false;
    constructor(
        private _contractServ: ContractService,
        private _menuServ: MenuService,
        private _router: Router,
        private _kontrakategori: ContractcategoryService,
        private _customerServ: CustomerService,
        private _cpServ: ContactPersonService,
        private _fuseConfigService: FuseConfigService,

    ) {
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
          };
    }

    ngOnInit(): void {
        this.checkauthentication();
        this.getDataContractCategory();
        this.getDataCustomer();
        this.getDataCP();
    }

    onSearchChange(ev){
      console.log(ev);
    }

    onsearchselect(ev, val) {
        if (val === "cp") {
            this.contactperson = [];
            this.datasentCP.search = ev.term;
            this.datasentCP.pages = 1;
            this.getDataCP();
        } else if (val === "cust") {
            this.customer = [];
            this.datasentCustomer.search = ev.term;
            this.datasentCustomer.pages = 1;
            this.getDataCustomer();
        }
    }

    onScrollToEnd(e) {
        this.loading = true;
        if (e === "customer") {
            this.datasentCustomer.pages = this.datasentCustomer.pages + 1;
            this.getDataCustomer();
        } else if (e === "CP") {
            this.datasentCP.pages = this.datasentCP.pages + 1;
            this.getDataCP();
        }
        setTimeout(() => {
            this.loading = false;
        }, 200);
    }

    async getDataContractCategory() {
        await this._kontrakategori
            .getDataContractCategory(this.datasent)
            .then((x) => {
                this.contractcategory = this.contractcategory.concat(x["data"]);
            })
            .then(
                () =>
                    (this.contractcategory = this.uniq(
                        this.contractcategory,
                        (it) => it.id
                    ))
            );
    }

    getDataCustomer() {
        this._customerServ
            .getDataCustomers(this.datasentCustomer)
            .then((x) => {
                this.customer = this.customer.concat(x["data"]);
            })
            .then(
                () =>
                    (this.customer = this.uniq(
                        this.customer,
                        (it) => it.id_customer
                    ))
            );
    }

    getValStatus(ev) {
        this.dataFilter.status = ev.status;
        this.contract = [];
        this.getData();
    }

    getValCategory(ev) {
      this.dataFilter.category = ev.id;
      this.contract = [];
      this.getData();
  }

    reset(e) {
        if (e === "Category") {
            this.dataFilter.category = null;
            this.contract = [];
            this.getData();
        } else if (e === "customer") {
            this.dataFilter.customers = null;
            this.contract = [];
            this.getData();
        } else if (e === "CP") {
            this.dataFilter.contact_person = null;
            this.contract = [];
            this.getData();
        } else if (e === "Mount") {
            this.dataFilter.month = null;
            this.contract = [];
            this.getData();
        } else if (e === "Status") {
            this.dataFilter.status = "not accepted";
            this.contract = [];
            this.getData();
        }
    }

    getValMount(ev) {
        this.dataFilter.month = ev.id;
        this.contract = [];
        this.getData();
    }

    getValCust(ev) {
        this.dataFilter.customers = ev.id_customer;
        this.contract = [];
        this.getData();
    }

    getValCP(ev) {
        this.dataFilter.contact_person = ev.id_cp;
        this.contract = [];
        this.getData();
    }

    getDataCP() {
        this._cpServ
            .getDataContactPersons(this.datasentCP)
            .then((x) => {
                this.contactperson = this.contactperson.concat(x["data"]);
            })
            .then(
                () =>
                    (this.contactperson = this.uniq(
                        this.contactperson,
                        (it) => it.id_cp
                    ))
            );
    }

    checkauthentication() {
        this._menuServ.checkauthentication(this._router.url).then((x) => {
            console.log(x);
            if (!x.status) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "You dont an access to this page !",
                }).then((res) => {
                    if (res.isConfirmed || res.isDismissed) {
                        this._router.navigateByUrl("apps");
                    }
                });
            } else {
                this.access = this.access.concat(x.access);
            }
        }).then(()=> this.getData());
    }

    async getData() {
        await this._contractServ
            .getData(this.dataFilter)
            .then((x) => {
                this.contract = this.contract.concat(Array.from(x["data"]));
                if (!this.total) {
                    this.total = x["total"];
                    this.from = x["from"] - 1;
                    this.to = x["to"];
                }
            })
            .then(
                () =>
                    (this.contract = this.uniq(
                        this.contract,
                        (it) => it.id_kontrakuji
                    ))
            );
    }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }
}
