import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '../../../../../../../node_modules/@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigurationService } from '../../views/admin/configurations/configuration.service';
import { FinanceService } from '../../views/admin/finance/finance.service';
import { formatDate } from '@angular/common';
import { CookieService } from 'angular2-cookie';
import { ProjectsService } from '../../views/admin/projects/projects.service';
import { MsgService } from '../../services/sharedata';
import { TopbarItemsService } from '../../services';

@Component({
    selector: 'app-add-finance',
    templateUrl: 'add-finance.dialog.html',
    styleUrls: ['add-finance.dialog.scss']
})

export class AddFinanceDialogComponent implements OnInit {
    loading = true;
    formGroup: FormGroup;
    employies;
    financeStatus;
    projects;
    Id;
    positionId;
    isEditable = false;
    isDeleting = false;
    generalPosition = [16, 17, 22, 14];
    projectEmployees;

    _subscription: Subscription = new Subscription();

    constructor(
        public dialogRef: MatDialogRef<AddFinanceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private _projectService: ProjectsService,
        private _configurationService: ConfigurationService,
        private _financeService: FinanceService,
        private formBuilder: FormBuilder,
        private _cookieService: CookieService,
        private _msgService: TopbarItemsService
    ) {
        this.Id = Number(this._cookieService.get('Id'));
        this.positionId = Number(this._cookieService.get('PositionID'));
        console.log('add-finance')
    }

    ngOnInit() {
        this.initForm();
        const combined = forkJoin(
            this.getAllEmployee(),
            this.getAllFinanceStatus(),
            this.getAllProjects(),
            this._getRightAccess(),
            this.getProjectEmployee(),
        );
        this._subscription = combined.subscribe(() => {
            this.formGroup.get('Status').setValue(this.financeStatus.find(status => status.Id === 1));
            this.formGroup.get('Manager').setValue(this.employies.find(employee => employee.Id === this.Id));
            if (this.data) {
                this.setForm();
            }
            const filterProjects = [];
            const statusIds = [54, 56, 57];
            this.projects.forEach(data => {
                const projectEmployees = this.projectEmployees.filter(empl => empl.ProjectId === data.Id).map(empl => empl.EmployeeId);
                console.log(projectEmployees);
                if (data.ManagerProjectId === this.Id || data.SaleManagerId === this.Id) {
                    if (!statusIds.includes(data.StatusId)) {
                        filterProjects.push(data);
                    }
                }
                if (projectEmployees.includes(this.Id)) {
                    if (!statusIds.includes(data.StatusId)) {
                        filterProjects.push(data);
                    }
                }
            });
            this.projects = filterProjects;
            this.loading = false;
        });
    }

    public initForm() {
        this.formGroup = this.formBuilder.group({
            Status: [null, Validators.required],
            NumberProject: [null, Validators.required],
            DateApp: [new Date(), Validators.required],
            NameProject: [null, Validators.required],
            DateIssue: [null, Validators.required],
            Manager: [null, Validators.required],
            DateClose: [null],
            AmountIssue: [null, Validators.required],
            Articles: new FormArray([]),
        });

        this.formGroup.get('Status').valueChanges.subscribe(data => {
            if (data.Id === 3) {
                this.formGroup.get('DateClose').setValue(new Date());
            } else {
                this.formGroup.get('DateClose').setValue(null);
            }
        });

        this.formGroup.get('NumberProject').valueChanges.subscribe(data => {
            this.formGroup.get('NameProject').setValue(data.Name);
        });

        this.formGroup.get('Articles').valueChanges.subscribe(data => {
            let amount = 0;
            data.forEach(val => {
                amount += Number(val.Article);
            });
            this.formGroup.get('AmountIssue').setValue(amount);
        });
    }

