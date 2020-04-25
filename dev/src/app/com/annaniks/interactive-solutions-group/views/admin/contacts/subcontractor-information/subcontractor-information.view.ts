import { Component } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from '../../../../../../../../../node_modules/rxjs/operators';
import { ContactsService } from '../contacts.service';
@Component({
    selector: 'subcontractor-information-view',
    templateUrl: 'subcontractor-information.view.html',
    styleUrls: ['subcontractor-information.view.scss']
})
export class SubcontractorsInformationView {
    private _subscription: Subscription;
    public id: number;
    public subcontractor;
    public allProjects;
    public loading: boolean = true;
    public contacts;
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
            this._getSubcontractorById(),
        )
        this._subscription = combined.subscribe(data => {
            this._getSubcontractorProject().subscribe()

        })
    }
    /**
     * get subcontractor by id
     */
    private _getSubcontractorById() {
        return this._contactsService.getSubcontractorById(this.id).pipe(
            map((data) => {
                // console.log(data);                
                this.subcontractor = data['data']['message'][0];
                this.contacts = data['data']['Contact'];
                this.contracts = (this.subcontractor.Contracts) ? this.subcontractor.Contracts.split(',') : [];
                this.contracts.forEach((element: string, index: number) => {
                    if (element.length == 0) {
                        this.contracts.splice(index, 1);
                    }
                });
                return data
            })
        )
    }
    /**
     * get all projects
     */
    private _getSubcontractorProject() {
        return this._contactsService.getProjectList('subcontractors', this.subcontractor.Id).pipe(
            map((data) => {
                this.allProjects = data['message'];
                // console.log(this.allProjects);                  
                this.loading = false
                return data
            })
        )
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

}