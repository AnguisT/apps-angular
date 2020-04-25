import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorDialog, AddEmployeeContactDialog, ConfirmDialog } from '../../../../dialogs';
import { ConfigurationService } from '../configuration.service';
import { map } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectsService } from '../../projects/projects.service';
import { ServerResponse } from '../../../../types/types';
import { formatDate } from '@angular/common';
import emailMask from 'text-mask-addons/dist/emailMask';

@Component({
    selector: 'edit-partner',
    templateUrl: 'edit-partner.view.html',
    styleUrls: ['edit-partner.view.scss']
})
export class EditPartnerView implements OnInit, OnDestroy {
    public mask = {
        showMask: true,
        guide: true,
        mask: emailMask,
    };
    public contacts: Array<object> = [];
    public id: number;
    public employee;
    private _subscription: Subscription = new Subscription();
    public positionEmployee: Array<object>;
    public selectedPositionEmployee;
    public name;
    public surname;
    public username;
    public password;
    public phone;
    public email;
    public birthday;
    public profile;
    public departament;
    public departaments = [];
    public newContact = [];
    public isNew = false;
    public isGet = false;
    public typeContact;
    public employeeImage;
    public image;
    public defaultImage = 'assets/images/colors.jpg';
    public fileUrl = 'https://crm.i-s-group.ru:3000/static/';
    public loading = true;
    public isError = false;
    public errorMessage;
    public contactsValidationError = '';
    public dateStartWork;
    public individualPlan;
    public genders = [
        {
            Id: 1,
            Name: 'Мужской'
        },
        {
            Id: 2,
            Name: 'Женский'
        },
        {
            Id: 3,
            Name: 'Не определился'
        },
    ];
    public gender;
    public salary;
    public description;
    public vacationDays;
    public isBlocked = false;
    public phoneTest;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        public dialog: MatDialog,
        private _configurationService: ConfigurationService,
        private _projectService: ProjectsService
    ) {
        this._route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.loading = this.id ? true : false;
    }
    date = new FormControl(new Date());
    serializedDate = new FormControl((new Date()).toISOString());

    ngOnInit() {
        this._combineObservables();
    }

    private _combineObservables() {
        const combined = forkJoin(
            this._getPositionEmployee(),
            this._getAllContactType(),
            this._getAllDepartments(),
        );
        this._subscription = combined.subscribe();
    }

    /**
     * return object with key message, which is array of position employee
     */
    private _getPositionEmployee() {
        return this._configurationService.getPositionEmployee().pipe(
            map((data) => {
                this.positionEmployee = data['message'];
                if (this.id) {
                    this._getEmployeeById().subscribe();
                }
                return data;
            })
        );
    }
    /**
      * function for get checked element of array
      */
    private _getSelectedVariant(array, checkedId) {
        if (array) {
            return array.filter(data => {
                return data.Id === checkedId;
            })[0];
        }
    }


    /**
     * return object with key message, which is element of checked employee
     * for edit partner information
     */
    private _getEmployeeById() {
        if (this.id !== undefined) {
            return this._configurationService.getEmployeeById(this.id).pipe(
                map((data) => {
                    console.log(data);
                    this.employee = data['data']['message'][0];
                    this.contacts = data['data']['Contact'];
                    this.name = this.employee.Name;
                    this.password = this.employee.Parol;
                    this.surname = this.employee.Surname;
                    this.username = this.employee.Username;
                    this.birthday = new Date(this.employee.Birthday);
                    this.email = this.employee.Email;
                    this.gender = this.genders.find(gender => gender.Id === this.employee.GenderId);
                    this.salary = this.employee.Salary;
                    this.individualPlan = this.employee.IndividualPlan;
                    this.dateStartWork = new Date(this.employee.DateStartWork);
                    const depart = this.departaments.filter((department) => {
                        return this.employee.DepartmentId === department.Id;
                    });
                    this.departament = depart[0];
                    if (this.employee.Image) {
                        this.defaultImage = 'url(' + this.fileUrl + this.employee.Image + ')';
                    }
                    this.selectedPositionEmployee = this._getSelectedVariant(this.positionEmployee, this.employee.PositionId);
                    this.description = this.employee.Description;
                    this.vacationDays = this.employee.VacationDays;
                    this.isBlocked = this.employee.isBlocked;
                    this.loading = false;
                })
            );
        }
    }

    private _getAllDepartments() {
        return this._projectService.getAllEmployeeDepartments().pipe(
            map((data: ServerResponse) => {
                this.departaments = data['message'];
                return data;
            })
        );
    }

    /**
    * open dialog for add employee contact
    */
    addContact() {
        this.isNew = this.id ? true : false;
        const dialogRef = this.dialog.open(AddEmployeeContactDialog, {
            height: '400px',
            width: '400px',
            data: { new: this.isNew, id: this.id, url: 'employee' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (!this.id) {
                    this.contacts.push({
                        ContactType: result.selectedInfo.Name,
                        ContactTypeId: result.selectedInfo.Id,
                        ContactValue: result.text
                    });
                } else {
                    this.loading = true;
                    this._getEmployeeById().subscribe();
                }
            }
        });
    }

    deleteContact(contact, ind) {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '350px',
            panelClass: 'padding24'
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this._configurationService.deleteContact(contact.Id).subscribe(() => {
                    if (!this.id) {
                        this.contacts = this.contacts.filter((conc, index) => index !== ind);
                    } else {
                        this._getEmployeeById().subscribe();
                    }
                });
            }
        });
    }

    /**get all contact types
     *
     */
    private _getAllContactType() {
        return this._configurationService.getAllTypesContact().pipe(
            map((data) => {
                this.typeContact = data['message'];
                return data;
            })
        );
    }
    /**
     * function for add employee
     */
    public addEmployee() {
        this.newContact = [];
        const isBlocked = this.isBlocked === true ? 1 : 0;
        if (!this.id) {
            this.loading = true;
            for (let i = 0; i < this.contacts.length; i++) {
                this.newContact.push({ ContactTypeId: this.contacts[i]['ContactTypeId'], Text: this.contacts[i]['ContactValue'] });
            }
            this._configurationService.addEmployee(
                this.name,
                this.surname,
                this._checkSelect(this.selectedPositionEmployee, 'Id'),
                this.username,
                this.password,
                this.birthday,
                this.email,
                this.newContact,
                this.departament.Id,
                this._checkSelect(this.gender, 'Id'),
                formatDate(this.dateStartWork, 'yyyy-MM-dd', 'en'),
                this.salary,
                this.description,
                this.individualPlan,
                this.vacationDays,
                isBlocked
            ).subscribe((data) => {
                    this.isError = false;
                    this.createStaffImage(this.image, data['message']);
                },
                    (error) => {
                        this.loading = false;
                        this.isError = true;
                        this.errorMessage = error['error']['message'];
                    });
        } else {
            this.loading = true;
            for (const i of this.contacts) {
                this.newContact.push(
                    {
                        ContactTypeId: this.typeContact.filter(type => {
                            return type.Name === i['ContactType'];
                        })[0].Id,
                        Text: i['ContactValue']
                    });
            }
            this._configurationService.changeEmployee(
                this.employee.Id,
                this.name,
                this.surname,
                this.selectedPositionEmployee.Id,
                this.username,
                this.password,
                this.birthday,
                this.email,
                this.departament.Id,
                this._checkSelect(this.gender, 'Id'),
                formatDate(this.dateStartWork, 'yyyy-MM-dd', 'en'),
                this.salary,
                this.description,
                this.individualPlan,
                this.vacationDays,
                isBlocked
            ).subscribe(data => {
                    this.createStaffImage(this.image, this.employee.Id);
                    this.isError = false;
                },
                    (error) => {
                        this.loading = false;
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
        let checkedSelect = 0;
        if (object && object[key]) {
            checkedSelect = object[key];
        }
        return checkedSelect;
    }

    public changeImage(event) {
        if (event) {
            const reader = new FileReader();
            this.image = event;
            reader.onload = (e: any) => {
                this.defaultImage = 'url(' + e.target.result + ')';
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    private createStaffImage(event, id) {
        if (event) {
            const fileList: FileList = event.target.files;
            if (fileList.length > 0) {
                const file: File = fileList[0];
                const formData: FormData = new FormData();
                formData.append('file', file, file.name);
                this._configurationService.addImage(id, formData)
                    .subscribe((data) => {
                        this.loading = false;
                        this._router.navigate(['/configurations/isg']);
                    }
                        , (error) => {
                            this.loading = false;
                            this.errorMessage = 'Image is too big please upload small Image';
                            this.isError = true;
                        }
                    );

            }
        } else {
            this.loading = false;
            this._router.navigate(['/configurations/isg']);
        }
    }

    public deleteEmployee() {
        this.loading = true;
        if (this.id) {
            this._configurationService.deleteEmployeeById(this.id).subscribe(data => {
                this._router.navigate(['/configurations/isg']);
                this.loading = false;
            },
                (error) => {
                    const dialogRef = this.dialog.open(ErrorDialog, {
                        width: '375px',
                        height: ' 130px',
                        data: { message: error['error']['message'] }
                    });
                    this.loading = false;
                });
        }
    }

    public onClickDelete(): void {
        if (this.id) {
            const dialogRef = this.dialog.open(ConfirmDialog, {
                width: '350px',
                panelClass: 'padding24'
            });
            dialogRef.afterClosed().subscribe((data) => {
                if (data) {
                    this.deleteEmployee();
                }
            });

        }
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}
