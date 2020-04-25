import {InfoModalServiceInterface} from './services/info.modal.service';
import {InfoModalProviderInterface} from './providers/info.modal.provider';

export class InfoModalSettings {
  /**
   * Service for working module
   */
    service?: InfoModalServiceInterface;

  /**
   * Provider for working with module
   */
    provider?: InfoModalProviderInterface;
    /*
    *
    */
    bodyText?: String;
    /*
    *
    */
    headerText?: String;
    /*
    *
    */
    cancel?: boolean;
    /*
    *
    */
    ok?: boolean;
    /*
    * Alert flag
    */
    showAlert?: boolean;
    /*
    * Alert text
    */
    response?: any;
}

export class InfoModalConfig {
  /**
   * Context of top component
   */
    public componentContext: any;
    /**
     * Context of module
     */
    public moduleContext?: any;

  /**
   * Model of settings
   * @type {{}}
   */
    public options: InfoModalSettings = {};
}
