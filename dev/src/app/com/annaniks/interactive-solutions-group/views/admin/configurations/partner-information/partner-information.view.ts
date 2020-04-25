import { Component } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ConfigurationService } from '../configuration.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'partner-information',
    templateUrl: 'partner-information.view.html',
    styleUrls: ['partner-information.view.scss']
})
export class PartnerInformationView {
    public id: number;
    public employee;
    public allProjects;
    private _subscription: Subscription;
    public contacts;
    public loading: boolean = true;
    constructor(private route: ActivatedRoute, private _configurationService: ConfigurationService) {
        this.route.params.subscribe(params => {
            this.id = params['id']
        });
    }

    ngOnInit() {
        this._combineObservables()
    }
    private _combineObservables() {
        const combined = forkJoin(
            this._getEmployeeById(),
            this._getEmpoyeeProject(),

        )
        this._subscription = combined.subscribe(data => {
            this.loading = false;
        })
    }
    /**
     *this function get information from checked element of partner array 
     */
    private _getEmployeeById() {
        return this._configurationService.getEmployeeById(this.id).pipe(
            map((data) => {
                this.employee = data['data']['message'][0];
                this.contacts = data['data']['Contact'];
                return data
            })
        )
    }
    private _getEmpoyeeProject() {
        return this._configurationService.getEmployeeProject(this.id).pipe(
            map((data) => {
                this.allProjects = data['message'];
                // console.log(data);
                return data
            })
        )
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}