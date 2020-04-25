import { Component, OnInit, Inject } from '@angular/core';
import { ContactsService } from '../../views/admin/contacts/contacts.service';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProjectsService } from '../../views/admin/projects/projects.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'add-company',
    templateUrl: 'add-company.dialog.html',
    styleUrls: ['add-company.dialog.scss']
})
export class AddCompanyDialog implements OnInit {
    allSphereActivity;
    allCompanyTypes;
    allCountries;
    allCities;
    companyForm: FormGroup;
    error;

    constructor(
        private _contactsService: ContactsService,
        private _fb: FormBuilder,
        private _projectsService: ProjectsService,
        public dialogRef: MatDialogRef<AddCompanyDialog>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) { }

    ngOnInit() {
        const combined = forkJoin(
            this._getAllSphereActivity(),
            this._getAllCompanyTypes(),
            this._getAllCities(),
            this._getAllCountries(),
        );
        combined.subscribe();
        this.initForm();
    }

    initForm() {
        this.companyForm = this._fb.group({
            denomination: [null, Validators.required],
            selectedSphereActivity: [null, Validators.required],
            companyType: [null, Validators.required],
            country: [null, Validators.required],
            city: [null, Validators.required],
            companyCustomer: [null],
            companySubcontractor: [null]
        });
    }

    addCompany() {
        this._projectsService.addLiteCompany({
            denomination: this.companyForm.get('denomination').value,
            selectedSphereActivity: this.companyForm.get('selectedSphereActivity').value.Id,
            companyType: this.companyForm.get('companyType').value.Id,
            country: this.companyForm.get('country').value.Id,
            city: this.companyForm.get('city').value.Id,
            companyCustomer: this.companyForm.get('companyCustomer').value === true ? 1 : 0,
            companySubcontractor: this.companyForm.get('companySubcontractor').value === true ? 1 : 0,
        }).subscribe(data => {
            this.dialogRef.close(data['message']);
        }, (error) => {
            this.error = error.error.message;
        });
    }

    onClose() {
        this.dialogRef.close();
    }

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
            map((data) => {
                this.allCountries = data['message'];
                return data['message'];
            })
        );
    }

    private _getAllCities() {
        return this._contactsService.getAllCities().pipe(
            map((data) => {
                this.allCities = data['message'];
                return data['message'];
            })
        );
    }
}