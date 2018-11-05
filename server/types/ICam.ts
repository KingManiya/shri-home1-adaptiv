interface ICamData {
    video: string;
    brightness?: number;
    contrast?: number;
}

export interface ICam {
    data: ICamData;
}