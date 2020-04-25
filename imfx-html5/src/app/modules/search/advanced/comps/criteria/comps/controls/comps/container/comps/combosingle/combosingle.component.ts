/**
 * Created by Sergey Trizna on 09.12.2016.
 */
import {ChangeDetectionStrategy, Component, Injector, ViewChild, ViewEncapsulation} from "@angular/core";
import {AdvancedSearchDataForControlType, AdvancedSearchDataFromControlType} from "../../../../../../../../types";
import {SearchAdvancedCriteriaProvider} from "../../../../../../providers/provider";
import {IMFXControlsLookupsSelect2Component} from "../../../../../../../../../../controls/select2/imfx.select2.lookups";
@Component({
    selector: 'advanced-criteria-control-combosingle',
    templateUrl: "tpl/index.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IMFXAdvancedCriteriaControlComboSingleComponent {
    @ViewChild('control') private control: IMFXControlsLookupsSelect2Component;
    public data: AdvancedSearchDataForControlType;

    constructor(private injector: Injector,
                private transfer: SearchAdvancedCriteriaProvider) {
        this.data = this.injector.get('data');
        this.transfer.onSelectedOperator.subscribe(() => {
            this.setFocus();
        })
    }

    ngAfterViewInit() {
        let value: AdvancedSearchDataFromControlType = this.data.criteria.data.value;
        if (value) {
            let dv = value.dirtyValue;
            if (!dv) {
                dv = [(<string>value.value)]
            }
            this.control.onReady.subscribe(() => {
                this.control.setSelectedByIds(dv);
                this.transferData();
            });
        } else {
            this.transferData();
        }
    }

    setFocus() {
        setTimeout(() => {
            this.control.setFocus();
        })
    }

    /**
     * Send data to parent comp
     */
    transferData() {
        let val = this.control.getSelected();
        if(val && val.length > 0) {
            this.transfer.onSelectValue(<AdvancedSearchDataFromControlType>{
                value: val,
                dirtyValue: val,
                humanValue: this.control.getSelectedText()[0]
            });
        }
    }
}
