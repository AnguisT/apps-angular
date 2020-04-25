/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { SearchAdvancedComponent } from './search.advanced';
import { BsDropdownModule } from 'ngx-bootstrap';
// import {ModalModule as ng2Modal} from 'ngx-bootstrap';
import { AngularSplitModule } from 'angular-split';
// IMFX modules
import { IMFXControlsSelect2Module } from '../../controls/select2';
import { IMFXControlsMultiselectModule } from '../../controls/multiselect';
import { IMFXControlsDateTimePickerModule } from '../../controls/datetimepicker';
import { IMFXControlsTreeModule } from '../../controls/tree';
import { IMFXControlsNumberboxModule } from '../../controls/numberbox';
import { IMFXXMLTreeModule } from '../../controls/xml.tree';
import { IMFXSearchSuggestionModule } from '../../controls/search.suggestion';
import { IMFXAccessControlModule } from '../../access';
import { ModalModule } from '../../modal';
// Advanced search
import {
    IMFXAdvancedCriteriaFieldBuilderComponent
} from './comps/criteria/comps/field/field.builder.comp.ts';
import {
    IMFXAdvancedCriteriaFieldExampleComponent
} from './comps/criteria/comps/field/field.example.comp.ts';
import {
    IMFXAdvancedCriteriaControlsComponent
} from './comps/criteria/comps/controls/controls.component.ts';
import { IMFXAdvancedCriteriaBuilderComponent } from './comps/criteria/criteria.builder.ts';
import { IMFXAdvancedCriteriaExampleComponent } from './comps/criteria/criteria.example.ts';
import { IMFXAdvancedGroupBuilderComponent } from './comps/group/group.builder.ts';
import { IMFXAdvancedGroupExampleComponent } from './comps/group/group.example.ts';
// Container
import {
    IMFXAdvancedCriteriaControlsContainerComponent
} from './comps/criteria/comps/controls/comps/container/controls.container.component.ts';
// Controls
import {
    IMFXAdvancedCriteriaControlCheckBoxComponent
} from './comps/criteria/comps/controls/comps/container/comps/checkbox/checkbox.component.ts';
import {
    IMFXAdvancedCriteriaControlNumberBoxComponent
} from './comps/criteria/comps/controls/comps/container/comps/numberbox/numberbox.component.ts';
import {
    IMFXAdvancedCriteriaControlTextBoxComponent
} from './comps/criteria/comps/controls/comps/container/comps/textbox/textbox.component.ts';
import {
    IMFXAdvancedCriteriaControlComboMultiComponent
} from './comps/criteria/comps/controls/comps/container/comps/combomulti/combomulti.component';
import {
    ComboSingleModule
} from './comps/criteria/comps/controls/comps/container/comps/combosingle';
import {
    IMFXAdvancedCriteriaControlSignedDateTimeComponent
} from './comps/criteria/comps/controls/comps/container/comps/signeddatetime/signeddatetime.component';
import {
    IMFXAdvancedCriteriaControlLookupSearchUsersComponent
} from './comps/criteria/comps/controls/comps/container/comps/lookupsearch/users/lookup.usres.comp';
import {
    IMFXAdvancedCriteriaControlLookupSearchUsersModalComponent
} from './comps/criteria/comps/controls/comps/container/comps/lookupsearch/users.modal/lookup.users.modal.comp';
import {
    IMFXAdvancedCriteriaControlHierarchicalLookupSearchLocationModalComponent
} from './comps/criteria/comps/controls/comps/container/comps/hierarchical/location/location.modal.comp';
import {
    IMFXAdvancedCriteriaControlXMLComponent
} from './comps/criteria/comps/controls/comps/container/comps/xml/xml.component';
import { XmlModule } from '../xml';
import { XMLComponent } from '../xml/xml';
import { UsersModule } from '../users';
import { UsersComponent } from '../users/users';
import { LocationModule } from '../location';
import { LocationComponent } from '../location/location';
// Pipes
import { KeysPipeModule } from '../../pipes/keysPipe/index';
import { OrderByModule } from '../../pipes/orderBy/index';
import { FilterPipeModule } from '../../pipes/filterPipe/index';
import { SearchSavedModule } from '../saved/index';
import { IMFXAdvancedCriteriaOperatorsComponent } from './comps/criteria/comps/operators/operators';
import {
    IMFXAdvancedCriteriaControlHierarchicalLookupSearchTaxonomyModalComponent
} from './comps/criteria/comps/controls/comps/container/comps/lookupsearch/taxonomy/taxonomy.modal.comp';
import { TaxonomyModule } from '../taxonomy/index';


