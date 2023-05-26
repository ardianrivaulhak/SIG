import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessopenComponent } from './processopen.component';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
  {
    path: 'pdf-akg/:id',
    component: ProcessopenComponent
  }
];

@NgModule({
  declarations: [ProcessopenComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule
  ]
})
export class ProcessopenModule { }
