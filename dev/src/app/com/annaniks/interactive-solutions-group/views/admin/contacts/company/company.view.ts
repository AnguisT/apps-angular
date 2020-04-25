import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';
import { ContactsService } from '../contacts.service';
@Component({
    selector: 'company-view',
    templateUrl: 'company.view.html',
    styleUrls: ['company.view.scss']
})
export class CompanyView implements OnInit {
    public id: number;
    private _subscription: Subscription;
    public partner;
    public resident;
    public company;
    public projects: Array<object> = [];
    public filials = [];
    public contracts;
    public departaments = [];
    public managers = [];
    public contacts;
    public loading: boolean = true;
    constructor(private _contactsService: ContactsService, private route: ActivatedRoute, private _router: Router) {
        this.route.params.subscribe(params => {
            this.id = params['id']
        });
    }

    ngOnInit() {
        this._combineObservables()
    }
    private _combineObservables() {
        const combined = forkJoin(
            this._getCompanyById(),

        )
        this._subscription = combined.subscribe(data => {
            this._getCompanyProjects()

        })
    }
    /**
     * return of checked company element by id
     */
    private _getCompanyById() {
        return this._contactsService.getCompnayById(this.id).pipe(
            map((data) => {
                this.company = data['data']['message']['data'][0];
                this.contacts = data['data']['Contact'];
                // console.log(data);
                this.filials = data['data']['message']['filialResult'];
                this.departaments = data['data']['message']['departmentResult'];
                this.managers = data['data']['message']['managerResult']
                this.partner = this.company.Partner['data'][0] === 0 ? 'Нет' : "Да"
                //this.resident = this.company.Resident['data'][0] === 0 ? 'Нет' : "Да";
                this.contracts = (this.company && this.company.Contracts) ? this.company.Contracts.split(',') : [];
                this.contracts.forEach((element: string, index: number) => {
                    if (element.length == 0) {
                        this.contracts.splice(index, 1);
                    }
                })
                return data
            })
        )
    }

    /**
     * return array of company
     */
    private _getCompanyProjects() {
        // console.log(this.company);
        this._contactsService.getCompanyProject(this.company.Id).subscribe(data => {
            this.projects = data['message']
            this.loading = false
        })
    }
    editCompanyInformation() {
        this._router.navigate(['/configurations/company/1/edit'])
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}