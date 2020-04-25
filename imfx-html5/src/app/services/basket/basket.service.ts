import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SessionStorageService} from 'ng2-webstorage';
import {HttpService} from "../http/http.service";
import {Headers} from "@angular/http";
import {ServerStorageService} from "../storage/server.storage.service";
import {LoginProvider} from "../../views/login/providers/login.provider";
import {NotificationService} from "../../modules/notification/services/notification.service";
import {MediaClip} from "../../views/clip-editor/rce.component";

/**
 * Media basket service
 */
@Injectable()
export class BasketService {
  public itemAddedRemoved: EventEmitter<any> = new EventEmitter<any>();
  private _items: BehaviorSubject<any[]>;
  private dataStore: {  // This is where we will store our data in memory
    items: any[]
  };

  constructor(private httpService: HttpService,
              private storage: SessionStorageService,
              private loginProvider: LoginProvider,
              private notificationService: NotificationService,
              private serverStorage: ServerStorageService) {
    this._items = <BehaviorSubject<any[]>>new BehaviorSubject([]);
    if(this.loginProvider.isLogged){
      this.retrieveItems();
    }

    // this.serverStorage.clear('media.basket.data').subscribe((resp) => {
    //   console.log(resp)
    // })
  }

  public retrieveItems() {
    return this.serverStorage.retrieve(['media.basket.data'],true).subscribe((resp) => {
      // this.dataStore = resp["media.basket.data"] && JSON.parse(resp["media.basket.data"]) || {items: []};
      // this.dataStore = resp["media.basket.data"] || {items: []};
      // this.dataStore = {items: []};
      this.dataStore = resp[0] && resp[0].Value && JSON.parse(resp[0].Value) || {items: []};
      this.setItems(this.dataStore);
    })
  }

  private setItems(items) {
    this._items.next(Object.assign({}, items).items);
  }


  get items() {
    return this._items.asObservable();
  }

  getBasketItemsCount() {
    return this.dataStore.items.length;
  }

  addToBasket(item: any, type: "Media"|"Version"): void {
    //this.notificationService.notifyShow(1, "Item " + item.TITLE + " added to basket");
    item.basket_item_type = type;
    this._items.next(Object.assign({}, this.dataStore).items);
    this.dataStore.items.unshift(item); //push(item);
    this.itemAddedRemoved.emit();
    this.serverStorage.store('media.basket.data', this.dataStore).subscribe((res) => {
      console.log(res);
    });
  }

  removeFromBasket(item: any): void {
    // TODO: review remove
    let items = this.dataStore.items;
    for(var i = 0; i < item.length; i++) {
      items = items.filter((el) => el.ID != item[i].ID);
      item[i].ordered = false;
    }
    this.dataStore.items = items;
    this._items.next((Object.assign({}, this.dataStore).items));
    this.itemAddedRemoved.emit();
    this.serverStorage.store('media.basket.data', this.dataStore).subscribe((res) => {
      console.log(res);
    });
  }

  hasItem(item: any): boolean {
    return this.dataStore && this.dataStore.items.filter(function (el) {
        return el.ID == item.ID;
      }).length > 0;
  }

  getOrderPresets() {
    return this.httpService
      .get(
        '/api/order-presets'
      )
      .map((res) => {
        return res.json();
      });
  }

  placeOrderFromWizzard(param: {
    itemType: any,
    itemId: any,
    preset: any,
    note: any,
    schemaId?: number,
    clips?: Array<MediaClip>,
    xmlDocAndSchema?: any
  }) {

    let postData = {
      "PresetId": param.preset.Id,
      "Media" : [],
      "Notes": param.note,
      "SchemaId": param.schemaId,
      "XmlDocAndSchema": param.xmlDocAndSchema,
    };
    if (param.clips && param.clips.length) {
      // let mediaItems = [];
      // let mediaItemsPlain = {};
      // for (let clip of param.clips) {
      //   if (mediaItemsPlain[clip.mediaId]) {
      //     mediaItemsPlain[clip.mediaId].Subclips.push({
      //       "In": clip.start,
      //       "Out": clip.end,
      //     })
      //   } else {
      //     mediaItemsPlain[clip.mediaId] = {
      //       "Id": clip.mediaId,
      //       "Type": "Media",
      //       "Subclips": []
      //     }
      //     mediaItemsPlain[clip.mediaId].Subclips.push({
      //       "In": clip.start,
      //       "Out": clip.end,
      //     })
      //     mediaItems.push(mediaItemsPlain[clip.mediaId])
      //   }
      // }
      postData.Media = param.clips.map(el=>{
        return {
          "Id": el.mediaId,
          "ItemType": "Media",
          "Subclips": [{
            "In": el.start,
            "Out": el.end,
          }]
        }
      });
    } else {
      postData.Media = [{"Id": param.itemId, "ItemType": param.itemType}];
    }

    let headers = new Headers({'Content-Type': 'application/json'});

    return this.httpService
      .post(
        '/api/MediaOrder',
        JSON.stringify(postData),
        {headers: headers}
      )
      .map((res) => {
        this.dataStore.items = this.dataStore.items.filter(el => !el.selected); // remove ordered items from basket
        this._items.next((Object.assign({}, this.dataStore).items)); // and notify everybody about it
        this.serverStorage.store('media.basket.data', this.dataStore).subscribe((res) => {
          console.log(res);
        });
        return res.json();
      }, (err) => {
        return err.json();
      });

  }

  placeOrder(param: {
    preset: any,
    note: any,
    schemaId?: number,
    xmlDocAndSchema?: any
  }) {

    let postData = {
      "PresetId": param.preset.Id,
      "Notes": param.note,
      "Media": this.dataStore.items
      //.filter(item => item.selected)
        .map(item => {
          return {Id: item.ID, ItemType: item.basket_item_type}
        }),
      "SchemaId": param.schemaId,
      "XmlDocAndSchema": param.xmlDocAndSchema,
    };
    let headers = new Headers({'Content-Type': 'application/json'});

    return this.httpService
      .post(
        '/api/MediaOrder',
        JSON.stringify(postData),
        {headers: headers}
      )
      .map((res) => {
        this.dataStore.items = this.dataStore.items.filter(el => !el.selected); // remove ordered items from basket
        this._items.next((Object.assign({}, this.dataStore).items)); // and notify everybody about it
        this.serverStorage.store('media.basket.data', this.dataStore).subscribe((res) => {
          console.log(res);
        });
        return res.json();
      }, (err) => {
        return err.json();
      });

  }
}
