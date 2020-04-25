import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ContactsService } from '../../contacts.service';
import {
    AddContactDialog, AddContractsDialog,
    AddFilialDepartamentDialog,
    AddFilialDepartamentManagerDialog, ConfirmDialog, ErrorDialog, AddObjectDialog
} from '../../../../../dialogs';
import { map, take, takeUntil } from 'rxjs/operators';
import { ILegalEntity, ServerResponse } from '../../../../../types/types';
import { FormBuilder } from '@angular/forms';
import { LegalEntityView } from '../../../../../dialogs/legal-entity/legal-entity.view';
import { AddNewManagerDialogComponent } from 'src/app/com/annaniks/interactive-solutions-group/dialogs/add-new-manager/add-new-manger.dialog';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';
import { ExportService } from 'src/app/com/annaniks/interactive-solutions-group/services/export.service';
import { ConfigurationService } from '../../../configurations/configuration.service';
import { CookieService } from 'angular2-cookie/core';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.view.html',
  styleUrls: ['./general-info.view.scss']
})
export class GeneralInfoView implements OnInit, OnDestroy {

    public loading = true;
    public legalEntityTypes: any;
    public taxaties: any;
    public legalEntities: ILegalEntity[] = [];
    public contacts = [];
    public allSphereActivity;
    public allCompanyTypes;
    public allCountries: Array<object> = [];
    public allCities: Array<object> = [];
    public company: any;
    public selectedSphereActivity;
    public id: number;
    public companyType;
    public resident;
    public partner;
    public saleSize;
    public phone;
    public email;
    public profile;
    public contracts = [];
    public filials: Array<any> = [];
    public departaments: Array<any> = [];
    public managers: Array<any> = [];
    public isNew = false;
    public denomination;
    public isGet: boolean;
    public contactUrl;
    public arrayOfContacts = [];
    public contactPostArray = [];
    public isError = false;
    public errorMessage;
    public comment;
    public country;
    public city;
    public concurent;
    public companyCustomer = false;
    public companySubcontractor = false;
    public companyFilial = false;
    public isUnion;
    public status = true;
    public companyParent;
    public companies = [];
    public companiesFilial = [];
    public citiesByCountry = [];
    public allResident = [
        {
            key: 1,
            name: 'Да'
        },
        {
            key: 0,
            name: 'Нет'
        }
    ];
    public allPartners = [
        {
            key: 1,
            name: 'Да'
        },
        {
            key: 0,
            name: 'Нет'
        }
    ];
    public concurentValue = [
        {
            key: 1,
            name: 'Да'
        },
        {
            key: 0,
            name: 'Нет'
        }
    ];
    public unions = [
        {
            key: 1,
            name: 'Да'
        },
        {
            key: 0,
            name: 'Нет'
        }
    ];
    public Id;
    public positionId;
    public isCompany = false;
    public isDepartment = false;
    public isDepartmentCreate = false;
    public isManagerCreate = false;

    private _subscription: Subscription;
    private _destroy$ = new Subject();

    constructor(public route: ActivatedRoute,
                public dialog: MatDialog,
                private _router: Router,
                private _contactsService: ContactsService,
                private _fb: FormBuilder,
                private _matDialog: MatDialog,
                private cdf: ChangeDetectorRef,
                private data: MsgService,
                private _exportService: ExportService,
                private _confService: ConfigurationService,
                private _cookiesService: CookieService) {
        this.route.parent.params.subscribe(params => {
            this.id = params['id'];
        });
        this.isGet = this.id ? true : false;
        this.Id = this._cookiesService.get('Id');
        this.positionId = this._cookiesService.get('PositionID');
    }

