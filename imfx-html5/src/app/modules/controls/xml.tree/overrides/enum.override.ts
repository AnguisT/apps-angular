/**
 * Created by Pavel on 25.01.2017.
 */

import {AbstractOverride} from "./abstract.override";
import {IMFXXMLNode} from "../model/imfx.xml.node";


export class EnumOverride extends AbstractOverride {
  public override (node: IMFXXMLNode) {
    node.EnumItems = [];
    for (var k in this.externalOverride.EnumValues) {
      node.EnumItems.push({
        Id: k,
        Value: this.externalOverride.EnumValues[k]
      })
    }
  }
}
