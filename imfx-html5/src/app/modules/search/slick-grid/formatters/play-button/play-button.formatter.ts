import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {
    SlickGridButtonFormatterEventData, SlickGridColumn, SlickGridFormatterData, SlickGridRowData,
    SlickGridTreeRowData
} from "../../types";
import {commonFormatter} from "../common.formatter";
import {SlickGridProvider} from "../../providers/slick.grid.provider";

@Component({
    selector: 'play-button-formatter-comp',
    templateUrl: './tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class PlayButtonFormatterComp {
    @ViewChild('buttonControl') private buttonControl: ElementRef;
    @ViewChild('buttonControlWrap') private buttonControlWrap: ElementRef;
    private params: SlickGridFormatterData;
    private column: SlickGridColumn;
    public injectedData: { data: SlickGridFormatterData };
    private provider: SlickGridProvider;
    private stateActivity: boolean = false;
    private showLikeButton: boolean = false;
    private playable: boolean = false;
    private isVideo: boolean = false;
    private isRelatedAudio: boolean = false;
    constructor(private injector: Injector, private cdr: ChangeDetectorRef) {
        this.injectedData = this.injector.get('data');
        this.params = this.injectedData.data;
        this.column = (<any>this.injectedData).data.columnDef;
        this.provider = this.column.__contexts.provider;
        this.isRelatedAudio = (<any>this.params.columnDef).isRelatedAudio || false;
    }

    ngOnInit() {
        if (this.params.data && this.params.data['PROXY_URL'] && this.params.data['PROXY_URL'].length > 0 && this.params.data['PROXY_URL'].match(/^(http|https):\/\//g) && this.params.data['PROXY_URL'].match(/^(http|https):\/\//g).length > 0) {
            this.playable = true;
        }
        if (!this.isRelatedAudio) {
            let uA = window.navigator.userAgent,
                isIE = /msie\s|trident\/|edge\//i.test(uA);
            if (this.params.data && this.params.data['MEDIA_FORMAT_text'] == 'WEBM' && isIE) {
                this.playable = false;
            }

            if (this.params.data && (this.params.data['MediaTypeOriginal'] === 100 || this.params.data['MediaTypeOriginal'] === 150)) {
                this.isVideo = true;
            }
        }
    }

    ngAfterViewInit() {
        $(this.buttonControlWrap.nativeElement).parent().parent().addClass('skipSelection');

        // this.provider.formatterPlayButtonOnDeactive.subscribe()
        // this.stateActivity = this.params.data.id == this.provider.formatterPlayButtonActiveId;
    }

    onClick($event) {
        this.stateActivity = !this.stateActivity;
        if (this.provider.formatterPlayButtonActiveId == this.params.data.id) {
            this.provider.formatterPlayButtonActiveId = 'none';
            this.stateActivity = false;
        } else {
            this.provider.formatterPlayButtonActiveId = this.params.data.id;
        }

        this.provider.formatterPlayButtonOnClick.emit({data: this.params, value: this.provider.formatterPlayButtonActiveId != 'none'});
    }
}
export function PlayButtonFormatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridTreeRowData | SlickGridRowData) {
    return commonFormatter(PlayButtonFormatterComp, {
        rowNumber: rowNumber,
        cellNumber: cellNumber,
        value: value,
        columnDef: columnDef,
        data: dataContext
    });
}