    ngOnInit() {
        this._exportTable();
        this._combineObservables();
    }
    /**
     * method for subscribe all function
     */
    private _combineObservables() {
        const combined = forkJoin(
            this._getAllSphereActivity(),
            this._getAllCompanyTypes(),
            this._getAllCities(),
            this._getAllCountries(),
            this._getLegalEntityTypes(),
            this._getTaxaties(),
            this._getAllCompanies(),
            this._getRightsAccess(this.Id),
        );
        this._subscription = combined.subscribe(data => {
            if (this.id) {
                this._getCompanyById();
                this._getLegalEntities();
            } else {
                this.country = {Id: 7, Name: 'Россия'};
                this.citiesByCountry = this.allCities.filter(city => city['CountryId'] === 7);
                this.city = this.citiesByCountry.find(city => city.isCapital);
                this.loading = false;
                // this.cdf.markForCheck();
            }
        });
    }

    private _exportTable() {
        this.data.exportTable$.pipe(takeUntil(this._destroy$)).subscribe(() => {
            this._contactsService.getOneCompanyExportExcel(this.id).subscribe(data => {
                this._exportService.exportExcel(data, 'Company');
            });
        });
    }

    private _getRightsAccess(Id) {
        return this._confService.getRightsAccess(Id).pipe(map(res => {
            const generalPosition = [16, 17, 22, 14];
            if (generalPosition.includes(Number(this.positionId))) {
                this.isCompany = true;
                this.isDepartment = true;
                this.isDepartmentCreate = true;
                this.isManagerCreate = true;
            } else {
                if (res['message'][0].Rights) {
                    this.isManagerCreate = res['message'][0].Rights.isManagerCreate;
                    this.isCompany = res['message'][0].Rights.isCompany;
                    this.isDepartment = res['message'][0].Rights.isDepartment;
                    this.isDepartmentCreate = res['message'][0].Rights.isDepartmentCreate;
                } else {
                    this.isManagerCreate = false;
                    this.isCompany = false;
                    this.isDepartment = false;
                    this.isDepartmentCreate = false;
                }
            }
        }));
    }

    /**
     * open dialog for add contact
     */
    addContact() {
        this.isNew = this.id ? true : false;
        let dialogRef = this.dialog.open(AddContactDialog, {
            height: '400px',
            width: '400px',
            data: { id: this.id, new: this.isNew, url: 'company' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (this.id) {
                    this.isGet = true;
                    this._getCompanyById();
                } else {
                    this.contacts.push({
                        ContactType: result.selectedInfo.Name,
                        ContactTypeId: result.selectedInfo.Id,
                        ContactValue: result.text
                    });
                }
            }
        });
    }

