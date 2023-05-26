import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ContractService } from '../services/contract/contract.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import { LoginService } from '../../login/login.service';
import { ActivatedRoute, Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import * as html2pdf from 'html2pdf.js';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { MatDialog } from "@angular/material/dialog";
import { url, urlApi } from 'app/main/url';
import { ModalPhotoParameterComponent } from "../contract/modal-photo-parameter/modal-photo-parameter.component"
import { PdfService } from 'app/main/analystpro/services/pdf/pdf.service';

@Component({
  selector: 'app-preview-contract',
  templateUrl: './preview-contract.component.html',
  styleUrls: ['./preview-contract.component.scss'], 
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class PreviewContractComponent implements OnInit, OnDestroy {
  
  totalPengujian = 0;
  dataSuccess: any;
  btnSave = true;
  barCode = false;
  btnUpdate = true;
  btnPrint = true;
  btnRevisi = false;
  displayedColumns: string[] = ['no', 'tglselesai', 'jenis_pp', 'namasample', 'jeniskemasan','statuspengujian'];
  displayedColumnsParam: string[] = ['no', 'no_sample', 'jenis_pp'];
  dataParameter = [];
  dataParameterPengujian = [];
  dataSource: any = [];
  date = new Date();
  kirimData= [];
  load = false;
  data =  [];
  subject: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
  array$: Observable<any> =  this.subject.asObservable();
  _unsubscribeAll = new BehaviorSubject<any>([]);
  me = [];
  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  @ViewChild('pdfTable2', {static: false}) pdfTable2: ElementRef;
  constructor(
    private _kontrakServ: ContractService,
    private _route: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _loginServ: LoginService,
    private pdfServ: PdfService
    ) { 
      // this.data = this.getData().asObservable();
    }
   tesdata(){
      this._kontrakServ.getDataDetailKontrak(2).then(x => {
          console.log(x)
          this.pdfServ.generatePdf(x,'download');
      })
  }
    
  printContrack(){
    // location.href = url + "view-kontrak/" + this.dataSuccess.sample[0].id_contract;
    // console.log(this.dataSuccess.sample[0].id_contract);
    // this._kontrakServ.pdfContract(this.dataSuccess.sample[0].id_contract).then((g) => {  
    //   console.log(g);
    // });

    this._kontrakServ.getDataDetailKontrak(2).then(x => {
      console.log(x)
      this.pdfServ.generatePdf(x,'download');
    })
    
    // var opt = {
    //   margin:       0.2,
    //   filename:     'Contract.pdf',
    //   image:        { type: 'jpeg', quality: 0.98 },
    //   html2canvas:  { scale: 2 },
    //   pagebreak:     { mode: 'avoid-all' },
    //   jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    // }; 

    // // html2pdf().set(opt).from(this.pdfTable.nativeElement, this.pdfTable2.nativeElement).toPdf().save();     
    // html2pdf().set(opt).from(this.pdfTable.nativeElement).toPdf().get('pdf').then(function (pdf) {
    //   pdf.addPage()
    // }).from(this.pdfTable2.nativeElement).toContainer().toCanvas().toPdf().save(); 
  }

  async saveContrack(){
    
    
    await console.log(this.data[0]);
    await console.log(this.kirimData);
    
    let a = {
      address_cust: this.data[0].address_cust,
        biayaakg: this.data[0].biayaakg,
        biayasample: this.data[0].biayasample,
        contact_person: this.data[0].contact_person,
        contract: this.data[0].contract,
        customer_name: this.data[0].customer_name,
        discountlepas: this.data[0].discountlepas,
        pph: this.data[0].pph,
        ppn: this.data[0].ppn,
        sample: this.data[0].sample,
        sisapembayaran: this.data[0].sisapembayaran,
        subtotal: this.data[0].subtotal,
        taxaddress_cust: this.data[0].taxaddress_cust,
        totalbiayaakg: this.data[0].totalbiayaakg,
        totalbiayapengujian: this.data[0].totalbiayapengujian,
        totalbiayasample: this.data[0].totalbiayasample,
        uangmuka: this.data[0].uangmuka 
    };
    console.log(a); 
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will Save this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save!',
      cancelButtonText: 'No, Cancel It'
    }).then((result) => {
      if (result.value) {
        this._kontrakServ.saveData(a).then((g) => {   
          console.log(g);
          this.dataSuccess = g;
          this.barCode = true;
          this.btnSave = false; 
          this.load = true;
          let message = {
            text: 'Data Succesfully Updated',
            action: 'Done'
          }
          setTimeout(()=>{
            this.openSnackBar(message);
            this.btnSave = false; 
            // this._route.navigateByUrl('analystpro/contract');
            this.openModalPhoto(g);
            this.load = false;
          },2000)
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })  
  }

  async update(){
    await console.log(this.data[0]);
    await console.log(this.kirimData);
    
    let a = {
      address_cust: this.data[0].address_cust,
        biayaakg: this.data[0].biayaakg,
        biayasample: this.data[0].biayasample,
        contact_person: this.data[0].contact_person,
        contract: this.data[0].contract,
        customer_name: this.data[0].customer_name,
        discountlepas: this.data[0].discountlepas,
        pph: this.data[0].pph,
        ppn: this.data[0].ppn,
        sample: this.data[0].sample,
        sisapembayaran: this.data[0].sisapembayaran,
        subtotal: this.data[0].subtotal,
        taxaddress_cust: this.data[0].taxaddress_cust,
        totalbiayaakg: this.data[0].totalbiayaakg,
        totalbiayapengujian: this.data[0].totalbiayapengujian,
        totalbiayasample: this.data[0].totalbiayasample,
        uangmuka: this.data[0].uangmuka 
    };
    console.log(a); 
    console.log(this.data[0].idContrack);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will Update this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update!',
      cancelButtonText: 'No, Cancel It'
    }).then((result) => {
      if (result.value) {
        this._kontrakServ.updateData(this.data[0].idContrack, a).then((g) => {   
          console.log(g);
          this.dataSuccess = g;
          this.barCode = true;
          this.btnSave = false; 
          this.btnUpdate = false;
          this.load = true;
          let message = {
            text: 'Data Succesfully Updated',
            action: 'Done'
          }
          setTimeout(()=>{
            this.openSnackBar(message); 
            // this._route.navigateByUrl('analystpro/contract'); 
            this.load = false;
          },2000)
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    }) 
  }


  openModalPhoto(id){
    console.log(id.sample);
    const dialogRef = this.dialog.open(ModalPhotoParameterComponent, {
      height: "auto",
      width: "800px",
      disableClose: true,
      panelClass:'parameter-modal',
      data: { 
        sample: id.sample
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.btnPrint = false;
    }); 
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  backToContrack(){ 
    if(this.data[0].status === "add"){
      let datapeview = this.data; 
      this._kontrakServ.newDataPreview(datapeview);
      this._route.navigateByUrl('analystpro/kontrak/add');
    }else{
      let datapeview = this.data; 
      this._kontrakServ.newDataPreview(datapeview);
      this._route.navigateByUrl('analystpro/kontrak/'+ this.data[0].idContrack);
    }
  }

  printPage() {
    window.print();
  }

  async ngOnInit() {
    await this._kontrakServ.data.subscribe(async x => { 
      this.data = await this.data.concat(x);
      this.dataSource = await this.dataSource.concat(this.data[0].sample);  
      await console.log(this.data);
      await console.log(this.dataSource);
      let a = await this.data[0].subtotal + this.data[0].ppn;
      this.totalPengujian = await a;
      await this.ngOnDestroy();
      if(this.data.length === 0){
        Swal.fire(
          'Access Denied',
          'Please create contrak :)',
          'error'
        )
        await this._route.navigateByUrl('analystpro/contract');
      }
    });


    
    
    
    await this._loginServ.checking_me()
    .then(x => this.me = this.me.concat(x))
  }

  ngOnDestroy()
    {
        this._unsubscribeAll.complete();
    }


  revisi(){

  }

}
