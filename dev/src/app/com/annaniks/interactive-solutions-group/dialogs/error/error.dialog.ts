import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
    selector: 'error-dialog',
    templateUrl: 'error.dialog.html',
    styleUrls: ['error.dialog.scss']
})
export class ErrorDialog {
    constructor(
        public dialogRef: MatDialogRef<ErrorDialog>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }
    onNoClick(): void {
        this.dialogRef.close();
    }

}