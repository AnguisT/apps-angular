/**
 * Created by Sergey Klimeko on 08.02.2017.
 */
import {
    Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy, ViewChild
} from '@angular/core';
import {BasketService} from '../../../../services/basket/basket.service';
import {DetailService} from "../../../../modules/search/detail/services/detail.service";
import {IMFXSubtitlesGrid} from "../../../../modules/search/detail/components/subtitles.grid.component/subtitles.grid.component";
import {SessionStorageService} from "ng2-webstorage";
import {SimplifiedSettings} from "../../../../modules/settings/simplified/types";
import {SimplifiedItemSettingsProvider} from "../../../../modules/settings/simplified/item/providers/simplified.settings.provider";
@Component({
    selector: 'simplified-item-component',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../../../modules/settings/simplified/item/styles/index.scss'
    ],
    entryComponents: [
        IMFXSubtitlesGrid
    ],
    providers: [
        DetailService,
        SimplifiedItemSettingsProvider
    ],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Simplified item
 */
export class SimplifiedItemComponent {
    @Input() item;
    @Input() settings;
    @Input() itemIndex;
    @Input() settingsMode;
    @Input() defaultSettings: SimplifiedSettings;
    @Input('setupsUpdated') private setupsUpdated;
    @Input('onUpdateSettings') onUpdateSettings: EventEmitter<any>;
    @Input('storagePrefix') storagePrefix: string;
    @Output() selected: EventEmitter<any> = new EventEmitter();
    @Output() seriesFilter: EventEmitter<any> = new EventEmitter();
    @ViewChild('simplItem') private simplItem;
    protected typeDetails: String;
    protected settingsStoragePrefix: string = this.storagePrefix + '.settings.item';

    constructor(protected basketService: BasketService,
                protected storageService: SessionStorageService,
                protected cdr: ChangeDetectorRef,
                protected ssip: SimplifiedItemSettingsProvider) {
    }

    toggleItemSelection(item) {
        this.selected.emit(item);
    }

    setSeriesFilter(seriesId) {
        this.seriesFilter.emit(seriesId);
    }

    ngOnInit() {
        this.item.PrevID = this.item.ID;
        this.item.ID = this.item.VersionId; //65228
        this.item.EOM_text = this.item.Duration; //"00:11:55:07"
        this.item.TITLE = this.item.Title; //"TEST DATASET IX3"
        this.item.VERSIONID1 = this.item.VersionId1; //"VIDEO"
        this.item.THUMBURL = this.item.ThumbUrl; //"http://192.168.90.39/getfile.aspx?id=3040426"
        this.typeDetails = "version-details";
    }

    ngAfterViewInit() {
        this.ssip.settings = this.settings;
        if (this.setupsUpdated) {
            this.setupsUpdated.subscribe((setups) => {
                this.settings = setups.itemSettings;
                this.ssip.settings = setups.itemSettings;
            });
        }
    }

    getStylesForWidget(customId, widgetType: 'staticWidgets' | 'dynamicWidgets' = 'staticWidgets') {
        return this.ssip.getStylesForWidget(customId, widgetType)
    }

    getHeightForWidget(customId, widgetType: 'staticWidgets' | 'dynamicWidgets' = 'staticWidgets') {
        return this.ssip.getHeightForWidget(customId, widgetType)
    }

    getWidthForWidget(customId, widgetType: 'staticWidgets' | 'dynamicWidgets' = 'staticWidgets') {
        return this.ssip.getWidthForWidget(customId, widgetType)
    }

    toggleBasket(): void {
        this.isOrdered() ? this.basketService.removeFromBasket([this.item]) : this.basketService.addToBasket(this.item, "Version");
    }

    isOrdered(): boolean {
        return this.basketService.hasItem(this.item);
    }
}
