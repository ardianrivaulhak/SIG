import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractTrackComponent } from './contract-track.component';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
  {
    path: 'scanner-contract/:id',
    component: ContractTrackComponent
  }
];

@NgModule({
  declarations: [ContractTrackComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule
  ]
})
export class ContractTrackModule { }
