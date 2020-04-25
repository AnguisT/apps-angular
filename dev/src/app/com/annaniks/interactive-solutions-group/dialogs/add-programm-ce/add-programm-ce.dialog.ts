import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigurationService } from '../../views/admin/configurations/configuration.service';

@Component({
    selector: 'app-add-programm-ce-dialog',
    templateUrl: 'add-programm-ce.dialog.html',
    styleUrls: ['add-programm-ce.dialog.scss']
})
export class AddProgrammCeDialogComponent {
    public value = 50;
    public errorMessage;
    constructor(
        public dialogRef: MatDialogRef<AddProgrammCeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {}

    add() {
        if (this.data) {
            const dublicate = this.data.programm_ce.find(ce => Number(ce.NumberPerson) === Number(this.value));
            if (dublicate) {
                this.errorMessage = 'Смета с таким количеством участников существует';
                return;
            }
        }
        this.dialogRef.close(this.value);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
