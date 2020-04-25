import { Component, OnInit, Input } from '@angular/core';
import { ProjectsService } from '../../views/admin/projects/projects.service';
import { CookieService } from 'angular2-cookie/core';
import { Router, NavigationEnd } from '@angular/router';
import { MsgService } from '../../services/sharedata';
import { v } from '@angular/core/src/render3';

@Component({
    selector: 'statistics-menu',
    templateUrl: './statistics-menu.component.html',
    styleUrls: ['./statistics-menu.component.scss']
})
export class StatisticsMenuComponent implements OnInit {

    sections = [];
    menu = [
        {name: 'Рейтинги', url: '/statistics/ratings', key: 'rating'},
        {name: 'Проекты', url: '/statistics/projects', key: 'project'},
        {name: 'План', url: '/statistics/plan', key: 'plan'},
        {name: 'Персонал', url: '/statistics/staff', key: 'staff'}
    ];
    menuProject = [
        {name: 'Поступления', url: '/statistics/projects/income'},
        {name: 'Формат проекта', url: '/statistics/projects/project-format'}
    ];
    menuStaff = [
        {name: 'Переработки', url: '/statistics/staff/processing'},
        {name: 'Командировки', url: '/statistics/staff/trip'},
        {name: 'Отпуска', url: '/statistics/staff/vacation'},
        {name: 'Отгулы', url: '/statistics/staff/day-off'},
    ];
    menuRating = [
        {name: 'Заказчики', url: '/statistics/ratings/customers'},
        {name: 'Клиенты', url: '/statistics/ratings/clients'},
        {name: 'Менеджеры', url: '/statistics/ratings/managers'},
        {name: 'Менеджеры ISG - пресейл', url: '/statistics/ratings/isg-managers'},
        {name: 'Сценаристы ISG - пресейл', url: '/statistics/ratings/isg-screenwriters'},
    ];
    menuPlan = [
        {name: 'Компания', url: '/statistics/plan/company'},
        {name: 'Сотрудники', url: '/statistics/plan/employees'}
    ];

    constructor(private _shareService: MsgService,
                private _router: Router) {
        this._router.events.subscribe((url: any) => {
            if (url instanceof NavigationEnd) {
                if (url.urlAfterRedirects) {
                    this.changeSection(`${url.urlAfterRedirects}`);
                }
            }
        });
    }

    ngOnInit() {
    }

    changeSection(item: string) {
        const items = item.split('/');
        if (items.includes('ratings')) {
            this.sections = this.menuRating;
        } else if (items.includes('projects')) {
            this.sections = this.menuProject;
        } else if (items.includes('plan')) {
            this.sections = this.menuPlan;
        } else if (items.includes('staff')) {
            this.sections = this.menuStaff;
        }
    }
}
