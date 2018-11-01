import ITrack from './ITrack';

export default interface ICardData {
    type: string;
    image?: string;
    temperature?: number;
    humidity: number;
    buttons?: [];
    track?: ITrack;
    volume: number;
    artist: string;
    albumcover: string;
    video: string;
}