/**
 * Created by Pavel on 27.01.2017.
 */

import {IMFXXMLSchema} from "./imfx.xml.schema";
import {SchemaItemTypes} from "../schema.item.types/schema.item.types";
import {AbstractOverride} from "../overrides/abstract.override";
import {OverrideTypes} from "../overrides/override.types";
import {TextOverride} from "../overrides/text.override";
import {EnumOverride} from "../overrides/enum.override";
import {DefaultOverride} from "../overrides/default.override";
import {IMFXSerializable} from "../../../../utils/imfx.serializable";
import {Guid} from "../../../../utils/imfx.guid";

export class IMFXXMLNode extends IMFXSerializable {
  // TODO: make private and use getters and setters
  public Id: any;
  public Schema: IMFXXMLSchema;
  public Children: IMFXXMLNode[] = [];
  public Parent: IMFXXMLNode;
  public Name: string;
  public DisplayName: string;
  public Value: any;
  public EnumValue?: any;
  public SchemaId?: any;
  public AvailableChildren?: IMFXXMLSchema[];
  public AvailableChildrenMap?: { [key: string]: IMFXXMLSchema };
  public EnumItems?: any[] = [];
  public SelectedChoice?: IMFXXMLNode; // if some item was selected in choice then actual rendered node is taken from this field
  public ChoiceParent?: IMFXXMLNode; // if exists then child should have '-' available to allow user to return back to choice
  public Readonly?: boolean = false;
  public Multiline?: boolean = false;
  public UndefinedType?: boolean = false;
  public XPath: any;
  private schemaItemTypes = new SchemaItemTypes();
  private overrides: AbstractOverride[] = [];
  public overrided: boolean = false; // prevent reinitialization on TreeModel.update()
  private uniqueTreeNodeId;
  private valid: boolean = true;
  private isExpanded: boolean;


  constructor(xml: any, overrides?: AbstractOverride[]) {
    super();
    this.fillFromExternalObject(xml);
    if (!overrides) {
      overrides = this.Parent.overrides;
    }

    this.uniqueTreeNodeId = this.uniqueTreeNodeId || Guid.newGuid();

    this.initNode();
    xml.UndefinedType || this.setOverrides(overrides);
  }


  private initNode(o?: {
    doNotInitChildren: boolean
  }) {
    if (!this.Schema)
      return;

    // Init CHOICE
    if (this.Schema.SchemaItemType == this.schemaItemTypes.Choice) { // CHOICE
      //this.AvailableChildren = this.Schema.Children;
    }

    // Init Sequence and All
    if (this.Schema.SchemaItemType == this.schemaItemTypes.Sequence
      || this.Schema.SchemaItemType == this.schemaItemTypes.All) {

      this.AvailableChildren = [];
      this.AvailableChildrenMap = {};

      // 1. Populate Available Children
      for (var schemaChild of this.Schema.Children) {
        // fix Decimal.MaxValue
        if (schemaChild.MaxOccurs > 100000) {
          schemaChild.MaxOccurs = 100000;
        }
        var newChild = schemaChild;
        if (this.Schema.SchemaItemType == this.schemaItemTypes.Sequence) {
          //delete newChild.InsertIndex;
        }
        if (newChild.ItemsLeft) {
          this.AvailableChildrenMap[newChild.Id] = newChild;
          this.AvailableChildren.push(newChild);
        } else {
          for (var j = 0; j < newChild.MaxOccurs; j++) {


            if (this.AvailableChildrenMap[newChild.Id]) {
              this.AvailableChildrenMap[newChild.Id].ItemsLeft++;
            } else {
              newChild.ItemsLeft = 1;
              this.AvailableChildrenMap[newChild.Id] = newChild;
              this.AvailableChildren.push(newChild);
            }
          }
        }
      }

      // 2. Check if we have already add these elements to this
      var j = this.AvailableChildren.length;
      while (j--) {
        var i = this.Children.length;
        while (i--) {
          if (this.AvailableChildren[j].Id == this.Children[i].SchemaId) {
            this.AvailableChildren[j].ItemsLeft = this.Children[i].Schema.MaxOccurs - this.Children.filter((el) => {
                el.SchemaId == this.AvailableChildren[j].Id
              }).length;
            if (this.AvailableChildren[j].ItemsLeft == 0) {
              this.AvailableChildren.splice(j, 1);
            }
            break;
          } else if (this.Schema.SchemaItemType == this.schemaItemTypes.Sequence) {
            var sum = 0;
            for (var k = 0; k < j; k++) {
              sum += this.AvailableChildren[k].ItemsLeft || 0;
            }
            this.AvailableChildren[j].InsertIndex = this.AvailableChildren[j].InsertIndex || sum; //i + 1;
          }
        }
      }

      // 3. Check if the node already was added to to parent
      this.updateAvailableChildren();

      // 4. Clear duplicates
      for (var i = 0; i < this.AvailableChildren.length - 1; i++) {
        if (this.AvailableChildren[i + 1].Id == this.AvailableChildren[i].Id) {
          this.AvailableChildren.splice(i, 1);
          i--;
        }
      }

      // 5. Add children
      o && o.doNotInitChildren || this.addChild();
    }

  }

