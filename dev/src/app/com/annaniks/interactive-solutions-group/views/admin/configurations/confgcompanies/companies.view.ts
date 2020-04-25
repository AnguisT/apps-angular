import { Component } from '@angular/core';
import { MenuService } from '../../../../services';


@Component({
    selector: 'companies',
    templateUrl: 'companies.view.html',
    styleUrls: ['companies.view.scss']
})
export class CompaniesView {

    selectedCategory = 0;
    boolvalues = [ false, true, true ];
    boolstrings = [ 'company/legal-person-types', 'company/legal-person-taxaties', 'zonereact' ];
    menuList = [];

    constructor(private menuService: MenuService) {
        this.menuList = this.menuService.getPagesLegalPerson();
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