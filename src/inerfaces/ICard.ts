import ICardData from './ICardData';

export default interface ICard {
    size: string;
    type: string;
    title: string;
    icon: string;
    source: string;
    time: string;
    description?: string;
    data?: ICardData;
}