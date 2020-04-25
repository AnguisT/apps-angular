import { Component, OnInit, OnDestroy } from '@angular/core';
import { TopbarItemsService } from '../../services';
import { TopbarItem } from '../../types/types';
import { ConfigurationService } from './configurations/configuration.service';
import { CookieService } from 'angular2-cookie';
import { map } from 'rxjs/operators';

@Component({
    selector:'app-admin',
    templateUrl:'admin.view.html',
    styleUrls:['admin.view.css']
})
export class AdminView implements OnInit, OnDestroy {
    public topbarItems: Array<TopbarItem> = [];
    constructor(private _topbarItemsService: TopbarItemsService) {}

    ngOnInit() {
        this.topbarItems = this._topbarItemsService.getItems();
    }

    ngOnDestroy() {}
}
