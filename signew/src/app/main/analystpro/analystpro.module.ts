import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { CurrencyPipe } from "@angular/common";
import { DatePipe } from "@angular/common";

import { NgForOf } from "@angular/common";
// material
import { MatTreeModule } from "@angular/material/tree";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatRippleModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDividerModule } from "@angular/material/divider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgxSpinnerModule } from "ngx-spinner";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
// fuse
import { FuseSharedModule } from "@fuse/shared.module";
import { QrCodeModule } from "ng-qrcode";
import { FuseWidgetModule } from "@fuse/components/widget/widget.module";
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,
} from "@fuse/components";
import { NgxPrintModule } from "ngx-print";
import { NgxDropzoneModule } from "ngx-dropzone";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatRadioModule } from "@angular/material/radio";
// install
import { FormsModule } from "@angular/forms";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MdePopoverModule } from "@material-extended/mde";
import { MatFabMenuModule } from "@angular-material-extensions/fab-menu";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgSelectModule } from "@ng-select/ng-select";
import { AngularSvgIconModule } from "angular-svg-icon";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { WebcamModule } from "ngx-webcam";
import { DynamicHooksModule } from "ngx-dynamic-hooks";
import { HookParserEntry } from "ngx-dynamic-hooks";
import { NgImageSliderModule } from "ng-image-slider";
import { MatBadgeModule } from "@angular/material/badge";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AnalystproComponent } from "./analystpro.component";
import { ContractComponent } from "./contract/contract/contract.component";
import { ContractDetComponent } from "./contract/contract-det/contract-det.component";
import { ModalPhotoComponent } from "./modal/modal-photo/modal-photo.component";
import { ParameterModalComponent } from "./modal/parameter-modal/parameter-modal.component";
import { CustomershandleModalComponent } from "./modal/customershandle-modal/customershandle-modal.component";
import { CustomerComponent } from "./master/customers/customer/customer.component";
import { CustomerDetComponent } from "./master/customers/customer-det/customer-det.component";
import { CustomerAddressComponent } from "./master/customer-address/customer-address/customer-address.component";
import { CustomerAddressDetComponent } from "./master/customer-address/customer-address-det/customer-address-det.component";
import { CatalogueComponent } from "./master/catalogue/catalogue/catalogue.component";
import { CatalogueDetComponent } from "./master/catalogue/catalogue-det/catalogue-det.component";
import { SubcatalogueComponent } from "./master/subcatalogue/subcatalogue/subcatalogue.component";
import { SubcatalogueDetComponent } from "./master/subcatalogue/subcatalogue-det/subcatalogue-det.component";
import { ParameterujiComponent } from "./master/parameteruji/parameteruji/parameteruji.component";
import { ParameterujiDetComponent } from "./master/parameteruji/parameteruji-det/parameteruji-det.component";
import { StandartComponent } from "./master/standart/standart/standart.component";
import { StandartDetComponent } from "./master/standart/standart-det/standart-det.component";
import { LodComponent } from "./master/lod/lod/lod.component";
import { LodDetComponent } from "./master/lod/lod-det/lod-det.component";
import { MetodeComponent } from "./master/metode/metode/metode.component";
import { MetodeDetComponent } from "./master/metode/metode-det/metode-det.component";
import { PaketujiComponent } from "./master/paketuji/paketuji/paketuji.component";
import { PaketujiDetComponent } from "./master/paketuji/paketuji-det/paketuji-det.component";
import { LabComponent } from "./master/lab/lab/lab.component";
import { LabDetComponent } from "./master/lab/lab-det/lab-det.component";
import { ContractcategoryComponent } from "./master/contractcategory/contractcategory/contractcategory.component";
import { ContractcategoryDetComponent } from "./master/contractcategory/contractcategory-det/contractcategory-det.component";
import { ParametertypeComponent } from "./master/parametertype/parametertype/parametertype.component";
import { ParametertypeDetComponent } from "./master/parametertype/parametertype-det/parametertype-det.component";
import { ParametertypeService } from "./master/parametertype/parametertype.service";
import { CustomertaxaddressComponent } from "./master/customertaxaddress/customertaxaddress/customertaxaddress.component";
import { CustomertaxaddressDetComponent } from "./master/customertaxaddress/customertaxaddress-det/customertaxaddress-det.component";
import { PaketparameterComponent } from "./master/paketparameter/paketparameter/paketparameter.component";
import { PaketparameterDetComponent } from "./master/paketparameter/paketparameter-det/paketparameter-det.component";

// import { ContractTrackComponent } from './contract-track/contract-track/contract-track.component';
import { PhoneCustomersComponent } from "./master/phone-customers/phone-customers/phone-customers.component";
import { PhoneCustomersDetComponent } from "./master/phone-customers/phone-customers-det/phone-customers-det.component";
import { SamplingModalComponent } from "./modal/sampling-modal/sampling-modal.component";
import { AkgModalComponent } from "./modal/akg-modal/akg-modal.component";
import { SamplingComponent } from "./master/sampling/sampling/sampling.component";
import { SamplingDetComponent } from "./master/sampling/sampling-det/sampling-det.component";

import { KendaliComponent } from "./kendali/kendali/kendali.component";
import { KendaliDetailComponent } from "./kendali/kendali-detail/kendali-detail.component";
import { ParameterlistComponent } from "./kendali/kendali-detail/parameterlist/parameterlist.component";
import { ModalKendaliComponent } from "./kendali/modal-kendali/modal-kendali.component";
import { DetailsComponent } from "./kendali/kendali-detail/sidebars/details/details.component";

