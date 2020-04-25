/**
 * Created by Sergey Klimenko on 08.03.2017.
 */
import {SearchSettingsServiceInterface} from './services/search.settings.service';
import {SearchSettingsProvider} from './providers/search.settings.provider';

export class SearchSettingsSettings {
    // /**
    //  * Service for working moduke
    //  */
    service?: any;
    //
    // /**
    //  * Provider for working with module
    //  */
    provider?: any;

}

export class SearchSettingsConfig {
    /**
     * Context of top component
     */
    public componentContext: any;

    /**
     * Model of settings
     * @type {{}}
     */
    public options: SearchSettingsSettings = {};
}
