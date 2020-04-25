import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IProject} from '../../types/types';
import {Subject} from 'rxjs';
import {ProjectsService} from '../../views/admin/projects/projects.service';
import {takeUntil, map} from 'rxjs/operators';

@Component({
  selector: 'app-add-account-event',
  templateUrl: './add-account-event.dialog.html',
  styleUrls: ['./add-account-event.dialog.scss'],
})
export class AddAccountEventDialog implements OnInit {
  form: FormGroup;
  projects = [];
  showProjects = true;
  saveProject;
  status = [
    {Id: 0, Name: 'Не получено'},
    {Id: 1, Name: 'Получено'},
  ];

  private _destroy$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<AddAccountEventDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any | null,
    private _fb: FormBuilder,
    private _projectService: ProjectsService,
  ) {}

  ngOnInit() {
    this._initForm();
    this._getProjects();

    if (this.data.data) {
      this.form.patchValue({
        Day: this.data.data.day,
        Money: this.data.data.money,
      });
      const findStatus = this.status.find(
        item => item.Id === this.data.data.stat,
      );
      this.form.controls['Stat'].setValue(findStatus);
    }
  }

  add() {
    if (this.saveProject) {
      this.form.get('Prod').setValue(this.saveProject);
    }
    this.dialogRef.close(this.form.value);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDelete() {
    this.dialogRef.close({deleteId: this.data.data.id});
  }

  private _getProjects() {
    const statusIds = [54, 56, 57];
    this._projectService.getProject().subscribe(res => {
      this._projectService.getProjectAllEmployee().subscribe(employee => {
        const employees = employee['message'];
        res['message'].forEach(data => {
          const projectEmployees = employees
            .filter(empl => empl.ProjectId === data.Id)
            .map(empl => empl.EmployeeId);
          console.log(projectEmployees);
          if (
            data.ManagerProjectId === Number(this.data.userId) ||
            data.SaleManagerId === Number(this.data.userId)
          ) {
            if (!statusIds.includes(data.StatusId)) {
              this.projects.push(data);
            }
          }
          if (projectEmployees.includes(Number(this.data.userId))) {
            if (!statusIds.includes(data.StatusId)) {
              this.projects.push(data);
            }
          }
        });
        this.projects = this.projects.map(item => ({
          Name: `${item.Name} (${item.Number})`,
          Id: item.Id,
        }));
        if (this.data.data) {
          const findProject = this.projects.find(
            item => item.Id === this.data.data.prod,
          );
          if (!findProject) {
            this.showProjects = false;
            this.saveProject = res['message'].find(
              project => project.Id === this.data.data.prod,
            );
          }
          this.form.controls['Prod'].setValue(findProject);
        }
      });
    });
  }

  private _initForm() {
    this.form = this._fb.group({
      Prod: '',
      Day: '',
      Money: '',
      Stat: '',
    });
  }
}
