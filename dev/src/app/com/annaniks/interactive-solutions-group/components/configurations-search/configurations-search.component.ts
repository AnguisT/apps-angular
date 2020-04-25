import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ConfigurationsItemsService } from '../../services/configurationsitems.service';

@Component({
    selector: 'app-configurations-search',
    templateUrl: './configurations-search.component.html',
    styleUrls: ['./configurations-search.component.css']
})
export class ConfigurationsSearchComponent implements OnInit {
    @Input() url;
    public items;
    public confgItems;
    public companies;
    public searchValue: string = '';
    public sphereActivity: Array<object>;
    public sphereActivityValue: object;
    public contactsTypeUrl;
    public activeUrl;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _configurationItems: ConfigurationsItemsService
    ) {
        this._router.events.subscribe((url: any) => {
            this.activeUrl = url.url;
            this.addContactsType()
        });
        this.confgItems = _configurationItems.getItems();
    }

    ngOnInit() {
    }
    /**
    * return object with key message, which is array of sphere activity
    */
    // private _getSphereActivity() {
    //     return this._contactServices.getAllSphereActivity().pipe(
    //         map((data) => {
    //             this.sphereActivity = data['message'];
    //             return data
    //         })
    //     )
    // }
    /**
     * add queryParams for search
     */
    public search() {
        const queryParams: Params = Object.assign({}, this._activatedRoute.snapshot.queryParams);
        queryParams['q'] = JSON.stringify({ 'search': this.searchValue.trim(), "sphereActivity": this.sphereActivityValue });
        this._router.navigate([], { queryParams: queryParams });
    }
    /**
     * by click to add button open necessary add page by url
     */
    public addContactsType() {
        switch (this.activeUrl) {
            case ('/contacts/companies'): {
                this.contactsTypeUrl = "/contacts/companies/create/new";
                break;
            }
            case '/configurations/subcontractor': {
                this.contactsTypeUrl = "/contacts/companies/create/new";
                break;
            }
            case '/configurations/managers': {
                this.contactsTypeUrl = '/contacts/manager/create/new';
                break;
            }
            case '/configurations': {
                this.contactsTypeUrl = "/contacts/companies/create/new";
                break;
            }
            case '/configurations/isg': {
                this.contactsTypeUrl = "/configurations/companies/create/new";
                break;
            }

        }
    }


    public keydown(event): void {
        if (event.keyCode == 13) {
            this.search();
        }
    }

    public onChange(event: string): void {
        if (event == '' || event == null) {
            this.search();
        }
    }

}
