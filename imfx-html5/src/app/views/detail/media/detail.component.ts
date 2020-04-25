import {Component, ChangeDetectionStrategy, ViewEncapsulation, EventEmitter, ViewChild, Injector} from '@angular/core';
import {MediaDetailAppSettings} from './constants/constants';
import {LookupService} from '../../../services/lookup/lookup.service';

import {DetailConfig} from '../../../modules/search/detail/detail.config';
import {DetailProvider} from '../../../modules/search/detail/providers/detail.provider';

// Thumbs
import {
    SearchThumbsConfig, SearchThumbsConfigModuleSetups,
    SearchThumbsConfigOptions
} from '../../../modules/search/thumbs/search.thumbs.config';
import {SearchThumbsProvider} from '../../../modules/search/thumbs/providers/search.thumbs.provider';
import {SearchThumbsComponent} from "../../../modules/search/thumbs/search.thumbs";
import {CoreSearchComponent} from "../../demo/comps/slick-grid/base/core.search.comp";
import {DetailThumbProvider} from "../../../modules/search/detail/providers/detail.thumb.provider";
import {GridProvider} from "../../../modules/search/grid/providers/grid.provider";

@Component({
    moduleId: 'detail',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    providers: [MediaDetailAppSettings, LookupService, DetailProvider, SearchThumbsProvider, DetailThumbProvider],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class MediaDetailComponent {
    /**
     * Detail
     * @type {DetailConfig}
     */
    private detailConfig = <DetailConfig>{
        componentContext: this,
        options: {
            provider: <DetailProvider>null,
            needApi: true,
            typeDetails: "media-details",
            showInDetailPage: true,
            detailsviewType: "MediaDetails",
            friendlyNamesForDetail: "FriendlyNames.TM_MIS",
            data: {
                detailInfo: <any>null
            },
            onDataUpdated: new EventEmitter<any>(),
            detailsViews: []
        },
    };

    constructor(protected appSettings: MediaDetailAppSettings,
                protected detailProvider: DetailProvider,
                protected searchThumbsProvider: SearchThumbsProvider,
                protected injector: Injector,
                public detailThumbProvider: DetailThumbProvider,
    ) {
        // super(injector);
        // detail provider
        detailProvider.inducingComponent = 'media';
        this.detailConfig.options.provider = detailProvider;

        this.detailConfig.options.appSettings = this.appSettings;


        // thumbnails provider
        // this.searchThumbsConfig.options.provider = this.searchThumbsProvider;
        // this.searchThumbsConfig.options.appSettings = this.appSettings;
    }
}
