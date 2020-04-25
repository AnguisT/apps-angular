import {Component, EventEmitter, Injectable, Inject, Output, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import { LocatorsProvider } from '../../../../modules/controls/locators/providers/locators.provider';
import { LocatorsService } from '../../../../modules/controls/locators/services/locators.service';

@Component({
    selector: 'imfx-ce-locators',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [LocatorsService]
})
@Injectable()
export class CELocatorsComponent {
    @Output() onSaveMediaTagging: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSelectLocatorTab: EventEmitter<any> = new EventEmitter<any>();

    active: string;
    // blackDetectedConfig: any;
    locatorTabConfig = {
        blackdetect: null,
        comments: null,
        legal: null,
        cuts: null,
    };
    config: any;

    constructor(private provider: LocatorsProvider,
                private service: LocatorsService,
                private cd: ChangeDetectorRef) {
    };

    ngOnInit() {
      !this.config.options.provider ?
        this.config.options.provider = this.provider :
        this.provider = this.config.options.provider;

      !this.config.options.service ?
        this.config.options.service = this.service :
        this.service = this.config.options.service;
      for (let e in this.locatorTabConfig) {
          this.locatorTabConfig[e] = {
              tagType: e,
              columns: e.toLocaleLowerCase() == 'blackdetect' ? this.config.blackDetectedColumns : this.config.commentsColumns,
              file: this.config.file,
              series: this.config.series ? this.config.series.filter(function (el) {
                  return el.TagType.toLocaleLowerCase() == e.toLocaleLowerCase();
              }) : [],
              elem: this.config.elem,
              componentContext: this.config.componentContext,
              locatorsComponent: this,
              hasOuterFilter: false
          };
      }
      this.provider.config = this.config;
    };

    selectTab(active) {
        this.active = active;
        let mc = this.locatorTabConfig[this.active.toLocaleLowerCase()].moduleContext;
        mc && mc.unselectRow();
        this.onSelectLocatorTab.emit();
        this.config.elem.emit('clearMarkers', true);
    }
    refresh(o) {
        for (let e in this.locatorTabConfig) {
            this.locatorTabConfig[e] = {
                tagType: e,
                columns: e.toLocaleLowerCase() == 'blackdetect' ? this.config.blackDetectedColumns : this.config.commentsColumns,
                file: o.file,
                series: o.series.filter(function (el) {
                    return el.TagType.toLocaleLowerCase() == e.toLocaleLowerCase();
                }),
                elem: this.config.elem,
                componentContext: this.config.componentContext,
                locatorsComponent: this,
                hasOuterFilter: false
            };
        }
        this.cd.detectChanges();
        this.onSelectLocatorTab.emit({series:  o.series});
    }
}
