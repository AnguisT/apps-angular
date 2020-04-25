import {
    Inject,
  Component, ComponentFactoryResolver, ViewContainerRef,
  HostListener, ElementRef, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, Injectable, Compiler,
  EventEmitter
} from '@angular/core';
import * as $ from "jquery";
import {SplashProvider} from '../../../providers/design/splash.provider';
import {LocalStorageService} from 'ng2-webstorage';
import {SessionStorageService} from 'ng2-webstorage';
import {TranslateService} from 'ng2-translate';

//import {SplashProvider} from '../../providers/design/splash.provider';
import {IMFXAccordionComponent} from '../../../modules/search/detail/components/accordion.component/imfx.accordion.component';
import {IMFXVersionsTabComponent} from '../../../modules/search/detail/components/versions.tab.component/imfx.versions.tab.component';
import {IMFXNotesTabComponent} from '../../../modules/search/detail/components/notes.tab.component/imfx.notes.tab.component';
/*import {IMFXHtmlPlayerComponent} from '../../modules/controls/html.player/imfx.html.player';
import {IMFXSilverlightPlayerComponent} from "../../modules/controls/silverlight.player/imfx.silverlight.player";
import {IMFXDefaultTabComponent} from '../../modules/search/detail/components/default.tab.component/imfx.default.tab.component';

import {IMFXImageComponent} from '../../modules/search/detail/components/image.component/imfx.image.component';
import {IMFXMediaTaggingTabComponent} from '../../modules/search/detail/components/media.tagging.tab.component/imfx.media.tagging.tab.component';
*/

import 'style-loader!golden-layout/src/css/default-theme.css';
import 'style-loader!golden-layout/src/css/goldenlayout-base.css';
import 'style-loader!golden-layout/src/css/goldenlayout-light-theme.css';
import 'script-loader!golden-layout/lib/jquery.js';
import 'script-loader!golden-layout/dist/goldenlayout.js';

/*import {IMFXTimelineComponent} from "../../modules/controls/timeline/imfx.timeline";
import {TimelineConfig} from "../../modules/controls/timeline/timeline.config";
import {IMFXVideoInfoComponent} from "../../modules/search/detail/components/video.info.component/video.info.component";*/

import {GLComponent} from '../../../modules/search/detail/gl.component';

import {GoldenConfig} from '../../../modules/search/detail//detail.config';

declare var GoldenLayout: any;

@Component({
    selector: 'golden-titles-layout',
    changeDetection: ChangeDetectionStrategy.Default,
    template: '<div class="gl-layout" id="layout"></div>',
    encapsulation: ViewEncapsulation.None,
    entryComponents: [
        IMFXAccordionComponent,
        IMFXVersionsTabComponent,
        IMFXNotesTabComponent,
    ]
})

export class GLTitlesComponent extends GLComponent {
    constructor(@Inject(ElementRef) protected el: ElementRef,
                @Inject(ViewContainerRef) protected viewContainer: ViewContainerRef,
                @Inject(ComponentFactoryResolver) protected componentFactoryResolver: ComponentFactoryResolver,
                @Inject(LocalStorageService) protected storageService: LocalStorageService,
                @Inject(ChangeDetectorRef) protected cd: ChangeDetectorRef,
                @Inject(TranslateService) protected translate: TranslateService,
                @Inject(SplashProvider) protected splashProvider: SplashProvider) {
        super(el, viewContainer, componentFactoryResolver, storageService, cd, translate, splashProvider);
      }
    setView() {
        this.layout = new GoldenLayout(this.layoutConfig, $(this.el.nativeElement).find("#layout"));
        var self = this;

        this.layout.registerComponent('Data', (container, componentState) => {
            let fullKey = this.config.options.typeDetailsLocal + '.data';
            this.translate.get(fullKey).subscribe(
                 (res: string) => {
                     container._config.title = res;
                 });
            let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXAccordionComponent);
            let compRef = this.viewContainer.createComponent(factory);
            compRef.instance['file'] = self.config.options.file;
            compRef.instance['groups'] = self.config.options.groups;
            compRef.instance['friendlyNames'] = self.config.options.friendlyNames;
            container.getElement().append($(compRef.location.nativeElement));
            container["compRef"] = compRef;
            compRef.changeDetectorRef.detectChanges();
        });

        this.layout.registerComponent('Notes', (container, componentState) => {
            let tabComponent = self.selectTabComponent(container._config);
            let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXNotesTabComponent);
            let compRef = this.viewContainer.createComponent(factory);
            container.getElement().append($(compRef.location.nativeElement));
            container["compRef"] = compRef;
            compRef.instance['config'] = {
                file: self.config.options.file,
            };
            compRef.changeDetectorRef.detectChanges();
        });

        this.layout.on('stateChanged', function () {
            var state = JSON.stringify(self.layout.toConfig());
            self.storageService.store(self.storagePrefix, state);
        });

        this.layout.init();

        this.layout.root.getItemsByFilter(function (el) {
            return el.type == "stack" && el.contentItems.length == 0
        }).forEach(function (elem) {
            elem.remove();
        });

        this.layout.on("itemDestroyed", item => {
            if (item.container != null) {
                let compRef = item.container["compRef"];
                if (compRef != null) {
                    compRef.destroy();
                }
            }
        });
    }
}
