import { Component } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ContactsService } from '../contacts.service';
@Component({
    selector: 'manager-information-view',
    templateUrl: 'manager-information.view.html',
    styleUrls: ['manager-information.view.scss']
})

export class ManagerInformationView {
    private _subscription: Subscription;
    public id: number;
    public manager;
    public allProjects;
    public loading: boolean = true;
    public contacts = [];
    public contracts: Array<string> = [];
    constructor(private _contactsService: ContactsService, private route: ActivatedRoute, private _router: Router, ) {
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    }
    ngOnInit() {
        this._combineObservables();
    }
    private _combineObservables() {
        const combined = forkJoin(
            this._getManagerById(),

        )
        this._subscription = combined.subscribe(data => {
            this._getManagerProject().subscribe()
        })
    }
    /**
     * get manager by id
     */
    private _getManagerById() {
        return this._contactsService.getManagerById(this.id).pipe(
            map((data) => {
                this.manager = data['data']['message'][0];
                this.contacts = data['data']['Contact'];
                this.contracts = (this.manager && this.manager.Contracts) ? this.manager.Contracts.split(',') : [];
                this.contracts.forEach((element: string, index: number) => {
                    if (element.length == 0) {
                        this.contracts.splice(index, 1);
                    }
                })
                // console.log(this.manager);                
                return data
            })
        )
    }
    /**
     * get all projects
     */
    private _getManagerProject() {
        return this._contactsService.getProjectList('managers', this.manager.Id).pipe(
            map((data) => {
                this.allProjects = data['message'];
                this.loading = false
                return data
            })
        )
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}