    public setForm() {
        const data = this.data;
        const dateClose = data.DateClose ? new Date(data.DateClose) : null;
        this.formGroup.patchValue({
            Status: this.findObject(this.financeStatus, 'Id', data.StatusId)[0],
            NumberProject: this.findObject(this.projects, 'Id', data.ProjectId)[0],
            DateApp: new Date(data.DateApp),
            DateIssue: new Date(data.DateIssue),
            Manager: this.findObject(this.employies, 'Id', data.ManagerId)[0],
            DateClose: dateClose,
            AmountIssue: data.AmountIssue,
        });
        const articles = data.Articles.split(',');
        articles.forEach(art => {
            (<FormArray>this.formGroup.get('Articles')).push(new FormGroup({
                Article: new FormControl(art, Validators.required),
            }));
        });
    }

    public addArticle() {
        (<FormArray>this.formGroup.get('Articles')).push(new FormGroup({
            Article: new FormControl(0, Validators.required),
        }));
    }

    public removeArticle(ind) {
        (<FormArray>this.formGroup.get('Articles')).removeAt(ind);
    }

    public add() {
        let dateClose = null;
        if (this.formGroup.value.DateClose) {
            dateClose = formatDate(this.formGroup.value.DateClose, 'yyyy-MM-dd', 'en');
        }
        const body = {
            StatusId: this.formGroup.value.Status.Id,
            ProjectId: this.formGroup.value.NumberProject.Id,
            DateApp: formatDate(this.formGroup.value.DateApp, 'yyyy-MM-dd', 'en'),
            NameProject: this.formGroup.value.NameProject,
            DateIssue: formatDate(this.formGroup.value.DateIssue, 'yyyy-MM-dd', 'en'),
            ManagerId: this.formGroup.value.Manager.Id,
            DateClose: dateClose,
            AmountIssue: this.formGroup.value.AmountIssue,
            Articles: this.formGroup.value.Articles.map(article => article.Article).join(','),
        };
        if (!this.data) {
            this._financeService.addFinance(body).subscribe(data => {
                this._msgService.onChangeFinance$.next(true);
                this.dialogRef.close(data);
            });
        } else {
            body['Id'] = this.data.Id;
            this._financeService.updateFinance(body).subscribe(data => {
                this._msgService.onChangeFinance$.next(true);
                this.dialogRef.close(data);
            });
        }
    }

    public delete() {
        this._financeService.deleteFinance(this.data.Id).subscribe(data => {
            this.dialogRef.close(data);
        });
    }

    public close() {
        this.dialogRef.close();
    }

    public findObject(array: Array<object>, value: string, value1: string | number | Array<number>): Array<object> {
        let filteredArray: Array<object> = [];
        if (array && value && value1) {
            filteredArray = array.filter((element) => {
                return element[value] === value1 || (Array.isArray(value1) && value1.includes(element[value]));
            });
        }
        return filteredArray;
    }

    public isReadonly() {
        if (this.generalPosition.includes(this.positionId) || this.isEditable) {
            return false;
        }
        return true;
    }

    private getAllProjects() {
        return this._configurationService.getAllProjects().pipe(map(data => {
            this.projects = data['message'];
            return data;
        }));
    }

    private getAllFinanceStatus() {
        return this._configurationService.getAllFinanceStatus().pipe(map(data => {
            this.financeStatus = data['message'];
            return data;
        }));
    }

    private getAllEmployee() {
        return this._configurationService.getAllEmployee().pipe(map(data => {
            this.employies = data['message'];
            return data;
        }));
    }

    private getProjectEmployee() {
        return this._projectService.getProjectAllEmployee().pipe(map(employee => {
            this.projectEmployees = employee['message'];
        }));
    }

    private _getRightAccess() {
        return this._configurationService.getRightsAccess(this.Id).pipe(map(res => {
            if (res['message'][0].Rights) {
                this.isEditable = res['message'][0].Rights.isFinanceEditable;
                this.isDeleting = res['message'][0].Rights.isFinanceDeleting;
            } else {
                this.isDeleting = false;
                this.isEditable = false;
            }
        }));
    }
}
