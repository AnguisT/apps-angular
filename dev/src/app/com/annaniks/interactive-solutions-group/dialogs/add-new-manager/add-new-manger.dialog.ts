import {Component, OnInit, Inject} from '@angular/core';
import {ContactsService} from '../../views/admin/contacts/contacts.service';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {ProjectsService} from '../../views/admin/projects/projects.service';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {ConfigurationService} from '../../views/admin/configurations/configuration.service';
import {AddFilialDepartamentDialog} from '../add-filial-departament/add-filial-departament.dialog';
import {AddCompanyDialog} from '../add-company/add-company.dialog';

@Component({
  selector: 'app-add-new-manager',
  templateUrl: 'add-new-manger.dialog.html',
  styleUrls: ['add-new-manger.dialog.scss'],
  providers: [ConfigurationService],
})
export class AddNewManagerDialogComponent implements OnInit {
  allSphereActivity;
  companies;
  departments;
  managerForm: FormGroup;
  public genders = [
    {
      Id: 1,
      Name: 'Мужской',
    },
    {
      Id: 2,
      Name: 'Женский',
    },
    {
      Id: 3,
      Name: 'Не определился',
    },
  ];

  constructor(
    private _contactsService: ContactsService,
    private _confService: ConfigurationService,
    private _fb: FormBuilder,
    private _projectsService: ProjectsService,
    public dialogRef: MatDialogRef<AddNewManagerDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  ngOnInit() {
    const combined = forkJoin(
      this._getAllSphereActivity(),
      this._getAllCompany(),
      // this._getDepartments(),
    );
    combined.subscribe();
    this.initForm();
  }

  initForm() {
    console.log(this.data);
    this.managerForm = this._fb.group({
      Name: [null, Validators.required],
      Surname: [null, Validators.required],
      Gender: [null, Validators.required],
      Position: [null, Validators.required],
      CompanyName: [null],
      DepartmentName: [null],
      SphereActivity: [null],
    });

    this.managerForm.get('CompanyName').valueChanges.subscribe(companyName => {
      if (companyName) {
        this._contactsService.getCompanyById(companyName.Id).subscribe(data => {
          this.departments = data['data']['message']['departmentResult'];
        });
      }
    });

    this.managerForm.get('CompanyName').setValue(this.data.Company || null);
  }

  addCompany() {
    this._projectsService
      .addLiteManager(
        this.managerForm.get('Name').value,
        this.managerForm.get('Surname').value,
        this.managerForm.get('Gender').value.Id,
        this.managerForm.get('Position').value.Id,
        null,
        this.managerForm.get('CompanyName').value &&
          this.managerForm.get('CompanyName').value.Id,
        this.managerForm.get('DepartmentName').value &&
          this.managerForm.get('DepartmentName').value.Id,
      )
      .subscribe(data => {
        this.dialogRef.close(true);
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  public openDialog(title, key) {
    if (this.managerForm.get('CompanyName').value) {
      const dialogRef = this.dialog.open(AddFilialDepartamentDialog, {
        width: '600px',
        height: 'auto',
        data: {
          title: title,
          key: key,
          id: this.managerForm.get('CompanyName').value.Id,
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._contactsService
            .getCompanyById(this.managerForm.get('CompanyName').value.Id)
            .subscribe(data => {
              this.departments = data['data']['message']['departmentResult'];
              this.managerForm
                .get('DepartmentName')
                .setValue(this.departments[this.departments.length - 1]);
              this.managerForm.get('DepartmentName').markAsDirty();
            });
        }
      });
    }
  }

  public addNewCompany() {
    const dialogRef = this.dialog.open(AddCompanyDialog, {
      width: '600px',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this._getAllCompany().subscribe(() => {
          this.managerForm
            .get('CompanyName')
            .setValue(this.companies[this.companies.length - 1]);
          this.managerForm.get('CompanyName').markAsDirty();
        });
      }
    });
  }

  private _getAllSphereActivity() {
    return this._contactsService.getAllSphereActivity().pipe(
      map(data => {
        this.allSphereActivity = data['message'];
        return data;
      }),
    );
  }

  private _getDepartments() {
    return this._confService.getCategoryByName('department').pipe(
      map(res => {
        this.departments = res['message'];
        return res;
      }),
    );
  }

  private _getAllCompany() {
    return this._contactsService.getAllCompanies().pipe(
      map(data => {
        this.companies = data['message'];
        return data;
      }),
    );
  }
}
