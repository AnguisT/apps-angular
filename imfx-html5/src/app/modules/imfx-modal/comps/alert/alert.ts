/**
 * Created by Sergey Trizna on 30.03.2017.
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Injector,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {IMFXModalComponent} from "../../imfx-modal";
import {TranslateService} from "ng2-translate";

@Component({
    selector: 'modal-alert-content',
    templateUrl: './tpl/index.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../../styles/index.scss']
})
export class IMFXModalAlertComponent {
    private title: string;
    private text: string;
    private modalRef: IMFXModalComponent;

    constructor(private injector: Injector,
                private cdr: ChangeDetectorRef,
                private translate: TranslateService) {
        this.modalRef = this.injector.get('modalRef');
    }

    setTitle(title: string) {
        this.title = this.translate.instant(title);
        this.cdr.detectChanges();
    }

    setText(text: string, textParams?: Object) {
        this.text = this.translate.instant(text, textParams);
        this.cdr.detectChanges();
    }
}
