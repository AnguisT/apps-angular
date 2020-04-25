import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {ContactsService} from '../../views/admin/contacts/contacts.service';
import * as glibphone from 'google-libphonenumber';
import emailMask from 'text-mask-addons/dist/emailMask';
import {phone_codes} from '../../shared/phone-codes';
declare var $: any;

@Component({
  selector: 'add-contact-dialog',
  templateUrl: 'add-contact.dialog.html',
  styleUrls: ['add-contact.dialog.scss'],
})
export class AddContactDialog implements OnInit {
  public mask = {
    showMask: true,
    guide: true,
    mask: emailMask,
  };
  public selectedInfo;
  public typeContact: Array<object> = [];
  public formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddContactDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _contactsService: ContactsService,
    private _formBuilder: FormBuilder,
  ) {
    // console.log(data);
  }
  ngOnInit() {
    this._getAllContactType();
    this.initForm();
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      text: [''],
      selectedInfo: ['', Validators.required],
    });
    this.formGroup.get('selectedInfo').valueChanges.subscribe((data) => {
      if (data) {
        if (data.Id === 14) {
          setTimeout(() => {
            this.selectPhone();
          });
        }
        this.formGroup.get('text').setValue('');
      }
    });
  }

  selectPhone() {
    const maskList = $.masksSort(phone_codes, ['#'], /[0-9]|#/, 'mask');
    const maskOpts = {
      inputmask: {
        definitions: {
          '#': {
            validator: '[0-9]',
            cardinality: 1,
          },
        },
        showMaskOnHover: false,
        autoUnmask: true,
      },
      match: /[0-9]/,
      replace: '#',
      list: maskList,
      listKey: 'mask',
      onMaskChange: function (maskObj, completed) {
        if (completed) {
          let hint = maskObj.name_ru;
          if (maskObj.desc_ru && maskObj.desc_ru !== '') {
            hint += ' (' + maskObj.desc_ru + ')';
          }
          $('#descr').html(hint);
        }
        $(this).attr('placeholder', $(this).inputmask('getemptymask'));
      },
    };
    $('#customer_phone').inputmasks(maskOpts);
  }

  validation() {
    if (this.formGroup.valid) {
      if (this.formGroup.get('selectedInfo').value.Id === 14) {
        const inputVal = $('#customer_phone').val();
        const inputLength = inputVal
          .replace('(', '')
          .replace(')', '')
          .replace('-', '')
          .split('');
        if (inputLength.length > 6) {
          try {
            const phoneUtil = glibphone.PhoneNumberUtil.getInstance();
            const phoneNumber = phoneUtil.parse(inputVal);
            const isValidNumber = phoneUtil.isValidNumber(phoneNumber);
            return isValidNumber ? true : false;
          } catch {
            console.log('invalid phone');
          }
        }
        return false;
      }
      if (this.formGroup.get('text').value === '') {
        return false;
      }
      return true;
    }
    return false;
  }

  addContact() {
    let text = '';
    if (this.formGroup.get('selectedInfo').value.Id === 14) {
      text = $('#customer_phone').val();
    } else {
      text = this.formGroup.controls.text.value;
    }
    if (!this.data.new) {
      this.dialogRef.close({
        selectedInfo: this.formGroup.controls.selectedInfo.value,
        text,
      });
    } else {
      this._contactsService
        .addContact(
          this.data.url,
          this.data.id,
          this.formGroup.controls.selectedInfo.value.Id,
          text,
        )
        .subscribe((data) => {
          // console.log(data);
          this.dialogRef.close({
            selectedInfo: this.formGroup.controls.selectedInfo.value,
            text: text,
          });
        });
    }
  }
  private _getAllContactType() {
    this._contactsService.getAllTypesContact().subscribe((data) => {
      this.typeContact = data['message'];
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
