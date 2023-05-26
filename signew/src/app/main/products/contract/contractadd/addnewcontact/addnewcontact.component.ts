import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService  } from "../../../products.service";

@Component({
  selector: 'app-addnewcontact',
  templateUrl: './addnewcontact.component.html',
  styleUrls: ['./addnewcontact.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AddnewcontactComponent implements OnInit {
  load = false;

  dataSend = {
    name : '',
    gender : '',
    telpnumber : '',
    phonenumber : '',
    fax : '',
    email : '',
    desc : '',
    id_customer : ''
  }

  gender = [
    {
      id : 'L',
      v : 'Male'
    },
    {
      id : 'P',
      v : 'Female'
    }
  ]

  constructor(
    public dialogRef: MatDialogRef<AddnewcontactComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _productServ : ProductsService
  ) { }

  ngOnInit(): void {
    this.dataSend.id_customer = this.data.customer;
  }

  saveForm()
  {
    this._productServ.createContactPerson(this.dataSend).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.closeModal(false);
        this.load = false;
      },1000)
    })
  }


  closeModal(ev){
    return this.dialogRef.close({
      ev : ev, 
      telp : this.dataSend.telpnumber, 
      phone : this.dataSend.phonenumber
    });
  }

}
