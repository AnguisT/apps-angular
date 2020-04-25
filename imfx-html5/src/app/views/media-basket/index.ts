import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';



// imfx modules
import {TranslateModule} from 'ng2-translate';
import {IMFXXMLTreeModule} from '../../modules/controls/xml.tree';

// ng2 components
import {MediaBasketComponent} from "./media.basket.component";
import {MediaBasketItemComponent} from "./components/media.basket.item/media.basket.item.component";

//---------
import {ThumbColumnModule} from '../../modules/search/grid/comps/columns/thumb/index';
import {IMFXControlsSelect2Module} from "../../modules/controls/select2/index";
import { appRouter } from '../../constants/appRouter';

console.log('`MediaBasketComponent` bundle loaded asynchronously');
// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: MediaBasketComponent, routerPath: appRouter.media_basket, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        MediaBasketComponent,
        MediaBasketItemComponent
    ],
    imports: [
        TranslateModule,
        IMFXXMLTreeModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        ThumbColumnModule,
        IMFXControlsSelect2Module
    ]
})
export default class ProfileModule {
    static routes = routes;
}
