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
import {MatTooltipModule} from '@angular/material/tooltip'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
// fuse
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

// install
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';

// core
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { HrisComponent } from './hris.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee/employee.component';
import { EmployeeDetComponent } from './employee/employee-det/employee-det.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { StatusModalComponent } from './attendance/status-modal/status-modal.component';
import { DescModalComponent } from './attendance/desc-modal/desc-modal.component';
import { StatusAttendanceComponent } from './status-attendance/status-attendance.component';
import { RulesAttendanceComponent } from './rules-attendance/rules-attendance.component';
import { ModalStatusAttendanceComponent } from './status-attendance/modal-status-attendance/modal-status-attendance.component';
import { ModalRulesAttendanceComponent } from './rules-attendance/modal-rules-attendance/modal-rules-attendance.component';
import { DivisionComponent } from './division/division.component';
import { ModalDivisionComponent } from './division/modal-division/modal-division.component';
import { ModalRulesComponent } from './attendance/modal-rules/modal-rules.component';
import { SubdivComponent } from './subdiv/subdiv.component';
import { ModalSubdivComponent } from './subdiv/modal-subdiv/modal-subdiv.component';
import { DepartementComponent } from './departement/departement.component';
import { ModalDepartemenComponent } from './departement/modal-departemen/modal-departemen.component';
import { LevelComponent } from './level/level.component';
import { ModalLevelComponent } from './level/modal-level/modal-level.component';
import { ModalDateComponent } from './attendance/modal-date/modal-date.component';
import { ModalTimetableforComponent } from './attendance/modal-timetablefor/modal-timetablefor.component';
import { FromToAttendaceComponent } from './attendance/from-to-attendace/from-to-attendace.component';
import { DayoffModalsComponent } from './attendance/dayoff-modals/dayoff-modals.component';
import { DayoffAddModalsComponent } from './attendance/dayoff-add-modals/dayoff-add-modals.component';
import { ViewEmployeeComponent } from './employee/view-employee/view-employee.component';
import { EmployeementDetailComponent } from './employee/employeement-detail/employeement-detail.component';
import { EmployeementStatusComponent } from './employee/employeement-status/employeement-status.component';
import { EmployeementLevelComponent  } from './employee/employeement-level/employeement-level.component';
import { PositionComponent } from './position/position/position.component';
import { ModalLateComponent } from './dashboard/modal-late/modal-late.component';
import { ModalLateYesterdayComponent } from './dashboard/modal-late-yesterday/modal-late-yesterday.component';
import { ModalLateMonthComponent } from './dashboard/modal-late-month/modal-late-month.component';
import { ModalLateYearComponent } from './dashboard/modal-late-year/modal-late-year.component';
import { LeaveComponent } from './leave/leave.component';
import { ModalLeaveComponent } from './leave/modal-leave/modal-leave.component';
import { DashboardGlobalComponent } from './dashboard-global/dashboard-global.component';
import { LeaveDetailComponent } from './leave/leave-detail/leave-detail.component';
import { LeaveApprovelComponent } from './leave-approvel/leave-approvel.component';
import { PositionTreeComponent } from './position-tree/position-tree.component';
import { ModalPositionComponent } from './position/position/modal-position/modal-position.component';
import { ReportAttendanceComponent } from './attendance/report-attendance/report-attendance.component';
import { EmployeeProfileComponent } from './employee/employee-profile/employee-profile.component';
import { AddEmployeeComponent } from './employee/add-employee/add-employee.component';
import { StatusInformationComponent } from './employee/add-employee/status-information/status-information.component';
import { AdministrativeInformationComponent } from './employee/add-employee/administrative-information/administrative-information.component';
import { EducationInformationComponent } from './employee/add-employee/education-information/education-information.component';
import { EditEmployeeComponent } from './employee/edit-employee/edit-employee.component';
import { SisterCompanyComponent } from './sister-company/sister-company.component';
import { DetailsComponent } from './sister-company/modal/details/details.component';
import { StatusActiveComponent } from './employee/employee-profile/status-active/status-active.component';
import { DescDialogComponent } from './employee/employee-profile/desc-dialog/desc-dialog.component';
import { TrainingComponent } from './training/training.component';
import { AddTrainingComponent } from './training/add-training/add-training.component';
import { EmployeeNotestoComponent } from './employee/employee-notesto/employee-notesto.component';
import { SetStatusMoreComponent } from './attendance/set-status-more/set-status-more.component';
import { HistoryComponent } from './employee/history/history.component';


