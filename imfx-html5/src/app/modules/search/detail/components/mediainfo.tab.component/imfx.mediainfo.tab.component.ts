import {
    ChangeDetectionStrategy, Component, ElementRef, Injectable, ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {IMFXControlsLookupsSelect2Component} from "../../../../controls/select2/imfx.select2.lookups";
export type DetailMediaInfoType = {
    AGE_CERTIFICATION: number,
    AGE_CERTIFICATION_text: string,
    TV_STD: number,
    TV_STD_text: string,
    ASPECT_R_ID: number,
    ASPECT_R_ID_text: string,
    USAGE_TYPE: number,
    USAGE_TYPE_text: string
    AFD_ID: number,
    AFD_ID_text: string,
    ITEM_TYPE: number,
    ITEM_TYPE_text: string,
    DESCRIPTION: string,
    MEDIA_FORMAT: number
    MEDIA_FORMAT_text: string
}
@Component({
    selector: 'imfx-media-info-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class IMFXMediaInfoComponent {
    @ViewChild('control_DESCRIPTION') control_DESCRIPTION: ElementRef;
    @ViewChild('control_AFD_ID') public control_AFD_ID: IMFXControlsLookupsSelect2Component;
    @ViewChild('control_ASPECT_R_ID') public control_ASPECT_R_ID: IMFXControlsLookupsSelect2Component;
    @ViewChild('control_MEDIA_FORMAT') public control_MEDIA_FORMAT: IMFXControlsLookupsSelect2Component;
    @ViewChild('control_USAGE_TYPE') public control_USAGE_TYPE: IMFXControlsLookupsSelect2Component;
    @ViewChild('control_ITEM_TYPE') public control_ITEM_TYPE: IMFXControlsLookupsSelect2Component;
    @ViewChild('control_TV_STD') public control_TV_STD: IMFXControlsLookupsSelect2Component;
    @ViewChild('control_AGE_CERTIFICATION') public control_AGE_CERTIFICATION: IMFXControlsLookupsSelect2Component;
    config: any;
    readOnly: boolean = false;
    private model: DetailMediaInfoType;

    constructor() {}

    ngOnInit() {}

    ngAfterViewInit() {
        new Promise((resolve, reject) => {
            resolve();
        }).then(
            () => {
                this.model = this.fillModel(this.config);
                this.fillForm(this.model)
            },
        (err) => {
                console.log(err);
            }
        );
    }

    onUpdateControl(field) {
        this.model[field] = this['control_' + field].getSelected();
        this.model[field + '_text'] = this['control_' + field].getSelectedText()[0];
        this['control_' + field].checkValidation(this.model[field]);
    }

    onChangeNotes($event) {
        this.model.DESCRIPTION = $.trim(this.control_DESCRIPTION.nativeElement.value);
    }

    refresh(config, readOnly?: boolean) {
        if (readOnly != null) {
            this.readOnly = readOnly;
        }
        this.config = config;
        this.model = this.fillModel(this.config);
        this.fillForm(this.model);
    }

    fillForm(model: DetailMediaInfoType) {
        let keys: string[] = Object.keys(model);
        keys = keys.filter((key) => {
            return key.substr(-4) !== 'text';
        });
        $.each(keys, (k, v) => {
            let control: IMFXControlsLookupsSelect2Component|ElementRef = this['control_' + v];
            if (v == 'DESCRIPTION') {
                $((<ElementRef>control).nativeElement).text(model[v]);
                if (this.readOnly) {
                    $((<ElementRef>control).nativeElement).attr('disabled', 'disabled');
                } else {
                    $((<ElementRef>control).nativeElement).removeAttr('disabled');
                }
            } else {
                (<IMFXControlsLookupsSelect2Component>control).onReady.subscribe(() => {
                    (<IMFXControlsLookupsSelect2Component>control).setSelectedByIds([model[v]]);
                    (<IMFXControlsLookupsSelect2Component>control).setDisabled(this.readOnly);
                });
                (<IMFXControlsLookupsSelect2Component>control).setSelectedByIds([model[v]]);
                (<IMFXControlsLookupsSelect2Component>control).setDisabled(this.readOnly);
                (<IMFXControlsLookupsSelect2Component>control).refresh();
            }
        });
    }

    fillModel(config): DetailMediaInfoType {
        let m: DetailMediaInfoType = {
            AGE_CERTIFICATION: config.AGE_CERTIFICATION,
            AGE_CERTIFICATION_text: config.AGE_CERTIFICATION_text,
            TV_STD: config.TV_STD,
            TV_STD_text: config.TV_STD_text,
            ASPECT_R_ID: config.ASPECT_R_ID,
            ASPECT_R_ID_text: config.ASPECT_R_ID_text,
            USAGE_TYPE: config.USAGE_TYPE,
            USAGE_TYPE_text: config.USAGE_TYPE_text,
            AFD_ID: config.AFD_ID,
            AFD_ID_text: config.AFD_ID_text,
            ITEM_TYPE: config.ITEM_TYPE,
            ITEM_TYPE_text: config.ITEM_TYPE_text,
            MEDIA_FORMAT: config.M_CTNR_FMT_ID,
            MEDIA_FORMAT_text: config.MEDIA_FORMAT_text,
            DESCRIPTION: config.DESCRIPTION
        };

        return m;
    }
    getValidation() {
        let keys: string[] = Object.keys(this.model);
        let isValid = true;
        keys = keys.filter((key) => {
            return key.substr(-4) !== 'text';
        });
        $.each(keys, (k, v) => {
            let control: IMFXControlsLookupsSelect2Component|ElementRef = this['control_' + v];
            if (v == 'DESCRIPTION') {

            } else {
                isValid = (<IMFXControlsLookupsSelect2Component>control).getValidation();
                if (!isValid) {
                    return false;
                }
            }
        });
        return isValid;
    }

    save() {
      this.config.AGE_CERTIFICATION = this.model.AGE_CERTIFICATION;
      this.config.AGE_CERTIFICATION_text = this.model.AGE_CERTIFICATION_text;
      this.config.TV_STD = this.model.TV_STD;
      this.config.TV_STD_text = this.model.TV_STD_text;
      this.config.ASPECT_R_ID = this.model.ASPECT_R_ID;
      this.config.ASPECT_R_ID_text = this.model.ASPECT_R_ID_text;
      this.config.USAGE_TYPE = this.model.USAGE_TYPE;
      this.config.USAGE_TYPE_text = this.model.USAGE_TYPE_text;
      this.config.AFD_ID = this.model.AFD_ID;
      this.config.AFD_ID_text = this.model.AFD_ID_text;
      this.config.ITEM_TYPE = this.model.ITEM_TYPE;
      this.config.ITEM_TYPE_text = this.model.ITEM_TYPE_text;
      this.config.M_CTNR_FMT_ID = this.model.MEDIA_FORMAT;
      this.config.MEDIA_FORMAT_text = this.model.MEDIA_FORMAT_text;
      this.config.DESCRIPTION = this.model.DESCRIPTION;
      return this.config;
    }
}
