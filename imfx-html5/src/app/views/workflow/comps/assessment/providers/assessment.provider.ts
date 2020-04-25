import { EventEmitter, Inject, Injector, Output } from "@angular/core";
import {DetailConfig} from "../../../../../modules/search/detail/detail.config";
import {DetailProvider} from "../../../../../modules/search/detail/providers/detail.provider";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionStorageService} from "ng2-webstorage";
import {MediaDetailResponse} from "../../../../../models/media/detail/media.detail.response";
import {MediaDetailDetailsViewResponse} from "../../../../../models/media/detail/detailsview/media.detail.detailsview.response";
import {MediaDetailMediaTaggingResponse} from "../../../../../models/media/detail/mediatagging/media.detail.media.tagging.response";
import {ConfigService} from "../../../../../services/config/config.service";
import {Location} from '@angular/common';
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {MediaDetailMediaCaptionsResponse} from "../../../../../models/media/detail/caption/media.detail.media.captions.response";
import {TranslateService} from "ng2-translate";
import {Subject} from "rxjs/Subject";
import {NotificationService} from "../../../../../modules/notification/services/notification.service";

export class AssessmentProvider extends DetailProvider {
    saveAssessment: Subject<any> = new Subject();
    @Output() onGetMediaTaggingForSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSavedMediaTagging: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSaveAssessment: EventEmitter<any> = new EventEmitter<any>();
    @Output() afterSavedAssessment: EventEmitter<any> = new EventEmitter<any>();
    @Output() setTaskStatus: EventEmitter<any> = new EventEmitter<any>();
    config: DetailConfig;
    mediaItems: Array<any>;
    jobFile: any;
    taskFile: any;
    jobFriendlyNames: any;
    jobGroups: Array<any>;
    friendlyNamesForJobDetail = 'FriendlyNames.TM_MJOB'

    constructor(@Inject(ActivatedRoute) public route: ActivatedRoute,
                @Inject(Location) public location: Location,
                @Inject(SessionStorageService) public storage: SessionStorageService,
                @Inject(TranslateService)public translate: TranslateService,
                @Inject(Router)public router: Router,
                public injector: Injector,
                @Inject(NotificationService) protected notificationRef: NotificationService) {
        super(route, location, storage, router, translate, injector);
    }

    commonDetailInit() {
        this.moduleContext.config.options.showGolden = false;
        // load job and media items
        let service = this.config.options.service;
        service.getDetails(
          this.getDetailId(),
          this.config.options.appSettings.getSubtypes(),
          this.config.options.typeDetails,
          'Job').subscribe(
          (resp: (MediaDetailResponse & MediaDetailDetailsViewResponse)[]) => {
                this.config.options.file = resp[0]['Medias'][0];
                this.jobFile = resp[0]['Job'];
                this.taskFile = resp[0]['Task'];
                this.mediaItems = resp[0]['Medias'];
                this.setTaskStatus.emit({taskStatus: this.taskFile.TSK_STATUS, taskId: this.taskFile.ID, statusText: this.taskFile.TSK_STATUS_text});
                this.setThumb(this.config.options.file);
                this.setJobDetailColumtnsGroups(resp[1].ColumnData, this.jobFile);
                // load media details view for friendly names
                service.getDetailsView(
                  this.config.options.appSettings.getSubtypes(),
                  this.config.options.detailsviewType).subscribe(
                  (res: (MediaDetailDetailsViewResponse)) => {
                    this.config.options.provider.setDetailColumtnsGroups(res.ColumnData, this.config.options.file);
                    this.config.options.provider.setVideoBlock();
                    this.moduleContext.goldenConfig = $.extend(true, this.moduleContext.goldenConfig, {
                      componentContext: <any>null,
                      moduleContext: this,
                      appSettings: this.config.options.appSettings,
                      options: {
                        file: this.config.options.file,
                        groups: this.config.options._accordions,
                        friendlyNames: this.config.options.userFriendlyNames,
                        typeDetailsLocal: this.config.options.typeDetailsLocal,
                        typeDetails: this.config.options.typeDetails,
                        tabs: this.config.options.tabsData,
                        params: this.config.options.mediaParams,
                        layoutConfig: this.config.layoutConfig,
                        titleForStorage: 'assessment',
                        series: []
                      },
                    });
                    this.moduleContext.config.options.showGolden = true;
                    this.moduleContext.cd.markForCheck();
                    // this.moduleContext.cd.detectChanges();
                  }
                );
                this.moduleContext.cd.markForCheck();
                // this.moduleContext.cd.detectChanges();
            }
        );
        this.getJobColumnsFriendlyNames();
        this.getColumnsFriendlyNames();
    }

