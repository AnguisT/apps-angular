import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject
} from '@angular/core';
import {DetailConfig} from "../../../../modules/search/detail/detail.config";
import {DetailService} from "../../../../modules/search/detail/services/detail.service";
import {AssessmentProvider} from "./providers/assessment.provider";
import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";
import {MediaAppSettings} from "../../../media/constants/constants";
import {NotificationService} from "../../../../modules/notification/services/notification.service";
import {TimecodeProvider} from "../../../../modules/controls/html.player/providers/timecode.provider";
import {AssessmentService} from "./services/assessment.service";
import { Location } from '@angular/common';
import {LocatorsProvider} from "../../../../modules/controls/locators/providers/locators.provider";
import {AudioSynchProvider} from "../../../../modules/controls/html.player/providers/audio.synch.provider";
import {TranslateService} from "ng2-translate";
import {Subject} from "rxjs/Subject";


@Component({
    selector: 'simple-assessment',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../../../modules/search/detail/styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
      AssessmentProvider,
      MediaAppSettings,
      DetailService,
      {provide: DetailService, useClass: AssessmentService},
      AssessmentService,
      TimecodeProvider,
      LocatorsProvider,
      AudioSynchProvider
     // Location
    ]
})

export class AssessmentComponent {
    getValidation: Subject<any> = new Subject();
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
            typeDetailsLocal: 'simple_assessment',
            providerDetailData: <any>null,
            provider: <AssessmentProvider>null,
            service: <DetailService>null,
            data: <any>null,
            detailCtx: this,
            typeDetails: 'media-details',
            detailsviewType: 'MediaDetails',
            friendlyNamesForDetail: 'FriendlyNames.TM_MIS',
            showGolden: false,
            defaultThumb: './assets/img/default-thumb.png',
            clipBtns: true,
            disabledClipBtns: true
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
            typeDetailsLocal: 'simple_assessment',
            typeDetails: <string>null,
            tabs: [],
            params: <any>null,
            series: <any>null,
            titleForStorage: 'assessment'
        }
    };
    private taskStatus: number = 0;
    private taskId: number = 0;
    private statusText: string = '';
    constructor(public route: ActivatedRoute,
                protected appSettings: MediaAppSettings,
                private assessmentService: DetailService,
                private cd: ChangeDetectorRef,
                private location: Location,
                private detailProvider: AssessmentProvider,
                private router: Router,
                private translate: TranslateService,
                @Inject(NotificationService) protected notificationRef: NotificationService) {
        // detail provider
        this.config.options.provider = this.detailProvider;
        this.config.options.provider.moduleContext = this;
        this.config.options.service = this.assessmentService;
        this.config.options.appSettings = this.appSettings;
        (<any>this.config.options.provider).setTaskStatus.subscribe(res => {
            this.taskStatus = res.taskStatus;
            this.taskId = res.taskId;
            this.statusText = res.statusText;
        });
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
          if (event instanceof RoutesRecognized && event.url.indexOf('/assessment/') > -1) {
            let first = event.state.root.firstChild.firstChild;
            let id = first && event.state.root.firstChild.firstChild.params['id'];
            if (id != self.checkId) {
              self.checkId = id;
                new Promise((resolve, reject) => {
                    resolve();
                }).then(
                    () => {
                        self.commonDetailInit(false);
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            }
          }
        });
        this.commonDetailInit(null);
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
    save() {
        this.getValidation.next();
    }
    validateAndSave(isValid) {
        if ( isValid ) {
           this.config.options.provider.save();
        } else {
            let message = this.translate.instant('simple_assessment.invalid_save');
            this.notificationRef.notifyShow(2, message);
        }
    }
}
