import {
    Component,
    ViewEncapsulation,

} from '@angular/core';
import { ProfileService } from '../../../../services/profile/profile.service';
import { LoginService } from '../../../../services/login/login.service';
import { LoginProvider } from '../../../login/providers/login.provider';
@Component({
    selector: 'profile-overview',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProfileService
    ]
})
export class ProfileOverviewComponent {
    data: any = {};
    constructor(private profileService: ProfileService,
                private loginProvider: LoginProvider,
                private loginService: LoginService) {
    }

    /**
     * On init component
     */
    ngOnInit() {
        // Loading data
        let authData = this.loginService.getAuthData();
        if (Object.keys(authData).length === 0) {
            setTimeout(() => {
                this.loginProvider.logout();
            });
        }

        // Fetch info
        this.profileService.getUserProfile()
            .subscribe(
                (resp: any) => {
                    this.data = Object.assign({}, this.data, resp, authData);
                },
                (error: any) => {
                    console.error('Failed from /api/paragon/userprofile', error);
                }
            );
    }
}

