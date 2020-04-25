/**
 * Created by Sergey Trizna on 27.04.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PDFViewerModule} from '../../../../modules/viewers/pdf';
import {DOCXViewerModule} from '../../../../modules/viewers/docx';
import {CodePrettifyViewerModule} from '../../../../modules/viewers/codeprettify';
import {ViewersDemoComponent} from './viewers';
import {RouterModule} from "@angular/router";
import { appRouter } from '../../../../constants/appRouter';

export const routes = [
    {path: appRouter.empty, component: ViewersDemoComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        ViewersDemoComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        PDFViewerModule,
        DOCXViewerModule,
        CodePrettifyViewerModule
    ],
    exports: [
        ViewersDemoComponent
    ],
    entryComponents: [
    ]
})
export default class ViewersDemoModule {
    static routes = routes;
}
