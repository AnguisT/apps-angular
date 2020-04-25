import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationsItemsService {
    private configurationItems = [
        {
            label:'Проекты',
            routerLink:'/configurations/categories'
        },
        {
            label:'Роли',
            routerLink:'/configurations/roles'
        },
        {
            label:'Компании',
            routerLink:'/configurations/confgcompanies'
        },
        {
            label:'Менеджеры',
            routerLink:'/configurations/confgmanagers'
        },
        {
            label:'План',
            routerLink:'/configurations/plans'
        },
        {
            label:'ISG',
            routerLink:'/configurations/isg'
        }
    ]

    public getItems(){
        return this.configurationItems;
    }


}