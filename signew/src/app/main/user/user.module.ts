import { NgModule } from '@angular/core'; 
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'; 
import { FuseSharedModule } from '@fuse/shared.module'; 
import { UserComponent } from '../user/user/user.component';  
 

const routes = [
  {
    path: 'user',
    component: UserComponent
  }
];

@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FuseSharedModule
  ]
})
export class UserModule { }
