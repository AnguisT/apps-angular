import { Component } from '@angular/core';


@Component({
    selector: 'app-contacts',
    templateUrl: 'contacts.view.html',
    styleUrls: ['contacts.view.scss']
})
export class ContactsView {
    //    public  items;
    //     public companies;
    //     public searchValue: string = '';
    //     private _subscription: Subscription;
    //     public sphereActivity: Array<object>;
    //     public sphereActivityValue: object;
    //     public contactsTypeUrl;
    //     public activeUrl;
    //     constructor(public contactItems: ContactsItemsService,
    //         private _contactServices: ContactsService,
    //         private _router: Router,
    //         private _activatedRoute: ActivatedRoute
    //     ) {
    //         this._router.events.subscribe((url:any) => {
    //             this.activeUrl=url.url;  
    //            // // console.log(this.activeUrl);                                 
    //             this.addContactsType()
    //         }
    //     );
    //         this.items = contactItems.getItems();
    //     }

    //     ngOnInit() {   
    //         this._combineObservables();
    //     }
    //     private _combineObservables() {
    //         const combined = forkJoin(
    //             this._getSphereActivity()
    //         )
    //         this._subscription = combined.subscribe()
    //     }
    //     /**
    //     * return object with key message, which is array of sphere activity
    //     */
    //     private _getSphereActivity() {
    //         return this._contactServices.getAllSphereActivity().pipe(
    //             map((data) => {
    //                 this.sphereActivity = data['message'];
    //                 return data
    //             })
    //         )
    //     }
    //     /**
    //      * add queryParams for search
    //      */
    //     public search() {
    //         const queryParams: Params = Object.assign({}, this._activatedRoute.snapshot.queryParams);
    //         queryParams['q'] = JSON.stringify({ 'search': this.searchValue.trim(), "sphereActivity": this.sphereActivityValue });
    //         this._router.navigate([], { queryParams: queryParams });
    //     }
    //     /**
    //      * by click to add button open necessary add page by url
    //      */
    //     public addContactsType(){               
    //         switch(this.activeUrl){
    //             case ('/contacts/companies') :{               
    //                 this.contactsTypeUrl="/contacts/company/create/new";
    //                 break;
    //             }
    //             case '/contacts/subcontractor':{
    //                 this.contactsTypeUrl="/contacts/subcontractor/create/new";
    //                 break;
    //             }
    //             case '/contacts/managers':{
    //                 this.contactsTypeUrl='/contacts/manager/create/new';
    //                 break;
    //             }
    //             case '/contacts':{
    //                 this.contactsTypeUrl="/contacts/company/create/new";
    //                 break;
    //             }

    //         }    
    //     }

    //     ngOnDestroy() {
    //         this._subscription.unsubscribe();
    //     }
}