import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { ProgrammsService } from '../../views/admin/programms/programms.service';
import { AddObjectDialog } from '../add-object/add-object.dialog';

@Component({
    selector: 'app-program-ce-template',
    templateUrl: './program-ce-template.dialog.html',
    styleUrls: ['./program-ce-template.dialog.scss'],
})
export class ProgramCETemplateDialogComponent implements OnInit {

    public programs = [];
    public selectProgram;
    public programs_sub = [];
    public selectProgramSub;
    public errorMessage;

    constructor(
        public dialogRef: MatDialogRef<ProgramCETemplateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any | null,
        private _programmsService: ProgrammsService,
        private _matDialog: MatDialog
    ) {}

    ngOnInit() {
        this.getAllProgramm();
    }

    select(event) {
        this.getProgrammCE(event.value.Id);
    }

    confirmSelect() {
        this.getCE(this.selectProgramSub.Id);
    }

    onCancel() {
        this.dialogRef.close();
    }

    private getAllProgramm() {
        this._programmsService.getAllProgramm().subscribe(data => {
            this.programs = data['message'];
        });
    }

    private getProgrammCE(programmId) {
        this._programmsService.getProgrammCE(programmId).subscribe((data) => {
            this.programs_sub = data['message'];
        });
    }

    private addTemplateCE(body) {
        const dialogRef = this._matDialog.open(AddObjectDialog, {
            height: '300px',
            width: '300px',
            data: { title: 'Игровая программа', category: 'Количество участников', key: 'custom' }
        });
        dialogRef.beforeClosed().subscribe(result => {
            if (result) {
                body.NumberPerson = result;
                if (this.data) {
                    const dublicate = this.data.programm_ce.find(ce => Number(ce.NumberPerson) === Number(body.NumberPerson));
                    if (dublicate) {
                        this.errorMessage = 'Смета с таким количеством участников существует';
                        return;
                    }
                }
                body.articles[0].NumberPerson = Number(result);
                this._programmsService.addTemplateCE(body).subscribe((res) => {
                    this.dialogRef.close(res['message']);
                });
            }
        });
    }

    private getCE(Id) {
        this._programmsService.getOneSAByCEId(Id).subscribe(res => {
            const body = {
                ...this.selectProgramSub,
                ProgrammId: this.data.Id,
                articles: res['message'],
            };
            this.addTemplateCE(body);
        });
    }
}
