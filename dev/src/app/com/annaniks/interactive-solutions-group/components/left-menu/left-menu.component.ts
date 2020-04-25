import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { AppService } from '../../services';

@Component({
    selector: 'left-menu',
    templateUrl: 'left-menu.component.html',
    styleUrls: ['left-menu.component.scss']
})
export class LeftMenuComponent {
    public menuList:Array<object>;
    constructor(private _menuService:MenuService,public appService:AppService){
        this.menuList=_menuService.getPages();       
    }
    scroll(id){
        this._menuService.scroll(id)
    } 
}