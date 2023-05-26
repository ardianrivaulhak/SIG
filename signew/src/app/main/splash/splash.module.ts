import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { SplashComponent } from './splash.component';

const routes = [
  {
    path: 'splash',
    component: SplashComponent
  }
];

@NgModule({
  declarations: [
    SplashComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule
  ]
})
export class SplashModule { }