const routes: Routes = [
  {
      path      : '',
      component : HrisComponent,
      children  : [
        {
          path        : 'dashboard',
          component   : DashboardComponent
        },
        {
          path        : 'employee',
          component   : EmployeeComponent
        },
        {
          path        : 'history-employee',
          component   : HistoryComponent
        },
        {
          path        : 'rules-attendance',
          component   : RulesAttendanceComponent
        },
        {
          path        : 'division',
          component   : DivisionComponent
        },
        {
          path        : 'departement',
          component   : DepartementComponent
        },
        {
          path        : 'sistercompany',
          component   : SisterCompanyComponent
        },
        {
          path        : 'sub-division',
          component   : SubdivComponent
        },
        {
          path        : 'status-attendance',
          component   : StatusAttendanceComponent
        },
        // {
        //   path        : 'employee/:id',
        //   component   : EmployeeDetComponent
        // },
        {
          path        : 'level',
          component   : LevelComponent
        },
        {
          path        : 'attendance',
          component   : AttendanceComponent
        },
        {
          path        : 'leave',
          component   : LeaveComponent
        },
        {
          path        : 'leave/add',
          component   : ModalLeaveComponent
        },
        {
          path        : 'leave/leave-detail',
          component   : LeaveDetailComponent
        },
        {
          path        : 'leave-approvel',
          component   : LeaveApprovelComponent
        },
        {
          path        : 'dayoff-modals',
          component   : DayoffModalsComponent
        },
        {
          path        : 'modal-rules',
          component   : ModalRulesComponent
        },
        {
          path        : 'position',
          component   : PositionComponent
        },
        {
          path        : 'report-attendance',
          component   : ReportAttendanceComponent
        },
        {
          path        : 'employee/:id',
          component   : EmployeeProfileComponent
        },
        {
          path        : 'add-employee',
          component   : AddEmployeeComponent
        },
        {
          path        : 'training',
          component   : TrainingComponent
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
    HrisComponent,
    DashboardComponent,
    EmployeeComponent,
    EmployeeDetComponent,
    AttendanceComponent,
    AddTrainingComponent,
    StatusModalComponent,
    DescModalComponent,
    StatusAttendanceComponent,
    RulesAttendanceComponent,
    ModalStatusAttendanceComponent,
    ModalRulesAttendanceComponent,
    DivisionComponent,
    ModalDivisionComponent,
    ModalRulesComponent,
    SubdivComponent,
    ModalSubdivComponent,
    DepartementComponent,
    ModalDepartemenComponent,
    LevelComponent,
    ModalLevelComponent,
    ModalDateComponent,
    ModalTimetableforComponent,
    FromToAttendaceComponent,
    DayoffModalsComponent,
    DayoffAddModalsComponent,
    ViewEmployeeComponent,
    EmployeementDetailComponent,
    EmployeementStatusComponent,
    EmployeementLevelComponent,
    PositionComponent,
    ModalLateComponent,
    ModalLateYesterdayComponent,
    ModalLateMonthComponent,
    ModalLateYearComponent,
    LeaveComponent,
    LeaveApprovelComponent,
    LeaveDetailComponent,
    ModalLeaveComponent,
    DashboardGlobalComponent,
    PositionTreeComponent,
    ModalPositionComponent,
    ReportAttendanceComponent,
    EmployeeProfileComponent,
    AddEmployeeComponent,
    StatusInformationComponent,
    AdministrativeInformationComponent,
    EducationInformationComponent,
    EditEmployeeComponent,
    SisterCompanyComponent,
    DetailsComponent,
    StatusActiveComponent,
    DescDialogComponent,
    TrainingComponent,
    EmployeeNotestoComponent,
    SetStatusMoreComponent,
    HistoryComponent,
  ],
  imports: [
    HttpClientModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatChipsModule,
    MatRippleModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatFabMenuModule,
    MatNativeDateModule,
    NgxDatatableModule,
    MatCheckboxModule,
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
    MatTooltipModule,
    NgxChartsModule,
    InfiniteScrollModule,
    MatInputModule,
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
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    NgSelectModule,
    NgxChartsModule,
    MatGridListModule,
    FuseSharedModule,
    FuseWidgetModule,
  ],
  providers: [
    StatusModalComponent, 
    DescModalComponent,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }}],
  bootstrap   : [
    HrisComponent
  ]
})
export class HrisModule { }
