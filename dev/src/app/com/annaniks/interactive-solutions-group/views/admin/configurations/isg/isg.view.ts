import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { ConfigurationService } from '../configuration.service';
import { IEmployee, Message as Employee } from '../../../../types/types';
import { Subject } from 'rxjs';
import { ContactsService } from '../../contacts/contacts.service';
import { MatDialog } from '@angular/material';
import { LegalPersonISGComponent } from '../../../../dialogs/legal-person-isg/legal-person-isg.view';
import { ProjectsService } from '../../projects/projects.service';

@Component({
    selector: 'isg',
    templateUrl: 'isg.view.html',
    styleUrls: ['isg.view.scss'],
})
export class IsgView implements OnInit, OnDestroy {

    allEmployee: Employee[];
    legalPersons;
    legalEntityTypes;
    taxaties;
    valueReminder;
    valuesReminder;
    selectedIsgNav = 'employee';
    isgNav = [
        {
            name: 'Сотрудники',
            key: 'employee'
        },
        {
            name: 'Департаменты',
            key: 'departments'
        },
        {
            name: 'Должности',
            key: 'position'
        },
        {
            name: 'Юр. лица',
            key: 'legal_person'
        },
        {
            name: 'Ремайндер',
            key: 'reminder'
        },
    ];
    activeEmployee: boolean;
    selectStatus;
    statuses;
    isLoading = false;

    private destroy$ = new Subject();

    constructor(
        private _configurationService: ConfigurationService,
        private _contactsService: ContactsService,
        private _projectsService: ProjectsService,
        public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this._getAllEmployee();
        this._getAllLegalPersonISG();
        this._getLegalEntityTypes();
        this._getTaxaties();
        this._getValueReminder();
        this._getAllStatus();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    activeIsgNav(key) {
        this.selectedIsgNav = key;
    }

    changeActiveEmployee(employee) {
        const data = {isActive: employee.isActive, Id: employee.Id};
        this._configurationService.updateEmployeeActive(data).subscribe();
    }

    openDialog(entity) {
        const dialogRef = this.dialog.open(LegalPersonISGComponent, {
            width: '60%',
            height: 'auto',
            data: {
                entity: entity ? {
                    id: entity.id,
                    ...entity.info,
                    TypeLegalEntity: this.legalEntityTypes.find(type => type.Id === entity.type),
                    Taxation: this.taxaties.find(type => type.Id === entity.taxation)
                } : null,
                types: this.legalEntityTypes,
                taxaties: this.taxaties
            }
        });
        dialogRef.afterClosed()
            .subscribe((result) => {
                if (result) {
                    if (result.action === 'delete') {
                        this._deleteLegalPersonISG(result.id);
                        return;
                    }
                    this.saveUpdateLegalPersonISG(result);
                }
            });
    }

    saveUpdateLegalPersonISG(data) {
        const type = data.type;
        const taxation = data.taxation;
        const id = data.id;
        const newData = data;

        delete newData.type;
        delete newData.taxation;
        delete newData.id;

        data = {
            id: id,
            info: newData,
            type,
            taxation,
        }

        if (data.id) {
            this._updateLegalPersonISG(data);
            return;
        }
        this._saveLegalPersonISG(data);
    }

    selectingStatus(event) {
        const find = this.valuesReminder.find(reminder => reminder.StatusId === event.value.Id);
        if (find) {
            this.valueReminder = find.CountDays;
        } else {
            this.valueReminder = 0;
        }
    }

    saveReminder() {
        this.isLoading = true;
        this._updateValueReminder({CountDays: this.valueReminder, StatusId: this.selectStatus.Id});
    }

    private _getAllEmployee() {
        return this._configurationService.getAllEmployee()
            .pipe(takeUntil(this.destroy$),
                map((employees: IEmployee) => employees.message))
            .subscribe((res: Employee[]) => {
                this.allEmployee = res;
            });
    }

    private _getAllLegalPersonISG() {
        this._configurationService.getAllLegalPersonISG().subscribe(res => {
            this.legalPersons = res['message'];
        });
    }

    private _deleteLegalPersonISG(id) {
        this._configurationService.deleteOneLegalPersonISG(id).subscribe((data) => {
            this._getAllLegalPersonISG();
        });
    }

    private _saveLegalPersonISG(data) {
        this._configurationService.saveLegalPersonISG(data).subscribe((result) => {
            this._getAllLegalPersonISG();
        });
    }

    private _updateLegalPersonISG(data) {
        this._configurationService.updateLegalPersonISG(data).subscribe((result) => {
            this._getAllLegalPersonISG();
        });
    }

    private _getLegalEntityTypes() {
        this._contactsService.getLegalEntityTypes().subscribe(data => {
            this.legalEntityTypes = data['message'];
        });
    }

    private _getTaxaties() {
        this._contactsService.getTaxaties().subscribe(data => {
            this.taxaties = data['message'];
        });
    }

    private _getValueReminder() {
        this._configurationService.getValueReminder().subscribe(data => {
            this.valuesReminder = data['message'];
        });
    }

    private _updateValueReminder(data) {
        this._configurationService.updateValueReminder(data).subscribe(() => {
            setTimeout(() => {
                this._getValueReminder();
                this.isLoading = false;
            }, (1000));
        });
    }

    private _getAllStatus() {
        this._projectsService.getAllStatuses().subscribe(data => {
            this.statuses = data['message'];
        });
    }
}
