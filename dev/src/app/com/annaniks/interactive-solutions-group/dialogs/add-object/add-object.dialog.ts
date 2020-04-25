import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigurationService } from '../../views/admin/configurations/configuration.service';

@Component({
    selector: 'add-object-dialog',
    templateUrl: 'add-object.dialog.html',
    styleUrls: ['add-object.dialog.scss']
})
export class AddObjectDialog {
    public object = '';
    public showModeTypeProject = false;
    public selectedItem = {
        Id: 1,
        Name: 'Клиент'
    };
    public modeTypePropjects = [
        {
            Id: 1,
            Name: 'Клиент'
        },
        {
            Id: 2,
            Name: 'Заказчик и Клиент'
        },
        {
            Id: 3,
            Name: 'Клиент и Комиссионер'
        },
    ];
    constructor(
        public dialogRef: MatDialogRef<AddObjectDialog>,
        @Inject(MAT_DIALOG_DATA) public data,
        private _configurationService: ConfigurationService) {
        if (this.data.key === 'typeProject') {
            this.showModeTypeProject = true;
        }
    }

    addObject() {
        if (this.data.key === 'city') {
            if (this.object.length !== 0) {
                this._configurationService.addCityByCountry(
                    this.data.key,
                    {
                        Name: this.object,
                        CountryId: this.data.countryId
                    }
                ).subscribe((data) => {
                    this.dialogRef.close(this.data.key);
                });
            }
            return;
        } else if (this.data.key === 'custom') {
            this.dialogRef.close(this.object);
        } else if (this.data.key === 'typeProject') {
            if (this.object.length !== 0) {
                this._configurationService.addTypeProject(this.data.key, this.object, this.selectedItem.Id).subscribe((data) => {
                    this.dialogRef.close(this.data.key);
                });
            }
        } else {
            if (this.object.length !== 0) {
                this._configurationService.addObject(this.data.key, this.object).subscribe((data) => {
                    this.dialogRef.close(this.data.key);
                });
            }
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
