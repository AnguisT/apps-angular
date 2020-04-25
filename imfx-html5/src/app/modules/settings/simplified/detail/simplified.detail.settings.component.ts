/**
 * Created by Sergey Trizna on 26.06.2017.
 */
import {
    Component, Output, EventEmitter, ViewChild, ViewEncapsulation, ChangeDetectorRef, Input,
} from '@angular/core';
import {SessionStorageService} from "ng2-webstorage";
import {GridStackOptions, SimplifiedSettings, ViewColumnFakeType, ViewColumnType} from "../types";
import {BasketService} from "../../../../services/basket/basket.service";
import {ModalProvider} from "../../../modal/providers/modal.provider";
import {SimplifiedDetailSettingsProvider} from "./providers/simplified.settings.provider";
import {SimplifiedDetailComponent} from "../../../../views/simplified/components/simplified.detail/simplified.detail.component";
import {DetailService} from "../../../search/detail/services/detail.service";
import {SettingsGroupsService} from "../../../../services/system.config/settings.groups.service";
import {SimplifiedSettingsTransferProvider} from "../simplified.settings.transfer.provider";
import { IMFXModalProvider } from '../../../imfx-modal/proivders/provider';


@Component({
    selector: 'simplified-detail-settings',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './../../../../views/simplified/components/simplified.item/styles/index.scss',
        './styles/index.scss',
    ],
    providers: [
        SimplifiedDetailSettingsProvider,
        DetailService,
        SettingsGroupsService
    ],
    encapsulation: ViewEncapsulation.None,
})

export class SimplifiedDetailSettingsComponent extends SimplifiedDetailComponent {
    public settingsGroupId;
    @ViewChild('wrapperDetailConfig') private wrapper;
    @ViewChild('gridStackDetail') private gridStack;
    @ViewChild('overlayForDetail') private overlay;
    @ViewChild('settingsSimplifiedFieldsDetailModal') private fieldsModal;
    @Output('onSave') public onSave: EventEmitter<any> = new EventEmitter();
    public type = 'detail';
    protected builderMode: boolean = false;
    protected gridStackOptions: GridStackOptions;
    private tmpSettings: SimplifiedSettings;
    private fields: Array<ViewColumnType | ViewColumnFakeType> = [];
    constructor(protected storageService: SessionStorageService,
                protected cdr: ChangeDetectorRef,
                protected basketService: BasketService,
                protected modalProvider: IMFXModalProvider,
                protected ssip: SimplifiedDetailSettingsProvider,
                protected detailService: DetailService,
                protected sgs: SettingsGroupsService,
                protected simpleTransferProvider:SimplifiedSettingsTransferProvider) {
        super(basketService, storageService, cdr, detailService, ssip);
        this.gridStackOptions = this.ssip.getGridStackOptions();
        this.settings = $.extend(true, this.ssip.getDefaultSettings('detail'), this.settings);
        this.tmpSettings = $.extend(true, {}, this.settings);
        ssip.tmpSettings = this.tmpSettings;
        ssip.settings = this.tmpSettings;
        ssip.isSetupPage = true;
        ssip.moduleContext = this;
        ssip.modalProvider = this.modalProvider;
        ssip.storageService = this.storageService;
        ssip.settingsStoragePrefix = this.settingsStoragePrefix;
        ssip.cdr = this.cdr;
        ssip.service = this.sgs;
        ssip.transfer = this.simpleTransferProvider;
    }

    preheatSettings(settingsGroupId, setups){
        this.settingsGroupId = settingsGroupId;
        this.settings = $.extend(true, this.ssip.getDefaultSettings('detail'), setups);
        this.ssip.settings = this.settings;
        this.ssip.getFields().subscribe((fields: any) => {
            this.fields = fields;
        });
    }

    // override
    initDetails() {}

    openListOfFiledsModal() {
        this.ssip.openListOfFiledsModal();
    }

    open() {
        this.ssip.open();
    }

    save() {
        if(!this.settingsGroupId){
            console.error('settingsGroupId not found')
            return;
        }

        this.ssip.save(this.settingsGroupId);
    }

    reset() {
        this.ssip.reset('detail')
    }

    addLabel() {
        this.ssip.addLabel();
    }

    getSettings(): SimplifiedSettings {
        return this.ssip.getSettings();
    }
}
