import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProjectsService } from '../../views/admin/projects/projects.service';
@Component({
    selector: 'add-party-date-dialog',
    templateUrl: 'add-party-date.dialog.html',
    styleUrls: ['add-party-date.dialog.scss']
})
export class AddPartyDateDialog {
    public partyDate: Date;

    constructor(
        public dialogRef: MatDialogRef<AddPartyDateDialog>,
        @Inject(MAT_DIALOG_DATA) public data, private _projectsService: ProjectsService) {
    }

    ngOnInit() { }

    addDate() {
        // if (this.data.editable) {
        //     this._projectsService.changeProjectDate(this.data.projectId, this.partyDate).subscribe(data => {
        //         this.dialogRef.close(this.partyDate);
        //     })
        // }
        // else {
        //     this.dialogRef.close(this.partyDate);
        // }
        this.dialogRef.close(this.partyDate);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}