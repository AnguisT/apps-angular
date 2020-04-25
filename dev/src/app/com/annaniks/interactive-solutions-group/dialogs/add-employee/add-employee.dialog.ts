import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProjectsService } from '../../views/admin/projects/projects.service';
import { FormGroup, FormBuilder, Validators } from '../../../../../../../node_modules/@angular/forms';
import { ServerResponse } from '../../types/types';

@Component({
    selector: 'add-employee-dialog',
    templateUrl: 'add-employee.dialog.html',
    styleUrls: ['add-employee.dialog.scss']
})
export class AddEmployeeDialog implements OnInit {
    public employee: Array<object> = [];
    public position;
    public formGroup: FormGroup;
    public disabled = false;
    public error = '';
    constructor(
        public dialogRef: MatDialogRef<AddEmployeeDialog>,
        @Inject(MAT_DIALOG_DATA) public data, private _projectsService: ProjectsService, private _formBuilder: FormBuilder) { }

    ngOnInit() {
        this.getPositionEmployee();
        this.validation();
    }

    validation() {
        this.formGroup = this._formBuilder.group({
            selectedPosition: ['', Validators.required],
            selectedEmployee: ['', Validators.required]
        });
        this.formGroup.get('selectedPosition').valueChanges.subscribe((value) => {
            this._projectsService.getEmployeeByPosition(this.formGroup.controls.selectedPosition.value.Id).subscribe((data: ServerResponse) => {
                this.employee = data.message;
            });
        });
    }

    public getPositionEmployee() {
        this._projectsService.getAllPositionEmployee().subscribe((data: ServerResponse) => {
            this.position = data.message;
        })
    }
    public addEmployee() {
        this.disabled = true;
        if (this.formGroup.valid) {
            if (!this.data.editable) {
                this._closeDialog();
                this.disabled = false;
            } else {
                this._projectsService.addProjectEmployee(
                    this.data.projectId,
                    this.formGroup.get('selectedEmployee').value.Id,
                    this.data.mode
                ).subscribe(
                    (data) => {
                        this._closeDialog();
                        this.disabled = false;
                    },
                    (error) => {
                        this.error = error.error.message;
                        this.disabled = false;
                    });
            }
        }
    }

    private _closeDialog() {
        this.dialogRef.close({
            EmployeeName: this.formGroup.get('selectedEmployee').value.name,
            EmployeeId: this.formGroup.get('selectedEmployee').value.Id,
            PositionName: this.formGroup.get('selectedEmployee').value.positionName,
            PositionId: this.formGroup.get('selectedEmployee').value.PositionId,
            DepartmentName: this.formGroup.get('selectedEmployee').value.DepartmentName,
        });
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
