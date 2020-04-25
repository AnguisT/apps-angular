/**
 * Created by Pavel on 24.04.2017.
 */
export class TimeCodeFormat {
  public static Pal = 0;
  public static NTCS_DF = 1;
  public static NTCS_NDF = 2;
  public static FPS24 = 3;
  public static HD60p_DF = 4;
  public static HD60p_NDF = 5;
  public static HD50p = 6;
  public static Film2398 = 7;
  public static Invalid = 8;
}
;

export class TMDTimecode {
  public hours;
  public minutes;
  public seconds;
  public frames;
  public format;
  public timeCodeFormat;

  constructor(ctorOpts: {
    type: "invalid"|"frames"|"string",
    timecodeFormat: number,
    frames?: number,
    timecodeString?: string,
  }) {
    if (ctorOpts.type == "invalid") {
      this.setFromFrames(0, TimeCodeFormat.Invalid);
    } else if (ctorOpts.type == "frames") {
      this.setFromFrames(ctorOpts.frames, ctorOpts.timecodeFormat);
    } else if (ctorOpts.type == "string") {
      this.setFromString(ctorOpts.timecodeString, ctorOpts.timecodeFormat);
    }
  }

  isInvalid() {
    this.format == TimeCodeFormat.Invalid;
  }

  toTimeSpan() {
    // let res = this.getFrameRate(this.format);
    // return new TimeSpan(0, this.hours, this.minutes, this.seconds, Math.floor((1000/res.frameRate)*this.frames));
  }

  isZero() {
    return this.hours == 0 && this.minutes == 0 && this.seconds == 0 && this.frames == 0;
  }

  toFrames() {
    let res = this.getFrameRate(this.format);
    let frRate = res.frameRate;
    let df = res.dropFrame;

    let result = 0;

    if (df) {
      let baseFrameRate = frRate;
      if (baseFrameRate > 30) baseFrameRate = Math.floor(baseFrameRate / 2);

      let tenMinInFrames = 10 * 60 * baseFrameRate;                    //=18000 for 30 fps     23.98 > 14400 23.98
      let tenMinDfInFrames = Math.floor(tenMinInFrames / 1.001);  //=17982 for 29.97 fps  23.98 > 14385 > 14385.6
      let droppedInTenMin = tenMinInFrames - tenMinDfInFrames;         //=18    for 29.97 fps  23.98 > 15

      let dfFactor = Math.floor(frRate / baseFrameRate);
      let dfCnt;
      if (this.minutes % 10 > 0) {
        let amin = this.minutes % 10;
        let minutes = Math.floor(this.minutes / 10) * 10;
        dfCnt = (minutes + this.hours * 60);
        dfCnt = droppedInTenMin * dfFactor * Math.floor((dfCnt / 10));
        result = minutes + this.hours * 60;
        result = result * 60; // seconds
        result = result * frRate - dfCnt; // frames count

        if (amin >= 1)
          dfCnt = ((dfFactor * 2) * amin);
        else
          dfCnt = 0;

        if (this.frames < 2 * dfFactor && this.seconds == 0) this.frames = 0;
        result = result + ((amin * 60 + this.seconds) * frRate + this.frames) - dfCnt;
      }
      else {
        dfCnt = this.minutes + this.hours * 60;
        dfCnt = droppedInTenMin * dfFactor * Math.floor(dfCnt / 10);
        result = this.minutes + this.hours * 60;
        result = result * 60 + this.seconds;
        result = result * frRate + this.frames - dfCnt;
      }

    }
    else {
      result = this.minutes + this.hours * 60;
      result = this.seconds + result * 60;
      result = result * frRate + this.frames;
    }

    return Math.floor(result);
  }

  setFromString(value, tcFormat) {
    this.format = tcFormat;

    try {
      this.hours = Math.floor(value.substr(0, 2));
      this.minutes = Math.floor(value.substr(3, 2));
      this.seconds = Math.floor(value.substr(6, 2));
      this.frames = Math.floor(value.substr(9, 2));
    }
    catch (e) {
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.frames = 0;
    }
  }

