import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-projects',
    templateUrl: 'projects.view.html',
    styleUrls: ['projects.view.scss']
})
export class ProjectsView implements OnInit, OnDestroy {
    constructor(private router: Router) { }

    ngOnInit() {}

    ngOnDestroy() { }
}
