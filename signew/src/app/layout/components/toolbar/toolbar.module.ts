import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import { UserProfilComponent } from './user-profil/user-profil.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    declarations: [
        ToolbarComponent,
        UserProfilComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatToolbarModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports     : [
        ToolbarComponent
    ]
})
export class ToolbarModule
{
}