  setFromFrames(frames, timecodeFormat) {
    this.format = timecodeFormat;
    let res = this.getFrameRate(timecodeFormat);
    let frRate = res.frameRate;
    let df = res.dropFrame;

    if (df) {
      let baseFrameRate = frRate;
      if (baseFrameRate > 30) baseFrameRate = Math.floor(baseFrameRate / 2);

      let tenMinInFrames = 10 * 60 * baseFrameRate;                               //=18000 for 30 fps     23.98 > 14400 23.98
      let tenMinDfInFrames = Math.floor(tenMinInFrames / 1.001);  //=17982 for 29.97 fps  23.98 > 14385 > 14385.6
      let droppedInTenMin = tenMinInFrames - tenMinDfInFrames;         //=18    for 29.97 fps  23.98 > 15


      let dfFactor = Math.floor(frRate / baseFrameRate);
      let num10Min = Math.floor(frames / (tenMinDfInFrames * dfFactor));
      let offset = Math.floor(num10Min * droppedInTenMin);
      let less10Min = Math.floor(frames % (tenMinDfInFrames * dfFactor));
      if (less10Min >= (tenMinInFrames / 10) * dfFactor)
        offset = offset + Math.floor(((less10Min - ((tenMinInFrames / 10) * dfFactor)) / ((tenMinDfInFrames / 10) * dfFactor))) * 2 + 2;

      offset = offset * dfFactor;
      frames = frames + offset;
    }

    /*this.hours = Math.floor(frames / (3600 * frRate));
     this.minutes = Math.floor((frames - this.hours*frRate*3600 ) / (60 *frRate ) );
     this.seconds = Math.floor((frames - this.hours*frRate*3600 - this.minutes*frRate*60 ) / 60);
     this.frames = Math.floor(frames % frRate);*/

    this.frames = Math.floor(frames % frRate);
    this.seconds = Math.floor((frames % (60 * frRate)) / frRate);
    this.minutes = Math.floor(frames % (3600 * frRate) / (60 * frRate));
    this.hours = Math.floor(frames / (3600 * frRate));
  }

  getHashCode = function () {
    //return new UnicodeEncoding().GetBytes((this.format * 1000 * 60 * 60 * 100) + (this.hours * 60 * 60 * 100) + (this.minutes * 60 * 100) + (this.seconds * 100) + this.frames);
  }


  equals(other) {
    return this.format == other.format &&
      this.hours == other.hours &&
      this.minutes == other.minutes &&
      this.seconds == other.seconds &&
      this.frames == other.frames;
  }

  add(tc2) {
    if (this.format != tc2.format) {
      throw new Error("Unable to add timecodes with different formats");
    }
    return TMDTimecode.fromFrames(TMDTimecode.toFrames(this) + TMDTimecode.toFrames(tc2), this.format);
  }


  substract(tc2) {
    if (this.format != tc2.format) {
      throw new Error("Unable to add timecodes with different formats");
    }
    let f1 = TMDTimecode.toFrames(this);
    let f2 = TMDTimecode.toFrames(tc2);

    if (f2 > f1) {
      return TMDTimecode.fromFrames(0, this.format);
    }
    return TMDTimecode.fromFrames(f1 - f2, this.format);
  }

  toString() {
    let f = function (n) {
      return ("0" + Math.floor(n)).slice(-2);
    }
    return [f(this.hours), f(this.minutes), f(this.seconds), f(this.frames)].join(":");
  }

  static fromString(value, tcFormat) {
    return new TMDTimecode({
      type: "string",
      timecodeString: value,
      timecodeFormat: tcFormat
    });
  }

  static compareStrings(tc1: string, tc2: string) {
    if (tc1 == tc2) {
      return 0;
    }
    let tc1arr = tc1.split(":").map(el=>parseInt(el));
    let tc2arr = tc2.split(":").map(el=>parseInt(el))

    for (let i in tc1arr) {
      if (tc1arr[i] > tc2arr[i]) {
        return 1
      }
      if (tc2arr[i] > tc1arr[i]) {
        return -1
      }
    }
  }

