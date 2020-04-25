import { Component } from "@angular/core";
import { forkJoin, Subscription } from "rxjs";
import { ConfigurationService } from "../configuration.service";
import { map } from "rxjs/operators";
import { AppService } from "../../../../services";
import { CookieService } from 'angular2-cookie/core';


@Component({
    selector: 'partner',
    templateUrl: 'partner.view.html',
    styleUrls: ['partner.view.scss']
})
export class PartnerView {
    public fileUrl = "https://crm.i-s-group.ru:3000/static/"
    private _subscription: Subscription;
    public allEmployee: Array<object>;
    public id: number;
    public loading: boolean = true
    constructor(private _configurationService: ConfigurationService,public appService:AppService,
        private _cookieService: CookieService) { 
           
        }
    ngOnInit() {
        this._combineObservables();
    }
    private _combineObservables() {
        const combined = forkJoin(
            this._getAllEmployee(),
        )
        this._subscription = combined.subscribe(data => {
            this.loading = false
        }
        )
    }
    openCloseMenu(){
        this.appService.isOpen=!this.appService.isOpen;
    }
    /**
     * return object with key message, which is array of employee
     */
    private _getAllEmployee() {
        return this._configurationService.getAllEmployee().pipe(
            map((data) => {
                this.allEmployee = data['message'];
                return data
            })
        )
    }
    public setImage(item) {
        let style = {}
        if (item.Image) {
            style['background-image'] = 'url(' + this.fileUrl + item.Image + ')';
        } else {
            let defualtImage = 'assets/images/colors.jpg'
            style['background-image'] = 'url(' + defualtImage + ')'
        }
        return style
    }
    
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}