/**
 * Created by Sergey Trizna on 09.12.2016.
 */
import {ChangeDetectionStrategy, Component, Injector, ViewChild, ViewEncapsulation} from "@angular/core";
import {AdvancedSearchDataFromControlType} from "../../../../../../../../types";
import {IMFXControlsNumberboxComponent} from "../../../../../../../../../../controls/numberbox/numberbox";
import {NumberBoxValues} from "./types";
import {SearchAdvancedCriteriaProvider} from "../../../../../../providers/provider";

@Component({
    selector: 'advanced-criteria-control-numberbox',
    templateUrl: "tpl/index.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class IMFXAdvancedCriteriaControlNumberBoxComponent {
    public data: any;
    @ViewChild('control') private control: IMFXControlsNumberboxComponent;

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
            let valueAsString = (<string>value.value);
            let valAsNumber = parseFloat(valueAsString);
            let dv = value.dirtyValue;
            if (!dv) {
                dv = <NumberBoxValues> {
                    valueAsString: valueAsString,
                    valueAsNumber: valAsNumber
                }
            }

            this.control.setValue(valAsNumber);
            this.transferData(dv);
            this.setFocus();
        }
    }

    setFocus() {
        setTimeout(() => {
            this.control.setFocus()
        })
    }

    transferData($event: NumberBoxValues) {
        this.transfer.onSelectValue(<AdvancedSearchDataFromControlType>{
            value: $event.valueAsNumber,
            dirtyValue: $event,
            humanValue: $event.valueAsString
        });
    }
}
