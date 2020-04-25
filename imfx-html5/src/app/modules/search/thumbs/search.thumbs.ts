import * as $ from 'jquery';
import {
    Component, Input, ViewEncapsulation, Inject, ChangeDetectionStrategy, Injector,
    ChangeDetectorRef
} from '@angular/core';
import {
    SearchThumbsConfig, SearchThumbsConfigModuleSetups,
    SearchThumbsConfigOptions
} from './search.thumbs.config';
import {SearchThumbsProvider} from './providers/search.thumbs.provider';
import {SearchThumbsService} from './services/search.thumbs.service';
import {CoreComp} from "../../../core/core.comp";
import {CoreSearchComponent} from "../../../core/core.search.comp";

@Component({
    selector: 'search-thumbs',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SearchThumbsProvider,
        SearchThumbsService
    ]
})

export class SearchThumbsComponent  extends CoreComp {
    protected readonly setups: SearchThumbsConfig = new SearchThumbsConfig(<SearchThumbsConfig>{
        providerType: SearchThumbsProvider,
        options: new SearchThumbsConfigOptions(<SearchThumbsConfigOptions>{
            module: <SearchThumbsConfigModuleSetups>{
                defaultThumb: './assets/img/default-thumb.png',
                enabled: false
            },
        })
    });

    constructor(protected injector: Injector,
                private cdr: ChangeDetectorRef) {
        super(injector);
    }

    private hide = false;

    ngAfterViewInit() {
        if(!this.componentContext.slickGridComp){
            if(!(<any>this.config.componentContext).searchGridConfig){
                return;
            }
            let searchGridProvider = (<any>this.config.componentContext).searchGridConfig.options.provider;
            if (searchGridProvider) {
                searchGridProvider.onToggleView.subscribe((resp) => {
                    if (resp == 'tile') {
                        this.hide = true;
                    } else {
                        this.hide = false;
                    }
                });
            }
        } else {
            let searchGridProvider = (<any>this.config.componentContext).slickGridComp;
            if (searchGridProvider) {
                searchGridProvider.provider.onToggleViewMode.subscribe((resp) => {
                    if (resp == 'tile') {
                        this.hide = true;
                    } else {
                        this.hide = false;
                    }
                    this.cdr.markForCheck();
                });
            }
        }
    }

    /**
     * On submit search form
     * @param $event
     */
    onToggle($event) {
        this.module.enabled= !this.module.enabled;
        this.cdr.markForCheck();
        // Call subscriber in grid
        if(this.componentContext.slickGridComp){
            this.componentContext.slickGridComp.provider.isThumbnails(this.module.enabled, true)
        } else {
            // debugger;
            (<any>this.config.componentContext).searchGridConfig.options.provider.onIsThumbnails.emit(this.module.enabled, true);
            // this.config.componentContext.searchGridProvider.onIsThumbnails.emit();
        }


    };

    get provider(): SearchThumbsProvider {
        return (<SearchThumbsProvider>this.config.provider);
    }

    get options(): SearchThumbsConfigOptions {
        return (<SearchThumbsConfigOptions>this.config.options);
    }

    get module(): SearchThumbsConfigModuleSetups {
        return (<SearchThumbsConfigModuleSetups>this.config.options.module);
    }

    set enabled(state) {
        (<SearchThumbsConfigModuleSetups>this.config.options.module).enabled = state;
        this.cdr.markForCheck()
    }

    get enabled(): boolean {
        return (<SearchThumbsConfigModuleSetups>this.config.options.module).enabled ;
    }

    get componentContext(): CoreSearchComponent {
        return (<CoreSearchComponent>this.config.componentContext);
    }


    // get config()
}
