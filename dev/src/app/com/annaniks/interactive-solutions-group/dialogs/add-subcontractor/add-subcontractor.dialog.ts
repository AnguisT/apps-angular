import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProjectsService } from '../../views/admin/projects/projects.service';

@Component({
    selector: 'add-subcontractor-dialog',
    templateUrl: 'add-subcontractor.dialog.html',
    styleUrls: ['add-subcontractor.dialog.scss']
})
export class AddSubcontravtorDialog {
    public selectedSubcontractor;
    public subcontractor: Array<object>;
    public error: string = '';
    public disabled: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<AddSubcontravtorDialog>,
        @Inject(MAT_DIALOG_DATA) public data, private _projectsService: ProjectsService) { }

    ngOnInit() {
        this._projectsService.getAllSubcontractor().subscribe((data) => {
            this.subcontractor = data['message'];
        })
    }

    addSubcontractor() {
        if (this.selectedSubcontractor) {
            this.disabled = true;
            if (this.data.editable) {
                this._projectsService.addCompanySubcontractor(this.data.projectId, this.selectedSubcontractor.Id).subscribe(
                    (data) => {
                        this.dialogRef.close(this.selectedSubcontractor)
                        this.disabled = false;
                    },
                    (error) => {
                        this.disabled = false;
                        this.error = error.error.message;
                    })
            }
            else {
                this.dialogRef.close(this.selectedSubcontractor)
            }
        }
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}