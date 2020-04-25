import {ChangeDetectionStrategy, Component, Injector, ViewEncapsulation} from "@angular/core";
import {SlickGridColumn, SlickGridFormatterData, SlickGridRowData, SlickGridTreeRowData} from "../../types";
import {commonFormatter} from "../common.formatter";
import {SlickGridProvider} from "../../providers/slick.grid.provider";
import { IMFXModalComponent } from '../../../../imfx-modal/imfx-modal';
import { IMFXModalAlertComponent } from '../../../../imfx-modal/comps/alert/alert';
import { IMFXModalEvent } from '../../../../imfx-modal/types';
import { SettingsGroupsService } from '../../../../../services/system.config/settings.groups.service';
import { IMFXModalProvider } from '../../../../imfx-modal/proivders/provider';
import { NotificationService } from '../../../../notification/services/notification.service';

@Component({
    selector: 'delete-settings-groups-formatter-comp',
    templateUrl: './tpl/index.html',
    styleUrls: [
      'styles/index.scss'
    ],
    providers: [
        SettingsGroupsService,
        IMFXModalProvider
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DeleteSettingsGroupsFormatterComp {
    private params;
    public injectedData: SlickGridFormatterData;
    private provider: SlickGridProvider;
    private column: SlickGridColumn;

    constructor(private injector: Injector,
                private settingsGroupsService: SettingsGroupsService,
                protected modalProvider: IMFXModalProvider,
                private notificationRef: NotificationService) {
        this.injectedData = this.injector.get('data');
        this.params = this.injectedData.data;
        this.column = (<any>this.injectedData).data.columnDef;
        this.provider = this.column.__contexts.provider;
    }

    // delete row
    deleteRow() {
        let self = this;
        let modal: IMFXModalComponent = this.modalProvider.show(IMFXModalAlertComponent, {
            size: 'md',
            title: 'modal.titles.confirm',
            position: 'center',
            footer: 'close|ok'
        });
        let modalContent: IMFXModalAlertComponent = modal.contentView.instance;
        modalContent.setText(
            'settings_group.modal_remove_conformation',
            {groupName: self.params.data.NAME}
        );
        modal.modalEvents.subscribe((e: IMFXModalEvent) => {
            if (e.name === 'ok') {
                self.settingsGroupsService.delete(self.params.data.ID).subscribe(() => {
                    self.notificationRef.notifyShow(1, 'settings_group.remove_success');
                    self.provider.deleteRow({data: this.params});
                    modal.hide();
                });
            } else if (e.name === 'hide') {
                modal.hide();
            }
        });
    }
}

export function DeleteSettingsGroupsFormatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridTreeRowData | SlickGridRowData) {
    let ctxs = columnDef.__contexts;

    return commonFormatter(DeleteSettingsGroupsFormatterComp, {
        rowNumber: rowNumber,
        cellNumber: cellNumber,
        value: value,
        columnDef: columnDef,
        data: dataContext
    });
}



