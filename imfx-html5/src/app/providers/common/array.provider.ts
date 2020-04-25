/**
 * Created by Sergey Trizna on 17.12.2016.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class ArrayProvider {
    /**
     * Merge arrays
     * @param arr1
     * @param arr2
     * @param paramOpts
     * @returns {any[]}
     */
    public merge(arr1: Array<any> = [], arr2: Array<any> = [], paramOpts: {unique?: boolean, sort?: boolean}): Array<any> {
        let res = arr1.concat(arr2);
        let defOpts = {unique: false, sort: false};
        let opts = Object.assign({}, defOpts, paramOpts);
        if (opts.sort == true) {
            res = res.sort(function (a, b) {
                return a > b ? 1 : a < b ? -1 : 0;
            });
        }

        if (opts.unique == true) {
            return res.filter(function (item, index) {
                return res.indexOf(item) === index;
            });
        }

        return res;
    }

    /**
     * Sort array of objects
     */
    public sortByField(array: Array<any>, field: string, order: string = 'asc'): Array<any> {
        return array.sort((a, b) => a[field] < b[field] ? order == 'asc' ? -1 : 1 : order == 'asc' ? 1 : -1);
    }


    /**
     * Search in array
     * @param array
     * @param val
     * @returns {boolean}
     */
    public inArray(array: Array<any> = [], val: any): boolean {
        return !!array.filter(x => x == val)[0]
    }

    /**
     * Return index of array by property value
     * @param val
     * @param arr
     * @param prop
     * @returns {null}
     */
    getIndexArrayByProperty(val, arr, prop) {
        let index = null;
        $.each(arr, (k, o) => {
            if (o && o[prop] == val) {
                index = k;
                return false;
            }
        });

        return index;
    }



        /**
     * Move in array
     * @param array
     * @param from
     * @param to
     * @returns {any}
     */
    public move(array, from, to) {
        if( to === from ) return array;

        var target = array[from];
        var increment = to < from ? -1 : 1;

        for(var k = from; k != to; k += increment){
            array[k] = array[k + increment];
        }
        array[to] = target;

        return array;
    }

}