import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { ContactsService } from '../../contacts.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AddContactDialog, AddContractsDialog, ConfirmDialog, ErrorDialog } from '../../../../../dialogs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from '../../../configurations/configuration.service';
import { CookieService } from 'angular2-cookie/core';

@Component({
    selector: 'app-manager-general-info',
    templateUrl: './manager-general-info.component.html',
    styleUrls: ['./manager-general-info.component.scss']
})
export class ManagerGeneralInfoComponent implements OnInit, OnDestroy {

    form: FormGroup;
    departments;
    positions;
    private destroy$ = new Subject();

    private _subscription: Subscription;
    public allSphereActivity;
    public selectedSphereActivity;
    public managerName;
    public manager;
    public id: number;
    public managerSurname: string;
    public contacts = [];
    public loading: boolean;
    public isNew: boolean;
    public contactPostArray = [];
    public contracts;
    public contractUrl;
    public comment;
    public errorMessage;
    public isError = false;
    public companies;
    public image;
    public imgurl;
    public userId;
    public ManagerUserId;
    public defaultImage = 'assets/images/colors.jpg';
    public fileUrl = 'https://crm.i-s-group.ru:3000/static/';
    public genders = [
        {
            Id: 1,
            Name: 'Мужской',
        },
        {
            Id: 2,
            Name: 'Женский',
        },
        {
            Id: 3,
            Name: 'Не определился',
        }
    ];
    public Id;
    public positionId;
    public isManager = false;

    constructor(public _dialog: MatDialog,
        private _contactsService: ContactsService,
        private _confService: ConfigurationService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _fb: FormBuilder,
        private _cookiesService: CookieService) {
            this.Id = this._cookiesService.get('Id');
            this.positionId = this._cookiesService.get('PositionID');
        }

    ngOnInit() {
        this._initForm();
        this._activatedRoute.parent.params.subscribe(params => {
            this.id = params['id'];
        });
        this.loading = !!this.id;
        this._combineObservables();
    }

    private _combineObservables() {
        const combined = forkJoin(
            this._getDepartments(),
            this._getAllCompany(),
            this._getAllSphereActivity(),
            this._getRightsAccess(this.Id),
        ).pipe(finalize(() => {
            this._getManagerById();
            this.loading = false;
        }));
        combined.subscribe();
    }

    private _initForm() {
        this.form = this._fb.group({
            Name: ['', Validators.required],
            Surname: ['', Validators.required],
            LastName: [null],
            CompanyName: [null],
            Department: [null],
            SphereActivity: [null],
            DepartmentName: [null],
            DateBirthday: [null],
            Gender: [null],
            Description: [null],
            Position: [null]
        });

        this.form.get('CompanyName').valueChanges.subscribe((companyName) => {
            if (companyName) {
                this._contactsService.getCompanyById(companyName.Id).subscribe((data) => {
                    this.departments = data['data']['message']['departmentResult'];
                    const Department = this.departments.find(department => {
                        if (this.manager) {
                            return department.Id === this.manager.DepartmentId;
                        }
                    });
                    this.form.patchValue({ Department });
                });
            }
        });
    }

    private _getRightsAccess(Id) {
        return this._confService.getRightsAccess(Id).pipe(map(res => {
            const generalPosition = [16, 17, 22, 14];
            if (generalPosition.includes(Number(this.positionId))) {
                this.isManager = true;
            } else {
                if (res['message'][0].Rights) {
                    this.isManager = res['message'][0].Rights.isManager;
                } else {
                    this.isManager = false;
                }
            }
        }));
    }

    private _getDepartments() {
        return this._confService.getCategoryByName('department')
            .pipe(map(res => {
                this.departments = res['message'];
                return res;
            }));
    }

    private _getAllCompany() {
        return this._contactsService.getAllCompanies().pipe(map((data) => {
            this.companies = data['message'];
            return data;
        }));
    }

    /**
     * return object with key message
     */
    private _getManagerById() {
        if (this.id) {
            this._contactsService.getManagerById(this.id)
                .subscribe((data) => {
                    console.log('manager', data);
                    this.manager = data['data']['message'][0];
                    this.ManagerUserId = this.manager.UserId;
                    this.userId = this.manager.Id;
                    this.image = this.manager.Image;
                    if (this.image) {
                        this.defaultImage = 'url("' + this.fileUrl + this.image + '")';
                    }
                    this.contacts = data['data']['Contact'];
                    this.manager.CompanyName = this.companies.find(company => company.Denomination === this.manager.CompanyName);
                    this.manager.Gender = this.genders.find(gender => gender.Id === this.manager.Gender);
                    // const sphereActivity = this.allSphereActivity.find((sphere) => sphere.Id === this.manager.SphereActivityId);
                    // this.form.patchValue({
                    //     SphereActivity: sphereActivity,
                    // });
                    this.form.patchValue(this.manager);
                    this.loading = false;
                });
        }
    }

