import {SearchAdvancedCriteriaProvider} from "./providers/provider";
import {
    AdvancedModeTypes,
    AdvancedPointerCriteriaType,
    AdvancedSearchDataCriteriaReturnType,
    AdvancedSearchSettingsCommonData,
    AdvancedStructureCriteriaType
} from "../../types";
import {EventEmitter, Input, Output} from "@angular/core";


export class IMFXAdvancedCriteriaComponent {
    @Output() onRemoveCriteria: EventEmitter<AdvancedPointerCriteriaType> = new EventEmitter<AdvancedPointerCriteriaType>();
    @Output() onUpdateCriteria: EventEmitter<AdvancedSearchDataCriteriaReturnType> = new EventEmitter<AdvancedSearchDataCriteriaReturnType>();
    @Input() criteria: AdvancedStructureCriteriaType; // criteria data
    @Input() mode: AdvancedModeTypes;
    @Input() common: AdvancedSearchSettingsCommonData;
    @Input() groupId: number;

    constructor(protected transfer: SearchAdvancedCriteriaProvider) {
        this.transfer.onUpdate.subscribe((data: AdvancedSearchDataCriteriaReturnType) => {
            if (this.transfer.getPointer()) {
                this.onUpdateCriteria.emit(data);
            }
        });
    }
}
