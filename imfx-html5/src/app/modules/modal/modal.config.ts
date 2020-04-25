/**
 * Created by Sergey Trizna on 15.03.2017.
 */
import { ModalServiceInterface } from './services/modal.service';
import { ModalProviderInterface } from './providers/modal.provider';

/**
 * Common settings for modal
 */
export class ModalSettings {
    /**
     * Service for working module
     */
    service?: ModalServiceInterface;

    /**
     * Provider for working with module
     */
    provider?: ModalProviderInterface;

    /**
     * Setup for modal
     */
    modal?: {
        type?: 'error'|'success'|'blank'|'custom'|'confirm',
        title?: string|{name: string, data: {}},
        size?: 'lg'|'md'|'sm'|'xs',
        backdrop?: boolean|'static',
        ignoreBackdropClick?: boolean,
        keyboard?: boolean,
        show?: boolean,
        classes?: string,
        overflow?: 'auto'|'hidden'|'visible',
        top?: string,
        transform?: string,
        isFooter?: boolean,
        isHeader?: boolean,
        // width?: string,
        height?: string,
        max_height?: string,
        // minWidth?: string,
        // minHeight?: string
    };
    /**
     * Setup for custom modal
     */
    content?: {
        view: any,
        options?: {
            service?: any,
            provider?: any,
        }
    };


}

export class ModalConfig {
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
    public options: ModalSettings = {};
}
