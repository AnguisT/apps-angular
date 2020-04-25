/**
 * Created by Sergey Trizna on 10.01.2016.
 */
import {
    ChangeDetectionStrategy,
    Component,
    Injector,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectorRef
} from '@angular/core';
import {
    LookupSearchUsersService
} from '../../../../../../../../../../../../services/lookupsearch/users.service';
import { ModalConfig } from '../../../../../../../../../../../modal/modal.config';
import { UsersComponent } from '../../../../../../../../../../../search/users/users';
import {
    AdvancedSearchDataForControlType,
    AdvancedSearchDataFromControlType
} from '../../../../../../../../../types';
import { AdvancedCriteriaControlLookupUsersModalDataType } from './types';
import { SearchAdvancedCriteriaProvider } from '../../../../../../../providers/provider';
import { UserLookupType } from '../../../../../../../../../../../../services/lookupsearch/types';
import { IMFXModalComponent } from '../../../../../../../../../../../imfx-modal/imfx-modal';
import { IMFXModalEvent } from '../../../../../../../../../../../imfx-modal/types';
import { IMFXModalProvider } from '../../../../../../../../../../../imfx-modal/proivders/provider';
import { BsModalService } from 'ngx-bootstrap';

@Component({
    selector: 'advanced-criteria-control-lookupsearch-users-modal',
    templateUrl: 'tpl/index.html',
    providers: [
        LookupSearchUsersService
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IMFXAdvancedCriteriaControlLookupSearchUsersModalComponent {
    public data: AdvancedSearchDataForControlType;
    private modal: IMFXModalComponent;
    private modalData: AdvancedCriteriaControlLookupUsersModalDataType;
    private username: string;
    private modalService;

    constructor(private injector: Injector,
                private transfer: SearchAdvancedCriteriaProvider,
                private modalProvider: IMFXModalProvider,
                private cdr: ChangeDetectorRef) {
        this.data = this.injector.get('data');
        this.modalService = this.injector.get(BsModalService);
        this.modalData = <AdvancedCriteriaControlLookupUsersModalDataType>{
            users: [],
            filteredUser: [],
            paramsOfSearch: ''
        };
    }

    onSelect(data) {
        this.modalData = <AdvancedCriteriaControlLookupUsersModalDataType>{
            users: data.users,
            paramsOfSearch: data.paramsOfSearch,
            user: data.user
        };

        this.transferData(this.modalData.user);
    }

    afterViewInit() {
        let self = this;
        let value: AdvancedSearchDataFromControlType = this.data.criteria.data.value;
        let content = this.modal.contentView.instance;
        let valueCriteria = this.transfer.data;
        if (value) {
            let dv = value.dirtyValue;
            if (!dv) {
                content.onReady.subscribe(() => {
                    let user: UserLookupType = content.findUserByUserId(value.value);
                    self.transferData(user);
                });
            } else {
                self.transferData((<UserLookupType>dv));
            }
        }

        content.onSelectEvent.subscribe((selected) => {
            self.onSelect(selected);
        });
    }

    /**
     * Send data to parent comp
     */
    transferData(user: UserLookupType) {
        this.modal.hide();
        this.username = user.Forename + ' ' + user.Surname;
        this.transfer.onSelectValue(<AdvancedSearchDataFromControlType>{
            value: user.UserId,
            dirtyValue: user,
            humanValue: this.username
        });
        this.cdr.markForCheck();
    }

    showModal() {
        let self = this;

        this.modal = this.modalProvider.show(UsersComponent, {
            size: 'xl',
            title: 'ng2_components.ag_grid.select_user',
            position: 'center',
            footer: 'ok',
        });

        this.modal.modalEvents.subscribe((e: IMFXModalEvent) => {
            if (e.name === 'ok') {
                self.modal.hide();
            }
        });

        this.afterViewInit();

        // this.modalService.onShown.subcsribe(() => {

        // });
    }
}
