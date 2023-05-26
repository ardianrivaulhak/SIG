import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatBadgeModule} from '@angular/material/badge';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatDividerModule} from '@angular/material/divider';
import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { NgxSpinnerModule } from "ngx-spinner";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatGridListModule} from '@angular/material/grid-list';
@NgModule({
    imports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDividerModule,
        FlexLayoutModule,
        MatBadgeModule,
        MatProgressSpinnerModule,
        FuseDirectivesModule,
        FusePipesModule,
        NgxSpinnerModule,
        MatGridListModule
    ],
    exports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDividerModule,
        FlexLayoutModule,
        MatBadgeModule,
        MatProgressSpinnerModule,
        FuseDirectivesModule,
        FusePipesModule,
        NgxSpinnerModule,
        MatGridListModule
    ]
})
export class FuseSharedModule
{
}
