/**
 * Created by Sergey Trizna on 27.09.2017.
 */
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {
    AdvancedFieldType,
    AdvancedModeTypes,
    AdvancedPointerCriteriaType,
    AdvancedSearchDataForControlType,
    AdvancedSearchSettingsCommonData,
    AdvancedStructureCriteriaType
} from "../../types";
import {Select2ItemType} from "../../../../controls/select2/types";
import {IMFXAdvancedCriteriaOperatorsComponent} from "./comps/operators/operators";
import {IMFXAdvancedCriteriaControlsComponent} from "./comps/controls/controls.component";
import {SearchAdvancedCriteriaProvider} from "./providers/provider";
import {IMFXAdvancedCriteriaComponent} from "./criteria";

@Component({
    selector: 'advanced-criteria-builder',
    templateUrl: 'tpl/builder.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SearchAdvancedCriteriaProvider,
    ]

})
export class IMFXAdvancedCriteriaBuilderComponent extends IMFXAdvancedCriteriaComponent {
    @ViewChild('advancedCriteriaOperatorsModule') operatorsRef: IMFXAdvancedCriteriaOperatorsComponent; // operators
    @ViewChild('advancedCriteriaControlModule') controlRef: IMFXAdvancedCriteriaControlsComponent; // control
    @Output() onRemoveCriteria: EventEmitter<AdvancedPointerCriteriaType> = new EventEmitter<AdvancedPointerCriteriaType>();
    @Input() criteria: AdvancedStructureCriteriaType; // criteria data
    @Input() mode: AdvancedModeTypes;
    @Input() common: AdvancedSearchSettingsCommonData;
    @Input() groupId: number;

    constructor(protected transfer: SearchAdvancedCriteriaProvider) {
        super(transfer);
    }

    /**
     * On select field
     * @param data
     */
    onSelectField(data: {
        fieldProp: AdvancedFieldType,
        isManually: boolean
    }): void {
        // set pointer
        if (!this.transfer.getPointer()) {
            let pointer: AdvancedPointerCriteriaType = <AdvancedPointerCriteriaType>{
                groupId: this.groupId,
                criteriaId: this.criteria.id,
                mode: this.mode
            };
            this.transfer.setPointer(pointer);
        }
        let selectedOperatorId: number = 0;
        if (data.isManually == false) {
            selectedOperatorId = (<number>this.criteria.data.operator.id);
        } else {
            delete this.criteria.data.operator;
            delete this.criteria.data.value;
            this.criteria.data.field = data.fieldProp;
        }

        // search editor
        let searchEditorType = this.criteria.data.field.SearchEditorType;

        // set operators and selected
        this.operatorsRef.setOperators(this.common.operators[searchEditorType], selectedOperatorId);

        // set controls
        this.controlRef.setControl(searchEditorType, <AdvancedSearchDataForControlType> {
            field: data.fieldProp,
            mode: this.mode,
            criteria: this.criteria
        });
    }

    /**
     * On select operator
     * @param operator
     */
    onSelectOperator(operator: Select2ItemType) {
    }

    /**
     * Remove criteria
     */
    public removeCriteria(): void {
        this.onRemoveCriteria.emit(<AdvancedPointerCriteriaType>{
            groupId: this.groupId,
            criteriaId: this.criteria.id,
            mode: this.mode
        });
    }
}
