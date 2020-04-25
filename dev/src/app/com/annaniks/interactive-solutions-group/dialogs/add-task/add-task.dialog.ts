import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ITask} from '../../views/admin/task/task.models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProjectsService} from '../../views/admin/projects/projects.service';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {CookieService} from 'angular2-cookie';
import {formatDate} from '@angular/common';

@Component({
  selector: 'add-task',
  templateUrl: './add-task.dialog.html',
  styleUrls: ['./add-task.dialog.scss'],
})
export class AddTaskDialog implements OnInit {
  form: FormGroup;
  employees;
  id;
  exec;
  direc;
  createDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm', 'en');
  errorDateValidation;

  constructor(
    public dialogRef: MatDialogRef<AddTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ITask | null,
    private _fb: FormBuilder,
    private _projectsService: ProjectsService,
    private _cookieService: CookieService,
  ) {
    this.id = this._cookieService.get('Id');
  }

  ngOnInit() {
    this._initForm();
    this.getAllEmployee();
  }

  addTask() {
    let formData = this.form.value;
    formData.director = this._checkSelect(
      this.form.get('director').value,
      'Id',
    );
    formData.executor = this._checkSelect(
      this.form.get('executor').value,
      'Id',
    );
    const find = this.employees.find(
      (employee) => employee.Id === formData.executor,
    );
    if (find) {
      formData[
        'imageExecutor'
      ] = `https://crm.i-s-group.ru:3000/static/${find.Image}`;
    }
    formData.createDate = this.createDate;
    this.dialogRef.close(formData);
  }

  deleteTask() {
    this.dialogRef.close({deleteId: this.form.value.id});
  }

  onCancel() {
    this.dialogRef.close();
  }

  done() {
    this.dialogRef.close({doneId: this.form.value.id});
  }

  private _initForm() {
    const data = this.data['task'];
    console.log(data);
    this.form = this._fb.group(
      {
        id: (data && data.id) || Math.random().toString(36).substr(2, 9),
        name: [(data && data.name) || '', Validators.required],
        description: (data && data.description) || '',
        date: (data && data.date) || '',
        time: (data && data.time) || '',
        comment: (data && data.comment) || '',
        director: [null, Validators.required],
        executor: [null, Validators.required],
      },
      {validator: this.dateLessThan('date', 'time')},
    );
    if (data) {
      this.createDate = data.createDate;
    }
  }

  dateLessThan(ddlDate: string, ddlTime: string) {
    return (group: FormGroup): {[key: string]: any} => {
      const f = group.controls[ddlDate];
      const ft = group.controls[ddlTime];
      const t = this.createDate;
      const date = new Date(`${f.value} ${ft.value}`);
      const createDate = new Date(this.createDate);
      const diff = createDate.getTime() - date.getTime();
      if (diff > 0 && f.value) {
        return {
          dates: 'Дата DDL не может быть меньше даты создания задачи.',
        };
      }
      return {};
    };
  }

  private _checkSelect(object, key) {
    let checkedSelect = null;
    if (object && object[key]) {
      checkedSelect = object[key];
    }
    return checkedSelect;
  }

  private getAllEmployee() {
    return this._projectsService.getAllEmployee().subscribe((data) => {
      this.employees = data['message'];
      const project = this.data['project'];
      const findEmployees = [];

      project.Employee.forEach((projEmployee) => {
        const find = this.employees.find(
          (empl) => empl.Id === projEmployee.EmployeeId,
        );
        findEmployees.push(find);
      });
      const filterEmployees = this.employees.filter(
        (employee) =>
          project.ManagerProjectId === employee.Id ||
          project.SaleManagerId === employee.Id,
      );
      this.employees = [...filterEmployees, ...findEmployees];

      let director;
      if (this.data['task']) {
        director = this.employees.find(
          (employee) => employee.Id === this.data['task'].director,
        );
      } else {
        director = this.employees.find(
          (employee) => employee.Id === Number(this.id),
        );
      }
      this.form.patchValue({
        director: director,
        executor: this.data['task']
          ? this.employees.find(
              (employee) => employee.Id === this.data['task'].executor,
            )
          : '',
      });
      return data;
    });
  }
}
