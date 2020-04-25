import * as $ from "jquery";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    Input,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import {ViewsConfig} from "./views.config";
import {ViewsService} from "./services/views.service";
import {ViewsProvider} from "./providers/views.provider";
import {TranslateService} from "ng2-translate";


import {NotificationService} from "../../../modules/notification/services/notification.service";
import {SearchSettingsProvider} from "../settings/providers/search.settings.provider";
import {SlickGridProvider} from "../slick-grid/providers/slick.grid.provider";
import {IMFXModalProvider} from "../../imfx-modal/proivders/provider";
import {IMFXControlsSelect2Component} from "../../controls/select2/imfx.select2";
import * as _ from "lodash";
import {ViewsOriginalType, ViewType} from "./types";

// class Select
@Component({
    selector: 'search-views',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        IMFXModalProvider
    ]
})

export class SearchViewsComponent {
    @ViewChild('selectViewControl') dropdown: IMFXControlsSelect2Component;
    public provider: ViewsProvider;
    private hide: boolean;
    private config = <ViewsConfig>{
        componentContext: <any>null,
        moduleContext: this,
        options: {
            type: '',
        },
    };

    constructor(private cdr: ChangeDetectorRef,
                public service: ViewsService,
                private translate: TranslateService,
                public injector: Injector,
                @Inject(NotificationService) protected notificationRef: NotificationService) {
        this.provider = this.injector.get(ViewsProvider);
    }

    /**
     * Extend default config
     * @param config
     */
    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
        this.provider.config = this.config;
    }

    ngAfterViewInit() {
        this.provider.ui = this.dropdown;
        // ???
        let searchGridProvider: SlickGridProvider = this.injector.get(SlickGridProvider);
        if (searchGridProvider) {
            searchGridProvider.onToggleViewMode.subscribe((resp) => {
                if (resp == 'tile') {
                    this.hide = true;
                } else {
                    this.hide = false;
                }
            });
        }

        if (!this.provider.originalViews) {
            this.provider.load().subscribe((originalView: ViewsOriginalType|null) => {
                if(originalView === null){
                    return;
                }
                this.provider.build(originalView.DefaultView, originalView.ViewColumns);
                this.provider.setViewForUI(originalView.DefaultView);
            });
        } else {
            this.provider.build(this.provider.originalViews.DefaultView);
            this.provider.setViewForUI(this.provider.originalViews.DefaultView);
        }
    }

    /**
     * Callback on select view model
     */
    onSelect() {
        let id:number = this.dropdown.getSelected();
        this.provider.onSelect(id);
    };
}