  static toTimeSpan(value: TMDTimecode) {
    return value.toTimeSpan();
  }

  static stringToFrames(value, tcFormat) {
    return new TMDTimecode({
      type: "string",
      timecodeString: value,
      timecodeFormat: tcFormat
    }).toFrames();
  }

  static framesToString(frames, timecodeFormat) {
    if (frames <= 0) return "00:00:00:00";
    return new TMDTimecode({
      type: "frames",
      frames: frames,
      timecodeFormat: timecodeFormat
    }).toString();
  }

  static toFrames(timeCode) {
    return timeCode.toFrames();
  }

  static fromFrames(frames, timecodeFormat) {
    return new TMDTimecode({
      type: "frames",
      frames: frames,
      timecodeFormat: timecodeFormat
    });
  }


  static secondsToFrames(frames, timecodeFormat) {
    // let tc = new TMDTimecode({
    //   type: "frames",
    //   frames: 0,
    //   timecodeFormat: timecodeFormat
    // });
    // let hf = 60 * 60;
    // let mf = 60;
    // tc.hours = seconds / hf;
    // tc.minutes = (seconds % hf) / mf);
    // tc.seconds = seconds % mf;
    //
    // return tc.toFrames();
  }

  static fromMilliseconds(milliseconds, timecodeFormat) {
    let tc = new TMDTimecode({
      type: "frames",
      frames: 1,
      timecodeFormat: timecodeFormat
    });

    let milliSecondsPerFrame = tc.toMilliseconds();
    if (milliSecondsPerFrame < 1) return new TMDTimecode({type: "invalid", timecodeFormat: TimeCodeFormat.Invalid});

    let  framesf = milliseconds / milliSecondsPerFrame;
    if (Math.round(framesf) - framesf < 0.0001) {
	framesf += 0.0001;
    }

    return new TMDTimecode({
      type: "frames",
      frames: Math.floor(framesf),
      timecodeFormat: timecodeFormat
    });
  }

  static fromMillisecondsOld(milliseconds, timecodeFormat) {
    let tc = new TMDTimecode({
      type: "frames",
      frames: 0,
      timecodeFormat: timecodeFormat
    });
    let res = tc.getFrameRate(timecodeFormat);
    let frRate = res.frameRate;
    let df = res.dropFrame;
    let milliSecondsPerFrame = 1000 / frRate;
    let seconds = milliseconds / 1000;
    let hf = 60 * 60;
    let mf = 60;
    tc.hours = Math.floor(seconds / hf);
    tc.minutes = Math.floor((seconds % hf) / mf);
    tc.seconds = Math.floor(seconds % mf);
    //tc.frames = Math.floor((((seconds % mf) - tc.seconds) * 1000) / milliSecondsPerFrame);
    tc.frames = parseFloat(((((seconds % mf) - tc.seconds) * 1000) / milliSecondsPerFrame).toFixed(4))

    return tc;
  }

  toSeconds() {
    return this.toMilliseconds()/1000;
  }

  toMilliseconds() {
    let res = this.getFrameRate(this.format);
    let frRate = res.frameRate;
    let df = res.dropFrame;

   if (this.format == TimeCodeFormat.Film2398 || this.format == TimeCodeFormat.NTCS_DF || this.format == TimeCodeFormat.HD60p_DF) {
        frRate = (frRate * 1000) / 1001;
    }

    return (1000.0 / frRate) * this.toFrames();
  }

  toMillisecondsOld() {
    let res = this.getFrameRate(this.format);
    let frRate = res.frameRate;
    let df = res.dropFrame;
    let milliSecondsPerFrame = 1000 / frRate;
    let hf = 60 * 60;
    let mf = 60;

    let ms = 0;

    ms += this.hours * hf * 1000;
    ms += this.minutes * mf * 1000;
    ms += this.seconds * 1000;
    ms += this.frames * milliSecondsPerFrame;
    return ms;

  }

