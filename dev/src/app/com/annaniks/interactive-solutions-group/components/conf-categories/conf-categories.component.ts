import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ConfigurationService } from '../../views/admin/configurations/configuration.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorDialog, AddObjectDialog, ConfirmDialog } from '../../dialogs';
import { DialogService } from '../../services/dialog.service';
import { MessageService } from 'primeng/api';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
    selector: 'conf-categories',
    templateUrl: 'conf-categories.component.html',
    styleUrls: ['conf-categories.component.scss']
})

export class ConfigurationCategoriesComponent implements OnInit, OnDestroy {
    public loading: boolean = true;
    @Input('categoryName') private categoryName: string = '';
    @Input('conf-info') confInfo: object;
    @Input('title') title: string = '';
    @Input ('id') id;
    public categories: Array<object> = [];
    private _subscription: Subscription;
    constructor(
        private _matDialog: MatDialog,
        private _configurationService: ConfigurationService,
        private dialogService: DialogService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this._subscription = this._getCategories(this.categoryName).subscribe();
    }
    private _getCategories(categoryName: string) {
        this.loading = true;
        console.log(categoryName);
        return this._configurationService.getCategoryByName(categoryName).pipe(
            map((data) => {
                this.categories = data['message'];
                this.loading = false;
                return data;
            })
        );
    }

    public deleteObject(url) {
        const dialogRef = this._matDialog.open(ConfirmDialog, {
            width: '350px',
            panelClass: 'padding24'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._configurationService.deleteObjectById(url).subscribe((data) => {
                    this._getCategories(this.categoryName).subscribe();
                });
            }
        });
    }

    public addObject() {
        let dialogRef = this._matDialog.open(AddObjectDialog, {
            height: '300px',
            width: '300px',
            data: { title: this.confInfo['label'], category: this.confInfo['text'], key: this.confInfo['type'] }
        });
        dialogRef.beforeClose().subscribe(result => {
            if (result) {
                this._getCategories(this.categoryName).subscribe();
            }
        });
    }

    save(value, index) {
        const body = {
            Id: this.categories[index]['Id'],
            Name: value,
            Mode: this.categories[index]['Mode']
        };
        this._configurationService.updateObject(this.confInfo['type'], body).subscribe(() => {
            this._getCategories(this.categoryName).subscribe(() => {
                this.messageService.add({severity: 'success', summary: 'Успешно', detail: 'Успешно сохранено'});
            });
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
        this.categories.forEach((item, index) => {
            item['SortIndex'] = index + 1;
        });
        this._configurationService.updateSortIndexObject(`${this.confInfo['type']}/sort`, {categories: this.categories}).subscribe(() => {
            this.messageService.add({severity: 'success', summary: 'Успешно', detail: 'Успешно сохранено'});
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}