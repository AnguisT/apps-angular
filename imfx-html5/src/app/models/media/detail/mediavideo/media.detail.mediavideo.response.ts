import { MediaDetailMediaVideoAudioWavefrom } from './media.detail.mediavideo.audio.wavefrom';
import { MediaDetailMediaVideoScene } from './media.detail.mediavideo.scene';
import { MediaDetailMediaVideoSmudge } from './media.detail.mediavideo.smudge';

export type MediaDetailMediaVideoResponse = {
    AudioWaveform?: MediaDetailMediaVideoAudioWavefrom;
    OriginalVideo: boolean;
    PlayerType: string;
    ProxyUrl: string;
    Scene?: MediaDetailMediaVideoScene;
    Smudge?: MediaDetailMediaVideoSmudge;
    Som: string;
    SomMs: number;
    FileSomMs: number;
    TimecodeFormat: string;
};
