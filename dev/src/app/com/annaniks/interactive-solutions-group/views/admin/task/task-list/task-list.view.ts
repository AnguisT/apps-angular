import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from '../../projects/projects.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Projects, Message } from '../task.models';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie';

@Component({
    selector: 'task-list',
    templateUrl: 'task-list.view.html',
    styleUrls: ['task-list.view.css']
})

export class TaskListView implements OnInit, OnDestroy {

    currentProjects: Message[] = [];
    completedProjects: Message[] = [];
    public loading = true;
    public positionUser;
    public userId;
    private destroy$ = new Subject();

    constructor(private _projectsService: ProjectsService,
        private _cookieServcie: CookieService,
        private _router: Router) {
    }

    ngOnInit(): void {
        this._getProjects();
        this.positionUser = this._cookieServcie.get('PositionID');
        this.userId = this._cookieServcie.get('Id');
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    onDblclick(project: Message) {
        this._router.navigate(['/task/task-board', project.Id]);
    }

    private _getProjects() {
        this._projectsService.getProject()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: Projects) => {
                this._projectsService.getProjectAllEmployee().subscribe(employees => {
                    this._projectsService.getAllEmployee().subscribe(data => {
                        const currentProjectIds = [46, 47, 48, 49, 50, 51, 52, 53, 55];
                        const completedProjectIds = [57, 56, 54];
                        const positionId = [8, 9, 10, 11, 13, 15];
                        const employies = data['message'];

                        const employee = employies.find((empl) => empl.Id === Number(this.userId));
                        res.message.forEach((project: Message) => {
                            const employeesFilter = employees['message'].filter(empl => empl.ProjectId === project.Id).map(empl => empl.EmployeeId);
                            if (positionId.includes(Number(this.positionUser))) {
                                if (employee.Id === project.ManagerProjectId || employeesFilter.includes(Number(this.userId))) {
                                    if (currentProjectIds.includes(project.StatusId)) {
                                        this.currentProjects.push(project);
                                    }
                                    if (completedProjectIds.includes(project.StatusId)) {
                                        this.completedProjects.push(project);
                                    }
                                }
                            } else {
                                if (currentProjectIds.includes(project.StatusId)) {
                                    this.currentProjects.push(project);
                                }
                                if (completedProjectIds.includes(project.StatusId)) {
                                    this.completedProjects.push(project);
                                }
                            }
                        });
                        this.loading = false;
                    });
                }, err => console.log(err));
            });
    }
}
