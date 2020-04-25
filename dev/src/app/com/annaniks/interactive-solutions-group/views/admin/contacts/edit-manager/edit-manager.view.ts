import { Component } from '@angular/core';
@Component({
    selector: 'edit-manager-view',
    templateUrl: 'edit-manager.view.html',
    styleUrls: ['edit-manager.view.scss']
})
export class EditManagerView {

    menu = [
        {name: 'Общая информация', url: 'general-info'},
        {name: 'Реализованные проекты', url: 'manager-project'}
    ];

    constructor() {}
}
