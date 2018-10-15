const express = require('express');
const app = express();
const registerRoutes = require('./routes');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
registerRoutes(app);

const port = process.env.PORT || 8000;
app.listen(port, function () {
    console.log('Listening on Port ' + port);
});