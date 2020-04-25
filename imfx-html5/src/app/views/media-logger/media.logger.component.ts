import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject
} from '@angular/core';
import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";
import { MediaLoggerService } from "./services/media.logger.service";
import { MediaAppSettings } from '../media/constants/constants';
import { Location } from '@angular/common';
import { DetailConfig } from '../../modules/search/detail/detail.config';

import { MediaLoggerProvider } from "./providers/media.logger.provider";
import { DetailService } from '../../modules/search/detail/services/detail.service';
import { IMFXGrid } from "../../modules/controls/grid/grid";

import { TimecodeProvider } from '../../modules/controls/html.player/providers/timecode.provider';
import { NotificationService } from '../../modules/notification/services/notification.service';
import { TaxonomyService } from "../../modules/search/taxonomy/services/service";

import { LocatorsProvider } from '../../modules/controls/locators/providers/locators.provider';
import {AudioSynchProvider} from "../../modules/controls/html.player/providers/audio.synch.provider";

@Component({
    selector: 'media-logger',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../modules/search/detail/styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        MediaAppSettings,
        MediaLoggerService,
        MediaLoggerProvider,
        DetailService,
        TimecodeProvider,
        TaxonomyService,
        LocatorsProvider,
        AudioSynchProvider
    ],
    entryComponents: [
      IMFXGrid
    ]
})

export class MediaLoggerComponent {
    private checkId: any;
    private parametersObservable: any;
    private routerChangeSubscriver: any;
    private config = <DetailConfig>{
        componentContext: <any>null,
        options: {
            _accordions: [],
            tabsData: [],
            file: {},
            userFriendlyNames: {},
            mediaParams: {
                addPlayer: false,
                addMedia: false,
                addImage: false,
                showAllProperties: false,
                isSmoothStreaming: false,
                mediaType: ''
            },
            typeDetailsLocal:'media_logger',
            providerDetailData: <any>null,
            provider: <MediaLoggerProvider>null,
            service: <DetailService>null,
            data: <any>null,
            detailCtx: this,
            typeDetails: "media-details",
            detailsviewType: "MediaDetails",
            friendlyNamesForDetail: "FriendlyNames.TM_MIS",
            showGolden: false,
            defaultThumb: './assets/img/default-thumb.png',
            clipBtns: true,
            disabledClipBtns: false
        },
        moduleContext: this
    };

    private goldenConfig = {
        componentContext: this,
        appSettings: <any>null,
        options: {
            file: Object,
            groups: [],
            friendlyNames: Object,
            typeDetailsLocal: 'media_logger',
            typeDetails: <string>null,
            tabs: [],
            params: <any>null,
            series: <any>null,
            titleForStorage: 'mediaLogger'
        }
    };
    constructor(public route: ActivatedRoute,
                protected appSettings: MediaAppSettings,
                private mediaLoggerService: DetailService,
                private cd: ChangeDetectorRef,
                private location: Location,
                private detailProvider: MediaLoggerProvider,
                private router: Router,
                @Inject(NotificationService) protected notificationRef: NotificationService,
                @Inject(LocatorsProvider) public locatorsProvider: LocatorsProvider) {
        // detail provider
        this.config.options.provider = this.detailProvider;
        this.config.options.provider.moduleContext = this;
        this.config.options.service = this.mediaLoggerService;
        this.config.options.appSettings = this.appSettings;
    }

    ngOnInit() {
        let self = this;
        if (this.parametersObservable != null) {
          this.parametersObservable.unsubscribe();
        }
        this.config.options.provider.config = this.config;
        if (this.parametersObservable == null) {
          this.parametersObservable = this.route.params.subscribe(params => {
            if (params['id']) {
              self.checkId = params['id'];
            }
          });
        }
        if (this.routerChangeSubscriver != null) {
          this.routerChangeSubscriver.unsubscribe();
        }

        this.routerChangeSubscriver = this.router.events.subscribe(event => {
          if (event instanceof RoutesRecognized && event.url.indexOf('/media-logger/') > -1) {
            let first = event.state.root.firstChild.firstChild;
            let id = first && event.state.root.firstChild.firstChild.params['id'];
            if (id != self.checkId) {
              self.checkId = id;
              setTimeout(() => {
                self.commonDetailInit(false);
              }, 0);
            }
          }
        });
        this.config.options.provider.commonDetailInit(null);
    };
    ngOnDestroy() {
      if (this.parametersObservable != null) {
        this.parametersObservable.unsubscribe();
      }
      if (this.routerChangeSubscriver != null) {
        this.routerChangeSubscriver.unsubscribe();
      }
    }
    commonDetailInit(firstInit) {
      this.config.options.provider.commonDetailInit(firstInit);
    }
    /**
    * Calling on Back button clicking. Go back to Media page
    */
    clickBack() {
        this.config.options.provider.clickBack();
    }
  /**
   * Calling on Save button clicking.
   */
    save() {
      this.locatorsProvider.onGetMediaTaggingForSave.emit();
      // this.config.options.provider.getMediaTaggingForSave();
    }
    /**
     * Calling on Reload button clicking.
     */
    reload() {
        this.locatorsProvider.onReloadMediaTagging.emit();
      }
    /**
     * Calling for validate Save button.
     */
    isValid(): boolean {
      return this.locatorsProvider.isSaveValid();
    }
}
