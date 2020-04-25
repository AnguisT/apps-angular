import { Component, OnInit } from '@angular/core';
import { AppService, MenuService } from '../../../../services';
import { ConfigurationService } from '../configuration.service';
import { AddObjectDialog, ConfirmDialog } from '../../../../dialogs';
import { MatDialog } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'categories',
    templateUrl: 'categories.view.html',
    styleUrls: ['categories.view.scss']
})
export class CategoriesView implements OnInit {
    selectedCategory = 0;
    boolvalues = [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];

    boolstrings = ['typeProject', 'departament', 'cyclical', 'formatProject', 'levelcompany', 'nacionparty', 'langparty',
        'taskproject', 'bizkontent', 'scenariyparty', 'typeSale', 'status', 'project_task', 'positionEmployees',
        'sphereActivity', 'typeCompany', 'country', 'areas_conduct', 'typeContact', 'financeStatus'
    ];
    customCategory = ['city', 'country'];
    citiesByCountry = [];
    selectedCountryId: number;
    public menuList: Array<object>;
    constructor(
        private _menuService: MenuService,
        public appService: AppService,
        private _matDialog: MatDialog,
        private _configurationService: ConfigurationService,
        private messageService: MessageService) {
        this.menuList = _menuService.getPages();
    }

    ngOnInit() {
        this.customCategory.forEach((data) => {
            this.getCategoryName(data);
        });
    }

    selectCountry(country) {
        this.selectedCountryId = country.Id;
        this.citiesByCountry = this['city'].filter(item => item.CountryId === country.Id);
    }

    scroll(id, index) {
        this.selectedCategory = index;
        this.checkIsBoolean(id.href);
    }

    changeIsCapital(item) {
        this.citiesByCountry.forEach((city) => {
            if (city.Id !== item.Id) {
                city.isCapital = false;
            }
        });
        const data = {
            ...item,
            isCapital: item.isCapital === true ? 1 : 0,
        };
        this._configurationService.updateCityByCountry({...data}).subscribe(res => {
            console.log(res);
        });
    }

    private checkIsBoolean(key) {
        let t = 0;
        for (let i = 0; i < this.boolvalues.length; i++) {
            if (this.boolvalues[i] === false) {
                t = i;
            }
        }

        for (let i = 0; i < this.boolstrings.length; i++) {
            if (this.boolstrings[i] === key) {
                this.boolvalues[t] = true;
                this.boolvalues[i] = false;
            }
        }
    }

    private _getCategories(categoryName: string) {
        return this._configurationService.getCategoryByName(categoryName).subscribe((data) => {
            this[categoryName] = data['message'];
            if (categoryName === 'city') {
                this.selectCountry({Id: this.selectedCountryId});
            }
            return data;
        });
    }

    public deleteObject(url, categoryName) {
        const dialogRef = this._matDialog.open(ConfirmDialog, {
            width: '350px',
            panelClass: 'padding24'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._configurationService.deleteObjectById(url).subscribe((data) => {
                    this._getCategories(categoryName);
                });
            }
        });
    }

    public addObject() {
        const dialogRef = this._matDialog.open(AddObjectDialog, {
            height: '300px',
            width: '300px',
            data: { title: 'Добавить страну', category: 'Страна', key: 'country' }
        });
        dialogRef.beforeClosed().subscribe(result => {
            if (result) {
                this._getCategories('country');
            }
        });
    }

    public addCity() {
        const dialogRef = this._matDialog.open(AddObjectDialog, {
            height: '300px',
            width: '300px',
            data: { title: 'Добавить город', category: 'Город', key: 'city', countryId: this.selectedCountryId }
        });
        dialogRef.beforeClosed().subscribe(result => {
            if (result) {
                this._getCategories('city');
            }
        });
    }

    saveCountry(value, index) {
        console.log(value);
        console.log(this['country'][index]['Id']);
        const body = {
            Id: this['country'][index]['Id'],
            Name: value,
        };
        this._configurationService.updateObject('country', body).subscribe(() => {
            this._getCategories('country');
            this.messageService.add({severity: 'success', summary: 'Успешно', detail: 'Успешно сохранено'});
        });
    }

    saveCity(value, index) {
        const body = {
            Id: this.citiesByCountry[index]['Id'],
            Name: value,
        };
        this._configurationService.updateObject('city/name', body).subscribe(() => {
            this._getCategories('city');
            this.messageService.add({severity: 'success', summary: 'Успешно', detail: 'Успешно сохранено'});
        });
    }

    dropCountry(event: CdkDragDrop<string[]>) {
        moveItemInArray(this['country'], event.previousIndex, event.currentIndex);
        this['country'].forEach((item, index) => {
            item['SortIndex'] = index + 1;
        });
        this._configurationService.updateSortIndexObject('country/sort', {categories: this['country']}).subscribe(() => {
            this.messageService.add({severity: 'success', summary: 'Успешно', detail: 'Успешно сохранено'});
        });
        this._getCategories('country');
    }

    dropCity(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.citiesByCountry, event.previousIndex, event.currentIndex);
        this.citiesByCountry.forEach((item, index) => {
            item['SortIndex'] = index + 1;
        });
        this._configurationService.updateSortIndexObject('city/sort', {categories: this.citiesByCountry}).subscribe(() => {
            this.messageService.add({severity: 'success', summary: 'Успешно', detail: 'Успешно сохранено'});
        });
        this._getCategories('city');
    }

    getCategoryName(categoryName) {
        return this._configurationService.getCategoryByName(categoryName).subscribe((data) => {
            this[categoryName] = data['message'];
        });
    }
}
