import {
    ApplicationRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    EventEmitter,
    Injectable,
    Injector,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {SlickGridComponent} from "../../../slick-grid/slick-grid";
import {DatetimeFormatter} from "../../../slick-grid/formatters/datetime/datetime.formatter";
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions,
    SlickGridConfigPluginSetups
} from "../../../slick-grid/slick-grid.config";
import {SlickGridProvider} from "../../../slick-grid/providers/slick.grid.provider";
import {SlickGridService} from "../../../slick-grid/services/slick.grid.service";
import {
    SlickGridButtonFormatterEventData, SlickGridColumn,
    SlickGridSelect2FormatterEventData
} from "../../../slick-grid/types";
import {Select2Formatter} from "../../../slick-grid/formatters/select2/select2.formatter";
import {LookupService} from "../../../../../services/lookup/lookup.service";
import {TextFormatter} from "../../../slick-grid/formatters/text/text.formatter";
import {IMFXHtmlPlayerComponent} from "../../../../controls/html.player/imfx.html.player";
import {VideoJSCurrentTimeProvider} from "../../../../controls/html.player/providers/videojs.current.time.provider";
import {AudioTracksService} from "./services/audio.tracks.service";
import {AudioSynchProvider} from "../../../../controls/html.player/providers/audio.synch.provider";
import {ATFirstSlickGridProvider} from "./providers/audiotracks.first.slickgrid.provider";
import {ATSecondSlickGridProvider} from "./providers/audiotracks.second.slickgrid.provider";
import {PlayButtonFormatter} from "../../../slick-grid/formatters/play-button/play-button.formatter";
import {DeleteFormatter} from "../../../slick-grid/formatters/delete/delete.formatter";
import {ActivatedRoute} from "@angular/router";
import {ATFirstSlickGridViewsProvider} from "./providers/first.slickgrid.views.provider";
import {ATSecondSlickGridViewsProvider} from "./providers/second.slickgrid.views.provider";
import {DetailProvider} from "../../providers/detail.provider";

@Component({
    selector: 'imfx-s-audio-tracks-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../../../styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        SlickGridProvider,
        ATFirstSlickGridProvider,
        ATSecondSlickGridProvider,
        {provide: SlickGridProvider, useClass: ATFirstSlickGridProvider},
        {provide: SlickGridProvider, useClass: ATSecondSlickGridProvider},
        SlickGridService,
        IMFXHtmlPlayerComponent,
        VideoJSCurrentTimeProvider,
        AudioTracksService,
        ATFirstSlickGridViewsProvider,
        ATSecondSlickGridViewsProvider,
        DetailProvider
    ]
})
@Injectable()
export class IMFXAudioTracksTabComponent {
    @ViewChild('audioTracksGrid') private audioTracksGrid: SlickGridComponent;
    @ViewChild('tracksGrid') private tracksGrid: SlickGridComponent;
    public onResize: EventEmitter<{ comp: any }> = new EventEmitter<{ comp: any }>();
    config: any;
    active: string;