import { AkgComponent } from "./master/akg/akg/akg.component";
import { AkgDetComponent } from "./master/akg/akg-det/akg-det.component";
import { ContactPersonComponent } from "./master/contact-person/contact-person/contact-person.component";
import { ContactPersonDetComponent } from "./master/contact-person/contact-person-det/contact-person-det.component";
import { CustomerHandleComponent } from "./master/customer-handle/customer-handle/customer-handle.component";
import { CustomerHandleDetComponent } from "./master/customer-handle/customer-handle-det/customer-handle-det.component";
import { AddressCustomerComponent } from "./modal/address-customer/address-customer.component";
import { TaxAddressCustomerComponent } from "./modal/tax-address-customer/tax-address-customer.component";
import { PreviewContractComponent } from "./preview-contract/preview-contract.component";
import { PreparationComponent } from "./preparation/preparation/preparation.component";
import { PreparationDetComponent } from "./preparation/preparation-det/preparation-det.component";
import { SampleListComponent } from "./preparation/preparation-det/sample-list/sample-list.component";
import { SidebarParameterComponent } from "./preparation/preparation-det/sidebar-parameter/sidebar-parameter.component";
import { ModalbobotComponent } from "./preparation/preparation-det/modalbobot/modalbobot.component";
import { UnitComponent } from "./master/unit/unit/unit.component";
import { UnitDetComponent } from "./master/unit/unit-det/unit-det.component";
import { ModalKendaliDetailComponent } from "./kendali/kendali-detail/modal-kendali-detail/modal-kendali-detail.component";
import { ModalParameterlistComponent } from "./kendali/kendali-detail/modal-parameterlist/modal-parameterlist.component";
import { ModalDetailsComponent } from "./kendali/kendali-detail/sidebars/modal-details/modal-details.component";
import { SampleUjiComponent } from "./sample-uji/sample-uji/sample-uji.component";
import { SampleUjiDetComponent } from "./sample-uji/sample-uji-det/sample-uji-det.component";
import { LabPengujianComponent } from "./lab-pengujian/lab-pengujian/lab-pengujian.component";
import { UserProfilComponent } from "./user-profil/user-profil/user-profil.component";
import { UserProfilDetComponent } from "./user-profil/user-profil-det/user-profil-det.component";
import { CertificateComponent } from "./certificate/junior/certificate/certificate.component";
import { CertificateDetComponent } from "./certificate/junior/certificate-det/certificate-det.component";
import { ModalSampleComponent } from "./certificate/junior/modal-sample/modal-sample.component";
import { ControlComponent } from "./control/control/control.component";
import { ControlDetComponent } from "./control/control-det/control-det.component";
import { SampleModalsComponent } from "./control/control-modals/sample-modals/sample-modals.component";
import { ControlParameterComponent } from "./control/control-parameter/control-parameter.component";
import { ParameterModalsComponent } from "./control/control-modals/parameter-modals/parameter-modals.component";
import { ImageModalComponent } from "./modal/image-modal/image-modal.component";
import { ViewContractComponent } from "./view-contract/view-contract/view-contract.component";
import { ViewContractDetComponent } from "./view-contract/view-contract-det/view-contract-det.component";
import { DescModalComponent } from "./modal/desc-modal/desc-modal.component";
import { DescriptionModalsComponent } from "./control/control-modals/description-modals/description-modals.component";
import { SamplelabComponent } from "./certificate/junior/samplelab/samplelab.component";
import { LembarhasilComponent } from "./certificate/junior/lembarhasil/lembarhasil.component";
import { InvoiceComponent } from "./preview/invoice/invoice.component";
import { KeuanganComponent } from "./keuangan/keuangan/keuangan.component";
import { InvoiceFinanceComponent } from "./keuangan/invoice/invoice.component";
import { KeuanganDetComponent } from "./keuangan/keuangan-det/keuangan-det.component";
import { PreviewKendaliComponent } from "./preview-kendali/preview-kendali/preview-kendali.component";
import { PdfCertificateComponent } from "./certificate/pdf-certificate/pdf-certificate.component";
import { ModalDateComponent } from "./lab-pengujian/modal-date/modal-date.component";
import { LabApprovalComponent } from "./lab-approval/lab-approval/lab-approval.component";
import { LabApprovalDetComponent } from "./lab-approval/lab-approval-det/lab-approval-det.component";
import { ModalFormathasilComponent } from "./lab-pengujian/modal-formathasil/modal-formathasil.component";
import { ModalGalleryComponent } from "./lab-pengujian/modal-gallery/modal-gallery.component";
import { MenuComponent } from "./master/menu/menu/menu.component";
import { CertmodalsComponent } from "./certificate/junior/modals/certmodals/certmodals.component";
import { ModalDateKeuanganComponent } from "./keuangan/modal-date-keuangan/modal-date-keuangan.component";
import { ParameterujiAddComponent } from "./master/parameteruji/parameteruji-add/parameteruji-add.component";
import { ContractPartComponent } from "./contract/component/contract-part/contract-part.component";
import { SamplePartComponent } from "./contract/component/sample-part/sample-part.component";
import { ParameterPartComponent } from "./contract/component/parameter-part/parameter-part.component";
import { PricingPartComponent } from "./contract/component/pricing-part/pricing-part.component";
import { FormmodalsComponent } from "./certificate/junior/modals/formmodals/formmodals.component";
import { ParameterCertificatemodalsComponent } from "./certificate/junior/modals/parametermodals/parametermodals.component";
import { PhotoModalsComponent } from "./control/control-modals/photo-modals/photo-modals.component";
import { PhotoSamplePartComponent } from "./contract/component/photo-sample-part/photo-sample-part.component";
import { ParameterPartModalComponent } from "./contract/component/parameter-part-modal/parameter-part-modal.component";
import { MouComponent } from "./master/mou/mou/mou.component";
import { MouDetComponent } from "./master/mou/mou-det/mou-det.component";
import { MouPengujianComponent } from "./master/mou/mou-pengujian/mou-pengujian.component";
import { MouDiscountComponent } from "./master/mou/mou-discount/mou-discount.component";
import { PaketPkmComponent } from "./master/paket-pkm/paket-pkm/paket-pkm.component";
import { PaketPkmDetComponent } from "./master/paket-pkm/paket-pkm-det/paket-pkm-det.component";
import { ModalPaketPkmComponent } from "./master/paket-pkm/modal-paket-pkm/modal-paket-pkm.component";
import { PaketparameterModalComponent } from "./master/paketparameter/paketparameter-modal/paketparameter-modal.component";
import { GroupAnalisComponent } from "./master/group-analis/group-analis/group-analis.component";
import { AddgroupComponent } from "./master/group-analis/modals/addgroup/addgroup.component";
import { EditGroupComponent } from "./master/group-analis/modals/edit-group/edit-group.component";
import { ControlPdfComponent } from "./control/control-pdf/control-pdf.component";
import { CertificateApprovalComponent } from "./certificate/manager/certificate/approval/approval.component";
import { ApproveModalComponent } from "./certificate/manager/certificate/modals/approve-modal/approve-modal.component";
import { MenuAuthComponent } from "./menu-auth/menu-auth.component";
import { KontrakDetComponent } from "./contract/kontrak-det/kontrak-det.component";
import { ModalParameterComponent } from "./contract/modal-parameter/modal-parameter.component";
import { ModalPhotoParameterComponent } from "./contract/modal-photo-parameter/modal-photo-parameter.component";
import { ModalAddPhotoComponent } from "./contract/modal-add-photo/modal-add-photo.component";
import { ModalComponentComponent } from "./master/menu/modal-component/modal-component.component";
import { DescriptionModalContractComponent } from "./modal/description-modal-contract/description-modal-contract.component";
import { ContactPersonAddComponent } from "./modal/contact-person-add/contact-person-add.component";

