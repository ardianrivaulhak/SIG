
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { fuseAnimations } from '@fuse/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from "xlsx";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
import * as globals from "app/main/global";
import { MatTable } from "@angular/material/table";
import { UsercustomersService } from "../usercustomers.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AdduserComponent implements OnInit {
  regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/
  regex_email = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/  
  expansive = false;  
  editpassword = false;
  customersData = [];
  datasentCustomer = {
    pages : 1,
    search : null
  }
  totalcust : number;
  fromcust : number;
  tocust : number;
  formdata = {
    id: null,
    id_customer : null,
    name: null,
    email : null,
    password : null,
    confirm_password : null
  }
  dataform = {
    titleform : 'Add User',
    status : 1
  }
 
  
  userData = [];
  datasentuserCustomer = {
    pages : 1,
    search : null
  }
  totaluser : number;
  fromuser : number;
  touser : number;
  displayedColumns: string[] = [
    'company', 
    'name',
    'email', 
    'created_at',
    'action'];

  load = false;
  showPassword: boolean = false;
  showPasswordConfirm: boolean = false;
  iconPassword = 'visibility_off';
  iconPasswordConfirm = 'visibility_off';
  
  constructor(
    private _serv: UsercustomersService,
    private _customersServ: CustomerService,
    private _route: Router,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getDataCustomer();
    this.getDataUser();
  }

  getDataCustomer(){
    this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
      this.customersData = this.customersData.concat(Array.from(x['data']));
      this.customersData = globals.uniq(this.customersData, (it) => it.id_customer);
      this.totalcust = x['total'];
      this.fromcust = x['from'] - 1;
      this.tocust = x['to'];
    });
  } 

  onScrollToEnd(e) {
    if (e === "customer") {
      this.datasentCustomer.pages = this.datasentCustomer.pages + 1; 
      this._customersServ.getDataCustomers(this.datasentCustomer).then(x => {
        this.customersData = this.customersData.concat(x['data']);
      });
    } 
  }

  onsearchselect(ev, val) {
    if (val === "customer") {
      this.customersData = [];
      this.datasentCustomer.search = ev.term;
      this.datasentCustomer.pages = 1;
      this.getDataCustomer();
    } 
  }

  getDataUser()
  {
    this._serv.getDataUser(this.datasentuserCustomer).then(x => {
      this.userData = this.userData.concat(Array.from(x['data']));
      this.userData = globals.uniq(this.userData, (it) => it.id_customer);
      this.totaluser = x['total'];
      this.fromuser = x['from'] - 1;
      this.touser = x['to'];
    });
    console.log(this.userData)
  }

  sortData(sort: Sort) {
    const data = this.userData.slice();
    if ( !sort.active || sort.direction === '') {
      this.userData = data;
      return;
    }
    this.userData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'lhu': return this.compare(a.lhu, b.lhu, isAsc);
        case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'no_sample': return this.compare(a.no_sample, b.no_sample, isAsc);
        case 'sample_name': return this.compare(a.sample_name, b.sample_name, isAsc);
        case 'jenis_kemasan': return this.compare(a.jenis_kemasan, b.jenis_kemasan, isAsc);
        case 'batch_number': return this.compare(a.batch_number, b.batch_number, isAsc);
        case 'lot_number': return this.compare(a.lot_number, b.lot_number, isAsc);
        case 'tanggal_terima': return this.compare(a.tanggal_terima, b.tanggal_terima, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  
  async saveData()
  {
    if(this.regex_email.test(this.formdata.email) == false)
    {
      await Swal.fire({
        title: "email does not match",
        text: "Please check again, email",
        icon: "warning",
        confirmButtonText: "Ok",
      });
    }else{
      if(this.formdata.password != this.formdata.confirm_password)
      {
        await Swal.fire({
          title: "Password not same",
          text: "Please check again, password and password confirm",
          icon: "warning",
          confirmButtonText: "Ok",
        });
      }else{
        if(this.regex.test(this.formdata.password) == false)
        {
          await Swal.fire({
            title: "Password Incomplete",
            text: "Password Incomplete",
            icon: "warning",
            confirmButtonText: "Ok",
          });
        }else{
          await this._serv.addDatauser(this.formdata).then((x) => {
            this.load = true;
            let message = {
                text: "Data Succesfully Added",
                action: "Done",
            };
            setTimeout(() => {
                this.openSnackBar(message);
                this.load = false;
                this.userData = [];
                this.getDataUser();
            }, 2000);
        });
          
        }
      }
    }
  }

  async updateData()
  {
    if(this.regex_email.test(this.formdata.email) == false)
    {
      await Swal.fire({
        title: "email does not match",
        text: "Please check again, email",
        icon: "warning",
        confirmButtonText: "Ok",
      });     
    }else{
      await this._serv.updateDatauser(this.formdata).then((x) => {
        this.load = true;
        let message = {
            text: "Data Succesfully Updated",
            action: "Done",
        };
        setTimeout(() => {
            this.openSnackBar(message);
            this.load = false;
            this.userData = [];
            this.getDataUser();
        }, 2000);
    });
    }
  }

  resetData()
  {
      this.formdata.id = null
      this.formdata.id_customer = null,
      this.formdata.name= null,
      this.formdata.email = null,
      this.formdata.password = null,
      this.formdata.confirm_password = null
  }
  addData(){
    this.dataform.status = 1;
    this.dataform.titleform = 'Add User'
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
        duration: 2000,
    });
  }

  async showHidePassword()
  {
    this.showPassword = await !this.showPassword;
    this.iconPassword = await this.iconPassword === 'visibility' ? 'visibility_off' : 'visibility';
  }

  async showHidePasswordConfirm()
  {
    this.showPasswordConfirm = await !this.showPasswordConfirm;
    this.iconPasswordConfirm = await this.iconPasswordConfirm === 'visibility' ? 'visibility_off' : 'visibility';
  }


  async editData(data)
  {
      console.log(data)
      this.expansive = true;
      this.dataform.titleform = 'Edit Data';
      this.dataform.status = 2;
      console.log(this.dataform)

      this.formdata.id = null
      this.formdata.id_customer = null,
      this.formdata.name= null,
      this.formdata.email = null,
      this.formdata.password = null,
      this.formdata.confirm_password = null
      
      this.formdata.id = data.id
      this.formdata.id_customer = data.id_customer,
      this.formdata.name= data.name,
      this.formdata.email = data.email
      this.editpassword = true;
  }

  async deleteData(data)
  {
    


  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this Data!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.value) {
       this._serv.deleteDatauser(data).then((x) => {
        this.load = true;
        let message = {
            text: "Data Succesfully Updated",
            action: "Done",
        };
        setTimeout(() => {
            this.openSnackBar(message);
            this.load = false;
            this.userData = [];
            this.getDataUser();
        }, 2000);
    });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Your imaginary file is safe :)',
        'error'
      )
    }
    setTimeout(()=>{
      this.load = false;
      this.userData = [];
      this.getDataUser();
    },1000)
  })
  }

}
