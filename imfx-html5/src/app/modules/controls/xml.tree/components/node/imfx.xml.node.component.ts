/**
 * Created by Pavel on 17.01.2017.
 */
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ViewChild, ChangeDetectorRef, Renderer, Inject, ViewContainerRef
} from '@angular/core';

// Loading jQuery
import * as $ from 'jquery';

import { SchemaItemTypes } from '../../schema.item.types/schema.item.types';
import { IMFXControlsDateTimePickerComponent } from '../../../datetimepicker/imfx.datetimepicker';
import { IMFXXMLNode } from '../../model/imfx.xml.node';
import { AbstractOverride } from '../../overrides/abstract.override';
import { ITreeNode } from 'angular-tree-component/dist/defs/api';
import { MultilineTextProvider } from '../modals/multiline.text/multiline.text.provider';
import { IMFXModalComponent } from '../../../../imfx-modal/imfx-modal';
import { IMFXModalProvider } from '../../../../imfx-modal/proivders/provider';
import { MultilineTextComponent } from '../modals/multiline.text/multiline.text.component';


declare var window: any;
@Component({
  selector: 'imfx-xml-tree-node',
  entryComponents: [
    IMFXControlsDateTimePickerComponent,
  ],
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class IMFXXMLNodeComponent {
  @ViewChild('selectEnumItems') private dropdownModuleEnum: any;
  @ViewChild('selectChoice') private dropdownModuleChoice: any;
  @Input('node') private node: ITreeNode;
  @Input('debug') private debug: any = false;
  @Input('readonly') private readonly: any = false;
  @Input('overrides') private overrides: AbstractOverride[];
  @Output('onUpdate') private updateTreeEmitter = new EventEmitter();
  private modal: IMFXModalComponent;
  private xmlNode: IMFXXMLNode;
  private data: any;
  private schemaItemTypes = new SchemaItemTypes();
  private selectedChoice: any;
  private changeFromXMLEditorEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef,
              private multilineTextProvider: MultilineTextProvider,
              private modalProvider: IMFXModalProvider) {

  }

  ngOnInit() {
    this.xmlNode = this.node.data.xml;
    if (!this.xmlNode.Parent) {
      this.node.expand();
    }
    if(this.xmlNode.Schema.SchemaItemType === this.schemaItemTypes.Boolean) {
      this.xmlNode.Value = this.xmlNode.Value == 'true' ? true : this.xmlNode.Value == 'false' ? false : this.xmlNode.Value;
    }
    this.changeFromXMLEditorEmitter.subscribe((res) => {
        this.xmlNode.Value = res;
    });
  }

  ngOnDestroy() {
    this.changeFromXMLEditorEmitter.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.xmlNode.Schema) {
      if (this.xmlNode.Schema.SchemaItemType === this.schemaItemTypes.Enumeration) {
        this.xmlNode.EnumValue = {
          Id: this.xmlNode.Value
        };
        this.selectEnumValue();
        this.selectEnumeration();
      }
      else if(this.xmlNode.Schema.SchemaItemType === this.schemaItemTypes.Choice) {
          //(<any>this.xmlNode).ChoiceItems = this.xmlNode.Schema.Children;
      }
    } else if (!this.xmlNode.Schema) {
      this.selectChoiceItem();
    }
  }

  isMinusAvailable() {
    return !this.readonly && this.xmlNode.isRemovable();
  }

  isPlusAvailable() {
    return !this.readonly && this.xmlNode.newChildNodesAvailable();
  }

  addChild(manual: boolean) {
    this.xmlNode.addChild(manual);
    this.updateTree(this.node);
    this.node.expand();
  }

  removeNode () {
    // if choice is xml root and if is not
    if (this.xmlNode.SelectedChoice || this.xmlNode.ChoiceParent) {
        debugger;
      this.xmlNode.removeChoice();
    } else {
      this.xmlNode.remove();
    }
    this.updateTree(this.node.parent.data.virtual ? this.node : this.node.parent);
  }

  updateTree (node: ITreeNode) {
    this.updateTreeEmitter.emit({
      node: node,
      xml: node.data.xml
    });
  }

  selectNodeType() {
    this.xmlNode.selectNodeType({
      fromNodeTypeSelector: true
    });
    this.updateTree(this.node.parent);
  }

  onChoiceChange(xmlNode) {
    // this.updateTree(this.node.parent);
    this.updateTree(this.node.parent.data.virtual ? this.node : this.node.parent);
    // debugger;
  }

  onChangeValue(event) {
    let data = event.target.value;
    let empty = '';
    let str = data.trim();
    let value = str.replace(/\s+/g, ' ');
    if (value !== empty) {
      this.xmlNode.Value = value;
    } else {
      this.xmlNode.Value = null;
    }
  }

  onSelectValue(date) {
    if (date !== null) {
      this.xmlNode.Value = date.toISOString();
    }
  }

  selectEnumValue() {
    this.xmlNode.Value = this.xmlNode.EnumValue.Id;
  }

  selectEnumeration() {
    if (this.xmlNode.EnumItems.length > 0) {
      let enumItems = this.xmlNode.EnumItems;
      let data = this.dropdownModuleEnum.turnArrayOfObjectToStandart(enumItems, {
        key: 'Id',
        text: 'Value'
      });
      if ( data.filter(el => el.id === 0).length > 1 ) { // if all Ids == 0
        data.forEach(function (el, idx) {
          el.id = el.text;
        });
      }
      if ( this.xmlNode.Value ) {
        data.forEach((el, idx) => {
          if (el.text === this.xmlNode.Value) {
            this.xmlNode.EnumValue = {text: this.xmlNode.Value};
            this.xmlNode.EnumValue.Id = typeof this.xmlNode.Value == 'string' ? this.xmlNode.Value : idx;
            this.selectEnumValue();
            this.cdr.detectChanges();
          }
        });
      }
      this.cdr.detectChanges();
      this.dropdownModuleEnum.setData(data, true);
    }
  }

  onSelectEnum(event) {
    this.xmlNode.EnumValue = event.params.data;
    this.xmlNode.EnumValue.Id = this.xmlNode.EnumValue.id;
    this.selectEnumValue();
  }

  selectChoiceItem() {
    if (this.xmlNode.Parent.AvailableChildren) {
      let enumItems = this.xmlNode.Parent.AvailableChildren;
      let data = this.dropdownModuleChoice.turnArrayOfObjectToStandart(enumItems, {
        key: 'Id',
        text: 'Name'
      });
      this.dropdownModuleChoice.setData(data, true);
    }
  }

  onSelectChoice(event) {
    let obj = this.xmlNode.Parent.AvailableChildren.filter(el => el.Id === event.params.data.id);
    this.xmlNode.Schema = obj[0];
    this.selectNodeType();
  }

  openMultilineModal() {
    this.modal = this.modalProvider.show(MultilineTextComponent, {
      size: 'md',
      title: this.xmlNode.DisplayName
    });

    let content = this.modal.contentView.instance;
    content.setXmlString(
      this.multilineTextProvider.formatXML(this.xmlNode.Value),
      this.xmlNode.DisplayName
    );
    content.toggleOverlay(true);

    this.modal.modalEvents.subscribe(() => {
      this.changeFromXMLEditorEmitter.emit(content.getXmlString());
      this.multilineTextProvider.modalIsOpen = false;
    });
  }

}