    private _getSelectedElement() {
        return this.allSphereActivity.filter(data => {
            return data['Id'] === this.manager.SphereActivityId;
        })[0];
    }
    public addContact() {
        this.isNew = !!this.id;
        const dialogRef = this._dialog.open(AddContactDialog, {
            height: '400px',
            width: '400px',
            data: { new: this.isNew, id: this.id, url: 'manager' }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (this.id) {
                    this.loading = true;
                    this._getManagerById();
                } else {
                    this.contacts.push({ ContactType: result.selectedInfo.Name, ContactTypeId: result.selectedInfo.Id, ContactValue: result.text });
                }
            }
        });
    }

    public deleteContact(contact, index) {
        const dialogRef = this._dialog.open(ConfirmDialog, {
            width: '350px',
            panelClass: 'padding24'
        });
        dialogRef.beforeClosed().subscribe((data) => {
            if (data) {
                if (this.id) {
                    this.loading = true;
                    this._contactsService.deleteManagerContact(contact.Id).subscribe(() => {
                        this._getManagerById();
                    });
                } else {
                    this.contacts = this.contacts.filter((_, ind) => ind !== index);
                }
            }
        });
    }

    /**
     * return object with key message
     */
    private _getAllSphereActivity() {
        return this._contactsService.getAllSphereActivity().pipe(map((data) => {
            this.allSphereActivity = data['message'];
            return data;
        }));
    }
    /**
     * delete manager
     * return object
     */
    public deleteManager() {
        if (this.id) {
            const dialogRef = this._dialog.open(ConfirmDialog, {
                width: '350px',
                panelClass: 'padding24'
            });

            dialogRef.afterClosed().subscribe((data) => {
                if (data) {
                    this._contactsService.deleteManager(this.id).subscribe(data => {
                        this._router.navigate(['/contacts/managers']);
                    },
                        (error) => {
                            this._dialog.open(ErrorDialog, {
                                width: '375px',
                                height: ' 120px',
                                data: { message: error['error']['message'] }
                            });
                        });
                }
            });
        }
    }
    public addOrChangeManager() {
        const formData = {};
        formData['Name'] = this.form.get('Name').value;
        formData['Surname'] = this.form.get('Surname').value;
        formData['LastName'] = this.form.get('LastName').value;
        formData['DateBirthday'] = this.form.get('DateBirthday').value;
        formData['Description'] = this.form.get('Description').value;
        formData['Position'] = this.form.get('Position').value;
        formData['DepartmentId'] = this._checkSelect(this.form.get('Department').value, 'Id') || null;
        formData['SphereActivityId'] = null;
        formData['Gender'] = this._checkSelect(this.form.get('Gender').value, 'Id') || null;
        let observer: Observable<any>;
        this.loading = true;

        if (this.id) {
            formData['Id'] = this.id;
            formData['UserId'] = this.ManagerUserId;
            observer = this._contactsService.updateManager(formData);
        } else {
            this.contactPostArray = [];
            for (const i of this.contacts) {
                this.contactPostArray.push({
                    'ContactTypeId': i['ContactTypeId'],
                    'Text': i['ContactValue']
                });
            }
            formData['Contact'] = this.contactPostArray;
            observer = this._contactsService.addManager(formData);
        }

        observer.pipe(
            takeUntil(this.destroy$),
            finalize(() => this.loading = false))
            .subscribe(data => {
                this.isError = false;
                this._router.navigate(['/contacts/managers']);
            },
                (error) => {
                    this.isError = true;
                    this.errorMessage = error['error']['message'];
                });
    }
    /**
     *
     * @param object
     * @param key
     */
    private _checkSelect(object, key) {
        let checkedSelect = 0;
        if (object && object[key]) {
            checkedSelect = object[key];
        }
        return checkedSelect;
    }
    public addContract() {
        const dialogRef = this._dialog.open(AddContractsDialog, {
            height: '300px',
            width: '400px',
            data: { id: this.id, key: 'manager' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                this._getManagerById();
            }
        });
    }

    // changeImage(e) {
    //     console.log(e);
    //     console.log(this.userId);
    // }

    changeImage(e) {
        console.log(this.userId);
        const reader = new FileReader();
        reader.onload = (file: any) => {
            this.defaultImage = 'url(' + file.target.result + ')';
        };
        reader.readAsDataURL(e.target.files[0]);
        this.createStaffImage(e, this.userId);
    }

    private createStaffImage(event, id) {
        if (event) {
            const fileList: FileList = event.target.files;
            if (fileList.length > 0) {
                const file: File = fileList[0];
                const formData: FormData = new FormData();
                formData.append('file', file, file.name);
                this._confService.addManagerImage(id, formData).subscribe();
            }
        }
    }

    ngOnDestroy() {
        // this._subscription.unsubscribe();
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

}
