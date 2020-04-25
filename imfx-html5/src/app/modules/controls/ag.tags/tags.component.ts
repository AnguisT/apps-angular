import {Component, ViewChild, ViewEncapsulation} from "@angular/core";
import {AgRendererComponent} from "ag-grid-ng2/main";
import {DetailService} from "../../search/detail/services/detail.service";
import {Select2ListTypes} from "../select2/types";
import {TaxonomyService} from "../../search/taxonomy/services/service";

@Component({
  selector: 'tags-component',
  templateUrl: 'tpl/index.html',
  styleUrls: [
    'styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [TaxonomyService]
})
export class AgTagsComponent implements AgRendererComponent {
  private params: any;
  private tags: any;
  private text: any;
  private gridOptions: any;
  private editable: boolean;
  @ViewChild('select') private select;
  private defSelect2Tags: Select2ListTypes = [];
  private select2Tags: Select2ListTypes = [];

  constructor(private taxonomyService: TaxonomyService) {
  }

  // called on init
  agInit(params: any): void {
    this.select2Tags = [];
    this.params = params;
    this.tags = params.data.Tags;
    this.editable = params.data.tagsEditable;
    this.text = '';
    this.gridOptions = params.api;
    // TODO ANGRY HACK with debounce
    setTimeout(() => {
      if(this.editable){
        this.taxonomyService.getTaxonomy().subscribe((res: any) => {
          let tags = this.taxonomyService.getLowerLevelValuesOfTaxonomy(res);
          this.defSelect2Tags = this.select.turnArrayOfObjectToStandart(tags, {
            key: 'ID',
            text: 'Name',
          });
          $.each(this.defSelect2Tags, (k, tag) => {
            if (this.tags.indexOf(tag.text) == -1) {
              this.select2Tags.push(tag);
            }
          });

          this.select.setData(this.select2Tags, true);
        })
      }
    });
  }

  // called when the cell is refreshed
  refresh(params: any): void {
    this.params = params;
    this.tags = params.data.Tags;
    this.editable = params.data.tagsEditable;
    this.text = '';
    this.gridOptions = params.api;
    if(this.editable) {
      this.select2Tags = [];
      $.each(this.defSelect2Tags, (k, tag) => {
        if (this.tags.indexOf(tag.text) == -1) {
          this.select2Tags.push(tag);
        }
      });
      this.select.setData(this.select2Tags, true);
    }
  }

  deleteTag(ind) {
    this.tags.splice(ind, 1);
    this.params.context.componentParent.removeTag(this.text);
    this.select2Tags = [];
    $.each(this.defSelect2Tags, (k, tag) => {
      if (this.tags.indexOf(tag.text) == -1) {
        this.select2Tags.push(tag);
      }
    });
    this.select.setData(this.select2Tags, true);
    this.gridOptions.resetRowHeights();
  }

  onSelect() {
    let id = this.select.getSelectedId();
    let text = this.select.getSelectedTextByIdForSingle(id);
    if (this.tags.indexOf(text) == -1) {
      this.params.context.componentParent.addTag(text);
      this.removeTagFromSelect(id);
      this.gridOptions.resetRowHeights();
    } else {
      this.select.clearSelected();
    }
  }

  onKeyPress($event): void {
    switch ($event.which) {
      case 13: {// enter
        if (this.text != '') {
          this.params.context.componentParent.addTag(this.text);
          this.gridOptions.resetRowHeights();
          this.text = '';
        }
        break;
      }
      default: {
        break;
      }
    }
    $event.currentTarget.focus();
  }

  private removeTagFromSelect(id) {
    this.select.removeDataById(id);
    this.select2Tags = this.select.getData();
  }
}