import { DataUpdateComponent } from "./certificate/manager/certificate/modals/data-update/data-update.component";
import { ModalPhotoViewcontractComponent } from "./view-contract/modal/modal-photo-viewcontract/modal-photo-viewcontract.component";
import { ArchiveComponent } from "./certificate/archive/archive.component";
import { RevisionComponent } from "./certificate/revision/revision.component";
import { RevisionContractComponent } from "./revision-contract/revision-contract/revision-contract.component";
import { RevisionContractDetComponent } from "./revision-contract/revision-contract-det/revision-contract-det.component";
import { ChatInternalComponent } from "./modal/chat-internal/chat-internal.component";
import { ModalRevisiParamComponent } from "./revision-contract/modal-revisi-param/modal-revisi-param.component";
import { AdminComponent } from "./certificate/manager/certificate/admin/admin.component";
import { ModalResultComponent } from "./certificate/manager/certificate/modals/modal-result/modal-result.component";
import { SelectTeamComponent } from "./certificate/manager/certificate/modals/select-team/select-team.component";
import { GroupComponent } from "./master/group/group.component";
import { MemocontroldialogComponent } from "./preparation/preparation-det/memocontroldialog/memocontroldialog.component";
import { MemopreparationdialogComponent } from "./preparation/preparation-det/memopreparationdialog/memopreparationdialog.component";
import { ResultofanalysisComponent } from "./certificate/manager/certificate/resultofanalysis/resultofanalysis.component";
import { DescriptionComponent } from "./sample-uji/modals/description/description.component";
import { HistorypreparationComponent } from "./preparation/historypreparation/historypreparation.component";
import { SampleDataComponent } from "./certificate/manager/certificate/modals/sample-data/sample-data.component";
import { ModalLateCommentComponent } from "./lab-pengujian/modal-late-comment/modal-late-comment.component";
import { ModalInformationComponent } from "./lab-pengujian/modal-information/modal-information.component";
import { AddresslistDialogComponent } from "./certificate/junior/modals/addresslist-dialog/addresslist-dialog.component";
import { AdmindetailComponent } from "./certificate/manager/certificate/admin/admindetail/admindetail.component";
import { ArchivedetailComponent } from "./certificate/archive/archivedetail/archivedetail.component";
import { DetailsamplelabComponent } from "./certificate/junior/modals/detailsamplelab/detailsamplelab.component";
import { AddakgComponent } from "./certificate/junior/modals/akg/addakg/addakg.component";
import { AkgmodalsComponent } from "./certificate/junior/modals/akg/akgmodals/akgmodals.component";
import { InformationdialogComponent } from "./certificate/manager/certificate/modals/informationdialog/informationdialog.component";
import { FinderComponent } from "./finder/finder.component";
import { MouModalsComponent } from "./master/mou/mou-modals/mou-modals.component";
import { ChangeConditionComponent } from "./certificate/archive/modals/change-condition/change-condition.component";
import { RevattachmentmodalsComponent } from "./certificate/junior/modals/revattachmentmodals/revattachmentmodals.component";
import { RevisiondataComponent } from "./certificate/junior/modals/revisiondata/revisiondata.component";
import { FinderDetComponent } from "./finder/finder-det/finder-det.component";
import { ModalDetComponent } from "./finder/modal-det/modal-det.component";
import { AddinvoiceComponent } from "./keuangan/invoice/addinvoice/addinvoice.component";
import { InvoiceApproveComponent } from "./keuangan/invoice-approve/invoice-approve.component";
import { InvoiceDetComponent } from "./keuangan/invoice-det/invoice-det.component";
import { ReportDateModalsComponent } from "./control/control-modals/report-date-modals/report-date-modals.component";
import { ModalDateComponentFinder } from "app/main/analystpro/finder/modal-date/modal-date.component";
import { GetSampleComponentComponent } from "./lab-pengujian/get-sample-component/get-sample-component.component";
import { LabProccessComponent } from "./lab-pengujian/lab-proccess/lab-proccess.component";
import { LabDoneComponent } from "./lab-pengujian/lab-done/lab-done.component";
import { FinderDetailInformationComponent } from "./finder-detail-information/finder-detail-information.component";
import { MemokendaliprepComponent } from "./lab-pengujian/memokendaliprep/memokendaliprep.component";
import { UserComponent } from "./master/user/user.component";
import { UserModalComponent } from "./master/user/user-modal/user-modal.component";
import { ModalSampleKesimpulanComponent } from "./lab-approval/modal-sample-kesimpulan/modal-sample-kesimpulan.component";
import { ModalInfoComponent } from "./master/customers/modal-info/modal-info.component";
import { VoucherComponent } from "./master/voucher/voucher.component";
import { DetailComponent } from "./master/voucher/detail/detail.component";
import { ModalVocComponent } from "./contract/modal-voc/modal-voc.component";
import { ParameterAllComponent } from "./certificate/junior/modals/parameter-all/parameter-all.component";
import { PaymentcashierComponent } from "./keuangan/paymentcashier/paymentcashier.component";
import { HoldcontractComponent } from "./keuangan/invoice-approve/holdcontract/holdcontract.component";
import { SampleApproveModalComponent } from "./lab-approval/sample-approve-modal/sample-approve-modal.component";
import { EditContractComponent } from "./contract/edit-contract/edit-contract.component";
import { ModalEditContractComponent } from "./contract/modal-edit-contract/modal-edit-contract.component";
import { PhotoPrepComponent } from "./preparation/photo-prep/photo-prep.component";
import { ModalhistoryComponent } from "./preparation/historypreparation/modalhistory/modalhistory.component";
import { GroupDetComponent } from "./master/group/group-det/group-det.component";
import { GroupAddoreditComponent } from "./master/group/group-addoredit/group-addoredit.component";
import { ModalDetailEditContractComponent } from "./contract/edit-contract/modal-detail-edit-contract/modal-detail-edit-contract.component";
import { ModalAkgContractComponent } from "./contract/modal-akg-contract/modal-akg-contract.component";
import { ModalSamplingContractComponent } from "./contract/modal-sampling-contract/modal-sampling-contract.component";

