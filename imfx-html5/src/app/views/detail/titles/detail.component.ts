import {Component, ChangeDetectionStrategy, ViewEncapsulation, EventEmitter} from '@angular/core';
import {DetailData} from '../../../services/viewsearch/detail.service';
import {TitlesDetailAppSettings} from './constants/constants';
import {LookupService} from '../../../services/lookup/lookup.service';

import {DetailConfig} from '../../../modules/search/detail/detail.config';
import {DetailProvider} from '../../../modules/search/detail/providers/detail.provider';
import {DetailThumbProvider} from "../../../modules/search/detail/providers/detail.thumb.provider";

@Component({
    moduleId: 'detail',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    providers: [DetailData, TitlesDetailAppSettings, LookupService, DetailProvider, DetailThumbProvider],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TitlesDetailComponent{
    /**
     * Detail
     * @type {DetailConfig}
     */
    private detailConfig = <DetailConfig>{
        componentContext: this,
        options: {
            provider: <DetailProvider>null,
            needApi: true,
            typeDetails: "title-details",
            showInDetailPage: true,
            detailsviewType: "TitleTree",
            friendlyNamesForDetail: "FriendlyNames.TM_PG_ABS",
            data: {
                detailInfo: <any>null
            },
            typeDetailsLocal: '',
            file: {},
            onDataUpdated: new EventEmitter<any>(),
            detailsViews: [],
            tabsData: [
                {
                    Type: "mNotes",
                    hide: false,
                    title: "mNotes"
                }
            ]
        },
        layoutConfig: {
            labels: {
                close: 'Close',
                maximise: 'Maximise',
                minimise: 'Minimise',
                popout: 'Open In New Window',
                popin: 'Pop In',
                tabDropdown: 'Additional Tabs'
            },
            content: [{
                type: 'row',
                content: [
                    {
                        type: 'component',
                        componentName: 'Data',
                        width: 25
                    },
                    {
                        type: 'column',
                        content: [
                            {
                                type: 'component',
                                componentName: 'Versions'
                            },
                           /* {
                                type: 'stack',
                                content: [
                                    /*{
                                        type: 'component',
                                        componentName: 'Tab',
                                        tTitle: "mNotes",
                                        title: "Notes"
                                    }
                                ]

                            }*/
                        ]
                    }
                ]
            }]
        }
    };

    constructor(protected appSettings: TitlesDetailAppSettings,
                protected detailProvider: DetailProvider,
                public detailThumbProvider: DetailThumbProvider,
    ) {
        // detail provider
        detailProvider.inducingComponent = 'title';
        this.detailConfig.options.provider = detailProvider;
        this.detailConfig.options.appSettings = this.appSettings;

    }
}
