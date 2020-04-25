import {
  Component, ViewEncapsulation, Injectable, Inject, ChangeDetectorRef, ViewChild,
  EventEmitter, ComponentFactoryResolver, ApplicationRef, Injector
} from '@angular/core';
import { DetailService } from '../../../../../modules/search/detail/services/detail.service';
import { GridOptions } from 'ag-grid/main';
import { I18NTable } from '../../../../../services/i18n/table/i18n.table';
import { LocalDateGridComponent } from '../../../../controls/local.date/local.date.component';
import {
    MediaDetailHistoryResponse
} from '../../../../../models/media/detail/history/media.detail.detail.history.response';
import {SlickGridComponent} from "../../../slick-grid/slick-grid";
import {
  SlickGridConfig, SlickGridConfigModuleSetups,
  SlickGridConfigOptions
} from "../../../slick-grid/slick-grid.config";
import {SlickGridProvider} from "../../../slick-grid/providers/slick.grid.provider";
import {SlickGridService} from "../../../slick-grid/services/slick.grid.service";
import {MediaDetailAttachmentsResponse} from "../../../../../models/media/detail/attachments/media.detail.detail.attachments.response";
import {SearchFormProvider} from "../../../form/providers/search.form.provider";
import {AttachmentsSlickGridProvider} from "./providers/attachments.slick.grid.provider";
import {SlickGridColumn} from "../../../slick-grid/types";
import {DownloadFormatter} from "../../../slick-grid/formatters/download/download.formatter";
import {PreviewFilesFormatter} from "../../../slick-grid/formatters/preview-files/preview-files.formatter";

@Component({
    selector: 'imfx-attachments-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../../../styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
      SlickGridProvider,
      {provide: SlickGridProvider, useClass: AttachmentsSlickGridProvider},
      SlickGridService,
      SearchFormProvider
    ]
})
@Injectable()
export class IMFXAttachmentsComponent {
    config: any;
    compIsLoaded = false;
    public compFactoryResolver?: ComponentFactoryResolver;
    public appRef?: ApplicationRef;
    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    protected gridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
      componentContext: this,
      providerType: SlickGridProvider,
      serviceType: SlickGridService,
      options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
        module: <SlickGridConfigModuleSetups>{
          viewModeSwitcher: false,
          onIsThumbnails: new EventEmitter<boolean>(),
          onSelectedView: new EventEmitter<any>(),
          isThumbnails: false
        }
      })
    });
    private columns: Array<SlickGridColumn>;
    private cols = [
      {
        BindingName: 'Filename',
        TemplateName: 'Filename'
      },
      {
        BindingName: 'Title',
        TemplateName: 'Title'
      },
      {
        BindingName: 'CreatedBy',
        TemplateName: 'Added By'
      },
      {
        BindingName: 'Created',
        TemplateName: 'Added On'
      },
      {
        BindingName: 'Download',
        TemplateName: ''
      },
      {
        BindingName: 'PreviewFiles',
        TemplateName: ''
      }
    ]
    constructor(private cdr: ChangeDetectorRef,
                private detailService: DetailService,
                public injector: Injector) {
    }
    ngAfterViewInit() {
        if (this.config.elem && !this.config.elem._config._isHidden) {
            this.selectAttachments();
        }
    }
    selectAttachments() {
        let dType = null;
        switch (this.config.typeDetailsLocal) {
            case 'version_details':
              dType = this.config.file['ITEM_TYPE'];
              break;
            case 'media_details':
              dType = '4000';
              break;
            case 'carrier_details':
              dType = '4001';
              break;
            default:
                console.log('ERROR: unknown detail type.');
        }
        this.slickGridComp.provider.setDefaultColumns(this.fillColumns(), this.columns.map(function(el){return el.field;}), true);
        this.detailService.getDetailAttachments(dType, this.config.file['ID'])
            .subscribe((res: Array<MediaDetailAttachmentsResponse>) => {
              let idx = 0;
              res.forEach(el => {
                el.$id = idx++;
              });
              (<AttachmentsSlickGridProvider>this.slickGridComp.provider).buildPageByResponseData(res);
              this.cdr.detectChanges();
            });

    };
    public loadComponentData() {
        if (!this.compIsLoaded) {
           this.selectAttachments();
        }
    }
    private fillColumns() {
      this.columns = [];
      let idx = 0;
      this.cols.forEach(el => {
        let colDef = <SlickGridColumn>{
          id: (<number>idx++),
          name: el.TemplateName,
          field: el.BindingName,
          width: 150,
          resizable: true,
          sortable: true,
          multiColumnSort: true
        };
        if (el.BindingName == 'Download') {
          colDef.formatter = DownloadFormatter;
          colDef.__deps = {
            componentFactoryResolver: this.compFactoryResolver,
              appRef: this.appRef,
              injector: this.injector
          }
        }
        else if (el.BindingName == 'PreviewFiles') {
          colDef.formatter = PreviewFilesFormatter;
          colDef.__deps = {
            componentFactoryResolver: this.compFactoryResolver,
            appRef: this.appRef,
            injector: this.injector
          }
        }

        this.columns.push(colDef);
      });
      return this.columns;
    }
}