    deleteContact(contact, index) {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '350px',
            panelClass: 'padding24'
        });
        dialogRef.beforeClosed().subscribe((data) => {
            if (data) {
                if (this.id) {
                    this._contactsService.deleteCompanyContact(contact.Id).subscribe(() => {
                        this._getCompanyById();
                    });
                } else {
                    this.contacts = this.contacts.filter((_, ind) => ind !== index);
                }
            }
        });
    }

    /**
     * function for add manager for departamnet and manager
     * @param key -key for call necessary function
     * @param id -filialId or DepartamnetId
     */
    public openManagerDialog(key, id?) {
        let dialogRef = this.dialog.open(AddFilialDepartamentManagerDialog, {
            width: '400px',
            minHeight: '300px',
            data: { key: key, companyId: this.id, id: id }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.isGet = true;
                this._getCompanyById();
            }
        });
    }
    /**
     * open dialog for first box and if result exist get necessary function
     * @param title -input label
     * @param key -url of post function
     */
    public openDialog(title, key, id, item?) {
        let dialogRef = this.dialog.open(AddFilialDepartamentDialog, {
            width: '600px',
            height: 'auto',
            data: { title: title, key: key, id: id, legal_person: this.legalEntities, item: item || null }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.isGet = true;
                this._getCompanyById();
            }
        });
    }

    deleteDepartment(department) {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '350px',
            panelClass: 'padding24'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._contactsService.deleteDepartamnet(department.Id).subscribe(() => {
                    this._getCompanyById();
                });
            }
        });
    }

    deleteManager(manager) {
        let DepartmentId;
        this.departaments.forEach((depart) => {
            if (depart.managers) {
                const res = depart.managers.find(man => man.Id === manager.Id);
                if (res) {
                    DepartmentId = depart.Id;
                }
            }
        });
        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '350px',
            panelClass: 'padding24'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && DepartmentId) {
                this._contactsService.deleteDepartamnetManager(DepartmentId, manager.Id).subscribe(() => {
                    this._getCompanyById();
                });
            }
        });
    }

    addNewManager() {
        const dialogRef = this._matDialog.open(AddNewManagerDialogComponent, {
            width: '600px',
            height: 'auto',
            data: {Company: this.company},
        });
        dialogRef.beforeClosed().subscribe(data => {
            if (data) {
                this.isGet = true;
                this._getCompanyById();
            }
        });
    }

    private _saveLegalEntity(entity) {
        const findEntity = this.legalEntities.findIndex(item => item.Id === entity.Id);
        let observer: Observable<any>;
        const entityData = {
            CompanyId: this.id,
            Entity: {...entity }
        };

        if (findEntity === -1) {
            observer = this._contactsService.saveLegalEntity(entityData);
            this.legalEntities.push({...entity});
        } else {
            observer = this._contactsService.updateLegalEntity(entityData);
            this.legalEntities[findEntity] = {
                ...entity
            };
        }

        observer.pipe(takeUntil(this._destroy$))
            .subscribe(console.log);
    }
    /**
     * function for get checked element of array
     *
     */
    private _getSelectedVariant(array, checkedId) {
        if (array) {
            return array.filter(data => {
                return data.Id === checkedId;
            })[0];
        }
    }
    /**
     * for change and add company
     * return object
     */
    public addCompany() {
        if (!this.companyFilial) {
            this.companyParent = null;
        }
        if (this.id) {
            const contract = this.contracts.join();
            // console.log(this.concurent, this._checkSelect(this.concurent, 'key'));
            this._contactsService.changeCompany(
                this.company.Id,
                this.companyType.Id,
                this.denomination,
                (this.partner && typeof (this.partner.key) === 'number') ? this.partner.key : null,
                contract,
                this.selectedSphereActivity.Id,
                this.saleSize,
                this.comment,
                this._checkSelect(this.city, 'Id'),
                this._checkSelect(this.country, 'Id'),
                (this.concurent && typeof (this.concurent.key) === 'number') ? this.concurent.key : null,
                this.companyCustomer === true ? 1 : 0,
                this.companySubcontractor === true ? 1 : 0,
                this.companyFilial === true ? 1 : 0,
                this._checkSelect(this.companyParent, 'Id'),
                (this.isUnion && typeof (this.isUnion.key) === 'number') ? this.isUnion.key : null,
                this.status === true ? 1 : 0,
            )
                .subscribe(data => {
                        this.isError = false;
                        this._router.navigate(['/contacts/companies']);
                    },
                    (error) => {
                        this.isError = true;
                        this.errorMessage = error['error']['message']
                    });
        } else {
            this.isGet = true;
            this.contactPostArray = [];
            for (const i of this.contacts) {
                this.contactPostArray.push({
                    'ContactTypeId': i['ContactTypeId'],
                    'Text': i['ContactValue']
                });
            }
            this._contactsService.addCompany(
                this.contactUrl,
                this._checkSelect(this.companyType, 'Id'),
                this._checkSelect(this.selectedSphereActivity, 'Id'),
                this.denomination,
                this.saleSize,
                this._checkedBoolean(this.partner, 'key'),
                this.comment,
                this.contactPostArray,
                this._checkSelect(this.city, 'Id'),
                this._checkSelect(this.country, 'Id'),
                (this.concurent && typeof (this.concurent.key) === 'number') ? this.concurent.key : null,
                this.companyCustomer === true ? 1 : 0,
                this.companySubcontractor === true ? 1 : 0,
                this.companyFilial === true ? 1 : 0,
                this._checkSelect(this.companyParent, 'Id'),
                (this.isUnion && typeof (this.isUnion.key) === 'number') ? this.isUnion.key : null,
                this.status === true ? 1 : 0,
            ).subscribe(data => {
                    this.isGet = false;
                    this.isError = false;
                    this._router.navigate(['/contacts/companies']);
                },
                (error) => {
                    this.isGet = false;
                    this.isError = true;
                    this.errorMessage = error['error']['message'];
                });
        }
    }
    /**
     *
     * @param object
     * @param key
     */
    private _checkSelect(object, key) {
        let checkedSelect = null;
        if (object && object[key]) {
            checkedSelect = object[key];
        }
        return checkedSelect;
    }
    /**
     *
     * @param object
     * @param key
     */
    private _checkedBoolean(object, key) {
        let checkedSelect = '';

        if (object && (object[key] === 0 || object[key] === 1)) {
            checkedSelect = object[key];
        }
        return checkedSelect;
    }

    /**
     * delete company
     * return object
     */
    public deleteCompany() {
        if (this.id) {
            let dialogRef = this.dialog.open(ConfirmDialog, {
                width: '350px',
                panelClass: 'padding24'
            });
            dialogRef.afterClosed().subscribe((data) => {
                if (data) {
                    this._contactsService.deleteCompanyById(this.id).subscribe(() => {
                            this._router.navigate(['/contacts/companies']);
                        },
                        (error) => {
                            let dialogRef = this.dialog.open(ErrorDialog, {
                                width: '375px',
                                height: ' 120px',
                                data: { message: error['error']['message'] }
                            });
                        });
                }
            });
        }
    }
    /**
     * add contract
     */
    public addContract() {
        let dialogRef = this.dialog.open(AddContractsDialog, {
            height: '300px',
            width: '400px',
            data: { id: this.id, key: 'company' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._getCompanyById();
            }
        });
    }

    legalEntityPopup(entity?) {
        const dialogRef = this.dialog.open(LegalEntityView, {
            width: '60%',
            height: 'auto',
            data: {
                entity: entity ? {
                    ...entity,
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
                        this._deleteLegalEntities(result.id);
                        return;
                    }
                    this._saveLegalEntity(result);
                }
            });
    }

    private _deleteLegalEntities(id: number) {
        this._contactsService.deleteLegalEntities(id).subscribe((data) => {
            console.log(data);
            const array = this.legalEntities.filter((legal) => {
                return legal.Id !== id;
            });
            this.legalEntities = array;
        });
    }

    addNewSphereActivity() {
        const dialogRef = this._matDialog.open(AddObjectDialog, {
            height: '300px',
            width: '300px',
            data: { title: 'Добавить сферу деятельности', category: 'Сегмент', key: 'sphereActivity'}
        });
        dialogRef.beforeClosed().subscribe(result => {
            if (result) {
                this._getAllSphereActivity().subscribe(() => {
                    this.selectedSphereActivity = this.allSphereActivity[this.allSphereActivity.length - 1];
                });
            }
        });
    }

    addNewTypeCompany() {
        const dialogRef = this._matDialog.open(AddObjectDialog, {
            height: '300px',
            width: '300px',
            data: { title: 'Добавить тип компании', category: 'Тип компании', key: 'typeCompany'}
        });
        dialogRef.beforeClosed().subscribe(result => {
            if (result) {
                this._getAllCompanyTypes().subscribe(() => {
                    this.companyType = this.allCompanyTypes[this.allCompanyTypes.length - 1];
                });
            }
        });
    }

    addNewCity() {
        const dialogRef = this._matDialog.open(AddObjectDialog, {
            height: '300px',
            width: '300px',
            data: { title: 'Добавить город', category: 'Город', key: 'city', countryId: this.country.Id}
        });
        dialogRef.beforeClosed().subscribe(result => {
            if (result) {
                this._getAllCities().subscribe(() => {
                    this.citiesByCountry = this.allCities.filter(city => city['CountryId'] === this.country.Id);
                    this.city = this.citiesByCountry[this.citiesByCountry.length - 1];
                });
            }
        });
    }

    selectCountry(event) {
        this.citiesByCountry = this.allCities.filter(city => city['CountryId'] === event.value.Id);
    }

    /**
     * return object with key message, which is array of sphere activity
     */
    private _getAllSphereActivity() {
        return this._contactsService.getAllSphereActivity().pipe(
            map((data) => {
                this.allSphereActivity = data['message'];
                return data;
            })
        );
    }
    /**
     * return object with key message, which is array  of types company
     */
    private _getAllCompanyTypes() {
        return this._contactsService.getAllCompanyTypes().pipe(
            map((data) => {
                this.allCompanyTypes = data['message'];
                return data;
            })
        );
    }

    private _getAllCountries() {
        return this._contactsService.getAllCountries().pipe(
            map((data: ServerResponse) => {
                this.allCountries = data.message;
                return data.message;
            })
        );
    }

    private _getAllCities() {
        return this._contactsService.getAllCities().pipe(
            map((data: ServerResponse) => {
                this.allCities = data.message;
                return data.message;
            })
        );
    }
    /**
     * for get information about clicked company
     */
    private _getCompanyById() {
        if (this.id) {
            this._contactsService.getCompanyById(this.id).subscribe(
                (data) => {
                    console.log(data);
                    this.company = data['data']['message']['data'][0];
                    this.contacts = data['data']['Contact'];
                    this.filials = data['data']['message']['filialResult'];
                    this.departaments = data['data']['message']['departmentResult'];
                    this.managers = data['data']['message']['managerResult'];
                    this.selectedSphereActivity = this._getSelectedVariant(this.allSphereActivity, this.company.SphereActivityId);
                    this.companyType = this._getSelectedVariant(this.allCompanyTypes, this.company.CompanyTypeId);
                    this.denomination = this.company.Denomination;
                    if (this.company.Partner) {
                        this.partner = this.company.Partner['data'][0] === 0 ? this.allPartners[1] : this.allPartners[0];
                    }
                    this.saleSize = this.company.DiscountSize;
                    this.contracts = (this.company && this.company.Contracts) ? this.company.Contracts.split(',') : [];
                    this.contracts.forEach((element: string, index: number) => {
                        if (element.length === 0) {
                            this.contracts.splice(index, 1);
                        }
                    });
                    this.comment = this.company.Comments;
                    this.city = this._getSelectedVariant(this.allCities, this.company.CityId);
                    this.country = this._getSelectedVariant(this.allCountries, this.company.CountryId);
                    if (this.company.Concurent) {
                        this.concurent = this.concurentValue.filter((element) => element.key === this.company.Concurent.data[0])[0];
                    }
                    this.isGet = false;
                    this.companyCustomer = this.company.Customer === 0 ? false : true;
                    this.companySubcontractor = this.company.Subcontractor === 0 ? false : true;
                    this.companyFilial = this.company.isFilial;
                    this.companyParent = this.companies.find(comp => comp.Id === this.company.CompanyParentId);
                    this.companiesFilial = this.companies.filter(comp => comp.CompanyParentId === Number(this.id));
                    this.citiesByCountry = this.allCities.filter(city => city['CountryId'] === this.country.Id);
                    if (this.company.isUnion) {
                        this.isUnion = this.unions.filter((element) => element.key === this.company.isUnion)[0];
                    }
                    this.status = this.company.Status === 0 ? false : true;
                    this.loading = false;
                });
        }
    }

    private _getLegalEntities() {
        if (!this.id) { return; }
        this._contactsService.getLegalEntities(this.id)
            .pipe(takeUntil(this._destroy$))
            .subscribe((entity: ILegalEntity[]) => this.legalEntities = entity);
    }

    private _getLegalEntityTypes() {
        return this._contactsService.getLegalEntityTypes().pipe(
            map((data: Array<string>) => {
                console.log(data);
                this.legalEntityTypes = data['message'];
                return this.legalEntityTypes;
            })
        );
    }

    private _getTaxaties() {
        return this._contactsService.getTaxaties().pipe(map((data: Array<string>) => {
            console.log(data);
            this.taxaties = data['message'];
            return this.taxaties;
        })
        ) ;
    }

    private _getAllCompanies() {
        return this._contactsService.getAllCompanies().pipe(map(data => {
            this.companies = data['message'];
            console.log(this.companies);
            return data;
        }));
    }

    ngOnDestroy() {
        this.isGet = false;
        this._subscription.unsubscribe();
        this._destroy$.next(true);
        this._destroy$.complete();
    }

}
