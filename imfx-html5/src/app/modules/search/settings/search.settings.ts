/**
 * Created by initr on 23.11.2016.
 */
import {ChangeDetectorRef, Component, Inject, Injector, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {SearchSettingsConfig} from "./search.settings.config";
import {SearchSettingsProvider} from "./providers/search.settings.provider";
import {SearchSettingsService} from "./services/search.settings.service";
import * as $ from "jquery";
import {ExportProvider} from "../../export/providers/export.provider";
import {SlickGridProvider} from "../slick-grid/providers/slick.grid.provider";
import {ViewsProvider} from "../views/providers/views.provider";
import {CurrentViewsStateType} from "../views/types";

@Component({
    selector: 'search-settings',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        SearchSettingsProvider,
        SearchSettingsService,
    ]
})
export class SearchSettingsComponent {
    @ViewChild('submenu') submenu;
    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
        this.provider.config = this.config;
    }
    public config = <SearchSettingsConfig>{
        componentContext: <any>null,
        options: {
            provider: SearchSettingsProvider,
            service: SearchSettingsService
        }
    };

    private hide = false;
    private currentViewIsSaved: boolean = true;
    private viewsProvider: ViewsProvider;
    constructor(@Inject(SearchSettingsService) protected service: SearchSettingsService,
                @Inject(SearchSettingsProvider) protected provider: SearchSettingsProvider,
                @Inject(ExportProvider) protected exportProvider: ExportProvider,
                protected slickGridProvider: SlickGridProvider,
                private injector: Injector,
                public cdr: ChangeDetectorRef) {
        this.viewsProvider = this.injector.get(ViewsProvider);
        this.viewsProvider.onChangeViewState.subscribe((currentViewsState:CurrentViewsStateType) => {
            this.currentViewIsSaved = currentViewsState.isSaved;
        })
    }

    ngAfterViewInit() {
        this.slickGridProvider.onToggleViewMode.subscribe((resp) => {
            if (resp == 'tile') {
                this.hide = true;
            } else {
                this.hide = false;
            }
        });
    }

    ngOnInit() {
    }

    ngOnChanges() {
    }

    public newView(): void {
        this.provider.newView();
    }

    public saveView(): void {
        if (this.currentViewIsSaved == false) {
            return;
        }
        this.provider.saveView();
    }

    public saveViewAs(): void {
        this.provider.saveViewAs();
    }

    public saveGlobalViewAs(): void {
        if (this.currentViewIsSaved == false) {
            return;
        }
        this.provider.saveGlobalViewAs()
    }

    public saveAsDefaultView(): void {
        if (this.currentViewIsSaved == false) {
            return;
        }
        this.provider.saveAsDefaultView()
    }

    public deleteView(): void {
        if (this.currentViewIsSaved == false) {
            return;
        }
        this.provider.deleteView();
    }

    public resetView(): void {
        this.provider.resetView();
    }

    public setupColumns(): void {
        this.provider.setupColumns();
    }

    public autoSizeColumns(): void {
        this.config.componentContext.slickGridComp.provider.autoSizeColumns();
    }

    public exportResults(): void {
        this.provider.exportResults();
    }
}
