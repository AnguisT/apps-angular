import {
  Component,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter,
} from '@angular/core';
import {Inject, Injectable} from '@angular/core';
import {AccordionComponent} from '../../../../modules/accordion/accordion'
import {AccordionProvider} from '../../../../modules/accordion/providers/accordion.provider';
import {AccordionService} from '../../../../modules/accordion/services/accordion.service';
import {MisrAccordionService} from './services/accordion.service';
import {AccordionConfig} from '../../../../modules/accordion/accordion.config';

import {Router} from '@angular/router';
import {MisrSearchService} from '../../../../services/viewsearch/misr.service';
import * as $ from 'jquery';
import { appRouter } from '../../../../constants/appRouter';

@Component({
    selector: 'misr-accordion',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        AccordionProvider,
        MisrAccordionService,
        AccordionService
    ]
})
@Injectable()
export class MisrAccordionComponent extends AccordionComponent{
    /**
     * Default config
     * @type {ViewsConfig}
     */
    config = <AccordionConfig>{
        componentContext: <any>null,
        options: {
            service: <AccordionService>null,
            provider: <AccordionProvider>null,
            selectedRow: 0,
            refreshEmitter: null
        },
    };

    /**
     * Extend default config
     * @param config
     */
    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    constructor(protected service: AccordionService,
               protected router: Router,
                protected provider: AccordionProvider) {
        super(service, provider);
    }

    private parentContainer = null;
    selectExpandedRow(rowIndex, remove) {
      rowIndex--;
      this.parentContainer = $(".ag-row[row='" + rowIndex + "']")
      if(remove) {
        this.parentContainer.removeClass("imfx-grid-row-expanded");
      } else {
        this.parentContainer.addClass("imfx-grid-row-expanded");
      }
    }

    ngOnDestroy() {
      this.selectExpandedRow(this.config.options.data.rowParams.rowIndex, true);
    }
    ngOnInit() {
      let self = this;
        // Set default provider/services if custom is null
        !this.config.options.provider ?
            this.config.options.provider = this.provider :
            this.provider = this.config.options.provider;

        !this.config.options.service ?
            this.config.options.service = this.service :
            this.service = this.config.options.service;
        this.provider.config = this.config;
    }

    public contentReady() {
        setTimeout(() => {
            this.config.options.provider.contentReadyEvent(), 0
        });
    }

    ngAfterViewInit() {
        let self = this;
        this.selectExpandedRow(this.config.options.data.rowParams.rowIndex, false);
        this.config.options.data.items[0].hideme = true;
        this.config.options.data.items[3].hideme = true;
        this.config.options.service.getMediaData(this.config.options.data.items[0].data.ID).subscribe(
          (res) => {
            self.config.options.data.items[0].props = res;
            self.contentReady();
          }
        );
        this.config.options.refreshEmitter.subscribe((res)=> {
          this.selectExpandedRow(self.config.options.data.rowParams.rowIndex, false);
        });
    }

    goToDetail(id, type) {
      if (type === 'Media Items')
        // this.router.navigate(['media/detail', id]);
        this.router.navigate(
            [
                appRouter.media.detail.substr(
                    0,
                    appRouter.media.detail.lastIndexOf('/')
                ),
                id
            ]
        );
    }

    selectRow(event) {
        $(".js-subrow").removeClass('selected-row');
        $(".js-subrow-header").removeClass('selected-row');
        $(event.currentTarget).addClass('selected-row');
    }
}
