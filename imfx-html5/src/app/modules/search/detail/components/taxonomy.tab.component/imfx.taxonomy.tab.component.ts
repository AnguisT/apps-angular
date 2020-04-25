import {Component, Injectable, ViewChild, ViewEncapsulation} from "@angular/core";
import {IMFXControlsTreeComponent} from "../../../../controls/tree/imfx.tree";
import {IMFXControlsLookupsSelect2Component} from "../../../../controls/select2/imfx.select2.lookups";
import {TaxonomyService} from "../../../taxonomy/services/service";
import {TaxonomyType} from "../../../taxonomy/types";
import {Select2ListTypes} from "../../../../controls/select2/types";

@Component({
    selector: 'imfx-taxonomy-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
@Injectable()
export class IMFXTaxonomyComponent {
    @ViewChild('tree') private tree: IMFXControlsTreeComponent;
    @ViewChild('select') private select: IMFXControlsLookupsSelect2Component;
    config: any;
    // private filterText: string;

    constructor(private taxonomyService: TaxonomyService) {
    }

    ngAfterViewInit() {
        this.getTaxonomy();
    }

    getTaxonomy() {
        this.taxonomyService.getTaxonomy().subscribe((res: Array<TaxonomyType>) => {
            let lowerLevelValues = this.taxonomyService.getLowerLevelValuesOfTaxonomy(res);
            let lowerLevelValuesS2: Select2ListTypes = this.select.turnArrayOfObjectToStandart(lowerLevelValues, {
                key: 'ID',
                text: 'Name',
            });
            this.select.setData(lowerLevelValuesS2, true);
            let normData = this.tree.turnArrayOfObjectToStandart(res, {
                key: 'Id',
                title: 'Name',
                children: 'Children'
            });
            this.tree.setSource(normData);
            this.tree.expandAll();
        });
    };

    onDblClickByTreeItem($event) {
        this.config.elem.emit('addTag', {tagText: $event.data.node.title});
    };

    // searchKeyUp() {
    //     if (this.filterText === '') {
    //         this.tree.clearFilter();
    //     }
    //     else {
    //         this.tree.filter(this.filterText);
    //     }
    // };

    onSelect() {
        let txt = this.select.getSelectedText();
        if (txt && txt[0]) {
            this.tree.filter((<string>txt[0]));
        }
    }

    onUnselect() {
        this.tree.clearFilter();
    }
}
