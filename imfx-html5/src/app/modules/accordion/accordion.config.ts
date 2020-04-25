/**
 * Created by Sergey Trizna on 23.03.2017.
 */
import {AccordionServiceInterface} from './services/accordion.service';
import {AccordionProviderInterface} from './providers/accordion.provider';
import {EventEmitter} from "@angular/core";
import {LoggerData} from "../../views/system/config/comps/global.settings/comps/logger/global.settings.logger.component";
import {SilverlightProvider} from "../../providers/common/silverlight.provider";
export class AccordionOptions {
    service?: AccordionServiceInterface;
    provider?: AccordionProviderInterface;

    /**
     * Any data
     */
    data?: any;

    /**
     * Selected row in accordion
     * @type {number}
     */
    selectedRow?: number;
  
    /**
     * Selected row in accordion
     * @type {number}
     */
    refreshEmitter?: any;
  
    silverlightpPovider?: any;
}
export class AccordionConfig {
    /**
     * Context of top component
     */
    public componentContext?: any;
    public options: AccordionOptions = {
        service: <AccordionServiceInterface>null,
        provider: <AccordionProviderInterface>null,
        silverlightpPovider: <SilverlightProvider>null,
        data: null,
        refreshEmitter: null,
        selectedRow: 0
    };
}
