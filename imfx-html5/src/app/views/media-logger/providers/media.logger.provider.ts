import { EventEmitter, Inject, Injector, Output } from "@angular/core";
import {DetailProvider} from "../../../modules/search/detail/providers/detail.provider";
import {ConfigService} from "../../../services/config/config.service";
import {DetailConfig} from "../../../modules/search/detail/detail.config";
import {TaxonomyService} from "../../../modules/search/taxonomy/services/service";
import { ActivatedRoute, Router } from "@angular/router";
import {SessionStorageService} from "ng2-webstorage";
import {Location} from "@angular/common";
import { MediaDetailResponse } from '../../../models/media/detail/media.detail.response';
import { MediaDetailDetailsViewResponse } from '../../../models/media/detail/detailsview/media.detail.detailsview.response';
import { MediaDetailMediaTaggingResponse } from '../../../models/media/detail/mediatagging/media.detail.media.tagging.response';
import {TranslateService} from "ng2-translate";

export class MediaLoggerProvider extends DetailProvider {
    @Output() onGetMediaTaggingForSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSavedMediaTagging: EventEmitter<any> = new EventEmitter<any>();
    config: DetailConfig;

    constructor(@Inject(TaxonomyService) public taxonomyService: TaxonomyService,
                @Inject(ActivatedRoute) public route: ActivatedRoute,
                @Inject(Location) public location: Location,
                @Inject(SessionStorageService) public storage: SessionStorageService,
                @Inject(Router)public router: Router,
                @Inject(TranslateService)public translate: TranslateService,
                @Inject(Router)public injector: Injector) {
        super(route, location, storage, router, translate, injector);
    }

    commonDetailInit() {
        this.moduleContext.config.options.showGolden = false;
        // request for init cache
        this.taxonomyService.getTaxonomy().subscribe();
        this.moduleContext.config.options.allRequetsReady = 0;
        // get file info and media tagging (locators) from rest
        this.config.options.service.getMediaTaggingAsync({
            id: this.getDetailId(),
            subtypes: this.config.options.appSettings.getSubtypes(),
            typeDetails: this.config.options.typeDetails,
            detailsviewType: this.config.options.detailsviewType
        }).subscribe(
            (resp: [
                (MediaDetailResponse & MediaDetailDetailsViewResponse)[],
                MediaDetailMediaTaggingResponse
            ]) => {
                this.config.options.file = resp[0][0];

                this.setThumb(this.config.options.file);

                this.config.options.provider.setDetailColumtnsGroups(resp[0][1].ColumnData, this.config.options.file);
                this.config.options.provider.setVideoBlock();

                this.moduleContext.goldenConfig = $.extend(true, this.moduleContext.goldenConfig, {
                    componentContext: <any>null,
                    moduleContext: this,
                    appSettings: this.config.options.appSettings,
                    options: {
                        file: this.config.options.file,
                        groups: this.config.options._accordions,
                        friendlyNames: this.config.options.userFriendlyNames,
                        typeDetailsLocal: this.config.options.typeDetailsLocal,
                        typeDetails: this.config.options.typeDetails,
                        tabs: this.config.options.tabsData,
                        params: this.config.options.mediaParams,
                        layoutConfig: this.config.layoutConfig,
                        titleForStorage: 'mediaLogger',
                        series: resp[1]
                    },
                });
                this.moduleContext.config.options.showGolden = true;
                this.moduleContext.cd.markForCheck();
                this.moduleContext.cd.detectChanges();
                console.log('Done');
            }
        );
        this.getColumnsFriendlyNames();
    }

    setThumb(file) {
        if (file.THUMBID === -1) {
            file.THUMBURL = this.config.options.defaultThumb;
        } else {
            file.THUMBURL = ConfigService.getAppApiUrl() + '/getfile.aspx?id=' + file.THUMBID;
        }
    };

    /**
     * get columns friendly names from rest or storage
     */
    getColumnsFriendlyNames(): any {
        this.config.options.service.getLookups(this.config.options.friendlyNamesForDetail).subscribe(
            (resp) => {
                this.config.options.userFriendlyNames = resp;
                this.setColumnsFriendlyNames(resp);
            }
        );
    };

    setColumnsFriendlyNames(names): any {
        this.moduleContext.goldenConfig.options.friendlyNames = names;
        this.moduleContext.cd.detectChanges();
    };

    /**
     * Calling on Save button clicking.
     */
    getMediaTaggingForSave(): any {
       // this.locatorsProvider.onGetMediaTaggingForSave.emit();
    }

    /**
     * Sent request for saving media tagging
     */
    saveMediaTagging(res): any {
        let id = this.config.options.file.ID;
        this.config.options.service.saveMediaTagging(res, id).subscribe(resp => {
                let message = this.config.moduleContext.translate.instant('media_logger.success_save');
                this.config.moduleContext.notificationRef.notifyShow(1, message);
               // this.locatorsProvider.onSavedMediaTagging.emit(resp);
            },
            (error) => {
                let message = this.config.moduleContext.translate.instant('media_logger.error_save');
                this.config.moduleContext.notificationRef.notifyShow(2, message);
                console.error(error);
            });

    }
}
