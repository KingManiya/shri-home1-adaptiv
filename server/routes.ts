import express from 'express';
import {getDataCamsFromFile, getEvents} from './helpers/getData';
import uptime from './helpers/uptime';

export default function registerRoutes(app: express.Application) {

    app.get('/status', (req: express.Request, res: express.Response) => res.send(uptime()));

    app.get('/api/events', parseEvents);
    app.post('/api/events', parseEvents);

    app.get('/api/cams', (req: express.Request, res: express.Response) => {
        getDataCamsFromFile().then(cams => res.json(cams));
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