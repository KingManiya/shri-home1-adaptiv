import ITrack from './ITrack';
import {IVideoSettings} from './IVideoSettings';

export default interface ICardData extends IVideoSettings {
    type: string;
    image?: string;
    temperature?: number;
    humidity: number;
    buttons?: [];
    track?: ITrack;
    volume: number;
    artist: string;
    albumcover: string;
}