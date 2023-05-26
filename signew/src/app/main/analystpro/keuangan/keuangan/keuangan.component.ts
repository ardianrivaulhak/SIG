import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { Sort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import * as html2pdf from 'html2pdf.js';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { ModalDateKeuanganComponent } from "../modal-date-keuangan/modal-date-keuangan.component";
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import { KeuanganService } from '../keuangan.service';

@Component({
  selector: 'app-keuangan',
  templateUrl: './keuangan.component.html',
  styleUrls: ['./keuangan.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class KeuanganComponent implements OnInit {
  loadingfirst = true;
  total: number;
  from: number;
  to: number;
  pages = 1;
  datasent = {
    pages : 1,
    search : null,
    typeContract: null
  }
  dataExcel = [];
  searchFilter = false;
  datasementara=[];
  dataCategory = [];
  dataUser = [];
  dataInvoce = [];
  dataCustomer = [];
  dataTglfaktur = [];
  exportExcelTgl = null;
  dataTgljatuhtempo = [];
  dataContract =[];
  dataFilter={
    page: 1,
    type: null,
    user: null,
    invoice: null,
    customer: null,
    tglfaktur: null,
    tgljatuhtempo: null,
    contract: null
  };
  idkontrakDoang = [];
  selectStatus = 0;
  dataStatus = [
    {
      "id": 0,
      "name": "Accepted By Lab",
      "status": "LAB"

    },
    {
      "id": 1,
      "name": "Accepted By CS",
      "status": "CS"

    },
  ];
  displayedColumns: string[] = [ 
    'no_invoice', 
    'nama_prisipal', 
    'no_po',
    'tgl_faktur',
    'tgl_jthTempo',
    'other_ref', 
    'action'
  ];
  displayedColumnsPDF: string[] = ['no', 'sample_name', 'status', 'harga_satuan', 'jumlah'];
  dataKeuangan = [];
  tglExcel: number;
  dataSource: any = [
    {
      "sample_name": "SONIA - SMOKED BEEF BRISKET",
      "status": "Normal",
      "harga_satuan": "385000",
      "jumlah": "385000"
    },
    {
      "sample_name": "SONIA - SMOKED BEEF BRISKET",
      "status": "Normal",
      "harga_satuan": "385000",
      "jumlah": "385000"
    }
  ];
  access = []; 
  dataidKontrak = [];
  datasentCategory = {
    pages : 1,
    search : null,
    typeContract: null
  }
  dataSent = {
    status : 0,
    pages : 1,   
    customers: null,
    contact_person: null,
    user: null,
    category: null,
    invoice: null,
    faktur: null,
    no_po: null,
    tglfaktur: null,
    tgl_jatuhtempo: null,
    contract: null,
    search : null
  }
  

  @ViewChild('invoiceKeungan', {static: false}) invoiceKeungan: ElementRef;

  constructor(
    private _masterServ: KeuanganService,
    private _router: Router,
    private dialog: MatDialog,
    private _menuServ: MenuService
  ) { }

  ngOnInit(): void {
    console.log(this.dataSource);
    this.checkauthentication();
    this.getData();
    this.getUser();
    this.getInvoce();
    this.getCustomer();
    this.getTglfaktur();
    this.getTgljatuhtempo();
    this.getContract();
    this.getCategory();
  }

  async getData(){
    await this._masterServ.getData(this.dataSent).then(x => {
      this.dataKeuangan = this.dataKeuangan.concat(Array.from(x['data']));
      this.dataKeuangan = this.uniq(this.dataKeuangan, (it) => it.id);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      } 
      console.log(this.dataKeuangan);
    });
    this.loadingfirst =  await false;
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }
 

  getUser(){
    let data = {
      type: "user",
      user: null
    }
    console.log(data);
    this._masterServ.selectFilterData(data).then(x => {
      console.log("select Succses");
      this.dataUser = this.dataUser.concat(Array.from(x['data']));
    });
  }
  getValUser(ev){
    console.log(ev);
    this.dataKeuangan = [];
    this.dataSent.user = ev.user_id;
    this.getData();
  }

  getInvoce(){
    let data = {
      type: "invoice",
      invoce: null
    }
    console.log(data);
    this._masterServ.selectFilterData(data).then(x => {
      console.log("select Succses");
      this.dataInvoce = this.dataInvoce.concat(Array.from(x['data']));
    });
  }
  getValInvoce(ev){
    console.log(ev);
    this.dataKeuangan = [];
    this.dataSent.invoice = ev.no_invoice;
    this.getData();
  }

  getCustomer(){
    let data = {
      type: "customer",
      customer: null
    }
    console.log(data);
    this._masterServ.selectFilterData(data).then(x => {
      console.log("select Succses");
      this.dataCustomer = this.dataCustomer.concat(Array.from(x['data']));
    });
  }
  getValCustomer(ev){
    console.log(ev);
    this.dataKeuangan = [];
    this.dataSent.customers = ev.id_customer;
    this.getData();
  }

  getCategory(){  
    this._masterServ.getDataContractCategory(this.datasentCategory).then(x => {
      this.dataCategory = this.dataCategory.concat(Array.from(x['data']));
      console.log(this.dataCategory);
    });
  }
  getValCategory(ev){
    console.log(ev);
    this.dataKeuangan = [];
    this.dataSent.category = ev.category_code;
    this.getData();
  }

  getTglfaktur(){
    let data = {
      type: "tglfaktur",
      tglfaktur: null
    }
    console.log(data);
    this._masterServ.selectFilterData(data).then(x => {
      console.log("select Succses");
      this.dataTglfaktur = this.dataTglfaktur.concat(Array.from(x['data']));
    });
  }
  getValTglfaktur(ev){
    console.log(ev);
    this.dataKeuangan = [];
    this.dataSent.tglfaktur = ev.tgl_faktur;
    this.getData();
  }

  getTgljatuhtempo(){
    let data = {
      type: "tgljatuhtempo",
      tgljatuhtempo: null
    }
    console.log(data);
    this._masterServ.selectFilterData(data).then(x => {
      console.log("select Succses");
      this.dataTgljatuhtempo = this.dataTgljatuhtempo.concat(Array.from(x['data']));
    });
  }
  getValTgljatuhtempo(ev){
    console.log(ev);
    this.dataKeuangan = [];
    this.dataSent.tgl_jatuhtempo = ev.tgl_jatuhtempo;
    this.getData();
  }

  getContract(){ 
    let data = {
      type: "contract",
      contract: null
    }
    console.log(data);
    this._masterServ.selectFilterData(data).then(x => {
      console.log("select Succses");
      this.dataContract = this.dataContract.concat(Array.from(x['data']));
    });
  }
  getValContract(ev){
    console.log(ev);
    this.dataKeuangan = [];
    this.dataSent.contract = ev.contract_no;
    this.getData();
  }


   async getValStatus(ev){
    await console.log(ev); 
    await console.log(this.selectStatus);  
    this.dataSent.status =  this.selectStatus;
    this.datasementara = [];
    this.idkontrakDoang = [];
    this.dataKeuangan = [];
    this.getData();
  }

  checkauthentication(){
    this._menuServ.checkauthentication(this._router.url).then(x => {
      if(!x.status){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You dont an access to this page !',
        }).then(res => {
          if(res.isConfirmed || res.isDismissed) {
            this._router.navigateByUrl('apps');
          }
        });
      } else {
        this.access = this.access.concat(x.access);
      }
    });
  }

  previewInvoice(){
    console.log("buat PDF");
    var opt = {
      margin:       0.2,
      filename:     'Invoice Keuangan.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 }, 
      pagebreak:     { mode: 'avoid-all', before: '#break' },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    }; 

    html2pdf().set(opt).from(this.invoiceKeungan.nativeElement).toPdf().save();     
    
  }

  downloadExcel(){
    console.log(this.tglExcel);
    this.dataExcel = []; 
    this._masterServ.getDataExportExcel(this.tglExcel).then(x => {
      console.log(x);   
      this.dataExcel = this.dataExcel.concat(x);
      console.log(this.dataExcel);

        const fileName = 'formatFaktur.xlsx'; 
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'data');  

        XLSX.writeFile(wb, fileName);
    });
  }

  gotoModulExcel(){
    let dialogCust = this.dialog.open(ModalDateKeuanganComponent, {
      height: "auto",
      width: "500px"
    });
    dialogCust.afterClosed().subscribe(async ( result) => {
      await console.log(result); 
      this.tglExcel = await result.c;
      await this.downloadExcel();
    }); 
  }


  sortData(sort: Sort) {
    const data = this.dataKeuangan.slice();
    if ( !sort.active || sort.direction === '') {
      this.dataKeuangan = data;
      return;
    }
    this.dataKeuangan = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {  
 
        case 'no_invoice': return this.compare(a.no_invoice, b.no_invoice, isAsc);
        case 'nama_prisipal': return this.compare(a.customer_name, b.customer_name, isAsc); 
        case 'no_po': return this.compare(a.no_po, b.no_po, isAsc);
        case 'tgl_faktur': return this.compare(a.tgl_faktur, b.tgl_faktur, isAsc);
        case 'tgl_jthTempo': return this.compare(a.tgl_jatuhtempo, b.tgl_jatuhtempo, isAsc);
        case 'user': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'other_ref': return this.compare(a.other_ref, b.other_ref, isAsc); 
        
        default: return 0; 
      }
    });
  }
  
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onSearchChange(ev){
    this.dataKeuangan = [];
    this.datasent.search = ev;
    this.getData();
  }

  paginated(f){
    this.dataKeuangan = [];
    this.datasent.pages = f.pageIndex + 1;
    // this.getData();
  }

  clickFilter(param)
  {   
      this.searchFilter = param
      if(this.searchFilter == false){
        this.dataKeuangan = [];
        this.getData();
      } 
      
  }

}
