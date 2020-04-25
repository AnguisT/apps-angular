import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'edit-company-view',
    templateUrl: 'edit-company.view.html',
    styleUrls: ['edit-company.view.scss']
})
export class EditCompanyView implements OnInit {

    id;
    menu = [];

    constructor(private router: ActivatedRoute) {
        this.router.parent.params.subscribe(params => {
            this.id = params['id'];
            if (this.id) {
                this.menu = [
                    {name: 'Общая информация', url: 'general-info'},
                    {name: 'Менеджеры, Проекты', url: 'manager-project'},
                    {name: 'Юр.лица, Проекты', url: 'projects'}
                ];
            } else {
                this.menu = [
                    {name: 'Общая информация', url: 'general-info'},
                ];
            }
        });
    }

    ngOnInit(): void {
    }
}
