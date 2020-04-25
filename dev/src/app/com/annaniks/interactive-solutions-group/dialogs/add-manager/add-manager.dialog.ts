import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProjectsService } from '../../views/admin/projects/projects.service';
import { ServerResponse } from '../../types/types';

@Component({
    selector: 'add-manager-dialog',
    templateUrl: 'add-manager.dialog.html',
    styleUrls: ['add-manager.dialog.scss']
})
export class AddmanagerDialog {
    public selectedManger;
    public manager: Array<object> = [];
    public error: string;
    public disabled: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<AddmanagerDialog>,
        @Inject(MAT_DIALOG_DATA) public data, private _projectsService: ProjectsService) {
    }

    ngOnInit() {
        this._projectsService.getCompanyManager(this.data.companyId).subscribe((data: ServerResponse) => {
            this.manager = data.message;
        })
    }

    addManager() {
        this.disabled = true;
        if (!this.data.editable) {
            this.dialogRef.close(this.selectedManger);
            this.disabled = false;
        }
        else {
            let type = (this.data.type == 'customer') ? 0 : 1;
            this._projectsService.addCompanyManager(this.data.projectId, this.selectedManger.Id, this.data.companyId, type).subscribe(
                (data) => {
                    this.dialogRef.close(this.selectedManger);
                    this.disabled = false;
                },
                (error) => {
                    this.error = error.error.message;
                })

        }
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}