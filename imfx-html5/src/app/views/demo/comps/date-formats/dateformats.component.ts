import {Component, ViewChild} from '@angular/core';
import {TranslateService, LangChangeEvent} from 'ng2-translate';
import * as $ from "jquery";

@Component({
    selector: 'demo-date-formats',
    templateUrl: './tpl/index.html',
})

export class DateFormatsComponent {
    private currentDate = new Date();
    @ViewChild('controlaSasasdasd') private control: any;

    constructor(private translate: TranslateService) {
    }

    ngAfterViewInit() {
        let _this = this;
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            _this.control.reinitPlugin();
        });
    }
}
