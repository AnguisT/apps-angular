export class LayoutManagerModel {
  public Id: number;
  public Name: string;
  public IsShared: boolean;
  public IsDefault: boolean;
  public TypeId: number;
  public Layout: string;
}

export enum LayoutType {
  Dashboard = 3,
  Logging = 4,
  Assess = 5
}

export class LayoutManagerDefaults {
  static Dashboard: string = '{}';
  static Logging: string = '{ "dimensions": { "headerHeight": 36, "borderWidth": 10 }, "settings": { "hasHeaders": true, "showPopoutIcon": true, "showMaximiseIcon": false, "showCloseIcon": true, "selectionEnabled": true }, "labels": { "close": "Close", "maximise": "Maximise", "minimise": "Minimise", "popout": "Open In New Window", "popin": "Pop In", "tabDropdown": "Additional Tabs" }, "content": [{ "type": "row", "content": [{ "type": "component", "componentName": "Data", "width": 25, "tTitle": "Data" }, { "type": "column", "content": [{ "type": "component", "componentName": "Media", "tTitle": "Media" }, { "type": "component", "componentName": "VideoInfo", "tTitle": "VideoInfo" }, { "componentName": "Timeline", "type": "component", "tTitle": "Timeline" }] }, { "type": "column", "content": [{ "type": "component", "componentName": "Tagging", "width": 25, "tTitle": "Tagging" }, { "type": "component", "componentName": "Taxonomy", "width": 25, "tTitle": "Taxonomy" }] }] }] }';
  static Assess: string = '{ "dimensions": { "headerHeight": 36, "borderWidth": 10 }, "settings": { "hasHeaders": true, "showPopoutIcon": true, "showMaximiseIcon": false, "showCloseIcon": true, "selectionEnabled": true }, "labels": { "close": "Close", "maximise": "Maximise", "minimise": "Minimise", "popout": "Open In New Window", "popin": "Pop In", "tabDropdown": "Additional Tabs" }, "content": [{ "type": "column", "content": [{ "type": "row", "content": [{ "type": "component", "componentName": "MediaItems", "tTitle": "MediaItems", "width": 25 }, { "type": "column", "content": [{ "type": "component", "componentName": "Media", "tTitle": "Media" }] }, { "type": "column", "width": 25, "content": [{ "type": "row", "content": [{ "type": "component", "componentName": "JobData", "tTitle": "JobData", "width": 20 }] }, { "type": "row", "content": [{ "type": "component", "componentName": "Data", "tTitle": "Data", "width": 20 }] }] }] }, { "type": "row", "content": [{ "type": "stack", "content": [{ "type": "component", "componentName": "MediaInfo", "tTitle": "MediaInfo" }, { "type": "component", "componentName": "Segments", "tTitle": "Segments" }, { "type": "component", "componentName": "Events", "tTitle": "Events" }, { "type": "component", "componentName": "AudioTracks", "tTitle": "AudioTracks" }, { "type": "component", "componentName": "Tagging", "tTitle": "Tagging" }, { "type": "component", "componentName": "VideoInfo", "tTitle": "VideoInfo" }, { "type": "component", "componentName": "Timeline", "tTitle": "Timeline" }, { "type": "component", "componentName": "Subtitles", "tTitle": "Subtitles" }, { "type": "component", "componentName": "Metadata", "tTitle": "Metadata" }, { "type": "component", "componentName": "Notes", "tTitle": "Notes" }, { "type": "component", "componentName": "AI", "tTitle": "AI" }] }] }] }] }';
}
