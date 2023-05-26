import { Component, OnInit,  ViewEncapsulation, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../master/customers/customer.service';
import { KeuanganService } from '../keuangan.service';
import { MatTableDataSource } from "@angular/material/table";
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
 import Swal from 'sweetalert2';
 import { MatPaginator } from "@angular/material/paginator";


 export interface datasampleElement {
  no: number;
  nosample: string;
  samplename: string;
  parameter: Param[];
}

export const MY_FORMATS = {
  parse: {
      dateInput: 'LLLL'
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LLLL',
      monthYearA11yLabel: 'YYYY'
  }
};

export interface Param {
  foto: Foto[];
  jeniskemasan: string;
  paketparameter: number; 
  parameteruji: string;
  tgl_kadaluarsa: string;
  tgl_produksi: string;
  tujuanpengujian: number;
  totalpembayaran: number;
}

export interface Foto {
  id: string;
  photo: string;
}

@Component({
  selector: 'app-keuangan-det',
  templateUrl: './keuangan-det.component.html',
  styleUrls: ['./keuangan-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class KeuanganDetComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  
  displayedColumns: string[] = ["no", "nosample", "samplename",  "statuspengujian",  "price", "action"];
  total: number;
  from: number;
  to: number;

  dataFilter = {
    pages : 1,
    status : null,
    type : "paginate"
  }


  selectStatus: any;
  dataidKontrak = [];
  datasementara = [];
  idkontrakDoang = [];
  dataStatus = [
    {
      "id": 1,
      "name": "Accepted By Lab",
      "status": "LAB"

    },
    {
      "id": 2,
      "name": "Accepted By CS",
      "status": "CS"

    },
  ];
  dataHasil = {
    contract_no: '',
    invoice_no: ''
  }
  load = false;
  selectViewContract: any;
  hideViewContract = false;
  alamataxaddress = [];
  dataalamat = {
    pages: 1,
    search: null,
    id_customer: null,
  };
  tgl_faktur= null;
  tgl_jatuh_tempo= null;
  tgl_berita_acara= null;
  dataaddress = [];
  alamatcustomer = [];
  idkeuangan: any;
  indexKeuangan: any;
  idCustomer: any;
  idCP: any;
  idCustomerAddres: any;
  idAlamatPajak: any;
  id_taxaddress: any; 
  hilang = false;
  keuanganForm: FormGroup;
  datasentCustomer = {
    pages : 1,
    search : null
  }
  datasentCP = {
    pages : 1,
    search : null
  } 
  datasentTaxAddres = {
    pages : 1,
    search : null
  }
  pageindex: number;
  datasampleSemua = [];
  datasample2 = [];
  
  dataSource = new MatTableDataSource<datasampleElement>(this.datasample2);

  dataTaxAddres = [];
  datacontract = [];
  dataKeuangan = [];
  totalHarga : null;
  selectIdKeuangan =[];
    hide = true;
    btnEdit = true;
    btnSave = true;
    btnCancel = true;
    customersData = [];
    cpData = [];

    selectCustomer = 3;
    access = [];
    dataFilterContract = {
      status : "CS",
      pages : 1,
      type : "paginate",
      category : null,
      month: null,
      customers: null,
      contact_person: null
    }
    noKontrak = [];

    totalPrice : number;

  constructor(
    private _router: Router,
    private _menuServ: MenuService,
    private _masterServ: KeuanganService,
    private _customersServ: CustomerService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { 
    this.idkeuangan = this._actRoute.snapshot.params['id'];
    this.indexKeuangan = this._actRoute.snapshot.params['id'];
  }

  ngOnInit():  void {
    this.getData(); 
    this.checkauthentication(); 
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

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  async getData(){ 

    // add data
    if( this.indexKeuangan === "add"){  

      await this._masterServ.getDataDetail(this.noKontrak).then(x => {
        this.dataKeuangan = this.dataKeuangan.concat(x);  
      });           
      this.keuanganForm = await this.createLabForm(); 
      await console.log(this.dataKeuangan)

      if(this.noKontrak.length !== 0 ){  

        let word = await this.dataKeuangan[0].contract_no;
        let invoiceNumber = await word.replace("MARK","INV");
        
        await this.keuanganForm.controls.no_invoice.setValue(invoiceNumber);  

        // sample         
        await this.dataKeuangan.forEach( c  => {
          c.transactionsample.forEach((x,i) => {
            this.datasampleSemua = this.datasampleSemua.concat({ 
              idsample: x.id,
              nosample: x.no_sample,
              samplename: x.sample_name,
              statuspengujian: x.statuspengujian.name,
              price: x.price 
            });
            if(!this.total){
              this.total = x['total'];
              this.from = x['from'] - 1;
              this.to = x['to']
            } 
          });
        });
        console.log(this.datasampleSemua)
        
  
        // this.dataSource = await new MatTableDataSource<datasampleElement>(
        //   this.datasampleSemua
        // ); 

        // this.dataSource.paginator = await this.paginator; 
        // await console.log(this.datasampleSemua);

        // end sample
      
        //price
        this.totalPrice = this.datasampleSemua.map(x => x.price).reduce((a,b) => a + b)
        console.log(this.totalPrice)

        //end price
  
        this.dataalamat.id_customer = await this.dataKeuangan[0].customers_handle.customers.id_customer; 
        this.customersData = this.customersData.concat({
          id_customer: this.dataKeuangan[0].customers_handle.customers.id_customer,
          customer_name: this.dataKeuangan[0].customers_handle.customers.customer_name
        });

        this.cpData = await this.cpData.concat({
          id_cp: this.dataKeuangan[0].customers_handle.contact_person.id_cp,
          name: this.dataKeuangan[0].customers_handle.contact_person.name
        });

        await console.log(this.cpData);
        this.idCP = await this.dataKeuangan[0].customers_handle.contact_person.id_cp;
        this.idCustomerAddres = await this.dataKeuangan[0].cust_address.id_address;
        this.idAlamatPajak = await this.dataKeuangan[0].cust_tax_address.id_taxaddress;
        this.dataTaxAddres = this.dataTaxAddres.concat({
          id_taxaddress: this.dataKeuangan[0].cust_tax_address.id_taxaddress,
          address: this.dataKeuangan[0].cust_tax_address.address
        });

        await console.log(this.dataTaxAddres);
  
        this.alamatcustomer = await [];
        await this.getDataCustomerAddress();
        this.hilang = await true;  
        await this.enableForm();
      }  

      if(this.noKontrak.length < 1){
          await this.disableForm();
      } 

    }

    if(this.indexKeuangan !== "add"){
      console.log("form Edit");
      await this._masterServ.getDataDetailInvoice(this.indexKeuangan).then(x => {
        this.dataKeuangan = this.dataKeuangan.concat(x);  
      });
      await console.log(this.dataKeuangan);
      await this.dataKeuangan.forEach( x => {
        this.datasementara = this.datasementara.concat(x.invoice_detail); 
      }); 
      await console.log(this.datasementara);
       
      this.idkontrakDoang = await this.uniq(this.datasementara, it => it.sample.id_contract);
      console.log(this.idkontrakDoang);

      await this.idkontrakDoang.forEach( x => {
        this.noKontrak = this.noKontrak.concat(
          x.sample.kontrakuji.id_kontrakuji
        );
        this.datacontract = this.datacontract.concat({
          contract_no: x.sample.kontrakuji.contract_no,
          id_kontrakuji: x.sample.kontrakuji.id_kontrakuji
        });
      }); 
      await console.log(this.noKontrak); 


      this.keuanganForm = await this.createLabFormDetail();
       
        await this.keuanganForm.controls.no_invoice.setValue(
          this.dataKeuangan[0].no_invoice
        );
        await this.keuanganForm.controls.tgl_faktur.setValue(
          this.dataKeuangan[0].tgl_faktur
        );
        await this.keuanganForm.controls.tgl_jatuh_tempo.setValue(
          this.dataKeuangan[0].tgl_jatuhtempo
        );
        await this.keuanganForm.controls.tgl_berita_acara.setValue(
          this.dataKeuangan[0].tgl_berita_acara
        );

        this.tgl_faktur= this.dataKeuangan[0].tgl_faktur;
        this.tgl_jatuh_tempo= this.dataKeuangan[0].tgl_jatuhtempo;
        this.tgl_berita_acara= this.dataKeuangan[0].tgl_berita_acara;

        await console.log(this.keuanganForm.value);
        await this.dataKeuangan.forEach( xx  => {
          xx.invoice_detail.forEach((x,i) => {
            this.datasampleSemua = this.datasampleSemua.concat({  
              idsample: x.sample.id,
              nosample: x.sample.no_sample,
              samplename: x.sample.sample_name,
              statuspengujian: x.sample.statuspengujian.name,
              price: x.sample.price 
            });
          });
        });
        let dataPrice = [];
        this.datasampleSemua.forEach((x,i) => {
          this.datasample2 = this.datasample2.concat({  
            no: i+1,
            idsample: x.idsample,
            nosample: x.nosample,
            samplename: x.samplename,
            statuspengujian: x.statuspengujian,
            price: x.price 
          });
          dataPrice = dataPrice.concat(x.price);
        }); 
        await console.log(dataPrice); 
        
        this.totalHarga = dataPrice.reduce((a, b) => a + b, 0);
        console.log(this.totalHarga);

        await console.log(this.dataSource); 
        await console.log(this.datasample2); 
        
        this.dataSource = await new MatTableDataSource<datasampleElement>(
          this.datasample2
        ); 
        this.dataSource.paginator = await this.paginator; 
        await console.log(this.dataSource);


        this.dataalamat.id_customer = await this.dataKeuangan[0].customer.id_customer; 
        this.customersData = this.customersData.concat({
          id_customer: this.dataKeuangan[0].customer.id_customer,
          customer_name: this.dataKeuangan[0].customer.customer_name
        });
        this.cpData = await this.cpData.concat({
          id_cp: this.dataKeuangan[0].contactperson.id_cp,
          name: this.dataKeuangan[0].contactperson.name
        });
        await console.log(this.cpData);
        this.idCP = await this.dataKeuangan[0].contactperson.id_cp;
        this.idCustomerAddres = await this.dataKeuangan[0].cust_address.id_address;
        this.idAlamatPajak = await this.dataKeuangan[0].cust_tax_address.id_taxaddress;
        this.dataTaxAddres = this.dataTaxAddres.concat({
          id_taxaddress: this.dataKeuangan[0].cust_tax_address.id_taxaddress,
          address: this.dataKeuangan[0].cust_tax_address.address
        });
        await console.log(this.dataTaxAddres);
  
        this.alamatcustomer = await [];
        await this.getDataCustomerAddress();
        // this.hilang = await true;  
        this.hideViewContract = true;
        await this.disableForm();

    }
    await console.log(this.keuanganForm);
  }

  paginated(f){
    this.datasampleSemua = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getData();
  }

  async deleteRow(i){
    console.log(i); 
    await console.log({
        i: this.datasample2[i],
        k: this.pageindex
    });
    await this.datasample2.splice(i,1);
    this.dataSource.data = await this.datasample2;
    console.log(this.dataSource);
    console.log(this.datasample2);
  }

  

  async getValStatus(ev){
    await console.log(ev); 
    await console.log(this.selectStatus);  
    this.dataFilterContract.status = ev.status;
    console.log(this.dataFilterContract.status);
    this.datacontract = [];
    this.getDataContract();  
  }

  async getDataContract(){
    await this._masterServ.getDataKontrak(this.dataFilterContract).then(x => {
      this.datacontract = this.datacontract.concat(Array.from(x['data']));
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      } 
      console.log(this.datacontract);
      
    });
  }
  async getValKontrak(ev){
    await console.log(ev);
    this.hideViewContract = true;
    this.idkeuangan = await this.noKontrak[0]; 
    await console.log(this.idkeuangan); 
    await console.log(this.noKontrak); 
    this.datasampleSemua= await [];
    this.dataKeuangan = await [];
    this.datasample2 = await [];  
    await this.getData(); 
  }

  async getValviewKontrak(ev){
    await console.log(ev);
    await console.log(this.selectViewContract);
  }

  openView(){
    console.log(this.selectViewContract);
    var url = 'analystpro/view-contract/'+ this.selectViewContract;
    window.open(url, '_blank');
    // this._route.navigateByUrl('analystpro/view-contract/'+ this.selectViewContract);
  }

  async getDataCustomer(){
    await console.log(this.datasentCustomer)
    await this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
      this.customersData = this.customersData.concat(Array.from(x['data']));
      console.log(this.customersData);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }
    });
    // await console.log(this.dataKeuangan[0].customers_handle.customers.id_customer);
  } 
  async getValCustomer(ev){
    await console.log(ev);
    // this.idCustomer = await ev.id_customer; 
    this.dataalamat.id_customer = await ev.id_customer; 
    console.log(this.dataalamat.id_customer);
    this.alamatcustomer = [];
    await this.getDataCustomerAddress();
  } 

  
  async getDataCustomerAddress() {
    await this._masterServ
        .getDataAddressCustomer(this.dataalamat)
        .then(
            (o) =>
                (
                    this.alamatcustomer = this.alamatcustomer.concat(o["data"]) 
                )
        ); 
  }
  async getValAddress(ev){
    await console.log(ev);
    this.idCustomerAddres = ev.id_address;
  }

  getDataCP(){
    this._masterServ.getDataContactPersons(this.datasentCP).then(x => {
      this.cpData = this.cpData.concat(x['data']);
      console.log(this.cpData);
    })
  }
  async getValCP(ev){
    await console.log(ev);
    this.idCP = ev.id_cp;
  }


  getDataTaxAddres(){
    this._masterServ.getDataTaxAddress(this.datasentTaxAddres).then(x => {
      this.dataTaxAddres = this.dataTaxAddres.concat(Array.from(x['data']));
      console.log(this.dataTaxAddres);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }
    })
  }
  async getValTaxAddress(ev){
    await console.log(ev);
    this.idAlamatPajak = ev.id_taxaddress;
  }

  onScrollToEnd(e) {
    if (e === "customer") {
      this.datasentCustomer.pages = this.datasentCustomer.pages + 1; 
      this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(x['data']);
        console.log(this.customersData);
      });
    }
    if (e === "CP") {
      this.datasentCP.pages = this.datasentCP.pages + 1; 
      this.getDataCP();
    }
    if (e === "taxAddress") {
      this.datasentTaxAddres.pages = this.datasentTaxAddres.pages + 1; 
      this.getDataTaxAddres();
    }
    if (e === "no_kontrak") {
      this.dataFilterContract.pages = this.dataFilterContract.pages + 1; 
      this.getDataContract();
    }
    
  }

  getValContract(v){
    this.hilang = true;
    this.dataHasil.contract_no = ''; 
    this.dataHasil.contract_no = this.dataHasil.contract_no.concat(v.id_kontrakuji); 
    console.log(this.dataHasil);
  }

  async saveForm(){
    await console.log(this.keuanganForm); 
    await console.log(this.datasample2);
    let sample = await [];
    await this.datasample2.forEach( x => {
      sample = sample.concat(x.idsample);
    });
    await console.log(sample);

    if( this.keuanganForm.value.tgl_faktur === "" || this.keuanganForm.value.tgl_jatuh_tempo === "" || this.keuanganForm.value.tgl_berita_acara === ""  ){
      await Swal.fire({
        title: 'Data Belum Lengkap',
        text: 'Lengkapi Form Tanggal !',
        icon: 'warning', 
        confirmButtonText: 'Ok'
      });
    } else { 
      let data = await {
        no_invoice: this.keuanganForm.value.no_invoice,
        no_faktur: this.keuanganForm.value.no_faktur,
        tgl_faktur: `${this.keuanganForm.value.tgl_faktur._i.year}-${this.keuanganForm.value.tgl_faktur._i.month}-${this.keuanganForm.value.tgl_faktur._i.date}`,
        tgl_jatuh_tempo: `${this.keuanganForm.value.tgl_jatuh_tempo._i.year}-${this.keuanganForm.value.tgl_jatuh_tempo._i.month}-${this.keuanganForm.value.tgl_jatuh_tempo._i.date}`,
        tgl_berita_acara: `${this.keuanganForm.value.tgl_berita_acara._i.year}-${this.keuanganForm.value.tgl_berita_acara._i.month}-${this.keuanganForm.value.tgl_berita_acara._i.date}`,
        other_ref: this.keuanganForm.value.other_ref,
        termin: this.keuanganForm.value.termin,
        id_kontrakuji: this.noKontrak,
        idsample: sample,
        id_cust: this.dataalamat.id_customer,
        cust_penghubung: this.idCP,
        cust_addres: this.idCustomerAddres,
        no_rekening: this.keuanganForm.value.no_rekening,
        alamat_pjk: this.idAlamatPajak
      }
      await console.log(data);
      
      await this._masterServ.saveData(data).then(x => { 
        this.load = true;
        let message = {
          text: 'Data Succesfully Updated',
          action: 'Done'
        }
        setTimeout(()=>{
          this.openSnackBar(message);
          this._route.navigateByUrl('analystpro/keuangan');
          this.load = false;
        },2000)
      });
    }
  }


  async updateForm(){
    await console.log(this.keuanganForm); 
    await console.log(this.datasample2);
    let sample = await [];
    await this.datasample2.forEach( x => {
      sample = sample.concat(x.idsample);
    });
    await console.log(sample);

    if( this.keuanganForm.value.tgl_faktur === null || this.keuanganForm.value.tgl_jatuh_tempo === null || this.keuanganForm.value.tgl_berita_acara === null  ){
      await Swal.fire({
        title: 'Data Belum Lengkap',
        text: 'Lengkapi Form Tanggal !',
        icon: 'warning', 
        confirmButtonText: 'Ok'
      });
    } else { 
      let data = await {
        id_invoice: this.dataKeuangan[0].id,
        no_invoice: this.keuanganForm.value.no_invoice,
        no_faktur: this.keuanganForm.value.no_faktur,
        tgl_faktur: this.keuanganForm.value.tgl_faktur,
        tgl_jatuh_tempo: this.keuanganForm.value.tgl_jatuh_tempo,
        tgl_berita_acara: this.keuanganForm.value.tgl_berita_acara,
        other_ref: this.keuanganForm.value.other_ref,
        termin: this.keuanganForm.value.termin,
        id_kontrakuji: this.noKontrak,
        idsample: sample,
        id_cust: this.dataalamat.id_customer,
        cust_penghubung: this.idCP,
        cust_addres: this.idCustomerAddres,
        no_rekening: this.keuanganForm.value.no_rekening,
        alamat_pjk: this.idAlamatPajak
      }
      await console.log(data);
      
      await this._masterServ.updateData(data).then(x => { 
        this.load = true;
        let message = {
          text: 'Data Succesfully Updated',
          action: 'Done'
        }
        setTimeout(()=>{
          this.openSnackBar(message);
          this._route.navigateByUrl('analystpro/keuangan');
          this.load = false;
        },2000)
      });
    }
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  deleteForm(){
    console.log("delete");
  }

  async enableForm(){
    await this.getDataCustomer(); 
    await this.getDataCP();
    await this.getDataTaxAddres();
    this.hide = await  false;
    await this.keuanganForm.get('id_cust').enable();
    await this.keuanganForm.get('cust_penghubung').enable();
    await this.keuanganForm.get('cust_addres').enable();
    await this.keuanganForm.get('other_ref').enable(); 
    // this.keuanganForm.get('no_kontrak').enable();
    // this.keuanganForm.get('desc').enable();
    await this.keuanganForm.get('no_invoice').enable();
    await this.keuanganForm.get('no_faktur').enable();
    await this.keuanganForm.get('no_po').enable(); 
    await this.keuanganForm.get('alamat_pjk').enable();
    await this.keuanganForm.get('tgl_faktur').enable();
    await this.keuanganForm.get('penandatangan').enable(); 
    await this.keuanganForm.get('termin').enable();
    await this.keuanganForm.get('no_rekening').enable();
    await this.keuanganForm.get('tgl_jatuh_tempo').enable(); 
    await this.keuanganForm.get('tgl_berita_acara').enable(); 
  }

  disableForm(){
    this.hide = true;
    this.keuanganForm.get('id_cust').disable();
    this.keuanganForm.get('cust_penghubung').disable();
    this.keuanganForm.get('cust_addres').disable();
    this.keuanganForm.get('other_ref').disable();
    
    // this.keuanganForm.get('desc').disable();
    this.keuanganForm.get('no_invoice').disable();
    this.keuanganForm.get('no_faktur').disable();
    this.keuanganForm.get('no_po').disable(); 
    this.keuanganForm.get('alamat_pjk').disable();
    this.keuanganForm.get('tgl_faktur').disable();
    this.keuanganForm.get('penandatangan').disable(); 
    this.keuanganForm.get('termin').disable();
    this.keuanganForm.get('no_rekening').disable();
    this.keuanganForm.get('tgl_jatuh_tempo').disable(); 
    this.keuanganForm.get('tgl_berita_acara').disable(); 

  }


  createLabForm(): FormGroup {
       
    return this._formBuild.group({
      id_cust:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].customers_handle.customers.id_customer : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }], 
      cust_penghubung:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].customers_handle.contact_person.id_cp : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }], 
      cust_addres:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].cust_address.id_address : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }], 
      other_ref:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].desc : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }], 
      // no_kontrak: this._formBuild.array([]),
      // desc:[{
      //   value: this.idkeuangan !== "add" ? this.dataKeuangan[0].desc : '',
      //   disabled: this.idkeuangan !== "add" ? false : false
      // }], 
      no_invoice:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      no_faktur:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      no_po:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      alamat_pjk:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].cust_tax_address.id_taxaddress : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }], 
      tgl_faktur:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      penandatangan:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      termin:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      no_rekening:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      tgl_jatuh_tempo:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      tgl_berita_acara:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],

    })
  }


  createLabFormDetail(): FormGroup {
       
    return this._formBuild.group({
      id_cust:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].customer.id_customer : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }], 
      cust_penghubung:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].contactperson.id_cp : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }], 
      cust_addres:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].cust_address.id_address : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }], 
      other_ref:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].description : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }], 
      // no_kontrak: this._formBuild.array([]),
      // desc:[{
      //   value: this.idkeuangan !== "add" ? this.dataKeuangan[0].desc : '',
      //   disabled: this.idkeuangan !== "add" ? false : false
      // }], 
      no_invoice:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      no_faktur:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].no_faktur : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      no_po:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].no_po : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      alamat_pjk:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].cust_tax_address.id_taxaddress : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }], 
      tgl_faktur:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      penandatangan:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      termin:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].termin : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      no_rekening:[{
        value: this.idkeuangan !== "add" ? this.dataKeuangan[0].no_rekening : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      tgl_jatuh_tempo:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],
      tgl_berita_acara:[{
        value: this.idkeuangan !== "add" ? '' : '',
        disabled: this.idkeuangan !== "add" ? false : false
      }],

    })
  }

}
