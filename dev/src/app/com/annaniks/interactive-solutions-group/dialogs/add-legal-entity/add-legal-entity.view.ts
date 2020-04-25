import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ServerResponse} from "../../types/types";
import { ContactsService } from '../../views/admin/contacts/contacts.service';
import { ProjectsService } from '../../views/admin/projects/projects.service';

@Component({
  selector: 'app-add-legal-entity',
  templateUrl: './add-legal-entity.view.html',
  styleUrls: ['./add-legal-entity.view.scss']
})
export class AddLegalEntityView implements OnInit {
  form: FormGroup;
  public legalEntityTypes;
  public taxaties;
  public legalId;
  public selectCompany;
  public companies;

  constructor(public dialogRef: MatDialogRef<AddLegalEntityView>,
              @Inject(MAT_DIALOG_DATA) public data,
              private _fb: FormBuilder,
              private _contactsService: ContactsService,
              private _projectsService: ProjectsService) {
    this.selectCompany = data.CompanyId;
  }

  ngOnInit() {
    this._getAllCompanies();
    this._getLegalEntityTypes();
    this._getTaxaties();
    this._initForm();
  }

  onClick() {
    const data = {
      Entity: {
        AbbrName: this.form.get('AbbrName').value,
        Inn: this.form.get('Inn').value,
        type: this.form.get('TypeLegalEntity').value.Id,
        taxation: this.form.get('Taxation').value.Id,
      },
      CompanyId: this.selectCompany.Id,
    };
    this._contactsService.saveLegalEntity(data).subscribe(data => {
      this.dialogRef.close(true);
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  private _initForm() {
    this.form = this._fb.group({
        TypeLegalEntity: ['', Validators.required],
        Taxation: ['', Validators.required],
        AbbrName: ['', Validators.required],
        Inn: ['', Validators.required],
    });
  }

  private _getAllCompanies() {
    this._projectsService.getAllCompany().subscribe(data => {
      this.companies = data['message'];
    });
  }

  private _getLegalEntityTypes() {
    this._contactsService.getLegalEntityTypes().subscribe((data) => {
      this.legalEntityTypes = data['message'];
    });
  }

  private _getTaxaties() {
    this._contactsService.getTaxaties().subscribe((data) => {
        this.taxaties = data['message'];
    });
  }

}
