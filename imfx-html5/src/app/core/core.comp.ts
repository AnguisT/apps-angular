/**
 * Created by Sergey Trizna on 27.11.2017.
 */
import {CoreConfig, CoreConfigOptions, CoreProviderConfig} from "./core.config";
import {EventEmitter, Injector, Input, Output, setTestabilityGetter} from "@angular/core";
import {CoreService} from "./core.service";
import {CoreProvider} from "./core.provider";
import {AppSettings} from "../modules/common/app.settings/app.settings";
import {SlickGridFormatterData} from "../modules/search/slick-grid/types";
import {BaseProvider} from "../views/base/providers/base.provider";

export class CoreComp {
    // config
    protected readonly setups: CoreConfig;

    private _isModuleReady: boolean = false;
    public get isModuleReady(): boolean {
        return this._isModuleReady
    }
    onModuleReady:EventEmitter<void> = new EventEmitter<void>();
    @Input('config') set config(_config: CoreConfig) {
        // config for component
        let compConfig: CoreConfig = $.extend(true, {}, this.setups, _config);
        compConfig.options = <CoreConfigOptions>$.extend(true, {}, this.setups.options, _config.options);
        compConfig.options.parentConfig = compConfig;
        // provider
        if (_config.providerType) {
            let provider: CoreProvider = this.injector.get(_config.providerType);
            compConfig.provider = provider;
        }

        // service
        if (_config.serviceType) {
            let service: CoreService = this.injector.get(_config.serviceType);
            compConfig.service = service;
        }

        if (_config.appSettingsType) {
            let appSettings: AppSettings = this.injector.get(_config.appSettingsType);
            compConfig.appSettings = appSettings;
        }

        if (compConfig.options.module) {
            compConfig.options.module.parentConfig = compConfig;
        }

        if (compConfig.options.plugin) {
            compConfig.options.plugin.parentConfig = compConfig;
        }


        // moduleContext
        compConfig.moduleContext = this;


        // set config for provider
        if (compConfig.provider) {
            compConfig.provider.config = <CoreProviderConfig>{
                moduleContext: compConfig.moduleContext,
                componentContext: compConfig.componentContext,
                service: compConfig.service,
                options: compConfig.options,
                appSettings: compConfig.appSettings
            };
        }

        // magic
        Object.defineProperty(this, 'config', {
            get: (): typeof compConfig => {
                return compConfig
            },
        });

        Object.defineProperty(this, 'componentContext', {
            get: (): typeof compConfig.componentContext => {
                return compConfig.componentContext
            },
        });

        Object.defineProperty(this, 'provider', {
            get: (): typeof compConfig.provider => {
                return compConfig.provider
            },
        });
        //
        Object.defineProperty(this, 'service', {
            get: (): typeof compConfig.service => {
                return compConfig.service
            },
        });

        Object.defineProperty(this, 'appSettings', {
            get: (): typeof compConfig.appSettings => {
                return compConfig.appSettings
            },
        });

        this._isModuleReady = true;
        this.onModuleReady.emit();
        // setTimeout(() => {
        //
        // })
        // new Promise((resolve, reject) => {
        //     resolve();
        // }).then(
        //     () => {
        //
        //     },
        //     (err) => {
        //         console.log(err);
        //     }
        // );

    }


    constructor(protected injector: Injector) {
    }
}