@NgModule({
    declarations: [
        SearchAdvancedComponent,
        // Adv
        IMFXAdvancedCriteriaFieldBuilderComponent,
        IMFXAdvancedCriteriaFieldExampleComponent,
        IMFXAdvancedCriteriaControlsComponent,
        IMFXAdvancedCriteriaOperatorsComponent,
        IMFXAdvancedGroupBuilderComponent,
        IMFXAdvancedGroupExampleComponent,
        IMFXAdvancedCriteriaBuilderComponent,
        IMFXAdvancedCriteriaExampleComponent,
        IMFXAdvancedCriteriaControlsContainerComponent,

        // Controls
        IMFXAdvancedCriteriaControlCheckBoxComponent,
        IMFXAdvancedCriteriaControlTextBoxComponent,
        IMFXAdvancedCriteriaControlComboMultiComponent,
        IMFXAdvancedCriteriaControlNumberBoxComponent,
        IMFXAdvancedCriteriaControlSignedDateTimeComponent,
        IMFXAdvancedCriteriaControlLookupSearchUsersComponent,
        IMFXAdvancedCriteriaControlLookupSearchUsersModalComponent,
        IMFXAdvancedCriteriaControlHierarchicalLookupSearchLocationModalComponent,
        IMFXAdvancedCriteriaControlXMLComponent,
        IMFXAdvancedCriteriaControlHierarchicalLookupSearchTaxonomyModalComponent

    ],
    imports: [
        TranslateModule,
        CommonModule,
        BsDropdownModule,
        ModalModule,
        AngularSplitModule,

        // IMFX Modules
        IMFXControlsSelect2Module,
        IMFXControlsMultiselectModule,
        IMFXControlsDateTimePickerModule,
        IMFXControlsTreeModule,
        IMFXControlsNumberboxModule,
        IMFXXMLTreeModule,
        IMFXSearchSuggestionModule,
        IMFXAccessControlModule,
        XmlModule,
        UsersModule,
        LocationModule,
        ComboSingleModule,
        SearchSavedModule,
        TaxonomyModule,

        // Pipes
        KeysPipeModule,
        OrderByModule,
        FilterPipeModule,
    ],
    exports: [
        SearchAdvancedComponent,
        // Adv
        IMFXAdvancedCriteriaFieldBuilderComponent,
        IMFXAdvancedCriteriaFieldExampleComponent,
        IMFXAdvancedCriteriaControlsComponent,
        IMFXAdvancedCriteriaOperatorsComponent,
        IMFXAdvancedGroupBuilderComponent,
        IMFXAdvancedGroupExampleComponent,
        IMFXAdvancedCriteriaBuilderComponent,
        IMFXAdvancedCriteriaExampleComponent,
        IMFXAdvancedCriteriaControlsContainerComponent,

        // Controls
        IMFXAdvancedCriteriaControlCheckBoxComponent,
        IMFXAdvancedCriteriaControlTextBoxComponent,
        IMFXAdvancedCriteriaControlComboMultiComponent,
        IMFXAdvancedCriteriaControlNumberBoxComponent,
        IMFXAdvancedCriteriaControlSignedDateTimeComponent,
        IMFXAdvancedCriteriaControlLookupSearchUsersComponent,
        IMFXAdvancedCriteriaControlLookupSearchUsersModalComponent,
        IMFXAdvancedCriteriaControlHierarchicalLookupSearchLocationModalComponent,
        IMFXAdvancedCriteriaControlXMLComponent,
        IMFXAdvancedCriteriaControlHierarchicalLookupSearchTaxonomyModalComponent
    ],
    entryComponents: [
        XMLComponent,
        IMFXAdvancedCriteriaControlXMLComponent,
        UsersComponent,
        IMFXAdvancedCriteriaControlLookupSearchUsersModalComponent,
        LocationComponent,
        IMFXAdvancedCriteriaControlHierarchicalLookupSearchLocationModalComponent,
        IMFXAdvancedCriteriaControlHierarchicalLookupSearchTaxonomyModalComponent
    ]
})
export class SearchAdvancedModule {
}