  private updateAvailableChildren() {
    var j = this.AvailableChildren.length;
    while (j--) {
      var i = this.Children.length;
      while (i--) {
        if (this.AvailableChildren[j].Id == this.Children[i].SchemaId) {
          this.AvailableChildren[j].ItemsLeft = this.Children[i].Schema.MaxOccurs - this.Children.filter((el) => el.SchemaId == this.AvailableChildren[j].Id).length;
          if (this.AvailableChildren[j].ItemsLeft == 0) {
            this.AvailableChildren.splice(j, 1);
          }
          break;
        } else if (this.Schema.SchemaItemType == this.schemaItemTypes.Sequence) {
          var sum = 0;
          for (var k = 0; k < j; k++) {
            sum += this.AvailableChildren[k].ItemsLeft || 0;
          }
          this.AvailableChildren[j].InsertIndex = this.AvailableChildren[j].InsertIndex || sum; //i + 1;
        }
      }
    }
  }

  private needAutogeneratedChildren(manual: boolean = false): boolean {
    var count = 0;
    for (var child of this.Parent.Children) {
      if (child.SchemaId == this.Schema.Id) {
        count++
      }
    }
    return count < this.Schema.MinOccurs || manual;
  }

  public selectNodeType(o?: {
    fromNodeTypeSelector?: boolean
  }) {
    var currentNode = this.Parent.Children.filter(el=>el.uniqueTreeNodeId == this.uniqueTreeNodeId)[0];
    currentNode.Schema  = currentNode.Schema  || this.Schema;
    currentNode.Name = currentNode.Name || currentNode.Schema.Name;
    currentNode.SchemaId = currentNode.Schema.Id;
    if (currentNode.Schema.SchemaItemType == currentNode.schemaItemTypes.Enumeration) { // combobox
      if (currentNode.EnumItems.length == 0) {
        var newEnumItems = [];
        for (var i in currentNode.Schema.EnumItems) {
          if (typeof currentNode.Schema.EnumItems[i] == "string") {
            newEnumItems.push({
              Id: i,
              Value: currentNode.Schema.EnumItems[i]
            })
          } else {
            newEnumItems.push(currentNode.Schema.EnumItems[i]);
          }
        }
        currentNode.Schema.EnumItems = currentNode.EnumItems = newEnumItems;
      }
    }
    else if (currentNode.Schema.SchemaItemType == currentNode.schemaItemTypes.Boolean) { // boolean
      currentNode.Value = false;
    }
    // TODO : other fields!
    if (currentNode.Parent.Schema.SchemaItemType == currentNode.schemaItemTypes.Sequence) { // sequence
      currentNode.Parent.Children.splice(currentNode.Schema.InsertIndex == undefined ? currentNode.Parent.Children.length : currentNode.Schema.InsertIndex, 0, currentNode.Parent.Children.pop());
    }

    // select node type from UI
    if (o && o.fromNodeTypeSelector) {
      currentNode.UndefinedType = false;
      currentNode.initNode();
      currentNode.Parent.initNode({
        doNotInitChildren: true
      });
    }
    currentNode.override();
  }

  private override() {
    if (this.overrided) {
      return;
    }
    new DefaultOverride().override(this);
    for (var currentOverride of this.overrides) {
      if (currentOverride.XPath.replace(/\[(.*?)\]/g, "") == this.Schema.XPath) {
        currentOverride.override(this);
      }
      this.overrided = true;
    }
  }

  public setOverrides(overrides?: any[]) {
    this.overrides = overrides;
    this.override();
  }

  private selectNodeLabel() {
    // TODO: select current node with tree API
  }

  public newChildNodesAvailable() {
    if (!this.Schema) {
      return false;
    }
    if (this.Schema.SchemaItemType!=this.schemaItemTypes.All
      &&  this.Schema.SchemaItemType!=this.schemaItemTypes.Sequence) {
      return false
    }

    if (this.Schema.SchemaItemType == this.schemaItemTypes.Sequence && this.Readonly) {
      return false;
    }

    if(this.Schema.SchemaItemType==this.schemaItemTypes.Sequence || this.Schema.SchemaItemType==this.schemaItemTypes.All) {
      // TODO: not just AvailableChildren length!!!!!!
      if (this.AvailableChildren.length == 0) {
        return false
      }
    }

    return true;
  }

