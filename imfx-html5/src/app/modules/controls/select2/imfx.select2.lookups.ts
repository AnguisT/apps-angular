/**
 * Created by Sergey Trizna on 29.09.2017.
 */
import {IMFXControlsSelect2Component} from "./imfx.select2";
import {ArrayProvider} from "../../../providers/common/array.provider";
import {ChangeDetectionStrategy, Component, EventEmitter, Input, ViewEncapsulation, ChangeDetectorRef} from "@angular/core";
import {Select2ConvertObject, Select2ItemType} from "./types";
import {Guid} from "../../../utils/imfx.guid";
import {TranslateService} from "ng2-translate";
import {StringProivder} from "../../../providers/common/string.provider";
import {Router} from "@angular/router";
import {LookupService} from "../../../services/lookup/lookup.service";
import {LookupsTypes} from "../../../services/system.config/search.types";

@Component({
    selector: 'imfx-lookups-select2',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        ArrayProvider
    ]
})
export class IMFXControlsLookupsSelect2Component extends IMFXControlsSelect2Component {
    @Input('lookupType') private lookupType: LookupsTypes;
    @Input('dbField') private dbField: string;
    private disabled: boolean = false;
    public onReady: EventEmitter<void> = new EventEmitter<void>();
    public _serverResponse = [];

    constructor(protected arrayProvider: ArrayProvider,
                protected translate: TranslateService,
                protected stringProvider: StringProivder,
                protected router: Router,
                protected lookupService: LookupService,
                protected cdr: ChangeDetectorRef) {
        super(arrayProvider, translate, stringProvider, router, cdr);
    }

    ngAfterViewInit() {
        this.guid = Guid.newGuid();
        // start plugin after view init
        this.initPlugin();
        this.addCustomClass();
        this.disable();
        this.lookupService.getLookups(this.lookupType)
            .subscribe(
                (lookups: any) => {
                    this._serverResponse = lookups;
                    let rule: Select2ConvertObject = this.lookupService.getLookupRuleForConvertToSelect2Item(this.lookupType);
                    let items: Array<Select2ItemType> = this.turnObjectOfObjectToStandart(lookups, rule);
                    this.setData(items, true);
                    if ( !this.disabled ) {
                        this.enable();
                    }
                    setTimeout(() => {
                        this.onReady.emit();
                    })
                },
                (error: any) => {
                    console.error('Failed', error);
                }
            );

    }
    setDisabled(disabled) {
        this.disabled = disabled;
    }
    refresh() {
        if ( this.disabled ) {
            this.disable();
        }
        else {
            this.enable();
        }
    }
}
