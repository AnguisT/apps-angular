/**
 * Created by Sergey Trizna on 13.01.2017.
 */
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from "ng2-translate";

// comps
import {SystemConfigXmlComponent} from './xml.component';

// IMFX modules
import {IMFXControlsTreeModule} from 'app/modules/controls/tree';
import {IMFXXMLTreeModule} from "../../../../../modules/controls/xml.tree/index";
import {IMFXSimpleTreeModule} from "../../../../../modules/controls/simple.tree/index";
import {IMFXSchemaTreeComponent} from "./components/schema.tree/schema.tree.component";
import {OverlayModule} from "../../../../../modules/overlay/index";

console.log('`SystemConfigXmlComponent` bundle loaded asynchronously');
// async components must be named routes for WebpackAsyncRoute
// export const routes = [
    // {path: '', component: SystemConfigXmlComponent, routerPath: 'system/config/xml', pathMatch: 'full'}
// ];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SystemConfigXmlComponent,
        IMFXSchemaTreeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        OverlayModule,
        // RouterModule.forChild(routes),
        IMFXXMLTreeModule,
        IMFXSimpleTreeModule
    ],
    exports: [
      SystemConfigXmlComponent
    ]
})
export default class SystemConfigXmlModule {
    // static routes = routes;
}
