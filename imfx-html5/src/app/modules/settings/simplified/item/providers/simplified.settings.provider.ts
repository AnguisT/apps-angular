/**
 * Created by Sergey Trizna on 03.08.2017.
 */
import {Injectable} from "@angular/core";
import {SimplifiedSettingsProvider} from "../../provider";

@Injectable()
export class SimplifiedItemSettingsProvider extends SimplifiedSettingsProvider {
    public settings = this.getDefaultSettings('item');
}