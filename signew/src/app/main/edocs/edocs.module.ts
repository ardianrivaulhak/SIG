// material
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatStepperModule} from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import {MatNativeDateModule} from '@angular/material/core';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CurrencyMaskModule, CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EdocsComponent } from "./edocs.component";
// fuse
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// core
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { WebcamModule } from 'ngx-webcam';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdddocumentComponent } from './adddocument/adddocument.component';
import { DocumentsComponent } from './documents/documents.component';
import { DocumentdetailComponent } from './documents/documentdetail/documentdetail.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { UpdatedocumentsComponent } from './documents/documentdetail/updatedocuments/updatedocuments.component';
import { UpdateattachmentComponent } from './documents/documentdetail/updateattachment/updateattachment.component';
import { ViewersDocumentComponent } from './dialog/viewers-document/viewers-document.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupdetailComponent } from './groups/groupdetail/groupdetail.component';
import { AddGroupComponent } from './groups/add-group/add-group.component';
import { AccessdocumentComponent } from './documents/documentdetail/accessdocument/accessdocument.component';
import { UpdateotherattachmentComponent } from './documents/documentdetail/updateotherattachment/updateotherattachment.component';


const routes: Routes = [
  {
  path      : '',
  component : EdocsComponent,
  children  : [
    {
      path        : 'add-new',
      component  : AdddocumentComponent
    },
    {
      path        : 'documents/:category',
      component  : DocumentsComponent
    },
    {
      path        : 'documents/:category/:id',
      component  : DocumentdetailComponent
    },
    {
      path        : 'documents/:category/:id/access',
      component  : AccessdocumentComponent
    },
    {
      path        : 'pdf/:type/:id',
      component  : PdfViewerComponent
    },
    {
      path        : 'groups',
      component  : GroupsComponent
    },
    {
      path        : 'groups/:id',
      component  : GroupdetailComponent
    },
    {
      path        : '**',
      component  : DashboardComponent
    }
  ] 
  },
  ];

@NgModule({
  declarations: [
    DashboardComponent,
    AdddocumentComponent,
    DocumentsComponent,
    DocumentdetailComponent,
    PdfViewerComponent,
    UpdatedocumentsComponent,
    UpdateattachmentComponent,
    ViewersDocumentComponent,
    GroupsComponent,
    GroupdetailComponent,
    AddGroupComponent,
    AccessdocumentComponent,
    UpdateotherattachmentComponent],
  imports: [
    CommonModule,
    PdfViewerModule,
      HttpClientModule,
      RouterModule.forChild(routes),
      MatButtonModule,
      MatChipsModule,
      MatRippleModule,
      MatExpansionModule,
      MatFormFieldModule,
      MatGridListModule,
      MatNativeDateModule,
      MatMenuModule,
      MatDatepickerModule,
      MatIconModule,
      MatDialogModule,
      MatSlideToggleModule,
      MatRippleModule,
      MatStepperModule,
      MatSelectModule,
      MatSortModule,
      MatSnackBarModule,
      MatTableModule,
      MatTabsModule,
      NgxChartsModule,
      MatInputModule,
      MatButtonModule,
      MatChipsModule,
      MatCardModule,
      MatPaginatorModule,
      MatSlideToggleModule,
      MatRippleModule,
      MatStepperModule,
      MatSelectModule,
      MatSortModule,
      MatSnackBarModule,
      MatTableModule,
      MatTabsModule,
      NgxChartsModule,
      MatGridListModule,
      FuseSharedModule,
      FuseWidgetModule,
      NgSelectModule,
      MatTooltipModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      CurrencyMaskModule,
      MatProgressBarModule,
      CKEditorModule,
      InfiniteScrollModule
  ]
})

export class EdocModule { }
