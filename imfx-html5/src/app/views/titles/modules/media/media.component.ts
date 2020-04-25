import {Component, EventEmitter, Injector, Input, ViewChild, ViewEncapsulation} from '@angular/core';
// Views
import {ViewsConfig} from '../../../../modules/search/views/views.config';
import {TitlesMediaViewsProvider} from './providers/views.provider';
// Grid
// Form
import {SearchFormProvider} from '../../../../modules/search/form/providers/search.form.provider';
// Search Settings
import {SearchSettingsConfig} from '../../../../modules/search/settings/search.settings.config';
// Search Modal
import {SearchColumnsProvider} from '../../../../modules/search/columns/providers/search.columns.provider';
// Modal
// Search Columns
import {SearchColumnsService} from '../../../../modules/search/columns/services/search.columns.service';
// Info Modal
import {InfoModalProvider} from '../../../../modules/search/info.modal/providers/info.modal.provider';
// constants
import {MediaAppSettings} from './constants/constants';
import {SlickGridComponent} from '../../../../modules/search/slick-grid/slick-grid';
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions
} from '../../../../modules/search/slick-grid/slick-grid.config';
import {SlickGridProvider} from '../../../../modules/search/slick-grid/providers/slick.grid.provider';
import {SlickGridService} from '../../../../modules/search/slick-grid/services/slick.grid.service';
import {TitlesMediaSlickGridProvider} from './providers/titles.media.slickgrid.provider';
import {CoreSearchComponent} from '../../../../core/core.search.comp';
import {ViewsProvider} from "../../../../modules/search/views/providers/views.provider";
import {MediaSearchSettingsProvider} from "./providers/search.settings.provider";
import {ViewsService} from "../../../../modules/search/views/services/views.service";
import {SearchViewsComponent} from "../../../../modules/search/views/views";

@Component({
    selector: 'media-inside-titles',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        SlickGridService,
        {provide: SlickGridProvider, useClass: TitlesMediaSlickGridProvider},
        TitlesMediaViewsProvider,
        {provide: ViewsProvider, useClass: TitlesMediaViewsProvider},
        MediaAppSettings,
        SearchFormProvider,
        SearchColumnsProvider,
        SearchColumnsProvider,
        SearchColumnsService,
        MediaSearchSettingsProvider,
        ViewsService
    ]
})

export class MediaInsideTitlesComponent extends CoreSearchComponent {
    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    @Input('moduleTitleContext') protected moduleTitleContext: any;
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        // providerType: TitlesSlickGridProvider,
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                clientSorting: true,
                searchType: 'Media',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                isThumbnails: true,
                pager: {
                    enabled: false,
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
            type: 'MediaGrid',
        }
    };

    /**
     * Settings
     * @type {SearchSettingsConfig}
     */
    protected searchSettingsConfig = <SearchSettingsConfig>{
        componentContext: this,
    };

    constructor(public viewsProvider: TitlesMediaViewsProvider,
                protected searchColumnsModalProvider: SearchColumnsProvider,
                protected searchColumnsModalService: SearchColumnsService,
                public infoModalProvider: InfoModalProvider,
                protected searchSettingsProvider: MediaSearchSettingsProvider,
                protected injector: Injector) {
        super(injector);
    }
}
