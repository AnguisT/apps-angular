/**
 * Created by Sergey Trizna on 09.03.2017.
 */
export interface SearchInterfaceModel {
    /**
     * Return params of crits as string
     */
    toRequest(): any;

    /**
     * Is valid params of request
     */
    isValid(): boolean;
}