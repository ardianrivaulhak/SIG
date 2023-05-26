import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractpdfComponent } from './contractpdf.component';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
  {
    path: '',
    component: ContractpdfComponent
  }
];

@NgModule({
  declarations: [ContractpdfComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule
  ]
})


export class ContractpdfModule { }
