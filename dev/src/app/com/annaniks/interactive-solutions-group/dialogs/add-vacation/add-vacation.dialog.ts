import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-add-vacation-event',
    templateUrl: './add-vacation.dialog.html',
    styleUrls: ['./add-vacation.dialog.scss'],
})
export class AddVacationDialogComponent implements OnInit {

    form: FormGroup;
    status = [
        { Id: 0, Name: 'Не завершен' },
        { Id: 1, Name: 'Завершен' }
    ];

    constructor(public dialogRef: MatDialogRef<AddVacationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any | null,
        private _fb: FormBuilder) {
    }

    ngOnInit() {
        this._initForm();

        if (this.data.data) {
            const findStatus = this.status.find(item => item.Id === this.data.data.Status);
            this.form.controls['Status'].setValue(findStatus);
        }
    }

    add() {
        this.dialogRef.close(this.form.value);
    }

    onCancel() {
        this.dialogRef.close();
    }

    onDelete() {
        this.dialogRef.close({ deleteId: this.data.data.Id });
    }

    private _initForm() {
        let dateRange = null;
        if (this.data.data) {
            dateRange = [new Date(this.data.data.DateStart), new Date(this.data.data.DateEnd)];
        }
        this.form = this._fb.group({
            Date: [dateRange, Validators.required],
            Status: null,
        });
    }
}
