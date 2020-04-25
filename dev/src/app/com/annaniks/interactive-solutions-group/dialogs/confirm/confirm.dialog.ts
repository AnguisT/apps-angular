import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
    selector: 'app-confirm',
    templateUrl: 'confirm.dialog.html',
    styleUrls: ['confirm.dialog.scss']
})
export class ConfirmDialog implements OnInit {


    constructor(
        public dialogRef: MatDialogRef<ConfirmDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() { }

    public onClickYes() {
        this.dialogRef.close(true);
    }

    public onClickNo(){
        this.dialogRef.close();
    }
}