import { Injectable } from '@angular/core';
import { TopbarItem } from '../types/types';
import { Subject } from 'rxjs';

@Injectable()
export class TopbarItemsService{
    onChangeFinance$ = new Subject();
    private topbarItems:Array<TopbarItem> = [
        {
            label:'Проекты',
            imag:'prod.svg',
            routerLink:'/projects'
        },
        {
            label:'CRM',
            imag:'info.svg',
            routerLink:'/contacts'
        },
        {
            label:'Задачи',
            imag:'task.svg',
            routerLink:'/task'
        },
        {
            label:'Статистика',
            imag:'stat.svg',
            routerLink:'/statistics'
        },
        {
            label: 'Программы',
            imag: 'game-programm.svg',
            routerLink: '/programms'
        },
        {
            label: 'Финансы',
            imag: 'finance.svg',
            routerLink: '/finance'
        }
    ]

    public getItems(){
        return this.topbarItems;
    }


}