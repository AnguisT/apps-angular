import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injector,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {TranslateService} from "ng2-translate";
import {IMFXMLTreeComponent} from "../../../../../../controls/xml.tree/imfx.xml.tree";
import {OverlayComponent} from "../../../../../../overlay/overlay";

@Component({
    selector: 'xml-modal',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class XMLModalComponent {
    @ViewChild('xmlTree') public xmlTree: IMFXMLTreeComponent;
    @ViewChild('overlayXML') public overlayXML: OverlayComponent;
    public data: any;

    constructor(private injector: Injector,
                private cdr: ChangeDetectorRef,
                private translate: TranslateService) {
        this.data = this.injector.get('data');
    }

    ngAfterViewInit() {
    }
    private showOverlay = false;
    toggleOverlay(show) {
      this.showOverlay = show;
      this.cdr.markForCheck();
    }
}
