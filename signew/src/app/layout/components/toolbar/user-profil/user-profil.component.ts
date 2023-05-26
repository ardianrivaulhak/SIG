import { Component, OnInit, Inject } from '@angular/core'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { url } from 'app/main/url';
import { LoginService } from 'app/main/login/login.service';
import * as global from 'app/main/global';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss'],
  animations   : fuseAnimations
})
export class UserProfilComponent implements OnInit {

  urlphoto = url + '/assets/img/user/';

  dataUser = [];
  passwordNew : any;
  resetPasswordForm: FormGroup; 
  private _unsubscribeAll: Subject<any>;


  constructor( 
    private _dialogRef: MatDialogRef<UserProfilComponent>, 
    private _formBuild: FormBuilder,
    private _loginServ: LoginService,
    private _router: Router,
    private _localStorage: LocalStorage,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    if(data){
      this.dataUser = this.dataUser.concat(data.data);
    } 
    this._dialogRef.backdropClick().subscribe(v => { 

      this.closeModal()
    });
    this._unsubscribeAll = new Subject();
  }



  closeModal(){
    return this._dialogRef.close({
      
    });
  }

  setPhoto(v){
    return `${this.urlphoto}${v.photo}`
  }

  ngOnInit(): void {
    console.log(this.dataUser);
    this.resetPasswordForm = this.createLabForm();
    this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
            });
  }

  changePass(){
    global.swalyousure('Are you sure changing password').then(x => {
      if(x.isConfirmed){
        if(this.resetPasswordForm.value.password == 'saraswanti'){
          global.swalerror('Password tidak cocok');
        } else {
          if(this.resetPasswordForm.value.password == this.resetPasswordForm.value.passwordConfirm) {
            this._loginServ.changePassword(this.resetPasswordForm.value).then(async y => {
              await global.swalsuccess('success','Success Changing Password, You Have to Login Again !!');
              await this._localStorage.removeItem('token');
              await this.closeModal();
              await this._router.navigateByUrl('login');
            })
            .catch(e => global.swalerror('Error at Backend ! Contact IT !'));
          } else {
            global.swalerror('Password tidak sama');
          }
        }
      }
    })
    
  }

  createLabForm(): FormGroup {
       
    return this._formBuild.group({
       
      name           : ['', Validators.required],
      email          : ['', [Validators.required, Validators.email]],
      password       : ['', Validators.required],
      passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]

    })
  } 

}


export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if ( !control.parent || !control )
  {
      return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if ( !password || !passwordConfirm )
  {
      return null;
  }

  if ( passwordConfirm.value === '' )
  {
      return null;
  }

  if ( password.value === passwordConfirm.value )
  {
      return null;
  }

  return {passwordsNotMatching: true};
};
