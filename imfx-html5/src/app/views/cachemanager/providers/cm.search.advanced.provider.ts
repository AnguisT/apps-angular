import {SearchAdvancedProvider} from "../../../modules/search/advanced/providers/search.advanced.provider";
import {AdvancedSearchGroupRef} from "../../../modules/search/advanced/types";
import {Observable} from "rxjs/Observable";

export class CMSearchAdvancedProvider extends SearchAdvancedProvider {
    getStructure(): Observable<AdvancedSearchGroupRef[]> {
        return Observable.create((observer) => {
            // let data: Array<AdvancedSearchGroupRef> = [
            //     {
            //         id: 0,
            //         mode: 'builder',
            //         criterias: [
            //             {
            //                 selectedField: 'EVENT_ID',
            //                 selectedOperator: '=',
            //                 value: {value: '1'}
            //             },
            //         ]
            //     }
            // ];


            let data = [
                {
                    id: 0,
                    mode: 'builder',
                    criterias: [
                        {
                            "selectedField": "IS_READY",
                            "selectedOperator": "=",
                            "value": {"value": false}
                        },
                        {
                            "selectedField": "IS_MISSING",
                            "selectedOperator": "=",
                            "value": {"value": true}
                        },
                        {
                            "selectedField": "TX_TIME",
                            "selectedOperator": ">=",
                            "value": {
                                "dirtyValue": (new Date()).getTime(),
                                "options": {
                                    'modeAbs': true,
                                    'withTime': false
                                }
                            }
                        }
                    ]
                }
            ];

            observer.next(data);
        });
    }
}