  public isRemovable() {
    // if choice is xml root and we want to deselect it
    if (this.SelectedChoice) {
      return true;
    }
    else if (!this.Parent && !this.ChoiceParent) {
      return false;
    } else {
      if (this.Parent && this.Parent.Schema && this.Parent.Schema.SchemaItemType == this.schemaItemTypes.Sequence && this.Parent.Readonly) {
        return false;
      }
      // allow to deselect non-root choice
      if (this.ChoiceParent) {
        return true
      }

      // allow to cancel modal node type selector
      if (this.UndefinedType) {
        return true
      }

      //check count of neighbours with same the type
      let neighboursCount = 0;
      if(this.Parent) {
          for (var neighbour of this.Parent.Children) {
              if (neighbour.SchemaId == this.SchemaId) {
                  neighboursCount++
              }
          }
      }

      if (this.Schema) {
        /*if (this.Schema.Optional) {
          return true;
        } else*/
        if (this.Schema.MinOccurs == 0) {
          return true;
        }
        if (neighboursCount > this.Schema.MinOccurs) {
          return true
        }
      }
    }
  }

  public isValid() {
    let valid = true;
    if (this.Schema.Optional) {
      valid = true;
    } else {
      if (this.Schema.SchemaItemType == this.schemaItemTypes.Sequence) {
        valid = this.Children.length > 0;
      }
        else if (this.Schema.SchemaItemType == this.schemaItemTypes.Choice) {
          valid = this.SelectedChoice != null;
      } else {
        valid = this.Value != undefined
      }
    }
    this.valid = valid;
    return valid;
  }

  public addChild(manual: boolean = false) {
    if (!this.newChildNodesAvailable())
      return;

    // if auto initialization
    // or if manual add of 1/1 node with recursive init
    if ((!manual) || (manual && this.AvailableChildren.length == 1)) {
      for (var current of this.AvailableChildren) {
        this.Children = this.Children || [];
        var newChild = new IMFXXMLNode({
          Parent: this,
          Schema:  current,
          Value: null
        }, this.Parent ? this.Parent.overrides : this.overrides);
        let needAutogeneration = newChild.needAutogeneratedChildren(manual);
        if (needAutogeneration || manual) {
          this.Children.push(newChild);
          newChild.selectNodeType();
          manual && newChild.selectNodeLabel();
          this.updateAvailableChildren();

          // next: recursive add new children
          if (needAutogeneration) {
            newChild.addChild();
          }
        }
      }
    } else

    // if manual
    if (manual && this.AvailableChildren.length > 1) {
      var newChild = new IMFXXMLNode({
        Parent: this,
        Schema: null,
        Value: null,
        UndefinedType: true
      }, this.overrides);
      this.Children.push(newChild);
    }
  }

  public remove() {
    if (!this.isRemovable())
      return;
    for (var i in this.Parent.Children) {
      let neighbour = this.Parent.Children[i];
      let index = Number(i);
      if (neighbour.uniqueTreeNodeId == this.uniqueTreeNodeId) {
        if (!this.UndefinedType) {
          this.Parent.AvailableChildrenMap[this.SchemaId].ItemsLeft++;
          if (!this.Parent.AvailableChildren.filter(el => el.Id == this.SchemaId).length) {
            this.Parent.AvailableChildren.push(this.Parent.AvailableChildrenMap[this.SchemaId]);
          }
        }
        this.Parent.Children.splice(index, 1);
      }
    }
  }

  public removeChoice() {
    // if choice is xml root
    if (this.SelectedChoice) {
      this.SelectedChoice = null;
    }
    // if is not
    if (this.ChoiceParent) {
      this.ChoiceParent.SelectedChoice = null;
        this.ChoiceParent.Children = [];
    }
  }

  public getOriginalNode() {
    // let emptyObject: {
    //   schemaItemTypes?,
    //   overrides?: null,
    //   overrided?: null,
    //   uniqueTreeNodeId?: null
    // } = {};
    let copyOfTheNode = Object.assign((<any>{}), this);
    delete copyOfTheNode.Parent;
    delete copyOfTheNode.Schema;
    delete copyOfTheNode.EnumItems;
    if (copyOfTheNode.EnumValue) {
      delete copyOfTheNode.EnumValue.element;
    }
    delete copyOfTheNode.AvailableChildren;
    delete copyOfTheNode.AvailableChildrenMap;
    delete copyOfTheNode.SelectedChoice;
    delete copyOfTheNode.ChoiceParent;
    delete copyOfTheNode.Readonly;
    delete copyOfTheNode.UndefinedType;
    delete copyOfTheNode.schemaItemTypes;
    delete copyOfTheNode.overrides;
    delete copyOfTheNode.overrided;
    delete copyOfTheNode.uniqueTreeNodeId;
    return copyOfTheNode;
  }

}
