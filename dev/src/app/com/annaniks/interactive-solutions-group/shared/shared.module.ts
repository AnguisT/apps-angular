import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MultiSelectModule,
  ProgressSpinnerModule,
  ButtonModule,
} from 'primeng/primeng';
import {
  TopbarComponent,
  ProjectsListComponent,
  ProjectsListItemComponent,
  DropdownModule,
  CommentListComponent,
  CommentListItemComponent,
  LoadingComponent,
  ConfigurationCategoriesComponent,
  LeftMenuComponent,
  ContactsSearchComponent,
  StatisticsMenuComponent,
} from '../components';
import {MatCheckboxModule, MatDialogModule} from '@angular/material';
import {
  ErrorDialog,
  AddObjectDialog,
  AddFilialDepartamentDialog,
} from '../dialogs';
import {OnlyNumber, Autosize} from '../directives';
import {ConfirmDialog} from '../dialogs';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MsgService} from '../services/sharedata';
import {ConfigurationsSearchComponent} from '../components/configurations-search/configurations-search.component';
import {ConfigurationsItemsService} from '../services/configurationsitems.service';
import {MatTabsModule} from '@angular/material/tabs';
import {TaskHeaderComponent} from '../components/task-header/task-header.component';
import {ProjectsService} from '../views/admin/projects/projects.service';
import {DialogService} from '../services/dialog.service';
import {MatConfirmDialogComponent} from '../components/mat-confirm-dialog/mat-confirm-dialog.component';
import {UserMenuComponent} from '../components/user-menu/user-menu.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {LegalEntityView} from '../dialogs/legal-entity/legal-entity.view';
import {DxDataGridModule, DxTemplateModule} from 'devextreme-angular';
import {AddTaskDialog} from '../dialogs/add-task/add-task.dialog';
import {AddAccountEventDialog} from '../dialogs/add-account-event/add-account-event.dialog';
import {DateFormatPipeModule} from '../pipe/date.format.module';
import {ContactsService} from '../views/admin/contacts/contacts.service';
import {AddNewManagerDialogComponent} from '../dialogs/add-new-manager/add-new-manger.dialog';
import {InternationalPhoneNumberModule} from 'ngx-international-phone-number';
import {NgxPhoneMaskModule} from 'ngx-phone-mask';
import {TextMaskModule} from 'angular2-text-mask';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {CardModule} from 'primeng/card';
import {MbscModule} from '@mobiscroll/angular';
import {CalendarBirthdayComponent} from '../components/calendar-birthday/calendar-birthday.component';
import {FullCalendarModule} from '@fullcalendar/angular';

@NgModule({
  declarations: [
    TopbarComponent,
    ProjectsListComponent,
    ProjectsListItemComponent,
    CommentListComponent,
    CommentListItemComponent,
    LoadingComponent,
    ConfigurationCategoriesComponent,
    LeftMenuComponent,
    ContactsSearchComponent,
    ErrorDialog,
    OnlyNumber,
    ConfirmDialog,
    ConfigurationsSearchComponent,
    MatConfirmDialogComponent,
    TaskHeaderComponent,
    UserMenuComponent,
    LegalEntityView,
    AddTaskDialog,
    AddAccountEventDialog,
    AddObjectDialog,
    AddFilialDepartamentDialog,
    AddNewManagerDialogComponent,
    StatisticsMenuComponent,
    Autosize,
    CalendarBirthdayComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    DropdownModule,
    FormsModule,
    MultiSelectModule,
    MatDialogModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    ButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    DragDropModule,
    MatCheckboxModule,
    DxDataGridModule,
    DxTemplateModule,
    DateFormatPipeModule,
    InternationalPhoneNumberModule,
    NgxPhoneMaskModule,
    TextMaskModule,
    ToastModule,
    CardModule,
    MbscModule,
    FullCalendarModule,
  ],
  providers: [
    DatePipe,
    MsgService,
    ConfigurationsItemsService,
    ProjectsService,
    DialogService,
    ContactsService,
    MessageService,
  ],
  exports: [
    CommonModule,
    DropdownModule,
    MultiSelectModule,
    FormsModule,
    TopbarComponent,
    ProjectsListComponent,
    ProjectsListItemComponent,
    MatDialogModule,
    CommentListComponent,
    CommentListItemComponent,
    ReactiveFormsModule,
    LoadingComponent,
    ProgressSpinnerModule,
    ConfigurationCategoriesComponent,
    LeftMenuComponent,
    ContactsSearchComponent,
    StatisticsMenuComponent,
    ErrorDialog,
    OnlyNumber,
    Autosize,
    ConfirmDialog,
    OverlayPanelModule,
    ButtonModule,
    MatTableModule,
    MatPaginatorModule,
    ConfigurationsSearchComponent,
    MatConfirmDialogComponent,
    TaskHeaderComponent,
    MatTabsModule,
    DragDropModule,
    UserMenuComponent,
    MatCheckboxModule,
    LegalEntityView,
    DxDataGridModule,
    DxTemplateModule,
    InternationalPhoneNumberModule,
    NgxPhoneMaskModule,
    TextMaskModule,
    ToastModule,
    CardModule,
    MbscModule,
    CalendarBirthdayComponent,
    FullCalendarModule,
  ],
  entryComponents: [
    ErrorDialog,
    ConfirmDialog,
    MatConfirmDialogComponent,
    LegalEntityView,
    AddTaskDialog,
    AddAccountEventDialog,
    AddObjectDialog,
    AddFilialDepartamentDialog,
    AddNewManagerDialogComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedModule {}