import { ContractStatComponent } from "./keuangan/contract-stat/contract-stat.component";
import { ModalDateLabapproveComponent } from "./lab-approval/modal-date-labapprove/modal-date-labapprove.component";
import { ModalSetContractComponent } from "./certificate/junior/certificate/modal-set-contract/modal-set-contract.component";
import { ModalAttachmentSeeComponent } from "./contract/modal-attachment-see/modal-attachment-see.component";
import { ModalAttachmentContractComponent } from "./contract/modal-attachment-contract/modal-attachment-contract.component";
import { ModalInfofinanceComponent } from "./contract/modal-infofinance/modal-infofinance.component";
import { TrackcertComponent } from "./certificate/trackcert/trackcert.component";
import { MailPopupComponent } from "./contract/mail-popup/mail-popup.component";
import { FollowDataComponent } from "./certificate/manager/certificate/follow-data/follow-data.component";
import { ModalDetailsPaketparameterComponent } from "./master/paketparameter/modal-details-paketparameter/modal-details-paketparameter.component";
import { ControlInfoComponent } from "./certificate/junior/modals/control-info/control-info.component";
import { MemoInternalComponent } from "./control/control-modals/memo-internal/memo-internal.component";
import { MouFormDiscountComponent } from "./master/mou/mou-form-discount/mou-form-discount.component";
import { BacktrackComponent } from "./control/control-modals/backtrack/backtrack.component";
import { HistorycontractComponent } from "./historycontract/historycontract.component";
import { DataFollowComponent } from "./certificate/manager/data-follow/data-follow.component";
import { ComplainQcComponent } from "./complain/complain-qc/complain-qc.component";
import { CsocomplainComponent } from "./complain/csocomplain/csocomplain.component";
import { DescDialogComponent } from "./complain/csocomplain/modals/desc-dialog/desc-dialog.component";
import { AddDialogComponent } from "./complain/csocomplain/modals/add-dialog/add-dialog.component";
import { SelectDialogComponent } from "./complain/csocomplain/modals/select-dialog/select-dialog.component";
import { AddMoreParameterComponent } from "./complain/complain-qc/modals/add-more-parameter/add-more-parameter.component";
import { ModalSetComplainStatusComponent } from "./lab-pengujian/modal-set-complain-status/modal-set-complain-status.component";
import { NontechnicalComponent } from "./complain/nontechnical/nontechnical.component";
import { ActionComplaintComponent } from "./complain/nontechnical/modals/action-complaint/action-complaint.component";
import { ComplainPreparationComponent } from "./complain/complain-preparation/complain-preparation.component";
import { ActionprepComponent } from "./complain/complain-preparation/modals/actionprep/actionprep.component";
import { ParameterEditComponent } from "./certificate/junior/parameter-edit/parameter-edit.component";
import { DynamicModelParamComponent } from "./certificate/junior/modals/dynamic-model-param/dynamic-model-param.component";
import { ListingParameterComponent } from "./certificate/junior/listing-parameter/listing-parameter.component";
import { InformationmodalsqcComponent } from "./complain/complain-qc/modals/informationmodalsqc/informationmodalsqc.component";
import { ModalSamplingRevComponent } from "./revision-contract/modal-sampling-rev/modal-sampling-rev.component";
import { ModalAkgRevComponent } from "./revision-contract/modal-akg-rev/modal-akg-rev.component";
import { ResultmodalcomplainComponent } from "./complain/complain-qc/modals/resultmodalcomplain/resultmodalcomplain.component";
import { ModalParameterRevisionComponent } from "./revision-contract/modal-parameter-revision/modal-parameter-revision.component";
import { ModalPaketParameterComponent } from "./revision-contract/modal-paket-parameter/modal-paket-parameter.component";
import { AdduserComponent } from "./usercustomers/adduser/adduser.component";
import { ContractStatDetComponent } from "./keuangan/contract-stat/contract-stat-det/contract-stat-det.component";
import { SendresultqcComponent } from "./complain/complain-qc/modals/sendresultqc/sendresultqc.component";
import { MemocomplainqcComponent } from "./complain/complain-qc/modals/memocomplainqc/memocomplainqc.component";
import { PenawaranComponent } from "./penawaran/penawaran.component";
import { ModalParamEditComponent } from "./contract/modal-param-edit/modal-param-edit.component";
import { ComplaincertComponent } from "./complain/complaincert/complaincert.component";
import { ModalsComponent } from "./complain/complaincert/modals/modals.component";
import { PenawaranDetComponent } from "./penawaran/penawaran-det/penawaran-det.component";
import { ManualcertificateComponent } from "./certificate/junior/manualcertificate/manualcertificate.component";
import { ModeSetDateRecapComponent } from "./complain/mode-set-date-recap/mode-set-date-recap.component";
import { InfoParamComponent } from "./penawaran/info-param/info-param.component";
import { DashboardfinanceComponent } from "./keuangan/dashboardfinance/dashboardfinance.component";
import { ModalEditPicComponent } from "./finder/modal-edit-pic/modal-edit-pic.component";
import { SpecialinvoiceComponent } from "./keuangan/invoice/specialinvoice/specialinvoice.component";
import { ModalNpwpKtpComponent } from "./contract/modal-npwp-ktp/modal-npwp-ktp.component";
import { AutosendComponent } from "./certificate/manager/certificate/admin/autosend/autosend.component";
import { LabReportComponent } from "app/main/analystpro/report/lab-report/lab-report.component";
import { PenawaranViewComponent } from "./penawaran/penawaran-view/penawaran-view.component";
import { PenawaranViewDetailComponent } from "./penawaran/penawaran-view-detail/penawaran-view-detail.component";
import { ModalHistoryComponent } from "./penawaran/modal-history/modal-history.component";
import { SampleInformationModalComponent } from "./view-contract/modal/sample-information-modal/sample-information-modal.component";
import { ModalDatePenawaranComponent } from "./penawaran/modal-date-penawaran/modal-date-penawaran.component";
import { ModalParameterPenawaranComponent } from "./penawaran/modal-parameter-penawaran/modal-parameter-penawaran.component";
import { SelectOtherTeamComponent } from "./certificate/trackcert/select-other-team/select-other-team.component";
import { ListLhuComponent } from "./certificate/trackcert/list-lhu/list-lhu.component";
import { ComplainQcDetComponent } from "./complain/complain-qc/complain-qc-det/complain-qc-det.component";
import { ExportDataComponent } from "./complain/complain-preparation/modals/export-data/export-data.component";
import { CustomerDetailComponent } from "./master/customers/customer-detail/customer-detail.component";
import { CustomerTaxAddress } from "./master/customers/customer-detail/add-customerTaxAddress/customerTaxAddress.component";
import { AddCustomerHandler } from "./master/customers/customer-detail/add-customerHandler/add-customerHandler.component";
import { AddCustomerMou } from "./master/customers/customer-detail/add-customer-mou/add-customer-mou.component";
import { AddCustomerNpwp } from "./master/customers/customer-detail/add-customer-npwp/add-customer-npwp.component";

