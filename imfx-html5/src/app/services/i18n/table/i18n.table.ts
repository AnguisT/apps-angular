/**
 * Created by initr on 28.11.2016.
 */
import {Injectable, EventEmitter} from '@angular/core';
import {HttpService} from '../http/http.service';
import {Cookie} from 'ng2-cookies';
import {Observable} from 'rxjs';
import {Response} from '@angular/http';
import {TranslateService, LangChangeEvent} from 'ng2-translate';

/**
 * Service for translates table
 */
@Injectable()
export class I18NTable {
    private traslateKey = 'ng2_components.ag_grid';
    private localeText;
    public onTranslate: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService) {
        this.localeText = {
            // for filter panel
            page: 'page',
            more: 'more',
            to: 'to',
            of: 'of',
            next: 'next',
            last: 'last',
            first: 'first',
            previous: 'prev',
            loadingOoo: 'Loading...',
            // for set filter
            selectAll: 'Select all',
            searchOoo: 'Search...',
            blanks: 'blank...',
            // for number filter and text filter
            filterOoo: 'Filter...',
            applyFilter: 'Apply Filter...',
            // for number filter
            equals: 'Equals',
            lessThan: 'Less Than',
            greaterThan: 'Greater Than',
            // for text filter
            contains: 'Contains',
            startsWith: 'Starts with',
            endsWith: 'Ends with',
            // the header of the default group column
            group: 'Group',
            // tool panel
            columns: 'Columns',
            rowGroupColumns: 'Pivot Cols',
            rowGroupColumnsEmptyMessage: 'Please drag cols to group',
            valueColumns: 'Value Cols',
            pivotMode: 'Pivot Mode',
            groups: 'Groups',
            values: 'Values',
            pivots: 'Pivots',
            valueColumnsEmptyMessage: 'Drag cols to aggregate',
            pivotColumnsEmptyMessage: 'Drag here to pivot',
            // other
            noRowsToShow: 'No Results',
            // enterprise menu
            pinColumn: 'Pin Column',
            valueAggregation: 'Value Agg',
            autosizeThiscolumn: 'Autosize This column',
            autosizeAllColumns: 'Autosize All Columns',
            groupBy: 'Group by',
            ungroupBy: 'UnGroup by',
            resetColumns: 'Reset Those Cols',
            expandAll: 'Open-em-up',
            collapseAll: 'Close-em-up',
            toolPanel: 'Tool Panelo',
            // enterprise menu pinning
            pinLeft: 'Pin <<',
            pinRight: 'Pin >>',
            noPin: 'DontPin <>',
            // enterprise menu aggregation and status panel
            sum: 'Sum',
            min: 'Min',
            max: 'Max',
            none: 'None',
            count: 'Count',
            average: 'Average',
            // standard menu
            copy: 'Copy',
            ctrlC: 'ctrl n C',
            paste: 'Paste',
            ctrlV: 'ctrl n V'
        };
    }


    public getTranslate() {
        let translates = {};
        let keys = Object.keys(this.localeText);
        keys.forEach((key: any) => {
            let defaultValue = this.localeText[key];
            let fullKey = this.traslateKey + '.' + key;
            this.translate.get(fullKey).subscribe((res: string) => {
                if(res === fullKey){
                    translates[key] = defaultValue
                } else {
                    translates[key] = res;
                }

            });
        });

        return translates;
    }
}


