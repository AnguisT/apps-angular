/**
 * Created by Sergey Trizna on 15.03.2017.
 */
import {Injectable} from '@angular/core';
import {RecentInterfaceModel} from './recent.interface';
import {SearchModel} from '../../grid/models/search/search';

@Injectable()
export class RecentModel implements RecentInterfaceModel {
    /**
     * Search model
     */
    private searchModel: SearchModel;

    /**
     * total count result of search by search model
     */
    private total: number;

    /**
     * Beauty string of parameters for show it at recent search block
     */
    private beautyString: string;

    /**
     * Return beauty string of search criterias
     * @returns {string}
     */
    toBeautyString(): string {
        let bs = this.searchModel.toBeautyString() + ': ' + this.getTotal();
        this.setBeautyString(bs);
        return bs
    }

    /**
     * Set search model to recent model
     * @param searchModel
     */
    setSearchModel(searchModel: SearchModel): void {
        this.searchModel = searchModel;
    }

    /**
     * Get search model
     * @returns {SearchModel}
     */
    getSearchModel(): SearchModel {
        return this.searchModel;
    }

    /**
     * Get total
     * @returns {number}
     */
    getTotal(): number {
        return this.total;
    }

    /**
     * Set total
     * @param total
     */
    setTotal(total: number) {
        this.total = total < 0 ? 0 : total;
    }

    /**
     * Set beautyString
     * @returns {string}
     */
    getBeautyString(): string {
        return this.beautyString;
    }

    /**
     * Get beautyString
     * @param beautyString
     */
    setBeautyString(beautyString: string) {
        this.beautyString = beautyString;
    }

    /**
     * Fill value of beutyString
     */
    fillBeautyString():void {
        this.setBeautyString(this.toBeautyString()) ;
    }
}