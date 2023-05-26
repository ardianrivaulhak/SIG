import { Component, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../certificate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { CertmodalsComponent } from "../modals/certmodals/certmodals.component";
import { FormmodalsComponent } from "../modals/formmodals/formmodals.component";
import { AddakgComponent } from "../modals/akg/addakg/addakg.component";
import { AkgmodalsComponent } from "../modals/akg/akgmodals/akgmodals.component";
import Swal from 'sweetalert2';
import { RevattachmentmodalsComponent } from "../modals/revattachmentmodals/revattachmentmodals.component";
import { RevisiondataComponent } from "../modals/revisiondata/revisiondata.component";
import { ParameterAllComponent} from "../modals/parameter-all/parameter-all.component";
import { ChangeConditionComponent } from '../../archive/modals/change-condition/change-condition.component';
import { ControlInfoComponent } from "../modals/control-info/control-info.component";


import { ParameterCertificatemodalsComponent } from "../modals/parametermodals/parametermodals.component";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
@Component({
  selector: 'app-lembarhasil',
  templateUrl: './lembarhasil.component.html',
  styleUrls: ['./lembarhasil.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class LembarhasilComponent implements OnInit {

  loadingfirst = true;
  id_contract: any;
  dataContract = [];
  dataSampleLab = [];
  displayedColumns: string[] = ['checkbox', 'lhu','tgl_selesai', 'sample_name','status', 'format', 'condition', 'cert_status', 'print_info','action'];
  total: number;
  from: number;
  to: number;
  pages = 1;
  load = false;
  data = {
    id : ''
  };
  detaildata = [];
  datasent = {
    pages : 1,
    status : null,
    paginated : "paginated",
    lhu: null,
    no_sample : null,
    nama_sample : null
  }
  checkList = []
  allComplete: boolean = false;
  btnCheck = false;
  jumlahakg : number;
  nominalakg : number;
  sisaAkg: number;
  wow : number;
  parameterData = [];
  certificateData = [];
  idSample : any;
  dataFilter = {
    id_transaction : '',
    pages : 1
  }

  myFlagForSlideToggle : any;

  formdata = {
    lhu: null,
    sample: null,
    no_sample: null,
    status: null,
    paginated : "paginated",
    pages : 1
  }

  status = [ 
    {
      "title" : "Normal",
      "id" : 1
    }, 
    {
      "title" : "Urgent",
      "id" : 2
    }, 
    {
      "title" : "Very Urgent",
      "id" : 3
    }, 
    {
      "title" : "Custom 2 Day",
      "id" : 4
    }, 
    {
      "title" : "Custom 1 Day",
      "id" : 5
    }, 
  ];

  paginates = [
    {
      "title" : "Paginated",
      "id" : "paginated"
    },
    {
      "title" : "All",
      "id" : "all"
    }
  ]
  idcert :any;
  
  constructor(
    private _certServ: CertificateService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _kontrakServ: ContractService,
    private PdfServ: PdfService,
    
  ) {
    this.id_contract = this._actRoute.snapshot.params['id'];
  }


  ngOnInit(): void {
    this.getContractDetail();
    this.getSampleLab();
    this.getCertificate()
  }

  activedButton(data, id){
      let send = {
          data : data,
          id : id
      }
      console.log(send)
      this._certServ.activedCertificate(send).then(o => {
        this.load = true;
        let message = {
            text: 'Succesfully',
            action: 'Done'
        }
        setTimeout(()=>{
            this.dataSampleLab=[];
            this.loadingfirst =  true; 
            this.getSampleLab();
            this.openSnackBar(message);
            this.load = false;
        },1000)
        })
  }

  async getContractDetail(){
   await this._certServ.getContractDetail(this.id_contract)
      .then(x => this.dataContract = this.dataContract.concat(x))
      .then(() => console.log(this.dataContract[0].akg_trans))
      .then(() => {
        this.jumlahakg = this.dataContract[0].akg_trans.length > 0 ? this.dataContract[0].akg_trans.map(x => x.jumlah).reduce((a,b) => a + b) : 0;
        console.log(this.jumlahakg);
      })
      .then(() => {
        this.nominalakg = this.dataContract[0].akg_trans.length > 0 ? this.dataContract[0].akg_trans.map(x => x.total).reduce((a,b) => a + b) : 0;
        console.log(this.nominalakg);
      })
      .then(() => {
        this.wow = this.dataContract[0].total_akg.length
        console.log(this.wow)
      })
      await this.getSisaAkg();
     console.log(this.dataContract)
  }

  getSisaAkg(){
      this.sisaAkg = this.jumlahakg - this.wow;
      console.log(this.wow)
  }

  async getCertificate(){
      this.certificateData = [];
    await this._certServ.getLhuInContractwithParameters(this.id_contract, this.datasent).then(async x => {
      this.certificateData = this.certificateData.concat(Array.from(x['data']))
      console.log(x)
    })
    .then(()=> console.log(this.certificateData))
  }

  async getSampleLab(){
    this.dataSampleLab = [];
    await this._certServ.getLhuInContract(this.id_contract, this.formdata).then(async x => {
      this.dataSampleLab = this.dataSampleLab.concat(Array.from(x['data']));
      this.dataSampleLab = this.uniq(this.dataSampleLab, (it) => it.id);
      // let b = [];
      // b = await b.concat(Array.from(x['data']));
      // await b.forEach(x => {
      //   this.dataSampleLab = this.dataSampleLab.concat({
      //     id : x.id,
      //     contract_id : x.transaction_sample.kontrakuji.id_kontrakuji,
      //     contract_no : x.transaction_sample.kontrakuji.contract_no,
      //     lhu_number : x.lhu_number,
      //     cl_number : x.cl_number,
      //     customer : x.customer_name,
      //     tgl_selesai : x.tgl_selesai,
      //     sample_name : x.sample_name,
      //     no_sample : x.no_sample,
      //     id_statuspengujian : x.id_statuspengujian,
      //     idformat : x.format.id,
      //     format : x.format.name,
      //     sc: x.condition_cert[x.condition_cert.length - 1].cert_status,
      //     print_info : x.print_info,
      //     condition_cert: x.condition_cert[x.condition_cert.length - 1].status,
      //     condition_lab: x.transaction_sample.condition_contract_lab.inserted_at,
      //     date_at : x.date_at,
      //     completed : false,
      //     actived : x.active,
      //     checkStatus : x.transaction_sample.certificate_info
      //   })
      // })
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to'];
      }  
    });
    this.loadingfirst =  await false; 
  }



  paginated(f){
    this.loadingfirst = true;
    this.dataSampleLab = [];
    this.formdata.pages = f.pageIndex + 1;
    this.getSampleLab();
  }

  onSearchChange(ev){
    this.dataSampleLab = [];
    this.getSampleLab();
  }

  sortData(sort: Sort) {
    const data = this.dataSampleLab.slice();
    if ( !sort.active || sort.direction === '') {
      this.dataSampleLab = data;
      return;
    }
    this.dataSampleLab = data.sort((a, b) => {
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

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  duplicate(data)
  {
   console.log(data.condition_cert[data.condition_cert.length - 1].cert_status)
    if(data.condition_cert[data.condition_cert.length - 1].cert_status == 1){
        this.data.id = data.id;
        this._certServ.duplicateCertificate(this.data.id).then(o => {
        this.load = true;
        let message = {
            text: 'Duplicate Succesfully',
            action: 'Done'
        }
        setTimeout(()=>{
            this.dataSampleLab=[];
            this.loadingfirst =  true; 
            this.getSampleLab();
            this.openSnackBar(message);
            this.load = false;
        },1000)
        })
    }
    if(data.condition_cert[data.condition_cert.length - 1].cert_status == 2 || data.condition_cert[data.condition_cert.length - 1].cert_status == 3){
        this.data.id = data.id;
        this._certServ.duplicateCertificateRev(this.data.id).then(o => {
        this.load = true;
        let message = {
            text: 'Duplicate Succesfully',
            action: 'Done'
        }
        setTimeout(()=>{
            this.dataSampleLab=[];
            this.loadingfirst =  true; 
            this.getSampleLab();
            this.openSnackBar(message);
            this.load = false;
        },1000)
        })
    }
  }

    updateModals(id)
    {
      const dialogRef = this._matDialog.open(CertmodalsComponent, {
        panelClass: 'certificate-control-dialog',
        width: '80%',
        data: {idtransactionsample : id},
        disableClose : true
      });

      dialogRef.afterClosed().subscribe((result) => {
       if(result.v == false){
          this.dataSampleLab=[];
          this.loadingfirst =  true;
          this.getSampleLab();
          this.certificateData = [];
          this.getCertificate();
       }
      });
    }

    createNumberTitle(id_contract)
    {
      Swal.fire({
        title: 'Are you sure?',
        text: 'your number will always be new!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Lets Go!',
        cancelButtonText: 'No, Maybe later'
      }).then((result) => {
        if (result.value) {
          this._certServ.creatNumberTitle(id_contract).then(x => {
          })
          Swal.fire(
            'Success!',
            'Your number is beautifull',
            'success'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
        setTimeout(()=>{
          this.checkList = [];
          this.dataSampleLab=[];
          this.certificateData=[];
          this.loadingfirst =  true;
          this.getSampleLab();
          this.getCertificate();
          this.load = false;
        },1000)
      })
    }

    createNumberRevision()
    {
      let u = [];
      this.checkList.forEach((x) => {
          if (x.checked) {
              u = u.concat({
                  id: x.id,
              });
          }
      });
      console.log(u)
      Swal.fire({
        title: 'Are you sure?',
        text: 'your number will always be new!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Lets Go!',
        cancelButtonText: 'No, Maybe later'
      }).then((result) => {
        if (result.value) {
          this._certServ.creatNumberRevision(u).then(x => {
          })
          Swal.fire(
            'Success!',
            'Your number is beautifull',
            'success'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
        setTimeout(()=>{
            this.checkList = [];
            this.dataSampleLab=[];
            this.certificateData=[];
            this.loadingfirst =  true;
            this.getSampleLab();
            this.getCertificate();
            this.load = false;
        },1000)
      })
    }

    uniq(data, key) {
      return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    setAll(completed: boolean) {
      this.allComplete = completed;
      if (this.dataSampleLab == null) {
        return;
      }
      if(completed == true)
      {
        this.dataSampleLab.forEach(t => t.completed = completed);
        this.dataSampleLab.forEach( x => {
          this.checkList = this.checkList.concat({
            id: x.id,
            checked : true
          })
        })
        this.idSample = this.dataSampleLab[0].id
        this.checkList = this.uniq(this.checkList, (it) => it.id);
      }else{
        this.dataSampleLab.forEach(t => t.completed = completed);
        this.checkList = [];
      }
      console.log(this.checkList)
    }
  
    updateAllComplete() {
      this.allComplete = this.dataSampleLab != null && this.dataSampleLab.every(t => t.completed);
      console.log(this.allComplete)
    }
  
    someComplete(): boolean {
      if (this.dataSampleLab == null) {
        return false;
      }
      console.log(this.allComplete)
      return this.dataSampleLab.filter(t => t.completed).length > 0 && !this.allComplete;      
    }
  
    checkBox(ev, id){
      let z = this.checkList.filter(o => o.id == id);
     
      console.log(this.idSample)
      if(ev){
        if(z.length > 0){
          z[0].checked = ev
        } else {
          this.checkList = this.checkList.concat({
            id: id,
            checked : true
          });
        }
      } else {
        let z = this.checkList.filter(x => x.id == id);
        z[0].checked = ev;
      }
      this.idSample = this.checkList[0].id;
    }
  

    updateAllModals(id)
    {
      let u = [];
      this.checkList.forEach((x) => {
        if (x.checked) {
            u = u.concat({
                id: x.id,
            });
        }
      });
      const dialogRef = this._matDialog.open(FormmodalsComponent, {
        panelClass: 'certificate-all-dialog',
        height: '600px',
        width: '100%',
        data: {
                idcontract : id,
                idsample : this.idSample,
                checkData : u
              }
      });
      dialogRef.afterClosed().subscribe((result) => {
          if(result.v == false){
            this.checkList = [];
            this.dataSampleLab = [];
            this.loadingfirst =  true;
            this.getSampleLab();
          }
      });
    }

    cancelAction(){
      this.checkList.forEach( (x) => {
        x.checked = false;
      })
     this.checkList = [];
     this.dataSampleLab = [];
     this.loadingfirst =  true;
     this.getSampleLab();
     console.log(this.checkList)
    }

  deleteRoa(id_cert)
  {
    console.log(id_cert);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._certServ.deleteResultOfAnalisys(id_cert).then(x => {
        })
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
      setTimeout(()=>{
        this.dataSampleLab=[];
        this.loadingfirst =  true;
        this.getSampleLab();
        this.load = false;
      },1000)
    })
  }

  deleteBulkRoa()
  {
    let u = [];
        this.checkList.forEach((x) => {
            if (x.checked) {
                u = u.concat({
                    id: x.id,
                });
            }
        });
    console.log(u)
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._certServ.deleteBulkResultOfAnalisys(u).then(x => {
        })
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
      setTimeout(()=>{
        this.dataSampleLab=[];
        this.loadingfirst =  true;
        this.getSampleLab();
        this.load = false;
      },1000)
    })
  }
  
  async setDelete(v){
    this.datasent.pages = await 1;
    await this.getSampleLab();
  }

  ApproveRoa(id_contract)
  {
   console.log(this.checkList)
   let u = [];
   this.checkList.forEach(x => {
     if(x.checked){
       u = u.concat({
         id: x.id, 
         id_contract : id_contract
       })
     }
   })
   console.log(u)
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._certServ.approveRoaData(u).then(x => {
        })
        Swal.fire(
          'Success!',
          'Your LHU is Approved',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
      setTimeout(()=>{
        this.dataSampleLab=[];
        this.loadingfirst =  true;
        this.getSampleLab();
        this.load = false;
        if(this.dataSampleLab.length < 1){
          this._route.navigateByUrl('analystpro/certificate');
        }else{
          this._route.navigateByUrl('analystpro/certificate/' + id_contract + '/lhu');
        }
      },1000)
    })
  }
  
  addAkgModals(id)
  {
    const dialogRef = this._matDialog.open(AddakgComponent, {
      panelClass: 'certificate-akg-dialog',
      height: '400px',
      width: '100%px',
      data: {idtransactionsample : id}
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log('dialog close')
      id = result;      
      this.sisaAkg = 0;
      this.getSisaAkg();
      this.dataSampleLab=[];
      this.loadingfirst =  true;
      this.getSampleLab();
    });
  }

  AkgModals(id)
  {
    // const dialogRef = this._matDialog.open(AkgmodalsComponent, {
    //   panelClass: 'certificate-akg-modals-dialog',
     
    //   width: '100%',
    //   data: {idcontract : id}
    // });

    // dialogRef.afterClosed().subscribe( result => {
    //   console.log('dialog close')
    //   id = result;
    //   this.dataSampleLab=[];
    //         this.loadingfirst =  true;
    //         this.getSampleLab();
    //         this.certificateData = [];
    //         this.getCertificate();
    // });
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/analystpro/certificate/${id}/lhu/ing`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }


  rev_attachment(id)
    {
    
      const dialogRef = this._matDialog.open(RevattachmentmodalsComponent, {
        panelClass: 'rev-attachment-dialog',
        width: '600px',
        data: {id : id},
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((result) => {
        if(result.v == false){
          this.dataSampleLab=[];
          this.loadingfirst =  true;
          this.getSampleLab();
        }
      });
    }

    revModals(data)
    {
      const dialogRef = this._matDialog.open(RevisiondataComponent, {
        panelClass: 'revision-data-dialog',
        width: '40%',
        data: {data : data},
        disableClose : true
      });

      dialogRef.afterClosed().subscribe((result) => {
        if(result.v == false){
          this.dataSampleLab=[];
          this.loadingfirst =  true;
          this.getSampleLab();
        }        
      });
    }

    parameterModals(id, lhu)
    {
      console.log(lhu)
        const dialogRef = this._matDialog.open(ParameterCertificatemodalsComponent, {
        panelClass: 'certificate-parameter-dialog',
        width: '1200px',
        data: {idtransactionsample : id, lhu : lhu, bac : this.dataSampleLab}
        });
  
        dialogRef.afterClosed().subscribe( result => {
            console.log('dialog close')
            id = result;
            this.dataSampleLab=[];
            this.loadingfirst =  true;
            this.getSampleLab();
            this.certificateData = [];
            this.getCertificate();
        });
    }

    parameterAllModals(id)
    {   
        let u = [];
        this.checkList.forEach((x) => {
            if (x.checked) {
                u = u.concat({
                    id: x.id,
                });
            }
        });
        console.log(u)

        const dialogRef = this._matDialog.open(ParameterAllComponent, {
        panelClass: 'parameter-all-dialog',
        width: '60%',
        data: {
            idcontract : id,
            idsample : this.idSample,
            checkData : u
          }
        });
  
        dialogRef.afterClosed().subscribe( result => {
            if(result.v == false)
            {
              console.log('dialog close')
              this.dataSampleLab=[];
              this.loadingfirst =  true;
              this.getSampleLab();
              this.certificateData = [];
              this.getCertificate();
              // id = result;
            }
        });
    }

    Revision(status)
    {
      let u = [];
      this.checkList.forEach((x) => {
          if (x.checked) {
              u = u.concat({
                  id: x.id,
              });
          }
      });      
      const dialogRef = this._matDialog.open(ChangeConditionComponent, {
        panelClass: 'change-condition-modals',
        width: '600px',
        data: { 
          data : u, 
          idcontract : this.id_contract , 
          status: status },
      });
  
      dialogRef.afterClosed().subscribe( result => {
        if(result.v == false){
          console.log('dialog close')
          this.dataSampleLab=[];
              this.loadingfirst =  true;
              this.getSampleLab();
              this.certificateData = [];
              this.getCertificate();
        }
      });
    }

    // opendetailphoto(v){
    //     let urla = `${url}/certificate/pdf-certificate/${}`
    //         window.open(urla, '_blank');
    //   }

    controlDesc(data)
    {
      console.log(data)
        const dialogRef = this._matDialog.open(ControlInfoComponent, {
        panelClass: 'certificate-control-dialog',
        width: '1200px',
        data: { data}
        });
  
        dialogRef.afterClosed().subscribe( result => {
            console.log('dialog close')
            this.dataSampleLab=[];
            this.loadingfirst =  true;
            this.getSampleLab();
            this.certificateData = [];
            this.getCertificate();
        });
    }

    releaseWithOutEmail()
  {
    let u = [];
    this.checkList.forEach((x) => {
        if (x.checked) {
            u = u.concat({
                id: x.id,
            });
        }
    });
    console.log(u)
    this._certServ.sendReleaseWithOutEmailinCertificate(u).then( () => {
      this.load = true;
      let message = {
        text: 'Release Succesfully',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.dataSampleLab=[];
        this.getCertificate();
        this.checkList=[];
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/certificate');
        this.load = false;
      },1000)
    })
  }

  goSample(id)
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/analystpro/certificate/${id}/samplelab`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }

  goParameter(idlhu)
  {
    const url = this._route.serializeUrl(
      this._route.createUrlTree([`/analystpro/certificate/lhu/${idlhu}/parameters`])
    );
    
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }


  openPdf(v,val) {
    console.log(v)
        this._kontrakServ.getDataDetailKontrak(v).then((x) => {
          console.log(x)
            this.PdfServ.generatePdf(x,val);
        });
    }

    async searchButton()
    {    
      // console.log(this.formdata); 
      // this.datasent.lhu = await this.formdata.lhu
      // this.datasent.no_sample  = await this.formdata.no_sample
      // this.datasent.nama_sample =  await this.formdata.sample
      // this.datasent.status =  await this.formdata.status     
      // this.datasent.paginated =  await this.formdata.paginated     
      
      this.dataSampleLab = await [];
      this.loadingfirst = await true;
      await this.getSampleLab();
    }

    async cancelSearchMark()
    {
      this.formdata.lhu = await null;
      this.formdata.no_sample = await null;
      this.formdata.sample = await null;
      this.formdata.status   = await null;
      this.formdata.paginated   = await "paginated";
  
  
      // this.datasent.lhu  = await null;
      // this.datasent.no_sample  = await null;
      // this.datasent.nama_sample  = await null;
      // this.datasent.status = await null ;
      // this.datasent.paginated   = await "paginated";
      this.dataSampleLab = await [];
      this.loadingfirst = await true;
      await this.getSampleLab();
    }

    goCertificate(id, ev) {
      const url = this._route.serializeUrl(
          ev == 'ID' ? this._route.createUrlTree([`/certificate/pdf-certificate/` + id  + `/id`]) : this._route.createUrlTree([`/certificate/pdf-certificate/` + id  + `/en`])
      );      
      let baseUrl = window.location.href.replace(this._route.url, '');
      window.open(baseUrl + url, '_blank');
    }




}
