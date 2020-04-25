import { Component } from '@angular/core';

@Component({
    selector: 'managers',
    templateUrl: 'managers.view.html',
    styleUrls: ['managers.view.scss']
})

export class ManagersView {
    selectedCategory = 0;
    boolvalues = [ false, true ];
    boolstrings = [ 'project-roles-isg', 'project-roles-manager', ];
    menuList = [
        {
            pageName: 'Роли ОП менеджера ISG',
            href: 'project-roles-isg'
        },
        {
            pageName: 'Роли ОП менеджера',
            href: 'project-roles-manager'
        },
    ];

    constructor() {
    }

    scroll(id, index){
        this.selectedCategory = index;
        this.checkIsBoolean(id.href);
    }

    private checkIsBoolean(key) {
        console.log(key);
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
}
