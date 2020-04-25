import {
  ChangeDetectorRef, Component, EventEmitter, Inject, Injectable, Injector, ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {SlickGridComponent} from "../../../slick-grid/slick-grid";
import {
  SlickGridConfig, SlickGridConfigModuleSetups,
  SlickGridConfigOptions, SlickGridConfigPluginSetups
} from "../../../slick-grid/slick-grid.config";
import {SlickGridProvider} from "../../../slick-grid/providers/slick.grid.provider";
import {SlickGridService} from "../../../slick-grid/services/slick.grid.service";
import {SearchFormProvider} from "../../../form/providers/search.form.provider";
import {DetailService} from "../../services/detail.service";
import {IMFViewsProvider} from "./providers/views.provider";
import {IMFSlickGridProvider} from "./providers/imf.slick.grid.provider";
import {ModalConfig} from "../../../../modal/modal.config";
import {XMLModalComponent} from "./comps/xml.modal/xml.modal";
import {ModalComponent} from "../../../../modal/modal";

@Component({
    selector: 'imfx-events-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../../../styles/index.scss'
    ],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
      SlickGridProvider,
      {provide: SlickGridProvider, useClass: IMFSlickGridProvider},
      SearchFormProvider,
      SlickGridService,
      IMFViewsProvider,
      DetailService
    ],
})
@Injectable()
export class IMFTabComponent {
    config: any;
    public compIsLoaded = false;
    @ViewChild('slickGridComp') slickGrid: SlickGridComponent;
    private translateSchemaModal: string = 'CPL Details';
    @ViewChild('commonMetadataModal') private commonMetadataModal: ModalComponent;
    private searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
      componentContext: this,
      providerType: SlickGridProvider,
      serviceType: SlickGridService,
      options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
        module: <SlickGridConfigModuleSetups>{
          viewMode: 'table',
          onIsThumbnails: new EventEmitter<boolean>(),
          onSelectedView: new EventEmitter<any>(),
          isThumbnails: false
        },
        plugin: <SlickGridConfigPluginSetups>{
          rowHeight: 30,
          forceFitColumns: true
        }
      })
    });
    private commonMetadataModalConfig = <ModalConfig>{
      componentContext: this,
      options: {
        modal: {
          size: 'lg',
          isFooter: false,
          height: '100vh'
        },
        content: {
          view: XMLModalComponent,
        }
      }
    };
    constructor(private cdr: ChangeDetectorRef,
              @Inject(Injector) public injector: Injector) {
      this.commonMetadataModalConfig.options.modal.title = this.translateSchemaModal;
    }
    ngAfterViewInit() {
      this.loadIMF();
    }

    public loadComponentData() {
      this.refreshGrid();
    };

    loadIMF() {
      let detailService = this.injector.get(DetailService);
      detailService.getIMFPackage(this.config.file.ID).subscribe( res => {
        let globalColsView = this.injector.get(IMFViewsProvider).getCustomColumns();
        globalColsView[0].__deps.data = {
          provider: this
        };
        this.slickGrid.provider.setGlobalColumns(globalColsView);
        this.slickGrid.provider.setDefaultColumns(globalColsView, [], true);
        this.slickGrid.provider.buildPageByData({Data: res || []});
        this.refreshGrid();
        this.compIsLoaded = true;
      });
    };
    refreshGrid() {
      // setTimeout(() => {
      //   this.slickGrid.provider.resize();
      // }, 0);
    };
    showModal(mediaId) {
      let detailService = this.injector.get(DetailService);
      this.commonMetadataModal.show();
      this.commonMetadataModal.getContent().toggleOverlay(true);
      detailService.getIMFCPL(mediaId).subscribe( res => {
        this.commonMetadataModal.getContent().selectedSchemaModel = res.SchemaModel;
        this.commonMetadataModal.getContent().selectedXmlModel = res.XmlModel;
        this.commonMetadataModal.getContent().toggleOverlay(false);
        this.commonMetadataModal.getContent().cdr.detectChanges();
      });
    }
}
