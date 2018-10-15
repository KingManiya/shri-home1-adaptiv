const uptime = require('./helpers/uptime');
const getData = require('./helpers/getData');

function registerRoutes(app) {


    app.get('/status', (req, res) => res.send(uptime()));

    app.get('/api/events', parseEvents);
    app.post('/api/events', parseEvents);

    app.get('/api/cams', (req, res) => {
        getData.getDataCamsFromFile().then(cams => res.json(cams));
    });

    app.use((req, res) => {
        res.status(404).send('<h1>Page not found</h1>');
    })
}

function parseEvents(req, res) {
    const type = req.body.type || req.query.type;
    const offset = +req.body.offset || req.query.offset || 0;
    const limit = +req.body.limit || req.query.limit || 0;

    getData.getEvents(type, offset, limit)
        .then(json => res.json(json))
        .catch(error => res.status(error.status).send(error.message));
}

module.exports = registerRoutes;