  static secondsToString(seconds) {
    let hr = seconds / 3600;
    let mf = (seconds % 3600) / 60;
    let sf = seconds % 60;
    let f = function (n) {
      return ('0' + Math.floor(n)).slice(-2);
    }
    return [f(hr), f(mf), f(sf), '00'].join(':');
    // let str = `{hr:d2}:{mf:d2}:{sf:d2}`;
    // return str;
  }

  static isValidTimecode(timeCode, tcFormat) {
    let tc = new TMDTimecode({
      type: "string",
      timecodeString: timeCode,
      timecodeFormat: tcFormat
    });
    if (tc.minutes > 59 || tc.seconds > 59) return false;

    switch (tcFormat) {
      case TimeCodeFormat.Pal:
        if (tc.frames > 24) return false;
        break;
      case TimeCodeFormat.NTCS_NDF:
        if (tc.frames > 29) return false;
        break;
      case TimeCodeFormat.FPS24:
        if (tc.frames > 23) return false;
        break;
      case TimeCodeFormat.HD60p_NDF:
        if (tc.frames > 59) return false;
        break;
      case TimeCodeFormat.HD50p:
        if (tc.frames > 49) return false;
        break;
      case TimeCodeFormat.Film2398:
      case TimeCodeFormat.NTCS_DF:
      case TimeCodeFormat.HD60p_DF:
        if (tc != new TMDTimecode({
            type: "frames",
            frames: tc.toFrames(),
            timecodeFormat: tcFormat
          })) {
          return false;
        }
        break;
      default:
        if (tc.frames > 24) return false;
        break;
    }
    return true;
  }

  static getFrameRate(tcformat) {
    let res = {
      dropFrame: false,
      frameRate: 25
    }
    switch (tcformat) {
      case TimeCodeFormat.Pal:
        res.frameRate = 25;
        return res;
      case TimeCodeFormat.FPS24:
        res.frameRate = 24;
        return res;
      case TimeCodeFormat.NTCS_DF:
        res.dropFrame = true;
        res.frameRate = 30;
        return res;
      case TimeCodeFormat.NTCS_NDF:
        res.frameRate = 30;
        return res;
      case TimeCodeFormat.HD60p_NDF:
        res.frameRate = 60;
        return res;
      case TimeCodeFormat.HD60p_DF:
        res.dropFrame = true;
        res.frameRate = 60;
        return res;
      case TimeCodeFormat.HD50p:
        res.frameRate = 50;
        return res;
      case TimeCodeFormat.Film2398:
        res.dropFrame = true;
        res.frameRate = 24;
        return res;
    }
  }

   getFrameRate(tcformat) {
    return TMDTimecode.getFrameRate(tcformat);
  }

  static getTimeCodeFormatFromFrameRate(frameRate, dropFrame) {
    switch (frameRate) {
      case 25:
        return TimeCodeFormat.Pal;
      case 24:
        return dropFrame ? TimeCodeFormat.Film2398 : TimeCodeFormat.FPS24;
      case 30:
        return dropFrame ? TimeCodeFormat.NTCS_DF : TimeCodeFormat.NTCS_NDF;
      case 60:
        return dropFrame ? TimeCodeFormat.HD60p_DF : TimeCodeFormat.HD60p_NDF;
      case 50:
        return TimeCodeFormat.HD50p;
    }
    return TimeCodeFormat.Invalid;
  }

  static getFormatFromMfx(tcf) {
    switch (tcf) {
      case 1:
        return TimeCodeFormat.Pal;
      case 2:
        return TimeCodeFormat.NTCS_DF;
      case 3:
        return TimeCodeFormat.NTCS_NDF;
      case 4:
        return TimeCodeFormat.FPS24;
      case 5:
        return TimeCodeFormat.HD60p_DF;
      case 6:
        return TimeCodeFormat.HD60p_NDF;
      case 7:
        return TimeCodeFormat.HD50p;
      case 8:
        return TimeCodeFormat.Film2398;
      default:
        return TimeCodeFormat.Invalid;
    }
  }


}
