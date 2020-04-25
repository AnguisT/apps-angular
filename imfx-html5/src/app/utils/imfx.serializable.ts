/**
 * Created by Pavel on 28.01.2017.
 */

export abstract class IMFXSerializable {
  fillFromJSON(json: string) {
    var jsonObj = JSON.parse(json);
    for (var propName in jsonObj) {
      this[propName] = jsonObj[propName]
    }
  }
  fillFromExternalObject(externalObject) {
    for (var propName in externalObject) {
      this[propName] = externalObject[propName]
    }
  }
  toString() {
    this.getNodes(this);
    let jsonString = JSON.stringify(this);
    let jsonParse = JSON.parse(jsonString);
    return jsonParse;
  }

  getNodes(tree) {
    this.removeCircular(tree.nodes[0]);
  }

  removeCircular(node) {
    let i = node.children.length;
    if (i !== 0) {
      while (i--) {
        this.removeCircular(node.children[i]);
      };
    }
    node.xml.Parent = null;
  }
}
