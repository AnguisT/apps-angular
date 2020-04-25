import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-add-day-off-event',
    templateUrl: './add-day-off.dialog.html',
    styleUrls: ['./add-day-off.dialog.scss'],
})
export class AddDayOffDialogComponent implements OnInit {

    form: FormGroup;
    status = [
        { Id: 0, Name: 'Не завершен' },
        { Id: 1, Name: 'Завершен' }
    ];

    constructor(public dialogRef: MatDialogRef<AddDayOffDialogComponent>,
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
        this.form = this._fb.group({
            Date: [(this.data.data && new Date(this.data.data.Date)) || null, Validators.required],
            Cause: [(this.data.data && this.data.data.Cause) || null, Validators.required],
            Status: null,
        });
    }
}
