import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProjectsService } from '../../views/admin/projects/projects.service';
@Component({
    selector: 'add-project-date-dialog',
    templateUrl: 'add-project-date.dialog.html',
    styleUrls: ['add-project-date.dialog.scss']
})
export class AddProjectDateDialog {
    public projectDate: Date;

    constructor(
        public dialogRef: MatDialogRef<AddProjectDateDialog>,
        @Inject(MAT_DIALOG_DATA) public data, private _projectsService: ProjectsService) {
    }

    ngOnInit() { }

    addDate() {
        if (this.data.editable) {
            this._projectsService.changeProjectDate(this.data.projectId, this.projectDate).subscribe(data => {
                this.dialogRef.close(this.projectDate);
            })
        }
        else {
            this.dialogRef.close(this.projectDate);
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}