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
    selector: 'modal-prompt-content',
    templateUrl: './tpl/index.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../../styles/index.scss']
})
export class IMFXModalPromptComponent {
    @ViewChild('promptInput') promptInputRef: ElementRef;
    private title: string;
    private label: string;
    private error: string;
    private placeholder: string = 'common.input_name';
    private modalRef: IMFXModalComponent;

    constructor(private injector: Injector,
                private cdr: ChangeDetectorRef,
                private translate: TranslateService) {
        this.modalRef = this.injector.get('modalRef');
    }

    setTitle(title: string) {
        this.title = title;
        this.cdr.detectChanges();
    }

    setLabel(label: string) {
        this.label = label;
        this.cdr.detectChanges();
    }

    setError(error: string) {
        this.error = this.translate.instant(error);
        this.cdr.detectChanges();
    }

    setPlaceholder(placeholder: string) {
        this.placeholder = placeholder;
        this.cdr.detectChanges();
    }

    getValue() {
        return this.promptInputRef.nativeElement.value;
    }

    ok() {
        this.modalRef.modalEvents.emit({name: 'ok'})
    }
}
