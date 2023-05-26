import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from "../../../certificate.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-follow-data',
  templateUrl: './follow-data.component.html',
  styleUrls: ['./follow-data.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class FollowDataComponent implements OnInit {

    displayedColumns: string[] = ['no', 'contract_no', 'contract_category', 'customers'];

    certData = [];
    total: number;
    from: number;
    to: number;

    loadingfirst = true;
    dataFilter = {
        status : "accepted",
        pages : 1,
        type : "paginate",
        marketing : '',
        desc: '',
        customer_name: '',
        category: '',
        kontrakStat : false
      }
      checkList = [];
      contractcategory = [];
      allComplete: boolean = false;
      cobaData = null;

  constructor(
    public dialogRef: MatDialogRef<FollowDataComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _servCert: CertificateService,
  ) { }

  ngOnInit(): void {
      this.getData();
  }

  async getData(){
    await this._servCert.getFollowData(this.dataFilter).then(x => {
      this.certData = this.certData.concat(Array.from(x['data']));
      this.certData = this.uniq(this.certData, (it) => it.id_kontrakuji);
      if(!this.total){
        this.total = x['total'];
        this.from = x['from'] - 1;
        this.to = x['to']
      }  
    })
    .then(x => console.log(this.certData));
    this.loadingfirst =  await false;
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  paginated(f){
    this.certData = [];
    this.dataFilter.pages = f.pageIndex + 1;
    this.getData();
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.certData == null) {
      return;
    }
    if(completed == true)
    {
      this.certData.forEach(t => t.completed = completed);
      this.certData.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id_kontrakuji,
          checked : true
        })
      })
      this.checkList = this.uniq(this.checkList, (it) => it.id);
    }else{
      this.certData.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }


  updateAllComplete() {
    this.allComplete = this.certData != null && this.certData.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.certData == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.certData.filter(t => t.completed).length > 0 && !this.allComplete;
    
  }

  checkBox(ev,id){
    let z = this.checkList.filter(o => o.id == id);
    console.log(ev)
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
    console.log(this.checkList)
  }

  cancelData()
  {
    this.checkList = [];
    this.certData=[];
    this.loadingfirst = true;
    this.getData();
  }


    ApproveFollow()
  {
   console.log(this.checkList)
   let u = [];
   this.checkList.forEach(x => {
     if(x.checked){
       u = u.concat({
         id: x.id, 
       })
     }
   })
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this Data!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Approve it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this._servCert.approveFollowData(u).then(x => {
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
            this.certData=[];
            this.loadingfirst =  true;
            this.getData();
        },1000)
      })
  }

  check(){
      console.log('wew')
  }




}

