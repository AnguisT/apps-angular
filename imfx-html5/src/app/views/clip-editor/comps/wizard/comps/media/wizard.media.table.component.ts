import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { GridService } from '../../../../../../modules/search/grid/services/grid.service';
import { ViewsConfig } from '../../../../../../modules/search/views/views.config';
import {
    SearchThumbsConfig,
    SearchThumbsConfigModuleSetups,
    SearchThumbsConfigOptions
} from '../../../../../../modules/search/thumbs/search.thumbs.config';
import {
    SearchThumbsProvider
} from '../../../../../../modules/search/thumbs/providers/search.thumbs.provider';
import { MediaAppSettings } from '../../../../../media/constants/constants';
import {
    SearchSettingsProvider
} from '../../../../../../modules/search/settings/providers/search.settings.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { SilverlightProvider } from '../../../../../../providers/common/silverlight.provider';
import { VersionWizardMediaViewsProvider } from './providers/wizard.views.media.provider';
import { SearchFormConfig } from '../../../../../../modules/search/form/search.form.config';
import {
    AppSettingsInterface
} from '../../../../../../modules/common/app.settings/app.settings.interface';
import {
    SearchFormProvider
} from '../../../../../../modules/search/form/providers/search.form.provider';
import { SearchThumbsComponent } from '../../../../../../modules/search/thumbs/search.thumbs';
import { CoreSearchComponent } from '../../../../../../core/core.search.comp';
import { SearchViewsComponent } from '../../../../../../modules/search/views/views';
import {
    SlickGridProvider
} from '../../../../../../modules/search/slick-grid/providers/slick.grid.provider';
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions
} from '../../../../../../modules/search/slick-grid/slick-grid.config';
import {
    SlickGridService
} from '../../../../../../modules/search/slick-grid/services/slick.grid.service';
import { SlickGridComponent } from '../../../../../../modules/search/slick-grid/slick-grid';
import { ClipEditorMediaSlickGridProvider } from './providers/clipedtor.slick.grid.provider';
import { ViewsProvider } from '../../../../../../modules/search/views/providers/views.provider';

@Component({
    selector: 'wizard-media-table',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ViewsProvider,
        {provide: ViewsProvider, useClass: VersionWizardMediaViewsProvider},
        GridService,
        MediaAppSettings,
        SearchThumbsProvider,
        SilverlightProvider,
        SearchSettingsProvider,
        SlickGridProvider,
        {provide: SlickGridProvider, useClass: ClipEditorMediaSlickGridProvider},
        SearchFormProvider,
        SlickGridService
    ]
})

export class WizardMediaTableComponent extends CoreSearchComponent {
    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        // providerType: TitlesSlickGridProvider,
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                overlay: {
                    zIndex: 99999
                },
                showMediaLogger: true,
                viewMode: 'table',
                tileSource: ['TITLE', 'MEDIA_TYPE_text', 'MEDIA_FORMAT_text', 'DURATION_text'],
                // searchType: 'title',
                searchType: 'Media',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                externalWrapperEl: '.media-wizzard-grid #externalWrapperClipEditorMedia',
                isThumbnails: true,
                isTree: {
                    enabled: false,
                },
                popupsSelectors: {
                    'settings': {
                        'popupEl': '.mediaSettingsPopup'
                    }
                },
                tileParams: { // from media css
                    tileWidth: 267 + 24,
                    tileHeight: 276 + 24
                },
            }
        })
    });

    /**
     * Views
     * @type {ViewsConfig}
     */
    @ViewChild('viewsComp') public viewsComp: SearchViewsComponent;
    /**
     * Thumbs
     * @type {SearchThumbsConfig}
     */
        // private searchThumbsConfig = <SearchThumbsConfig>{
        //     componentContext: this,
        //     enabled: false,
        //     options: {
        //         provider: <SearchThumbsProvider>null,
        //         appSettings: <MediaAppSettings>null
        //     }
        // };

    @ViewChild('searchThumbsComp') searchThumbsComp: SearchThumbsComponent;
    searchThumbsConfig = new SearchThumbsConfig(<SearchThumbsConfig>{
        componentContext: this,
        providerType: SearchThumbsProvider,
        appSettingsType: MediaAppSettings,
        options: new SearchThumbsConfigOptions(<SearchThumbsConfigOptions>{
            module: <SearchThumbsConfigModuleSetups>{
                enabled: false,
            }
        })
    });
    /**
     * Form
     * @type {SearchFormConfig}
     */
    public searchFormConfig = <SearchFormConfig>{
        componentContext: this,
        options: {
            currentMode: 'Titles',
            arraysOfResults: ['titles', 'series', 'contributors'],
            appSettings: <AppSettingsInterface>null,
            provider: <SearchFormProvider>null
        }
    };
    protected searchViewsConfig = <ViewsConfig>{
        componentContext: this,
        options: {
            type: 'MediaGrid',
        }
    };

    constructor(protected appSettings: MediaAppSettings,
                protected router: Router,
                protected route: ActivatedRoute,
                protected silver: SilverlightProvider,
                protected cdr: ChangeDetectorRef,
                protected searchSettingsProvider: SearchSettingsProvider,
                protected injector: Injector) {
        super(injector);
    }

    ngAfterViewInit() {
        let self = this;
        this.slickGridComp.onGridReady.subscribe(() => {
            self.cdr.detectChanges();
        });
    }

}