const componentParsers: Array<HookParserEntry> = [
    {
        component: ContractPartComponent,
    },
    {
        component: SamplePartComponent,
        enclosing: false, // No need for a closing tag
    },
    {
        component: ParameterPartComponent,
    },
    {
        component: PricingPartComponent,
    },
    {
        component: PhotoSamplePartComponent,
    },
];

const dynamicComponents = [
    ContractPartComponent,
    SamplePartComponent,
    ParameterPartComponent,
    PricingPartComponent,
    PhotoSamplePartComponent,
];

const routes: Routes = [
    {
        path: "",
        component: AnalystproComponent,
        children: [
            {
                path: "dashboard",
                component: DashboardComponent,
                data: {
                    for: "marketing",
                },
            },
            {
                path: "dashboard-lab-gc",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 6,
                },
            },
            {
                path: "dashboard-lab-lcmsms",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 8,
                },
            },
            {
                path: "dashboard-lab-hplc",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 7,
                },
            },
            {
                path: "dashboard-lab-spektro",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 14,
                },
            },
            {
                path: "dashboard-lab-mikro",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 10,
                },
            },
            {
                path: "dashboard-lab-biotek",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 3,
                },
            },
            {
                path: "dashboard-lab-logam",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 9,
                },
            },
            {
                path: "dashboard-lab-proksimat",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 12,
                },
            },
            {
                path: "dashboard-lab-farmasi",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 22,
                },
            },
            {
                path: "dashboard-lab-kelistrikan",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 31,
                },
            },
            {
                path: "dashboard-lab-rnd1",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 13,
                },
            },
            {
                path: "dashboard-lab-rnd2",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 21,
                },
            },
            {
                path: "dashboard-lab-subkont",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 15,
                },
            },
            {
                path: "dashboard-lab-aslt",
                component: DashboardComponent,
                data: {
                    for: "lab",
                    idlab: 52,
                },
            },
            {
                path: "user-profil",
                component: UserProfilComponent,
            },
            {
                path: "user-profil/:id",
                component: UserProfilDetComponent,
            },
            {
                path: "lab-approval",
                component: LabApprovalComponent,
            },
            {
                path: "user-add",
                component: UserComponent,
            },
            {
                path: "lab-gc",
                component: LabPengujianComponent,
                data: {
                    idlab: 6,
                },
            },
            {
                path: "lab-lcmsms",
                component: LabPengujianComponent,
                data: {
                    idlab: 8,
                },
            },
            {
                path: "lab-hplc",
                component: LabPengujianComponent,
                data: {
                    idlab: 7,
                },
            },
            {
                path: "lab-spektro",
                component: LabPengujianComponent,
                data: {
                    idlab: 14,
                },
            },
            {
                path: "lab-mikrobiologi",
                component: LabPengujianComponent,
                data: {
                    idlab: 10,
                },
            },
            {
                path: "lab-bioteknologi",
                component: LabPengujianComponent,
                data: {
                    idlab: 3,
                },
            },
            {
                path: "lab-logam",
                component: LabPengujianComponent,
                data: {
                    idlab: 9,
                },
            },
            {
                path: "lab-hplc",
                component: LabPengujianComponent,
                data: {
                    idlab: 7,
                },
            },
            {
                path: "lab-rnd-mikrobiologi",
                component: LabPengujianComponent,
                data: {
                    idlab: 72,
                },
            },
            {
                path: "lab-proksimat",
                component: LabPengujianComponent,
                data: {
                    idlab: 12,
                },
            },
            {
                path: "lab-farmasi",
                component: LabPengujianComponent,
                data: {
                    idlab: 22,
                },
            },
            {
                path: "lab-kelistrikan",
                component: LabPengujianComponent,
                data: {
                    idlab: 31,
                },
            },
            {
                path: "lab-rnd1",
                component: LabPengujianComponent,
                data: {
                    idlab: 13,
                },
            },
            {
                path: "lab-fisik-mekanik",
                component: LabPengujianComponent,
                data: {
                    idlab: 74,
                },
            },
            {
                path: "lab-rnd2",
                component: LabPengujianComponent,
                data: {
                    idlab: 21,
                },
            },
            {
                path: "lab-subkon",
                component: LabPengujianComponent,
                data: {
                    idlab: 15,
                },
            },
            {
                path: "lab-aslt",
                component: LabPengujianComponent,
                data: {
                    idlab: 52,
                },
            },
            {
                path: "menu",
                component: MenuComponent,
            },

            {
                path: "lab-approval-det/:id",
                component: LabApprovalDetComponent,
            },
            {
                path: "contract",
                component: ContractComponent,
            },
            {
                path: "contract/:id",
                component: ContractDetComponent,
            },
            {
                path: "kontrak/:id",
                component: KontrakDetComponent,
            },
            {
                path: "contract-preview",
                component: PreviewContractComponent,
            },
            {
                path: "view-contract/:id",
                component: ViewContractComponent,
            },
            {
                path: "keuangan",
                component: KeuanganComponent,
            },
            {
                path: "keuangan/:id",
                component: KeuanganDetComponent,
            },
            {
                path: "report/lab",
                component: LabReportComponent,
            },
            {
                path: "view-penawaran/:id",
                component: PenawaranViewComponent,
            },
            {
                path: "lab-rnd-3",
                component: LabPengujianComponent,
                data: {
                    idlab: 55,
                },
            },
            {
                path: "preview-kendali",
                component: PreviewKendaliComponent,
            },
            {
                path: "preparation",
                component: PreparationComponent,
            },
            {
                path: "preparation/:id",
                component: PreparationDetComponent,
            },

            {
                path: "sample-uji",
                component: SampleUjiComponent,
            },
            {
                path: "qc",
                component: ComplainQcComponent,
            },
            {
                path: "qc/:id",
                component: ComplainQcDetComponent,
            },
            {
                path: "sample-uji/:id",
                component: SampleUjiDetComponent,
            },
            {
                path: "finder/:id",
                component: FinderDetComponent,
            },
            {
                path: "finder",
                component: FinderComponent,
            },
            {
                path: "mou",
                component: MouComponent,
            },
            {
                path: "mou/:id",
                component: MouDetComponent,
            },
            {
                path: "customers",
                component: CustomerComponent,
            },
            {
                path: "customers/:id",
                component: CustomerDetComponent,
            },
            {
                path: "customers/detail/:id",
                component: CustomerDetailComponent,
            },
            {
                path: "customeraddress",
                component: CustomerAddressComponent,
            },
            {
                path: "customeraddress/:id",
                component: CustomerAddressDetComponent,
            },
            {
                path: "catalogue",
                component: CatalogueComponent,
            },
            {
                path: "catalogue/:id",
                component: CatalogueDetComponent,
            },
            {
                path: "subcatalogue",
                component: SubcatalogueComponent,
            },
            {
                path: "subcatalogue/:id",
                component: SubcatalogueDetComponent,
            },
            {
                path: "parameteruji",
                component: ParameterujiComponent,
            },
            {
                path: "parameteruji/:id",
                component: ParameterujiDetComponent,
            },
            {
                path: "standart",
                component: StandartComponent,
            },
            {
                path: "standart/:id",
                component: StandartDetComponent,
            },
            {
                path: "voucher",
                component: VoucherComponent,
            },
            {
                path: "voucher/:id",
                component: DetailComponent,
            },
            {
                path: "lod",
                component: LodComponent,
            },
            {
                path: "lod/:id",
                component: LodDetComponent,
            },
            {
                path: "unit",
                component: UnitComponent,
            },
            {
                path: "unit/:id",
                component: UnitDetComponent,
            },
            {
                path: "history-contract",
                component: HistorycontractComponent,
            },
            {
                path: "metode",
                component: MetodeComponent,
            },
            {
                path: "metode/:id",
                component: MetodeDetComponent,
            },
            {
                path: "paketuji",
                component: PaketujiComponent,
            },
            {
                path: "paketuji/:id",
                component: PaketujiDetComponent,
            },
            {
                path: "lab",
                component: LabComponent,
            },
            {
                path: "lab/:id",
                component: LabDetComponent,
            },
            {
                path: "contract-category",
                component: ContractcategoryComponent,
            },
            {
                path: "contract-category/:id",
                component: ContractcategoryDetComponent,
            },
            {
                path: "parameter-type",
                component: ParametertypeComponent,
            },
            {
                path: "parameter-type/:id",
                component: ParametertypeDetComponent,
            },
            {
                path: "customer-taxaddress",
                component: CustomertaxaddressComponent,
            },
            {
                path: "customer-taxaddress/:id",
                component: CustomertaxaddressDetComponent,
            },
            {
                path: "paket-parameter",
                component: PaketparameterComponent,
            },
            {
                path: "paket-parameter/:id",
                component: PaketparameterDetComponent,
            },
            {
                path: "paket-special",
                component: PaketPkmComponent,
            },
            {
                path: "paket-special/:id",
                component: PaketPkmDetComponent,
            },
            // {
            //   path        : 'scanner-contract/:id',
            //   component   : ContractTrackComponent
            // },
            {
                path: "kendali",
                component: KendaliComponent,
            },
            {
                path: "kendali/:id",
                component: KendaliDetailComponent,
            },
            {
                path: "contact-person",
                component: ContactPersonComponent,
            },
            {
                path: "contact-person/:id",
                component: ContactPersonDetComponent,
            },
            {
                path: "admin-certificate",
                component: AdminComponent,
            },
            {
                path: "admin-certificate/:id",
                component: AdmindetailComponent,
            },
            {
                path: "auto-sending",
                component: AutosendComponent,
            },
            {
                path: "certificate",
                component: CertificateComponent,
            },
            {
                path: "certificate/:id",
                component: CertificateDetComponent,
            },
            {
                path: "certificate/:id/samplelab",
                component: SamplelabComponent,
            },
            {
                path: "certificate/:id/lhu",
                component: LembarhasilComponent,
            },
            // {
            //   path        : 'pdf-certificate/:id_lhu/:lang',
            //   component   : PdfCertificateComponent,
            // },
            {
                path: "control",
                component: ControlComponent,
            },
            {
                path: "control/:id",
                component: ControlDetComponent,
            },
            {
                path: "control/sample/:id",
                component: ControlParameterComponent,
            },
            {
                path: "group-analyst",
                component: GroupComponent,
            },
            {
                path: "penawaran",
                component: PenawaranComponent,
            },
            {
                path: "penawaran-det/:id",
                component: PenawaranDetComponent,
            },
            {
                path: "resultofanalysis",
                component: CertificateApprovalComponent,
            },
            {
                path: "archive-certificate",
                component: ArchiveComponent,
            },
            {
                path: "archive-certificate/:id",
                component: ArchivedetailComponent,
            },
            {
                path: "revision-certificate",
                component: RevisionComponent,
            },
            {
                path: "client-handling",
                component: RevisionContractComponent,
            },
            {
                path: "revision-contract/:id",
                component: RevisionContractDetComponent,
            },
            {
                path: "edit-contract/:id",
                component: EditContractComponent,
            },
            {
                path: "result-of-analysis",
                component: ResultofanalysisComponent,
            },
            {
                path: "history-preparation",
                component: HistorypreparationComponent,
            },
            {
                path: "finance-invoice",
                component: InvoiceFinanceComponent,
            },
            {
                path: "finance-invoice/add",
                component: AddinvoiceComponent,
            },
            {
                path: "finance-approve",
                component: InvoiceApproveComponent,
            },
            {
                path: "finance-invoice/:id",
                component: InvoiceDetComponent,
            },
            // {
            //   path        : 'get-sample',
            //   component   : GetSampleComponentComponent
            // },
            // {
            //   path        : 'lab-proccess',
            //   component   : LabProccessComponent
            // },ContractStatComponent
            {
                path: "lab-done",
                component: LabDoneComponent,
            },
            {
                path: "finance-contract",
                component: ContractStatComponent,
            },
            {
                path: "finance-contract/:id",
                component: ContractStatDetComponent,
            },
            {
                path: "track-cert",
                component: TrackcertComponent,
            },
            {
                path: "complain",
                component: CsocomplainComponent,
            },
            {
                path: "nontechnical",
                component: NontechnicalComponent,
            },
            {
                path: "complaint-prep",
                component: ComplainPreparationComponent,
            },
            {
                path: "certificate/lhu/:id_lhu/parameters",
                component: ParameterEditComponent,
            },
            {
                path: "certificate/lhu/:id_lhu/listing-parameters",
                component: ListingParameterComponent,
            },
            {
                path: "user-customer/add",
                component: AdduserComponent,
            },
            {
                path: "cert-complain",
                component: ComplaincertComponent,
            },
            {
                path: "dashboard-finance",
                component: DashboardfinanceComponent,
            },
            {
                path: "result-of-analysis/following-sample",
                component: DataFollowComponent,
            },
            {
                path: "invoice-special",
                component: SpecialinvoiceComponent,
            },
            {
                path: "**",
                redirectTo: "dashboard",
            },
        ],
    },
];