    setThumb(file) {
        if (file.THUMBID === -1) {
            file.THUMBURL = this.config.options.defaultThumb;
        } else {
            file.THUMBURL = ConfigService.getAppApiUrl() + '/getfile.aspx?id=' + file.THUMBID;
        }
    };

    /**
     * get columns friendly names from rest or storage
     */
    getColumnsFriendlyNames(): any {
        this.config.options.service.getLookups(this.config.options.friendlyNamesForDetail).subscribe(
            (resp) => {
                this.config.options.userFriendlyNames = resp;
                this.setColumnsFriendlyNames(resp);
            }
        );
    };

    /**
     * get columns friendly names from rest or storage
     */
    getJobColumnsFriendlyNames(): any {
        this.config.options.service.getLookups(this.friendlyNamesForJobDetail).subscribe(
            (resp) => {
                this.jobFriendlyNames = resp;
                this.moduleContext.goldenConfig.options.jobFriendlyNames = resp;
                this.moduleContext.cd.detectChanges();
            }
        );
    };

    setColumnsFriendlyNames(names): any {
        this.moduleContext.goldenConfig.options.friendlyNames = names;
        this.moduleContext.cd.detectChanges();
    };

    /**
     * Calling on Save button clicking.
     */
    getMediaTaggingForSave(): any {
       // this.locatorsProvider.onGetMediaTaggingForSave.emit();
    }
    /**
     *Set Job detail columns groups
     *@param columnData - object with data about cols groups
     */
    setJobDetailColumtnsGroups(columnData, file) {
      this.config.moduleContext.cd.reattach();
      let groups = [];
      this.jobGroups = [];
      for (let e in columnData) {
        let gr = groups.filter(function (el) {
          return el == columnData[e].GroupName;
        });
        if (!gr.length) {
          groups.push(columnData[e].GroupName);
          this.jobGroups.push({
            'name': columnData[e].GroupName,
            'props': [columnData[e].Tag]
          });
        }
        else {
          this.jobGroups.filter(function (el) {
            return el.name == columnData[e].GroupName;
          })[0].props.push(columnData[e].Tag);
        }
      }
      this.config.moduleContext.cd.detectChanges();
    }

    loadTagging(id): Observable<Subscription> {
      return Observable.create((observer) => {
        this.config.options.service.getDetailMediaTagging(id).subscribe(resp => {
          observer.next(resp);
        });
      });
    }

    loadSubtitles(id): Observable<Array<MediaDetailMediaCaptionsResponse>> {
      let mediaSubtypes = this.config.options.appSettings.getMediaSubtypes();
      if (this.config.options.file['MEDIA_TYPE'] == mediaSubtypes.Media || this.config.options.file['MEDIA_TYPE'] == mediaSubtypes.Audio) {
        return Observable.create((observer) => {
          this.config.options.service.getSubtitles(id)
            .subscribe((res: Array<MediaDetailMediaCaptionsResponse>) => {
              observer.next(res);
            });
        });
      } else {
        return Observable.create((observer) => {
          observer.next([]);
        });
      }
    }
    save() {

        let saveObj = {
            Job: this.jobFile,
            Medias: this.mediaItems,
            Task: this.taskFile
        };
        this.onSaveAssessment.emit();
        this.config.options.service.save(this.getDetailId(), saveObj).subscribe( (res) => {
            this.afterSavedAssessment.emit(res);
            let message = this.translate.instant('simple_assessment.success_save');
            this.notificationRef.notifyShow(1, message);
        }, (err) => {
            let message = this.translate.instant('simple_assessment.error_save');
            this.notificationRef.notifyShow(2, message);
        });

    }
}
