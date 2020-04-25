import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
    selector: 'app-ce-template',
    templateUrl: './ce-template.dialog.html',
    styleUrls: ['./ce-template.dialog.scss'],
})
export class CETemplateDialogComponent implements OnInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public dataSource;

    constructor(
        public dialogRef: MatDialogRef<CETemplateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any | null
    ) {}

    ngOnInit() {
        console.log(this.data);
        this.dataSource = this.data;
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'after',
            widget: 'dxButton',
            options: {
                text: 'Сброс',
                onClick: this.clearAllFilters.bind(this)
            }
        });
    }

    clearAllFilters() {
        this.dataGrid.instance.clearFilter();
        this.dataGrid.instance.clearSorting();
        this.dataGrid.instance.clearGrouping();
        this.dataGrid.instance.clearSelection();
    }

    confirmSelect() {
        const data = this.dataGrid.instance.getSelectedRowsData()[0];
        this.clearAllFilters();
        this.dialogRef.close(data);
    }

    onCancel() {
        this.dialogRef.close();
    }
}
