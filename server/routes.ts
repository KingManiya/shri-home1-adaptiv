import express from 'express';
import {getDataCamsFromFile, getEvents} from './helpers/getData';
import uptime from './helpers/uptime';
import {getSettings, setSettings} from './helpers/videoSettings';
import {ICam} from './types/ICam';

export default function registerRoutes(app: express.Application) {

    app.get('/status', (req: express.Request, res: express.Response) => res.send(uptime()));

    app.get('/api/events', parseEvents);
    app.post('/api/events', parseEvents);

    app.get('/api/cams', (req: express.Request, res: express.Response) => {
        getDataCamsFromFile().then(camsData => {
            const cams: ICam[] = camsData.cams;
            cams.forEach(cam => {
                const settings = getSettings(cam.data.video);
                cam.data = {...cam.data, ...settings};
            });
            res.json(cams);
        });
    });

    app.post('/api/cams/settings', (req: express.Request, res: express.Response) => {
        const url: string = req.body.url;
        const settings = req.body.settings;
        setSettings(url, settings);
        res.sendStatus(200);
    });

    app.use((req: express.Request, res: express.Response) => {
        res.status(404).send('<h1>Page not found</h1>');
    });
}

function parseEvents(req: express.Request, res: express.Response) {
    const type: string = req.body.type || req.query.type;
    const offset = +req.body.offset || +req.query.offset || 0;
    const limit = +req.body.limit || +req.query.limit || 0;

    getEvents(type, offset, limit)
        .then(json => res.json(json))
        .catch(error => res.status(error.status).send(error.message));
}