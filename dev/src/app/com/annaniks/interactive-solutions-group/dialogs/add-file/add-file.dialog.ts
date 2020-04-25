import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-add-file',
    templateUrl: './add-file.dialog.html',
    styleUrls: ['./add-file.dialog.scss']
})
export class AddFileDialog implements OnInit {

    form: FormGroup;

    constructor(public dialogRef: MatDialogRef<AddFileDialog>,
                @Inject(MAT_DIALOG_DATA) public data,
                private _fb: FormBuilder) {
    }

    ngOnInit() {
        this._initForm();
    }

    onSubmit() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }

    onCancel() {
        this.dialogRef.close();
    }

    private _initForm() {
        this.form = this._fb.group({
            name: '',
            url: ''
        });
    }
}