    private audioTracksGridOptions: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        providerType: ATFirstSlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                isThumbnails: false,
                search: {
                    enabled: false
                }
            },
            plugin: <SlickGridConfigPluginSetups>{
                rowHeight: 35,
                forceFitColumns: true
            }
        })
    });
    private tracksGridOptions: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        // providerType: TitlesSlickGridProvider,
        providerType: ATSecondSlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                isThumbnails: false,
                search: {
                    enabled: false
                }
            },
            plugin: <SlickGridConfigPluginSetups>{
                rowHeight: 35,
                forceFitColumns: true
            }
        })
    });
    private player: AudioSynchProvider;
    public playerComponent: IMFXHtmlPlayerComponent;

    constructor(private cdr: ChangeDetectorRef,
                private compFactoryResolver: ComponentFactoryResolver,
                private appRef: ApplicationRef,
                private lookup: LookupService,
                private injector: Injector,
                private audioTracksService: AudioTracksService,
                private route: ActivatedRoute) {
        // this.onResize.subscribe(() => {
        //     this.audioTracksGrid.provider.resize();
        //     this.tracksGrid.provider.resize();
        // });
        this.player = this.injector.get(AudioSynchProvider);
    }

    ngAfterViewInit() {
      this.setAudioTracks();
    }

    public loadComponentData() {
        // setImmediate(() => {
        //     this.audioTracksGrid.provider.resize();
        //     this.tracksGrid.provider.resize();
        // });
    }
    setAudioTracks() {
      let globalAudioTracksColsView = this.injector.get(ATFirstSlickGridViewsProvider).getCustomColumns(this.config.readOnly);
      let globalTracksColsView = this.injector.get(ATSecondSlickGridViewsProvider).getCustomColumns(this.config.readOnly);

      if (this.config.playerComponent && (<any>this.config.playerComponent).compRef) {
        globalTracksColsView.unshift(<any>{
          id: -1,
          name: 'Audio Files',
          field: '*',
          minWidth: 50,
          width: 50,
          resizable: true,
          sortable: false,
          multiColumnSort: false,
          formatter: PlayButtonFormatter,
          isFrozen: true,
          isCustom: true,
          isRelatedAudio: true,
          __deps: {
            componentFactoryResolver: this.compFactoryResolver,
            appRef: this.appRef,
            injector: this.injector,
            data: []
          }
        });
      }
      if (this.config.readOnly) {
        // if (this.config.readOnly === true) {
        this.selectAudioTracks(globalAudioTracksColsView, globalTracksColsView);
      } else {
        let select2ColLanguages = null;
        let select2ColMS = null;
        let select2ColTypeId = null;
        globalAudioTracksColsView = globalAudioTracksColsView.map((c: SlickGridColumn, i: number) => {
          if (c.field == 'LanguageId') {
            select2ColLanguages = i;
          } else if (c.field == 'MsTypeId') {
            select2ColMS = i;
          } else if (c.field == 'TypeId') {
            select2ColTypeId = i;
          }
          return c;
        });
        let audioMsTypes = this.lookup.getLookups('AudioMsTypes');
        let audioContentTypes = this.lookup.getLookups('AudioContentTypes');
        let languages = this.lookup.getLookups('Languages');

        let completed = 0;
        audioMsTypes.subscribe((resp) => {
          globalAudioTracksColsView[select2ColMS].__deps.data = {
              values: resp,
              rule: this.lookup.getLookupRuleForConvertToSelect2Item('AudioMsTypes'),
              validationEnabled: true
          };
          completed++;
          if (completed == 3) {
            this.selectAudioTracks(globalAudioTracksColsView, globalTracksColsView);
          }
        });
        audioContentTypes.subscribe((resp) => {
          globalAudioTracksColsView[select2ColTypeId].__deps.data = {
              values: resp,
              rule: this.lookup.getLookupRuleForConvertToSelect2Item('AudioContentTypes'),
              validationEnabled: true
          };
          completed++;
          if (completed == 3) {
            this.selectAudioTracks(globalAudioTracksColsView, globalTracksColsView);
          }
        });
        languages.subscribe((resp) => {
          globalAudioTracksColsView[select2ColLanguages].__deps.data = {
              values: resp,
              rule: this.lookup.getLookupRuleForConvertToSelect2Item('Languages'),
              validationEnabled: true
          };
          completed++;
          if (completed == 3) {
            this.selectAudioTracks(globalAudioTracksColsView, globalTracksColsView);
          }
        });
        this.audioTracksGrid.provider.onRowDelete.subscribe((res) => {
          let audioTracks = this.config.file['AudioTracks'];
          let id = null;
          audioTracks.forEach((el, ind) => {
            if ( el.ID === res || el.customId === res )
              id = ind;
          });
          if (id !== null) {
            let audioTrack = audioTracks.splice(id, 1);
            if (audioTrack[0].customId == null) {
                this.config.file.DeletedAudioTracks.push(audioTrack[0]);
            }
            audioTracks.forEach((el, ind) => {
                el.TrackNo = ind + 1;
            });
            let detailProvider = this.injector.get(DetailProvider);
            let _data = this.audioTracksGrid.provider.prepareData(detailProvider._deepCopy(audioTracks), audioTracks.length);
            this.audioTracksGrid.provider.getSlick().invalidate();
            this.audioTracksGrid.provider.setData(_data, true);
          }
        });
          this.audioTracksGrid.provider.formatterTextOnChange.subscribe((res: SlickGridSelect2FormatterEventData) => {
              let audioTracks = this.config.file['AudioTracks'];
              let _id =  res.data.data.ID || res.data.data['customId'];
              audioTracks.forEach(el => {
                  if ( el.ID === _id || el['customId'] === _id ) {
                      el[res.data.columnDef.field] = res.value;
                  }
              });
              res.data.data[res.data.columnDef.field] = res.value;
          });
          this.audioTracksGrid.provider.formatterSelect2OnSelect.subscribe((res: SlickGridSelect2FormatterEventData) => {
              let audioTracks = this.config.file['AudioTracks'];
              let _id =  res.data.data['Id'] || res.data.data['customId'];
              audioTracks.forEach(el => {
                  if ( el.Id === _id || el['customId'] === _id ) {
                      el[res.data.columnDef.field] = res.value.id;
                  }
              });
              res.data.data[res.data.columnDef.field] = res.value.id;
          });
      }
    }
    selectAudioTracks(globalAudioTracksColsView, globalTracksColsView) {
        this.audioTracksGrid.provider.setGlobalColumns(globalAudioTracksColsView);
        this.audioTracksGrid.provider.setDefaultColumns(globalAudioTracksColsView, [], true);
        let detailProvider = this.injector.get(DetailProvider);
        this.audioTracksGrid.provider.buildPageByData({Data: detailProvider._deepCopy(this.config.file['AudioTracks'])});

        let tableRows = [];
        this.audioTracksService.getAudioTracks(this.config.file['ID']).subscribe((tableRows: any[]) => {
            this.tracksGrid.provider.setGlobalColumns(globalTracksColsView);
            this.tracksGrid.provider.setDefaultColumns(globalTracksColsView, [], true);
            this.tracksGrid.provider.buildPageByData({Data: tableRows});
            this.tracksGrid.provider.formatterPlayButtonOnClick.subscribe((d: SlickGridButtonFormatterEventData) => {
                console.log(this.config.playerComponent);
                let url = d.value == true ? (<any>d.data.data).PROXY_URL : '';
                if (this.config.playerComponent) {
                    (<any>this.config.playerComponent).compRef.instance.updateAudioSrc(url);
                } else {
                    this.player.updateAudioSrc(url);
                }
            });
        });
    };

    addEvent() {
        this.config.elem.emit('addEvent');
        let tracks = this.config.file['AudioTracks'];
        let newItem = {
            TrackNo: tracks.length + 1,
            Language: null,
            MS: null,
            LangTag: "",
            TypeId: 0,
            QcText: null,
            IntAudioFlag: null,
            DateAdded: "",
            Miid: this.config.file.ID,
            TimecodeFormat: this.config.file.TimecodeFormat,
            customId: new Date().getTime()
        };
        tracks.push(newItem);
        let detailProvider = this.injector.get(DetailProvider);
        let _data = this.audioTracksGrid.provider.prepareData(detailProvider._deepCopy(tracks), tracks.length);
        this.audioTracksGrid.provider.getSlick().invalidate();
        this.audioTracksGrid.provider.setData(_data, true);
        this.audioTracksGrid.provider.setSelectedRow(_data.length - 1);
    }

    addEventToGrid(data) {
    }
    selectTab(active) {
      this.active = active;
    }
    refreshGrid(data?: any, readOnly?: boolean) {
        if (readOnly != null) {
            this.config.readOnly = readOnly;
        };
        if (data) {
            this.config.file = data;
            this.setAudioTracks();
        };
    };
    updateDataIds(ids) {
        let audioTracks = this.config.file['AudioTracks'].filter(el => {
            return el.customId != null;
        });
        audioTracks.forEach((el, idx) => {
            el.Id = ids[idx];
            delete el.customId;
        });
    }
    getValidation() {
        if (this.config.readOnly) {
            return true;
        } else {
            let isValid = true;
            let audioTracks = this.config.file['AudioTracks'];
            audioTracks.forEach(el => {
                if (!el.TypeId || !el.Language || !el.MS) {
                    isValid = false;
                }
            });
            // this.audioTracksGrid.provider.onGetValidation.emit(function(valid){
            //     isValid = isValid && valid ? true : false;
            // });
            return isValid;
        }
    }
}
