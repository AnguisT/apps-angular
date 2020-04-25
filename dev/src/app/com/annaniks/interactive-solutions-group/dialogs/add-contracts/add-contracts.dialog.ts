import {Component, Inject} from '@angular/core';
import { ConfigurationService } from '../../views/admin/configurations/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '../../../../../../../node_modules/@angular/material';
import { Validators, FormBuilder } from '../../../../../../../node_modules/@angular/forms';
import { ContactsService } from '../../views/admin/contacts/contacts.service';
@Component({
    selector:'add-contacts-dialog',
    templateUrl:'add-contracts.dialog.html',
    styleUrls:['add-contracts.dialog.scss']
})
export class AddContractsDialog{
    public formGroup;
    constructor(
        public dialogRef: MatDialogRef<AddContractsDialog>,
        @Inject(MAT_DIALOG_DATA) public data,
        private _contactsService: ContactsService, private formBuilder: FormBuilder) {
        this.validation();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    validation() {
        this.formGroup = this.formBuilder.group({
            url: ['', [Validators.required,Validators.minLength(3)]]
        })
    }
    add(){
        switch(this.data.key){
            case 'company':{
                // console.log(this.formGroup.value.url);                
                this._contactsService.addCompanyContract(parseInt(this.data.id),this.formGroup.value.url).subscribe(
                    data=>{
                        // console.log(data);
                        this.dialogRef.close(this.formGroup.value.url)                        
                    }
                )
                break;
            }
            case 'subcontractor':{
                // console.log(this.formGroup.value.url);                
                this._contactsService.addSubcontractorContract(parseInt(this.data.id),this.formGroup.value.url).subscribe(
                    data=>{
                        // console.log(data);
                        this.dialogRef.close(this.formGroup.value.url)                        
                    }
                )
                break;
            }
            case 'manager':{
                // console.log(this.formGroup.value.url);                
                this._contactsService.addManagerContract(parseInt(this.data.id),this.formGroup.value.url).subscribe(
                    data=>{
                        // console.log(data);
                        this.dialogRef.close(this.formGroup.value.url)                        
                    }
                )
                break;
            }
        }
       
    }
}