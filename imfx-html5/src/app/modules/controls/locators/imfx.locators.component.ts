import {
  Component, EventEmitter, Injectable, Inject, Output, ViewEncapsulation, ChangeDetectorRef,
  NgZone, IterableDiffers, KeyValueDiffers
} from '@angular/core';
import { LocatorsProvider } from './providers/locators.provider';
import { LocatorsService } from './services/locators.service';
import { TranslateService } from 'ng2-translate';
import { NotificationService } from '../../../modules/notification/services/notification.service';
import {Subject} from "rxjs/Subject";

@Component({
    selector: 'imfx-logger-locators',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [LocatorsService]
})
@Injectable()
export class IMFXLocatorsComponent {
    @Output() onSaveMediaTagging: EventEmitter<any> = new EventEmitter<any>();
    reloadTaggingData: Subject<any> = new Subject();

    active: string = 'Comments';
    // blackDetectedConfig: any;
    locatorTabConfig = {
        blackdetect: null,
        comments: null,
        legal: null,
        cuts: null,
    }
    config: any;
    loadedSeries: Array<any>;

    constructor(private provider: LocatorsProvider, private service: LocatorsService,
                private translate: TranslateService,
                private cd: ChangeDetectorRef,
                @Inject(NotificationService) protected notificationRef: NotificationService) {

        this.provider.onGetMediaTaggingForSave.subscribe(res => {
            this.saveMediaTagging();
        });
        this.provider.onReloadMediaTagging.subscribe(res => {
            this.reloadMediaTagging();
        });
    };

    ngOnInit() {
      !this.config.options.provider ?
        this.config.options.provider = this.provider :
        this.provider = this.config.options.provider;

      !this.config.options.service ?
        this.config.options.service = this.service :
        this.service = this.config.options.service;
      this.loadedSeries = this.config.loadedSeries;
      let idx = 0;
      for (let e in this.locatorTabConfig) {
          this.locatorTabConfig[e] = {
              tagType: e,
              columns: e.toLocaleLowerCase() == 'blackdetect' ? this.config.blackDetectedColumns : this.config.commentsColumns,
              file: this.config.file,
              series: this.config.series.filter(function (el) {
                  return el.TagType.toLocaleLowerCase() == e.toLocaleLowerCase();
              }),
              elem: this.config.elem,
              componentContext: this.config.componentContext,
              locatorsComponent: this,
              hasOuterFilter: false,
              id: e.toLocaleLowerCase() == 'blackdetect' ? -1 : idx++,
          };
      }
      this.provider.config = this.config;

        // this.blackDetectedConfig = {
        //     columns: this.config.blackDetectedColumns,
        //     file: this.config.file,
        //     series: this.config.series,
        //     elem: this.config.elem
        // };
    };

    /**
     * add clip into active tab
     */
    addClip(data) {
      !!this.active !== false && this.locatorTabConfig[this.active.toLocaleLowerCase()].moduleContext.addClip(data.data, data.replace, this.locatorTabConfig[this.active.toLocaleLowerCase()].id);
    };

    /**
     * add tag into active tab and selected row
     */
    addTag(data) {
        if (!!this.active !== false) {
            let conf = this.locatorTabConfig[this.active.toLocaleLowerCase()];
            if (conf) {
                if (conf.moduleContext) {
                    let m = conf.moduleContext;
                    let res = m.addTag(data.tagText);
                    if (res === true) {
                        m.resetRowHeights();
                        m.gridOptions.api.refreshView();
                    }
                }
            }
        }
    };

    /**
     * prepare data for save
     */
    saveMediaTagging(): any{
        let res = [];
        this.config.series.forEach((el) => {
            if (el.TagType !== 'Blackdetect') {
                res.push({
                    Id: el.Id,
                    InTc: el.InTc,
                    OutTc: el.OutTc,
                    Notes: el.Notes,
                    LinkGuid: this.config.file.DFILE_LINK_GUID,
                    Origin: el.indicator.title,
                    TagType: el.TagType,
                    Tags: el.Tags
                });
            }
        });
        // this.config.elem.emit('onSaveMediaTagging', res);
        let id = this.config.file.ID;
        this.provider.saveMediaTagging(res, id).subscribe(resp => {
            let message = this.translate.instant('media_logger.success_save');
            this.notificationRef.notifyShow(1, message);
            this.updateSavedMediaTagging(resp);
          },
          (error) => {
            let message = this.translate.instant('media_logger.error_save');
            this.notificationRef.notifyShow(2, message);
            console.error(error);
          });
    };

    /**
     * actualizate media tagging data after saving
     */
    updateSavedMediaTagging(newIds) {
        // delete items with Id <=0
        this.config.series = this.config.series.filter((el) => {
            return el.Id >= 0;
        });
        // if returns new items Ids
        if (newIds) {
            this.config.series.filter((el) => {
                return el.Id === 0 && el.TagType !== 'Blackdetect';
            })
                .forEach((el, ind) => {
                    el.Id = newIds[ind];
                });
        }
    };

    selectTab(active) {
        this.active = active;
        let mc = this.locatorTabConfig[this.active.toLocaleLowerCase()].moduleContext;
        mc && mc.unselectRow();
        this.config.elem.emit('clearMarkers', true);
        if ( this.active.toLocaleLowerCase() == this.locatorTabConfig.blackdetect.tagType.toLocaleLowerCase() ) {
            this.config.elem.emit('disableAllMarkersButtons');
        }
    }
  /**
   * reload media tagging data
   */
    reloadMediaTagging() {
      for (let e in this.locatorTabConfig) {
        this.locatorTabConfig[e].series = JSON.parse(JSON.stringify(this.loadedSeries.filter(function (el) {
            return el.TagType.toLocaleLowerCase() == e.toLocaleLowerCase();
          })));
      }
      this.reloadTaggingData.next();
      this.provider.saveValid = false;
      this.cd.detectChanges();
    }

    onSaveValid() {
      this.provider.saveValid = true;
      this.cd.detectChanges();
    }
}
