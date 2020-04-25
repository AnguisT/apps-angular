import {TimeCodeFormat, TMDTimecode} from "../../../../utils/tmd.timecode";
import {Injectable} from "@angular/core";
import * as moment from "moment";

@Injectable()
export class TimecodeProvider {

  public getTimecodeString(time: number, timecodeFormat: number, som: string) {
    if (!time) {
      time = 0;
    }
    if (som) {
      var res = TMDTimecode.fromMilliseconds(time * 1000, timecodeFormat).add(TMDTimecode.fromMilliseconds(som, timecodeFormat)).toString();
    }
    else {
      var res = TMDTimecode.fromMilliseconds(time * 1000, timecodeFormat).toString();
    }
    return res || "";
  }

  public getTimeString(time: number) {
    let sec = Math.floor(time);
    let msec = time - sec;

    let dateSec = new Date(sec * 1000);
    dateSec.setHours(dateSec.getHours() + dateSec.getTimezoneOffset() / 60);
    return dateSec ? moment(dateSec).format("HH:mm:ss") : "";
  }

  public getAudioTimeString(time: number, som: number) { // for audio types
      let dateSec = new Date(time * 1000 + som);
      dateSec.setHours(dateSec.getHours() + dateSec.getTimezoneOffset() / 60);
      return dateSec ? moment(dateSec).format("HH:mm:ss.SSS") : "";
  }

  public getTimeFromTimecodeString(tc: string, timecodeFormat: number, som: string) {
      let timecodeFormat1 = TimeCodeFormat[timecodeFormat];
      let time = TMDTimecode.fromString(tc, timecodeFormat1).substract(TMDTimecode.fromMilliseconds(som, timecodeFormat1)).toSeconds();
      return time;
  }
  public getTimeFromString(tc: string, som: number) {
      let dateSec = moment(tc, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
      return (dateSec*1000 - som)/1000;
  }

}
