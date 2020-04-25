import { Injectable } from '@angular/core';
import { TopbarItem } from '../types/types';

@Injectable()
export class ContactsItemsService{
    private contactItems = [
        {
            Id: 1,
            label:'Компании',
            routerLink:'/contacts/companies'
        },
        {
            Id: 2,
            label:'Менеджеры',
            routerLink:'/contacts/managers'
        },
        // {
        //     label: 'Департаменты',
        //     routerLink: '/contacts/departments'
        // },
        {
            Id: 3,
            label:'Подрядчики',
            routerLink:'/contacts/subcontractor'
        }
    ]

    public getItems(){
        return this.contactItems;
    }


}