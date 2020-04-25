/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {GridProvider} from '../../../modules/search/grid/providers/grid.provider';

export class WorkflowGridProvider extends GridProvider {

    delete($event, rowData) {
        console.log('delete', rowData);
    }

}
