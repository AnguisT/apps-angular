import {Injectable} from "@angular/core";
@Injectable()
export class ClipsStorageProvider {

  // private items: Map<string,any> = new Map<string,any>();
  private items: Array<ClipItem> = [];

  constructor() {

  }

  private getIdx(data: ClipItem) {
    for (let idx in this.items) {
      if (data.itemID == this.items[idx].itemID) {
        return idx;
      }
    }
  }

  public addItem(data: ClipItem) {
    this.items.push(data);
  }

  public removeItem(data: ClipItem) {
    let idx = this.getIdx(data);
    if (idx) {
      this.items.splice(parseInt(idx), 1);
    }
  }

  public replaceItem(data: ClipItem) {
    let idx = this.getIdx(data);
    if (idx) {
      this.items.splice(parseInt(idx), 1, data);
    }
  }

  public getItems(): Array<ClipItem> {
    return this.items;
  }

  public setItems(items: Array<ClipItem>) {
    this.items = items;
  }

}

export class ClipItem {
  itemID: number;
  startThumbnail: string;
  startTime: number;
  startTimecodeString: string;
  stopThumbnail: string;
  stopTime: number;
  stopTimecodeString: string;
}
