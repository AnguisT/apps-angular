import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ConfigurationService} from '../../views/admin/configurations/configuration.service';
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl,
} from '../../../../../../../node_modules/@angular/forms';
import {ContactsService} from '../../views/admin/contacts/contacts.service';
import emailMask from 'text-mask-addons/dist/emailMask';
import * as glibphone from 'google-libphonenumber';

@Component({
  selector: 'add-filial-departament',
  templateUrl: 'add-filial-departament.dialog.html',
  styleUrls: ['add-filial-departament.dialog.scss'],
})
export class AddFilialDepartamentDialog {
  public mask = {
    showMask: true,
    guide: true,
    mask: emailMask,
  };
  public formGroup;
  public legalPersons = [];
  public typeContacts = [];
  public errorMessage;
  constructor(
    public dialogRef: MatDialogRef<AddFilialDepartamentDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _contactsService: ContactsService,
    private formBuilder: FormBuilder,
  ) {
    this.initForm(data.item);
    this._getAllContactType();
    console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initForm(item) {
    this.formGroup = this.formBuilder.group({
      name: [(item && item.Name) || '', Validators.required],
      contacts: new FormArray([]),
      description: [(item && item.Description) || null],
    });
  }

  validation() {
    if (this.formGroup.valid) {
      if (this.formGroup.get('contacts').value.length) {
        const find = this.formGroup
          .get('contacts')
          .value.find((contact) => contact.Id === 14);
        if (find) {
          const phoneUtil = glibphone.PhoneNumberUtil.getInstance();
          const phoneNumber = phoneUtil.parse(this.formGroup.get('text').value);
          const isValidNumber = phoneUtil.isValidNumber(phoneNumber);
          return isValidNumber ? true : false;
        }
        return true;
      }
      return true;
    }
    return false;
  }

  add() {
    if (!this.data.item) {
      this._contactsService
        .addDepartamnet(
          parseInt(this.data.id, 0),
          this.formGroup.controls.name.value,
          this.getContacts(),
          this.formGroup.controls.description.value,
        )
        .subscribe(
          (data) => {
            this.dialogRef.close({
              key: this.data.key,
              object: this.formGroup.controls.name.value,
            });
          },
          (err) => {
            this.errorMessage = err.error.message;
            console.log(err);
          },
        );
    } else {
      this._contactsService
        .updateDepartamnet(
          this.data.item.Id,
          this.formGroup.controls.name.value,
          this.getContacts(),
          this.formGroup.controls.description.value,
        )
        .subscribe(
          (data) => {
            this.dialogRef.close({
              key: this.data.key,
              object: this.formGroup.controls.name.value,
            });
          },
          (err) => {
            this.errorMessage = err.error.message;
            console.log(err);
          },
        );
    }
  }

  getContacts() {
    const result = [];
    for (const control of (<FormArray>this.formGroup.get('contacts'))
      .controls) {
      result.push({
        typeContact: control.value['typeContact'].Id,
        value: control.value['value'],
      });
    }
    return result;
  }

  public removeContact(ind: number) {
    (<FormArray>this.formGroup.get('contacts')).removeAt(ind);
  }

  public addContact() {
    (<FormArray>this.formGroup.get('contacts')).push(
      new FormGroup({
        typeContact: new FormControl('', Validators.required),
        value: new FormControl('', Validators.required),
      }),
    );

    const contacts = this.formGroup.get('contacts') as FormArray;
    contacts.controls.forEach((item) => {
      item.get('typeContact').valueChanges.subscribe((data) => {
        if (data) {
          item.get('value').setValue('');
          if (data.Id !== 14) {
            item.get('value').clearValidators();
            item.get('value').setValidators(Validators.required);
            item.get('value').updateValueAndValidity();
          }
        }
      });
    });
  }

  private _getAllContactType() {
    this._contactsService.getAllTypesContact().subscribe((data) => {
      this.typeContacts = data['message'];
      if (this.data.item) {
        this.data.item.contacts.forEach((res) => {
          const type = this.typeContacts.find(
            (tc) => tc.Id === res.ContactTypeId,
          );
          (<FormArray>this.formGroup.get('contacts')).push(
            new FormGroup({
              typeContact: new FormControl(type, Validators.required),
              value: new FormControl(res.Value, Validators.required),
            }),
          );
        });
      }
    });
  }
}
