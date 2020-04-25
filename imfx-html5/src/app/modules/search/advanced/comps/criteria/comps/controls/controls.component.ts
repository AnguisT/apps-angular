/**
 * Created by Sergey Trizna on 09.12.2016.
 */
import {ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation} from "@angular/core";
import {IMFXAdvancedCriteriaControlTextBoxComponent} from "./comps/container/comps/textbox/textbox.component.ts";
import {
    AdvancedSearchControlRefType,
    AdvancedSearchDataForControlType,
    AdvancedSearchEditorTypes
} from "../../../../types";
import {IMFXAdvancedCriteriaControlsContainerComponent} from "./comps/container/controls.container.component";
import {IMFXAdvancedCriteriaControlCheckBoxComponent} from "./comps/container/comps/checkbox/checkbox.component";
import {IMFXAdvancedCriteriaControlNumberBoxComponent} from "./comps/container/comps/numberbox/numberbox.component";
import {IMFXAdvancedCriteriaControlComboMultiComponent} from "./comps/container/comps/combomulti/combomulti.component";
import {IMFXAdvancedCriteriaControlComboSingleComponent} from "./comps/container/comps/combosingle/combosingle.component";
import {IMFXAdvancedCriteriaControlSignedDateTimeComponent} from "./comps/container/comps/signeddatetime/signeddatetime.component";
import {IMFXAdvancedCriteriaControlLookupSearchUsersModalComponent} from "./comps/container/comps/lookupsearch/users.modal/lookup.users.modal.comp";
import {IMFXAdvancedCriteriaControlXMLComponent} from "./comps/container/comps/xml/xml.component";
import {IMFXAdvancedCriteriaControlHierarchicalLookupSearchLocationModalComponent} from "./comps/container/comps/hierarchical/location/location.modal.comp";
import {IMFXAdvancedCriteriaControlHierarchicalLookupSearchTaxonomyModalComponent} from "./comps/container/comps/lookupsearch/taxonomy/taxonomy.modal.comp";
@Component({
    selector: 'advanced-criteria-controls',
    templateUrl: './tpl/index.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class IMFXAdvancedCriteriaControlsComponent {
    @ViewChild('advancedCriteriaControlContainer') containerRef: IMFXAdvancedCriteriaControlsContainerComponent

    setControl(searchEditorType: AdvancedSearchEditorTypes, data: AdvancedSearchDataForControlType): void {
        if (this[searchEditorType]) {
            this.containerRef.initControl(this[searchEditorType](data));
        } else {
            console.warn(searchEditorType, ' not found in list of available controls');
        }
    }

    // controls
    CheckBox(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlCheckBoxComponent,
            inputs: {
                data: data
            }
        };
    }

    TextBoxLike(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlTextBoxComponent,
            inputs: {
                data: data
            }
        };
    }

    TextBox(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlTextBoxComponent,
            inputs: {
                data: data
            }
        };
    }

    NumberBox(data: AdvancedSearchDataForControlType) {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlNumberBoxComponent,
            inputs: {
                data: data
            }
        };
    }

    TextBoxCtx(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlTextBoxComponent,
            inputs: {
                data: data
            }
        };
    }

    TextBoxCtxId(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlTextBoxComponent,
            inputs: {
                data: data
            }
        };
    }

    ComboMulti(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlComboMultiComponent,
            inputs: {
                data: data
            }
        };
    }

    PickerMulti(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlComboMultiComponent,
            inputs: {
                data: data
            }
        };
    }

    ComboSingle(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlComboSingleComponent,
            inputs: {
                data: data
            }
        };
    }

    PickerSingle(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlComboSingleComponent,
            inputs: {
                data: data
            }
        };
    }

    SignedDateTime(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlSignedDateTimeComponent,
            inputs: {
                data: data
            }
        };
    }


    Calendar(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        return <AdvancedSearchControlRefType>{
            component: IMFXAdvancedCriteriaControlSignedDateTimeComponent,
            inputs: {
                data: data
            }
        };
    }


    LookupSearch(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        let compData: AdvancedSearchControlRefType;
        switch (data.field.Name) {
            case "CREATED_BY":
                compData = <AdvancedSearchControlRefType>{
                    // component: IMFXAdvancedCriteriaControlLookupSearchUsersComponent, // select
                    component: IMFXAdvancedCriteriaControlLookupSearchUsersModalComponent, // modal
                    inputs: {
                        data: data
                    }
                };
                break;
            case "SCHEMAIDx": // Custom Metadata
                compData = <AdvancedSearchControlRefType>{
                    component: IMFXAdvancedCriteriaControlXMLComponent,
                    inputs: {
                        data: data
                    }
                };
                break;
            case "SCHEMAID": // XML Schema
                compData = <AdvancedSearchControlRefType>{
                    component: IMFXAdvancedCriteriaControlXMLComponent,
                    inputs: {
                        data: data
                    }
                };
                break;
            case "TAXONOMY_ID": // Taxonomy
                compData = <AdvancedSearchControlRefType>{
                    component: IMFXAdvancedCriteriaControlHierarchicalLookupSearchTaxonomyModalComponent,
                    inputs: {
                        data: data
                    }
                };
                break;
            default:
                compData = this.TextBox(data);
                console.warn('LookupSearch!', data);
                break;
        }

        return compData;
    }


    HierarchicalLookupSearch(data: AdvancedSearchDataForControlType): AdvancedSearchControlRefType {
        let compData: AdvancedSearchControlRefType;
        switch (data.field.Name) {
            case "LOCATION":
                compData = {
                    component: IMFXAdvancedCriteriaControlHierarchicalLookupSearchLocationModalComponent,
                    inputs: {
                        data: data
                    }
                };
                break;

            default:
                compData = this.TextBox(data);
                console.warn('HierarchicalLookupSearch!', data);
                break;
        }

        return compData;
    }
}
