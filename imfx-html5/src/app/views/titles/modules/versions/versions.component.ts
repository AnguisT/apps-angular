import {Component, EventEmitter, Injector, Input, ViewChild, ViewEncapsulation} from '@angular/core';
// Views
import {ViewsConfig} from '../../../../modules/search/views/views.config';
import {VersionsViewsProvider} from './providers/views.provider';
// Grid
import {VersionsGridProvider} from './providers/grid.provider';
// Search Settings
import {SearchSettingsConfig} from '../../../../modules/search/settings/search.settings.config';
// Search Modal
import {SearchColumnsProvider} from '../../../../modules/search/columns/providers/search.columns.provider';
// Modal
// Search Columns
import {SearchColumnsService} from '../../../../modules/search/columns/services/search.columns.service';
// Info Modal
import {SearchSettingsProvider} from '../../../../modules/search/settings/providers/search.settings.provider';
import {TitlesVersionsSlickGridProvider} from './providers/titles.versions.slickgrid.provider';
import {SlickGridProvider} from '../../../../modules/search/slick-grid/providers/slick.grid.provider';
import {SlickGridService} from '../../../../modules/search/slick-grid/services/slick.grid.service';
import {CoreSearchComponent} from '../../../../core/core.search.comp';
import {SlickGridComponent} from '../../../../modules/search/slick-grid/slick-grid';
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions
} from '../../../../modules/search/slick-grid/slick-grid.config';
import {ViewsProvider} from "../../../../modules/search/views/providers/views.provider";
import {SearchViewsComponent} from "../../../../modules/search/views/views";


@Component({
    selector: 'versions-inside-titles',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        SearchColumnsProvider,
        SearchColumnsService,
        SearchSettingsProvider,
        {provide: SlickGridProvider, useClass: TitlesVersionsSlickGridProvider},
        ViewsProvider,
        {provide: ViewsProvider, useClass: VersionsViewsProvider},
        SlickGridService
    ]
})

export class VersionsInsideTitlesComponent extends CoreSearchComponent {
    @Input('moduleTitleContext') public moduleTitleContext: any;
    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    /**
     * SlickGrid
     * @type {SlickGridConfig}
     */
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                viewMode: 'table',
                clientSorting: true,
                savedSearchType: 'Version',
                searchType: 'versions',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                isThumbnails: false,
                pager: {
                    enabled: false,
                },
                isTree: {
                    enabled: true,
                },
                bottomPanel: {
                    enabled: false
                }
            },
        })
    });

    /**
     * Views
     * @type {ViewsConfig}
     */
    @ViewChild('viewsComp') public viewsComp: SearchViewsComponent;
    protected searchViewsConfig = <ViewsConfig>{
        componentContext: this,
        options: {
            type: 'VersionGrid',
        }
    };

    /**
     * Settings
     * @type {SearchSettingsConfig}
     */
    protected searchSettingsConfig = <SearchSettingsConfig>{
        componentContext: this,
    };

    constructor(protected injector: Injector) {
        super(injector);
    }
}
