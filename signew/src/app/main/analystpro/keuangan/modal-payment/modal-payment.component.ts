import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeuanganService } from '../keuangan.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-payment',
  templateUrl: './modal-payment.component.html',
  styleUrls: ['./modal-payment.component.scss']
})
export class ModalPaymentComponent implements OnInit {

  load = false;
  customer = null;
  contactPerson = null;
  bank = null;
  tanggal = null;
  total_harga = null;
  price = null;
  sisa_pembayaran = null;
  id_invoice = null;
  id_payment = null;
  dataPayment: any;
  btnSave = false;
  btnUpdate = false;
  dataBank = [];

  constructor( 
    private _snackBar: MatSnackBar,
    private _masterServ: KeuanganService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<ModalPaymentComponent>
  ) { }
//     if(data){ 
//       this.id_invoice = data.id_invoice;
//       console.log(this.id_invoice);
//     } 

//     this._masterServ.getDataDetailExportExcel(this.id_invoice).then(x => { 
//       this.dataPayment = x;
//       this.id_payment = this.dataPayment.id;
//       console.log(this.dataPayment);
//       console.log(this.id_payment);

//       if(this.dataPayment.id !== null ){
//           this.btnUpdate = true;
//           this.customer = this.dataPayment.customer_name;
//           this.bank = this.dataPayment.id_bankaccount;
//           this.contactPerson = this.dataPayment.contact_person;
//           this.tanggal = this.dataPayment.tgl_pembayaran;
//           this.price = this.dataPayment.price;
//           this.total_harga = this.dataPayment.totalharga;
//           this.sisa_pembayaran = this.dataPayment.totalharga - this.dataPayment.price; 
//       } else {
//         this.btnSave = true;
//         this.customer = this.dataPayment.customer_name; 
//         this.contactPerson = this.dataPayment.contact_person;
//         this.total_harga = this.dataPayment.totalharga;
//       } 
//     });

//     this._masterServ.getDataBank().then(x => {
//       this.dataBank = this.dataBank.concat(x);
//       console.log(this.dataBank);
//     });

//   }

  ngOnInit(): void {
  }

//   closeModal(){
//     return this._dialogRef.close({
      
//     });
//   }

//   savePayment(){
//     console.log("save");
//       var year = this.tanggal._i.year;
//       var month = this.tanggal._i.month + 1;
//       var date = this.tanggal._i.date;  
//       var tanggal = `${year}-${month}-${date}`
//       console.log(tanggal);

//     let data = {
//       payment: null,
//       id_inv_header: this.id_invoice,
//       id_bankaccount: this.bank,
//       price: this.price,
//       tgl_pembayaran: tanggal
//     }
//     console.log(data);

//     this._masterServ.paymentAction(data).then(x => { 
//       this.load = true;
//         let message = {
//           text: 'Save Succesfully',
//           action: 'Done'
//         }
//       setTimeout(()=>{ 
//         this.closeModal()
//         this.openSnackBar(message);
//         this.load = false;
//       },2000)
//     });
//   }

//   updatePayment(){
//     console.log("update");
//     console.log(this.tanggal);
    
//     // var year = this.tanggal._i.year;
//     //   var month = this.tanggal._i.month + 1;
//     //   var date = this.tanggal._i.date;  
//     //   var tanggal = `${year}-${month}-${date}`
//     //   console.log(tanggal);

//     let data = {
//       payment: this.id_payment,
//       id_inv_header: this.id_invoice,
//       id_bankaccount: this.bank,
//       price: this.price,
//       tgl_pembayaran: this.tanggal
//     }
//     console.log(data);

//     this._masterServ.paymentAction(data).then(x => { 
//       this.load = true;
//         let message = {
//           text: 'Update Succesfully',
//           action: 'Done'
//         }
//       setTimeout(()=>{ 
//         this.closeModal()
//         this.openSnackBar(message);
//         this.load = false;
//       },2000)
//     });
//   }

//   getValBank(ev){
//     this.bank = null;
//     console.log(ev);
//     this.bank = ev.id;
//   }

//   openSnackBar(message) {
//     this._snackBar.open(message.text, message.action, {
//       duration: 2000,
//     });
//   }

}
