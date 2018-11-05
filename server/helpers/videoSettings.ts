interface IVideoSettings {
    brightness: number;
    contrast: number;
}

interface ISettings {
    [url: string]: IVideoSettings;
}

const settings: ISettings = {};

export function getSettings(url: string): IVideoSettings {
    let videoSettings = settings[url];
    if (!videoSettings) {
        videoSettings = {
            brightness: 1,
            contrast: 1,
        };
    }

    return videoSettings;
}

export function setSettings(url: string, videoSettings: IVideoSettings) {
    settings[url] = {...settings[url], ...videoSettings};
}