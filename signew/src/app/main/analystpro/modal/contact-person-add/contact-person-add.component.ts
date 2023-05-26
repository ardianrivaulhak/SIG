import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations'; 
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ContactPersonService } from '../../master/contact-person/contact-person.service';

@Component({
  selector: 'app-contact-person-add',
  templateUrl: './contact-person-add.component.html',
  styleUrls: ['./contact-person-add.component.scss'],
  animations   : fuseAnimations
})
export class ContactPersonAddComponent implements OnInit {

  contactForm: FormGroup;
  detaildata = [];
  idContact: any;
  showForms: any;
  hide = true;
  load = false;
  saving = true;

  constructor( 
    private _dialogRef: MatDialogRef<ContactPersonAddComponent>,
    private _conctacPersonServ: ContactPersonService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) { }

  ngOnInit(): void {
    this.contactForm = this.createLabForm();
  }

  saveNewForm(){
    console.log(this.contactForm);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want save this data ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel it'
    }).then((result) => {
      if (result.value) {
        this._conctacPersonServ.addDataContactPersons(this.contactForm.value).then(g => {
          console.log(g);
          this.load = true;
          let message = {
            text: 'Data Succesfully Save',
            action: 'Done'
          } 
          setTimeout(()=>{
            this.openSnackBar(message);
            // this._route.navigateByUrl('master/customers');
            this.load = false;
          },2000)
          return this._dialogRef.close({
            b: "close",
            c: this.contactForm.value,
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    });

    
  }

  createLabForm(): FormGroup {
    return this._formBuild.group({
        name: [{
          value: null,
          disabled: false
        },{ validator: Validators.required }],
        gender: [{
          value: null,
          disabled: false
        },{ validator: Validators.required }],
        telpnumber: [{
          value: null,
          disabled: false
        },{ validator: Validators.required }],
        phonenumber: [{
          value: null,
          disabled: false
        }],
        fax: [{
          value: null,
          disabled: false
        }],
        email: [{
          value: null,
          disabled: false
        },{validator: Validators.email}],
        desc: [{
          value: null,
          disabled: false
        }],
        active: [{
          value: 1,
          disabled: false
        }],
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
