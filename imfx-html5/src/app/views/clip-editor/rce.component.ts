import {
    Component, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, ViewChild,
    EventEmitter, Inject, Injector
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { IMFXGrid } from '../../modules/controls/grid/grid';
import { TranslateService } from 'ng2-translate';
import { DetailService } from '../../modules/search/detail/services/detail.service';
import { IMFXHtmlPlayerComponent } from '../../modules/controls/html.player/imfx.html.player';
import { TimelineConfig } from '../../modules/controls/timeline/timeline.config';
import { IMFXTimelineComponent } from '../../modules/controls/timeline/imfx.timeline';
import { SegmentetClipsProvider } from './providers/segmented.clips.provider';
import { TimeCodeFormat, TMDTimecode } from '../../utils/tmd.timecode';
import { ClipEditorService } from '../../services/clip.editor/clip.editor.service';
import { VersionDetailProvider } from '../version/providers/version.detail.provider';
import { DetailComponent } from '../../modules/search/detail/detail';
import { RaiseWorkflowWizzardProvider } from '../../modules/rw.wizard/providers/rw.wizard.provider';
import { DetailConfig } from '../../modules/search/detail/detail.config';
import { VersionAppSettings } from '../version/constants/constants';
import { SecurityService } from '../../services/security/security.service';
import { MediaDetailResponse } from '../../models/media/detail/media.detail.response';
import {
  MediaDetailDetailsViewResponse
} from '../../models/media/detail/detailsview/media.detail.detailsview.response';
import { GLClipEditorComponent } from './gl.component';
import { ModalComponent } from '../../modules/modal/modal';
import { ModalConfig } from '../../modules/modal/modal.config';
import { MediaWizardComponent } from './comps/wizard/wizard';
import { MediaWizardProvider } from './comps/wizard/providers/wizard.provider';
import { MediaWizardService } from './comps/wizard/services/wizard.service';
import { LocatorsProvider } from '../../modules/controls/locators/providers/locators.provider';
import {
  ModalPreviewPlayerProvider
} from '../../modules/modal.preview.player/providers/modal.preview.player.provider';
import {
  ModalPreviewPlayerComponent
} from '../../modules/modal.preview.player/modal.preview.player';
import { LocatorsService } from '../../modules/controls/locators/services/locators.service';
import { DetailThumbProvider } from '../../modules/search/detail/providers/detail.thumb.provider';
import { NotificationService } from '../../modules/notification/services/notification.service';
import { ClipsStorageProvider } from './providers/clips.storage.provider';
import {AudioSynchProvider} from "../../modules/controls/html.player/providers/audio.synch.provider";
import {SlickGridProvider} from "../../modules/search/slick-grid/providers/slick.grid.provider";
import {IMFXModalProvider} from "../../modules/imfx-modal/proivders/provider";
import {VersionWizardProvider} from "../../modules/version-wizard/providers/wizard.provider";
import {IMFXModalComponent} from "../../modules/imfx-modal/imfx-modal";
import {VersionWizardComponent} from "../../modules/version-wizard/wizard";
import {RaiseWorkflowWizzardComponent} from "../../modules/rw.wizard/rw.wizard";

export type RCESource = {
  id: any;
  src: string;
  seconds: number;
  restricted: boolean;
  percent?: number;
  som?: number;
  som_string?: string;
  live?: boolean;
  offsetStartAbsSec?: number;
  offsetEndAbsSec?: number;
};

export type RCEArraySource = Array<RCESource>;
export type MediaClip = { start?: string; end?: string; mediaId?: any };

@Component({
  moduleId: 'rce',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss',
    '../../modules/search/detail/styles/index.scss'
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [
    DetailService,
    SegmentetClipsProvider,
    ClipsStorageProvider,
    VersionDetailProvider,
    VersionAppSettings,
    MediaWizardProvider,
    MediaWizardService,
    LocatorsProvider,
    LocatorsService,
    DetailThumbProvider,
    AudioSynchProvider,
      IMFXModalProvider
  ],
  entryComponents: [
    IMFXGrid,
    IMFXHtmlPlayerComponent,
    IMFXTimelineComponent,
    DetailComponent,
    ModalPreviewPlayerComponent,
  ]
})

export class RCEComponent {
  @ViewChild('player') public player: IMFXHtmlPlayerComponent;
  @ViewChild('gl') gl: GLClipEditorComponent;
  @ViewChild('wizardMediaModal') wizardMediaModal: any;

  public file;
  public som;
  public src: string | RCEArraySource;
  public totalDuration: number;
  public timecodeFormatString: string;

  @ViewChild('overlay') private overlay: any;
  @ViewChild('rceElement') private rceElement: any;
  @ViewChild('gl') public golden;
  private id;
  private itemDetails;
  private gridOptions: GridOptions;
  private error: boolean = false;
  private isAudio: boolean = false;
  private text: string = '';
  private timelineConfig: TimelineConfig;

  private details: any;

  private clips = [];
  private isFileValid: boolean = true;

  private config = <DetailConfig>{
    componentContext: this,
    options: {
      file: {},
      provider: <VersionDetailProvider>null,
      needApi: true,
      typeDetails: 'version-details',
      showInDetailPage: false,
      detailsviewType: 'VersionDetails',
      // friendlyNamesForDetail: 'FriendlyNames.TM_MIS',
      friendlyNamesForDetail: 'FriendlyNames.TM_PG_RL',
      data: {
        detailInfo: <any>null
      },
      onDataUpdated: new EventEmitter<any>(),
      detailsViews: [],
      mediaParams: {
        addPlayer: false,
        addMedia: false,
        addImage: false,
        showAllProperties: false,
        isSmoothStreaming: false,
        mediaType: ''
      }
    },
    moduleContext: this,
    layoutConfig: {
      dimensions: {
        headerHeight: 36,
        borderWidth: 10
      },
      settings: {
        hasHeaders: true,
        showPopoutIcon: true,
        showMaximiseIcon: false,
        showCloseIcon: true,
        selectionEnabled: true
      },
      labels: {
        close: 'Close',
        maximise: 'Maximise',
        minimise: 'Minimise',
        popout: 'Open In New Window',
        popin: 'Pop In',
        tabDropdown: 'Additional Tabs'
      },
      content: [{
        type: 'row',
        content: [
          {
            type: 'component',
            componentName: 'Data',
            tTitle: 'Data',
            width: 25
          },
          {
            type: 'column',
            content: [
              {
                type: 'component',
                componentName: 'Media',
                tTitle: 'Media'
              },
              {
                type: 'component',
                componentName: 'Timeline',
                tTitle: 'Timeline'
              }
            ]
          },
          {
            type: 'column',
            content: [
              {
                type: 'component',
                componentName: 'Tagging',
                width: 25
              }
            ]
          }
        ]
      }]
    }
  };
  private goldenConfig = {
    componentContext: this,
    appSettings: <any>null,
    options: {
      file: Object,
      groups: [],
      friendlyNames: Object,
      typeDetailsLocal: 'clip_editor',
      typeDetails: <string>null,
      tabs: [],
      params: <any>null,
      series: <any>null,
      titleForStorage: 'clipEditor'
    }
  };

  /**
   * Wizard
   * @type {ModalConfig}
   */
  // @ViewChild('wizardMediaModal') private wizardModal: ModalComponent;
  // private searchWizardModalConfig = <ModalConfig>{
  //   componentContext: this,
  //   options: {
  //     modal: {
  //       size: 'lg',
  //       title: 'media.wizard.title',
  //       isFooter: false,
  //       top: '47%',
  //       max_height: '700px'
  //     },
  //     content: {
  //       view: MediaWizardComponent,
  //       options: {
  //         provider: <MediaWizardProvider>null,
  //         service: <MediaWizardService>null
  //       }
  //     }
  //   }
  // };

  constructor(private cd: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute,
              public location: Location,
              private detailsService: DetailService,
              private securityService: SecurityService,
              private segmentetClipsProvider: SegmentetClipsProvider,
              private clipEditorService: ClipEditorService,
              private versionDetailProvider: VersionDetailProvider,
              private raiseWorflowProvider: RaiseWorkflowWizzardProvider,
              private modalPreviewPlayerProvider: ModalPreviewPlayerProvider,
              protected appSettings: VersionAppSettings,
              protected searchWizardModalProvider: MediaWizardProvider,
              protected searchWizardModalService: MediaWizardService,
              protected locatorsProvider: LocatorsProvider,
              protected locatorsService: LocatorsService,
              public detailThumbProvider: DetailThumbProvider,
              private translate: TranslateService,
              protected notificationRef: NotificationService,
              private injector: Injector) {
    this.config.options.provider = versionDetailProvider;
    this.config.options.provider.moduleContext = this;
    this.config.options.service = this.detailsService;
    this.config.options.appSettings = this.appSettings;
    this.config.options.typeDetails = this.clipEditorService.getClipEditorType()
                                                            .toLowerCase() + '-details';
    this.config.options.detailsviewType = this.clipEditorService.getClipEditorType() + 'Details';
    if (this.config.options.detailsviewType === 'MediaDetails') {
      this.config.options.friendlyNamesForDetail = 'FriendlyNames.TM_MIS';
      this.config.layoutConfig.content[0].content.push({
        type: 'component',
        componentName: 'MediaItems',
        tTitle: 'MediaItems',
        width: 15
      });
    }
    this.segmentetClipsProvider.componentRef = this;

    // search wizard
    // this.searchWizardModalConfig.options.content.options.provider = this.searchWizardModalProvider;
    // this.searchWizardModalConfig.options
    //     .content.options.provider.clipEditorService = this.clipEditorService;
    // this.searchWizardModalConfig.options.content.options.service = this.searchWizardModalService;
  }
  ngAfterViewInit() {
      // this.searchWizardModalProvider.wizardModal = this.wizardModal;
      this.overlay.hideWhole();
      this.overlay.show(this.rceElement.nativeElement);
      this.route.params.subscribe(params => {
        this.id = +params['id'];
        this.config.options.provider.config = this.config;
        this.config.options.typeDetails = this.clipEditorService.getClipEditorType()
                                                                .toLowerCase() + '-details';
        this.config.options.detailsviewType = this.clipEditorService
                                                  .getClipEditorType() + 'Details';
        this.config.options.provider.commonDetailInit(null);
        this.locatorsService.getDetailMediaTagging(this.id).subscribe((resp) => {
          this.goldenConfig.options.series = [ {source: resp,
                                                mediaId: this.id } ];
        },
          (error) => {
            this.goldenConfig.options.series = [];
          });
      });
      let res = this.clipEditorService.getSelectedRows();
      if (!res.length) {
        this.router.navigate([this.clipEditorService.getClipEditorType().toLowerCase()]);
      }
      this.isAudio = this.clipEditorService.isAudio();
      this.overlay.hideWhole();
      this.fillOwnerData(res);
      this.clipEditorService.onAddToMediaList.subscribe((data) => {
        if (this.gl && this.gl.mediaListComponent) {
          this.gl.mediaListComponent.emit(
            'addItem',
            data
          );
         // this.fillOwnerData([data]);
        }
      });
  }

  fillOwnerData(res) {
    this.file = res[0];
    this.som = TMDTimecode.fromString(
      this.file.SOM_text,
      TimeCodeFormat[this.file.TimecodeFormat]
    ).toSeconds();
    this.timecodeFormatString = res[0].TimecodeFormat;
    let playRestricted = this.securityService.hasPermissionByName('play_restricted_content');
    let src = <RCEArraySource> res.map(el => {
      let duration = TMDTimecode.fromString(
        el.DURATION_text,
        TimeCodeFormat[el.TimecodeFormat]
      ).toSeconds();
      if (duration === 0) {
        this.isFileValid = false;
      }
      let source: RCESource = {
        id: el.ID,
        restricted: el.MEDIA_STATUS === 1,
        src: el.MEDIA_STATUS === 1 && !playRestricted ? '' : el.PROXY_URL,
        seconds: 0,
        live: el.IsLive,
        som: TMDTimecode.fromString(el.SOM_text, TimeCodeFormat[el.TimecodeFormat]).toSeconds(),
        som_string: el.SOM_text
      };

      source.seconds = duration;

      return source;
    });
    if (typeof this.src == 'undefined') {
      this.src = src;
    } else {
      this.src = (<RCEArraySource>this.src).concat(src);
    }
    this.totalDuration = (<RCEArraySource>this.src).map(e => e.seconds).reduce((a, b) => a + b, this.som);
    this.src = (<RCEArraySource>this.src).map((el, idx) => {
      el.percent = ((<RCEArraySource>this.src).slice(0, idx).map(el => el.seconds)
        .reduce((a, b) => a + b, 0) + el.seconds) / (this.totalDuration - this.som);
      return el;
    });

    this.cd.detectChanges();
  }

  checkMediaList() {
    return this.config.options.detailsviewType === 'MediaDetails';
  }

  showMediaTable() {
      let modalProvider = this.injector.get(IMFXModalProvider);
      let modal: IMFXModalComponent = modalProvider.show(MediaWizardComponent, {
          title: 'media.wizard.title',
          size: 'xl',
          position: 'center',
          footerRef: 'modalFooterTemplate'
      });

      // let data = this.getSelectedRow();
      // wizardProvider.showModal(data.ID);




    // this.searchWizardModalConfig.options.content.options.provider.showModal();
  }

  getClips(): Array<MediaClip> {
    return this.segmentetClipsProvider.getClips(this.gl.getTimelineItems());
  }

  private setDetailColumtnsGroups(columnData, file) {
    this.cd.reattach();
    let groups = [];
    let accordions = [];
    for (let e in columnData) {
      let gr = groups.filter(function (el) {
        return el == columnData[e].GroupName;
      });
      if (!gr.length) {
        groups.push(columnData[e].GroupName);
        accordions.push({
          'name': columnData[e].GroupName,
          'props': [columnData[e].Tag]
        });
      }
      else {
        accordions.filter(function (el) {
          return el.name == columnData[e].GroupName;
        })[0].props.push(columnData[e].Tag);
      }
    }
    this.config.options._accordions = accordions;
    this.cd.detectChanges();
  }

  private placeOrder() {
    if ( this.isFileValid ) {
        let modalProvider = this.injector.get(IMFXModalProvider);
        let modal: IMFXModalComponent= modalProvider.show(RaiseWorkflowWizzardComponent, {
            title: 'rwwizard.title',
            size: 'md',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });

        (<RaiseWorkflowWizzardComponent>modal.contentView.instance).rwwizardprovider.open(
            this.config.options.file, this.clipEditorService.getClipEditorType(),
            this.getClips());
    } else {
      this.notificationRef.notifyShow(2, 'rce.invalid_file');
    }
  }

  private openPreview() {
      if (this.isFileValid) {
          let modalProvider = this.injector.get(IMFXModalProvider);
          let previewModal = modalProvider.show(ModalPreviewPlayerComponent, {
              size: 'md',
              title: 'rce.timeline_preview',
              position: 'center',
              footer: false
          }, {
              file: this.file,
              src: <RCEArraySource>this.src,
              clips: this.getClips()
          });
          previewModal.modalEvents.subscribe((res) => {
              previewModal.contentView.instance.playerWrapper.cleanPlayers();
          })
      } else {
          this.notificationRef.notifyShow(2, 'rce.invalid_file');
      }
  }

  private clickBack() {
    this.location.back();
  }

  private _isError(err) {
    if (err.status === 500) {
      // ошибка сервера
      this.text = this.translate.instant('details_item.server_not_work');
    } else if (err.status === 400 || err.status === 404) {
      // элемент не найден
      this.text = this.translate.instant('details_item.media_item_not_found');
    } else if (err.status === 0) {
      // сети нет
      this.text = this.translate.instant('details_item.check_network');
    }
    this.error = true;
    this.cd.markForCheck();
    return true;
  }
  /*
     * Check file properties
     */
  private checkDetailExistance(file) {
    return this.config.options.provider.checkDetailExistance(file);
  }

  /*
   * Check object properties
   */
  private checkObjectExistance(obj) {
    return this.config.options.provider.checkObjectExistance(obj);
  }
}
