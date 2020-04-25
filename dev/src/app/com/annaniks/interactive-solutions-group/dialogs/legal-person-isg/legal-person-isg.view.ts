import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ServerResponse} from "../../types/types";
import { ContactsService } from '../../views/admin/contacts/contacts.service';

@Component({
  selector: 'app-legal-person-isg',
  templateUrl: './legal-person-isg.view.html',
  styleUrls: ['./legal-person-isg.view.scss']
})
export class LegalPersonISGComponent implements OnInit {
  form: FormGroup;
  public legalEntityTypes;
  public taxaties;
  public legalId;

  constructor(public dialogRef: MatDialogRef<LegalPersonISGComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private _fb: FormBuilder,
              private _contactsService: ContactsService) {
      this.legalEntityTypes = data.types;
      this.taxaties = data.taxaties;
  }

  ngOnInit() {
    this._initForm();
    this._fillForm();

  }

  cancel() {
    this.dialogRef.close();
  }

  onClick() {
    const data = {
      id: this.legalId,
      ...this.form.value,
      type: this.form.get('TypeLegalEntity').value.Id,
      taxation: this.form.get('Taxation').value.Id
    };
    delete data.TypeLegalEntity;
    delete data.Taxation;
    this.dialogRef.close(data);
  }

  private _fillForm() {
    if (this.data.entity) {
      this.legalId = this.data.entity.id;
      this.form.patchValue(this.data.entity);
    }
  }

  deleteLegalEntities() {
    this.dialogRef.close({action: 'delete', id: this.legalId});
  }

  private _initForm() {
    this.form = this._fb.group({
        TypeLegalEntity: '',
        Taxation: '',
        FullNameEntity: ['', Validators.required],
        AbbrName: ['', Validators.required],
        LegalAddress: '',
        ActualAddress: '',
        Inn: '',
        Kpp: '',
        Okonx: '',
        Okpo: '',
        Ogrn: '',
        SurName: '',
        Name: '',
        MiddleName: '',
        Acting: '',
        FullNameBank: '',
        AbbrBank: '',
        Bik: '',
        BillNumber: '',
        PaymentAccountNumber: '',
    });
  }

}
