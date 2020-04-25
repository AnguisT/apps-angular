import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { Subscription, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services';


@Component({
    selector: 'project-info',
    templateUrl: 'project-info.view.html',
    styleUrls: ['project-info.view.scss']
})
export class ProjectInfoView implements OnInit, OnDestroy {
    private _subscription: Subscription;
    private id: number;
    public project: Array<object>;
    public tender: string;
    public comment;
    public projectComments;
    public loading: boolean = true;
    private _allCyclicalProject: Array<object>;
    public isGet: boolean = false;
    public selectedCyclicalProject;
    constructor(private route: ActivatedRoute, private _projectServices: ProjectsService, private _apiService: ApiService) {
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    }

    ngOnInit() {
        this._combineObservables();
    }
    private _combineObservables() {
        const combined = forkJoin(
            this._getAllCyclicalProject()
        )
        this._subscription = combined.subscribe(data => {
            this._getProjectById();
        }
        )
    }

    private _getProjectById() {
        this._projectServices.getProjectById(this.id).subscribe(data => {
            // console.log(data);
            this.project = data['message'][0];
            this.tender = this.project['data'] == false ? 'Нет' : 'Да';
            this.projectComments = this.project["comment"];
            this.loading = false;
            this.isGet = true;
            this.selectedCyclicalProject = this._getSelectedCyclicalProject()
        })
    }
    public addComment() {
        this._apiService.post('project/comment', {
            "ProjectId": this.id,
            "Name": this.comment
        }).subscribe(data => {
            this.loading = true;
            this.comment = "";
            this._getProjectById();
        })
    }
    private _getAllCyclicalProject() {
        return this._projectServices.getAllCyclicalProject().pipe(
            map((data) => {
                this._allCyclicalProject = data['message'];
                return data;
            })
        )
    }
    private _getSelectedCyclicalProject() {
        if (this._allCyclicalProject) {
            return this._allCyclicalProject.filter(data => {
                return data['Id'] == this.project['CyclicityId'];
            })[0]["Name"];
        }
    }

    public setImage(owner: string): object {
        if (this.project[owner]) {
            return {
                'background-image': 'url(https://crm.i-s-group.ru:3000/static/' + this.project[owner]
            }
        }
        return {}
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}