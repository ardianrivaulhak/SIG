import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ContactPersonService } from '../contact-person.service';

@Component({
  selector: 'app-contact-person-det',
  templateUrl: './contact-person-det.component.html',
  styleUrls: ['./contact-person-det.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ContactPersonDetComponent implements OnInit {

  contactForm: FormGroup;
  detaildata : any;
  idContact: any;
  showForms: any;
  hide = true;
  load = false;
  saving = true;

  constructor(
    private _conctacPersonServ: ContactPersonService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) {
    this.idContact = this._actRoute.snapshot.params['id'];
   }

   ngOnInit(): void {
    this.get();
   
  }

  async get()
  {
    await this.idContact == 'add' ? this.test() : this.getdatadetail();    
    
  }

  async test()
  {
    this.contactForm = await this.createLabForm()
  }

  enableForm(){
    this.hide = false;
    this.contactForm.get('name').enable();
    this.contactForm.get('gender').enable();
    this.contactForm.get('telpnumber').enable();
    this.contactForm.get('phonenumber').enable();  
    this.contactForm.get('fax').enable();
    this.contactForm.get('email').enable();  
    this.contactForm.get('desc').enable();
    this.contactForm.get('active').enable(); 
  }

  disableForm(){
    this.hide = true;
    this.contactForm.get('name').disable();
    this.contactForm.get('gender').disable();
    this.contactForm.get('telpnumber').disable(); 
    this.contactForm.get('phonenumber').disable();
    this.contactForm.get('fax').disable();  
    this.contactForm.get('email').disable(); 
    this.contactForm.get('desc').disable();
    this.contactForm.get('active').disable();
    this.contactForm.get('disable').enable();
  }

  saveForm(){
    console.log(this.contactForm);
    this._conctacPersonServ.updateDataContactPersons(this.idContact, this.contactForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/contact-person');
        this.load = false;
      },2000)
    })
  }

  deleteForm(){
    this._conctacPersonServ.deleteDataContactPersons(this.idContact).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Deleted',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('master/customers');
        this.load = false;
      },2000)
    });
  }

  saveNewForm(){
    console.log(this.contactForm);
    this._conctacPersonServ.addDataContactPersons(this.contactForm.value).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Save',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('master/contact-person');
        this.load = false;
      },2000)
    });
  }

  getdatadetail(){
    console.log(this.idContact);
    this._conctacPersonServ.getDataContactPersonsDetail(this.idContact)
    .then(x => { this.detaildata = x
      console.log(this.detaildata.name)
    })
    .then( () =>  this.contactForm = this.createLabForm())
   
  }

  createLabForm(): FormGroup {
    return this._formBuild.group({
        name: this.idContact !== 'add' ? this.detaildata.name : '',
        gender: [{
          value: this.idContact !== 'add' ? this.detaildata.gender : '',
          disabled: this.idContact !== 'add' ? true : false
        },{ validator: Validators.required }],
        telpnumber: [{
          value: this.idContact !== 'add' ? this.detaildata.telpnumber : '',
          disabled: this.idContact !== 'add' ? true : false
        }],
        phonenumber: [{
          value: this.idContact !== 'add' ? this.detaildata.phonenumber : '',
          disabled: this.idContact !== 'add' ? true : false
        }],
        fax: [{
          value: this.idContact !== 'add' ? this.detaildata.fax : '',
          disabled: this.idContact !== 'add' ? true : false
        }],
        email: [{
          value: this.idContact !== 'add' ? this.detaildata.email : '',
          disabled: this.idContact !== 'add' ? true : false
        },{validator: Validators.email}],
        desc: [{
          value: this.idContact !== 'add' ? this.detaildata.desc : '',
          disabled: this.idContact !== 'add' ? true : false
        }],
        active: [{
          value: this.idContact !== 'add' ? this.detaildata.active : '',
          disabled: this.idContact !== 'add' ? true : false
        }],
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  // enableForm()
  // {

  //   this.contactForm.get('name').enable();
  //   this.contactForm.get('gender').enable();
  //   this.contactForm.get('telpnumber').enable();
  //   this.contactForm.get('telpnumber').enable();  
  //   this.contactForm.get('phonenumber').enable();  
  //   this.contactForm.get('email').enable();   
  //   this.contactForm.get('desc').enable();    
  //   this.pageType = 'update';

  // }

  // getdatadetail()
  // {

  //   if (this.status == 'add'){

  //      console.log('hellaw')
  //      this.pageType = 'add';
  //      this.contactForm = this.createContactForm()

  //   } else {

  //     console.log('hellaw edit')
  //     this.pageType = 'edit';
  //     this._contactServ.getDataContactPersonsDetail(this.status)
  //     .then(f => this.datadetail = this.datadetail.concat(f))
  //     .then(()=> this.contactForm = this.createContactForm())
  //     .then(()=> console.log(this.datadetail))  

  //   }

  // }

}
