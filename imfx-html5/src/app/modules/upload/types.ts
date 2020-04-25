/**
 * Created by Sergey Trizna on 31.08.2017.
 */
import { Select2ListTypes } from '../controls/select2/types';

export type AvailableMediaTypeByExtensionListTypes = {
    [key: string]: MediaFileListTypes
};

export type AvailableMediaTypeByExtensionAsSelect2ListTypes = {
    [key: string]: Select2ListTypes
};

export type MediaFileListTypes = Array<MediaFileType>;

export type MediaFileTypes = {
    [key: number]: MediaFileType
};

export type MediaFileType = {
    Id: number,
    MediaType: number,
    Name: string,
    Extensions: string,
    Code?: string,
    DisablePlayback?: boolean,
    IconId?: number,
    MediaViewer?: boolean,
    ShowHdSdIcon?: boolean,
    SystemType?: number
};

export class UploadModel {
    state: 'waiting' | 'progress' | 'success' | 'error' = 'waiting';
    formData: any; // FormData;
    percentValue:  number;
    file: any;
    mediaFileType: MediaFileType;
    success?: UploadResponseModel;
    error?: any;
    errorText?: string;
};

export type UploadResponseModel = {
    'WorfklowResult': UploadResponseWorkflowModel,
    'MediaId': number
};

export type UploadResponseWorkflowModel = {
    'JobRef'?: any,
    'JobId'?: number,
    'JobStatus'?: any,
    'ExternalId'?: any,
    'ID'?: number,
    'RuleResult'?: any,
    'Result'?: boolean,
    'Error'?: any,
    'ErrorCode'?: any
};
