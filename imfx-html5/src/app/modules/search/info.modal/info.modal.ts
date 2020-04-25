import {Component, ViewEncapsulation, Input, Inject, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {InfoModalConfig} from './info.modal.config';
import {InfoModalProvider, InfoModalProviderInterface} from './providers/info.modal.provider';
import {InfoModalService, InfoModalServiceInterface} from './services/info.modal.service';

import {ModalProvider} from '../../modal/providers/modal.provider';

import {TranslateService, LangChangeEvent} from 'ng2-translate';

import * as $ from 'jquery';

@Component({
    selector: 'info-modal',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.Default,
    providers: [
        InfoModalProvider,
        InfoModalService
    ]
})
export class InfoModalComponent {
    private config = <InfoModalConfig>{
        componentContext: <any>null,
        moduleContext: this,
        options: {
            provider: <InfoModalProviderInterface>null,
            service: <InfoModalServiceInterface>null,
            bodyText: <String>null,
            headerText: <String>null,
            cancel: <boolean>true,
            ok: <boolean>true,
            showAlert: <boolean>false,
            response: null
        }
    };

    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    constructor(@Inject(InfoModalService) protected service: InfoModalService,
                @Inject(InfoModalProvider) protected provider: InfoModalProvider,
                private translate: TranslateService,
                private modalProvider: ModalProvider) {
    }

    ngAfterViewInit() {
        // Set default provider/services if custom is null
        !this.config.options.provider ?
            this.config.options.provider = this.provider :
            this.provider = this.config.options.provider;
        !this.config.options.service ?
            this.config.options.service = this.service :
            this.service = this.config.options.service;
        this.provider.config = this.config;

        // On show modal dialog
        this.provider.onShowModal.subscribe(
            (config: any) => {
                this.showModal(config);
            }
        );
    }

    private showModal(config): void {
        this.config.options = Object.assign(this.config.options, config);
        if (!config.responce || !config.responce.Error) {
            this.translate.get(config.bodyText).subscribe(
                (res: string) => {
                    this.config.options.bodyText = res;
                });
            this.showSuccessAlert();
        }
        else {
            /*this.translate.get("common.information").subscribe(
             (res: string) => {
             this.config.options.headerText = res;
             });*/
            this.config.options.bodyText = config.response.Error;
            this.showErrorModal(this.config.options.bodyText);
        }
    };

    private showSuccessAlert(): void {
        this.config.options.provider.showSuccessAlert();
    };

    private showErrorModal(errorText): void {
        this.config.options.provider.showErrorModal(errorText);
    };
}
