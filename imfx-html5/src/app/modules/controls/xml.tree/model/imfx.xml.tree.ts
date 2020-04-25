/**
 * Created by Pavel on 23.02.2017.
 */

import {IMFXSerializable} from "../../../../utils/imfx.serializable";
import {OverrideTypes} from "../overrides/override.types";
import {EnumOverride} from "../overrides/enum.override";
import {TextOverride} from "../overrides/text.override";
import {NoeditOverride} from "../overrides/noedit.override";
import {DefaultOverride} from "../overrides/default.override";
import {IMFXXMLSchema} from "./imfx.xml.schema";
import {AbstractHandler} from "../schema.item.types/abstract.handler";
import {IMFXXMLNode} from "./imfx.xml.node";
import {SchemaItemTypes} from "../schema.item.types/schema.item.types";
import {BooleanHandler} from "../schema.item.types/boolean.handler";
import {DefaultHandler} from "../schema.item.types/default.handler";
import {ITreeNode} from "angular-tree-component/dist/defs/api";
import {TreeNode} from "angular-tree-component";
import {MultilineOverride} from "../overrides/multiline.override";


export class IMFXXMLTree extends IMFXSerializable {

    public nodes;
    private overrides;
    private schemaItemTypes = new SchemaItemTypes();

    constructor(private xmlModel: any,
                private schemaModel: any) {
        super();
        if (xmlModel && xmlModel.XmlModel) {
            this.appendSchema(xmlModel.XmlModel);
            schemaModel.SchemaOverrides = schemaModel.SchemaOverrides || [];
            // pass these overrides to each node. it will be handled later in the IMFXXMLNode
            this.overrides = schemaModel.SchemaOverrides.map((currentOverride) => {
                if (currentOverride.OverrideType == OverrideTypes.TEXT) {
                    return new TextOverride(currentOverride);
                } else if (currentOverride.OverrideType == OverrideTypes.ENUM) {
                    return new EnumOverride(currentOverride);
                } else if (currentOverride.OverrideType == OverrideTypes.NOEDIT) {
                    return new NoeditOverride(currentOverride);
                } else if (currentOverride.OverrideType == OverrideTypes.MULTILINE) {
                    return new MultilineOverride(currentOverride);
                } else {
                    return new DefaultOverride(currentOverride);
                }
            });
            this.nodes = this.handleTree([xmlModel.XmlModel]);
        }


    }

    // append Schema to each node in the source tree
    // handle schema item type
    private appendSchema(node: IMFXXMLNode) {
        node.Schema = node.SchemaId ? this.findSchemaNodeById(node.SchemaId) : new IMFXXMLSchema();
        let nodeHandler: AbstractHandler;
        if (node.Schema.SchemaItemType == this.schemaItemTypes.Boolean) {
            nodeHandler = new BooleanHandler();
        } else {
            nodeHandler = new DefaultHandler();
        }

        nodeHandler.handle(node);

        // TODO: refactor this stuff
        //if (node.Children) {
        var i = node.Children.length;
        while (i--) {
            if (node.Children[i].Id) {
                this.appendSchema(node.Children[i]);
            } else {
                node.Children.splice(i);
            }
        }
        //}
    }

    // find SchemaModel with such Id
    private findSchemaNodeById(id) {
        return this.findNodeById([this.schemaModel.SchemaModel], "Id", id);
    }

    private findNodeById(nodes: IMFXXMLNode[], idField, id) {
        var found = undefined;
        for (var node of nodes) {
            if (node.Id == id) {
                found = node;
            } else {
                found = this.findNodeById(node.Children, idField, id);
            }
            if (found)
                return found;
        }
    }

