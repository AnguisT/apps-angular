import { Component } from '@angular/core';

@Component({
    selector: 'app-statistics',
    templateUrl: 'statistics.view.html',
    styleUrls: ['statistics.view.scss']
})
export class StatisticsView {
    menu = [
        {name: 'Рейтинги', url: 'ratings'},
        {name: 'Проекты', url: 'projects'},
        {name: 'План', url: 'plan'},
        {name: 'Персонал', url: 'staff'}
    ];
}
