/**
 * Created by Sergey Trizna on 30.03.2017.
 */
import {Component, Injector, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';

@Component({
    selector: 'modal-warning-content',
    templateUrl: './tpl/content.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../styles/index.scss']
})
export class ModalWarningContentComponent {
    private text: string;
    private translatedString: string;
    data: any;

    constructor(private injector: Injector,
                private cdr: ChangeDetectorRef) {
        this.data = this.injector.get('data');
    }

    setText(text: string) {
        this.text = text;
        this.cdr.detectChanges();
    }

    setTranslatedString(translatedString: string) {
      this.translatedString = translatedString;
      this.cdr.detectChanges();
    }
}
