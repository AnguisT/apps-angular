import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-plan',
    templateUrl: './plan.view.html',
    styleUrls: ['./plan.view.scss']
})
export class PlanView implements OnInit {

    menu = [
        {name: 'Компания', url: 'company'},
        {name: 'Сотрудники', url: 'employees'}
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
