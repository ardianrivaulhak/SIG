import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfCertificateComponent } from './pdf-certificate.component';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
  {
    path: 'pdf-certificate/:id_lhu/:lang',
    component: PdfCertificateComponent
  }
];

@NgModule({
  declarations: [PdfCertificateComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule
  ]
})
export class PdfCertificateModule { }
