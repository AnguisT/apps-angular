import { Injectable } from "@angular/core";

@Injectable()
export class MenuService {
    pages = [

        {
            pageName: 'Тип проекта',
            href: 'typeProject'
        },

        {
            pageName: 'Цикличность',
            href: 'cyclical'
        },

        {
            pageName: 'Формат проекта',
            href: 'formatProject'
        },

        {
            pageName: 'Тип продаж',
            href: 'typeSale'
        },

        {
            pageName: 'Статусы проектов',
            href: 'status'
        },

        {
            pageName: 'Задача проекта',
            href: 'project_task'
        },

        {
            pageName: 'Сегмент',
            href: 'sphereActivity'
        },

        {
            pageName: 'Тип компании',
            href: 'typeCompany'
        },
        {
            pageName: 'Страны и города',
            href: 'country'
        },
        {
            pageName: 'Зоны проведения',
            href: 'areas_conduct'
        },
        {
            pageName: 'Контакты',
            href: 'typeContact'
        },
        {
            pageName: 'Уровень в компании',
            href: 'levelcompany'
        },
        {
            pageName: 'Национальность',
            href: 'nacionparty'
        },
        {
            pageName: 'Язык',
            href: 'langparty'
        },
        {
            pageName: 'Задача проекта',
            href: 'taskproject'
        },
        {
            pageName: 'Бизнес-контент',
            href: 'bizkontent'
        },
        {
            pageName: 'Сценарий',
            href: 'scenariyparty'
        },
        {
            pageName: 'Статусы финансов',
            href: 'financeStatus'
        }
    ];

    pagesLegalPerson = [
        {
            pageName: 'Тип юридического лица',
            href: 'company/legal-person-types'
        },
        {
            pageName: 'Тип налогооблажения',
            href: 'company/legal-person-taxaties'
        },
        {
            pageName: 'Зона ответственности подрядчика',
            href: 'zonereact'
        },
    ];

    getPages() {
        return this.pages;
    }

    getPagesLegalPerson() {
        return this.pagesLegalPerson;
    }

    public scroll(id: any): void {
        let element = document.getElementById(id);
        if (element)
            element.scrollIntoView({ behavior: 'smooth', });
    }
}