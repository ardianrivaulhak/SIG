import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { PdfCertificateComponent } from '../analystpro/certificate/pdf-certificate/pdf-certificate.component';
import { FuseSharedModule } from '@fuse/shared.module';

import { AppsComponent } from './apps.component';


const routes = [
  {
      path     : 'apps',
      component: AppsComponent
  },
//   {
//     path        : 'pdf-certificate/:id_lhu',
//     component   : PdfCertificateComponent
//   },
];


@NgModule({
  declarations: [
    AppsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  exports: [
    AppsComponent
  ]
})
export class AppsModule { }
