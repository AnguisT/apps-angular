import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProjectsService } from '../../views/admin/projects/projects.service';
@Component({
    selector:'add-client-manager-dialog',
    templateUrl:'add-client-manager.dialog.html',
    styleUrls:['add-client-manager.dialog.scss']
})
export class AddClientManagerDialog{
    public selectedManger;
    public manager: Array<object> = [];

    constructor(
        public dialogRef: MatDialogRef<AddClientManagerDialog>,
        @Inject(MAT_DIALOG_DATA) public data, private _projectsService: ProjectsService) {
            // console.log(data);
            
         }
    ngOnInit() {
        this._projectsService.getCompanyManager(this.data.company.Id).subscribe((data) => {
            // console.log(data);
            this.manager = data['message']
        })
    }
    addManager() {
        if(this.data.isNew){
            this.dialogRef.close(this.selectedManger);
        }
        
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}