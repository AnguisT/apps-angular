import { Component, Input, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContactsService } from '../../views/admin/contacts/contacts.service';
import { ContactsItemsService } from '../../services';
import { map } from 'rxjs/operators';
import { ConfigurationsItemsService } from '../../services/configurationsitems.service';
import { ConfigurationService } from '../../views/admin/configurations/configuration.service';
import { CookieService } from 'angular2-cookie/core';
@Component({
    selector: 'contacts-search',
    templateUrl: 'contacts-search.component.html',
    styleUrls: ['contacts-search.component.css']
})
export class ContactsSearchComponent implements OnInit {
    @Input() url;
    public items;
    public confgItems;
    public companies;
    public searchValue: string = '';
    private _subscription: Subscription;
    public sphereActivity: Array<object>;
    public sphereActivityValue: object;
    public contactsTypeUrl;
    public activeUrl;
    public Id;
    public positionId;
    public isCompanyCreate = false;
    public isManagerCreate = false;
    constructor(public contactItems: ContactsItemsService,
        private _contactServices: ContactsService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _configurationItems: ConfigurationsItemsService,
        private _configurationService: ConfigurationService,
        private _cookiesService: CookieService
    ) {
        this._router.events.subscribe((url: any) => {
            this.activeUrl = url.url;
            this.addContactsType();
        });
        this.items = contactItems.getItems();
        console.log(this.items);
        this.confgItems = _configurationItems.getItems();
        this.Id = this._cookiesService.get('Id');
        this.positionId = this._cookiesService.get('PositionID');
    }

    ngOnInit() {
        this._combineObservables();
    }

    private _combineObservables() {
        const combined = forkJoin(
            this._getSphereActivity(),
            this._getRightsAccess(this.Id),
        )
        this._subscription = combined.subscribe();
    }

    private _getRightsAccess(Id) {
        return this._configurationService.getRightsAccess(Id).pipe(map(res => {
            const generalPosition = [16, 17, 22, 14];
            if (generalPosition.includes(Number(this.positionId))) {
                this.isCompanyCreate = true;
                this.isManagerCreate = true;
            } else {
                if (res['message'][0].Rights) {
                    this.isCompanyCreate = res['message'][0].Rights.isCompanyCreate;
                    this.isManagerCreate = res['message'][0].Rights.isManagerCreate;
                } else {
                    this.isCompanyCreate = false;
                    this.isManagerCreate = false;
                }
            }
        }));
    }

    /**
    * return object with key message, which is array of sphere activity
    */
    private _getSphereActivity() {
        return this._contactServices.getAllSphereActivity().pipe(
            map((data) => {
                this.sphereActivity = data['message'];
                return data
            })
        )
    }
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
            case '/contacts/subcontractor': {
                this.contactsTypeUrl = "/contacts/companies/create/new";
                break;
            }
            case '/contacts/managers': {
                this.contactsTypeUrl = '/contacts/manager/create/new';
                break;
            }
            case '/contacts': {
                this.contactsTypeUrl = "/contacts/companies/create/new";
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

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}