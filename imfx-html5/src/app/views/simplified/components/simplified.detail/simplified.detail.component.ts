/**
 * Created by Sergey Klimeko on 08.02.2017.
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { BasketService } from '../../../../services/basket/basket.service';
import { DetailService } from '../../../../modules/search/detail/services/detail.service';
import {
    IMFXSubtitlesGrid
} from '../../../../modules/search/detail/components/subtitles.grid.component/subtitles.grid.component';
import { ItemTypes } from '../../../../modules/controls/html.player/item.types';
import { SessionStorageService, LocalStorageService } from 'ng2-webstorage';
import { IMFXHtmlPlayerComponent } from '../../../../modules/controls/html.player/imfx.html.player';
import { SimplifiedSettings } from '../../../../modules/settings/simplified/types';
import {
    SimplifiedDetailSettingsProvider
} from '../../../../modules/settings/simplified/detail/providers/simplified.settings.provider';
import {
    MediaDetailMediaVideoResponse
} from '../../../../models/media/detail/mediavideo/media.detail.mediavideo.response';
import {
    MediaDetailMediaCaptionsResponse
} from '../../../../models/media/detail/caption/media.detail.media.captions.response';

@Component({
    selector: 'simplified-item-detail',
    templateUrl: '/tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    entryComponents: [
        IMFXSubtitlesGrid
    ],
    providers: [
        DetailService,
        SimplifiedDetailSettingsProvider
    ],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.Default,
})

/**
 * Simplified item
 */
export class SimplifiedDetailComponent {
    @ViewChild('detailVideo') private detailVideo;
    @ViewChild('overlay') private overlayDetail;
    @ViewChild('subtitlesGrid') private subtitlesGrid;
    @ViewChild('Synopsis') private synopsisRef;
    @ViewChild('simpleDetail') private simpleDetail;
    @Input('setupsUpdated') private setupsUpdated;
    @Input() private item;
    @Input() public settings;
    @Input() private itemIndex;
    @Input() private settingsMode;
    @Input() private defaultSettings: SimplifiedSettings;
    @Input('onUpdateSettings') private onUpdateSettings: EventEmitter<any>;
    @Input('storagePrefix') private storagePrefix: string;
    @Output() private selected: EventEmitter<any> = new EventEmitter();
    @Output() private toggleCollapse: EventEmitter<any> = new EventEmitter();
    @Output() private seriesFilter: EventEmitter<any> = new EventEmitter();
    private isSmoothStreaming = false;
    private setImage = false;
    private setPlayer = false;
    private typeDetails: String;
    private sidebarCollapsed: boolean = false;
    private subtitles: Array<any>;
    private timecodeFormatString: string;
    private selectedPrefix: string = 'simplified.selected-item';
    public settingsStoragePrefix: string = this.storagePrefix + '.settings.detail';
    private error: boolean = false;
    private cinemaMode: any = {
      cinemaModePlayerWrapper: '.cinema-mode-player',
      neighboringContainerWrapper: '.simplified-blocks-wrapper.grid',
      simpleModePlayerWrapper: '#simple-players',
      videoContainerWrapper: '.video-container'
    };

    constructor(protected basketService: BasketService,
                protected storageService: SessionStorageService,
                protected cdr: ChangeDetectorRef,
                protected detailsService: DetailService,
                protected ssip: SimplifiedDetailSettingsProvider) {
        this.item = this.storageService.retrieve(this.selectedPrefix) || {};
    }

    toggleItemSelection(item) {
        this.selected.emit(item);
    }

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      if (this.sidebarCollapsed && this.detailVideo) {
        this.detailVideo.player.pause();
        this.overlayDetail.hide(this.simpleDetail.nativeElement);
      }
      this.toggleCollapse.emit(this.sidebarCollapsed);
    }

    setSeriesFilter(seriesId) {
        this.seriesFilter.emit(seriesId);
    }

    ngOnInit() {
        this.item.PrevID = this.item.ID; // 65228
        this.item.ID = this.item.VersionId; // 65228
        this.item.EOM_text = this.item.Duration; // '00:11:55:07'
        this.item.TITLE = this.item.Title; // 'TEST DATASET IX3'
        this.item.VERSIONID1 = this.item.VersionId1; // 'VIDEO'
        this.item.THUMBURL = this.item.ThumbUrl; // 'http://192.168.90.39/getfile.aspx?id=3040426'
        this.typeDetails = 'version-details';
        // this.overlayDetail.show(this.simpleDetail.nativeElement);
    }

    ngAfterViewInit() {
        this.ssip.settings = this.settings;
        this.ssip.synopsisRef = this.synopsisRef;
        if (this.setupsUpdated) {
            this.setupsUpdated.subscribe((setups) => {
                this.settings = setups.detailSettings;
                this.ssip.settings = setups.detailSettings;
                this.ssip.synopsisRef = this.synopsisRef;
            });
        }
        // this.initDetails()
    }

    ngOnChanges() {
        if (!this.sidebarCollapsed && this.simpleDetail) {
            this.overlayDetail.show(this.simpleDetail.nativeElement);
        }
        this.initDetails();
    }

    isError($event) {
        if ($event) {
            this.error = true;
        }
    }

    clickRepeat() {
        this.overlayDetail.show(this.simpleDetail.nativeElement);
        this.initDetails();
    }

    initDetails() {
        let self = this;
        // this.detailsService.getSimplifiedDetails(this.item.ID).subscribe((res)=>{
        this.detailsService.getVideoInfo(this.item.ID)
        .subscribe((res: MediaDetailMediaVideoResponse) => {
            self.timecodeFormatString = res.TimecodeFormat;
            self.item.MEDIA_TYPE = ItemTypes.MEDIA;
            self.setVideoBlock();
            self.initSubtitlesGrid();
            self.overlayDetail.hide(self.simpleDetail.nativeElement);
            self.error = false;
        }, (error) => {
            self.overlayDetail.hide(self.simpleDetail.nativeElement);
            self.error = true;
        });
    }

    initSubtitlesGrid() {
        let self = this;
        this.subtitles = null;
        this.detailsService.getSubtitles(this.item.ID)
        .subscribe((res: Array<MediaDetailMediaCaptionsResponse>) => {
            // this.detailsService.getSubtitles(66343).subscribe(res=>{
            self.subtitles = res;
            self.cdr.detectChanges();
            self.detailVideo && self.detailVideo.timecodeChange.subscribe((tcStr) => {
                self.subtitlesGrid && self.subtitlesGrid.selectRow(tcStr);
            });
        });
    }

    toggleBasket(): void {
        this.isOrdered() ? this.basketService.removeFromBasket([this.item])
        : this.basketService.addToBasket(this.item, 'Version');
    }

    isOrdered(): boolean {
        return this.basketService.hasItem(this.item);
    }

    setVideoBlock() {
        this.setPlayer = false;
        this.setImage = false;
        if (typeof(this.item.ProxyUrl) === 'string'
        && this.item.ProxyUrl.match(/(?:http)|(?:https)/g)) {
            this.setPlayer = true;
            this.setImage = false;
            this.isSmoothStreaming = this.item.ProxyUrl.match(/(?:ism)/g);
        } else {
            this.setPlayer = false;
            this.setImage = true;
        }
    };

    getStylesForWidget(customId, widgetType: 'staticWidgets' | 'dynamicWidgets' = 'staticWidgets') {
        return this.ssip.getStylesForWidget(customId, widgetType);
    }
}
