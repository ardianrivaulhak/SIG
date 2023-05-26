import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../certificate.service';
import { DataSource } from '@angular/cdk/table';
import { dataGender } from 'app/main/hris/employee/data-select';
import { AddresslistDialogComponent } from '../addresslist-dialog/addresslist-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../../../../master/customers/customer.service';
import { TujuanpengujianService } from '../../../../services/tujuanpengujian/tujuanpengujian.service';
import * as _moment from 'moment';
import { EmployeeService } from "app/main/hris/employee/employee.service";

@Component({
  selector: 'app-formmodals',
  templateUrl: './formmodals.component.html',
  styleUrls: ['./formmodals.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class FormmodalsComponent implements OnInit {

  certificateForm: FormGroup;
  checkList = []
  load = false;
  customerData = [];
  formatData = [];
  dataSentFormat = {
    pages : 1,
    search : null
  }
  dataSampleLab = []
  dataSentTujuan = {
    pages : 1,
    search : null
  }
  datasentCust = {
    pages : 1,
    search : null
  } 
  datasentContact = {
    pages : 1,
    search : null,
    id: null
  } 
  datasentAddress = {
    pages : 1,
    search : null,
    id: null
  } 
  total: number;
  from: number;
  to: number;
  pages = 1;
  idcustomer : any;
  contactData = []
  addressData = []
 
  selectedCustomer = [];
  id_transaction = this.data.idtransactionsample
  userSamplingData = [];
  datasendEmployee = {
    pages: 1,
    search: null,
    level: null,
    division: null,
    employeestatus: null
  };
  
  constructor(
    public dialogRef: MatDialogRef<FormmodalsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certServ: CertificateService,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _matDialog: MatDialog,
    private _tujuanServ: TujuanpengujianService,
    private _custService: CustomerService,
    private _employee: EmployeeService

  ) { }

  ngOnInit(): void {
    // this.certificateForm = this.createForm();
    this.getFormat();
    this.getData();
    console.log(this.certificateForm)
  }

  async getData()
    {
        console.log(this.data.idsample)
        await this._certServ.getTransactionSample(this.data.idsample)
        .then(x => this.dataSampleLab = this.dataSampleLab.concat(x))
        .then(() => this.certificateForm = this.createForm())

        this.datasentContact = {
            pages : 1,
            search : null,
            id: this.dataSampleLab[0].customer_name
        }

        this.datasentAddress = {
            pages : 1,
            search : null,
            id: this.dataSampleLab[0].customer_name
        }
        
        await this._certServ.getSearchCustomer(this.id_transaction, this.dataSampleLab[0].customer_name).then(x => {
            this.selectedCustomer = this.selectedCustomer.concat(x);
            //this.selectedCustomer = this.uniq(this.selectedCustomer, (it) => it.id_customer);
            console.log(this.selectedCustomer[0].customer_name);
            
        })
        await console.log(this.selectedCustomer)
        this.datasentCust.search =  await this.selectedCustomer[0].customer_name;
        await console.log(this.datasentCust)

        await this.getDataCustomers();
        await this.getDataContactPerson();
        await this.getCustomerAddress()
        await this.getUserSampling();
        await console.log(this.dataSampleLab)
    }


  getFormat(){
    this._certServ.getFormat(this.dataSentFormat).then(x => {
      this.formatData = this.formatData.concat(x['data']);
      console.log(this.formatData);
    })
  }

  onScrollToEnd(e) {
    this.load = true;
    if (e === "format") {
      this.dataSentFormat.pages = this.dataSentFormat.pages + 1;
      this.getFormat();
    }
    setTimeout(() => {
        this.load = false;
    }, 200);
  }

  createForm(): FormGroup {
    return this._formBuild.group({
        format: [this.dataSampleLab[0].format, { validator: Validators.required }],
        cl_number: this.dataSampleLab[0].cl_number,
        lhu_number:[this.dataSampleLab[0].lhu_number, { validator: Validators.required }],
        customer_name:[this.dataSampleLab[0].customer_name, { validator: Validators.required }],
        customer_telp:[this.dataSampleLab[0].customer_telp, { validator: Validators.required }],
        contact_person:[this.dataSampleLab[0].contact_person, { validator: Validators.required }],
        customer_address:[this.dataSampleLab[0].customer_address, { validator: Validators.required }],
        sample_name:[this.dataSampleLab[0].sample_name, { validator: Validators.required }],
        no_sample:[this.dataSampleLab[0].no_sample, { validator: Validators.required }],
        kode_sample:[this.dataSampleLab[0].kode_sample, { validator: Validators.required }],
        batch_number:[this.dataSampleLab[0].batch_number, { validator: Validators.required }],
        tgl_input: [ _moment(this.dataSampleLab[0].tgl_input).format('YYYY-MM-DD') , { validator: Validators.required }],
        tgl_mulai:[  _moment(this.dataSampleLab[0].tgl_mulai).format('YYYY-MM-DD'), { validator: Validators.required }],
        tgl_selesai:[ _moment(this.dataSampleLab[0].tgl_selesai).format('YYYY-MM-DD'), { validator: Validators.required }],
        tgl_estimasi_lab:[this.dataSampleLab[0].tgl_estimasi_lab, { validator: Validators.required }],
        nama_pabrik:[this.dataSampleLab[0].nama_pabrik, { validator: Validators.required }],
        alamat_pabrik:[this.dataSampleLab[0].alamat_pabrik, { validator: Validators.required }],
        nama_dagang:[this.dataSampleLab[0].nama_dagang, { validator: Validators.required }],
        lot_number:[this.dataSampleLab[0].lot_number, { validator: Validators.required }],
        jenis_kemasan:[this.dataSampleLab[0].jenis_kemasan, { validator: Validators.required }],
        no_notifikasi:[this.dataSampleLab[0].no_notifikasi, { validator: Validators.required }],
        no_pengajuan:[this.dataSampleLab[0].no_pengajuan, { validator: Validators.required }],
        no_registrasi:[this.dataSampleLab[0].no_registrasi, { validator: Validators.required }],
        no_principalcode:[this.dataSampleLab[0].no_principalcode, { validator: Validators.required }],
        tgl_produksi:[this.dataSampleLab[0].tgl_produksi, { validator: Validators.required }],
        tgl_kadaluarsa:[this.dataSampleLab[0].tgl_kadaluarsa, { validator: Validators.required }],
        tgl_sampling:[this.dataSampleLab[0].tgl_sampling, { validator: Validators.required }],
        price:[this.dataSampleLab[0].price, { validator: Validators.required }],
        id_tujuanpengujian:[this.dataSampleLab[0].id_tujuanpengujian, { validator: Validators.required }],
        id_statuspengujian:[this.dataSampleLab[0].id_statuspengujian, { validator: Validators.required }],
        id_subcatalogue:[this.dataSampleLab[0].id_subcatalogue, { validator: Validators.required }],
        keterangan_lain:[this.dataSampleLab[0].keterangan_lain, { validator: Validators.required }],
        print_info:[this.dataSampleLab[0].print_info, { validator: Validators.required }],
        metode:[this.dataSampleLab[0].metode, { validator: Validators.required }],
        location:[this.dataSampleLab[0].location, { validator: Validators.required }],
        pic:[this.dataSampleLab[0].pic, { validator: Validators.required }],
        kondisi_lingkungan:[this.dataSampleLab[0].kondisi_lingkungan, { validator: Validators.required }],
        cert_info:[this.dataSampleLab[0].cert_info, { validator: Validators.required }],
        datamanual:[this.dataSampleLab[0].manual == null ? '' : this.dataSampleLab[0].manual.datamanual, { validator: Validators.required }],
        date_cert:[ new Date (this.dataSampleLab[0].date_at == null ? new Date : this.dataSampleLab[0].date_at).toISOString(), { validator: Validators.required }], 

    })
  }

  searchCustomer(ev)
    {
        console.log(ev)
        this.datasentCust.search = ev.term;
        this.datasentCust.pages = 1;
        this.getDataCustomers();
    }

    async getDataCustomers(){
        console.log(this.datasentCust)
        this._custService.getDataCustomers(this.datasentCust).then(x => {
        this.customerData = this.customerData.concat(Array.from(x['data']));
        this.customerData = this.uniq(this.customerData, (it) => it.id_customer);
        console.log(this.customerData);
        if(!this.total){
            this.total = x['total'];
            this.from = x['from'] - 1;
            this.to = x['to']
        }
        })
    }
    async getValCustomer(ev){
        await console.log(ev);
        this.idcustomer = await ev.id_customer;
        this.datasentContact = await {
            pages : 1,
            search : null,
            id: this.idcustomer
        } 
        this.datasentAddress = await {
            pages : 1,
            search : null,
            id: this.idcustomer
        } 
        await console.log(this.datasentContact)
        await console.log(this.datasentAddress)
        await this.getDataContactPerson();
        await this.getCustomerAddress();
    }

    async getValContact(ev){
        await console.log(ev);
        this.idcustomer = await ev.id_customer;
        this.datasentContact = await {
            pages : 1,
            search : null,
            id: this.idcustomer
        } 
        await console.log(this.datasentContact)
        await this.getDataContactPerson();
    }

    async getValAddress(ev){
        await console.log(ev);
        this.datasentAddress = await {
            pages : 1,
            search : null,
            id: this.idcustomer
        } 
        await console.log(this.datasentAddress)
        await this.getCustomerAddress();
    }

    async getDataContactPerson()
    {
        
        console.log(this.datasentContact)
        this.contactData = [];
        this._certServ.contactPerson(this.datasentContact).then( async x => {
            let b = [];
            b = await b.concat(Array.from(x['data']));
            console.log(b)
            await b.forEach(x => {
                if(x.contact_person != null){
                    this.contactData = this.contactData.concat({
                        id_contact : x.id_cp,
                        contact_name : x.contact_person.name
                    })
                }
               
            })
            console.log(this.contactData)
        this.contactData = this.uniq(this.contactData, (it) => it.id_contact);
         if(!this.total){
            this.total = x['total'];
            this.from = x['from'] - 1;
            this.to = x['to']
        }
        })
    }

    async getCustomerAddress(){
        console.log(this.datasentContact)
        this.addressData = [];
        this._certServ.getAddressListData(this.datasentContact).then( async x => {
            let b = [];
            b = await b.concat(Array.from(x['data']));
            console.log(b)
            await b.forEach(x => {
                this.addressData = this.addressData.concat({
                    id_address : x.id_address,
                    address : x.address
                })               
            })
            console.log(this.addressData)
            this.addressData = this.uniq(this.addressData, (it) => it.id_address);
            if(!this.total){
                this.total = x['total'];
                this.from = x['from'] - 1;
                this.to = x['to']
            }
        })
    }

    async getUserSampling(){
      console.log(this.dataSampleLab[0].pic)
      await this._employee.getDataDetail(this.dataSampleLab[0].pic).then(x => {
          console.log(x)
         this.userSamplingData = this.userSamplingData.concat(x);           
         this.userSamplingData = this.uniq(this.userSamplingData, (it) => it.employee_id);
         console.log(this.userSamplingData);
     })
  }

  async getValueUserSampling()
  {
      console.log(this.datasendEmployee)
      this.userSamplingData = await []
      await this._employee.getData(this.datasendEmployee).then(x => {
          this.userSamplingData = this.userSamplingData.concat(Array.from(x['data']));
          this.userSamplingData = this.uniq(this.userSamplingData, (it) => it.employee_id);
           console.log(this.userSamplingData);
           this.total = x['total'];
           this.from = x['from'] - 1;
           this.to = x['to']
      })
  }

  searchPIC(ev)
  {
      this.datasendEmployee.search = null
      console.log(ev)
      this.datasendEmployee.search = ev.term;
      this.datasendEmployee.pages = 1;
      this.getValueUserSampling();
  }

    uniq(data, key) {
        return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    

  saveForm()
  {  
  let z = [];
  this.checkList.forEach( 
    x => {
      console.log(x.id)
      switch (x.id) {
        case 'format':
          let a = {
                data : x.id,
                value : this.certificateForm.value.format
              }
              z.push(a)
          break;

          case 'coverletter':
          let b = {
                data : x.id,
                value : this.certificateForm.value.cl_number
              }
              z.push(b)
          break;

          case 'lhu_number':
            let c = {
                  data : x.id,
                  value : this.certificateForm.value.lhu_number
                }
                z.push(c)
            break;

            case 'customer_name':
              let d = {
                    data : x.id,
                    value : this.certificateForm.value.customer_name
                  }
                  z.push(d)
              break;

            case 'telephone':
              let e = {
                    data : x.id,
                    value : this.certificateForm.value.customer_telp
                  }
                  z.push(e)
              break;

            case 'contact_person':
              let f = {
                    data : x.id,
                    value : this.certificateForm.value.contact_person
                  }
                  z.push(f)
              break;

            // case 'contact_person':
            //   let g = {
            //         data : x.id,
            //         value : this.certificateForm.value.contact_person
            //       }
            //       z.push(g)
            //   break;

            case 'address':
              let h = {
                    data : x.id,
                    value : this.certificateForm.value.customer_address
                  }
                  z.push(h)
              break;

            case 'sample_name':
              let i = {
                    data : x.id,
                    value : this.certificateForm.value.sample_name
                  }
                  z.push(i)
              break;

            case 'sample_number':
              let j = {
                    data : x.id,
                    value : this.certificateForm.value.no_sample
                  }
                  z.push(j)
              break;

            case 'batch_number':
              let k = {
                    data : x.id,
                    value : this.certificateForm.value.batch_number
                  }
                  z.push(k)
              break;

            case 'sample_code':
              let l = {
                    data : x.id,
                    value : this.certificateForm.value.kode_sample
                  }
                  z.push(l)
              break;

            case 'tgl_mulai':
              let m = {
                    data : x.id,
                    value : _moment(this.certificateForm.value.tgl_mulai).format('YYYY-MM-DD')
                  }
                  z.push(m)
              break;

            case 'tgl_selesai':
              let n = {
                    data : x.id,
                    value : _moment(this.certificateForm.value.tgl_selesai).format('YYYY-MM-DD')
                  }
                  z.push(n)
              break;

            case 'tgl_input':
              let o = {
                    data : x.id,
                    value :  _moment(this.certificateForm.value.tgl_input).format('YYYY-MM-DD')
                  }
                  z.push(o)
              break;

            case 'factory':
              let p = {
                    data : x.id,
                    value : this.certificateForm.value.nama_pabrik
                  }
                  z.push(p)
              break;

            case 'merk':
              let q = {
                    data : x.id,
                    value : this.certificateForm.value.nama_dagang
                  }
                  z.push(q)
              break;

            case 'lot_number':
            let r = {
                  data : x.id,
                  value : this.certificateForm.value.lot_number
                }
                z.push(r)
            break;

            case 'packaging':
            let s = {
                  data : x.id,
                  value : this.certificateForm.value.jenis_kemasan
                }
                z.push(s)
            break;

            case 'factory_address':
            let t = {
                  data : x.id,
                  value : this.certificateForm.value.alamat_pabrik
                }
                z.push(t)
            break;

            case 'no_notifikasi':
              let u = {
                    data : x.id,
                    value : this.certificateForm.value.no_notifikasi
                  }
                  z.push(u)
              break;

            case 'no_pengajuan':
              let v = {
                    data : x.id,
                    value : this.certificateForm.value.no_pengajuan
                  }
                  z.push(v)
              break;

            case 'no_registrasi':
              let w = {
                    data : x.id,
                    value : this.certificateForm.value.no_registrasi
                  }
                  z.push(w)
              break;

            case 'no_principalcode':
              let y = {
                    data : x.id,
                    value : this.certificateForm.value.no_principalcode
                  }
                  z.push(y)
              break;

            case 'production_date':
              let aa = {
                    data : x.id,
                    value : this.certificateForm.value.tgl_produksi
                  }
                  z.push(aa)
              break;

            case 'expired_date':
              let ab = {
                    data : x.id,
                    value : this.certificateForm.value.tgl_kadaluarsa
                  }
                  z.push(ab)
              break;

            case 'other_information':
                let ad = {
                      data : x.id,
                      value : this.certificateForm.value.keterangan_lain
                    }
                    z.push(ad)
                break;

            case 'print_info':
                let ac = {
                      data : x.id,
                      value : this.certificateForm.value.print_info
                    }
                    z.push(ac)
                break;

            case 'sampling_date':
                let ae = {
                        data : x.id,
                        value : this.certificateForm.value.tgl_sampling
                    }
                    z.push(ae)
                break;
            case 'date_at':
                let af = {
                        data : x.id,
                        value : this.certificateForm.value.date_cert
                    }
                    z.push(af)
                break;

            case 'metode':
              let ag = {
                      data : x.id,
                      value : this.certificateForm.value.metode
                  }
                  z.push(ag)
              break;

            case 'location':
              let ah= {
                      data : x.id,
                      value : this.certificateForm.value.location
                  }
                  z.push(ah)
              break;
            
            case 'pic':
              let ai= {
                      data : x.id,
                      value : this.certificateForm.value.pic
                  }
                  z.push(ai)
              break;

            case 'kondisi_lingkungan':
              let aj= {
                      data : x.id,
                      value : this.certificateForm.value.kondisi_lingkungan
                  }
                  z.push(aj)
              break;
      
        
      
        default:
          break;
      }
       
      }
     
    );
    console.log(z)

    this._certServ.updateDataBulk(this.data, z)
    .then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.closeDialog(false);
        this.load = false;
      },1000)
    })
  }

  checkBox(ev, data){
    let z = this.checkList.filter(o => o.id == DataSource);
    console.log(z)    
      if(ev){
        if(z.length > 0){
          z[0].checked = ev
        } else {
          this.checkList = this.checkList.concat({
            id: data,
            checked : true,
          });
        }
      } else {
        let z = this.checkList.filter(x => x.id == data);
        z[0].checked = ev;
      }
      console.log(this.checkList)
  }

  addressDialog(id_transaction_sample)
  {
    const dialogRef = this._matDialog.open(AddresslistDialogComponent, {
      panelClass: 'certificate-addresslist-dialog',
      height: '300px',
      width: '100%',
      data: {idtransactionsample : id_transaction_sample}
    });
  }

   openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }


  closeDialog(v){
    return this.dialogRef.close({
      v
    });
  }


}
