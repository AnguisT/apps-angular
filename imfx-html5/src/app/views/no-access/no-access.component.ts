import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {LocalStorageService} from "ng2-webstorage";
import {ProfileService} from "../../services/profile/profile.service";
@Component({
    selector: 'no-access',
    template: `
        <div style="margin: 15px 0px 0px 15px">
            <h1>403: Access denied</h1>
        </div>
    `
})
export class NoAccessComponent {

    private defaultPage: string;

    private defaultPageSubscription;


    constructor(private router: Router,
                public localStorage: LocalStorageService,
                private profileService: ProfileService) {
        var compRef = this;
        this.profileService.defaultPage.subscribe((page) => {
            this.defaultPage = page;
            if (compRef.defaultPageSubscription) {
                compRef.defaultPageSubscription.unsubscribe();
            }
        })
    }

    ngAfterViewInit() {
        setTimeout(() => {
            // this.router.navigate([ConfigService.getSetupsForRoutes().main]);
            this.router.navigate([this.defaultPage]);
        }, 5000)
    }
}
