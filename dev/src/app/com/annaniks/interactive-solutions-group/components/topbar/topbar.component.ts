import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TopbarItem } from '../../types/types';
import { CookieService } from 'angular2-cookie';
import { Router } from '@angular/router';
import { AppService, TopbarItemsService } from '../../services';
import { ConfigurationService } from '../../views/admin/configurations/configuration.service';
import { forkJoin } from 'rxjs';
import { map, find } from 'rxjs/operators';
import { FinanceService } from '../../views/admin/finance/finance.service';
import { MsgService } from '../../services/sharedata';

@Component({
    selector: 'topbar',
    templateUrl: 'topbar.component.html',
    styleUrls: ['topbar.component.css'],
    providers: [FinanceService]
})
export class TopbarComponent implements OnInit, OnDestroy {
    @Input('items') public topbarItems: Array<TopbarItem> = [];
    @Input('logout') public logOutVisiblity: boolean = true;
    public Id: number;
    public positionId: number;
    public isShow = false;
    public finances = [];
    public rights;

    constructor(
        private _cookieService: CookieService,
        private _router: Router,
        public appService: AppService,
        private _configurationService: ConfigurationService,
        private _financeService: FinanceService,
        private data: TopbarItemsService
    ) {
        this.Id = Number(this._cookieService.get('Id'));
        this.positionId = Number(this._cookieService.get('PositionID'));
    }

    ngOnInit() {
        const combined = forkJoin(
            this._getRightAccess(),
            this._getAllFinance(),
        );

        combined.subscribe(() => {
            this.updateRight();
        });

        this.data.onChangeFinance$.subscribe(() => {
            this._getAllFinance().subscribe(() => {
                this.updateRight();
            });
        });
    }

    public updateRight() {
        const generalPosition = [16, 17, 22, 14];
        const findFinance = this.finances.find(finance => finance.StatusId === 1);
        if (this.rights) {
            if (generalPosition.includes(this.positionId)) {
                this.isShow = true;
            } else if (this.rights.isFinanceVisible && findFinance) {
                this.isShow = true;
            } else {
                this.isShow = false;
            }
        } else {
            this.isShow = false;
        }
    }

    public logOut() {
        if (this.logOutVisiblity) {
            this._cookieService.remove('accessToken');
            this._cookieService.remove('refreshToken');
            this._router.navigate(['/login']);
        }
    }

    public openCloseMenu(): void {
        if (this.appService.menuIconVisiblity) {
            this.appService.isOpen = !this.appService.isOpen;
        }

    }

    private _getRightAccess() {
        return this._configurationService.getRightsAccess(this.Id).pipe(map(res => {
            this.rights = res['message'][0].Rights;
        }));
    }

    private _getAllFinance() {
        return this._financeService.getAllFinance().pipe(map(res => {
            this.finances = res['message'];
        }));
    }

    ngOnDestroy() { }
}
