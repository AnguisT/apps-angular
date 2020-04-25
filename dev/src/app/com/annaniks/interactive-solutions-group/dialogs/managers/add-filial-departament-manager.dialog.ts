import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigurationService } from '../../views/admin/configurations/configuration.service';
import { FormBuilder, FormGroup, Validators } from '../../../../../../../node_modules/@angular/forms';
import { ContactsService } from '../../views/admin/contacts/contacts.service';
@Component({
    selector: 'add-managers-dialog',
    templateUrl: 'add-filial-departament-manager.dialog.html',
    styleUrls: ['add-filial-departament-manager.dialog.scss']
})
export class AddFilialDepartamentManagerDialog {
    public myformGroup: FormGroup;
    public managers=[];
    constructor(
        public dialogRef: MatDialogRef<AddFilialDepartamentManagerDialog>,
        @Inject(MAT_DIALOG_DATA) public data,
        private _contactsService: ContactsService,
        private _formBuilder: FormBuilder
    ) {
        // console.log(data);
        // console.log(this.data.id);
    }
    ngOnInit() {
        this._getAllManagers();
        this.validation()
    }
    private validation() {
        this.myformGroup = this._formBuilder.group({
            name: ['', Validators.required],
        }

        )
    }
    private _getAllManagers() {
        this._contactsService.getAllManagers().subscribe(data => {
            console.log(data);
            this.managers=data['message']

        })
    }
    /**
     * return object
     * function for add manager for filial,department and company
     */
    public addManager() {       
        switch (this.data.key) {
            case 'company/manager': {
                this._contactsService.addCompanyManager(this.myformGroup.value.name.Id,parseInt(this.data.companyId)).subscribe(data=>{
                    this.dialogRef.close(true)
                })
                break;
            }
            case 'company/filial/manager': {
                this._contactsService.addFilialManager(this.myformGroup.value.name.Id,this.data.id).subscribe(data=>{
                    this.dialogRef.close(true)
                })
                break;
            }
            case 'company/department/manager': {
                this._contactsService.addDepartmentManager(this.myformGroup.value.name.Id,this.data.id).subscribe(data=>{
                    this.dialogRef.close(true)
                })
                break;
            }
        }        
    }
    public onNoClick(): void {
        this.dialogRef.close();
    }

}