export interface IMFXHtmlPlayerInterface {
  setTimecode(tc: string): void;
  setPercent(percent: number): void;
  setMarkers(o): void;
  setResizeEvent(): void;
}
