import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../../../services';
import { CookieService } from 'angular2-cookie';
import { Router } from '@angular/router';

@Component({
    selector: 'app-configurations',
    templateUrl: 'configurations.view.html',
    styleUrls: ['configurations.view.scss']
})
export class ConfigurationsView implements OnInit, OnDestroy {

    constructor(
        public appService: AppService
    ) { }

    ngOnInit() {
        this.appService.menuIconVisiblity = true;
    }

    ngOnDestroy() {
        this.appService.menuIconVisiblity = false;
    }
}