@NgModule({
    declarations: [
        DashboardComponent,
        AnalystproComponent,
        ContractComponent,
        ContractDetComponent,
        ModalPhotoComponent,
        ParameterModalComponent,
        CustomershandleModalComponent,
        CustomerComponent,
        CustomerDetComponent,
        CustomerAddressComponent,
        CustomerAddressDetComponent,
        CatalogueComponent,
        CatalogueDetComponent,
        SubcatalogueComponent,
        SubcatalogueDetComponent,
        ParameterujiComponent,
        ParameterujiDetComponent,
        StandartComponent,
        PenawaranViewDetailComponent,
        StandartDetComponent,
        LodComponent,
        LodDetComponent,
        CertificateApprovalComponent,
        MetodeComponent,
        MetodeDetComponent,
        PaketujiComponent,
        PaketujiDetComponent,
        LabComponent,
        LabDetComponent,
        ContractcategoryComponent,
        ContractcategoryDetComponent,
        ParametertypeComponent,
        ParametertypeDetComponent,
        CustomertaxaddressComponent,
        CustomertaxaddressDetComponent,
        PaketparameterComponent,
        PaketparameterDetComponent,
        // ContractTrackComponent,
        PhoneCustomersComponent,
        PhoneCustomersDetComponent,
        SamplingModalComponent,
        AkgModalComponent,
        LabReportComponent,
        SamplingComponent,
        SamplingDetComponent,
        KendaliComponent,
        KendaliDetailComponent,
        ParameterlistComponent,
        DetailsComponent,
        ModalKendaliComponent,
        AkgComponent,
        AkgDetComponent,
        ContactPersonComponent,
        ContactPersonDetComponent,
        CustomerHandleComponent,
        CustomerHandleDetComponent,
        AddressCustomerComponent,
        TaxAddressCustomerComponent,
        PreviewContractComponent,
        PreparationComponent,
        PreparationDetComponent,
        SampleListComponent,
        SidebarParameterComponent,
        ModalbobotComponent,
        UnitComponent,
        UnitDetComponent,
        ModalKendaliDetailComponent,
        ModalParameterlistComponent,
        ModalDetailsComponent,
        SampleUjiComponent,
        SampleUjiDetComponent,
        LabPengujianComponent,
        UserProfilComponent,
        UserProfilDetComponent,
        CertificateComponent,
        CertificateDetComponent,
        ModalSampleComponent,
        ControlComponent,
        ControlDetComponent,
        SampleModalsComponent,
        ControlParameterComponent,
        ParameterModalsComponent,
        ImageModalComponent,
        ViewContractComponent,
        ViewContractDetComponent,
        DescModalComponent,
        DescriptionModalsComponent,
        SamplelabComponent,
        LembarhasilComponent,
        InvoiceComponent,
        KeuanganComponent,
        KeuanganDetComponent,
        PreviewKendaliComponent,
        //PdfCertificateComponent,
        ModalDateComponent,
        ModalDateComponentFinder,
        LabApprovalComponent,
        LabApprovalDetComponent,
        ModalFormathasilComponent,
        ModalGalleryComponent,
        MenuComponent,
        CertmodalsComponent,
        ContractPartComponent,
        SamplePartComponent,
        ParameterPartComponent,
        ...dynamicComponents,
        PricingPartComponent,
        ModalDateKeuanganComponent,
        FormmodalsComponent,
        ParameterCertificatemodalsComponent,
        PhotoModalsComponent,
        ParameterujiAddComponent,
        PhotoSamplePartComponent,
        ParameterPartModalComponent,
        MouComponent,
        MouDetComponent,
        MouPengujianComponent,
        MouDiscountComponent,
        PaketPkmComponent,
        PaketPkmDetComponent,
        ModalPaketPkmComponent,
        PaketparameterModalComponent,
        ParameterujiAddComponent,
        FormmodalsComponent,
        PhotoModalsComponent,
        FormmodalsComponent,
        ParameterCertificatemodalsComponent,
        ParameterujiAddComponent,
        PhotoSamplePartComponent,
        ParameterPartModalComponent,
        MouComponent,
        MouDetComponent,
        MouPengujianComponent,
        MouDiscountComponent,
        GroupAnalisComponent,
        AddgroupComponent,
        EditGroupComponent,
        ControlPdfComponent,
        CertificateApprovalComponent,
        ApproveModalComponent,
        GroupAnalisComponent,
        AddgroupComponent,
        EditGroupComponent,
        MenuAuthComponent,
        KontrakDetComponent,
        ModalParameterComponent,
        ModalPhotoParameterComponent,
        ModalAddPhotoComponent,
        ModalComponentComponent,
        ContactPersonAddComponent,
        DataUpdateComponent,
        ModalPhotoViewcontractComponent,
        ArchiveComponent,
        RevisionComponent,
        RevisionContractComponent,
        RevisionContractDetComponent,
        ChatInternalComponent,
        ModalRevisiParamComponent,
        AdminComponent,
        ModalResultComponent,
        SelectTeamComponent,
        GroupComponent,
        DescriptionModalContractComponent,
        MemocontroldialogComponent,
        MemopreparationdialogComponent,
        ResultofanalysisComponent,
        DescriptionComponent,
        HistorypreparationComponent,
        SampleDataComponent,
        ModalLateCommentComponent,
        ModalInformationComponent,
        AddresslistDialogComponent,
        AdmindetailComponent,
        ArchivedetailComponent,
        DetailsamplelabComponent,
        AddakgComponent,
        AkgmodalsComponent,
        InformationdialogComponent,
        FinderComponent,
        MouModalsComponent,
        RevattachmentmodalsComponent,
        RevisiondataComponent,
        ChangeConditionComponent,
        InvoiceFinanceComponent,
        AddinvoiceComponent,
        InvoiceApproveComponent,
        InvoiceDetComponent,
        ReportDateModalsComponent,
        GetSampleComponentComponent,
        // LabProccessComponent,
        LabDoneComponent,
        FinderDetailInformationComponent,
        MemokendaliprepComponent,
        UserComponent,
        UserModalComponent,
        ModalSampleKesimpulanComponent,
        ModalInfoComponent,
        VoucherComponent,
        DetailComponent,
        ModalVocComponent,
        ParameterAllComponent,
        PaymentcashierComponent,
        HoldcontractComponent,
        SampleApproveModalComponent,
        PhotoPrepComponent,
        ModalhistoryComponent,
        EditContractComponent,
        ModalEditContractComponent,
        PhotoPrepComponent,
        GroupDetComponent,
        GroupAddoreditComponent,
        ModalDetailEditContractComponent,
        ModalAkgContractComponent,
        ModalSamplingContractComponent,
        ContractStatComponent,
        ModalDateLabapproveComponent,
        ModalSetContractComponent,
        ModalAttachmentSeeComponent,
        ModalAttachmentContractComponent,
        ModalInfofinanceComponent,
        TrackcertComponent,
        MailPopupComponent,
        FollowDataComponent,
        ModalDetailsPaketparameterComponent,
        ControlInfoComponent,
        MouFormDiscountComponent,
        BacktrackComponent,
        HistorycontractComponent,
        DataFollowComponent,
        ComplainQcComponent,
        CsocomplainComponent,
        DescDialogComponent,
        AddDialogComponent,
        SelectDialogComponent,
        AddMoreParameterComponent,
        ModalSetComplainStatusComponent,
        NontechnicalComponent,
        ActionComplaintComponent,
        ComplainPreparationComponent,
        ActionprepComponent,
        ParameterEditComponent,
        DynamicModelParamComponent,
        ListingParameterComponent,
        InformationmodalsqcComponent,
        ModalSamplingRevComponent,
        ModalAkgRevComponent,
        ResultmodalcomplainComponent,
        ModalParameterRevisionComponent,
        ModalPaketParameterComponent,
        AdduserComponent,
        ContractStatDetComponent,
        SendresultqcComponent,
        MemocomplainqcComponent,
        PenawaranComponent,
        ModalParamEditComponent,
        ComplaincertComponent,
        ModalsComponent,
        PenawaranDetComponent,
        ManualcertificateComponent,
        ModeSetDateRecapComponent,
        InfoParamComponent,
        DashboardfinanceComponent,
        ModalEditPicComponent,
        SpecialinvoiceComponent,
        ModalNpwpKtpComponent,
        AutosendComponent,
        PenawaranViewComponent,
        ModalHistoryComponent,
        SampleInformationModalComponent,
        ModalDatePenawaranComponent,
        ModalParameterPenawaranComponent,
        SelectOtherTeamComponent,
        ListLhuComponent,
        ComplainQcDetComponent,
        ExportDataComponent,
        CustomerDetailComponent,
        CustomerTaxAddress,
        AddCustomerHandler,
        AddCustomerMou,
        AddCustomerNpwp,
    ],
    providers: [CurrencyPipe, DatePipe],
    imports: [
        DynamicHooksModule.forRoot({
            globalParsers: componentParsers,
        }),
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        CKEditorModule,
        FontAwesomeModule,
        MatButtonToggleModule,
        ScrollingModule,
        MatBadgeModule,
        MatFabMenuModule,
        MatExpansionModule,
        NgxDatatableModule,
        MatTooltipModule,
        MatCheckboxModule,
        HttpClientModule,
        MdePopoverModule,
        MatCheckboxModule,
        MatTreeModule,
        NgxSpinnerModule,
        RouterModule.forChild(routes),
        MatExpansionModule,
        MatDividerModule,
        QrCodeModule,
        CurrencyMaskModule,
        MatFormFieldModule,
        MatGridListModule,
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
        MatProgressBarModule,
        MatTabsModule,
        InfiniteScrollModule,
        NgSelectModule,
        NgxChartsModule,
        MatInputModule,
        WebcamModule,
        MatButtonModule,
        MatChipsModule,
        MatCardModule,
        MatPaginatorModule,
        AngularSvgIconModule.forRoot(),
        MatSlideToggleModule,
        MatRippleModule,
        MatStepperModule,
        MatSelectModule,
        MatSortModule,
        MatTabsModule,
        MatProgressBarModule,
        NgSelectModule,
        NgxChartsModule,
        MatGridListModule,
        FuseSharedModule,
        FuseWidgetModule,
        FuseSidebarModule,
        NgxPrintModule,
        CommonModule,
        MatBottomSheetModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        DragDropModule,
        NgImageSliderModule,
        ClipboardModule,
        NgxDropzoneModule,
        MatRadioModule,
    ],
    bootstrap: [AnalystproComponent],
    entryComponents: [...dynamicComponents],
})
export class AnalystproModule {}
