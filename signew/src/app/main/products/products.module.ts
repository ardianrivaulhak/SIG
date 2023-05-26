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
import {MatToolbarModule} from '@angular/material/toolbar';
// fuse
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';


// core
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ContractaddComponent } from './contract/contractadd/contractadd.component';
import { MediartuComponent } from './contract/mediartu/mediartu.component';
import { MediartuFinanceComponent } from '../analystpro/keuangan/products/mediartu/mediartu.component';
import { DioxineComponent } from './contract/dioxine/dioxine.component';
import { InvoiceproductComponent } from './finance/invoiceproduct/invoiceproduct.component';
import { DetailinvoiceproductComponent } from './finance/invoiceproduct/detailinvoiceproduct/detailinvoiceproduct.component';
import { MediartudetailComponent } from './contract/mediartu/page/mediartudetail/mediartudetail.component';
import { ContracteditComponent } from './contract/contractedit/contractedit.component';
import { ApproveInvoiceComponent } from './finance/approve-invoice/approve-invoice.component';
import { PaymentsComponent } from './finance/invoiceproduct/dialog/payments/payments.component';
import { ApprovalLabComponent } from './lab/approval-lab/approval-lab.component';
import { DetailApproveComponent } from './lab/approval-lab/modals/detail-approve/detail-approve.component';
import { MediartuLabComponent  } from "./lab/mediartu/mediartu.component";
import { UpdateformComponent } from './lab/mediartu/page/updateform/updateform.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AttachmentproductComponent } from './modals/attachmentproduct/attachmentproduct.component';
import { CameraphotoComponent } from './modals/cameraphoto/cameraphoto.component';
import { WebcamModule } from 'ngx-webcam';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SendingProductComponent } from './contract/mediartu/page/sending-product/sending-product.component';
import { ProgressProductComponent } from './lab/mediartu/page/progress-product/progress-product.component';
import { RevisionComponent } from './modals/revision/revision.component';
import { AddnewcontactComponent } from './contract/contractadd/addnewcontact/addnewcontact.component';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  decimal: ",",
  precision: 0,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

const routes: Routes = [
    {
        path      : '',
        component : ProductsComponent,
        children  : [
          {
            path        : 'contract-add',
            component   : ContractaddComponent
          },
          {
            path        : 'contract-edit/:id_product',
            component   : ContracteditComponent
          },
          {
            path        : 'contract/mediartu',
            component   : MediartuComponent
          },
          {
            path        : 'contract/mediartu/:id',
            component   : MediartudetailComponent
          },
          {
            path        : 'contract/dioxin',
            component   : DioxineComponent
          },
          {
            path        : 'finance',
            component   : InvoiceproductComponent
          },
          {
            path        : 'finance/:id',
            component   : DetailinvoiceproductComponent
          },
          {
            path        : 'approve-finance',
            component   : ApproveInvoiceComponent
          },
          {
            path        : 'approve-lab',
            component   : ApprovalLabComponent
          },
          {
            path        : 'mediartu-lab',
            component   : MediartuLabComponent
          },
          {
            path        : 'mediartu-lab/:id',
            component   : UpdateformComponent
          },
          {
            path        : 'dashboard',
            component   : DashboardComponent
          },
          {
            path      : 'pdf-contract/:id',
            loadChildren: () => import('app/main/products/contract/mediartu/page/contractpdf/contractpdf.module').then(k => k.ContractpdfModule)
        },
          {
            path        : '**',
            redirectTo  : 'dashboard'
          }
        ] 
    },
  ];
  
  @NgModule({
    declarations: [
      ProductsComponent,
      ContractaddComponent,
      MediartuComponent,
      MediartuFinanceComponent,
      DioxineComponent,
      InvoiceproductComponent,
      DetailinvoiceproductComponent,
      MediartudetailComponent,
      ContracteditComponent,
      ApproveInvoiceComponent,
      PaymentsComponent,
      ApprovalLabComponent,
      DetailApproveComponent,
      MediartuLabComponent,
      UpdateformComponent,
      AttachmentproductComponent,
      CameraphotoComponent,
      DashboardComponent,
      SendingProductComponent,
      ProgressProductComponent,
      RevisionComponent,
      AddnewcontactComponent,
    ],
    imports: [
      CommonModule,
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
      WebcamModule,
      MatToolbarModule
    ],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: {} },
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }},
      { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }],
      
    bootstrap   : [
      ProductsComponent
    ]
  })
  export class ProductsModule { }
  