    // handle overrided immutable tree data and return new one in angular2-tree-component format
    private handleTree(sourceTrees: Array<IMFXXMLNode>, parent?: IMFXXMLNode) {
        var targetTrees = [];
        for (var sourceTree of sourceTrees) {
            debugger;
            if (parent) {
                sourceTree.Parent = parent;
            }
            // check if we have selected item in current CHOICE element
            if (sourceTree.SelectedChoice) {
                this.appendSchema(sourceTree.SelectedChoice);
                sourceTree.SelectedChoice.ChoiceParent = sourceTree;
                // TODO : refactoring
                if (parent) {
                    sourceTree.SelectedChoice.Parent = parent;
                }
            }
            else if(sourceTree.Schema && sourceTree.Schema.SchemaItemType == this.schemaItemTypes.Choice && !sourceTree.SelectedChoice && sourceTree.Children && sourceTree.Children.length > 0) {
                sourceTree.SelectedChoice = Object.assign({}, sourceTree.Children[0]);
                this.appendSchema(sourceTree.SelectedChoice);

                sourceTree.SelectedChoice.ChoiceParent = sourceTree;
                sourceTree.SelectedChoice.Parent = sourceTree;
            }
            if (!sourceTree.Schema) {
              this.appendSchema(sourceTree);
            }
            var targetTree;
            // TODO: refactoring
            var sourceTreeActual = sourceTree.SelectedChoice ? sourceTree.SelectedChoice : sourceTree;
            if (sourceTreeActual instanceof IMFXXMLNode && sourceTreeActual.overrided) {
                targetTree = {
                    id: sourceTreeActual.Id,
                    name: sourceTreeActual.Name,
                    xml: sourceTreeActual,
                    children: [],
                    // isExpanded: true
                };
                targetTree.children = this.handleTree(sourceTreeActual.Children, targetTree.xml);
            } else {
                targetTree = {
                    id: sourceTreeActual.Id,
                    name: sourceTreeActual.Name,
                    xml: new IMFXXMLNode(sourceTreeActual, this.overrides),
                    children: [],
                    // isExpanded: true
                };
                targetTree.children = this.handleTree(sourceTreeActual.Children, targetTree.xml);
                targetTree.xml.Children = targetTree.children.map((el) => el.xml);
            }
            targetTrees.push(targetTree);
        }
        return targetTrees;
    }

    public updateTree(data) {
        debugger;
        let node = data.node;
        let xml = data.xml;
        this.storeExpanded(node);
        node.data.children = this.handleTree(xml.SelectedChoice ? xml.SelectedChoice.Children : xml.Children, xml);
        node._initChildren();
        node.treeModel.update();
        // setTimeout(()=>{
          this.restoreExpanded(node);
        // })

    }

    private storeExpanded(node: TreeNode) {
      if (node.data.xml) {
        node.data.xml.isExpanded = node.isExpanded;
      }
      let children = node.getVisibleChildren();
      for (let child of children) {
        this.storeExpanded(child)
      }
    }

    restoreExpanded(node: TreeNode) {
      if (node.data.xml.isExpanded === true || node.data.xml.isExpanded === undefined) {
        // setTimeout(()=>{
          node.expand()
        // });
      }
      let children = node.getVisibleChildren();
      for (let child of children) {
        this.restoreExpanded(child)
      }
    }

    private getOriginalXmlModel(node) {
        node.xml.Children = [];
        for (var child of node.children) {
            node.xml.Children.push(this.getOriginalXmlModel(child))
        }
        return node.xml.getOriginalNode()
    }

    public getXmlModel() {
        this.xmlModel.XmlModel = this.getOriginalXmlModel(this.nodes[0]);
        return {
            FriendlyName: null, // TODO: pick up from the parent
            SchemaModel: this.schemaModel,
            XmlModel: this.xmlModel,
            Serialized: this.getSerializedTree()
        }
    }

    private getNodesArray(): Array<IMFXXMLNode> {
        var nodesList = [];
        this.collectNodes(this.nodes[0], nodesList)
        return nodesList;
    }

    private collectNodes(node, array) {
        array.push(node.xml);
        for (var current of node.children) {
            this.collectNodes(current, array)
        }
    }

    public getSerializedTree() {
        let arr = this.getNodesArray().filter(el => el.Value != null && el.Value !== '');
        let serializedArr = [];
        for (let idx in arr) {
            let el = arr[idx];
            let elementIndex = 1;

            let decrement = Number(idx);
            while (arr[decrement - 1] && arr[decrement].Schema.XPath == arr[decrement - 1].Schema.XPath) {
                elementIndex++;
                decrement--;
            }
            serializedArr.push(el.Schema.XPath + "[" + elementIndex + "]" + ";" + el.Value)
        }
        return serializedArr.join(";")
    }


    public setXmlModel(serializedNodes: Array<{
        key: string,
        value: string
    }>) {
        let arr: Array<IMFXXMLNode> = this.getNodesArray();
        let plainNodes = [];
        for (let idx in arr) {
            let el = arr[idx];
            let elementIndex = 1;

            let decrement = Number(idx);
            while (arr[decrement - 1] && arr[decrement].Schema.XPath == arr[decrement - 1].Schema.XPath) {
                elementIndex++;
                decrement--;
            }
            plainNodes.push({
                xpath: el.Schema.XPath + "[" + elementIndex + "]",
                node: el.Value
            });
        }
        plainNodes.map(el => {
            return el;
        })
    }

    public isValid() {
        let invalidNodes: Array<IMFXXMLNode> = this.getNodesArray().filter(el => {
            return !el.isValid()
        });
        return invalidNodes.length == 0;
    }


}
