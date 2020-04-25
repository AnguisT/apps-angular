import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddContactDialog } from '../../../../dialogs';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-departments',
    templateUrl: './departments.view.html',
    styleUrls: ['./departments.view.scss']
})
export class DepartmentsView implements OnInit {

    form: FormGroup;
    contacts = [];
    id;

    constructor(public _dialog: MatDialog,
                private _fb: FormBuilder) {
    }

    ngOnInit() {
        this._initForm();
    }

    addContact() {
        const dialogRef = this._dialog.open(AddContactDialog, {
            height: '400px',
            width: '400px',
            data: { new: false, url: '' }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.contacts.push({
                    ContactType: res.selectedInfo.Name,
                    ContactTypeId: res.selectedInfo.Id,
                    ContactValue: res.text
                });
            }
        });
    }

    private _initForm() {
        this.form = this._fb.group({
            CompanyName: '',
            DepartmentName: '',
            DepartmentPlan: '',
            Description: ''
        });
    }

    onSave() {
        const contactPostArray = [];
        const formData = this.form.value;

        for (const i of this.contacts) {
            contactPostArray.push({
                'ContactTypeId': i['ContactTypeId'],
                'Text': i['ContactValue']
            });
        }

        formData['Contacts'] = contactPostArray;

        console.log(formData);

    }
}
