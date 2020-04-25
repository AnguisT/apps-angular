import {Component} from '@angular/core';

@Component({
    selector: 'demo-permissions',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/styles.scss'
    ],
})

export class DemoPermissionsComponent {
    private permissions: Array<string> = [];

    ngOnInit() {
        // this.permissions = this.securityService.getPermissions();
    }
}
